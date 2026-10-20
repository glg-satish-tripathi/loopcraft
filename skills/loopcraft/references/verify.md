---
name: loopcraft-verify-reference
description: Verify a finished task, or all finished tasks, against its verify step, its file scope and the plan's acceptance criteria, then record the result in tasks.md. Use after implementing each task, when the user says "verify", or at the end to produce a summary usable as a PR description.
license: MIT
---

# Verify

Check the work with evidence. Passing means a check ran and succeeded, not that the code looks right.

## Per task

1. Pick the task: the one just implemented, or the ones the user names. Read its entry in `specs/<id>-slug/tasks.md`.
2. **Run its verify step** and show the output. If it cannot be run here, say so and mark the task `not run` instead of passing it.
3. **Check scope:** run `git diff` (and `git status` for new files) and confirm only the task's listed files changed. Report anything else.
4. **Run the project's existing tests** relevant to the changed files, plus lint or type-check if the repo has them, and show the result. If the repo has no test command, record `not run: no test command found` and tell the user; do not mark it pass.
5. **Record it** under the task in `tasks.md`: `Verified: pass`, the command run and today's date. On failure write `Verified: FAIL` with the reason and leave the task unticked.

## Final check (when every task is verified, or the user asks)

1. Run the full test suite, lint and build commands the repo defines, and show the output.
2. For each acceptance criterion in `plan.md`, give the evidence: the test or command that proves it, or `path:line`. Mark any without evidence as **unverified**.
3. List changes in the diff that trace to no task or criterion.
4. Write a short summary (what changed, how it was verified, what is unverified) the user can paste into a PR description. Do not post it anywhere.

## Rules

- Never mark `pass` for a check you did not run; say "not run" instead.
- Do not fix code from this reference; report the failure and return to the implementation phase in `loopcraft`.
- Edit only `tasks.md` (the verification record).

**Next:** return to the implementation phase in `loopcraft`, or use `loopcraft-ship` only if the user asks to commit or open a PR.
