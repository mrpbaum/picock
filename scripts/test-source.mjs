import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { portRoot as root, sourceRoot } from './source-git.mjs';

const temporary = mkdtempSync(resolve(tmpdir(), 'picock-source-'));
const fixture = resolve(temporary, 'port');
const store = resolve(temporary, 'source-objects');
const manifestPath = 'docs/maintenance/source-port-manifest.json';
const manifest = JSON.parse(readFileSync(resolve(root, manifestPath), 'utf8'));
const assessment = readFileSync(resolve(root, '.pi/skills/assess-compatibilty/last-consolidated.sha'), 'utf8').trim();
const env = { ...process.env, PICOCK_SOURCE_CHECKOUT: store, GIT_CONFIG_GLOBAL: '/dev/null' };
try {
  // Export working files, not a clone: the port fixture has no inherited history.
  const paths = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).trim().split('\n');
  for (const path of paths) {
    const destination = resolve(fixture, path);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(resolve(root, path), destination, { verbatimSymlinks: true });
  }
  execFileSync('git', ['init', '--quiet'], { cwd: fixture, env });
  execFileSync('git', ['init', '--bare', '--quiet', store], { env });
  for (const sha of new Set([manifest.sourceCommit, assessment])) {
    execFileSync('git', ['-C', store, 'fetch', '--quiet', '--no-tags', sourceRoot, sha], { env });
    assert.notEqual(spawnSync('git', ['cat-file', '-e', `${sha}^{commit}`], { cwd: fixture, env }).status, 0, 'Port fixture accidentally contains source history');
  }
  const run = (script, ...args) => execFileSync(process.execPath, [resolve(fixture, script), ...args], { cwd: fixture, env, stdio: 'pipe' });
  run('scripts/validate-port.mjs');
  run('scripts/validate-maintenance.mjs');
  run('scripts/update-port-manifest.mjs', manifest.sourceCommit);
  assert.deepEqual(JSON.parse(readFileSync(resolve(fixture, manifestPath), 'utf8')), manifest, 'Independent source lookup changed provenance');
  const missing = spawnSync(process.execPath, [resolve(fixture, 'scripts/validate-port.mjs')], { cwd: fixture, env: { ...env, PICOCK_SOURCE_CHECKOUT: '' }, encoding: 'utf8' });
  assert.notEqual(missing.status, 0, 'Missing source evidence must fail');
  assert.match(missing.stderr, /Set PICOCK_SOURCE_CHECKOUT/);
  assert.equal(execFileSync('git', ['remote'], { cwd: fixture, env, encoding: 'utf8' }).trim(), '', 'Checks added a source remote');
  console.log('Validated provenance and manifest regeneration in a fresh port without source history/remotes, using a separate object store; missing evidence stops with checkout guidance.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
