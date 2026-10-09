---
name: sync-upstream
description: Sync this fork from upstream, audit the incoming delta for Pi compatibility, and open the sync and remediation pull requests.
disable-model-invocation: true
---

# Sync Upstream

Bring the fork up to date without washing away its Pi adaptations. The defining idea is a **compatibility gate**: upstream is not ready to merge until every incoming change has been checked against the fork's Pi distribution and harness behavior.

This skill is specific to the `p-baum/picock` fork of `mattpocock/skills`. The fork is distributed for Pi, not Claude Code; upstream Claude Code plugin references are not a compatibility target and can be ignored or removed when they conflict with Pi-facing docs. Use `GH_TOKEN="$PI_GITHUB_PAT" gh ...` when GitHub CLI authentication needs the fork owner's token.

## 1. Establish the sync range

- Require a clean worktree. Stop and report any local changes rather than stashing them.
- Inspect `git remote -v`; verify `origin` is the fork and `upstream` is `mattpocock/skills`. Git remotes are local checkout configuration stored in `.git/config`, so an `upstream` remote added on another machine will not appear here. If `upstream` is missing, explain that locality, then add `https://github.com/mattpocock/skills.git` as the fetch remote after confirming with the user. Repair only the `upstream` fetch remote after confirming with the user.
- Fetch `origin` and `upstream`, including pruning stale remote refs.
- Read the repository instructions and the complete `setup-matt-pocock-skills` skill before assessing compatibility.
- Identify the fork's default branch and upstream's default branch from the remotes rather than assuming `main`.
- Record the exact range `origin/<default>..upstream/<default>`, its commits, and changed files. If the range is empty, report that the fork is current and stop without creating branches, issues, or PRs.

Completion criterion: the exact upstream commit range and both endpoint SHAs are known, with a clean worktree.

## 2. Open the sync PR

- Create a fresh branch from `origin/<default>` named `sync/upstream-<YYYY-MM-DD>`, adding a numeric suffix if it already exists.
- Merge `upstream/<default>` into it with a merge commit so upstream provenance remains visible. Preserve fork-specific behavior when resolving conflicts; use the `resolving-merge-conflicts` skill when conflicts occur.
- Run the repository's relevant Pi validation, including `npm run validate:skills`. Do not run or require Claude Code plugin validation; this fork is not installed into Claude Code.
- Push the branch to `origin` and open a draft PR against the fork's default branch. The body must include the upstream range, endpoint SHAs, conflict resolutions, validation results, and this warning: **merge this PR with GitHub's "Create a merge commit" option only**.

The sync PR is an ancestry repair as well as a content sync. GitHub only stops reporting the fork as behind upstream when `upstream/<default>` is an ancestor of `origin/<default>`. Squash-merge or rebase-merge can copy the files while discarding upstream's commit ancestry, leaving the GitHub fork UI still behind. Therefore the sync branch must contain the real `--no-ff` upstream merge commit, and the final sync PR must be merged with a merge commit. Never squash, rebase, or auto-update this PR in a way that rewrites away the upstream merge commit.

The PR stays draft until the compatibility gate is complete. Never merge it.

Completion criterion: a draft sync PR exists and names the exact upstream delta.

## 3. Audit the compatibility gate

Audit only behavior introduced or changed by the upstream range, while reading enough surrounding code to understand its effect. When sub-agents are available, delegate independent areas in parallel, then verify their evidence yourself.

Check every changed skill and distribution surface against:

- Pi skill discovery in `package.json`, including promoted and excluded buckets.
- Top-level and bucket READMEs, docs pages, and `ask-matt` routing. Ignore `.claude-plugin/*` except where a change would accidentally leak into Pi-facing docs or validation.
- `scripts/link-skills.sh` and `scripts/validate-skill-distribution.mjs`.
- Invocation differences: Pi `/skill:<name>`, bare commands in skills.sh harnesses, frontmatter, and `agents/openai.yaml`.
- Tool assumptions, especially Claude-only tools, sub-agent APIs, hooks, browser access, filesystem locations, and authentication.
- Existing Pi compatibility adaptations and their intent, using repository history and `docs/pi-compatibilty-review.md` as evidence. Treat the review as historical context, not current truth.
- The `setup-matt-pocock-skills` workflow whenever an incoming change affects installation, setup, discovery, or per-repo configuration.

Classify every changed file as:

1. **Compatible**: no fork adaptation required.
2. **Already adapted**: existing fork behavior still covers it.
3. **Remediation required**: Pi would lose functionality, receive incorrect instructions, or diverge from the repository's distribution policy.

Write this file-by-file audit into the draft sync PR body. Every changed file must have a classification and evidence; a general impression is not a completed audit.

Completion criterion: every file in the upstream delta is classified and every remediation has a concrete acceptance criterion.

## 4. Raise remediation issues and PRs

For each independent remediation:

- Search open and closed issues and PRs first; update or reuse an exact existing item instead of duplicating it.
- Create a GitHub issue on `p-baum/picock` explaining the upstream trigger, Pi impact, evidence, and checkable acceptance criteria.
- Create a branch from the sync branch, implement only that remediation, and run focused checks plus the distribution validations.
- Push it and open a PR whose base is the sync branch, linking the issue with `Closes #<issue>`. Explain why the adaptation belongs in the fork rather than upstream.

Keep independent remediations in separate issue/PR pairs. If one remediation depends on another, stack it on the dependency branch and state the dependency in both PRs. Do not create speculative issues: uncertainty belongs in the sync PR audit until evidence establishes an actual compatibility gap.

Completion criterion: every required remediation has exactly one owning issue and an implementation PR, with dependencies explicit and checks reported.

## 5. Complete the gate

- Update the sync PR body with the final classification table and links to every remediation issue and PR.
- Mark the sync PR ready for review only when no remediation remains unowned and all remediation PRs target a branch that will feed into the sync branch.
- Leave a merge-order checklist: remediation PRs first, sync PR last, and the sync PR must use GitHub's **Create a merge commit** button rather than squash or rebase.
- Return the sync PR URL, upstream range, compatibility summary, issue/PR pairs, validation results, and merge order.

Never merge, close, or retarget PRs on the user's behalf.
