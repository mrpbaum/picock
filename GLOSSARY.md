# Picock

A collection of agent skills distributed by this port for Pi. Skills are organized into buckets and consumed through per-repo configuration emitted by the `setup-matt-pocock-skills` skill (in Pi, `/skill:setup-matt-pocock-skills`).

## Language

**Source collection**:
Matt Pocock's original skill collection, consulted read-only for skill intent, content, and bundled dependencies. It is not this port's parent repository.
_Avoid_: upstream collection, parent fork

**Source snapshot**:
A reviewed revision of the **Source collection** defining which skills and bundled files the port corresponds to.
_Avoid_: upstream baseline

**Pi port**:
The independently maintained collection that preserves the **Source snapshot**'s skill intent while adapting harness-specific behavior for Pi.
_Avoid_: fork

**Local extra**:
A separately identified skill or alias maintained in the **Pi port** but absent from its **Source snapshot**.
_Avoid_: fork-only skill

**Issue tracker**:
The tool that hosts a repo's issues: GitHub Issues, Linear, a local `.scratch/` markdown convention, or similar. Skills like `to-tickets`, `to-spec`, and `triage` read from and write to it.
_Avoid_: backlog manager, backlog backend, issue host

**Issue**:
A single tracked unit of work inside an **Issue tracker**: a bug, task, spec, or slice produced by `to-tickets`.
_Avoid_: ticket (use only when quoting external systems that call them tickets, or for a **Decision ticket**, see below)

**Decision ticket**:
A `wayfinder` unit: a child **Issue** of a `wayfinder:map` holding a *question* whose resolution is a decision, not a slice of a build to execute. The **decision** qualifier is what keeps it distinct from an implementation ticket; `wayfinder` introduces the term, then uses "ticket".

**Triage role**:
A canonical state-machine label applied to an **Issue** during triage (e.g. `needs-triage`, `ready-for-afk`). Each role maps to a real label string in the **Issue tracker** via `docs/agents/triage-labels.md`.

## Relationships

- A **Pi port** corresponds to a reviewed **Source snapshot** of the **Source collection**.
- A **Local extra** belongs to the **Pi port**, not its source-parity count.

- An **Issue tracker** holds many **Issues**
- An **Issue** carries one **Triage role** at a time
- A **Decision ticket** is an **Issue** (a child of a `wayfinder:map`)

## Flagged ambiguities

- "backlog" was previously used to mean both the *tool* hosting issues and the *body of work* inside it. Resolved: the tool is the **Issue tracker**; "backlog" is no longer used as a domain term.
- "backlog backend" / "backlog manager". Resolved: collapsed into **Issue tracker**.
