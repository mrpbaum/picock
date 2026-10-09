# Handoff: stop forking upstream, vendor the adapted skills

## Next session

Turn this repository from a full fork of `mattpocock/skills` into a Pi package that contains only the skills whose instructions must change for Pi, plus the two repository-maintenance skills and the compatibility ledger. Do not implement a SQLite index. Do not merge upstream.

The strategy is already decided. Do not reopen the fork-versus-extract choice unless a concrete blocker appears.

## Suggested skills

- `writing-for-agents`, before editing `AGENTS.md` or either maintenance skill.
- `assess-compatibilty`, to keep `docs/pi-compatibilty.md` an upstream-versus-Pi ledger. Do not use it to classify this tree.
- Do not run `sync-upstream` until that skill has been rewritten. Its current procedure merges the whole upstream tree and must not be executed.

## Current facts

- Working repo: `/home/paul/dev/picock`
- `origin`: `git@github.com:mrpbaum/picock.git`
- `upstream`: `https://github.com/mattpocock/skills.git`
- `main` is `2763767`, exactly four commits ahead of upstream `49dd158d1076134a641b33efb035946536778336` (package `1.3.1`). That SHA is also the baseline in `docs/pi-compatibilty.md` and `.pi/skills/assess-compatibilty/last-consolidated.sha`.
- Upstream is current with that pin. Nothing on upstream is missing from `main`.
- The tree delta versus that pin is 95 files. Much of it is legitimate Pi adaptation. The rest is fork baggage: restored `resolving-merge-conflicts`, deleted upstream workflows, rewritten `SCOPE.md` and issue templates, changelog punctuation, and a `diagnosing-bugs` behavior change the ledger does not ask for.
- `docs/pi-compatibilty.md` is the issue list. It is not a checklist of fixes already applied here. Fork fixes do not resolve its findings.

## Goal

`main` should no longer try to be "upstream plus patches". It should be the extracted adaptation closure:

- skills whose own text must change for Pi
- skills those adapted skills load, when the upstream copy would give the wrong instructions
- `skills/engineering/PI-SUBAGENTS.md`
- `.pi/skills/sync-upstream/` and `.pi/skills/assess-compatibilty/`
- `docs/pi-compatibilty.md` and this maintenance doc

Portable upstream skills stay upstream. Users install those from `mattpocock/skills`. This package replaces only the names it vendors. Pi keeps the first discovered copy of a skill name, so a vendored name must not also be loaded from upstream.

## Vendored set

Include these, adapted, not as untouched upstream copies:

- Skill-tool callers: `grill-with-docs`, `grill-me`, `implement`, `implement-spec`, `improve-codebase-architecture`, `retro`, `tdd`, `triage`, `wayfinder`, `handoff`
- Subagent workflows and their shared contract: `code-review`, `research`, `grilling`, `codebase-design` (including design-it-twice), `ask-matt`, `PI-SUBAGENTS.md`
- `setup-matt-pocock-skills`, because PI-007 is still unfixed in the current tree: the skill still prefers `CLAUDE.md` whenever that file exists

Do not vendor:

- `resolving-merge-conflicts`. Upstream removed it. The ledger calls those examples stale.
- `diagnosing-bugs`, unless you copy it unchanged from upstream. The current fork deletes its secret-redaction section and adds a post-mortem. That is not a Pi compatibility fix. Prefer leaving it upstream.
- `git-guardrails-claude-code` and `git-guardrails-pi`. Exclude them unless a later, explicit request asks for the Pi guardrail. The ledger's default for PI-006 is to keep those skills out of the Pi set.
- Portable skills with no additional harness mismatch: `domain-modeling`, `pr`, `prototype`, `to-spec`, `to-tickets`, `wizard`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`, and the rest of the upstream tree.
- `in-progress/`, `misc/`, `deprecated/`, `personal/`, `.claude-plugin/`, upstream issue workflows, `SCOPE.md` as upstream policy, and the upstream changelog.

`domain-modeling` is loaded by vendored skills, but the ledger does not require its text to change. Leave it upstream and tell the adapted callers to load the installed `domain-modeling` skill. Do not vendor it just to make a relative link work.

## Adaptations the vendored copies still owe

Use `docs/pi-compatibilty.md` as the requirement source. Current `main` is only a partial implementation.

- PI-002: no "call the Skill tool". Say to read and follow the named skill.
- PI-003: point at `PI-SUBAGENTS.md`. Do not offer a silent sequential fallback. For `wayfinder`, the parent launches research workers directly. Do not tell a child to invoke `research` in a way that launches another researcher. Do not invent `research/<name>` branches when the backend returns `pi-agent-*` branches.
- PI-004: Pi invocation is `/skill:<name>`. Bare `/name` is only for harnesses where skills.sh installed that command. `ask-matt` still has many bare route labels. `PHASE-BOUNDARIES.md` must be adapted if `ask-matt` is vendored, because it still says `/clear`.
- PI-005: `/new` or a fresh session, not `/clear`. Keep `/compact` as compaction. Treat 150k and 100K figures as heuristics.
- PI-007: setup must write the context file Pi will actually load. If `AGENTS.md` and `CLAUDE.md` both exist, Pi reads `AGENTS.md`. Do not keep the current "always edit `CLAUDE.md` if it exists" rule.
- PI-009: useful argument examples belong in the skill text. Do not rely on `argument-hint` or `agents/openai.yaml` for Pi.

PI-001 is mostly gone once non-promoted buckets are not in the tree. Do not add an exclusion filter whose only job is hiding files you no longer ship.

## Maintenance skills

Keep both under `.pi/skills/`, out of package discovery, public listings, and `ask-matt`.

`assess-compatibilty` is already scoped correctly: compare upstream commits with upstream commits, never with this tree. Update its wording so the result is a drift list for the vendored set, not a focus list for a fork merge audit. It still writes only `docs/pi-compatibilty.md` and `last-consolidated.sha`. Fork fixes still do not close ledger findings.

Rewrite `sync-upstream`. Delete the merge procedure: no `--no-ff`, no "Create a merge commit", no workflow-exclusion step, no requirement to classify every upstream file. The new loop is:

1. Pin upstream and run `assess-compatibilty` against that exact SHA.
2. Diff each vendored file against the upstream file and SHA it was copied from.
3. Port upstream improvements into the adapted copy. Do not overwrite an adaptation with upstream text.
4. If the ledger says a new skill entered the adaptation closure, add that skill. If a vendored skill no longer needs adaptation, say so and wait for confirmation before deleting it.
5. Open a normal PR on `origin` only. Never push to upstream.

Add a small manifest, in git, mapping each vendored path to its upstream path and source SHA or blob. Markdown or JSON is enough. Do not use SQLite.

## Docs and repo instructions

- Keep `docs/pi-compatibilty.md` as the upstream ledger. Do not turn it into a status page for this repo.
- Update `AGENTS.md` so the promoted-bucket, docs-page, and README rules apply only to skills this repo actually distributes. Do not require pages for upstream skills that are not here.
- Replace the README install story. This is a Pi package, not a Claude plugin and not a skills.sh mirror. The current install line says `git:github.com/p-baum/picock` while `origin` is `mrpbaum/picock`, and `package.json` still points at `mattpocock/skills`. Fix those to this repository.
- Human docs, if kept, use `/skill:<name>` and must not claim this tree is the upstream plugin.
- This handoff can be deleted or archived after the migration PR lands. It is not a permanent guide.

## How to land it

Work on a branch from current `main`. Do not rewrite published history. Do not merge `upstream/main` into the branch. The resulting tree will not contain most upstream files, and that is intentional. A merge commit that preserves upstream ancestry is the old strategy.

Leave `main` publishable until the branch is reviewed. Do not push or open a PR unless the user asks in that session.

## Done when

- The distributed tree contains only the vendored set above, plus the files required to install and explain it.
- No vendored skill tells the model to call a Claude `Skill` tool, `/clear`, or a missing subagent backend.
- `setup-matt-pocock-skills` selects the context file Pi loads, including the case where `AGENTS.md` and `CLAUDE.md` both exist.
- `sync-upstream` cannot merge upstream. `assess-compatibilty` still refuses to treat this tree as upstream evidence.
- The ledger baseline is still an upstream SHA, and a manifest records the upstream source of every vendored file.
- `resolving-merge-conflicts`, the `diagnosing-bugs` fork behavior, deleted-workflow policy, and upstream issue templates are gone.
- Validation covers the vendored set only. Do not require `claude plugin validate`.
