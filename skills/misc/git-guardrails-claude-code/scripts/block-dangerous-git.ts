// Conservative command-level guardrail, not a shell parser or sandbox.
// This file is intentionally valid JavaScript too, for model-free handler tests.
export function blockedGitCommand(command) {
  // Treat quoted words as one token and inspect each literal git invocation.
  const tokens = command.match(/"(?:\\.|[^"\\])*"|'[^']*'|[^\s;&|()]+|[;&|()]/g) ?? [];
  const unquote = (word) => word.replace(/^(['"])(.*)\1$/, "$2");
  for (let i = 0; i < tokens.length; i++) {
    if (unquote(tokens[i]) !== "git") continue;
    let cursor = i + 1;
    while (cursor < tokens.length) {
      const option = unquote(tokens[cursor]);
      if (["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--config-env"].includes(option)) {
        cursor += 2;
      } else if (/^(?:-[Cc].+|--(?:git-dir|work-tree|namespace|config-env)=.+)$/.test(option)) {
        cursor++;
      } else if (["--no-pager", "--paginate", "--bare", "--literal-pathspecs", "--no-optional-locks"].includes(option)) {
        cursor++;
      } else {
        break;
      }
    }
    const subcommand = unquote(tokens[cursor] ?? "");
    const args = [];
    for (let j = cursor + 1; j < tokens.length && !/^[;&|()]$/.test(tokens[j]); j++) {
      args.push(unquote(tokens[j]));
    }
    if (subcommand === "push") return "git push";
    if (subcommand === "reset" && args.includes("--hard")) return "git reset --hard";
    if (subcommand === "clean" && args.some((arg) => /^-[^-]*f/.test(arg) || arg === "--force")) return "git clean -f";
    if (subcommand === "branch" && (args.some((arg) => /^-[^-]*D/.test(arg)) || (args.includes("--delete") && args.includes("--force")))) return "git branch -D";
    if (["checkout", "restore"].includes(subcommand) && args.includes(".")) return `git ${subcommand} .`;
  }
  return undefined;
}

export default function gitGuardrails(pi) {
  pi.on("tool_call", async (event) => {
    if (event.toolName !== "bash" || typeof event.input?.command !== "string") return;
    const blocked = blockedGitCommand(event.input.command);
    if (!blocked) return;
    return {
      block: true,
      reason: `Blocked dangerous git command (${blocked}). This bash call is outside the allowed authority.`,
    };
  });
}
