---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

Read `docs/agents/issue-tracker.md` before fetching or changing work items. If it is missing, stop and tell the user to run the `setup-matt-pocock-skills` skill (in Pi, `/skill:setup-matt-pocock-skills`). Follow its configured GitHub PR, GitLab merge-request, local Markdown, or custom tracker workflow and completion gates.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

Inspect the available subagent and worktree tools before starting. This skill requires isolated implementers; if the harness cannot provide them, stop and offer the user the `implement` skill per ticket instead of pretending to run concurrent work. Use background implementers when supported, following the host's lifecycle and result-delivery rules. The coordinator owns integration, verification, publication, and worktree cleanup.

## Steps

1. Fetch the spec and tickets through the configured tracker and understand the task graph. Compute the in-run frontier from tickets verified and integrated on the integration branch, not just tracker closure counts: PR-linked tickets may stay open until final merge.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create the integration branch from the project's intended base. If the configured tracker provides a review-request surface, or the user asks for one, open a draft PR or merge request after the first integration in step 5. Use the tracker's linking/closing syntax. Otherwise record the branch in the tracker without inventing a PR surface.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. Each implementer subagent:
   - starts from the recorded committed integration-branch tip in its own worktree; if the base is wrong, reports it to the coordinator instead of resetting potentially dirty work;
   - reads and applies the `tdd` skill to build the ticket;
   - runs the ticket's checks, commits its work, and reports its base/head SHAs and verification evidence. It does not push, integrate other branches, or remove worktrees unless the host and coordinator explicitly authorize that task.

5. Once an implementer completes, inspect its diff and evidence, integrate it on the integration branch, and run relevant checks. Serialize integration writes. A dedicated merger may perform this bounded task only when the host supports it and the coordinator explicitly authorizes it. Reconcile conflicts against the current integration tip; parallel results are not guaranteed fast-forwards.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, read and apply the `code-review` skill on the integration branch. Fix all issues raised by the code review in a single **implementer subagent**.

8. Follow the configured completion gates. Mark an existing PR or merge request ready only after verification; leave PR-linked issues open until its merge. For local/custom trackers, record completion and evidence before any allowed closure. Report the integration branch and remaining human gates.

9. After all implementers have exited and integration is verified, clean up worktrees through the host's supported tools and authorization rules. Preserve dirty/unintegrated work; report any retained workspace.
