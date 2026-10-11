import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { portRoot as root, portGit, sourceGit } from './source-git.mjs';
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const manifest = JSON.parse(read('docs/maintenance/source-port-manifest.json'));
assert.equal(manifest.schemaVersion, 2);
const tree = sourceGit('ls-tree', '-r', manifest.sourceCommit, '--', 'skills');
const source = new Map(tree.split('\n').filter(Boolean).map((line) => {
  const [, blob, path] = line.match(/^\d+ blob ([0-9a-f]+)\t(.+)$/);
  return [path, blob];
}));
const mapped = new Map(manifest.files.map((entry) => [entry.path, entry]));
assert.equal(mapped.size, manifest.files.length, 'Duplicate provenance paths');
assert.deepEqual([...mapped.keys()].sort(), [...source.keys()].sort(), 'Every source skill file needs provenance');
for (const entry of manifest.files) {
  assert.ok(existsSync(resolve(root, entry.path)), `Missing ${entry.path}`);
  assert.equal(entry.sourcePath, entry.path, 'Preserve source paths in the initial port');
  assert.equal(entry.sourceCommit, manifest.sourceCommit);
  assert.equal(entry.sourceBlob, source.get(entry.sourcePath));
  const same = portGit('hash-object', entry.path) === entry.sourceBlob;
  assert.equal(entry.kind, same ? 'unchanged' : 'adapted', `${entry.path}: stale adaptation classification`);
  if (entry.path.endsWith('/SKILL.md')) {
    const source = sourceGit('show', `${entry.sourceCommit}:${entry.sourcePath}`);
    const text = read(entry.path);
    assert.equal(text.match(/^name: (.+)$/m)?.[1], source.match(/^name: (.+)$/m)?.[1], `${entry.path}: source name changed`);
    assert.equal(text.includes('disable-model-invocation: true'), source.includes('disable-model-invocation: true'), `${entry.path}: invocation policy changed`);
  }
}
const skillPaths = [...source.keys()].filter((path) => path.endsWith('/SKILL.md'));
assert.equal(skillPaths.length, manifest.sourceSkillCount);
const extraPaths = new Set(manifest.extras.map(({ path }) => path));
assert.equal(extraPaths.size, manifest.extras.length);
function inventory(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? inventory(path) : [path];
  });
}
for (const absolute of inventory(resolve(root, 'skills'))) {
  const path = absolute.slice(root.length);
  assert.ok(mapped.has(path) || extraPaths.has(path), `${path}: unrecorded file`);
  if (!absolute.endsWith('.md')) continue;
  const text = readFileSync(absolute, 'utf8');
  assert.doesNotMatch(text, /Skill tool|\/clear\b|claude --bg|PreToolUse/, `${path}: Claude-only instructions`);
  for (const match of text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
    assert.ok(existsSync(resolve(dirname(absolute), target)), `${path}: broken bundled link ${target}`);
  }
}
const router = read('skills/engineering/ask-matt/SKILL.md');
for (const path of [...skillPaths, ...manifest.extras.filter(({ kind, path }) => kind === 'local-extra' && path.endsWith('/SKILL.md')).map(({ path }) => path)]) {
  const name = read(path).match(/^name: (.+)$/m)[1];
  assert.ok(router.includes(`/skill:${name}`) || router.includes(`\`${name}\``), `${name}: missing router coverage`);
}
for (const path of ['skills/engineering/setup-matt-pocock-skills/SKILL.md', 'skills/in-progress/setup-ts-deep-modules/SKILL.md']) {
  assert.ok(read(path).includes('`AGENTS.override.md`, `AGENTS.md`, `AGENTS.MD`, `CLAUDE.md`, `CLAUDE.MD`'), `${path}: wrong context candidate order`);
}
assert.equal(read('skills/engineering/diagnosing-bugs/SKILL.md'), sourceGit('show', `${manifest.sourceCommit}:skills/engineering/diagnosing-bugs/SKILL.md`), 'Restore source debugging and secret-redaction behavior');
assert.doesNotMatch(read('.pi/skills/sync-source/SKILL.md'), /--no-ff|Create a merge commit/);
// Assessment provenance is independent of the skill snapshot actually ported.
const assessmentPin = read('.pi/skills/assess-compatibilty/last-consolidated.sha').trim();
execFileSync(process.execPath, [resolve(root, '.pi/skills/assess-compatibilty/scripts/check-state.mjs'), assessmentPin], { cwd: root, encoding: 'utf8' });

// Exercise the actual shipped extension factory and registered handler without a model.
const extension = read('skills/misc/git-guardrails-claude-code/scripts/block-dangerous-git.ts');
const { default: install, blockedGitCommand } = await import(`data:text/javascript;base64,${Buffer.from(extension).toString('base64')}`);
let handler;
install({ on: (event, callback) => { assert.equal(event, 'tool_call'); handler = callback; } });
for (const command of [
  'git push origin main', '  git push --dry-run', 'git -C /tmp push',
  'git -c advice.pushUpdateRejected=false push', 'git --git-dir=/tmp/x push',
  'git reset HEAD --hard', 'git clean -df', 'git clean --force',
  'git branch -D old', 'git branch --delete --force old',
  'git checkout -- .', 'git restore --worktree .', 'echo ok && git push',
]) {
  assert.ok(blockedGitCommand(command), `missed ${command}`);
  assert.equal((await handler({ toolName: 'bash', input: { command } })).block, true, `not intercepted: ${command}`);
}
for (const command of ['git status --short', 'git diff', 'git branch -d merged', 'git clean -n', 'git restore one.txt', 'echo "git push"']) {
  assert.equal(blockedGitCommand(command), undefined, `safe command blocked: ${command}`);
  assert.equal(await handler({ toolName: 'bash', input: { command } }), undefined);
}
assert.equal(await handler({ toolName: 'read', input: { command: 'git push' } }), undefined);
console.log(`Validated ${skillPaths.length} source ports, provenance, references, router coverage, and guardrail handler cases.`);
