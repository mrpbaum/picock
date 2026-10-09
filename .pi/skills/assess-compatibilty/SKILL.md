---
name: assess-compatibilty
description: "Refresh this repo's upstream-versus-Pi compatibility ledger and consolidation marker. Use on every sync-upstream run, when its marker is stale or inconsistent, or when asked to reassess upstream compatibility."
---

# Assess Compatibility

Keep `docs/pi-compatibilty.md` current against **upstream plus Pi and the required `@tintinweb/pi-subagents` dependency**, independently of this fork's implementation. This is a repository-only, model-invoked maintenance skill. `sync-upstream` must use it on every run; humans can also invoke `/skill:assess-compatibilty`.

Resolve repository paths from the repo root, not this skill directory. The state file beside this skill is `last-consolidated.sha`: one full lowercase upstream commit SHA followed by a newline. It means the ledger has incorporated compatibility effects through that commit, not that this fork has merged or remediated them.

## Boundaries

- Read upstream in a separate checkout at a pinned commit. Compare upstream commits with upstream commits, never with the fork's tree or merge result.
- Write only the compatibility document and this skill's marker. Do not implement remediations, change other skills, install packages, push, or create GitHub items. The caller owns commits and integration.
- Treat `@tintinweb/pi-subagents` as required. Distinguish supplied capabilities from instruction/configuration gaps; keep Claude `Skill` dispatch and hooks separate from subagent execution.
- Advance the marker **last**, only after the ledger passes verification. On incomplete assessment, unavailable evidence, or failed validation, retain the old marker and report the blocker. Partial document edits are not a consolidated review.
- Use one writer for the document/marker pair. Read-only research may be delegated, but this skill owns consolidation.

## 1. Pin the target and validate prior state

1. Read repository instructions, this complete skill, `last-consolidated.sha`, and the complete compatibility document, including its sources and update procedure.
2. If `sync-upstream` supplied an exact upstream endpoint, use that SHA throughout this run. Do not fetch a different endpoint midway. Otherwise verify the `upstream` remote points to `mattpocock/skills`, fetch it, discover its remote default branch, and resolve its current full commit SHA. Ask before adding/repairing a remote. Record how the target was selected.
3. Require the target to resolve to an upstream commit. The marker must contain exactly one full lowercase SHA that resolves to a commit. Check whether it is an ancestor of the target, and compare it with the document's `Upstream commit` baseline.
4. Run `node .pi/skills/assess-compatibilty/scripts/check-state.mjs <target-sha>` from the repo root. Exit 0 means marker and document baseline both match the target; exit 1 means stale/inconsistent state; exit 2 means invalid inputs/state. The checker does not certify that the review was thorough.

If both endpoints match, verify the document still has its pinned Pi/dependency sources and no known unincorporated compatibility changes, then report **already consolidated**. Leave the document and marker unchanged unless the user requests a fresh Pi/dependency review or known evidence requires one. This freshness check counts as the skill's invocation on a no-change sync.

A missing, malformed, unavailable, non-ancestor, or document-inconsistent marker is not grounds to skip commits or blindly reset it. Recover an evidenced prior baseline if possible; otherwise review the full target snapshot. Explicitly record a history rewrite or full reassessment instead of pretending there is a trustworthy incremental range. A failed target fetch/resolution is a blocker, not permission to mark a cached remote ref current.

**Done:** exact target, prior baseline and integrity/ancestry checks, and either a verified no-op or a justified review range/full-review scope.

## 2. Assess upstream changes

Follow the document's **Updating this review against a new upstream release** procedure. Use a fresh temporary clone or detached upstream checkout; clean it up after the review without deleting caller-owned workspaces.

For a trustworthy marker, inspect both:

```bash
git diff --name-status <last-consolidated-sha> <target-sha>
git log --oneline <last-consolidated-sha>..<target-sha>
```

Read relevant commits, including changes later reverted, and the final target versions. For every changed path, establish its Pi effect or explain why it has none. Follow changed skills into their unchanged dependencies, helpers, metadata, scripts, routers, install surfaces, and docs. Recheck renamed/deleted paths and any current findings that cite them. Keep resolved historical evidence distinct from current claims.

Cover discovery/filtering, invocation/dispatch, child contexts and skills, parallel/background agents, nesting, worktree lifecycle, hooks, commands, context files, setup, installation/update behavior, metadata, and shared prerequisites. Read the exact Pi and required dependency contracts used as evidence; record versions rather than assuming the latest package matches an installed one. Consult upstream's setup skill for setup effects, without treating this fork's remediations as upstream evidence.

Recount all target skills and the promoted/plugin sets, and reproduce isolated Pi loader/resource checks with user/project defaults disabled. Every current skill must remain covered, not just changed skills. Distinguish static checks from runtime tests; do not execute untrusted upstream scripts or install packages without authorization. If a previous result cannot be reproduced, remove its claim of current verification or mark it historical/untested.

**Done:** all changed paths accounted for, dependent workflows inspected, current coverage complete, and each compatibility effect supported by upstream and pinned Pi/dependency evidence. Unresolved questions block consolidation.

## 3. Consolidate the ledger

Update `docs/pi-compatibilty.md`, preserving stable finding IDs and its maintainable structure:

- Record review date, exact target, previous consolidated baseline/range, upstream versions/ref, Pi/dependency reference versions, methods, and limitations.
- Update verdict, finding statuses/evidence/recheck conditions, per-workflow dependency mappings, installation routes/counts, coverage, source links, and remediation guidance where affected.
- Add a new ID only for a new mismatch. Retain resolved findings with their resolving SHA/version and reason. Fork fixes do not resolve upstream findings.
- Replace current-source links with target-pinned links; keep links explicitly labelled historical at their historical SHAs.
- Record a concise range summary: added/changed/resolved findings, coverage changes, and changes with no Pi impact. If upstream changed but compatibility did not, still record the new baseline and that conclusion.

This ledger tells `sync-upstream` where to focus its fork audit. It does not classify a fork change as already adapted, prove that an adaptation survived a merge, or mark a remediation implemented.

## 4. Verify, then advance the marker

1. Re-read the updated ledger and check every current finding against target sources. Verify IDs, links, counts, coverage, dependency mappings, and disclosed test limits. Run `git diff --check` and relevant isolated checks.
2. Confirm the document's `Upstream commit` equals the pinned target and the prior marker has not changed during this run. If another writer changed state, stop and reconcile instead of overwriting it.
3. Only now write `<target-sha>\n` to `last-consolidated.sha`. Run the state checker again; it must exit 0. If final verification fails, restore the previous marker (or remove a newly created marker), retain/report partial document changes, and stop.
4. Return previous SHA, target SHA, incremental/full/no-op outcome, finding changes, affected workflows, checks/untested behavior, and paths changed. Do not commit unless the caller explicitly asks; document and marker belong in the same caller-owned commit/PR.

**Done:** the document is consolidated through the exact target, the marker agrees with its baseline, validation passes, and the caller has an evidence-backed focus list for its separate fork audit.
