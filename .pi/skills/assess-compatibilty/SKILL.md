---
name: assess-compatibilty
description: Assess a pinned source skill snapshot and its dependency closure against Pi, keeping the compatibility ledger and evidence marker current for port updates.
---

# Assess Skill Compatibility

Maintain `docs/pi-compatibilty.md` as source-versus-Pi evidence, independent of this port's fixes. The target is Pi plus required `@tintinweb/pi-subagents`. This repository-only skill writes only that ledger and its adjacent `last-consolidated.sha`; the sync coordinator owns port implementation and the enriched Changeset.

Resolve repository paths from the root. A source pin identifies the skill snapshot assessed, not a whole-repository tracking obligation, merged ancestry, or remediation status.

## 1. Pin evidence and check state

1. Read repository instructions, this skill, the complete ledger and its sources/update procedure, and the marker. If sync supplies a full source target SHA, use it throughout. Otherwise read `sourceRepository` from `docs/maintenance/source-port-manifest.json`, confirm any requested source change, and resolve the requested snapshot in a separate source checkout. Never add or repair a source remote in picock. Set `PICOCK_SOURCE_CHECKOUT` to that checkout's absolute path; it must contain both target and prior assessment commits.
2. Confirm the target and prior marker resolve to source commits. Compare the marker with the ledger's `Source commit`. Compare source snapshots directly. Missing source objects or a changed copy boundary require a full snapshot reassessment, not resetting the marker blindly. No ancestry relation is required by the state checker.
3. With `PICOCK_SOURCE_CHECKOUT` set, run `node .pi/skills/assess-compatibilty/scripts/check-state.mjs <target-sha>`. Exit 0 means the source pins agree, not that the assessment was thorough. Exit 1 is stale/inconsistent evidence; exit 2 is invalid state.
4. If pins match, check that Pi/backend contracts remain current and no known skill/dependency gap was missed. Report already consolidated and leave evidence unchanged unless a fresh contract review is requested or warranted. Failed source resolution is a blocker, not permission to call a cached ref current.

**Done:** exact source target and evidenced previous baseline, with a justified no-op, incremental skill-file review, or full snapshot reassessment.

## 2. Assess the skill closure

1. Inventory every target source `SKILL.md`, its invocation mode, and required references, assets, scripts, and cross-skill dependencies. Account for new/removed/renamed skills. Keep source promotion labels separate from this port's complete-distribution goal.
2. Compare source skill files and their dependencies against the previous source evidence pin. Read relevant source history when needed to establish intent. Never use this port's copies or local diffs as source evidence, and do not classify every unrelated source administrative file.
3. Follow the ledger's review procedure for dispatch, context files, invocation, metadata, session commands, hooks/CLI, required subagent contracts, and shared prerequisites. Consult source installation/discovery surfaces only where needed to establish a compatibility claim; inspecting a Claude manifest as evidence does not mean copying it here.
4. Read pinned Pi and backend documentation/source. Record exact versions and effective settings for runtime tests. Reproduce isolated loader/resource checks with defaults disabled. Check dependency closure and instruction-file precedence, not just changed skill bodies.
5. Distinguish source findings, static checks, and runtime execution. Do not execute untrusted source scripts or install dependencies without authorisation. Unavailable evidence or unresolved capability questions block consolidation; label tests not run instead of implying certification.

**Done:** complete target skill coverage and required dependency evidence, with source-supported compatibility findings and explicit verification limits.

## 3. Consolidate and verify

1. Preserve stable PI finding IDs, source evidence boundaries, and the distinction between supplied backend capabilities and remaining adaptation requirements. Local fixes do not resolve source findings.
2. Update source pins, review date, scope, versions, coverage, source links, findings, and verification limits. Retain historical source references as historical, rather than implying deleted local infrastructure is still required.
3. Summarise changes relevant to the port: source skill changes, compatibility drift, resolved/new findings, and new adaptation needs. These are inputs for the coordinator's enriched Changeset, not proof the port implemented them.
4. Re-read every current finding against target sources, run isolated checks and `git diff --check`, and confirm the prior marker has not changed concurrently.
5. Advance the marker last, only after the ledger is consolidated. Run the state checker again and require exit 0. Restore the prior marker on failure, report partial edits, and stop. Ledger and marker belong together in the caller's commit.
6. Return previous/target source pins, review outcome, affected skills/assets, finding changes, checks/runtime limits, and a concise evidence summary suitable for the enriched record's Provenance, Source changes, Pi adaptations, Skill coverage, and Verification sections. State explicitly that the caller must record implementation separately.

**Done:** the source skill snapshot is fully assessed, ledger and marker agree, and the sync coordinator has evidence for port review and enriched release notes. Do not change skills, the source manifest, or pending changesets, and do not commit, push, or open GitHub items without separate authority.
