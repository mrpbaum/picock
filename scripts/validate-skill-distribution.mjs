import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, realpath, rm, stat, writeFile, mkdir, symlink, lstat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sourceGit } from './source-git.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const provenance = JSON.parse(await readFile(join(root, 'docs/maintenance/source-port-manifest.json'), 'utf8'));
const sourcePlugin = JSON.parse(sourceGit('show', `${provenance.sourceCommit}:.claude-plugin/plugin.json`));
assert.deepEqual(manifest.pi?.skills, sourcePlugin.skills, 'Pi exposure must match the pinned source Claude plugin allowlist.');
const exposed = manifest.pi.skills.map((path) => resolve(root, path));
const exposedNames = exposed.map((path) => path.split('/').at(-1));
assert.ok(manifest.keywords?.includes('pi-package'));
assert.equal(manifest.repository.url, 'https://github.com/mrpbaum/picock');

async function findSkills(directory) {
  const skills = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'node_modules') continue;
    const path = join(directory, entry.name);
    try {
      if ((await stat(join(path, 'SKILL.md'))).isFile()) {
        skills.push(path);
        continue;
      }
    } catch { /* Recurse through non-skill folders. */ }
    skills.push(...await findSkills(path));
  }
  return skills;
}
const distributed = await findSkills(join(root, 'skills'));
const names = distributed.map((path) => path.split('/').at(-1));
assert.equal(new Set(names).size, names.length, 'Skill names must be unique for flat linking.');
assert.equal(new Set(exposedNames).size, exposedNames.length, 'Exposure paths must be unique.');
for (const path of exposed) assert.ok(distributed.includes(path), `${path}: exposed skill is not retained`);
for (const path of await findSkills(join(root, '.pi/skills'))) {
  assert.ok(!names.includes(path.split('/').at(-1)), 'Maintenance skills must remain repository-only.');
}
const home = await mkdtemp(join(tmpdir(), 'picock-distribution-'));
try {
  const run = () => spawnSync('bash', [join(root, 'scripts/link-skills.sh')], { cwd: root, env: { ...process.env, HOME: home }, encoding: 'utf8' });
  const destination = join(home, '.agents/skills');
  await mkdir(destination, { recursive: true });
  // Simulate an old full-tree install; the corrected linker must remove extras.
  for (const path of distributed) await symlink(path, join(destination, path.split('/').at(-1)));
  const result = run();
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.deepEqual((await readdir(destination)).sort(), [...exposedNames].sort());
  for (const name of exposedNames) {
    const target = await realpath(join(destination, name));
    assert.ok(exposed.includes(target), `${name}: linked outside exposure allowlist`);
    assert.ok(!relative(root, target).startsWith('.pi/'));
  }
  // Re-linking is idempotent; unrelated links and real directories survive.
  const outside = join(home, 'unrelated');
  await mkdir(outside);
  await symlink(outside, join(destination, 'git-guardrails-pi'));
  await mkdir(join(destination, 'setup-pre-commit'));
  await writeFile(join(destination, 'setup-pre-commit', 'keep.txt'), 'user data');
  assert.equal(run().status, 0);
  assert.equal((await lstat(join(destination, 'git-guardrails-pi'))).isSymbolicLink(), true);
  assert.equal(await realpath(join(destination, 'git-guardrails-pi')), outside);
  assert.equal(await readFile(join(destination, 'setup-pre-commit', 'keep.txt'), 'utf8'), 'user data');
  await rm(join(destination, exposedNames[0]));
  await mkdir(join(destination, exposedNames[0]));
  await writeFile(join(destination, exposedNames[0], 'keep.txt'), 'user data');
  assert.notEqual(run().status, 0);
  assert.equal(await readFile(join(destination, exposedNames[0], 'keep.txt'), 'utf8'), 'user data');
} finally {
  await rm(home, { recursive: true, force: true });
}
console.log(`Validated ${exposed.length} source-plugin exposures, ${distributed.length} retained skills, and safe linking/migration.`);
