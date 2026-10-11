import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, realpath, rm, stat, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
assert.deepEqual(manifest.pi?.skills, ['./skills'], 'Distribute the complete port, not a promoted-only filter.');
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
for (const path of await findSkills(join(root, '.pi/skills'))) {
  assert.ok(!names.includes(path.split('/').at(-1)), 'Maintenance skills must remain repository-only.');
}
const home = await mkdtemp(join(tmpdir(), 'picock-distribution-'));
try {
  const run = () => spawnSync('bash', [join(root, 'scripts/link-skills.sh')], { cwd: root, env: { ...process.env, HOME: home }, encoding: 'utf8' });
  const result = run();
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const destination = join(home, '.agents/skills');
  assert.deepEqual((await readdir(destination)).sort(), [...names].sort());
  for (const name of names) {
    const target = await realpath(join(destination, name));
    assert.ok(distributed.includes(target), `${name}: linked outside distribution`);
    assert.ok(!relative(root, target).startsWith('.pi/'));
  }
  // Re-linking is idempotent, and real user directories must not be deleted.
  assert.equal(run().status, 0);
  await rm(join(destination, names[0]));
  await mkdir(join(destination, names[0]));
  await writeFile(join(destination, names[0], 'keep.txt'), 'user data');
  assert.notEqual(run().status, 0);
  assert.equal(await readFile(join(destination, names[0], 'keep.txt'), 'utf8'), 'user data');
} finally {
  await rm(home, { recursive: true, force: true });
}
console.log(`Validated complete distribution and safe linking of ${distributed.length} skills.`);
