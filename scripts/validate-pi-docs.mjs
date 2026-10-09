import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
// A remediation branch can exclude a file owned by another open remediation.
// Run without exclusions on the integrated gate candidate.
const excluded = new Set(process.argv.slice(2));
const read = (path) => readFile(resolve(root, path), 'utf8');
const top = await read('README.md');
let checked = 0;
for (const bucket of ['engineering', 'productivity']) {
  const index = await read(`skills/${bucket}/README.md`);
  for (const entry of await readdir(resolve(root, 'skills', bucket), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const skill = await read(`skills/${bucket}/${name}/SKILL.md`);
    assert.ok(top.includes(`./skills/${bucket}/${name}/SKILL.md`), `${name}: top-level link missing`);
    assert.ok(index.includes(`./${name}/SKILL.md`), `${name}: bucket link missing`);
    const docs = await read(`docs/${bucket}/${name}.md`);
    if (!excluded.has(name)) {
      assert.ok(docs.includes(`/skill:${name}`), `${name}: Pi invocation missing`);
      for (const section of ['What it does', 'When to reach for it', 'Common questions', "It's working if"]) {
        assert.ok(docs.includes(`## ${section}`), `${name}: ${section} section missing`);
      }
      assert.ok(!skill.includes('Skill tool'), `${name}: literal Claude Skill tool requirement`);
      checked++;
    }
    if (skill.includes('disable-model-invocation: true')) {
      const metadata = await read(`skills/${bucket}/${name}/agents/openai.yaml`);
      assert.match(metadata, /allow_implicit_invocation:\s*false/, `${name}: invocation policy mismatch`);
    }
  }
}
for (const bucket of ['misc', 'in-progress', 'deprecated', 'personal']) {
  assert.ok(!top.includes(`./skills/${bucket}/`), `${bucket}: excluded bucket promoted in README`);
}
console.log(`Validated Pi docs and wiring for ${checked} promoted skills${excluded.size ? ` (excluded: ${[...excluded].join(', ')})` : ''}.`);
