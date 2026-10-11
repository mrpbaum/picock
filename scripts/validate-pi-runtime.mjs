// Model-free integration checks against an explicitly selected installed Pi.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const piRoot = process.argv[2] && resolve(process.argv[2]);
if (!piRoot) throw new Error('Pass the installed @earendil-works/pi-coding-agent package root.');
const moduleAt = (path) => import(pathToFileURL(join(piRoot, path)).href);
const { version } = JSON.parse(await readFile(join(piRoot, 'package.json'), 'utf8'));
const { loadSkills, formatSkillsForPrompt } = await moduleAt('dist/core/skills.js');
const { loadProjectContextFiles } = await moduleAt('dist/core/resource-loader.js');
const { loadExtensions } = await moduleAt('dist/core/extensions/loader.js');
const { ExtensionRunner } = await moduleAt('dist/core/extensions/runner.js');
const home = await mkdtemp(join(tmpdir(), 'picock-pi-runtime-'));
try {
  const loaded = loadSkills({ cwd: home, agentDir: home, skillPaths: [join(root, 'skills')], includeDefaults: false });
  assert.deepEqual(loaded.diagnostics, []);
  assert.equal(loaded.skills.length, 40);
  assert.ok(!loaded.skills.some(({ name }) => ['sync-upstream', 'assess-compatibilty'].includes(name)));
  const prompt = formatSkillsForPrompt(loaded.skills);
  assert.ok(!prompt.includes('<name>ask-matt</name>'), 'User-invoked skills must stay out of implicit catalogue');
  assert.ok(prompt.includes('<name>tdd</name>'));
  for (const skill of loaded.skills) {
    assert.equal(prompt.includes(`<name>${skill.name}</name>`), !skill.disableModelInvocation, `${skill.name}: incorrect implicit visibility`);
  }

  const agentDir = join(home, 'agent');
  const cwd = join(home, 'project');
  await mkdir(agentDir);
  await mkdir(cwd);
  const cases = [
    [['CLAUDE.md'], 'CLAUDE.md'],
    [['AGENTS.md'], 'AGENTS.md'],
    [['AGENTS.md', 'CLAUDE.md'], 'AGENTS.md'],
    [['AGENTS.override.md', 'AGENTS.md', 'CLAUDE.md'], 'AGENTS.override.md'],
    [['AGENTS.MD', 'CLAUDE.md'], 'AGENTS.MD'],
    [['CLAUDE.MD'], 'CLAUDE.MD'],
  ];
  for (const [candidates, expected] of cases) {
    for (const candidate of candidates) await writeFile(join(cwd, candidate), candidate);
    const result = loadProjectContextFiles({ cwd, agentDir }).filter(({ path }) => path.startsWith(`${cwd}/`));
    assert.equal(result.length, 1);
    assert.equal(basename(result[0].path), expected);
    for (const candidate of candidates) await rm(join(cwd, candidate));
  }
  assert.equal(loadProjectContextFiles({ cwd, agentDir }).filter(({ path }) => path.startsWith(`${cwd}/`)).length, 0);

  const extensionPath = join(root, 'skills/misc/git-guardrails-claude-code/scripts/block-dangerous-git.ts');
  const extensions = await loadExtensions([extensionPath], cwd);
  assert.deepEqual(extensions.errors, []);
  assert.equal(extensions.extensions.length, 1);
  const runner = new ExtensionRunner(extensions.extensions, extensions.runtime, cwd, undefined, undefined);
  const event = (command) => ({ type: 'tool_call', toolName: 'bash', toolCallId: 'guardrail-test', input: { command } });
  assert.equal((await runner.emitToolCall(event('git push --dry-run'))).block, true);
  assert.equal((await runner.emitToolCall(event('git -C /tmp reset HEAD --hard'))).block, true);
  assert.equal(await runner.emitToolCall(event('git status --short')), undefined);
  console.log(`Pi ${version}: loaded 40 skills without diagnostics, checked invocation visibility, seven context states, and actual extension event-runner interception. No model or git command was executed.`);
} finally {
  await rm(home, { recursive: true, force: true });
}
