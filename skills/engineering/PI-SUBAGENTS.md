# Required Pi subagent backend

This port requires **`@tintinweb/pi-subagents`**. It is the sole supported Pi backend for subagent workflows; similarly named tools from another extension are not interchangeable.

The reviewed reference is `0.20.0`, requiring Pi `>=1.1.0`. Install with `pi install npm:@tintinweb/pi-subagents@0.20.0`, then restart or reload. Before dispatch, verify its `Agent`, `get_subagent_result`, `steer_subagent`, `/agents`, and required agent types/capabilities are available. If not, stop the affected workflow, report the missing prerequisite, and give the installation command. Never silently substitute sequential passes.

## Launch and isolation

- `Agent` requires `subagent_type`, `prompt`, and `description`. Use `general-purpose` for write-capable research, implementation, and review; `Explore` for read-oriented exploration and `Plan` for read-oriented design. Shell access is not a filesystem sandbox.
- Give each child one bounded outcome, explicit allowed writes, source pointers, verification, and commit expectations. Children are leaves unless narrowly configured otherwise. They do not push, merge, or deploy without explicit authority.
- Choose an exact available authenticated `provider/model-id` and supported `thinking` level deliberately. Inspect effective agent frontmatter: its pinned model, thinking, context, background, and isolation values override caller requests. A missing/disabled type can fall back to a general-purpose agent; verify dispatch or configure `fallbackSubagent: "none"` to fail closed, preserving other settings.
- Fresh independent reviews/designs use `inherit_context: false`, separate briefs, and no competing results. A general-purpose agent still inherits the parent's system prompt, not its whole conversation by default. Provide standards, spec, glossary, and reference paths explicitly. Separate sessions are context isolation, not cross-family independence.
- Reviewers examining uncommitted changes run in the source checkout without worktree isolation. Freeze parent writes during their review. Worktrees copy only committed HEAD.

## Completion and lifecycle

- Set `run_in_background: false` for results needed inline. Launch independent review/design calls together so they run in parallel.
- Set `run_in_background: true` for nonblocking research and implementers. It returns an ID; completion notifications may be partial groups or previews. Track every required worker, then use `get_subagent_result` for full results after notification. `wait: true` is a real join barrier, not a polling loop. Never sleep or repeatedly check status.
- `steer_subagent` redirects a running worker. Resume a completed session through `Agent({ resume: <id>, ... })`. The human stops background workers through `/agents`. Cancelling a result wait stops the wait, not the worker.
- Errors, stopped/aborted runs, and turn-limit wrap-ups are partial outcomes. Verify artifacts and tests before considering the task done.

## Skills and nesting

- Resolve bundled references relative to the originating skill directory. Pass verified absolute `SKILL.md` and helper paths when briefing children.
- Named skill preloading does not search package-cache roots and rejects symlinks. For package-installed or linked skills, have children read verified absolute paths rather than assuming preloading works. Keep filesystem paths to installed instructions separate from project artifact paths.
- Nesting is default-off. `allowed_subagents` in a custom definition and `maxSubagentDepth` govern it. Children own only their nested children, which are stopped when the owner settles. Prefer leaf workers; the top-level coordinator launches required closing reviews. If nesting is explicitly enabled, allow only the needed types and wait before settling.
- `isolated: true` disables extensions and skills. It is not the filesystem setting `isolation: "worktree"`.

## Parallel writers and integration

- Verify `worktreeIsolation` is enabled and agent frontmatter permits it. Disabled isolation can downgrade a request to a shared-checkout run; stop rather than risking overlapping writers.
- Use `isolation: "worktree"` for parallel writers. The backend creates a detached copy of the spawning checkout's committed HEAD. Commit/check out the intended integration tip before each new frontier and require children to report their base. Uncommitted parent changes are not copied.
- On normal completion, the backend preserves changed work and child commits on a returned `pi-agent-*` branch, then removes the temporary worktree. No changes may mean no preserved branch. Use the returned branch and inspect its diff; never guess names or link removed worktree paths.
- Automatic preservation commits use `--no-verify`, so they do not prove hooks or tests passed. The coordinator owns verification, serial integration, conflict resolution, tracker updates, and deliberate branch cleanup. Preserve unintegrated work and verify artifacts on failed/cancelled runs; cleanup is best-effort on errors.

## Schedules

When supported and enabled, `Agent` accepts interval, cron, or one-shot `schedule` values. Schedules create fresh background workers and cannot combine with `resume` or `inherit_context`. They are session-scoped: reset on `/new`, restore on `/resume`, and require a live process. They are not durable unattended infrastructure. Inspect and cancel through `/agents`.

These instructions reflect the pinned reference contract, not a claim that any installed version/configuration has passed workflow tests. Check the live schema and installed documentation when they differ. Package installation alone is not end-to-end verification.
