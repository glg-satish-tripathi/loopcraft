---
name: specloop-tasks-reference
description: Divide an approved plan into small ordered tasks at specs/<id>-slug/tasks.md, each tied to an acceptance criterion and carrying its own verify step, and amend the list when the plan changes. Use after the plan is approved and before coding, when the plan was amended, or when the user says "make tasks" or "break this down".
license: MIT
---

# Tasks

Turn the plan into steps a person can review in a minute each.

## Steps

1. Read `plan.md` (and `research.md` if present) in `specs/<id>-slug/`. If `plan.md` is missing or its `Status:` is not `Approved`, stop and return to the plan phase in `specloop`.
2. Write `tasks.md` from [assets/tasks-template.md](../assets/tasks-template.md) with `Status: Draft`.
3. Make each task one concern, ideally one file or one behaviour. If a task needs "and", split it.
4. Give every task: an ID (`T1`, `T2`, ...), the criteria it serves (`A1`, ...), the files it touches, and a **verify** step that is a runnable command or an observable check.
5. Order by dependency. Put the test that proves a behaviour before the change that implements it. If the plan says the repo has no tests, the first task sets up the minimal test setup the user agreed to.
6. **Docs task:** if the change alters behaviour that users or operators rely on (a command, API, config, runbook, README), add a task to update the affected document.
7. Check coverage: every acceptance criterion in the plan appears in at least one task. List any that do not and either add tasks or flag the gap.
8. Present the list and wait for approval. When the user explicitly approves, set `Status: Approved (<date>)`. Never set it yourself.

## Amending existing tasks

If the plan changed: keep done and verified tasks as they are, add or edit only what changed, add a dated line under "Changes", set `Status: Draft`, re-run the coverage check, and get approval again.

## Principles

- **Don't assume.** State assumptions. If two readings are plausible, or the request uses a vague verb ("better", "handle", "fix it"), stop and ask; do not pick one silently. Use the tool's question feature if it has one, otherwise a direct question that ends your turn.
- **Simplicity first.** The minimum that solves the problem; nothing speculative, no unrequested features or configurability.
- **Surgical changes.** Touch only what the task needs; every changed line traces to the request. Mention unrelated dead code instead of deleting it.
- **Goal-driven.** Turn the task into checkable success criteria and loop until they are verified.
- **Reviewable steps.** Do one reviewable step, then stop for approval. Continue without stopping only if the user says "do it all" or "keep going".

## Rules

- No task without a verify step.
- Do not start implementing.
- Write only `tasks.md`.

**Next:** return to the implementation phase in `specloop` once approved.
