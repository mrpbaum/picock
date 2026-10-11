import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateQueue, validateRecord, sections } from './validate-changesets.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const names = validateQueue(root);
const originals = new Map(names.map((name) => [name, read(`.changeset/${name}`)]));
const source = JSON.parse(read('docs/maintenance/upstream-port-manifest.json')).upstreamCommit;
const synthetic = `---\n"picock": patch\n---\n\n## Provenance\n\nSource baseline: \`${source}\`\nSource target: \`${source}\`\n\n## Upstream changes\n\nNone, local-only fixture.\n\n## Pi adaptations\n\nExercise release rendering.\n\n## Skill coverage\n\nNo skill changes.\n\n## Verification\n\nDisposable release fixture, not a runtime certification.\n`;
const records = originals.size ? originals : new Map([['test-port.md', synthetic]]);
const sample = records.values().next().value;
validateRecord(sample, 'valid');
for (const [label, invalid] of [
  ['legacy package', sample.replace('"picock":', '"mattpocock-skills":')],
  ['invalid bump', sample.replace(/: (minor|patch|major)\n/, ': banana\n')],
  ['missing section', sample.replace('## Pi adaptations', '## Other')],
  ['invalid pin', sample.replace(/^Source target: .+$/m, 'Source target: `main`')],
  ['placeholder', `${sample}\nTODO\n`],
  ['empty verification', sample.replace(/## Verification[\s\S]*$/, '## Verification\n')],
]) assert.throws(() => validateRecord(invalid, label), label);

const temporary = mkdtempSync(resolve(tmpdir(), 'picock-changesets-'));
const env = { ...process.env, GITHUB_TOKEN: '', GH_TOKEN: '', PI_GITHUB_PAT: '', GIT_CONFIG_GLOBAL: '/dev/null' };
try {
  const fixture = resolve(temporary, 'release');
  cpSync(resolve(root, '.changeset'), resolve(fixture, '.changeset'), { recursive: true });
  for (const [name, text] of records) writeFileSync(resolve(fixture, '.changeset', name), text);
  const previousChangelog = read('CHANGELOG.md');
  writeFileSync(resolve(fixture, 'CHANGELOG.md'), previousChangelog);
  const pkg = JSON.parse(read('package.json'));
  writeFileSync(resolve(fixture, 'package.json'), JSON.stringify({ name: pkg.name, version: pkg.version, private: true }, null, 2));
  execFileSync('git', ['init', '--quiet', '-b', 'main'], { cwd: fixture, env });
  const cli = resolve(root, 'node_modules/@changesets/cli/bin.js');
  assert.ok(existsSync(cli), 'Run npm ci --ignore-scripts before test:changesets');
  execFileSync(process.execPath, [cli, 'version'], { cwd: fixture, env, stdio: 'pipe' });
  const expectedBump = [...records.values()].some((text) => /"picock": major/.test(text)) ? 'major'
    : [...records.values()].some((text) => /"picock": minor/.test(text)) ? 'minor' : 'patch';
  const [major, minor, patch] = pkg.version.split('.').map(Number);
  const expectedVersion = expectedBump === 'major' ? `${major + 1}.0.0`
    : expectedBump === 'minor' ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
  assert.equal(JSON.parse(readFileSync(resolve(fixture, 'package.json'), 'utf8')).version, expectedVersion);
  const changelog = readFileSync(resolve(fixture, 'CHANGELOG.md'), 'utf8');
  for (const [name, text] of records) {
    const summary = validateRecord(text, name).trim().replace(/^## /gm, '##### ');
    assert.ok(changelog.includes(`#### Port record: ${name.slice(0, -3)}`), `${name}: missing release attribution`);
    assert.ok(changelog.includes(summary), `${name}: enriched summary was flattened or lost`);
  }
  for (const section of sections) assert.ok(changelog.includes(`##### ${section}`));
  assert.ok(changelog.endsWith(previousChangelog.slice(previousChangelog.indexOf('\n') + 1)), 'Versioning rewrote historical release entries');
  assert.equal(validateQueue(fixture).length, 0, 'Versioning must consume fixture records');
  execFileSync(process.execPath, [cli, 'version'], { cwd: fixture, env, stdio: 'pipe' });
  assert.equal(readFileSync(resolve(fixture, 'CHANGELOG.md'), 'utf8'), changelog, 'No-op release rewrote the changelog');
  assert.equal(JSON.parse(readFileSync(resolve(fixture, 'package.json'), 'utf8')).version, expectedVersion);
  console.log(`Validated negative cases and actual Changesets release ${pkg.version} -> ${expectedVersion}, with complete enriched summaries and no credentials.`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
assert.deepEqual(readdirSync(resolve(root, '.changeset')).filter((name) => name.endsWith('.md') && name !== 'README.md').sort(), [...originals.keys()].sort());
for (const [name, text] of originals) assert.equal(read(`.changeset/${name}`), text, 'The real release queue was mutated');
