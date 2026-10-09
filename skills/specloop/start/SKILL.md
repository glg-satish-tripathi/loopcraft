---
name: specloop-start
description: Entry point for the specloop workflow. Give it a GitHub issue (number or URL) or describe a task; it checks whether it has enough context, asks if not, then runs research and stops for the user's review, then plan (stops for approval), then tasks, implement and verify. Use when the user says "start", "work on issue #N", or hands over a task without naming a specific stage.
license: MIT
---

# Start

Take an issue or a described task from "here is the problem" to approved tasks and verified work, stopping at each gate. Do not plan on a guess.

## Steps

1. **Check for earlier work.** If `specs/<id>-*/handoff.md` or `tasks.md` already exists for this task, say so and recommend `specloop-resume` instead of starting over.
2. **Get the task.** From an issue number or URL, run `gh issue view <n> --comments` (read-only) if `gh` is installed; otherwise ask the user to paste the issue. For a described task, use the user's words.
3. **Restate it in one sentence.** If you can phrase a second, materially different reading, it is ambiguous.
4. **Context check.** Decide whether you can say all four of these from the issue or request alone: the goal, where in the system it applies, what "done" looks like, and any constraint (deadline, compatibility, do-not-touch areas).
   - First do a cheap read-only look (README, file names, an obvious grep) so you do not ask what the repo already answers.
   - If something is still missing, the issue is empty or thin, or the request is a vague verb ("improve", "handle", "fix it"): **stop and ask**. At most three questions, one at a time, each with 2-4 options and a recommendation. Do not research or plan on a guess.
5. **Create the work directory** `specs/<id>-slug/`: `<id>` is the issue number, or the next free `NNN`; `slug` is 2-4 kebab-case words.
6. **Research.** Follow `specloop-research`. Always run it, even briefly, and note when there was little to find. If it shows the task is unclear, go back to step 4.
7. **Review gate: stop after research.** Show the user the findings, the "Unverified" items and the path to `research.md`, and ask them to review it and correct anything wrong. Do not start the plan until they say to go on. Offer `specloop-handoff` here as an early place to end a session.
8. **Plan.** After the user okays the research, follow `specloop-plan` and **stop for approval**.
9. **Tasks.** After the user approves the plan, follow `specloop-tasks` and **stop for approval**.
10. **Implement and verify.** After the user approves the tasks, follow `specloop-implement`, which verifies each task through `specloop-verify`. Stop after each task unless the user says to run them all.
11. **Finish.** When every task is verified, run the final check in `specloop-verify` and give the PR-ready summary. Use `specloop-ship` only if the user asks.

If the tool cannot load another skill by name, apply that skill's steps directly.

## Principles

- **Don't assume.** State assumptions. If two readings are plausible, or the request uses a vague verb ("better", "handle", "fix it"), stop and ask; do not pick one silently. Use the tool's question feature if it has one, otherwise a direct question that ends your turn.
- **Simplicity first.** The minimum that solves the problem; nothing speculative, no unrequested features or configurability.
- **Surgical changes.** Touch only what the task needs; every changed line traces to the request. Mention unrelated dead code instead of deleting it.
- **Goal-driven.** Turn the task into checkable success criteria and loop until they are verified.
- **Reviewable steps.** Do one reviewable step, then stop for approval. Continue without stopping only if the user says "do it all" or "keep going".

## Rules

- Never skip the research review, plan approval or tasks approval gates, and never set a `Status: Approved` line yourself.
- Do not edit code before the tasks are approved.
- Do not commit, push, or comment on the issue unless the user asks.

**Next:** `specloop-research`, then (after the user reviews it) `specloop-plan`. To end the session at any gate, use `specloop-handoff`.
