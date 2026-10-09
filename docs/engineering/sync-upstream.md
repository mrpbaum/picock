## What it does

`sync-upstream` brings skill improvements from `mattpocock/skills` into this Pi fork and opens a draft sync pull request. Upstream is read-only; branches, issues, and PRs are created only in the fork identified by `origin`. Upstream-only issue-management and publishing workflows are excluded, while Pi-facing improvements and upstream ancestry are preserved. It treats Pi compatibility as a gate: upstream changes are classified before the sync is declared ready, and confirmed gaps become linked issue/PR pairs rather than notes left for later.

## When to reach for it

In Pi, invoke it with `/skill:sync-upstream`. In Claude Code and harnesses where skills.sh installs bare commands, use `/sync-upstream`. The agent won't reach for it on its own.

Reach for it whenever this fork needs to catch up with upstream while preserving its Pi-specific distribution and harness adaptations.

## Prerequisites

Run it in this fork with clean working state, `origin` pointing to the fork, and GitHub access capable of pushing branches and creating issues and pull requests. If the local clone lacks `upstream`, the skill offers to add `https://github.com/mattpocock/skills.git` after confirmation.

## The compatibility gate

The upstream merge first becomes a draft PR. Every changed file is then classified as compatible, already adapted, or requiring remediation. The audit covers skill discovery, invocation syntax, manifests, linking, setup behavior, tool assumptions, and prior Pi adaptations.

Confirmed gaps receive separate issues and implementation PRs stacked into the sync branch. The merge order is deliberate: remediation PRs first, sync PR last.

The final sync PR must be merged with GitHub's **Create a merge commit** option. Squash-merge or rebase-merge can copy upstream's files without preserving upstream's commit ancestry, which leaves GitHub's fork UI saying the fork is still behind upstream.

## Common questions

**Why is `upstream` missing on another machine?**
Git remotes are per-clone configuration in `.git/config`, not shared repository content. The skill checks each clone and offers to configure the missing remote.

**Does this push anything to upstream or install its administration workflows?**
No. It fetches upstream improvements and pushes only to your fork. Incoming issue-management or publishing workflows are excluded unless they demonstrably support Pi consumption. Existing fork automation is preserved.

**Do we lose upstream history when unwanted workflows are removed?**
No. A merge commit preserves upstream ancestry independently of the files retained in its final tree. The final PR must still use GitHub's Create a merge commit option.

## It's working if

- The sync PR names the exact upstream commit range.
- Every changed file has an evidence-backed compatibility classification.
- Each real compatibility gap has one issue and one focused PR.
- The sync remains draft until the compatibility gate is complete.
- Only the fork receives pushed branches and PRs; upstream-only administration is absent from the resulting tree.
- After the sync PR is merged with a merge commit, the recorded upstream endpoint is an ancestor of the fork's default branch.

## Where it fits

This is periodic fork maintenance rather than feature delivery. It complements [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills), whose installation and configuration behavior is one of the compatibility surfaces being protected. See [ask-matt](https://aihero.dev/skills-ask-matt) for the map of the wider skill set.
