# Update the upstream Pi port

This guide and the [repository-local skill](../../.pi/skills/sync-upstream/SKILL.md) maintain the complete Pi port. They are not distributed skills.

## What it does

`sync-upstream` pins an upstream skill snapshot, inventories every skill and required dependency against recorded sources, and ports changes without overwriting Pi adaptations. It copies the skill closure, not upstream repository administration or ancestry. Portable skills remain included. It prepares a normal branch and, only when authorised, an origin-only PR. It does not merge the whole upstream tree or impose a merge-commit strategy.

## When to reach for it

Start Pi in this trusted repository and run `/skill:sync-upstream`. Reach for it when a new source skill snapshot or a local compatibility change needs review. Require clean working state and verified remotes; remotes are per-clone configuration, so missing or incorrect remotes need confirmation.

Every run reads and follows the repository-only `assess-compatibilty` skill against the exact target SHA. The assessment compares upstream with upstream, not with this port. A current ledger/marker is a verified no-op; stale or inconsistent evidence blocks the update until consolidated.

## The review boundary

The [provenance manifest](./upstream-port-manifest.json) records upstream source paths and blobs for every ported file. Compare the recorded source with the target source, then port that delta into the local copy. Review unchanged dependencies as well as additions, removals, and renames.

Keep skill names, invocation policy, behavior, bundled references, and Pi adaptations together. New skills need corresponding ports. Report missing capabilities and meaningful losses before changing behavior or deleting files. A skill becoming portable stays shipped; it does not move to a second installation.

Repository-only administration is not part of skill parity. Do not copy unrelated upstream workflows, marketplace metadata, issue forms, rejection records, or pending release notes. Read relevant source surfaces as evidence only when required.

## Enriched release record

Every completed non-no-op update leaves a pending enriched Changeset following [the release guide](./changesets.md). It records incorporated upstream skill changes, Pi adaptations made/preserved/retired, affected skill/dependency coverage, source pins, and actual verification. Local-only changes retain the source pins; evidence-only updates do not claim a skill source refresh. The compatibility assessor returns evidence for the coordinator to incorporate, not a completed port verdict.

Version only during an authorised release. Sync validates the queue without consuming it. The local changelog adapter carries the complete record into the release changelog without GitHub credentials.

## Common questions

**Does this push to upstream?**
No. Upstream is read-only. The user must authorise publication; branches and PRs go only to the repository identified by origin.

**Does a compatibility fix close a ledger finding?**
No. `docs/pi-compatibilty.md` describes upstream versus Pi. This port's implementation and verification live separately.

**What about removed upstream skills or fork-only extras?**
Explain the loss and its consumers before deleting important behavior. Retained extras are explicitly distinguished from one-to-one upstream ports.

## It's working if

- Every target upstream skill and bundled dependency is accounted for.
- Portable skills stay included, and adaptations survive reviewed updates.
- Source provenance identifies the upstream content actually incorporated, not merely the newest fetched SHA.
- `npm run validate:skills`, `npm run test:maintenance`, focused runtime checks, and whitespace checks pass, with untested behavior disclosed.
- The ledger and marker agree on the exact upstream evidence endpoint.
- An enriched pending release record accounts for the source skill delta and local Pi changes together.
- The result is a normal reviewable branch or origin-only PR, with no whole-repository tracking or automatic merge.

## Where it fits

This is repository maintenance, deliberately absent from public package discovery and `ask-matt`. Its full procedure lives in `.pi/skills/sync-upstream/SKILL.md`.
