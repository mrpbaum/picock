import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const destination = resolve(root, 'docs/maintenance/upstream-port-manifest.json');
const sha = process.argv[2];
if (!/^[0-9a-f]{40}$/.test(sha ?? '')) throw new Error('Pass the exact reviewed upstream commit SHA.');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
git('cat-file', '-e', `${sha}^{commit}`);
const entries = git('ls-tree', '-r', sha, '--', 'skills').split('\n').filter(Boolean);
const files = entries.map((line) => {
  const [, , , blob, path] = line.match(/^(\d+) (\w+) ([0-9a-f]+)\t(.+)$/);
  if (!existsSync(resolve(root, path))) throw new Error(`Missing upstream file: ${path}`);
  const localBlob = git('hash-object', path);
  return { path, upstreamPath: path, sourceCommit: sha, sourceBlob: blob, kind: localBlob === blob ? 'unchanged' : 'adapted' };
});
const mapped = new Set(files.map((entry) => entry.path));
const tracked = git('ls-files', '--cached', '--others', '--exclude-standard', 'skills').split('\n').filter(Boolean);
const extras = tracked.filter((path) => !mapped.has(path)).sort().map((path) => ({
  path,
  kind: /skills\/(?:engineering\/resolving-merge-conflicts|misc\/git-guardrails-pi)\//.test(path) ? 'fork-only-extra' : 'pi-helper',
}));
const manifest = {
  schemaVersion: 1,
  upstreamRepository: 'https://github.com/mattpocock/skills',
  upstreamCommit: sha,
  upstreamSkillCount: files.filter(({ path }) => path.endsWith('/SKILL.md')).length,
  notes: 'Source commits identify incorporated upstream content, not runtime certification. Adapted files differ for Pi; retained extras are not upstream parity. Regenerate only after reviewing every mapped source at the supplied SHA.',
  files,
  extras,
};
if (existsSync(destination)) {
  const previous = JSON.parse(readFileSync(destination, 'utf8'));
  if (previous.upstreamCommit !== sha && !process.argv.includes('--reviewed')) {
    throw new Error('Changing source provenance requires a completed review and --reviewed; do not stamp unported content.');
  }
}
writeFileSync(destination, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Recorded ${files.length} upstream files and ${extras.length} extra/helper files at ${sha}.`);
