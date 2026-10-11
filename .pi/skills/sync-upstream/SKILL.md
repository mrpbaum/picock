---
name: sync-upstream
description: Update the complete upstream skill port for Pi, preserve adaptations, validate parity, and prepare an origin-only PR when authorised.
disable-model-invocation: true
---

# Sync Upstream

Maintain one corresponding Pi skill for every skill in a pinned `mattpocock/skills` snapshot. Portable copies remain upstream-faithful; adapted copies preserve upstream intent using Pi facilities. The source inventory is `docs/maintenance/upstream-port-manifest.json`.

## Boundaries

- Upstream is read-only. Derive the destination repository from `origin`. Push or create a PR only when explicitly authorised, and only on origin.
- Update files through reviewed ports, never by merging the whole upstream tree. This procedure does not run `git merge` against upstream or require a merge-commit PR strategy.
- Preserve skill names, invocation policy, bundled dependencies, Pi adaptations, and unrelated local work. Report meaningful losses and capability blockers before destructive changes.
- Repository automation is not skill parity. Inspect install/discovery surfaces as evidence without copying unrelated upstream administration.
- Keep maintenance skills under `.pi/skills/`, outside package discovery, public listings, and routing. No SQLite index.

## 1. Pin evidence

1. Require clean working state. Report changes and stop rather than stashing.
2. Read repository instructions, the complete setup skill, the provenance manifest, and `docs/pi-compatibilty.md`.
3. Verify origin and upstream remotes; ask before adding or repairing a remote. Fetch upstream and resolve the requested ref or its discovered default branch to one full SHA. Hold that exact endpoint throughout the run.
4. Read and follow `assess-compatibilty` against the exact endpoint, even on a no-change run. It compares upstream commits only. Failed or inconsistent consolidation blocks the update; never advance its marker manually.
5. Inventory upstream skill additions, removals, renames, and all changed bundled references since the recorded sources. Read relevant history, including reverted changes. Compare each mapped file with the upstream path and source SHA/blob from which it was copied, not with this port as upstream evidence.

**Done:** exact target, valid source provenance, complete skill/dependency delta, and upstream ledger consolidated through that target. If source files and evidence are already current, report the verified no-op.

## 2. Port the delta

1. Create a normal update branch from the reviewed origin base, without merging upstream.
2. For each mapped file, compare its recorded upstream source with the target source and inspect its Pi adaptation separately.
3. Copy portable improvements faithfully. Port changes into adapted files by intent; never overwrite adaptations blindly. Follow unchanged cross-skill and bundled dependencies too.
4. Add a corresponding Pi port for every new upstream skill. A concrete missing Pi capability is a blocker to report, not permission to omit the skill or write a stub.
5. Report upstream removals, renamed commands, disappearing dependencies, and meaningful behavioral losses. Ask before removing important behavior or fork-only extras. A skill becoming portable remains shipped; only its unnecessary adaptation is retired after review.
6. Update per-file provenance and classification, package discovery, bucket listings, promoted docs, router, and checks together. Identify Pi-only helpers separately. Keep the original copy source when a target file has not been reviewed/ported.
7. If assessment changed the ledger/marker pair, include both together. Their inclusion does not certify adaptations in this branch.

**Done:** complete target inventory accounted for, behavior preserved, blockers resolved, and provenance current for every ported file.

## 3. Verify and hand off

1. Run `npm run validate:skills`, relevant runtime tests, the compatibility state checker for the target, and `git diff --check`. Do not require Claude plugin validation.
2. Inspect complete upstream name/invocation parity, reference/dependency closure, Pi discovery with defaults disabled, session commands, context-file selection, and required subagent contracts. Static instruction checks are not runtime certification; disclose what was not exercised.
3. Review the diff against the update branch's recorded base. Record changes per skill, adaptations preserved, removals approved, exact source SHAs, and test evidence.
4. Commit only with authority. If publication is authorised, push the normal branch to origin and open a normal PR there. No upstream push or special merge mode is required.
5. Return branch/commit or PR URL, target/source range, parity counts, blockers, tests, runtime limits, and remaining human gates.

**Done:** a reviewable, validated port update with full provenance and no silent skill omissions. A PR being ready for review is not permission to merge it.
