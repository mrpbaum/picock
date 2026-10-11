import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const portRoot = fileURLToPath(new URL('..', import.meta.url));
// An independent checkout is preferred. Cached objects in the port are an
// offline convenience, not a remote, ancestry, or merge requirement.
export const sourceRoot = resolve(portRoot, process.env.PICOCK_SOURCE_CHECKOUT || '.');

export function sourceGit(...args) {
  try {
    return execFileSync('git', args, { cwd: sourceRoot, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (error) {
    throw new Error(`Source evidence unavailable in ${sourceRoot}. Set PICOCK_SOURCE_CHECKOUT to a separate checkout of the manifest's source repository containing the required commit. No source remote is needed in picock. ${error.stderr?.toString().trim() || error.message}`, { cause: error });
  }
}

export function portGit(...args) {
  return execFileSync('git', args, { cwd: portRoot, encoding: 'utf8' }).trim();
}
