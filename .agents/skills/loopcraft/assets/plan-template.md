# Plan: <task title>

**Status**: Draft
**Source**: <issue URL / number, or "described by user">
**Research**: `specs/<id>-slug/research.md` (if any)

## Goal
<What changes for the user or system, in 2-4 sentences.>

## Acceptance criteria
| ID | Criterion (observable) | How to check | Source |
|----|------------------------|--------------|--------|
| A1 | <e.g. endpoint returns 404 for unknown id> | <test or command> | stated / inferred |

## Approach
<The chosen design and why it is the simplest that meets the criteria.>

## Alternatives rejected
- <Option>: <why not>

## Existing code reused
- `<path>`: <what and why>

## How to verify
- Tests: `<command>`   Lint / build: `<command>`   (or "no tests in repo")

## Rollout
How this change is exposed, watched, and undone in its own context — answer `not applicable: <reason>` for internal or trivial changes.
- **Gate it:** <how the change is disabled or reverted — flag, kill switch, revert plan>
- **Start small:** <what limits blast radius — limited cohort, staging environment, dry-run, one consumer>
- **Watch:** <which signals exist here — errors, costs, logs, alerts>
- **Decide:** <when to expand or roll back>

<Examples: a web feature gates behind a flag released to one cohort; a cloud resource applies to staging before production and watches cost and error signals.>

## Risks
| Risk | Noticed by | Undo |
|------|------------|------|
| <what can break> | <log, metric, test> | <rollback step> |

## Open questions
- <question, or "none">

## Changes
- <YYYY-MM-DD>: <what changed in the plan and why> (omit until amended)
