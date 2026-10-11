---
"picock": minor
---

## Provenance

Source baseline: `none`
Source target: `49dd158d1076134a641b33efb035946536778336`

Initial complete Pi port release record for the [reviewed upstream snapshot](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336), upstream package 1.3.1. Per-file sources and classifications are in `docs/maintenance/upstream-port-manifest.json`. This records the port implemented on this branch, not the latest upstream HEAD or a whole-repository merge.

## Upstream changes

Include all 38 upstream skills and their 108 bundled source files at the reviewed snapshot, including portable skills and beta/misc workflows. Preserve skill names and upstream user/model invocation policy. Restore upstream `diagnosing-bugs` secret redaction and remove the unrelated fork post-mortem addition.

The inherited upstream release notes remain historical evidence in `docs/maintenance/upstream-release-notes/`; they are not individually queued as new Pi releases. The initial source inventory, rather than a newly imported upstream commit range, defines this release.

## Pi adaptations

Translate skill composition to reading/following instructions (PI-002), skill invocation to `/skill:<name>` (PI-004), and session restarts to `/new` (PI-005). Context-size figures are heuristics.

Preserve isolated review/design, asynchronous research, and worktree implementation through the required `@tintinweb/pi-subagents` backend (PI-003). Wayfinder launches leaf researchers and uses returned branch artifacts rather than guessed names. Adapt setup and TypeScript boundary setup to Pi context-file precedence, including coexistence and overrides (PI-007).

Port `claude-handoff` to fresh Pi background workers and `git-guardrails-claude-code` to opt-in Pi bash-call interception while retaining upstream names (PI-006). Guardrails are command-level, not a sandbox. Put argument examples in skill text (PI-009), and document the Pi package lifecycle and separately installed backend (PI-008).

## Skill coverage

The complete inventory is 38 upstream ports plus retained fork-only `resolving-merge-conflicts` and `git-guardrails-pi`, for 40 distributed skills. The guardrail extra is an alias of the canonical upstream-named Pi port. No skills were deleted. Portable dependencies such as `domain-modeling` remain available in the same package.

Changes affect the public router, wrappers, setup, review, design, research, implementation, wayfinder, handoff, guardrails, beta chief-of-staff and loop workflows, shared backend contract, docs, package discovery, and safe local linking. The manifest classifies every bundled upstream file and identifies Pi-only helpers separately. Repository-only maintenance skills remain outside distribution and public routing.

## Verification

`npm run validate:skills` passed: complete distribution, provenance, upstream name/invocation parity, bundled references, router coverage, promoted docs, backend pointers, safe linking, and guardrail handler cases.

Model-free integration against Pi 1.1.0 loaded 40 skills without diagnostics, checked implicit invocation visibility, seven context-file states, and actual extension event-runner interception. The compatibility ledger and marker remain at the reviewed upstream SHA; local fixes do not close upstream findings.

The subagent reference documentation is 0.20.0. Live model-driven delegation, explicit command expansion, actual setup edits, worktree lifecycle, scheduling, background handoff, and end-to-end bash guardrail execution have not been certified. See `docs/maintenance/pi-port.md` for acceptance limits.
