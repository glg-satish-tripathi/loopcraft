---
name: specloop-ship
description: Commit, push and open a pull request for finished, verified work, asking before each outward-facing step. Use only when the user asks to ship, commit, push or open a PR; never run on your own after verification.
license: MIT
---

# Ship

Publish verified work. Commits, pushes and PRs are outward-facing, so each one needs the user's go-ahead.

## Steps

1. **Check preconditions.** Read `tasks.md`: every task must be `Verified: pass` and the final check from `specloop-verify` must be done. If not, stop and recommend `specloop-verify`.
2. **Show the state:** `git branch --show-current`, `git status --short`, `git diff --stat`. If on the default branch, propose a branch name and ask before creating it.
3. **Propose the commit(s):** one per task or a single one, as the user prefers, with messages that match the style in `git log`. Follow the user's own instructions about attribution lines. Show them and ask before committing.
4. **Draft the PR** from the summary `specloop-verify` produced: title, body, and `Closes #<n>` only if the work came from an issue. Show the exact title and body.
5. **Push and open the PR only after the user confirms** the exact action, using `git push` and `gh pr create`.
6. Suggest `specloop-handoff` to record that the work is shipped.

## Rules

- Never force-push, skip hooks, or push to the default branch.
- Never stage unrelated files; stage by name.
- Do not comment on or close the issue except through the PR the user approved.

**Next:** `specloop-handoff` to record the shipped state.
