# Enriched port changesets

`.changeset/` is the pending release queue for **picock**, not a copy of source's release queue. Each record combines the source skill changes incorporated with the Pi adaptations needed to deliver them. The complete record survives versioning into `CHANGELOG.md` through the local, credential-free changelog adapter.

A source SHA is provenance for a skill snapshot, not a Git fork relationship or a requirement to merge source ancestry or copy its repository infrastructure. The source URL is recorded in the manifest and read in a separate checkout using `PICOCK_SOURCE_CHECKOUT`; picock keeps only its own origin remote. Source coverage lives in `source-port-manifest.json`; compatibility evidence lives in `docs/pi-compatibilty.md`. Keep those boundaries distinct.

## Required record

Create a uniquely named Markdown file in `.changeset/` with standard Changesets frontmatter targeting `picock`, followed by all five sections below. The record must contain concrete findings or an explicit reason for no change, not unfilled placeholders.

```markdown
---
"picock": patch
---

## Provenance

Source baseline: `FULL_PREVIOUS_SOURCE_SHA`
Source target: `FULL_REVIEWED_SOURCE_SHA`

Explain how the target was selected and link the relevant source skill changes.
For a local-only change, both source SHAs stay the same. Use `none` as the
baseline only for the initial Pi port record. Do not substitute a Pi commit
for either source SHA.

## Source changes

Describe changes actually incorporated into skills and their required assets.
If none, say this is a local-only change against the existing source snapshot.
Do not imply that every source repository commit was imported.

## Pi adaptations

Explain the translation, adaptations preserved/retired, and any meaningful
behavior differences. Include relevant compatibility finding IDs. Separate
harness adaptation from intentional local-only behavior.

## Skill coverage

Name affected skills and references, additions/removals/renames, dependency
closure, and retained extras. State parity counts against the target snapshot
when the source inventory changes. Explain approved losses and blockers.

## Verification

Record checks and outcomes, exact runtime versions where relevant, and tests
not executed. Summarise the compatibility assessment without treating a local
fix as resolution of a source finding.
```

The template's uppercase SHA labels are examples, not valid pending records. Use real full lowercase source commit SHAs. `npm run validate:changesets` checks the package, required sections, and source fields; it cannot certify that prose matches the actual diff.

## Bump choice

- **Patch:** compatible skill fixes, documentation, maintenance, or local Pi adaptations.
- **Minor:** newly available skills or capabilities, including the initial full-port distribution.
- **Major:** incompatible invocation/workflow changes or approved removal of supported behavior.

Choose the bump by impact on this package, not by copying source's version number. Package versions and source snapshot pins are independent.

## Sync ownership

Read and follow `sync-source` for every source update. Its coordinator owns the enriched record after port review and compatibility assessment. A verified no-op creates no changeset. Assessment-only changes record their evidence effect without claiming a skill source update.

Before handoff, review the record against the local branch diff and the source skill-file delta. Include compatibility document/marker edits, source manifest edits, and their corresponding release record in the same reviewed update. Unresolved capability blockers keep the update incomplete; release prose is not a substitute for parity.

## Versioning

After review and authorisation:

```bash
npm ci --ignore-scripts
npm run validate:skills
npm run test:maintenance
npm run version
```

Versioning consumes pending records, advances the package version, and appends enriched release entries to `CHANGELOG.md`. It does not publish, push, fetch source, or update Claude plugin metadata. Inspect the package/lockfile and changelog changes before committing the release. Keep the development lockfile synchronised with the new package version using `npm install --package-lock-only --ignore-scripts` if required.

Do not version during ordinary sync implementation. Validate and leave the pending records for release review. The adapter and version pipeline are tested in disposable fixtures, not by consuming the real queue.

## Historical source notes

The 16 inherited pending source notes were moved to `docs/maintenance/source-release-notes/`. They remain historical source material under their original package name and must not be consumed as new Pi releases or treated as proof that a change was ported. The existing source changelog is historical; new entries describe this package explicitly.
