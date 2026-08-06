## What it does

`sync-upstream` brings changes from `mattpocock/skills` into the `p-baum/picock` fork and opens a draft sync pull request. It treats Pi compatibility as a gate: upstream changes are classified before the sync is declared ready, and confirmed gaps become linked issue/PR pairs rather than notes left for later.

## When to reach for it

In Pi, invoke it with `/skill:sync-upstream`. In Claude Code and harnesses where skills.sh installs bare commands, use `/sync-upstream`. The agent won't reach for it on its own.

Reach for it whenever this fork needs to catch up with upstream while preserving its Pi-specific distribution and harness adaptations.

## Prerequisites

Run it in the `p-baum/picock` repository with clean working state, `origin` pointing to the fork, `upstream` pointing to `mattpocock/skills`, and GitHub CLI access capable of pushing branches and creating issues and pull requests.

## The compatibility gate

The upstream merge first becomes a draft PR. Every changed file is then classified as compatible, already adapted, or requiring remediation. The audit covers skill discovery, invocation syntax, manifests, linking, setup behavior, tool assumptions, and prior Pi adaptations.

Confirmed gaps receive separate issues and implementation PRs stacked into the sync branch. The merge order is deliberate: remediation PRs first, sync PR last.

The final sync PR must be merged with GitHub's **Create a merge commit** option. Squash-merge or rebase-merge can copy upstream's files without preserving upstream's commit ancestry, which leaves GitHub's fork UI saying the fork is still behind upstream.

## It's working if

- The sync PR names the exact upstream commit range.
- Every changed file has an evidence-backed compatibility classification.
- Each real compatibility gap has one issue and one focused PR.
- The sync remains draft until the compatibility gate is complete.
- After the sync PR is merged with a merge commit, `upstream/main` is an ancestor of the fork's main branch and GitHub no longer reports the fork as behind for those upstream commits.

## Where it fits

This is periodic fork maintenance rather than feature delivery. It complements [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills), whose installation and configuration behavior is one of the compatibility surfaces being protected. See [ask-matt](https://aihero.dev/skills-ask-matt) for the map of the wider skill set.
