---
name: loopcraft-research-reference
description: Gather verified facts about a GitHub issue or described task before or during planning, and record them in specs/<id>-slug/research.md with sources. Use when the user says "research", when the task touches code or systems you have not read yet, or when planning hits a question that needs evidence instead of a guess.
license: MIT
---

# Research

Find out what is true before deciding what to do. Facts and sources only; the decision belongs to the main `loopcraft` workflow.

## Steps

1. **Get the task.** If the user gives an issue number or URL and `gh` is installed, run `gh issue view <n> --comments` (read-only). Otherwise use the text the user described or pasted. Restate it in one sentence.
2. **Pick the work directory** `specs/<id>-slug/`: `<id>` is the issue number, or the next free `NNN` if there is no issue; `slug` is 2-4 kebab-case words. Reuse the directory if it already exists.
3. **List the questions** that must be answered before planning, at most seven.
4. **Answer each from evidence:** read the relevant code, tests and docs in the repo, run read-only commands, and search the web or official docs when the question is about an external tool or API. Do not answer from memory.
5. **Write `research.md`** from [assets/research-template.md](../assets/research-template.md). Every finding cites its source (`path:line`, command output or URL). Put anything you could not confirm under "Unverified".
6. **Stop for review.** Summarise the findings and the open unknowns, say whether the task is ready to plan, give the path to `research.md`, and ask the user to review it and correct anything wrong. Do not start planning until they say to go on.

## Principles

- **Don't assume.** State assumptions. If two readings are plausible, or the request uses a vague verb ("better", "handle", "fix it"), stop and ask; do not pick one silently. Use the tool's question feature if it has one, otherwise a direct question that ends your turn.
- **Simplicity first.** The minimum that solves the problem; nothing speculative, no unrequested features or configurability.
- **Surgical changes.** Touch only what the task needs; every changed line traces to the request. Mention unrelated dead code instead of deleting it.
- **Goal-driven.** Turn the task into checkable success criteria and loop until they are verified.
- **Reviewable steps.** Do one reviewable step, then stop for approval. Continue without stopping only if the user says "do it all" or "keep going".

## Rules

- Read-only: do not edit code, and do not comment on or change the issue.
- Separate what you observed from what you infer.
- If research shows the task is unclear or two readings are plausible, say so and ask the user instead of choosing.
- Write only `research.md`. Research can be re-run during planning; append, do not overwrite earlier findings.

**Next:** return to the main `loopcraft` workflow once the user has reviewed the research.
