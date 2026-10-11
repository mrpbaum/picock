#!/usr/bin/env bash
set -euo pipefail

# NOTE: This is a dev-only script, intended for use by maintainers of this repo.
# It is not a supported installer. Modifications to it, or requests for
# modifications, will not be approved.
#
# Links only the source-plugin skills declared in package.json into ~/.agents/skills.
# Repository-only .pi/skills are deliberately outside this tree.
# Each entry is a symlink into this repo, so a `git pull` is all that's needed
# to keep installed skills up to date.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DESTS=("$HOME/.agents/skills")

# Use the package allowlist, not recursive discovery of retained snapshots.
paths="$(node -e 'const p = require(process.argv[1]); for (const path of p.pi.skills) console.log(path)' "$REPO/package.json")"
names=()
srcs=()
while IFS= read -r path; do
  src="$REPO/${path#./}"
  if [ ! -f "$src/SKILL.md" ]; then
    echo "error: missing declared skill $src/SKILL.md" >&2
    exit 1
  fi
  names+=("$(basename "$src")")
  srcs+=("$src")
done <<< "$paths"

for DEST in "${DESTS[@]}"; do
  # If $DEST is a symlink that resolves into this repo, we'd end up writing the
  # per-skill symlinks back into the repo's own skills/ tree. Detect and bail
  # out instead of polluting the working copy.
  if [ -L "$DEST" ]; then
    resolved="$(readlink -f "$DEST")"
    case "$resolved" in
      "$REPO"|"$REPO"/*)
        echo "error: $DEST is a symlink into this repo ($resolved)." >&2
        echo "Remove it (rm \"$DEST\") and re-run; the script will recreate it as a real dir." >&2
        exit 1
        ;;
    esac
  fi

  mkdir -p "$DEST"

  # Remove obsolete links owned by this checkout only. Preserve user directories
  # and links to other repositories, even when their skill names overlap.
  while IFS= read -r -d '' target; do
    resolved="$(readlink -f "$target" || true)"
    case "$resolved" in
      "$REPO/skills/"*)
        keep=false
        for src in "${srcs[@]}"; do
          if [ "$resolved" = "$src" ]; then keep=true; break; fi
        done
        if [ "$keep" = false ]; then
          rm "$target"
          echo "unlinked $(basename "$target") ($DEST)"
        fi
        ;;
    esac
  done < <(find "$DEST" -maxdepth 1 -type l -print0)

  for i in "${!names[@]}"; do
    name="${names[$i]}"
    src="${srcs[$i]}"
    target="$DEST/$name"

    if [ -e "$target" ] && [ ! -L "$target" ]; then
      echo "error: refusing to replace non-symlink $target" >&2
      exit 1
    fi

    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done
done
