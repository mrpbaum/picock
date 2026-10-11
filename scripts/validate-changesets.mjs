import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const sections = ['Provenance', 'Source changes', 'Pi adaptations', 'Skill coverage', 'Verification'];

export function validateRecord(text, name) {
  const match = text.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]+)$/);
  assert.ok(match, `${name}: missing Changesets frontmatter/body`);
  assert.match(match[1].trim(), /^"?picock"?: (patch|minor|major)$/, `${name}: target only picock with one valid bump`);
  const body = match[2];
  const headings = [...body.matchAll(/^## (.+)$/gm)];
  assert.deepEqual(headings.map((item) => item[1]), sections, `${name}: use the five enriched sections in order`);
  for (let index = 0; index < headings.length; index++) {
    const start = headings[index].index + headings[index][0].length;
    const end = headings[index + 1]?.index ?? body.length;
    assert.ok(body.slice(start, end).trim().length > 0, `${name}: empty ${sections[index]}`);
  }
  assert.doesNotMatch(body, /FULL_(?:PREVIOUS|REVIEWED)_SOURCE_SHA|\b(?:TODO|TBD)\b/, `${name}: unfilled template`);
  assert.match(body, /^Source baseline: `(?:[0-9a-f]{40}|none)`$/m, `${name}: invalid source baseline`);
  assert.match(body, /^Source target: `[0-9a-f]{40}`$/m, `${name}: invalid source target`);
  return body;
}

export function validateQueue(root) {
  const directory = resolve(root, '.changeset');
  const files = readdirSync(directory).filter((name) => name.endsWith('.md') && name !== 'README.md');
  for (const name of files) validateRecord(readFileSync(resolve(directory, name), 'utf8'), name);
  return files;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const files = validateQueue(root);
  console.log(`Validated ${files.length} enriched picock release records.`);
}
