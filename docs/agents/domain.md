# Domain Docs

## Layout

Single-context: `GLOSSARY.md` at the repo root and ADRs in `docs/adr/`.

## Before exploring

Read the root glossary and any ADRs relevant to the area being explored.

If these files or directories are absent, proceed silently.
Do not suggest creating them upfront. The `domain-modeling` skill
creates them when terms or decisions get resolved.

## Use the glossary's vocabulary

Use glossary terms in issue titles, proposals, hypotheses, and test names.
Avoid synonyms the glossary explicitly rejects.

If a needed concept is missing, reconsider whether it belongs or note
the gap for `domain-modeling`.

## Flag ADR conflicts

Explicitly surface any proposal that contradicts an existing ADR,
including the reason to reopen that decision.
