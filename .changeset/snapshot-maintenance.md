---
"picock": patch
---

## Provenance

Source baseline: `49dd158d1076134a641b33efb035946536778336`
Source target: `49dd158d1076134a641b33efb035946536778336`

Local-only maintenance cleanup against the existing source snapshot. No source refresh, ancestry merge, or compatibility-baseline advance is included.

## Source changes

None. Keep the source skills and bundled assets unchanged. Archive inherited pending source notes so they remain available as context without entering this package's release queue.

## Pi adaptations

Make `AGENTS.md` the canonical regular repository instruction file, preserving its content and reversing `CLAUDE.md` into a compatibility symlink. Validate this arrangement to prevent accidental regression.

Move useful repository invocation, documentation, and setup-pointer guidance into `docs/maintenance/`. Remove obsolete Claude installation/marketplace scaffolding, the plugin-version synchroniser, repository-specific GitHub issue forms, and inherited rejection policy records.

Use enriched Changesets to preserve source context, Pi adaptations, skill coverage, source provenance, and verification together in release notes. Versioning uses a local credential-free adapter rather than the GitHub changelog adapter. Rewrite repository maintenance around skill snapshot parity and required dependency closure, not source ancestry or administrative-file tracking.

## Skill coverage

No distributed skills or bundled templates are removed or changed: 38 source ports plus two retained extras remain. Wayfinder, triage, specs, and tickets use bundled body formats and tracker instructions, not this repository's GitHub issue forms. Target projects can still create their own `.out-of-scope/` records through the unchanged triage skill.

Both `.pi/skills/` maintenance tools remain repository-only. Sync owns enriched release records; assessment owns source-versus-Pi evidence and its marker, and reports evidence changes to the sync coordinator. Refresh only the ledger's maintenance procedure, without changing its source evidence or advancing its baseline. The state checker no longer requires source ancestry and rejects duplicate ledger pins; port validation checks assessment consistency independently of the snapshot implemented. Repository guidance no longer applies stale bucket exclusions or source rejection decisions.

## Verification

`npm run validate:skills` passed, including unchanged skill provenance, bundled wayfinder/tracker dependencies, maintenance pointers, absence of removed scaffolding, and both enriched-record checks. `npm run test:maintenance` passed unrelated-snapshot, stale-evidence, marker-syntax, and duplicate-ledger-pin cases. Its release test passed negative enriched-record cases and actual Changesets versioning in a disposable fixture: 1.3.1 becomes 1.4.0, complete summaries survive, fixture records are consumed, and a second version run is a no-op. No credentials are needed and the real queue is untouched.

Model-free checks against Pi 1.1.0 still load all 40 skills without diagnostics and pass invocation/context/extension-runner cases. The compatibility state checker and whitespace checks passed. These checks do not execute GitHub issue creation, live model workflows, or a source sync. The compatibility evidence baseline, findings, and marker are preserved. Development tooling still reports 18 npm audit findings (2 moderate, 16 high); no unreviewed dependency upgrade is included.
