---
name: claude-handoff
description: Hand the current conversation off to a fresh background agent that picks up the work immediately.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

The upstream name is retained for one-to-one correspondence, but this port launches a Pi worker, not Claude.

Follow the [required Pi backend contract](../../engineering/PI-SUBAGENTS.md). Stop before launch if the backend is unavailable. Write a handoff summary of the current conversation and save it to a unique, owner-readable file in the OS temporary directory. Then launch `Agent` with `subagent_type: "general-purpose"`, a descriptive `description` and `name` (for example `fix-login`), `run_in_background: true`, and `inherit_context: false`. Its prompt names the absolute summary path and tells it to read that file and continue the bounded task directly, without delegating again. Use the current working directory; omit worktree isolation for this handoff unless the user explicitly wants a committed-state copy.

Report the returned worker ID/name and summary path. The human manages the background worker through `/agents`; retrieve full results with `get_subagent_result` after notification. Treat failed or cancelled output as partial. Leave the summary available until the worker has read it. Temporary files can disappear on reboot, so use a durable artifact if the handoff must survive that.

Include a "suggested skills" section in the summary, naming which skills the next agent should use.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information, since the summary becomes the agent's prompt.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the summary accordingly. Example: `/skill:claude-handoff continue the login fix and run its regression tests`. Include allowed writes, verification, and commit/push authority in the summary; the worker must not infer broader authority from its fresh session.
