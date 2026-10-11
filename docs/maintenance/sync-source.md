# Update the source Pi port

This guide and the [repository-local skill](../../.pi/skills/sync-source/SKILL.md) maintain the complete Pi port. They are not distributed skills.

## What it does

`sync-source` pins a source skill snapshot, inventories every skill and required dependency against recorded sources, and ports changes without overwriting Pi adaptations. It copies the skill closure, not source repository administration or ancestry. Portable skills remain included. It prepares a normal branch and, only when authorised, an origin-only PR. It does not merge the whole source tree or impose a merge-commit strategy.

## When to reach for it

Start Pi in this trusted repository and run `/skill:sync-source`. Reach for it when a new source skill snapshot or a local compatibility change needs review. Require clean working state and a verified picock origin. Resolve the source URL from the manifest in a separate checkout, with `PICOCK_SOURCE_CHECKOUT` pointing to it for provenance and assessment checks. Do not add a source remote here or require source ancestry. Confirm any origin or source-URL change.

Every run reads and follows the repository-only `assess-compatibilty` skill against the exact target SHA. The assessment compares source with source, not with this port. A current ledger/marker is a verified no-op; stale or inconsistent evidence blocks the update until consolidated.

## The review boundary

The [provenance manifest](./source-port-manifest.json) records source paths and blobs for every ported file. Compare the recorded source with the target source, then port that delta into the local copy. Review unchanged dependencies as well as additions, removals, and renames.

Keep skill names, invocation policy, behavior, bundled references, and Pi adaptations together. New skills need corresponding ports. Retain the complete skill/dependency closure and per-file provenance, but match default package discovery and global linking to an explicit allowlist of paths in the target source `.claude-plugin/plugin.json`. Read that file as exposure evidence without importing Claude plugin scaffolding. Retained non-promoted skills and local-only extras remain unregistered by default; the public router recommends only exposed skills. Source invocation flags remain unchanged. Report missing capabilities and meaningful losses before changing behavior or deleting files. A skill becoming portable stays retained; it does not move to a second installation.

Repository-only administration is not part of skill parity. Do not copy unrelated source workflows, marketplace metadata, issue forms, rejection records, or pending release notes. Read relevant source surfaces as evidence only when required.

## Enriched release record

Every completed non-no-op update leaves a pending enriched Changeset following [the release guide](./changesets.md). It records incorporated source skill changes, Pi adaptations made/preserved/retired, affected skill/dependency coverage, source pins, and actual verification. Local-only changes retain the source pins; evidence-only updates do not claim a skill source refresh. The compatibility assessor returns evidence for the coordinator to incorporate, not a completed port verdict.

Version only during an authorised release. Sync validates the queue without consuming it. The local changelog adapter carries the complete record into the release changelog without GitHub credentials.

## Common questions

**Does this push to source?**
No. Source is read-only. The user must authorise publication; branches and PRs go only to the repository identified by origin.

**Does a compatibility fix close a ledger finding?**
No. `docs/pi-compatibilty.md` describes source versus Pi. This port's implementation and verification live separately.

**What about removed source skills or local-only extras?**
Explain the loss and its consumers before deleting important behavior. Retained extras are explicitly distinguished from one-to-one source ports.

## It's working if

- Every target source skill and bundled dependency is retained and accounted for, with default discovery and linking matching the source-plugin allowlist.
- Portable skills stay included, and adaptations survive reviewed updates.
- Source provenance identifies the source content actually incorporated, not merely the newest fetched SHA.
- `npm run validate:skills`, `npm run test:maintenance`, focused runtime checks, and whitespace checks pass, with untested behavior disclosed.
- The ledger and marker agree on the exact source evidence endpoint.
- An enriched pending release record accounts for the source skill delta and local Pi changes together.
- The result is a normal reviewable branch or origin-only PR, with no whole-repository tracking or automatic merge.

## Where it fits

This is repository maintenance, deliberately absent from public package discovery and `ask-matt`. Its full procedure lives in `.pi/skills/sync-source/SKILL.md`.
