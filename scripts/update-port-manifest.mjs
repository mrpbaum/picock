import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { portRoot as root, portGit, sourceGit } from './source-git.mjs';

const destination = resolve(root, 'docs/maintenance/source-port-manifest.json');
const sha = process.argv[2];
if (!/^[0-9a-f]{40}$/.test(sha ?? '')) throw new Error('Pass the exact reviewed source commit SHA.');
sourceGit('cat-file', '-e', `${sha}^{commit}`);
const entries = sourceGit('ls-tree', '-r', sha, '--', 'skills').split('\n').filter(Boolean);
const files = entries.map((line) => {
  const [, , , blob, path] = line.match(/^(\d+) (\w+) ([0-9a-f]+)\t(.+)$/);
  if (!existsSync(resolve(root, path))) throw new Error(`Missing source file: ${path}`);
  const localBlob = portGit('hash-object', path);
  return { path, sourcePath: path, sourceCommit: sha, sourceBlob: blob, kind: localBlob === blob ? 'unchanged' : 'adapted' };
});
const mapped = new Set(files.map((entry) => entry.path));
const tracked = portGit('ls-files', '--cached', '--others', '--exclude-standard', 'skills').split('\n').filter(Boolean);
const extras = tracked.filter((path) => !mapped.has(path)).sort().map((path) => ({
  path,
  kind: /skills\/(?:engineering\/resolving-merge-conflicts|misc\/git-guardrails-pi)\//.test(path) ? 'local-extra' : 'pi-helper',
}));
const manifest = {
  schemaVersion: 2,
  sourceRepository: 'https://github.com/mattpocock/skills',
  sourceCommit: sha,
  sourceSkillCount: files.filter(({ path }) => path.endsWith('/SKILL.md')).length,
  notes: 'Source commits identify incorporated content, not runtime certification. Adapted files differ for Pi; retained local extras are not source parity. Regenerate only after reviewing every mapped source at the supplied SHA.',
  files,
  extras,
};
if (existsSync(destination)) {
  const previous = JSON.parse(readFileSync(destination, 'utf8'));
  if (previous.sourceCommit !== sha && !process.argv.includes('--reviewed')) {
    throw new Error('Changing source provenance requires a completed review and --reviewed; do not stamp unported content.');
  }
}
writeFileSync(destination, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Recorded ${files.length} source files and ${extras.length} extra/helper files at ${sha}.`);
