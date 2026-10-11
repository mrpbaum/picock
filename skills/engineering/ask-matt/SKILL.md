---
name: ask-matt
description: Ask which skill or flow fits your situation. A router over the skills in this repo.
disable-model-invocation: true
---

# Ask Matt

Invoke `/skill:ask-matt` when you don't remember which skill fits. Before stating what a skill does or recommending a step be skipped, read its `SKILL.md`: this map is orientation, not the procedure.

Recommend `/skill:<name>` for human invocation. Load model-invoked dependencies by reading and following their instructions. User-invoked skills are recommendations to the human, not implicit calls.

Pi delegation requires `@tintinweb/pi-subagents`; follow the [shared backend contract](../PI-SUBAGENTS.md). Stop when required capabilities are unavailable. Route only the 27 skills exposed by the pinned source plugin allowlist. Retained non-promoted files, local-only extras, and repository-maintenance skills are outside this public map.

## The main flow: idea → ship

A **flow** is a path through the skills. Most work follows this main flow; on-ramps generate work that joins it.

1. **`/skill:grill-with-docs`** sharpens an idea by interview when you have a working directory. It retains domain language in `GLOSSARY.md` and decisions in ADRs. Without a workspace, use `/skill:grill-me`. Both use the model-invoked `grilling` primitive; only the stateful wrapper leaves the domain paper trail.
2. **Can conversation settle the question?** If you need a runnable answer (state, business logic, or a UI to see), detour through `/skill:prototype`:
   - `/skill:handoff` out to a fresh session in the prototype directory.
   - Build throwaway code to answer one question.
   - `/skill:handoff` back the findings, then reference them from the idea thread.
3. **Is this a multi-session build?**
   - **Yes:** `/skill:to-spec` synthesises the conversation, then `/skill:to-tickets` splits the spec into tracer-bullet tickets with **blocking edges**. Work blockers-first with `/skill:implement` per ticket, using `/new` between self-contained tickets, or use `/skill:implement-spec` to run the **task graph** across the ready **frontier** onto one **integration branch**.
   - **No:** `/skill:implement` in the current context.

   Both drive `tdd` one red-green slice at a time and close with `code-review`, whose Standards and Spec axes stay separate. `implement` reviews each ticket; `implement-spec` reviews the integrated result. Reach for `/skill:tdd` directly for concrete test-first work, or `/skill:code-review` for a branch/PR review since a fixed point.

   When writing a PR body, the model-invoked `pr` skill supplies the smallest visual summary, before/after evidence, and one-way/two-way door call.
4. **`/skill:retro`** improves the agent's environment after the build, especially when it went sideways: navigation, deterministic checks, standards, steering files, and tooling. Mechanical mistakes become checks; judgement calls become standards.

### Context hygiene

Keep grilling, spec, and tickets in one unbroken context where possible. Each ticket implementation can then start fresh. Run retro in the session it reviews; after a restart, provide that session's log.

The **[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)** is a reasoning-quality heuristic, not a fixed Pi token budget. The source ~150k figure is model-dependent. Check actual usage and limits. If the session cannot safely reach tickets, compact at the nearest phase boundary with instructions preserving the decisions.

## On-ramps

- **Raw bugs and requests from other people:** `/skill:triage` moves issues through triage roles to agent-ready work. Do not triage tickets you created with `to-tickets`; those are already ready.
- **Something is broken:** `/skill:diagnosing-bugs` builds a **tight feedback loop** that goes red on the exact bug before theorising, minimises it, and fixes it with a regression test. Recommend `/skill:retro` afterwards. Missing test seams may justify `/skill:improve-codebase-architecture`.
- **A huge, foggy effort:** `/skill:wayfinder` charts a shared map of **decision tickets**, not deliverables, resolving one per session except parallel research. Save this slower, denser flow for work that cannot fit in one interview. When the map clears, hand its linked decisions to `/skill:to-spec`, then `to-tickets` and `implement`. Jump straight to implementation only if the effort proved genuinely small.

## Codebase health and vocabulary

- **`/skill:improve-codebase-architecture`:** survey **deepening opportunities** during upkeep. Picking a candidate creates an idea for the main flow; `codebase-design` is the bench for designing its shape.
- **`/skill:domain-modeling`:** sharpen domain language, resolve overloaded terms, and record hard-to-reverse decisions. `grill-with-docs` applies it to maintain the glossary.
- **`/skill:codebase-design`:** deep-module vocabulary: interface, depth, seam, adapter, leverage, locality. Use it when module shape is the problem, including its independent design-it-twice branch. TDD and architecture surveys share this vocabulary.

## Phase boundaries

Read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) for the ordered decision tree. Decide at a boundary; mid-phase, continue or delegate a bounded side task.

1. **Continue:** preserve the conversation as a primary source.
2. **`/new`:** start fresh when preceding context is disposable. Persisted sessions remain resumable with `/resume`.
3. **`/skill:handoff`:** write a portable file for a new harness, directory, colleague, or mid-phase side task.
4. **Subagent:** send bounded AFK work to its own context and receive a report.
5. **`/compact`:** summarise relevant context within the active session. The default at the bottom of the tree, not the first reach.

## Standalone

- **`/skill:grill-me`:** stateless interviewing when no repo/workspace is involved. With a workspace, prefer `grill-with-docs`.
- **`/skill:grilling`:** the reusable interview discipline: rounds, frontier, facts are the agent's job, decisions are the human's. Use directly for an interview without a wrapper.
- **`/skill:prototype`:** answer one design question with throwaway code. Retain the prototype as a primary source on a `prototype/<name>` branch and link it from the implementation issue; throwaway constrains the implementation, not preservation.
- **`/skill:research`:** delegate primary-source reading to a background worker that saves cited Markdown. Keep working while it reads; its findings feed the main flow rather than replace it.
- **`/skill:to-questionnaire`:** interview the user about the send (recipient and needed answer), then write questions for someone else's knowledge gap. The reply feeds grilling or spec synthesis.
- **`/skill:wizard`:** generate a human-run interactive bash guide for dashboard clicks, credentials, provisioning, and cutovers the agent cannot perform itself.
- **`/skill:wait-what`:** re-pitch a message that did not land, adding missing context in the project's domain vocabulary.
- **`/skill:teach`:** learn across sessions using the directory as a stateful teaching workspace.
- **`/skill:writing-for-agents`:** reference for skills, context files, and documents agents follow.

## Precondition

Recommend `/skill:setup-matt-pocock-skills` before the first engineering flow to configure issue tracking, triage labels, and domain documentation. Custom trackers work too.
