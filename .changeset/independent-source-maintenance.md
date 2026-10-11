---
"picock": patch
---

## Provenance

Source baseline: `49dd158d1076134a641b33efb035946536778336`
Source target: `49dd158d1076134a641b33efb035946536778336`

Local-only repository maintenance. Matt Pocock's [skills repository](https://github.com/mattpocock/skills) remains the read-only source collection, with the same reviewed snapshot and per-file source blobs. No new source content or ancestry is incorporated.

## Source changes

None. Preserve source attribution, original names, invocation modes, bundled dependencies, and historical source release prose. Update port-owned terminology and pointers from a fork relationship to an independent source-snapshot workflow.

## Pi adaptations

Remove the old source remote from this checkout; retain only picock's own origin. Rename the repository-only command and guide to `sync-source`, the provenance file to `source-port-manifest.json`, and the release-note archive to `source-release-notes/`. Manifest schema 2 uses `sourceRepository`, `sourceCommit`, `sourceSkillCount`, per-file `sourcePath`, and `local-extra` classifications. Enriched records now use the section title **Source changes**.

Update both maintenance skills to resolve source refs in a separate checkout, never recreate a source remote here, and pass `PICOCK_SOURCE_CHECKOUT` to provenance and assessment commands. Validation and manifest generation can read independent source Git objects; cached objects in picock are only an offline convenience, not an ancestry requirement. Missing source evidence stops with explicit checkout guidance.

Remote configuration is per clone and is not carried by this commit. This change does not rewrite published history or alter GitHub's hosted repository metadata. Repository instructions and validation enforce the origin-only maintenance boundary.

## Skill coverage

Retain all 38 source ports plus `resolving-merge-conflicts` and `git-guardrails-pi`, for 40 distributed skills. Update descriptive terminology in the router, phase guidance, guardrail/handoff ports, beta/misc listings, promoted docs, repository guidance, compatibility ledger, and pending release records without changing distributed names, invocation policies, or workflow behavior.

The renamed maintenance skill remains repository-only and outside package discovery, public skill listings, global linking, and the public router. Users working in this repository now invoke `/skill:sync-source`; `/reload` refreshes discovery after the rename. The compatibility evidence pin and marker are not advanced.

## Verification

`npm run validate:skills` and `npm run test:maintenance` passed. Separate-checkout assessment tests cover unrelated snapshots, stale evidence, malformed markers, missing objects, and duplicate ledger pins. The new source fixture runs actual provenance validation and manifest regeneration in a fresh port repository with no source history or remotes, using a separate source-object store; missing evidence fails rather than creating a remote.

Actual Changesets fixture versioning preserves all three enriched summaries and historical release entries without credentials or consuming the real queue. Pi 1.1.0 model-free checks passed for all 40 distributed skills, both repository-only maintenance skills (including user-invoked `sync-source`), invocation visibility, seven context states, and actual extension-runner interception. The source state checker and whitespace checks passed. These checks do not certify a live source refresh or model-driven delegation. Existing development-tool audit findings remain out of scope.
