---
name: git-guardrails-claude-code
description: Set up Pi tool-call guardrails to block dangerous git commands (push, reset --hard, clean, branch -D, checkout/restore .) before bash executes them. Use when the user wants git safety guardrails. The upstream name is retained, but this installs a Pi extension.
---

# Setup Git Guardrails for Pi

Preserve the upstream command-level safety workflow using Pi's `tool_call` event. The historical skill name does not require Claude Code or configure Claude hooks.

## What gets blocked

- `git push`, including force variants
- `git reset --hard`
- `git clean -f` / `git clean -fd` / `--force`
- `git branch -D`, or `--delete --force`
- `git checkout .` / `git restore .`

This is an opt-in bash-call guardrail, **not a sandbox or comprehensive shell parser**. It inspects literal commands, including common git global options and compound commands. It cannot prevent scripts, git aliases, dynamically constructed commands, other tools, external terminals, or a child session where the extension is not loaded. Conservative token matching may block safe text containing literal git command tokens. Explain these limits before installation; if stronger enforcement is required, stop and discuss an external authority boundary.

## Process

1. **Ask scope:** this project (`.pi/extensions/block-dangerous-git.ts`) or all projects (`<agent-dir>/extensions/block-dangerous-git.ts`, normally `~/.pi/agent/extensions/`). Resolve `PI_CODING_AGENT_DIR` for a custom agent directory. Project extensions load only after project trust.
2. **Install:** read the bundled [scripts/block-dangerous-git.ts](scripts/block-dangerous-git.ts), then copy it to the confirmed destination. Preserve an existing extension: inspect it and merge only with confirmation rather than overwriting unrelated policy. No Claude settings or executable shell hook is needed.
3. **Customise:** ask whether to add or remove blocked command patterns. Preserve the chosen scope and document deviations. The bundled shell hook is retained only as upstream reference material, not the Pi installation.
4. **Reload:** ask the human to run `/reload` or restart Pi. Confirm the extension loads without diagnostics and is bound in any child sessions expected to be protected.
5. **Verify interception:** in a trusted disposable repository, use the loaded Pi `bash` tool to attempt `git push --dry-run`, which must return the guardrail's block reason before git runs. Test a safe `git status --short` call too. For destructive-command testing, invoke the registered handler with synthetic events; do not run destructive commands against the user's repository. A direct matcher or shell-script test is not proof the extension is loaded.

Report scope, destination, matched commands, customisations, and which checks actually ran. Do not claim active protection before reload and live interception verification.

Example: `/skill:git-guardrails-claude-code set up project-local git guardrails`.
