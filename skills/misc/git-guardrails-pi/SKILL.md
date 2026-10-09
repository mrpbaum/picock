---
name: git-guardrails-pi
description: Set up a Pi extension to block dangerous git commands (push, reset --hard, clean, branch -D, checkout/restore .) before they execute. Use when the user wants to prevent destructive git operations, add git safety guardrails, or block git push/reset in Pi.
---

# Git Guardrails for Pi

Set up a Pi `tool_call` extension that blocks dangerous git commands before the `bash` tool executes them.

## Blocked commands

- `git push` (all variants, including `--force`)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

When blocked, Pi receives a tool error explaining that the command is outside the allowed authority.

## Process

### 1. Ask scope

Ask the user whether to install for:

- **This project only**: `.pi/extensions/block-dangerous-git.ts`
- **All projects**: `~/.pi/agent/extensions/block-dangerous-git.ts`

For project scope, remind the user that Pi loads project-local extensions only after the project is trusted.

### 2. Create the Pi extension

Create the selected extension file with this content:

```typescript
import { isToolCallEventType } from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const DANGEROUS_COMMANDS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /(^|[;&|()\n]\s*)git\s+push\b/, label: "git push" },
  { pattern: /(^|[;&|()\n]\s*)git\s+reset\s+--hard\b/, label: "git reset --hard" },
  { pattern: /(^|[;&|()\n]\s*)git\s+clean\b(?=[^\n;|&]*\s-[A-Za-z]*f[A-Za-z]*\b)/, label: "git clean -f" },
  { pattern: /(^|[;&|()\n]\s*)git\s+branch\s+-D\b/, label: "git branch -D" },
  { pattern: /(^|[;&|()\n]\s*)git\s+checkout\s+\.(?:\s|$|[;&|)])/, label: "git checkout ." },
  { pattern: /(^|[;&|()\n]\s*)git\s+restore\s+\.(?:\s|$|[;&|)])/, label: "git restore ." },
];

export default function gitGuardrails(pi: ExtensionAPI) {
  pi.on("tool_call", async (event) => {
    if (!isToolCallEventType("bash", event)) return;

    const command = event.input.command ?? "";
    const blocked = DANGEROUS_COMMANDS.find(({ pattern }) => pattern.test(command));

    if (!blocked) return;

    return {
      block: true,
      reason: `Blocked dangerous git command (${blocked.label}). The agent does not have authority to run: ${command.trim()}`,
    };
  });
}
```

### 3. Ask for customization

Ask whether the user wants to add or remove any blocked patterns. Edit the `DANGEROUS_COMMANDS` list accordingly.

### 4. Reload Pi

Tell the user to run:

```text
/reload
```

or restart Pi. For project-local installation, the user must trust the project before Pi loads the extension.
