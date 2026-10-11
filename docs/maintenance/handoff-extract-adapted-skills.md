# Handoff: maintain a one-to-one Pi port of upstream skills

## Next session

Make this repository a complete, one-to-one Pi port of `mattpocock/skills`, not an adapted-only extraction. Preserve upstream skill names, intent, workflows, and bundled references. Keep portable skills unchanged where possible, and adapt harness-specific instructions so their workflows work in Pi.

The previous extraction plan was incorrect. Users must not need a separate upstream skills installation to recover portable skills or satisfy cross-skill dependencies. Do not implement a SQLite index or merge upstream before reviewing its changes.

This handoff correction does not implement the migration. Work on a new implementation branch from the reviewed starting state, preserving any approved handoff correction.

## Confirmed decisions

- The repository's GitHub username changed. The correct `origin` is `git@github.com:mrpbaum/picock.git`; use `mrpbaum/picock` in package metadata and Pi install instructions.
- The required subagent backend is `@tintinweb/pi-subagents`. Do not switch to `pi-herdr-agents` or silently degrade workflows to sequential execution.
- Keep both repository-maintenance skills under `.pi/skills/`: `sync-upstream` and `assess-compatibilty`.
- Keep `docs/pi-compatibilty.md` as an upstream-versus-Pi compatibility ledger, not a checklist of fixes applied here.
- Keep portable upstream skills in this package. Their lack of a harness mismatch is a reason to copy them faithfully, not remove them.

## Suggested skills

- Read and follow `writing-for-agents` before editing `AGENTS.md` or either maintenance skill.
- Read `setup-matt-pocock-skills` before compatibility changes, because its context-file setup affects the port.
- Use `assess-compatibilty` to assess upstream evidence, never to classify this tree as upstream.
- Rewrite `sync-upstream` before running it. Its current whole-tree merge procedure is not the maintenance procedure specified here.

## Starting evidence

The earlier handoff recorded upstream `49dd158d1076134a641b33efb035946536778336` (package `1.3.1`) and `main` at `2763767`, four commits ahead. That upstream SHA is the baseline in `docs/pi-compatibilty.md` and `.pi/skills/assess-compatibilty/last-consolidated.sha`.

Recheck actual refs and working-tree state before implementation. Do not treat these historical observations as a claim that upstream remains unchanged.

The ledger reviewed 38 upstream skills, of which 27 were promoted. The existing fork contains useful Pi adaptations, but also unrelated changes: restored `resolving-merge-conflicts`, repository policy changes, and a `diagnosing-bugs` behavior change that removes secret redaction and adds a post-mortem. Separate compatibility adaptations from behavior drift.

## Goal and scope

The source inventory is every `SKILL.md` present at the pinned upstream SHA, including non-promoted buckets, plus the references and scripts each skill requires. Maintain one corresponding Pi skill per upstream skill, with the same name and invocation policy.

- Portable skills remain in this package with their upstream behavior intact.
- Harness-dependent skills receive explicit Pi adaptations that preserve their purpose.
- Cross-skill dependencies resolve within this package. Retain `domain-modeling` and its bundled references rather than routing users to a separate upstream install.
- Preserve bucket organisation and upstream distinctions between promoted and non-promoted skills. Public promoted-skill listings are not the complete port inventory.
- Keep `skills/engineering/PI-SUBAGENTS.md` as the shared Pi backend contract.
- Keep `.pi/skills/` outside package discovery, global skill linking, public skill listings, and `ask-matt`.

A skill that cannot be faithfully ported is a blocker to report to the user, with its missing capability and proposed options. Do not silently omit it, replace its purpose, or claim parity through a stub.

### Portable skills to retain

Examples include `domain-modeling`, `diagnosing-bugs`, `pr`, `prototype`, `to-spec`, `to-tickets`, `wizard`, `teach`, `to-questionnaire`, `wait-what`, and `writing-for-agents`. The ledger's full inventory, not this example list, determines coverage.

Restore upstream `diagnosing-bugs` behavior, including secret redaction. An unrelated post-mortem addition is not a compatibility adaptation.

### Non-promoted and removed skills

The previous blanket exclusion of `in-progress/`, `misc/`, `deprecated/`, and `personal/` is withdrawn. Include skills actually present at the chosen upstream pin in the port inventory. Review package discovery explicitly and document what is loaded; do not conflate upstream promotion with compatibility.

In particular, `git-guardrails-claude-code` and `claude-handoff` need deliberate Pi ports, not exclusion. Preserve their upstream names for one-to-one correspondence, while explaining their Pi implementation. A guardrail must protect the intended Pi execution paths; a passing shell-script test alone is insufficient. Surface any sandbox or interception limitations before implementation.

`resolving-merge-conflicts` is absent from the recorded upstream snapshot, so it is not part of upstream parity. Identify any fork-only skills, including `git-guardrails-pi`, and ask before deleting or retaining them as separately documented extras. Do not remove potentially important local behavior without informing the user.

## Required adaptations

Use `docs/pi-compatibilty.md` as the requirement source and review every upstream skill and bundled dependency.

- **PI-001:** Inventory and test actual Pi discovery across the complete port. Preserve promotion labels in documentation, and make any intentional loading restrictions explicit rather than deleting skills to hide them.
- **PI-002:** Replace Claude `Skill` dispatch with reading and following the named available skill. Recommend user-invoked dependencies to the human instead of silently invoking them.
- **PI-003:** Point delegating workflows at `PI-SUBAGENTS.md` and the required `@tintinweb/pi-subagents` contract. Preserve isolated reviews, parallel designs, asynchronous research, and worktree ownership. The parent launches `wayfinder` research workers directly, avoiding nested redispatch. Use returned branches instead of inventing `research/<name>` artifact branches.
- **PI-004:** Use `/skill:<name>` for Pi skill invocation, including router labels and human docs. Preserve actual Pi built-in commands.
- **PI-005:** Use `/new` or a fresh session instead of `/clear`; keep `/compact` as compaction. Treat 150k and 100K context figures as heuristics, not Pi guarantees. Adapt `ask-matt/PHASE-BOUNDARIES.md` too.
- **PI-006:** Port Claude hooks and background CLI workflows to supported Pi mechanisms. Document and test actual protection, ownership, completion, and cancellation behavior. Stop and report concrete capability gaps before promising equivalence.
- **PI-007:** Setup writes the context file Pi actually selects. Cover only `CLAUDE.md`, only `AGENTS.md`, both, uppercase alternatives, and `AGENTS.override.md`. Preserve other agents' files and tell users to reload.
- **PI-008:** Document the Pi package install/update/reload lifecycle, with the correct repository URL and separately installed subagent dependency.
- **PI-009:** Put useful argument examples in skill text, not only `argument-hint` or Codex metadata.

Preserve upstream behavior except where a Pi compatibility requirement demands a change. Maintain the complete `ask-matt` routing map, including portable skills, and keep repository-only maintenance skills out of it.

## Provenance and maintenance

Add a small manifest in git mapping every ported upstream file to its upstream path and source SHA or blob. Mark unchanged copies versus adapted copies, and identify Pi-only helpers separately. Markdown or JSON is enough; do not use SQLite.

Keep both maintenance skills under `.pi/skills/`.

`assess-compatibilty` continues to compare upstream commits with upstream commits, never this tree. It writes only `docs/pi-compatibilty.md` and `last-consolidated.sha`. Its findings drive compatibility review for the complete port; fixes here do not close upstream findings.

Rewrite `sync-upstream` as a reviewed port-update loop:

1. Pin upstream and run `assess-compatibilty` against that exact SHA.
2. Inventory additions, removals, renames, and changed dependencies across the complete upstream skill set.
3. Diff ported files against the upstream source recorded in the manifest.
4. Update portable copies faithfully and port upstream improvements into adapted copies without overwriting adaptations.
5. Add corresponding Pi ports for new upstream skills. Explain removals, behavioral losses, and capability blockers before taking destructive action; wait for confirmation when important behavior would be lost.
6. Update provenance, docs, router, package discovery, and validation together.
7. Open a normal PR on `origin` only when asked. Never push to upstream.

Remove automatic whole-tree merge instructions, workflow-exclusion rituals, and merge-commit requirements. Skill parity does not require copying unrelated upstream repository automation or Claude marketplace infrastructure.

## Docs and repository instructions

- Preserve `docs/pi-compatibilty.md`, its upstream baseline, and its evidence boundaries.
- Update `AGENTS.md` to describe a complete Pi port. Promoted skills still require linked README entries and human docs; non-promoted skills retain their bucket listings without being promoted implicitly.
- Follow `docs/maintenance/writing-docs.md` when syncing promoted-skill docs. Use `/skill:<name>` in Pi-facing docs.
- Replace the README installation story with a self-contained Pi package workflow. Users do not need to install a second copy of upstream skills. Warn that duplicate skill names from other installations can shadow this port.
- Point package metadata and install instructions to `mrpbaum/picock`.
- Keep required licensing and upstream attribution. Keep Claude plugin metadata, repository issue forms, inherited rejection policy, and upstream release queues outside the skill copy boundary. Preserve bundled tracker and issue-body templates, and record skill updates plus Pi adaptations in enriched Changesets following `docs/maintenance/changesets.md`.
- Adapt validation and linking scripts to the actual port inventory. Do not require `claude plugin validate`.
- Keep this handoff until the implementation is reviewed; it may be archived after the migration lands.

## How to land it

Work on a new branch. Do not rewrite published history or merge `upstream/main` into it. Leave `main` publishable until review. Do not push or open a PR unless asked.

Before changing skills or removing files, report unresolved scope questions, concrete blockers, and any potentially important losses. The user has explicitly rejected removing portable skills merely to reduce the maintained set.

## Done when

- Every skill at the pinned upstream SHA has a corresponding functioning Pi port; portable skills and all cross-skill dependencies remain available in this package.
- Differences from upstream behavior are justified by Pi compatibility, documented, and tested at the stated level.
- No port requires Claude `Skill` dispatch, `/clear`, Claude-only hooks/CLI, or an unavailable subagent backend.
- Setup selects the context file Pi loads, including coexistence and override cases.
- Both repository-maintenance skills remain under `.pi/skills/`, excluded from distributed discovery and public routing.
- `sync-upstream` performs reviewed port updates, not whole-tree merges. `assess-compatibilty` uses upstream evidence only.
- `docs/pi-compatibilty.md` retains an upstream baseline, and the manifest records provenance for the full port.
- Package discovery, invocation flags, bundled references, dependency closure, router coverage, and relevant runtime adaptations are validated. Untested runtime claims are labelled.
- Fork-only skills and unrelated behavior changes are explicitly accounted for; important removals have user approval.
- A single package installation provides the skills, with the required subagent backend installed separately. No separate upstream skills installation is needed.
