# Scope

This repository distributes a one-to-one Pi port of a reviewed `mattpocock/skills` snapshot and the assets needed for those skills to work. Preserve upstream skill names, invocation modes, behavior, and dependency closure; adapt harness-specific instructions for Pi.

## In scope

- Portable copies and justified Pi adaptations across the complete source skill inventory.
- Pi discovery, installation, invocation, context-file selection, and required subagent workflows.
- Provenance, compatibility evidence, enriched Changesets, validation, and necessary repository maintenance.
- Explicitly documented retained extras where their compatibility value has been approved.

## Outside the copy boundary

Upstream ancestry, Claude plugin metadata, repository issue forms, publishing automation, inherited rejection policy, and upstream's pending release queue are not needed for skill parity. Read relevant upstream surfaces as evidence when necessary; do not import their repository administration.

All actual skill buckets are distributed. Engineering/productivity are promoted daily workflows; beta/misc skills remain included without entering the top-level promoted listings.

## Feedback and decisions

Report Pi port problems in this repository, naming the skill, Pi/backend versions, installation method, observed behavior, and a reproducible check where possible. Upstream design questions may be discussed upstream, but an upstream rejection is not this repository's policy.

New local rejection records require a maintainer decision. The bundled triage skill may use `.out-of-scope/` in the project where it operates; this repository does not inherit upstream's rejection records. Removing the inherited files does not remove that skill capability.

Repository-specific GitHub issue forms are optional user-interface scaffolding, not skill templates. Wayfinder maps/tickets, specs, triage briefs, and tracker operations remain bundled with their skills and do not require `.github/ISSUE_TEMPLATE/`.
