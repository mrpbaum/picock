# In Progress

Beta. These skills are public on purpose: try them and tell me what breaks. They are distributed in this Pi package but stay outside the top-level promoted-skill listings until they graduate. They get no human docs pages and can change as upstream evolves. Invoke them with `/skill:<name>`; no second upstream installation is needed.

- **[loop-me](./loop-me/SKILL.md)**: Grill yourself into implementable workflow specs over multiple sessions, using the current directory as a stateful workspace. User-invoked.
- **[writing-beats](./writing-beats/SKILL.md)**: Shape an article as a journey of beats, choose-your-own-adventure style. Pick a starting beat, write only that beat, then pivot to the next, until the article reaches a natural end.
- **[writing-fragments](./writing-fragments/SKILL.md)**: Grilling session that mines you for fragments (heterogeneous nuggets of writing) and appends them to a single document as raw material for a future article.
- **[writing-shape](./writing-shape/SKILL.md)**: Take a markdown file of raw material and shape it into an article paragraph by paragraph, arguing format choices at each step.
- **[chief-of-staff](./chief-of-staff/SKILL.md)**: Pursue a long-running goal by coordinating subagents and improving their environment. User-invoked beta, included in the complete Pi port.
- **[claude-handoff](./claude-handoff/SKILL.md)**: Hand the current conversation off to a fresh background agent that picks up the work immediately, seeded with a handoff file via Pi's required `Agent` backend (the upstream name is retained). User-invoked.
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)**: Wire dependency-cruiser into a TypeScript repo so each package is a deep module: implementation hidden in subfolders, reachable only through its entry-point files, tests exercising it through those. User-invoked.
