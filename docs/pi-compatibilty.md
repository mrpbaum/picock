# Pi compatibility of Matt Pocock's upstream skills

## Review baseline and scope

| Field | Reviewed value |
| --- | --- |
| Review date (UTC) | 2026-10-09 |
| Upstream repository | <https://github.com/mattpocock/skills> |
| Upstream ref | Remote default-branch HEAD, not a release tag |
| Upstream commit | `49dd158d1076134a641b33efb035946536778336` |
| Upstream package/plugin version | `1.3.1` (the commit, not this version alone, identifies the reviewed files) |
| Previous document baseline | `272f99b22574f50e4266791c86b9302682970e23` |
| Pi baseline | Installed `@earendil-works/pi-coding-agent` version `1.1.0` |
| Pi adaptation environment | Pi plus the required `@tintinweb/pi-subagents` extension; no assumed `Skill` dispatcher or Claude-hook adapter |
| Subagent API reference | Published `@tintinweb/pi-subagents` `0.20.0`, npm `gitHead` `13106ab6f608b3acc54185da5299ee7fbaabb6b9`; requires Pi `>=1.1.0`. This is the version inspected, not a claim about the project's installed/pinned version. |
| Method | Fresh upstream clone, review of all 38 `SKILL.md` files, bundled-reference dependency scan, install surfaces, and upstream changes since the previous baseline; isolated Pi skill-loader and package-resource checks |
| Excluded | This fork's skills, manifests, fixes, installed-package state, and working-tree changes; the required subagent dependency's published contract is reviewed separately |

Skill repository paths below refer to the **upstream snapshot**, not files in this fork. Open them beneath the [pinned upstream tree][upstream]. Extension paths refer to the separately pinned [pi-subagents source][subagents-source]. The adaptation policy now requires `@tintinweb/pi-subagents`; it is not an optional orchestrator choice. Recommendations describe changes still needed to upstream instructions, not fixes already applied here.

This is a source compatibility assessment, not an end-to-end certification. The loader checks did not invoke a model, install the skills.sh CLI, run the upstream linker, create issues, launch child agents, or exercise generated scripts. Those limits matter when distinguishing a confirmed API mismatch from likely model behavior.

## Verdict

**Upstream is loadable in Pi, but not behaviorally portable without adaptations.** A Pi manifest is optional, so its absence is not an installation failure. An unfiltered Pi git-package install discovers more skills than the Claude plugin advertises. Even the promoted subset contains calls to Claude's `Skill` tool, subagent requirements, and command examples that need translation. The required `@tintinweb/pi-subagents` dependency supplies isolated child sessions, foreground/background execution, and worktree facilities. PI-003 is therefore an **instruction/configuration adaptation requirement**, not an unmet dependency in the target environment; it remains an upstream incompatibility with bare Pi.

| ID | Severity | Status at reviewed commit | Issue |
| --- | --- | --- | --- |
| PI-001 | High | Open, route-dependent | Unfiltered Pi package discovery exposes non-promoted skills |
| PI-002 | High | Open | Composition instructions call a nonexistent default Pi `Skill` tool |
| PI-003 | High | Capability supplied by required dependency; adaptation open | Map upstream delegation to `@tintinweb/pi-subagents` and configure child skills, nesting, and worktree lifecycle |
| PI-004 | Medium | Open | Bare skill slash commands do not invoke Pi skills |
| PI-005 | Medium | Open | Session guidance uses `/clear` and model-specific context assumptions |
| PI-006 | High | Open, non-promoted only | Claude hooks and Claude background CLI do not implement Pi behavior |
| PI-007 | Medium | Open, conditional | Setup may write context into a file Pi does not select |
| PI-008 | Low | Open documentation gap | Pi package installation/update behavior is not documented alongside skills.sh |
| PI-009 | Low | Compatible with metadata loss | Argument hints and Codex UI metadata do not configure Pi |

Severity describes impact when the relevant route or workflow is used. It does not mean every invocation fails. In particular, a model may interpret a missing-tool instruction as prose and continue, but that is not reliable tool/API compatibility.

## Installation routes and discovered scope

The upstream [plugin manifest][plugin] lists **27 promoted skills**: 20 engineering and 7 productivity. Pi does not use `.claude-plugin/plugin.json` or `marketplace.json` to select package skills.

Every adapted installation also requires the subagent extension, independently of the skill installation route. Install the project's selected version through Pi's package workflow and verify that `Agent`, `get_subagent_result`, `steer_subagent`, and `/agents` are available. For reproducing the API reference in this document:

```bash
pi install npm:@tintinweb/pi-subagents@0.20.0
```

This is a reference-version example, not a change to the project's dependency pin. Reload/restart Pi after installation and check effective agent/extension settings. A declared or installed dependency that is disabled in the active session does not satisfy the workflow's runtime requirement.

| Route | Scope at this snapshot | Update/compatibility caveat |
| --- | --- | --- |
| Upstream README's skills.sh route, targeting `pi` | User-selected skills; selection matters | Explicitly offered upstream. `npx skills@latest update` updates existing selections; upstream says re-run `add` for newly added skills. This review did not execute that installer. |
| Unfiltered `pi install git:github.com/mattpocock/skills@<ref>` | Conventional `skills/` tree: 38 skills | No `pi` manifest. Pi discovers 11 non-promoted skills as well as the 27 promoted ones. |
| Pi package with user-side resource filters | Can restrict loading to the 27 promoted skills | Pi supports package resource filters even when upstream has no Pi manifest. |
| Explicit skill paths or manually linked promoted buckets | The selected directories | Pi understands nested skill directories and symlinks. Updating the source files and reloading is separate from package management. |
| Upstream `scripts/link-skills.sh` | 34 skill links per destination on a clean home: promoted plus `in-progress/` | Maintainer-only, explicitly not a supported installer. It excludes `misc/` and `deprecated/`, but includes beta skills. It does not remove stale links from earlier runs. |

### PI-001: Non-promoted skills enter unfiltered Pi discovery

**Evidence:** Upstream `package.json` has no `pi` key; `.claude-plugin/plugin.json` has 27 explicit skill entries. An isolated run of Pi's `loadSkills` over upstream `skills/`, with defaults disabled, loaded **38 skills with zero diagnostics**. Loading only `skills/engineering/` and `skills/productivity/` produced **27 skills with zero diagnostics**. Pi's installed package-resource collector independently discovered 38 unfiltered skills and enabled exactly 27 with the user-side filters shown below; no extensions, prompts, or themes were discovered.

The extra 11 are:

- `in-progress/`: `chief-of-staff`, `claude-handoff`, `loop-me`, `setup-ts-deep-modules`, `writing-beats`, `writing-fragments`, `writing-shape`.
- `misc/`: `git-guardrails-claude-code`, `migrate-to-shoehorn`, `scaffold-exercises`, `setup-pre-commit`.

At this commit there are no deprecated `SKILL.md` files or personal skills. Old examples naming deprecated QA/design skills, personal skills, or `resolving-merge-conflicts` are no longer current upstream evidence.

**Adaptation:** Select promoted skills during skills.sh installation, filter a Pi package, or propose an explicit upstream `pi.skills` allowlist. `pi-package` is a gallery-discovery keyword, not a prerequisite for installing from git. Upstream `package.json` is also `private: true`, so an npm publication must not be assumed.

A user-side Pi package declaration can select the promoted set without changing upstream:

```json
{
  "packages": [
    {
      "source": "git:github.com/mattpocock/skills@49dd158d1076134a641b33efb035946536778336",
      "skills": ["skills/engineering/**", "skills/productivity/**"]
    }
  ]
}
```

This is an illustrative entry to merge into Pi settings, not an instruction to overwrite them. It narrows discovery, not workflow dependencies. Verify the loaded set with `pi config` and startup diagnostics.

**Recheck when:** Package manifests, bucket membership, ignore rules, linker exclusions, or Pi discovery rules change. Count actual loader results, not just `find` output.

## Execution and composition

### PI-002: Claude's `Skill` tool is not Pi's skill mechanism

**Evidence:** Literal “call the Skill tool” instructions occur in these promoted skills:

- `skills/engineering/`: `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `retro`, `tdd`, `triage`, `wayfinder`.
- `skills/productivity/`: `grill-me`, `handoff` (instructions for the receiving agent).

The non-promoted `claude-handoff` and `setup-ts-deep-modules` also use this wording. Upstream `docs/engineering/implement.md`, under “It's working if”, even expects a `tdd` Skill tool call in the trace.

Default Pi has no tool named `Skill`, and `@tintinweb/pi-subagents` does not add one. Pi advertises model-invoked skills by name, description, and path, and the model loads their instructions with `read`. Explicit human invocation expands `/skill:<name>`. This mismatch remains even with the required subagent extension loaded: wrappers such as `grill-me` can be affected before any parallel work is attempted.

**Adaptation:** Replace tool-specific dispatch with “read and follow the available `grilling` skill's `SKILL.md`”, and equivalent instructions for other model-invoked dependencies. Adapt success criteria to expect a file read rather than a `Skill` tool call. Include dependencies when installing a wrapper alone.

Keep the human/model invocation distinction: `disable-model-invocation: true` removes a skill from Pi's automatic skill catalogue. A router should recommend `/skill:<user-invoked-name>` to the human rather than silently loading it as a dependency. This flag is routing behavior, not a filesystem access-control boundary.

**Dependency relevance:** Child agents can inherit skills or preload named skills through their agent definition's `skills` field. That helps deliver instructions to children; it does not translate a Claude `Skill` call. Named preloading has different discovery rules from Pi, including rejection of symlinks and no package-cache roots in its search list. See the child-contract checks under PI-003.

**Recheck when:** Any skill or helper adds cross-skill calls, dependency names change, invocation flags change, or Pi/the required extension changes skill dispatch or preloading.

### PI-003: Subagents and background agents are workflow dependencies

**Evidence:** The current instructions usually say “sub-agent” generically rather than naming Claude's `Agent` tool. Removing the literal tool name has not removed the execution requirement.

| Upstream source and locator | Required behavior | Mapping to the required dependency |
| --- | --- | --- |
| `skills/engineering/code-review/SKILL.md`, “Spawn both sub-agents in parallel” | Two foreground parallel reviews, explicitly separated to avoid context pollution | Two `Agent` calls together with `run_in_background: false` and `inherit_context: false`, distinct briefs, no cross-reviewer results. Preserve the two axes when aggregating. |
| `skills/engineering/improve-codebase-architecture/SKILL.md`, “Explore” | A subagent explores architectural friction | `Agent` with `subagent_type: "Explore"` or a configured exploration specialist; pass domain/design references explicitly. Set foreground/background mode deliberately. |
| `skills/engineering/codebase-design/DESIGN-IT-TWICE.md`, “Spawn sub-agents” | 3+ parallel agents produce radically different designs | Three or more `Agent` calls with different constraints and `inherit_context: false`; `Plan` or configured design specialists. Background calls let the user read while designs run. Compare only after all required results arrive. |
| `skills/engineering/research/SKILL.md`, opening instruction | Background research while the parent continues working | `Agent` with `run_in_background: true`; use `general-purpose` or a research specialist with write and retrieval capabilities, not the default read-oriented `Explore` for saving notes. |
| `skills/engineering/implement-spec/SKILL.md`, steps 2, 4–7, 9 | Exploration, implementer, and merger agents; per-ticket worktrees/branches, integration, and cleanup | Background implementers with `isolation: "worktree"`; collect the returned branches and serialize merges into the integration branch. Rewrite upstream's named-branch/worktree ownership and cleanup steps to match the extension lifecycle described below. |
| `skills/engineering/wayfinder/SKILL.md`, “Research” ticket type and charting step 5 | Parallel research agents with branch artifacts; the child is told to invoke `research`, which itself launches a background agent | Parent launches background research workers directly. Tell each worker to research/save findings itself, avoiding nested redispatch. If using worktrees, use returned `pi-agent-*` branches as the artifacts or deliberately rename them; push/link only the preserved branch, not an ephemeral worktree path. |
| `skills/productivity/grilling/SKILL.md`, facts paragraph | Nonblocking exploration agents while other interview questions continue | Background `Explore` calls; keep independent frontier questions moving. Resume dependent questions only when their facts arrive. |
| `skills/engineering/ask-matt/SKILL.md` and `PHASE-BOUNDARIES.md` | Recommendations to delegate AFK work or split mid-phase work into subagents | Route AFK delegation to `Agent`, with a bounded task and explicit foreground/background choice; normal phase-boundary commands still need PI-005 translation. |
| `skills/in-progress/chief-of-staff/SKILL.md`, “Subagents” | All work runs in background subagents; recurring schedules are explicitly harness-dependent | Background `Agent` calls. The extension's `schedule` field can support recurring agents when scheduling is enabled, but jobs are session-scoped, not an always-on scheduler. |

`implement` also inherits this dependency through its required closing `code-review`. The interview wrappers and skills that compose `grilling` inherit its fact-finding dependency when that branch is needed.

**Pi behavior:** Bare Pi deliberately has no built-in subagent orchestrator. The required extension supplies the `Agent`, `get_subagent_result`, and `steer_subagent` tools plus `/agents` management. Each child runs in a separate session. This satisfies the missing execution-capability requirement, but installing it does not rewrite upstream skills, guarantee child configuration, or resolve PI-002.

**Adaptation contract (`0.20.0` reference):**

- **Launch:** `Agent` requires `subagent_type`, `prompt`, and `description`. Set `model` and `thinking` deliberately using available models. Agent-file frontmatter is authoritative over caller values, so inspect the effective configuration. Built-in types are `general-purpose`, `Explore`, and `Plan`; specialized implementer/merger/research types must be defined if named. A missing/disabled type can fall back to `general-purpose`; check dispatch or configure `fallbackSubagent: "none"` to fail closed.
- **Foreground versus background:** Set `run_in_background` explicitly. `false` blocks and returns the full output inline; multiple calls in one turn can run concurrently. `true` returns an ID, then delivers completion notifications with previews. Retrieve full results through `get_subagent_result` after notification, or use its `wait: true` when a genuine barrier is required. Do not poll/sleep for completion. A grouped notification can be partial, so track each required child rather than treating the first notification as completion of the whole batch.
- **Independent contexts:** Use `inherit_context: false` and fresh children for independent reviews/designs. The built-in `general-purpose` uses `prompt_mode: append`, inheriting the parent's system prompt, not automatically its whole conversation. A custom `prompt_mode: replace` can reduce inherited instruction/context coupling; supply the relevant standards, glossary, spec, and skill references explicitly. Separate sessions do not by themselves provide cross-model-family independence.
- **Child skills and tools:** `skills: true` is the default inheritance mode; `skills: false` disables it; a list preloads only named skills. Verify actual skill visibility with the chosen installation route. The named preloader searches project/global skill directories, rejects symlinks, and does not search Pi package-cache roots directly. For symlinked or package-installed skills, pass verified absolute `SKILL.md` and helper-reference paths and have the worker read them, or arrange supported non-symlink copies. Preloaded content alone should not be assumed to retain the base path for relative helper links. `isolated: true` disables extensions and skills; it is **not** the filesystem isolation setting `isolation: "worktree"`. Write-capable research and implementation agents need appropriate tools; a `replace` prompt also needs explicit project/context-file pointers (PI-007).
- **Nested delegation:** It is default-off. A child does not automatically get another unrestricted `Agent` tool merely because the parent has the extension. Custom agent definitions must opt in through `allowed_subagents`, subject to `maxSubagentDepth` (default 2). Children are ownership-scoped and stopped when their owning agent finishes. Prefer leaf research workers for `wayfinder`; for an implementer that must run parallel `code-review`, either let the top-level coordinator launch reviewers or deliberately configure a narrowly allowed nested review type and wait for it before the implementer settles.
- **Worktree lifecycle:** Enable `worktreeIsolation` and check agent frontmatter before relying on `isolation: "worktree"`. Disabling worktree isolation can downgrade a request to a normal shared-checkout run. The extension creates a detached copy at the spawning checkout's committed `HEAD`, not a caller-selected base/branch, and does not copy uncommitted changes. For `implement-spec`, commit/check out the current integration tip before spawning the next frontier and require children to verify their base. It preserves changed/child-committed work on a returned `pi-agent-*` branch and normally removes the temporary worktree on completion; use the returned branch, not a guessed branch name or vanished path. The coordinator still owns review, tests, merge/conflict handling, tracker updates, and intentional branch cleanup. Automatic preservation commits use `--no-verify`, so they are not proof that hooks/tests passed. Cleanup is best-effort on errors; verify artifact preservation on failed/cancelled runs rather than assuming every outcome leaves a usable branch.
- **Stop/resume:** `steer_subagent` redirects a running child; `Agent({ resume: <id>, ... })` continues a completed child session. `/agents` can stop background agents. Cancelling a `get_subagent_result` wait stops the wait, not the child. Treat stopped, aborted, and turn-limited output as partial and do not close a ticket solely because an agent returned text.
- **Scripted orchestration:** `SubagentWorkflow` is available for dynamic fan-out/task graphs when enabled. Its `agent()` options differ from `Agent`: `agentType` and `effort` correspond to type/thinking, and `parallel()` joins independent results. This is an implementation option, not an upstream requirement or an automatic translation. The script has no filesystem/network access, so merge/test operations must happen in workers. Handle failed/skipped calls returning `null`; a generic review-panel synthesis must not merge/rerank upstream `code-review`'s two axes.
- **Schedules:** `Agent` also supports `schedule` when enabled, relevant to `chief-of-staff`. Jobs reset on `/new`, restore on `/resume`, and require a live session/process to fire. They cannot be combined with `resume` or `inherit_context`; they are not scheduled workflows or durable unattended infrastructure.

**Dependency missing or disabled:** Treat this as a setup/configuration error and restore the required dependency before claiming the adapted workflow works. A sequential variant is only an explicit user-approved degraded mode, not the normal fallback: separate headings within one session do not preserve isolated review contexts, nonblocking research, or concurrency.

**Recheck when:** Upstream orchestration changes, or Pi/the required extension changes its tool schemas, agent defaults, child skill discovery, nesting, notifications, scheduling, or worktree preservation. Record the exact extension version and relevant settings. Test two-axis isolation, nonblocking delivery, branch bases, full result retrieval, cancellation, and cleanup in addition to successful completion.

## Commands and session behavior

### PI-004: Bare skill commands need a Pi translation

**Evidence:** Upstream `README.md`, `skills/engineering/ask-matt/SKILL.md`, setup precondition messages, and human-facing docs use `/grill-me`, `/tdd`, `/setup-matt-pocock-skills`, and other bare skill commands.

**Pi behavior:** The skill command is `/skill:<frontmatter-name>`, for example:

```text
/skill:setup-matt-pocock-skills
/skill:grill-with-docs
/skill:tdd implement checkout behavior
```

A bare `/tdd` does not expand the skill unless a separate command or prompt template supplies that name. A model might still infer intent from text, which is not the same as explicit invocation. `enableSkillCommands` controls command discovery; the reviewed Pi docs say manually entered `/skill:<name>` commands still work.

**Adaptation:** Translate skill commands in Pi-facing help and router recommendations. Translate internal composition to skill-file loading (PI-002). Preserve actual Pi built-in commands, such as `/compact` and `/reload`, instead of blindly prefixing every slash command.

**Recheck when:** Skills are added/renamed, router prose changes, or commands become extension-provided aliases.

### PI-005: `/clear` is not a default Pi session command

**Evidence:** Upstream `ask-matt/SKILL.md`, `ask-matt/PHASE-BOUNDARIES.md`, and related `ask-matt`, `implement`, and `handoff` docs recommend clearing context with `/clear`. The router/reference also describe a roughly 150k-token “smart zone”; `wayfinder` sizes a ticket to a 100K-token session.

**Pi behavior:** `/new` starts a fresh session; `/resume` can return to saved sessions. `/compact [instructions]` is supported, but reduces the active context rather than necessarily creating a separate session as upstream's wording suggests. Capacity and automatic compaction depend on the selected model and settings, not a universal token budget.

**Adaptation:** Use `/new` for a disposable-context restart, preserve `/compact` where appropriate, and consult actual context usage/model limits. Treat upstream's numeric budgets as heuristics, not Pi guarantees. `handoff` itself writes a portable file and does not need to launch a new session.

**Recheck when:** Router/session guidance, model assumptions, Pi commands, or compaction semantics change.

## Claude-specific facilities and context files

### PI-006: Guardrail hooks and background CLI target Claude, not Pi

**Evidence:**

- `skills/misc/git-guardrails-claude-code/SKILL.md`, “Add hook to settings”, writes `.claude/settings.json` or `~/.claude/settings.json` `PreToolUse` hooks, with a `Bash` matcher and `$CLAUDE_PROJECT_DIR` for project scope.
- `skills/in-progress/claude-handoff/SKILL.md`, opening instruction, executes `claude --bg --name ...` and says to manage jobs with `claude agents`.

**Impact:** The hook script can pass its direct shell test while providing **no protection for Pi tool calls**. The handoff either needs the Claude CLI or launches Claude rather than Pi. Both are outside the promoted plugin list, but PI-001 makes them visible through unfiltered Pi discovery; the developer linker also exposes `claude-handoff`.

**Adaptation:** Exclude them from a Pi skill set, or port them deliberately. Pi extensions can block calls through the `tool_call` event, but that is not compatibility with Claude hook JSON. Specify which execution paths a guardrail protects; shell-pattern checks are not an operating-system sandbox. For `claude-handoff`, the fixed dependency supplies a concrete port: save the handoff file, then launch a background `Agent` with instructions to read it, using the intended agent type and context policy. Replace `claude agents` management with `/agents` and the extension's result/steering/resume tools. This does not port the guardrail hooks; `@tintinweb/pi-subagents` is not a Claude-hook adapter.

**Recheck when:** These skills are removed/promoted, CLI instructions change, or Pi imports Claude hook configuration.

### PI-007: Setup can prefer a context file that Pi skips

**Evidence:** `skills/engineering/setup-matt-pocock-skills/SKILL.md`, “Pick the file to edit”, always selects `CLAUDE.md` when it exists, even if `AGENTS.md` also exists. The beta `setup-ts-deep-modules` has the same preference when writing a navigation pointer. `retro` loosely describes both filenames as being pushed into any agent's context.

**Pi behavior:** Pi can read `CLAUDE.md`; that filename alone is **not** a compatibility failure. In the reviewed loader, a directory selects the first existing candidate in this order: `AGENTS.override.md`, `AGENTS.md`, `AGENTS.MD`, `CLAUDE.md`, `CLAUDE.MD`. It does not combine every candidate in that directory. Consequently, if `AGENTS.md` and `CLAUDE.md` coexist, setup can write tracker/domain pointers into `CLAUDE.md` while Pi reads `AGENTS.md`. An override file can create the same problem.

**Adaptation:** Select the context file the active harness actually loads, preserving other agents' files. A Pi-only convention can prefer `AGENTS.md`, but the important requirement is that the written pointers reach Pi. Run `/reload` after editing context files. Also verify setup's optional triage detection: user-invoked skills are not in the model's automatic catalogue, so the sibling-folder check or an explicit user confirmation may be needed with filtered/copied installations.

**Recheck when:** Setup/file-selection rules, invocation visibility, or Pi context-file precedence change. Check the cases “only CLAUDE”, “only AGENTS”, “both”, and “override present”.

## Installation documentation and metadata

### PI-008: skills.sh is supported upstream, but not a Pi package lifecycle

**Evidence:** Upstream `README.md`, “Any other agent, or editable files”, explicitly lists `pi` for `npx skills@latest add mattpocock/skills -a <agent>`. `.agents/install-block.md` explicitly prefers that route over an unfiltered `pi install` because of the extra buckets. Current docs do not universally repeat the old install block: upstream now relies on an external install widget for docs pages.

This is a valid offered installation route, not proof that the skills cannot install on Pi. It is also not managed by Pi's package commands. Installing editable skills does not translate their instructions or activate the required subagent extension. Install/manage that dependency through Pi separately, regardless of whether the skills come from skills.sh or a Pi git package.

**Adaptation:** Document the distinction if adding a Pi package route:

- Install a selected git ref with `pi install git:github.com/mattpocock/skills@<ref>` and restrict resources as in PI-001.
- Inspect/manage configured packages with `pi list` and `pi config`.
- In Pi `1.1.0`, `pi update --extensions` updates packages; bare `pi update` updates Pi itself. A pinned git commit/tag does not move to a newer release during reconciliation. Change the configured ref intentionally for a new reviewed release.
- Reload resources with `/reload` after source changes. Avoid multiple independent installations of the same skill name: Pi retains the first discovered copy and warns on collisions between distinct files.

Do not present automatic marketplace updates, skills.sh updates, and Pi package updates as interchangeable.

**Recheck when:** Canonical install blocks, installer targeting, plugin release policy, or Pi package commands change. Validate the chosen route in a clean environment before claiming it tested.

### PI-009: Metadata loss is not a skill load failure

**Evidence:** `argument-hint` appears in `handoff`, `teach`, `claude-handoff`, and `loop-me`. Every current skill also has `agents/openai.yaml`, carrying Codex-oriented UI metadata and, for user-invoked skills, invocation policy.

**Pi behavior:** The reviewed Pi skill loader consumes `SKILL.md` name, description, and `disable-model-invocation`. It does not use `argument-hint` to provide command hints or `agents/openai.yaml` to configure discovery/UI/policy. Arguments after `/skill:<name>` are still appended as a user request.

**Adaptation:** Put useful argument examples in Pi-facing help. Preserve `disable-model-invocation: true` in `SKILL.md` for user-invoked skills; do not rely solely on Codex YAML. No frontmatter rewrite is needed merely to make these 38 files load.

**Recheck when:** Metadata fields, frontmatter flags, or Pi's parser change. Re-run validation and check explicit versus automatic invocation separately.

## Coverage ledger

Every current upstream skill appears below. All load successfully in the isolated Pi loader check. “No additional mismatch” means no skill-specific harness mismatch found in source review, not that the workflow was executed or that external prerequisites are installed. PI-004 applies to bare-command examples across the collection; PI-008 and PI-009 apply to distribution and metadata as described above.

| Bucket | Skills | Specific findings or prerequisites |
| --- | --- | --- |
| Engineering | `ask-matt` | PI-003, PI-004, PI-005; recommendations inherit target-skill dependencies |
| Engineering | `code-review`, `research` | PI-003 |
| Engineering | `codebase-design` | PI-003 only for the design-it-twice branch; vocabulary itself is portable |
| Engineering | `grill-with-docs`, `implement`, `triage` | PI-002; inherited PI-003 through `grilling` or closing `code-review` |
| Engineering | `implement-spec`, `improve-codebase-architecture`, `wayfinder` | PI-002 and PI-003; required pi-subagents mapping covers dispatch, but integration-tip bases, returned-branch artifacts, child skills, and nesting need explicit adaptation |
| Engineering | `retro`, `tdd` | PI-002; `retro` also needs the appropriate session log/context files |
| Engineering | `setup-matt-pocock-skills` | PI-007; tracker CLI/authentication as applicable |
| Engineering | `diagnosing-bugs`, `domain-modeling`, `pr`, `prototype`, `to-spec`, `to-tickets`, `wizard` | No additional mismatch; repository/test tools, tracker access, browser or human-run bash scripts as applicable |
| Productivity | `grill-me` | PI-002 and inherited PI-003 |
| Productivity | `grilling` | PI-003 when fact-finding delegation is needed |
| Productivity | `handoff` | PI-002 in suggested-skill instructions; PI-005 in human-facing docs; document creation itself is portable |
| Productivity | `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents` | No additional mismatch; `teach` needs trusted-source retrieval and browser access for HTML lessons |
| In-progress | `chief-of-staff` | PI-001, PI-003; required pi-subagents supplies background dispatch and session-scoped schedules, not always-on scheduling |
| In-progress | `claude-handoff` | PI-001, PI-002, PI-006; background CLI can be ported to the required dependency's `Agent` and `/agents` lifecycle |
| In-progress | `setup-ts-deep-modules` | PI-001, PI-002, PI-007; Node/package manager/dependency-cruiser prerequisites |
| In-progress | `loop-me`, `writing-beats`, `writing-fragments`, `writing-shape` | PI-001; no additional hard mismatch found; `loop-me` names `/grilling`, whose workflow has PI-003 |
| Misc | `git-guardrails-claude-code` | PI-001, PI-006 |
| Misc | `migrate-to-shoehorn`, `scaffold-exercises`, `setup-pre-commit` | PI-001; project-specific Node tooling, including `ai-hero-cli` for `scaffold-exercises`, not a Claude/Pi API difference |

### Portable features and shared prerequisites

- The isolated loader emitted no frontmatter diagnostics for either the full tree or the promoted subset. Names are unique and descriptions present. The full tree has 23 user-invoked and 15 model-invoked skills; the promoted subset has 16 and 11 respectively.
- Pi supports recursive skill discovery and skill-directory-relative bundled references. Workspace output paths still resolve from the working directory; upstream `teach` explicitly distinguishes those from format-reference paths.
- Default Pi has file and shell tools, not built-in web-search or browser-automation tools. Primary-source research/teaching and some debugging or visual verification therefore need an available CLI, extension, MCP server, or human browser. This is an environment prerequisite, not evidence that every research task requires Claude's `WebSearch` tool.
- `gh`/`glab` authentication, tracker/API features, build/test tools, bash, browser opening, and network access are shared prerequisites. A skill package does not provision them. `wizard` explicitly hands its interactive script to the human; it should not be treated as needing interactive input through Pi's `bash` tool.
- Bundled shell scripts and HTML prototypes are not inherently Claude-specific. The exception is the guardrail's hook integration (PI-006).

## Updating this review against a new upstream release

Keep this document a ledger of **upstream versus Pi plus the required pi-subagents dependency**, not a checklist of this fork's remediation progress. Preserve the distinction between bare-Pi mismatches and capabilities supplied by the fixed dependency. Installing the dependency does not mean an upstream skill's instructions have been adapted.

1. **Pin the baselines.** Resolve the requested upstream tag/ref, record its full SHA, package/plugin versions, and review date. If reviewing default-branch HEAD, say so. Record `pi --version`, the exact Pi package/docs version, and the exact `@tintinweb/pi-subagents` version/source used to review its contract. The API reference version is not an implied dependency pin. Use a fresh clone or detached upstream checkout outside this fork.
2. **Diff upstream only.** Compare the previous recorded upstream SHA with the new SHA. Read changed files plus their called skills and bundled references, including unchanged dependencies. Include `package.json`, `.claude-plugin/*`, `README.md`, `.agents/install-block.md`, `scripts/link-skills.sh`, and human-facing docs. Never substitute a diff against this fork's main branch.
3. **Recount discovery.** Inventory all `SKILL.md` files and compare the plugin list, promoted buckets, and actual Pi loader results. Re-run the isolated loader with default/user/project skill discovery disabled so this fork and installed skills cannot affect the result. Record counts and diagnostics. If testing an installer, use an isolated home/settings directory and record its exact version and selected skills.
4. **Scan, then read in context.** Search all skill bodies, helpers, scripts, and docs for dispatch, agents, hooks, commands, context filenames, metadata, tool names, and environment assumptions. Search hits are candidates, not findings; distinguish literal tool requirements from examples and domain vocabulary.
5. **Recheck Pi contracts.** Read the pinned Pi skills, packages, configuration, slash-command, and CLI references. Inspect the installed loader where documentation leaves precedence or metadata behavior unclear. Read the required pi-subagents README/tool schemas and relevant sources for skill loading, nesting, worktrees, and schedules. Separate bare Pi, required pi-subagents, and any other optional extensions; record extension versions and effective settings used in runtime tests.
6. **Update stable IDs.** Retain `PI-001` through `PI-009`. Mark findings `open`, `capability supplied by required dependency; adaptation open`, `resolved upstream`, `resolved by Pi/dependency`, or `not applicable`, with the relevant SHA/version and reason. Allocate a new ID for a genuinely new mismatch. Move removed skills out of the current coverage ledger, retaining a short history note when needed. A proposed workaround or a fix in this fork does not resolve an upstream finding.
7. **Verify claims at their stated level.** At minimum, re-run loader diagnostics and source checks. For runtime claims, test explicit command expansion, wrapper composition, context-file selection, and affected orchestration in a clean Pi session. For the required dependency, test parallel foreground isolation, asynchronous full-result delivery, child skill/helper resolution, nested ownership when used, integration-base selection, preserved branches, and cancellation/cleanup. Test guardrail interception rather than only its script's exit code; the subagent dependency does not implement those hooks. Disclose anything not executed.

Useful commands from the isolated upstream checkout:

```bash
previous=49dd158d1076134a641b33efb035946536778336
current=$(git rev-parse HEAD)
git diff --name-status "$previous" "$current" -- \
  package.json .claude-plugin README.md .agents scripts skills docs
find skills -name SKILL.md -not -path '*/node_modules/*' | sort
rg -n 'Skill tool|Agent tool|Task tool|sub.?agent|background agent|claude |PreToolUse|CLAUDE_PROJECT_DIR|/clear|argument-hint|allowed-tools|disable-model-invocation|CLAUDE\.md|AGENTS\.md' \
  skills docs README.md package.json scripts .agents
```

**Completion criterion:** Every skill present at the new upstream SHA is accounted for; every still-applicable finding has current upstream evidence and a pinned Pi/required-dependency contract; discovery counts are reproduced; resolved findings identify why they no longer apply; untested behavior is labelled; no statement of current compatibility depends on this fork.

## Changes from the previous document

- Made `@tintinweb/pi-subagents` the fixed adaptation dependency, referencing its published `0.20.0` contract. PI-003 now distinguishes supplied execution capabilities from remaining instruction/configuration work; its per-workflow mapping and child-contract checks identify where the dependency is relevant. No adapted skill or extension runtime was exercised in this documentation update.
- Corrected “not Pi-package compatible as-is” to “loadable, with discovery and execution mismatches”. A Pi manifest is optional.
- Updated the plugin count from 20 to 27. The full-tree count is still 38, but membership changed substantially.
- Corrected linker scope: it now excludes both `misc/` and `deprecated/`, deliberately retaining `in-progress/`.
- Removed obsolete deprecated/personal/merge-conflict examples and old literal `Agent` tool claims from the current findings. Upstream's `docs/engineering/codebase-design.md` still quotes old `Agent` wording that is absent from the current `DESIGN-IT-TWICE.md`; the generic subagent dependency remains.
- Added `Skill` dispatch, newer orchestration workflows, inherited dependencies, `/clear`, and actual context-file precedence.
- Recognized upstream's explicit Pi-targeted skills.sh route instead of describing all installation docs as Claude-only.
- Removed claims that promoted skills “therefore include Pi-facing usage examples” or draft skills are excluded by a `!skills/in-progress/**` manifest entry. Those described fork remediation, not this upstream snapshot.

## Sources

### Upstream

- [Pinned source tree][upstream], all paths and section locators in the findings resolve here.
- [Package manifest][package], [Claude plugin manifest][plugin], [README][readme], [canonical install block][install-block], and [maintainer linker][linker].
- [Previous upstream baseline][previous], used only to identify changes and retire stale evidence.

### Pi

Pi behavior was checked against the complete installed `1.1.0` versions of `README.md` and `docs/skills.md`, `packages.md`, `settings.md`, `cli.md`, `usage.md`, `configuration.md`, `slash-commands.md`, and `extensions.md`. Installed `dist/core/skills.js` supplied the isolated validation checks and confirmed ignored metadata; `dist/core/package-manager.js` supplied the discovery/filter checks; `dist/core/resource-loader.js` supplied context-file candidate order. These are Pi sources, not this fork.

Portable source locations for subsequent reviews: [Pi repository](https://github.com/earendil-works/pi), under `packages/coding-agent/`. Resolve them at the reviewed Pi release, not mutable `main`. For this review, the installed distribution was read beneath:

```text
/home/paul/.pi/agent/install/releases/1.1.0/node_modules/@earendil-works/pi-coding-agent/
```

### Required subagent dependency

Reviewed the published npm `@tintinweb/pi-subagents` `0.20.0` tarball, without installing or launching it: complete `README.md` and `docs/workflows.md`, the `examples/workflows/review-panel.js` example, `package.json`, `src/worktree.ts`, `src/skill-loader.ts`, and relevant `src/agent-runner.ts`/`src/prompts.ts` sections. npm reports `gitHead` `13106ab6f608b3acc54185da5299ee7fbaabb6b9` for this release.

- [Pinned source and README][subagents-source], especially Tools, Frontmatter Fields, Nested subagents, Worktree Isolation, Skill Preloading, and Scheduling.
- [Published version metadata](https://registry.npmjs.org/@tintinweb%2fpi-subagents/0.20.0) and [reviewed tarball](https://registry.npmjs.org/@tintinweb/pi-subagents/-/pi-subagents-0.20.0.tgz).
- [Workflow guide](https://github.com/tintinweb/pi-subagents/blob/13106ab6f608b3acc54185da5299ee7fbaabb6b9/docs/workflows.md).

This evidence establishes the adaptation contract, not successful installation, effective agent configuration, or workflow behavior in this fork.

[subagents-source]: https://github.com/tintinweb/pi-subagents/tree/13106ab6f608b3acc54185da5299ee7fbaabb6b9
[upstream]: https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336
[package]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/package.json
[plugin]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/.claude-plugin/plugin.json
[readme]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md
[install-block]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/.agents/install-block.md
[linker]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/scripts/link-skills.sh
[previous]: https://github.com/mattpocock/skills/tree/272f99b22574f50e4266791c86b9302682970e23
