import assert from 'node:assert/strict';
import { existsSync, lstatSync, readFileSync, readlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8');
for (const path of ['.agents', '.claude-plugin', '.github', '.out-of-scope', 'scripts/sync-plugin-version.mjs']) {
  assert.ok(!existsSync(resolve(root, path)), `${path}: removed repository scaffolding was reintroduced`);
}
assert.ok(lstatSync(resolve(root, 'AGENTS.md')).isFile(), 'AGENTS.md must be the canonical regular file');
assert.ok(lstatSync(resolve(root, 'CLAUDE.md')).isSymbolicLink(), 'CLAUDE.md must be a compatibility symlink');
assert.equal(readlinkSync(resolve(root, 'CLAUDE.md')), 'AGENTS.md');
for (const path of ['AGENTS.md', 'docs/maintenance/handoff-extract-adapted-skills.md', 'docs/maintenance/pi-port.md', 'docs/maintenance/sync-upstream.md']) {
  assert.doesNotMatch(read(path), /\.agents\/(?:invocation|writing-docs|install-block)\.md/, `${path}: stale maintenance pointer`);
}
for (const path of ['docs/maintenance/invocation.md', 'docs/maintenance/writing-docs.md', 'docs/maintenance/changesets.md']) {
  assert.ok(existsSync(resolve(root, path)), `Missing maintenance guide ${path}`);
}
const sync = read('.pi/skills/sync-upstream/SKILL.md');
for (const section of ['Provenance', 'Upstream changes', 'Pi adaptations', 'Skill coverage', 'Verification']) {
  assert.ok(sync.includes(`**${section}:**`), `sync must own the enriched ${section} section`);
}
assert.ok(sync.includes('docs/maintenance/changesets.md'));
assert.ok(read('.pi/skills/assess-compatibilty/SKILL.md').includes('the sync coordinator owns port implementation and the enriched Changeset'));
const packageJson = JSON.parse(read('package.json'));
assert.ok(!packageJson.devDependencies['@changesets/changelog-github']);
assert.equal(JSON.parse(read('.changeset/config.json')).changelog, './changelog.cjs');
assert.ok(packageJson.scripts.version.includes('validate:skills'));
// Repository issue forms must never become a prerequisite for the bundled flows.
for (const skill of ['wayfinder', 'triage', 'to-spec', 'to-tickets', 'setup-matt-pocock-skills']) {
  assert.doesNotMatch(read(`skills/engineering/${skill}/SKILL.md`), /\.github\/ISSUE_TEMPLATE|--template\b/, `${skill}: depends on removed issue forms`);
}
const tracker = read('skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md');
assert.ok(tracker.includes('## Wayfinding operations'));
for (const operation of ['**Map**', '**Child ticket**', '**Blocking**', '**Frontier query**']) assert.ok(tracker.includes(operation));
assert.ok(read('skills/engineering/triage/SKILL.md').includes('.out-of-scope/'));
console.log('Validated snapshot maintenance, enriched-release ownership, and bundled tracker independence.');
