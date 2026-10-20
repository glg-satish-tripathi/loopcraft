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
4. **Gather evidence in layers** and show what each produced:
   - **Tests:** the project's tests relevant to the changed files, plus lint or type-check if the repo has them. If the repo has no test command, record `not run: no test command found` and tell the user; do not mark it pass.
   - **Runtime:** use the actual feature end to end — run the command, call the endpoint, walk the flow — rather than trusting unit checks alone.
   - **Visual:** for user-visible changes, inspect what the user will see (rendered output, screenshot, UI state).
   - **Confidence:** state plainly what was verified and what was not; a layer that does not apply is recorded as such, never silently skipped.
5. **Record it** under the task in `tasks.md`: `Verified: pass` with the layers run, the commands, and today's date, plus a `Not verified:` line naming any layer not run and why. On failure write `Verified: FAIL` with the reason and leave the task unticked.

## Final check (when every task is verified, or the user asks)

1. Run the full test suite, lint and build commands the repo defines, and show the output.
2. For each acceptance criterion in `plan.md`, give the evidence: the test or command that proves it, or `path:line`. Mark any without evidence as **unverified**.
3. List changes in the diff that trace to no task or criterion.
4. Write a short summary (what changed, how it was verified, what is unverified) the user can paste into a PR description. Do not post it anywhere.

## Reviewers (on request)

Run only when the user asks for a review; offer it for user-facing or multi-task work. Each reviewer runs in its own session with no access to this conversation, so it cannot lean on the author's reasoning.

1. **Fix the target** from the user's request: local changes (`git diff` plus `git status` for uncommitted work, or `git diff <base>...HEAD` for unpushed commits — no push required) or a PR link (`gh pr diff`).
2. **Resolve the model** by precedence: the model named in the request → `~/.loopcraft/models.json` → ask. The file maps each tool to an ordered preference list under `reviewer` (for example `"copilot": ["gpt-5.6-terra"]`, `"opencode": ["muse-spark-1.3-contributor", "deepseek-v4.1-flash"]`); use the first entry the current tool offers — it does not judge model quality. An entry may be the alias `"best"`, resolved at spawn time. With no file or no matching entry, the default is the harness's best available model. When asking, list the models the tool offers now, offer to save the answer to the file in that structure — merging into the existing file and never removing other tools' entries — and never ask again until the file changes. If every listed entry is unavailable, say so and ask rather than failing.
3. **One dimension per reviewer:** Features (run every touched user flow), Bugs (explore weird states and failures), Performance (profile slow paths and bottlenecks), Security (probe inputs, permissions, and data).
4. **Write the brief from repo artifacts only:** the diff command or PR link, `plan.md` acceptance criteria, the task records in `tasks.md`, and the one dimension to attack. Never include the author's conversation or reasoning.
5. **Start the reviewer in its own session** with the model resolved in step 2. The reviewer contract: it reads only the brief and repo artifacts, never the author session's conversation; it stays read-only; it attacks its one dimension; it returns findings (severity, `path:line`, what, why) and a verdict — `approve` or `request changes` — recording the model and date it ran on. Where the harness cannot spawn an agent with a chosen model, give the user the brief and ask them to open a fresh session with that model.
6. Record the findings under the reviewed work in `tasks.md`; fix nothing here — return to the implementation phase in `loopcraft`.

## Rules

- Never mark `pass` for a check you did not run; say "not run" instead.
- Do not fix code from this reference; report the failure and return to the implementation phase in `loopcraft`.
- Edit only `tasks.md` (the verification record).

**Next:** return to the implementation phase in `loopcraft`, or use `loopcraft-ship` only if the user asks to commit or open a PR.
