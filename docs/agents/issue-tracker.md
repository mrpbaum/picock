# Issue tracker: GitHub

Issues and specs live in GitHub Issues for `mrpbaum/picock`.
Use the `gh` CLI from this clone.

## Conventions

- Create: `gh issue create --title "..." --body "..."`.
  Use a heredoc for multi-line bodies.
- Read: `gh issue view <number> --json number,title,body,labels,comments`.
- List: `gh issue list --state open --json number,title,body,labels,comments`.
  Apply appropriate label and state filters.
- Comment: `gh issue comment <number> --body "..."`.
- Apply or remove labels: `gh issue edit <number> --add-label "..."`
  or `--remove-label "..."`.
- Close: `gh issue close <number> --comment "..."`.
  For triage rejections, follow the maintainer-confirmation rule in
  `docs/agents/triage-labels.md`.

When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the relevant ticket", read the GitHub issue.

## Pull requests as a triage surface

**PRs as a request surface: no.**

GitHub shares issue and PR numbers. If a number is ambiguous, resolve
with `gh pr view <number>` and fall back to `gh issue view <number>`.

## Wayfinding operations

- Map: one issue labelled `wayfinder:map`, containing Notes,
  Decisions-so-far, and Fog.
- Child: link each ticket as a GitHub sub-issue. With gh 2.94+,
  use `gh issue create --parent <parent> ...` or
  `gh issue edit <parent> --add-sub-issue <child>`.
  Older gh: POST to `repos/<owner>/<repo>/issues/<parent>/sub_issues`
  with `sub_issue_id=<child-db-id>`.
  If unavailable, add a task-list entry to the map and put
  `Part of #<map>` at the top of the child.
- Ticket labels: `wayfinder:research`, `wayfinder:prototype`,
  `wayfinder:grilling`, or `wayfinder:task`.
- Blocking: use native GitHub issue dependencies. POST to
  `repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by`
  with `issue_id=<blocker-db-id>`. Obtain the database ID with
  `gh api repos/<owner>/<repo>/issues/<number> --jq .id`.
  If unavailable, use a `Blocked by: #<number>` line.
- Frontier: consider open map children in map order, excluding
  assigned tickets and those with open blockers.
- Claim: `gh issue edit <number> --add-assignee @me`,
  the session's first write.
- Resolve: comment with the answer, close the child, then append
  a summary and link to the map's Decisions-so-far.
