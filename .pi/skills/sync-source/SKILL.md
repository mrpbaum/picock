---
name: sync-source
description: Refresh the one-to-one Pi skill snapshot, preserve required adaptations, and record source changes and Pi changes together in an enriched Changeset.
disable-model-invocation: true
---

# Refresh the Pi Skill Snapshot

Maintain one Pi port for each skill in a reviewed `mattpocock/skills` snapshot, together with its required references and assets. Portable copies stay faithful; harness-dependent copies preserve source intent with Pi adaptations. This is a file-level snapshot update, not source ancestry tracking or a whole-repository merge.

Read the repository instructions, complete setup skill, `docs/maintenance/source-port-manifest.json`, `docs/maintenance/changesets.md`, and `docs/pi-compatibilty.md`. Resolve these paths from the repository root. Maintenance tools remain under `.pi/skills/`, outside the distributed tree and public router.

## Boundaries

- Picock is an independent repository with only its own `origin` remote, not a Git fork workflow. Read the source URL from the manifest and inspect it in a separate checkout. Never add a source remote here. Derive publication destination from origin; push or open a PR only with explicit authority, never to the source repository.
- The copy boundary is skills and their dependency closure. Repository policy, marketplace metadata, issue forms, unrelated automation, and source's pending release queue are not imported.
- Preserve names, invocation mode, behavior, required assets, Pi adaptations, and user work. Report meaningful losses or capability gaps before destructive action; no silent omissions, stubs, or fallback workflow changes.
- Source SHAs/blobs establish reproducibility, not a requirement to preserve source ancestry. No source merge, SQLite index, or special PR merge mode.

## 1. Pin and inventory

1. Require clean working state; report changes and stop rather than stashing.
2. Verify this repository's origin and the manifest's `sourceRepository` URL, confirming any repair or source change. Resolve the user's requested source ref, or the source repository's default branch, in a separate checkout to one full SHA. Obtain both the prior source and assessment objects there, set `PICOCK_SOURCE_CHECKOUT` to its absolute path for every provenance/assessment command, and hold the target through the run. Do not fetch source branches into picock or add a source remote. Cached local objects are an offline convenience only.
3. Inventory every target `SKILL.md` and all references, scripts, assets, metadata, and cross-skill dependencies needed by those skills. Compare with the manifest's recorded source files, identifying additions, removals, renames, and source-content changes. The source snapshot is the authority for parity, not source's repository scaffolding or every intervening commit.
4. Read and follow `assess-compatibilty` against the same target. It assesses relevant source skill/dependency evidence separately from implementation. A failed or inconsistent assessment blocks the update. Never manually advance its marker.
5. Report a verified no-op only when source coverage, local adaptations, compatibility evidence, and required assets are current. A no-op creates no release record. If only compatibility evidence changes, report that as evidence-only work.

**Done:** pinned target, complete skill/dependency delta, valid provenance, consolidated compatibility evidence, and an explicit update/no-op/evidence-only outcome.

## 2. Port and record

1. Create a normal update branch from the reviewed destination base without merging source.
2. Compare each changed source file with the source SHA/blob recorded in the manifest, then port the change into the local copy. Copy portable improvements faithfully; preserve or retire Pi adaptations by evidence, not blind overwrite.
3. Add corresponding ports and required dependencies for new source skills. Explain approved removals and renames, affected users, and retained extras. A skill becoming portable remains included; a missing Pi capability is a blocker to report.
4. Update per-file provenance/classification, package discovery, bucket listings, promoted docs, router, and tests together. Record only source content actually reviewed and incorporated. Keep Pi-only helpers and approved extras distinct from source parity.
5. Write one enriched `.changeset/<unique-id>.md` record for this completed update, following the release guide. Include:
   - **Provenance:** previous source snapshot and exact reviewed target, with relevant source links.
   - **Source changes:** skill/asset changes actually incorporated, not a source changelog pasted verbatim.
   - **Pi adaptations:** translations made, preserved, or retired, compatibility IDs, and meaningful behavior differences.
   - **Skill coverage:** affected skills/references, additions/removals/renames, dependency closure, parity counts, approved losses, and extras.
   - **Verification:** actual outcomes, runtime versions, assessment changes, and tests not run.
6. Choose this package's bump by user impact, not source's package version. Local-only adaptations keep both source SHAs unchanged. Evidence-only updates say no skill source refresh occurred. Do not queue inherited source notes or consume the real queue by versioning during sync.
7. Include compatibility document/marker changes together with the manifest and their owning release record. Local fixes still do not close source findings.

**Done:** target skill parity and dependency closure, supported adaptations, accurate provenance, and a complete enriched pending release record. Unresolved blockers mean the update is not complete.

## 3. Verify and hand off

1. Run `npm run validate:skills`, `npm run test:maintenance`, relevant runtime tests, the compatibility state checker for the target, and `git diff --check`. Static checks are not model-driven runtime certification. Report unavailable verification explicitly.
2. Inspect the local diff and source skill delta against the enriched record: every meaningful source skill change and Pi adaptation must be accounted for. Verify names, invocation, references, and unsupported capability handling. Check that no removed repository scaffolding or source release queue was reintroduced.
3. Confirm the pending Changeset targets `picock`, has all five sections, and uses the source snapshot pins rather than Pi commits. Do not run `npm run version` except for an explicitly authorised release; test versioning only in disposable fixtures.
4. Commit only with authority. Publish a normal origin-only branch/PR only when asked. No special merge mode or source push.
5. Return target/source pins, coverage counts, branch/commit or PR, enriched record path, assessment changes, checks, runtime limits, approved losses, and remaining human gates.

**Done:** a reviewable snapshot update with complete provenance and enriched release evidence, without whole-repository tracking or silent skill loss.
