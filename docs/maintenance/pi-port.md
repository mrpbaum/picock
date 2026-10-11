# Complete Pi port: inventory and verification

## Source boundary

This package ports all **38 upstream skills** at `49dd158d1076134a641b33efb035946536778336` (upstream package `1.3.1`). Portable skills remain included. The [provenance manifest](./upstream-port-manifest.json) maps 108 upstream files to their source commit/blob and distinguishes unchanged copies from adaptations. Pi-only helpers are identified separately.

This is not a claim to track the newest upstream HEAD. The local `upstream/main` ref had moved past the compatibility ledger's baseline during implementation. Updating to a newer snapshot requires the rewritten maintenance procedure and a fresh upstream assessment.

Two fork-only extras remain for existing users: `resolving-merge-conflicts` and `git-guardrails-pi`. They are not counted as upstream ports. The latter is an alias of the canonical Pi guardrail implementation under upstream's historical `git-guardrails-claude-code` name. Total Pi discovery is **40 skills**: 28 in the promoted buckets and 12 in beta/misc buckets. Promotion controls public listing structure, not availability.

## Runtime dependencies and naming

Pi `>=1.1.0` and the separately installed `@tintinweb/pi-subagents` backend are required for delegation. The reviewed backend reference is `0.20.0`; its effective settings and agent definitions must support each requested workflow. Package-installed and symlinked skill paths must be passed explicitly to children where named preloading cannot find them.

The upstream names `claude-handoff` and `git-guardrails-claude-code` remain for parity, but their instructions launch Pi workers and install Pi event handlers. They do not launch Claude or write Claude hook settings. Git guardrails remain opt-in and command-level, not a sandbox.

Claude plugin metadata, this repository's GitHub issue forms, and inherited rejection records have been removed. Useful repository guidance lives under `docs/maintenance/`, and inherited pending upstream release notes are archived outside the active Changeset queue. The original shell-hook script remains bundled source reference material, not the Pi installation. Package versioning and validation do not synchronise Claude metadata. No skills were deleted in this implementation. The upstream debugging redaction requirements were restored and the unrelated fork post-mortem addition was removed, as stated before implementation.

Repository-maintenance skills remain under `.pi/skills/` and are not distributed, globally linked, or publicly routed. `docs/pi-compatibilty.md` and its marker retain their upstream evidence baseline unchanged. `AGENTS.md` is an existing symlink to `CLAUDE.md`; repository-instruction edits consequently appear in Git as changes to `CLAUDE.md`.

## Verification

Run static and model-free package checks from the repository:

```bash
npm ci --ignore-scripts
npm run validate:skills
npm run test:maintenance
node .pi/skills/assess-compatibilty/scripts/check-state.mjs 49dd158d1076134a641b33efb035946536778336
git diff --check
```

The suite checks all upstream skill names and invocation policies, complete file provenance, unchanged/adapted classification, bundled links outside code examples, router coverage, promoted docs, backend pointers, safe idempotent linking, repository-only maintenance exclusion, restored debugging behavior, and synthetic git-guardrail handler cases. It also checks enriched records, maintenance ownership, and bundled tracker independence from the removed GitHub issue forms. `test:maintenance` checks unrelated source snapshots, stale evidence, marker syntax, and duplicate ledger pins. Its `test:changesets` step validates negative record cases and runs actual Changesets versioning in a disposable repository with credentials unset: 1.3.1 becomes 1.4.0, complete summaries survive, only fixture records are consumed, and a second version run is a no-op. It does not version the real package. It requires the recorded upstream Git object, which is part of this repository's existing history.

Run integration checks against a specific installed Pi package root:

```bash
npm run validate:pi-runtime -- /path/to/node_modules/@earendil-works/pi-coding-agent
```

These checks were run against Pi `1.1.0`:

- The actual skill loader found all 40 distributed skills with zero diagnostics, excluding repository maintenance.
- User-invoked `ask-matt` was absent from the implicit prompt catalogue while model-invoked `tdd` was present.
- The actual context loader selected the correct file for only-CLAUDE, only-AGENTS, coexistence, override, uppercase alternatives, and no-file cases. Setup remains prompt-driven; this verifies its specified loader contract, not a model's setup run.
- Pi's actual extension loader loaded the bundled guardrail, and its event runner blocked synthetic push/reset calls while allowing status. No destructive git command or model was executed.

## Remaining runtime acceptance

Static and model-free checks are not end-to-end workflow certification. Still exercise in a clean, trusted Pi session with the required backend:

- Explicit `/skill:<name>` expansion and wrapper composition.
- Parallel review isolation and independent design passes.
- Background full-result delivery, leaf research, worktree base/preservation, serial integration, and cancellation/cleanup.
- Session-scoped scheduling and fresh background handoff.
- Setup's actual file edits and reload behavior in the coexistence/override cases.
- Live guardrail interception of a `bash` call in a disposable repository, after reload, including any child session where protection is expected.

The backend reference documentation was inspected, but these model-driven workflows were not executed. Missing capabilities must stop the affected workflow rather than silently changing its behavior.

Updating the existing development lockfile reported 18 npm audit findings (2 moderate, 16 high) in development tooling. Dependency remediation is separate from skill parity; no blanket audit fix or unreviewed dependency upgrade was applied.

## Maintenance

Read and follow `.pi/skills/sync-upstream/SKILL.md` for reviewed skill-snapshot updates, not whole-repository tracking. Each completed update records upstream changes, Pi adaptations, coverage, provenance, and verification together in an enriched Changeset (see `docs/maintenance/changesets.md`). Bundled wayfinder/tracker and triage body templates are preserved independently of optional repository issue forms. Use `scripts/update-port-manifest.mjs <reviewed-upstream-sha>` only after reviewing the mapped content; advancing its baseline requires `--reviewed`. The generator is not a compatibility assessment and must not be used to stamp unported files as current. The upstream ledger/marker remain owned by `assess-compatibilty`.
