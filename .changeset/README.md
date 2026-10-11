# Pending Pi port releases

Each pending record targets `picock` and combines source skill changes with the Pi adaptations made or preserved. Follow [the enriched changeset guide](../docs/maintenance/changesets.md) for the five required sections, provenance fields, bump rules, and release procedure.

`sync-source` owns a record for every completed non-no-op port update. Local adaptations also need a record; keep both source fields unchanged for local-only work. `assess-compatibilty` supplies evidence, not a claim that the port was implemented.

Run `npm run validate:changesets` before review. The local changelog adapter preserves the full summaries during `npm run version`, without GitHub credentials. Version only after release approval, not during sync.

Inherited source notes are archived under `docs/maintenance/source-release-notes/`, outside this release queue.
