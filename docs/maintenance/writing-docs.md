# Writing Pi skill docs

Every retained skill in `skills/engineering/` and `skills/productivity/` has a human-facing page at `docs/<bucket>/<name>.md`. Re-sync it when behavior, naming, bucket, invocation, or default exposure changes. Mark pages for unregistered retained extras as archived from default exposure, rather than promising an available command. Beta/misc/deprecated skills have bucket listings but no separate human docs page.

Docs orient a human choosing a skill; they do not repeat its runbook. State what distinguishes the skill, its trigger boundary, observable results, and nearby alternatives. The owning `SKILL.md` remains authoritative.

## Page frame

Use these sections, in order, without an H1:

1. **What it does:** a short explanation and the defining constraint, such as synthesis without a new interview or one vertical red-green slice at a time.
2. **When to reach for it:** `/skill:<name>`, invocation mode, and a concrete trigger boundary. Contrast close alternatives where useful.
3. **Prerequisites:** optional, only actual setup, runtime tools, workspace artifacts, or tracker requirements.
4. **Skill-specific substance:** optional, explain the idea and why it matters, not a procedural dump.
5. **Common questions:** answer real confusion, including failure modes and known limits.
6. **It's working if:** checkable signals in the user's work or trace, not merely internal template compliance.
7. **Where it fits:** standalone, chain step, or setup, with the relevant neighbors and public `ask-matt` router.

The first, second, fifth, and sixth sections are required for a finished promoted-skill page. Keep optional sections only where they earn their space.

## Evidence for questions

Read existing questions in the page, relevant repository issues, source discussions, release records, and observed user confusion. If the source audience wiki exists locally, inspect its relevant entries. A real question beats an invented one. Do not pad a thin skill to match the question count of a popular one, or repeat historical source bugs as current port behavior.

## Pi-facing accuracy

- Use `/skill:<name>` in commands. Cross-skill dependencies name skills and describe reading/following them. Do not require Claude commands, hooks, a Skill dispatcher, or marketplace installation.
- Keep install/update instructions authoritative in the top-level README rather than copying them across every page.
- Do not claim this repository's pages are published on source's website. Existing `aihero.dev/skills-<name>` links identify source explanatory material, not the implementation here.
- Link repository-local guidance and port behavior to this repository. Use absolute `https://github.com/mrpbaum/picock/blob/main/...` links if a human skill page must be portable outside the repository; never link the port's code to source as though it were identical. Maintenance guides may use relative links.
- Label static versus runtime verification honestly. Installing a backend is not proof its workflows have run.
- Respect the user/model invocation distinction in `invocation.md` and stop unsupported delegation instead of implying a sequential fallback.

## Writing conventions

Use the skill's vocabulary: seam, deep module, tracer bullet, frontier, or portability. Explain why rather than restating steps. Put branches in lists or tables. Keep factual claims independent of author attribution. Link dictionary terms only when useful and in their actual AI-coding sense. Use normal punctuation without Unicode em dashes.

## Changes and removals

Moves/renames update paths, bucket listings, top-level links, and router together. Top-level listings and the public router follow the default package allowlist; bucket listings inventory all retained files. For an approved removal of a promoted skill, keep its human page marked archived with the release and replacement, if any. One-to-one coverage and migration impact belong in the enriched changeset, not only in documentation prose.

## Done when

- The page matches actual port behavior and invocation mode.
- Its required sections are complete, questions are evidence-grounded, and signals are observable.
- All local links, listings, and router references resolve to the intended implementation.
- No copied source install policy or website-publishing claim controls the Pi port.
- The enriched changeset records behavioral changes, coverage impact, and verification limits.
