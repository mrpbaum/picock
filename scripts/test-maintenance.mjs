import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const fixture = mkdtempSync(resolve(tmpdir(), 'picock-assessment-'));
const sourceCheckout = resolve(fixture, 'source-checkout');
const env = { ...process.env, PICOCK_SOURCE_CHECKOUT: sourceCheckout, GIT_CONFIG_GLOBAL: '/dev/null', GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
try {
  const skill = resolve(fixture, '.pi/skills/assess-compatibilty');
  mkdirSync(resolve(skill, 'scripts'), { recursive: true });
  mkdirSync(resolve(fixture, 'docs'), { recursive: true });
  mkdirSync(resolve(fixture, 'scripts'), { recursive: true });
  mkdirSync(sourceCheckout);
  cpSync(resolve(root, 'scripts/source-git.mjs'), resolve(fixture, 'scripts/source-git.mjs'));
  const checker = resolve(skill, 'scripts/check-state.mjs');
  cpSync(resolve(root, '.pi/skills/assess-compatibilty/scripts/check-state.mjs'), checker);
  const git = (args, input) => execFileSync('git', args, { cwd: sourceCheckout, env, input, encoding: 'utf8' }).trim();
  git(['init', '--quiet']);
  const tree = git(['mktree'], '');
  // Two unrelated source snapshots: snapshot comparison must not need ancestry.
  const baseline = git(['commit-tree', tree], 'baseline\n');
  const target = git(['commit-tree', tree], 'target\n');
  const ledger = (sha) => `| Source commit | \`${sha}\` |\n`;
  const setState = (marker, document) => {
    writeFileSync(resolve(skill, 'last-consolidated.sha'), marker);
    writeFileSync(resolve(fixture, 'docs/pi-compatibilty.md'), document);
  };
  const check = (sha, expected) => {
    const result = spawnSync(process.execPath, [checker, sha], { cwd: fixture, env, encoding: 'utf8' });
    assert.equal(result.status, expected, result.stderr || result.stdout);
  };
  setState(`${baseline}\n`, ledger(baseline));
  check(target, 1);
  setState(`${target}\n`, ledger(target));
  check(target, 0);
  check('main', 2);
  check('f'.repeat(40), 2);
  setState(target, ledger(target));
  check(target, 2);
  setState(`${target}\n`, ledger(target) + ledger(target));
  check(target, 2);
  setState(`${target}\n`, ledger(baseline));
  check(target, 1);
  console.log('Validated separate-checkout assessment without port Git history, unrelated snapshots, stale evidence, marker syntax, missing objects, and unique ledger pins.');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
