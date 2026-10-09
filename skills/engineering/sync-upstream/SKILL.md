---
name: sync-upstream
description: Sync upstream skill improvements into this Pi fork, audit compatibility, and open sync and remediation pull requests.
disable-model-invocation: true
---

# Sync Upstream

Update this fork from `mattpocock/skills` for **Pi consumption**, preserving the fork's adaptations. The **compatibility gate** is complete only when every incoming file has evidence-backed classification and every confirmed gap has an owning remediation.

## Boundaries

- **Upstream is read-only.** Fetch from `mattpocock/skills`; push branches and create issues/PRs only in the fork identified by `origin`. Derive its current owner/name rather than hardcoding a historical account name.
- **Pi is the target.** Preserve Pi discovery, `/skill:<name>` invocation, harness-compatible tools, and installation instructions. Claude plugin surfaces matter only when they affect Pi docs, discovery, or validation. Run Pi validation, not `claude plugin validate`.
- **Exclude upstream administration.** Remove incoming workflows used only for upstream issue management or publishing. Preserve existing fork workflows; retain incoming automation only when it demonstrably supports Pi consumption. Inspect purpose before deciding, and record exclusions in the audit.
- **Preserve ancestry.** Use a real `--no-ff` upstream merge. Removing unwanted files from the resulting tree does not remove its upstream ancestry. The final sync PR must use GitHub's **Create a merge commit**, never squash or rebase.
- Never merge, close, or retarget PRs. Never push to upstream.

## 1. Establish the range

1. Require a clean worktree; report local changes and stop rather than stashing.
2. Read repository instructions and the complete `setup-matt-pocock-skills` skill.
3. Inspect remotes and verify `origin` is the intended fork. Remotes live in each clone's `.git/config`, so another machine's `upstream` configuration does not carry over. When missing, add `https://github.com/mattpocock/skills.git` after user confirmation; confirm before repairing a different upstream fetch URL. Leave `origin` unchanged.
4. Fetch and prune both remotes. Discover their default branches rather than assuming `main`.
5. Record endpoint SHAs and commits in `origin/<default>..upstream/<default>`. Inventory incoming files from the merge-base to upstream, not a tip-to-tip diff that mistakes fork-only adaptations for upstream deletions. Also inspect upstream commits for changes later reverted.

**Done:** clean worktree, exact endpoints, commit range, and incoming file inventory. If no upstream commits remain, report current and stop without branches or GitHub items.

## 2. Prepare the draft sync

1. Branch from the recorded origin endpoint as `sync/upstream-<YYYY-MM-DD>`, adding a numeric suffix on collision.
2. Merge the recorded upstream endpoint with `--no-ff`. Resolve conflicts by intent: retain upstream improvements and Pi adaptations together. Trace primary sources for ambiguous conflicts. Exclude upstream-only administration before pushing.
3. Run `npm run validate:skills`, relevant focused checks, and `git diff --check`. Record failures honestly; distribution validation alone is not a compatibility audit.
4. Push only to the fork and open a draft PR against its default branch. Include endpoints, commit range, conflict resolutions, excluded automation, checks, and: **merge this PR with GitHub's "Create a merge commit" option only**.

Use `GH_TOKEN="$PI_GITHUB_PAT" gh ...` when token authentication is needed. Keep credentials out of logs and remote URLs. If GitHub rejects workflow changes, inspect the fork-relative final workflow diff before requesting broader permission. Report the actual rejection; do not assume preserving ancestry necessarily requires retaining workflow files or a broader PAT.

**Done:** draft fork PR containing the real upstream merge, with provenance and validation recorded. On authentication failure, preserve local work and report the blocker.

## 3. Audit the compatibility gate

Audit the incoming inventory, reading enough surrounding code and fork history to establish effects. Delegate independent read-only areas when available, then verify their evidence.

Check:

- `package.json` discovery, promoted/excluded buckets, linking and distribution validation.
- Top-level/bucket READMEs, promoted docs, invocation metadata, and `ask-matt` routing.
- Tool assumptions: Claude-only APIs, subagents, hooks, browser access, paths, and authentication.
- Installation/setup changes against `setup-matt-pocock-skills`.
- Existing adaptations and their intent, using history and `docs/pi-compatibilty.md` as historical evidence, not current truth.
- Cross-cutting renames across all active readers/writers and pointers. Preserve historical references where explicitly historical; record migration requirements for consumers.

Classify **every incoming file** in the draft PR body:

| Classification | Required evidence |
| --- | --- |
| Compatible | Why no Pi adaptation is needed. Include deliberately excluded upstream-only administration here, with the exclusion rationale. |
| Already adapted | Which existing fork behavior covers the change, and evidence it survived the merge. |
| Remediation required | Concrete Pi impact and checkable acceptance criteria. |

**Done:** complete file-by-file table with evidence and acceptance criteria for every confirmed gap. Uncertainty stays in the audit until investigated, not in speculative issues.

## 4. Own and implement remediations

For each independent confirmed gap:

1. Search open and closed fork issues/PRs; reuse an exact existing item rather than duplicating it.
2. Create or update the owning issue with upstream trigger, Pi impact, evidence, and acceptance criteria.
3. Branch from the sync branch, implement only that remediation, and run focused checks plus distribution validation. Keep dependent writes sequential; stack dependencies explicitly.
4. Push to the fork and open a PR targeting the sync branch (or its dependency branch), with `Closes #<issue>` and why the adaptation belongs in this fork.

**Done:** exactly one owning issue and implementation PR per gap, with dependencies and checks explicit.

## 5. Hand off the gate

Update the sync PR with final classifications and remediation links. Mark ready only after the audit is complete, checks are reported, and every gap has an implementation PR on a branch feeding the sync branch. Ready for review does not mean remediation PRs have already merged.

Return the sync URL, endpoints/range, compatibility summary, issue/PR pairs, checks, and merge-order checklist:

1. Dependency remediation PRs.
2. Remaining remediation PRs into the sync branch.
3. Revalidate the integrated sync branch.
4. Sync PR last, using **Create a merge commit** only.
