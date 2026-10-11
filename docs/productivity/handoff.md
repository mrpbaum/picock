## What it does

`handoff` writes a targeted, redacted Markdown summary to the OS temporary directory so a fresh agent can continue the work. It references existing specs, plans, decisions, commits, and diffs rather than duplicating them.

Its defining constraint is **portability**, not compression. It writes a file but does not launch a new session or worker.

## When to reach for it

Invoke `/skill:handoff`, with optional instructions for the next task. The agent will not reach for it automatically. Example: `/skill:handoff explore the prototype in a separate directory`.

| Situation | Why a file helps |
| --- | --- |
| Different harness | The destination cannot see the old conversation |
| Different repository or directory | A prototype workspace is a common case |
| A colleague takes over | They need a brief they can read |
| A mid-phase side task | Another worker can take it while the original session continues |

For ordinary phase boundaries, first consider continuing, then `/new` when context is disposable, delegation for bounded work, or `/compact` to summarise within the active session. [ask-matt](https://aihero.dev/skills-ask-matt) supplies the ordered decision tree.

## What travels

The handoff carries the live task, why it matters, next steps, unresolved questions, and suggested skills. Existing artifacts appear as paths or URLs. Suggested model-invoked skills are read and followed; user-invoked ones are recommendations to the receiving human.

## Common questions

**Handoff or compact?**
Use a handoff when work must travel. `/compact` summarises older context in the active Pi session; it does not create a portable artifact. `/new` starts a fresh session, with the old persisted session still resumable through `/resume`.

**Where is the file, and can it disappear?**
Keep the absolute path reported by the agent. Temporary storage can be cleared between sessions or on reboot. Copy the file and any temporary dependencies somewhere durable if the receiver will start later or on another machine.

**How do I give it to the next agent?**
Start the receiving session and ask it to read the absolute path, then continue. Do not interpolate the summary into a shell command, where backticks and substitutions can change it. The non-promoted `claude-handoff` port is a separate workflow that actually launches a Pi background worker.

**What belongs in project context instead?**
Standing facts that remain true next month belong in the context file Pi selects, normally `AGENTS.md`, with override precedence respected. A half-finished task belongs in a handoff.

**It captures what, but not why.**
State the next task in the invocation, then review the brief. Keep unresolved assumptions labelled rather than promoting them to verified facts. A summary is lossy even when it reads confidently.

## It's working if

- A cold reader knows the task, reasoning, and next step without the original session.
- Specs and diffs are references rather than pasted duplicates.
- The absolute file path is reported and remains accessible to the receiver.
- Suggested skills fit the next task, with invocation boundaries intact.
- Secrets are redacted before writing the file.
- The original session remains usable during a side-task handoff.

## Where it fits

This is a reach-for-it-anytime standalone, especially around [prototype](https://aihero.dev/skills-prototype) work that travels to another directory and back. [ask-matt](https://aihero.dev/skills-ask-matt) distinguishes handoff from continuing, restarting, delegation, and compaction.
