# Required Pi subagent backend

This fork requires **`@tintinweb/pi-subagents`**. It is the sole supported Pi backend for subagent workflows; another extension exposing similarly named tools is not an interchangeable substitute.

Install it with `pi install npm:@tintinweb/pi-subagents`, then restart Pi or reload extensions. Before dispatch, verify this backend is loaded and its required tools and agent types are available. If not, stop the affected workflow, report the missing prerequisite, and give the installation command. Do not silently replace isolated agents with sequential passes or perform delegated work in the parent session.

## Dispatch contract

- Use its `Agent` tool. `general-purpose` is the implementer/reviewer type; `Explore` is for read-only exploration.
- Set `run_in_background: false` when results are needed inline, such as parallel review/design passes. Set it to `true` for background research or implementers; the tool returns an ID and delivers completion notifications. Use `get_subagent_result` for full results when needed, not a polling loop.
- Give each agent one bounded outcome, source pointers, allowed writes, and verification expectations. Keep nested delegation disabled unless deliberately required and supported by the configured agent definition.
- For parallel writers, use the backend's `isolation: "worktree"` support. Follow its live tool schema and installed documentation for supported worktree/session options and cleanup. Do not copy lifecycle APIs or ownership rules from another host.
- Check the committed starting base, completed diff, and verification evidence before integration. Serialize writes to the integration branch. Preserve dirty or unintegrated work during cleanup.

These are the supported backend's documented conventions, not a claim that every installed version/configuration exposes every capability. If a required capability is unavailable, stop and identify it. Package installation does not prove a workflow has been exercised successfully.
