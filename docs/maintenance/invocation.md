# Pi skill invocation

Preserve each upstream skill's invocation mode in the one-to-one port.

- **User-invoked:** set `disable-model-invocation: true`. The human invokes `/skill:<name>`; the skill is absent from Pi's implicit model catalogue. Recommend these skills to the human, rather than implicitly running them as dependencies.
- **Model-invoked:** omit that flag. The model reads and follows `SKILL.md` when the task fits. The human can also invoke `/skill:<name>` explicitly.

This is routing policy, not filesystem access control. A hidden user-invoked skill still exists on disk. A missing catalogue entry alone does not prove it is uninstalled.

Keep upstream `agents/openai.yaml` metadata alongside its skill; for user-invoked skills its `policy.allow_implicit_invocation: false` must agree with frontmatter. Pi does not use this Codex metadata to enforce invocation.

## Composition

Name dependencies in prose and explicitly read and follow their instructions. Resolve bundled files relative to the owning skill. Use absolute installed instruction paths for children when the required subagent backend cannot preload package-cache or symlinked skills by name.

A user-invoked skill can use a model-invoked dependency, but recommends another user-invoked skill to the human. The public `ask-matt` router recommends commands; it does not execute them.

Reading an existing glossary is a context pointer. Actively challenging terminology and writing glossary/ADR changes uses the `domain-modeling` discipline.

## Repository boundaries

Promoted bucket and top-level listings group skills by invocation mode. Non-promoted skills remain distributed but use flat bucket listings. Repository-only `.pi/skills/` maintenance tools stay outside package discovery, global linking, and `ask-matt`.
