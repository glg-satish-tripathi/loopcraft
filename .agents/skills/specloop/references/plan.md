---
name: specloop-plan-reference
description: Turn a GitHub issue or a described task into a plan at specs/<id>-slug/plan.md with checkable acceptance criteria, the chosen approach, how it will be verified and the main risks, then wait for approval. Also amends an existing plan when the code shows it was wrong. Use when the user says "plan this", hands over an issue or task, or has finished research. Writes an ADR only if the user asks.
license: MIT
---

# Plan

Decide how to do the task. Every design choice must trace to something the task needs.

## Steps

1. **Get the task.** From an issue number or URL, use `gh issue view <n> --comments` if `gh` is installed (read-only); otherwise use the text the user gave. Restate it in one sentence. If it has two materially different readings, or a vague verb ("improve", "handle", "fix it"), ask before planning.
2. **Use research.** Read `research.md` in `specs/<id>-slug/` if it exists. If a fact you need is missing, return to the research phase in `specloop` instead of guessing.
3. **Inspect the existing code** before proposing anything. Reuse what exists, match its conventions, and cite file paths.
4. **Find how tests run** (package scripts, Makefile, CI config) and record the commands under "How to verify". If the repo has no tests, say so, list it under Risks, and ask whether a minimal test setup should become a task.
5. **Write `plan.md`** from [assets/plan-template.md](../assets/plan-template.md) with `Status: Draft`. Fill every section or delete it.
6. **Write acceptance criteria** the task implies, each observable and checkable (a command, a test, a number). Mark criteria you inferred rather than read from the task.
7. **Name the risks:** what can break, how it would be noticed, and how to undo the change.
8. **Ask questions inline** where the answer changes the plan: one at a time, with options and a recommendation. Do not answer them yourself.
9. **Present the plan and wait for approval.** When the user explicitly approves, set `Status: Approved (<date>)`. Never set it yourself.

## Amending an existing plan

If implementation shows the plan is wrong: edit `plan.md` in place, add a dated line under "Changes" saying what changed and why, set `Status: Draft`, and get approval again. Then return to the tasks phase in `specloop` so task coverage is rechecked.

## ADR

Do not write an ADR unless the user asks. When asked, use `specloop-adr`.

## Principles

- **Don't assume.** State assumptions. If two readings are plausible, or the request uses a vague verb ("better", "handle", "fix it"), stop and ask; do not pick one silently. Use the tool's question feature if it has one, otherwise a direct question that ends your turn.
- **Simplicity first.** The minimum that solves the problem; nothing speculative, no unrequested features or configurability.
- **Surgical changes.** Touch only what the task needs; every changed line traces to the request. Mention unrelated dead code instead of deleting it.
- **Goal-driven.** Turn the task into checkable success criteria and loop until they are verified.
- **Reviewable steps.** Do one reviewable step, then stop for approval. Continue without stopping only if the user says "do it all" or "keep going".

## Rules

- Prefer the simplest approach that meets the criteria; list rejected alternatives in one line each.
- Do not write code or edit files outside `specs/<id>-slug/plan.md`.
- Do not post to or edit the issue.

**Next:** return to the tasks phase in `specloop` once approved.
