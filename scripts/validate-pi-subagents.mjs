import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const read = (path) => readFileSync(path, 'utf8');
const contract = 'skills/engineering/PI-SUBAGENTS.md';
assert.match(read(contract), /requires \*\*`@tintinweb\/pi-subagents`\*\*/);
assert.match(read(contract), /sole supported Pi backend/);
assert.match(read(contract), /stop the affected workflow/);
assert.match(read('README.md'), /required subagent backend/);
const files = [
  'skills/engineering/ask-matt/SKILL.md',
  'skills/engineering/code-review/SKILL.md',
  'skills/engineering/codebase-design/SKILL.md',
  'skills/engineering/codebase-design/DESIGN-IT-TWICE.md',
  'skills/engineering/implement-spec/SKILL.md',
  'skills/engineering/improve-codebase-architecture/SKILL.md',
  'skills/engineering/research/SKILL.md',
  'skills/engineering/wayfinder/SKILL.md',
  'skills/productivity/grilling/SKILL.md',
];
for (const path of files) {
  const text = read(path);
  const pointer = text.match(/\]\(([^)]+PI-SUBAGENTS\.md)\)/);
  assert.ok(pointer, `${path}: missing backend contract`);
  assert.ok(existsSync(resolve(dirname(path), pointer[1])), `${path}: broken contract link`);
  assert.doesNotMatch(text, /degraded sequential|run the passes sequentially|perform the same scan directly|for this run, perform the research in the current session/, `${path}: old fallback`);
}
console.log(`Validated required Pi subagent policy and contract links in ${files.length} references.`);
