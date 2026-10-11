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
const { DefaultPackageManager } = await moduleAt('dist/core/package-manager.js');
const { SettingsManager } = await moduleAt('dist/core/settings-manager.js');
const packageManifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const home = await mkdtemp(join(tmpdir(), 'picock-pi-runtime-'));
try {
  const manager = new DefaultPackageManager({ cwd: home, agentDir: home, settingsManager: SettingsManager.inMemory() });
  const resources = await manager.resolveExtensionSources([root], { temporary: true });
  const paths = resources.skills.filter(({ enabled }) => enabled).map(({ path }) => path);
  const loaded = loadSkills({ cwd: home, agentDir: home, skillPaths: paths, includeDefaults: false });
  assert.deepEqual(loaded.diagnostics, []);
  assert.equal(loaded.skills.length, 27);
  assert.deepEqual(loaded.skills.map(({ name }) => name).sort(), packageManifest.pi.skills.map((path) => basename(path)).sort());
  const retained = loadSkills({ cwd: home, agentDir: home, skillPaths: [join(root, 'skills')], includeDefaults: false });
  assert.deepEqual(retained.diagnostics, []);
  assert.equal(retained.skills.length, 40);
  assert.equal(loaded.skills.filter(({ disableModelInvocation }) => !disableModelInvocation).length, 11);
  assert.ok(!loaded.skills.some(({ name }) => ['sync-source', 'assess-compatibilty'].includes(name)));
  const maintenance = loadSkills({ cwd: home, agentDir: home, skillPaths: [join(root, '.pi/skills')], includeDefaults: false });
  assert.deepEqual(maintenance.diagnostics, []);
  assert.deepEqual(maintenance.skills.map(({ name }) => name).sort(), ['assess-compatibilty', 'sync-source']);
  assert.equal(maintenance.skills.find(({ name }) => name === 'sync-source').disableModelInvocation, true);
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
  console.log(`Pi ${version}: package exposes 27 skills (11 automatic), retains 40 without diagnostics, checked invocation visibility, seven context states, and actual extension event-runner interception. No model or git command was executed.`);
} finally {
  await rm(home, { recursive: true, force: true });
}
