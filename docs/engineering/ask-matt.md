## What it does

`ask-matt` recommends a **flow**, a path through skills, for the situation you describe. It recommends rather than starting the work, and reads a target skill's instructions before claiming what it does.

The map covers this complete Pi port, including portable skills, explicitly non-promoted workflows, and retained extras. It is not a scanner or router for arbitrary skills from other packages. Repository-only maintenance skills stay outside the map.

## When to reach for it

Invoke `/skill:ask-matt` when you know the situation but not the right workflow. The agent will not reach for it automatically.

| Situation | What it recommends |
| --- | --- |
| An idea in a repository | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), then the main build flow |
| A plan with no workspace | [grill-me](https://aihero.dev/skills-grill-me) |
| Raw requests from other people | [triage](https://aihero.dev/skills-triage), not triage of your own generated tickets |
| A hard bug | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |
| Work too foggy for one interview | [wayfinder](https://aihero.dev/skills-wayfinder) |
| A skill already chosen | Invoke that skill directly |

## Prerequisites

One installation of this package provides the routed skills. Tracker-dependent workflows require [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills). Delegating routes require `@tintinweb/pi-subagents`; they stop when its required capabilities are unavailable rather than silently switching to sequential work.

## The phase boundary

At a boundary between phases, ask in this order:

| Option | Take it when |
| --- | --- |
| Continue | The next phase needs this conversation verbatim, or fits safely in the current context |
| `/new` | Earlier context is disposable; persisted sessions remain resumable with `/resume` |
| `/skill:handoff` | The work must travel to a different harness, directory, colleague, or side task |
| Subagent | A bounded task can run without human steering |
| `/compact` | Relevant context should be summarised within the active session |

The upstream ~150k-token smart-zone figure is a heuristic. Check the selected model's limits and actual usage, not a universal Pi budget. Mid-phase, continue or delegate a bounded side task rather than compacting away the live reasoning.

## Common questions

**It says a user-invoked skill is missing.**
User-invoked skills are hidden from the automatic model catalogue. Check the installed directories and Pi discovery before concluding they are absent; use `/skill:<name>` to invoke them explicitly. Do not install a duplicate upstream copy to fix catalogue visibility.

**It described a skill incorrectly.**
The trace should show a read of that skill's `SKILL.md` before the claim. The router is a secondary source; the target instructions win when they disagree.

**Can I just get the sequence?**
Yes. Ask for a concise sequence, but retain its branches: whether there is a workspace, whether the build spans sessions, and whether a prototype is needed.

**Can it route over my own skills?**
No. The map is maintained for this collection. Put standing project preferences in the context file Pi selects, rather than modifying managed package copies that an update can overwrite.

## It's working if

- It recommends the next command and stops rather than launching a user-invoked workflow.
- Close alternatives are distinguished by your actual situation.
- Claims about target behavior are preceded by reads of their instructions.
- Session advice uses Pi commands and the actual context budget.
- Beta workflows are identified as beta, not promoted implicitly.

## Where it fits

This is a standalone router over the complete collection, not a build-chain step. Most daily routes lead to [grill-with-docs](https://aihero.dev/skills-grill-with-docs) or [triage](https://aihero.dev/skills-triage); the map then carries the work to implementation and review.
