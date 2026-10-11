---
"picock": major
---

Match default Pi skill exposure to Matt's Claude plugin instead of discovering every retained skill snapshot.

## Provenance

Source baseline: `49dd158d1076134a641b33efb035946536778336`
Source target: `49dd158d1076134a641b33efb035946536778336`

This is a local-only exposure correction against the existing source snapshot. The allowlist is evidenced by the [pinned source plugin manifest](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/.claude-plugin/plugin.json), not by README promotion or source ancestry.

## Source changes

No source skill updates are incorporated. All 38 source skills and their bundled dependencies remain retained, with invocation flags unchanged. The source evidence ledger and assessment marker remain unchanged.

## Pi adaptations

Replace recursive package discovery with the source plugin's 27 explicit paths. Local linking consumes the same allowlist and removes obsolete symlinks owned by this checkout, preserving unrelated links and real directories. Default discovery no longer registers beta, miscellaneous, or local-only skills, including explicit commands. This user-approved narrowing of previously available commands is recorded as a major change. The public router and exposure guidance now describe only the default plugin surface. The retained conflict-resolution page is marked archived from default exposure. Repository maintenance tools remain intentionally project-local, outside package discovery.

## Skill coverage

Retain all 38 source ports and the two local-only extras, but expose only the 27 source plugin skills: 11 model-reachable and 16 explicit-only. Remove default exposure of chief-of-staff, claude-handoff, loop-me, setup-ts-deep-modules, writing-beats, writing-fragments, writing-shape, git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit, resolving-merge-conflicts, and git-guardrails-pi. No skill files or dependencies are deleted. Re-sync ask-matt and its human-facing documentation to avoid routing to unregistered commands.

## Verification

The distribution validator compares package paths directly with the pinned source plugin manifest and exercises old full-tree link migration, idempotence, preservation of unrelated links and real directories, and refusal to replace real directories. Pi 1.1.0's actual package resolver and skill loader expose exactly 27 skills, including 11 automatic skills, while direct snapshot discovery still validates all 40 retained skills without diagnostics. Context-file selection and synthetic extension event interception also pass. No model-driven workflows or end-to-end Claude installation were executed. `npm run validate:skills`, `npm run test:maintenance`, the Pi 1.1.0 runtime check, and `git diff --check` pass. Disposable release testing verifies the approved major bump from 1.3.1 to 2.0.0 without consuming the real queue or changing the package version.
