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
| Pi environment assumed | Default tools and commands, no third-party subagent, skill-dispatch, or guardrail extension |
| Method | Fresh upstream clone, review of all 38 `SKILL.md` files, bundled-reference dependency scan, install surfaces, and upstream changes since the previous baseline; isolated Pi skill-loader and package-resource checks |
| Excluded | This fork's skills, manifests, fixes, installed third-party packages, and working-tree changes |

All repository paths below refer to the **upstream snapshot**, not files in this fork. Open them beneath the [pinned upstream tree][upstream]. Recommendations describe possible adaptations, not fixes already applied here.

This is a source compatibility assessment, not an end-to-end certification. The loader checks did not invoke a model, install the skills.sh CLI, run the upstream linker, create issues, launch child agents, or exercise generated scripts. Those limits matter when distinguishing a confirmed API mismatch from likely model behavior.

## Verdict

**Upstream is loadable in Pi, but not behaviorally portable without adaptations.** A Pi manifest is optional, so its absence is not an installation failure. An unfiltered Pi git-package install discovers more skills than the Claude plugin advertises. Even the promoted subset contains calls to Claude's `Skill` tool, subagent requirements, and command examples that need translation.

| ID | Severity | Status at reviewed commit | Issue |
| --- | --- | --- | --- |
| PI-001 | High | Open, route-dependent | Unfiltered Pi package discovery exposes non-promoted skills |
| PI-002 | High | Open | Composition instructions call a nonexistent default Pi `Skill` tool |
| PI-003 | High | Open, workflow-dependent | Subagent/background execution is assumed |
| PI-004 | Medium | Open | Bare skill slash commands do not invoke Pi skills |
| PI-005 | Medium | Open | Session guidance uses `/clear` and model-specific context assumptions |
| PI-006 | High | Open, non-promoted only | Claude hooks and Claude background CLI do not implement Pi behavior |
| PI-007 | Medium | Open, conditional | Setup may write context into a file Pi does not select |
| PI-008 | Low | Open documentation gap | Pi package installation/update behavior is not documented alongside skills.sh |
| PI-009 | Low | Compatible with metadata loss | Argument hints and Codex UI metadata do not configure Pi |

Severity describes impact when the relevant route or workflow is used. It does not mean every invocation fails. In particular, a model may interpret a missing-tool instruction as prose and continue, but that is not reliable tool/API compatibility.

## Installation routes and discovered scope

The upstream [plugin manifest][plugin] lists **27 promoted skills**: 20 engineering and 7 productivity. Pi does not use `.claude-plugin/plugin.json` or `marketplace.json` to select package skills.

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

Default Pi has no tool named `Skill`. It advertises model-invoked skills by name, description, and path, and the model loads their instructions with `read`. Explicit human invocation expands `/skill:<name>`. This is a separate mismatch from missing subagents: wrappers such as `grill-me` can be affected before any parallel work is attempted.

**Adaptation:** Replace tool-specific dispatch with “read and follow the available `grilling` skill's `SKILL.md`”, and equivalent instructions for other model-invoked dependencies. Adapt success criteria to expect a file read rather than a `Skill` tool call. Include dependencies when installing a wrapper alone.

Keep the human/model invocation distinction: `disable-model-invocation: true` removes a skill from Pi's automatic skill catalogue. A router should recommend `/skill:<user-invoked-name>` to the human rather than silently loading it as a dependency. This flag is routing behavior, not a filesystem access-control boundary.

**Recheck when:** Any skill or helper adds cross-skill calls, dependency names change, invocation flags change, or Pi gains a dispatch tool.

### PI-003: Subagents and background agents are workflow dependencies

**Evidence:** The current instructions usually say “sub-agent” generically rather than naming Claude's `Agent` tool. Removing the literal tool name has not removed the execution requirement.

| Upstream source and locator | Required behavior |
| --- | --- |
| `skills/engineering/code-review/SKILL.md`, “Spawn both sub-agents in parallel” | Two foreground parallel reviews, explicitly separated to avoid context pollution |
| `skills/engineering/improve-codebase-architecture/SKILL.md`, “Explore” | A subagent explores architectural friction |
| `skills/engineering/codebase-design/DESIGN-IT-TWICE.md`, “Spawn sub-agents” | 3+ parallel agents produce radically different designs |
| `skills/engineering/research/SKILL.md`, opening instruction | Background research while the parent continues working |
| `skills/engineering/implement-spec/SKILL.md`, steps 2, 4–7, 9 | Exploration, implementer, and merger agents; per-ticket worktrees/branches, integration, and cleanup |
| `skills/engineering/wayfinder/SKILL.md`, “Research” ticket type and charting step 5 | Parallel research agents with branch artifacts; the child is told to invoke `research`, which itself launches a background agent |
| `skills/productivity/grilling/SKILL.md`, facts paragraph | Nonblocking exploration agents while other interview questions continue |
| `skills/engineering/ask-matt/SKILL.md` and `PHASE-BOUNDARIES.md` | Recommendations to delegate AFK work or split mid-phase work into subagents |
| `skills/in-progress/chief-of-staff/SKILL.md`, “Subagents” | All work runs in background subagents; recurring schedules are explicitly harness-dependent |

`implement` also inherits this dependency through its required closing `code-review`. The interview wrappers and skills that compose `grilling` inherit its fact-finding dependency when that branch is needed.

**Pi behavior:** Pi deliberately does not ship a built-in subagent orchestrator. Parallel tool calls are not independent agent contexts. A shell-launched Pi process is possible, but spawning, supervising, returning results, selecting models, managing child skills, and cleaning up worktrees are not supplied by these upstream instructions.

**Adaptation:** Declare an explicit orchestrator dependency and translate the workflow to its real tool contract, including child skill availability and worktree ownership. For `wayfinder`, decide which layer owns research delegation so the child does not accidentally delegate again. If no orchestrator is available, stop or offer a user-approved sequential variant.

A sequential fallback is a **degraded mode**, not an equivalent implementation: separate headings or notes within one session do not give `code-review` the context isolation it requests, nor do they preserve nonblocking research or concurrency. Disclose the limitation rather than claiming independent passes.

**Recheck when:** New orchestration skills appear, parallel/background requirements change, references move, or the Pi baseline gains such capabilities. Test cancellation, artifact delivery, and cleanup in addition to successful completion.

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

**Adaptation:** Exclude them from a Pi skill set, or port them deliberately. Pi extensions can block calls through the `tool_call` event, but that is not compatibility with Claude hook JSON. Specify which execution paths a guardrail protects; shell-pattern checks are not an operating-system sandbox. A handoff port needs an explicit Pi process/orchestrator contract, not a mechanical CLI name substitution.

**Recheck when:** These skills are removed/promoted, CLI instructions change, or Pi imports Claude hook configuration.

### PI-007: Setup can prefer a context file that Pi skips

**Evidence:** `skills/engineering/setup-matt-pocock-skills/SKILL.md`, “Pick the file to edit”, always selects `CLAUDE.md` when it exists, even if `AGENTS.md` also exists. The beta `setup-ts-deep-modules` has the same preference when writing a navigation pointer. `retro` loosely describes both filenames as being pushed into any agent's context.

**Pi behavior:** Pi can read `CLAUDE.md`; that filename alone is **not** a compatibility failure. In the reviewed loader, a directory selects the first existing candidate in this order: `AGENTS.override.md`, `AGENTS.md`, `AGENTS.MD`, `CLAUDE.md`, `CLAUDE.MD`. It does not combine every candidate in that directory. Consequently, if `AGENTS.md` and `CLAUDE.md` coexist, setup can write tracker/domain pointers into `CLAUDE.md` while Pi reads `AGENTS.md`. An override file can create the same problem.

**Adaptation:** Select the context file the active harness actually loads, preserving other agents' files. A Pi-only convention can prefer `AGENTS.md`, but the important requirement is that the written pointers reach Pi. Run `/reload` after editing context files. Also verify setup's optional triage detection: user-invoked skills are not in the model's automatic catalogue, so the sibling-folder check or an explicit user confirmation may be needed with filtered/copied installations.

**Recheck when:** Setup/file-selection rules, invocation visibility, or Pi context-file precedence change. Check the cases “only CLAUDE”, “only AGENTS”, “both”, and “override present”.

## Installation documentation and metadata

### PI-008: skills.sh is supported upstream, but not a Pi package lifecycle

**Evidence:** Upstream `README.md`, “Any other agent, or editable files”, explicitly lists `pi` for `npx skills@latest add mattpocock/skills -a <agent>`. `.agents/install-block.md` explicitly prefers that route over an unfiltered `pi install` because of the extra buckets. Current docs do not universally repeat the old install block: upstream now relies on an external install widget for docs pages.

This is a valid offered installation route, not proof that the skills cannot install on Pi. It is also not managed by Pi's package commands. Installing editable skills does not translate their instructions or provide missing tools.

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
| Engineering | `implement-spec`, `improve-codebase-architecture`, `wayfinder` | PI-002 and PI-003; worktree/artifact ownership needs an orchestrator for `implement-spec` and research dispatch needs one for `wayfinder` |
| Engineering | `retro`, `tdd` | PI-002; `retro` also needs the appropriate session log/context files |
| Engineering | `setup-matt-pocock-skills` | PI-007; tracker CLI/authentication as applicable |
| Engineering | `diagnosing-bugs`, `domain-modeling`, `pr`, `prototype`, `to-spec`, `to-tickets`, `wizard` | No additional mismatch; repository/test tools, tracker access, browser or human-run bash scripts as applicable |
| Productivity | `grill-me` | PI-002 and inherited PI-003 |
| Productivity | `grilling` | PI-003 when fact-finding delegation is needed |
| Productivity | `handoff` | PI-002 in suggested-skill instructions; PI-005 in human-facing docs; document creation itself is portable |
| Productivity | `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents` | No additional mismatch; `teach` needs trusted-source retrieval and browser access for HTML lessons |
| In-progress | `chief-of-staff` | PI-001, PI-003; recurring schedules require an additional facility if used |
| In-progress | `claude-handoff` | PI-001, PI-002, PI-006 |
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

Keep this document a ledger of **upstream versus Pi**, not a checklist of this fork's remediation progress.

1. **Pin both baselines.** Resolve the requested upstream tag/ref, record its full SHA, package/plugin versions, and review date. If reviewing default-branch HEAD, say so. Record `pi --version` and the exact installed Pi package/docs version. Use a fresh clone or detached upstream checkout outside this fork.
2. **Diff upstream only.** Compare the previous recorded upstream SHA with the new SHA. Read changed files plus their called skills and bundled references, including unchanged dependencies. Include `package.json`, `.claude-plugin/*`, `README.md`, `.agents/install-block.md`, `scripts/link-skills.sh`, and human-facing docs. Never substitute a diff against this fork's main branch.
3. **Recount discovery.** Inventory all `SKILL.md` files and compare the plugin list, promoted buckets, and actual Pi loader results. Re-run the isolated loader with default/user/project skill discovery disabled so this fork and installed skills cannot affect the result. Record counts and diagnostics. If testing an installer, use an isolated home/settings directory and record its exact version and selected skills.
4. **Scan, then read in context.** Search all skill bodies, helpers, scripts, and docs for dispatch, agents, hooks, commands, context filenames, metadata, tool names, and environment assumptions. Search hits are candidates, not findings; distinguish literal tool requirements from examples and domain vocabulary.
5. **Recheck Pi contracts.** Read the pinned Pi skills, packages, configuration, slash-command, and CLI references. Inspect the installed loader where documentation leaves precedence or metadata behavior unclear. Separate default Pi from optional extensions; record any extension/version used in runtime tests.
6. **Update stable IDs.** Retain `PI-001` through `PI-009`. Mark findings `open`, `resolved upstream`, `resolved by Pi`, or `not applicable`, with the resolving SHA/version and reason. Allocate a new ID for a genuinely new mismatch. Move removed skills out of the current coverage ledger, retaining a short history note when needed. A proposed workaround or a fix in this fork does not resolve an upstream finding.
7. **Verify claims at their stated level.** At minimum, re-run loader diagnostics and source checks. For runtime claims, test explicit command expansion, wrapper composition, context-file selection, and affected orchestration in a clean Pi session. Test guardrail interception rather than only its script's exit code. Disclose anything not executed.

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

**Completion criterion:** Every skill present at the new upstream SHA is accounted for; every still-applicable finding has current upstream evidence and a pinned Pi contract; discovery counts are reproduced; resolved findings identify why they no longer apply; untested behavior is labelled; no statement of current compatibility depends on this fork.

## Changes from the previous document

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

[upstream]: https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336
[package]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/package.json
[plugin]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/.claude-plugin/plugin.json
[readme]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md
[install-block]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/.agents/install-block.md
[linker]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/scripts/link-skills.sh
[previous]: https://github.com/mattpocock/skills/tree/272f99b22574f50e4266791c86b9302682970e23
