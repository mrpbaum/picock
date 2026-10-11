Skills are organized into bucket folders under `skills/`:

- `engineering/`: daily code work
- `productivity/`: daily non-code workflow tools
- `misc/`: kept around but rarely used, not promoted
- `in-progress/`: beta snapshots retained for parity, not exposed by default
- `deprecated/`: no longer used

Repository-maintenance skills live in `.pi/skills/`, outside the distributed `skills/` tree. Keep them out of package manifests, global skill linking, public skill listings, and the `ask-matt` router. `sync-source` is available only when working in this repo: invoke `/skill:sync-source`. It uses the repository-only `assess-compatibilty` skill to keep `docs/pi-compatibilty.md` and `.pi/skills/assess-compatibilty/last-consolidated.sha` current before reviewing port updates. See [the maintenance guide](./docs/maintenance/sync-source.md).

The `engineering/setup-matt-pocock-skills` skill contains remediations for installing on non claude agents. Before making code changes to improve pi compatibilty always check if this skill impacts the changes being considered.

Every plugin-exposed skill in `engineering/` or `productivity/` (the **promoted** buckets) must have a reference in the top-level `README.md`. Skills in `misc/`, `personal/`, `in-progress/`, and `deprecated/` must not appear there.

Picock is an independent repository, not a Git fork workflow. Its only remote is its own `origin`. `https://github.com/mattpocock/skills` is the read-only source of skill snapshots, not a remote to add here. Inspect it in a separate checkout and set `PICOCK_SOURCE_CHECKOUT` for source-provenance and assessment commands. Source SHAs are evidence, not shared-ancestry requirements.

This repository maintains a complete one-to-one Pi port of the pinned source skills, including portable and non-promoted skills. Preserve source names, behavior, invocation policy, and bundled dependencies; adapt only harness mismatches. Record every source-derived skill file in `docs/maintenance/source-port-manifest.json`, with Pi-only helpers and local-only extras identified separately. Default package discovery and global linking use an explicit allowlist matching the pinned source `.claude-plugin/plugin.json`, not full-tree discovery. At source pin `49dd158d1076134a641b33efb035946536778336`, expose 27 paths while retaining all 40 skill files and their full provenance. The seven in-progress skills, four misc source skills, and two local-only extras remain unexposed. Repository-only `.pi/skills/` remain available when maintaining this repo, never distributed or globally linked.

This port is distributed for Pi, not Claude Code. Maintain skill snapshots and their required assets, not source ancestry, marketplace metadata, issue forms, or repository administration. Source evidence is read separately; do not reintroduce its repository scaffolding. The top-level README is authoritative for Pi package installation and `/skill:<name>` invocation.

Every skill-port update or Pi adaptation needs an enriched Changeset following [the release guide](./docs/maintenance/changesets.md): source changes, Pi adaptations, coverage, provenance, and verification are recorded together. `sync-source` maintains this record during every non-no-op update. Keep inherited source release notes outside the active `.changeset/` queue.

Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.

Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line description, with the skill name linked to its `SKILL.md`. The promoted buckets' `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**; non-promoted bucket `README.md`s (`misc/`, `in-progress/`) use a flat list.

Skills in `engineering/` and `productivity/` also have a human-facing docs page at `docs/<bucket>/<skill-name>.md` (the docs tree mirrors those two bucket folders under `skills/`). The source collection's `https://aihero.dev/skills-<skill-name>` pages are explanatory references, not a publishing destination promised for this port. When you add, rename, or change the behaviour of a skill in `engineering/` or `productivity/`, create or re-sync its docs page following [docs/maintenance/writing-docs.md](./docs/maintenance/writing-docs.md). A finished page carries four sections: **What it does**, **When to reach for it**, **Common questions**, and **It's working if**. `writing-docs.md` holds the template, the section order, and where to hunt for the questions. Skills in the non-promoted buckets (`misc/`, `in-progress/`, `deprecated/`) get **no** docs page. The one exception is a promoted skill removed outright: its page stays, marked archived (see `writing-docs.md`).

Every `SKILL.md` is either user-invoked (`disable-model-invocation: true` plus `policy.allow_implicit_invocation: false` in `agents/openai.yaml`, reachable only by the human) or model-invoked (model- or user-reachable). See [docs/maintenance/invocation.md](./docs/maintenance/invocation.md).

[`ask-matt`](./skills/engineering/ask-matt/SKILL.md) is the router that maps every distributed user-reachable skill and how they relate. The same trigger that re-syncs a docs page applies to it: whenever you add, rename, remove, or change how a user-reachable skill fits the flows, re-read `ask-matt`'s `SKILL.md` and update it so the map stays accurate: a new skill it never mentions, or a stale one it still routes to, is a router that lies.

To (re)link the source-plugin allowlist into local non-Claude harness skill directories such as `~/.agents/skills`, run `scripts/link-skills.sh`. Each exposed entry is a symlink into this repo, so a `git pull` keeps installed skills current; re-run the script after changing the allowlist or adding, removing, or renaming an exposed skill.

Write prose with commas, colons, periods, parentheses, or conjunctions as the sentence requires. Do not use the Unicode em dash character.

No em-dashes anywhere in this repo's prose (`SKILL.md` files, docs, `README.md`, `CHANGELOG.md`, ADRs, changesets, code comments). Where a sentence reaches for one, rewrite it instead with a comma, colon, period, parentheses, or a conjunction, whichever the sentence actually wants; never do a blind character substitution.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues for `mrpbaum/picock`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical names, unchanged. See `docs/agents/triage-labels.md`. Issues are judged against [`SCOPE.md`](./SCOPE.md).

### Domain docs

Single-context: root `GLOSSARY.md` and `docs/adr/`. See `docs/agents/domain.md`.
