import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const manifest = JSON.parse(read('docs/maintenance/upstream-port-manifest.json'));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const tree = git('ls-tree', '-r', manifest.upstreamCommit, '--', 'skills');
const upstream = new Map(tree.split('\n').filter(Boolean).map((line) => {
  const [, blob, path] = line.match(/^\d+ blob ([0-9a-f]+)\t(.+)$/);
  return [path, blob];
}));
const mapped = new Map(manifest.files.map((entry) => [entry.path, entry]));
assert.equal(mapped.size, manifest.files.length, 'Duplicate provenance paths');
assert.deepEqual([...mapped.keys()].sort(), [...upstream.keys()].sort(), 'Every upstream skill file needs provenance');
for (const entry of manifest.files) {
  assert.ok(existsSync(resolve(root, entry.path)), `Missing ${entry.path}`);
  assert.equal(entry.upstreamPath, entry.path, 'Preserve source paths in the initial port');
  assert.equal(entry.sourceCommit, manifest.upstreamCommit);
  assert.equal(entry.sourceBlob, upstream.get(entry.upstreamPath));
  const same = git('hash-object', entry.path) === entry.sourceBlob;
  assert.equal(entry.kind, same ? 'unchanged' : 'adapted', `${entry.path}: stale adaptation classification`);
  if (entry.path.endsWith('/SKILL.md')) {
    const source = execFileSync('git', ['show', `${entry.sourceCommit}:${entry.upstreamPath}`], { cwd: root, encoding: 'utf8' });
    const text = read(entry.path);
    assert.equal(text.match(/^name: (.+)$/m)?.[1], source.match(/^name: (.+)$/m)?.[1], `${entry.path}: upstream name changed`);
    assert.equal(text.includes('disable-model-invocation: true'), source.includes('disable-model-invocation: true'), `${entry.path}: invocation policy changed`);
  }
}
const skillPaths = [...upstream.keys()].filter((path) => path.endsWith('/SKILL.md'));
assert.equal(skillPaths.length, manifest.upstreamSkillCount);
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
for (const path of [...skillPaths, ...manifest.extras.filter(({ kind, path }) => kind === 'fork-only-extra' && path.endsWith('/SKILL.md')).map(({ path }) => path)]) {
  const name = read(path).match(/^name: (.+)$/m)[1];
  assert.ok(router.includes(`/skill:${name}`) || router.includes(`\`${name}\``), `${name}: missing router coverage`);
}
for (const path of ['skills/engineering/setup-matt-pocock-skills/SKILL.md', 'skills/in-progress/setup-ts-deep-modules/SKILL.md']) {
  assert.ok(read(path).includes('`AGENTS.override.md`, `AGENTS.md`, `AGENTS.MD`, `CLAUDE.md`, `CLAUDE.MD`'), `${path}: wrong context candidate order`);
}
assert.equal(read('skills/engineering/diagnosing-bugs/SKILL.md'), execFileSync('git', ['show', `${manifest.upstreamCommit}:skills/engineering/diagnosing-bugs/SKILL.md`], { cwd: root, encoding: 'utf8' }), 'Restore upstream debugging and secret-redaction behavior');
assert.doesNotMatch(read('.pi/skills/sync-upstream/SKILL.md'), /--no-ff|Create a merge commit/);
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
console.log(`Validated ${skillPaths.length} upstream ports, provenance, references, router coverage, and guardrail handler cases.`);
