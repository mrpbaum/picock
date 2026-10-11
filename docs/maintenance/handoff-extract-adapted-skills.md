# Handoff: maintain a one-to-one Pi port of source skills

Historical implementation brief, completed on the port branch. Current maintenance uses `sync-source`, separate source checkouts, and `docs/maintenance/source-port-manifest.json`. Picock has only its own origin remote; historical source pins below are provenance, not a request to recreate a source remote or Git fork workflow.

## Next session

Make this repository a complete, one-to-one Pi port of `mattpocock/skills`, not an adapted-only extraction. Preserve source skill names, intent, workflows, and bundled references. Keep portable skills unchanged where possible, and adapt harness-specific instructions so their workflows work in Pi.

The previous extraction plan was incorrect. Users must not need a separate source skills installation to recover portable skills or satisfy cross-skill dependencies. Do not implement a SQLite index or merge source before reviewing its changes.

This handoff correction does not implement the migration. Work on a new implementation branch from the reviewed starting state, preserving any approved handoff correction.

## Confirmed decisions

- The repository's GitHub username changed. The correct `origin` is `git@github.com:mrpbaum/picock.git`; use `mrpbaum/picock` in package metadata and Pi install instructions.
- The required subagent backend is `@tintinweb/pi-subagents`. Do not switch to `pi-herdr-agents` or silently degrade workflows to sequential execution.
- Keep both repository-maintenance skills under `.pi/skills/`: `sync-source` and `assess-compatibilty`.
- Keep `docs/pi-compatibilty.md` as a source-versus-Pi compatibility ledger, not a checklist of fixes applied here.
- Keep portable source skills in this package. Their lack of a harness mismatch is a reason to copy them faithfully, not remove them.

## Suggested skills

- Read and follow `writing-for-agents` before editing `AGENTS.md` or either maintenance skill.
- Read `setup-matt-pocock-skills` before compatibility changes, because its context-file setup affects the port.
- Use `assess-compatibilty` to assess source evidence, never to classify this tree as source.
- The implementation replaced the old whole-tree merge procedure with reviewed source snapshot copying. Follow the current `sync-source` skill.

## Starting evidence

The earlier handoff recorded source `49dd158d1076134a641b33efb035946536778336` (package `1.3.1`) and `main` at `2763767`, four commits ahead. That source SHA is the baseline in `docs/pi-compatibilty.md` and `.pi/skills/assess-compatibilty/last-consolidated.sha`.

Recheck actual refs and working-tree state before implementation. Do not treat these historical observations as a claim that source remains unchanged.

The ledger reviewed 38 source skills, of which 27 were promoted. The existing port contains useful Pi adaptations, but also unrelated changes: restored `resolving-merge-conflicts`, repository policy changes, and a `diagnosing-bugs` behavior change that removes secret redaction and adds a post-mortem. Separate compatibility adaptations from behavior drift.

## Goal and scope

The source inventory is every `SKILL.md` present at the pinned source SHA, including non-promoted buckets, plus the references and scripts each skill requires. Maintain one corresponding Pi skill per source skill, with the same name and invocation policy.

- Portable skills remain in this package with their source behavior intact.
- Harness-dependent skills receive explicit Pi adaptations that preserve their purpose.
- Cross-skill dependencies resolve within this package. Retain `domain-modeling` and its bundled references rather than routing users to a separate source install.
- Preserve bucket organisation and source distinctions between promoted and non-promoted skills. Public promoted-skill listings are not the complete port inventory.
- Keep `skills/engineering/PI-SUBAGENTS.md` as the shared Pi backend contract.
- Keep `.pi/skills/` outside package discovery, global skill linking, public skill listings, and `ask-matt`.

A skill that cannot be faithfully ported is a blocker to report to the user, with its missing capability and proposed options. Do not silently omit it, replace its purpose, or claim parity through a stub.

### Portable skills to retain

Examples include `domain-modeling`, `diagnosing-bugs`, `pr`, `prototype`, `to-spec`, `to-tickets`, `wizard`, `teach`, `to-questionnaire`, `wait-what`, and `writing-for-agents`. The ledger's full inventory, not this example list, determines coverage.

Restore source `diagnosing-bugs` behavior, including secret redaction. An unrelated post-mortem addition is not a compatibility adaptation.

### Non-promoted and removed skills

The previous blanket exclusion of `in-progress/`, `misc/`, `deprecated/`, and `personal/` is withdrawn. Include skills actually present at the chosen source pin in the port inventory. Review package discovery explicitly and document what is loaded; do not conflate source promotion with compatibility.

In particular, `git-guardrails-claude-code` and `claude-handoff` need deliberate Pi ports, not exclusion. Preserve their source names for one-to-one correspondence, while explaining their Pi implementation. A guardrail must protect the intended Pi execution paths; a passing shell-script test alone is insufficient. Surface any sandbox or interception limitations before implementation.

`resolving-merge-conflicts` is absent from the recorded source snapshot, so it is not part of source parity. Identify any local-only skills, including `git-guardrails-pi`, and ask before deleting or retaining them as separately documented extras. Do not remove potentially important local behavior without informing the user.

## Required adaptations

Use `docs/pi-compatibilty.md` as the requirement source and review every source skill and bundled dependency.

- **PI-001:** Inventory and test actual Pi discovery across the complete port. Preserve promotion labels in documentation, and make any intentional loading restrictions explicit rather than deleting skills to hide them.
- **PI-002:** Replace Claude `Skill` dispatch with reading and following the named available skill. Recommend user-invoked dependencies to the human instead of silently invoking them.
- **PI-003:** Point delegating workflows at `PI-SUBAGENTS.md` and the required `@tintinweb/pi-subagents` contract. Preserve isolated reviews, parallel designs, asynchronous research, and worktree ownership. The parent launches `wayfinder` research workers directly, avoiding nested redispatch. Use returned branches instead of inventing `research/<name>` artifact branches.
- **PI-004:** Use `/skill:<name>` for Pi skill invocation, including router labels and human docs. Preserve actual Pi built-in commands.
- **PI-005:** Use `/new` or a fresh session instead of `/clear`; keep `/compact` as compaction. Treat 150k and 100K context figures as heuristics, not Pi guarantees. Adapt `ask-matt/PHASE-BOUNDARIES.md` too.
- **PI-006:** Port Claude hooks and background CLI workflows to supported Pi mechanisms. Document and test actual protection, ownership, completion, and cancellation behavior. Stop and report concrete capability gaps before promising equivalence.
- **PI-007:** Setup writes the context file Pi actually selects. Cover only `CLAUDE.md`, only `AGENTS.md`, both, uppercase alternatives, and `AGENTS.override.md`. Preserve other agents' files and tell users to reload.
- **PI-008:** Document the Pi package install/update/reload lifecycle, with the correct repository URL and separately installed subagent dependency.
- **PI-009:** Put useful argument examples in skill text, not only `argument-hint` or Codex metadata.

Preserve source behavior except where a Pi compatibility requirement demands a change. Maintain the complete `ask-matt` routing map, including portable skills, and keep repository-only maintenance skills out of it.

## Provenance and maintenance

Add a small manifest in git mapping every ported source file to its source path and source SHA or blob. Mark unchanged copies versus adapted copies, and identify Pi-only helpers separately. Markdown or JSON is enough; do not use SQLite.

Keep both maintenance skills under `.pi/skills/`.

`assess-compatibilty` continues to compare source commits with source commits, never this tree. It writes only `docs/pi-compatibilty.md` and `last-consolidated.sha`. Its findings drive compatibility review for the complete port; fixes here do not close source findings.

Rewrite `sync-source` as a reviewed port-update loop:

1. Pin source and run `assess-compatibilty` against that exact SHA.
2. Inventory additions, removals, renames, and changed dependencies across the complete source skill set.
3. Diff ported files against the source recorded in the manifest.
4. Update portable copies faithfully and port source improvements into adapted copies without overwriting adaptations.
5. Add corresponding Pi ports for new source skills. Explain removals, behavioral losses, and capability blockers before taking destructive action; wait for confirmation when important behavior would be lost.
6. Update provenance, docs, router, package discovery, and validation together.
7. Open a normal PR on `origin` only when asked. Never push to source.

Remove automatic whole-tree merge instructions, workflow-exclusion rituals, and merge-commit requirements. Skill parity does not require copying unrelated source repository automation or Claude marketplace infrastructure.

## Docs and repository instructions

- Preserve `docs/pi-compatibilty.md`, its source baseline, and its evidence boundaries.
- Update `AGENTS.md` to describe a complete Pi port. Promoted skills still require linked README entries and human docs; non-promoted skills retain their bucket listings without being promoted implicitly.
- Follow `docs/maintenance/writing-docs.md` when syncing promoted-skill docs. Use `/skill:<name>` in Pi-facing docs.
- Replace the README installation story with a self-contained Pi package workflow. Users do not need to install a second copy of source skills. Warn that duplicate skill names from other installations can shadow this port.
- Point package metadata and install instructions to `mrpbaum/picock`.
- Keep required licensing and source attribution. Keep Claude plugin metadata, repository issue forms, inherited rejection policy, and source release queues outside the skill copy boundary. Preserve bundled tracker and issue-body templates, and record skill updates plus Pi adaptations in enriched Changesets following `docs/maintenance/changesets.md`.
- Adapt validation and linking scripts to the actual port inventory. Do not require `claude plugin validate`.
- Keep this handoff until the implementation is reviewed; it may be archived after the migration lands.

## How to land it

Work on a new branch. Do not rewrite published history or merge the source repository history into it. Leave `main` publishable until review. Do not push or open a PR unless asked.

Before changing skills or removing files, report unresolved scope questions, concrete blockers, and any potentially important losses. The user has explicitly rejected removing portable skills merely to reduce the maintained set.

## Done when

- Every skill at the pinned source SHA has a corresponding functioning Pi port; portable skills and all cross-skill dependencies remain available in this package.
- Differences from source behavior are justified by Pi compatibility, documented, and tested at the stated level.
- No port requires Claude `Skill` dispatch, `/clear`, Claude-only hooks/CLI, or an unavailable subagent backend.
- Setup selects the context file Pi loads, including coexistence and override cases.
- Both repository-maintenance skills remain under `.pi/skills/`, excluded from distributed discovery and public routing.
- `sync-source` performs reviewed port updates, not whole-tree merges. `assess-compatibilty` uses source evidence only.
- `docs/pi-compatibilty.md` retains a source baseline, and the manifest records provenance for the full port.
- Package discovery, invocation flags, bundled references, dependency closure, router coverage, and relevant runtime adaptations are validated. Untested runtime claims are labelled.
- Local-only skills and unrelated behavior changes are explicitly accounted for; important removals have user approval.
- A single package installation provides the skills, with the required subagent backend installed separately. No separate source skills installation is needed.
