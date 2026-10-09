# Scope

This fork consumes upstream skill improvements for Pi. Pi discovery, installation, invocation, tool compatibility, and safe orchestration are in scope. Upstream is a read-only source; branches, issues, and pull requests belong in the fork identified by `origin`.

## Feedback

File Pi package and fork compatibility problems in this fork's Issues. Include the skill, Pi version, installation method, model, observed behavior, and expected behavior. General questions about upstream skill design can be discussed upstream, but Pi-specific support stays here.

Prefer evidence from a real session or a reproducible check. Fork remediations may include harness-specific instructions and fork-only skills when required for Pi consumption. Upstream's rejection of those changes is not a rejection by this fork.

## Distribution

- `engineering/` and `productivity/` are promoted and distributed in the Pi package.
- `in-progress/` is public beta content, excluded from the package and top-level README.
- `misc/`, `deprecated/`, and `personal/` are excluded; manual use is not a supported package route.

## Upstream policy records

The files under `.out-of-scope/` record upstream design choices. They are useful historical context, not binding fork policy when they conflict with Pi compatibility. Evaluate the concrete Pi impact instead of automatically closing a request because upstream rejected a similar concept.

## Repository automation

Upstream-only issue-management and publishing workflows are excluded. There is no automatic 14-day issue closure in this fork. Any future fork automation must demonstrably support Pi consumption and be introduced explicitly.
