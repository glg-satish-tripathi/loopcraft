---
name: loopcraft-implement-reference
description: Implement tasks from specs/<id>-slug/tasks.md one at a time and verify each one before moving on. Use after tasks are approved, or when the user says "implement", "build it" or "do the next task".
license: MIT
---

# Implement

Do the work the tasks describe, no more, and prove each task before the next.

## Steps

1. Read `tasks.md` and `plan.md` in `specs/<id>-slug/`. If `tasks.md` is missing or its `Status:` is not `Approved`, stop and return to the tasks phase in `loopcraft`.
2. Take the first unchecked task whose dependencies are done. Say which one and restate it in one sentence.
3. Where the task changes behaviour and the repo has a test setup, write the failing test first and show it fail.
4. Make the smallest change that satisfies the task, matching surrounding code style. Touch only the files the task lists; if another file must change, say why before editing it.
5. **Verify the task** using the verification phase in `loopcraft`. Do not tick it until verification passes.
6. If verification fails, fix the cause once or twice; if it still fails, stop, report the failure with evidence, and leave the task unticked.
7. If the code shows the plan or task list is wrong, stop and say so; do not work around it. Return to the plan and tasks phases in `loopcraft`.
8. Continue to the next task only if the user asked for the whole run; otherwise stop after the task and report. After every few verified tasks, offer the handoff phase so a long session can end cheaply.

## Principles

- **Don't assume.** State assumptions. If two readings are plausible, or the request uses a vague verb ("better", "handle", "fix it"), stop and ask; do not pick one silently. Use the tool's question feature if it has one, otherwise a direct question that ends your turn.
- **Simplicity first.** The minimum that solves the problem; nothing speculative, no unrequested features or configurability.
- **Surgical changes.** Touch only what the task needs; every changed line traces to the request. Mention unrelated dead code instead of deleting it.
- **Goal-driven.** Turn the task into checkable success criteria and loop until they are verified.
- **Reviewable steps.** Do one reviewable step, then stop for approval. Continue without stopping only if the user says "do it all" or "keep going".

## Rules

- Never tick a task whose verify step you did not run.
- Do not add features, refactors or cleanups that no task asks for; mention them instead.
- Do not commit, push or comment on the issue unless the user asks.

**Next:** the next task, or the final verification phase in `loopcraft` once every task is verified.
