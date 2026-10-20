---
name: loopcraft-ship
description: Commit, push and open a pull request for finished, verified work, asking before each outward-facing step. Use only when the user asks to ship, commit, push or open a PR; never run on your own after verification.
license: MIT
---

# Ship

Publish verified work. Commits, pushes and PRs are outward-facing, so each one needs the user's go-ahead.

## Steps

1. **Check preconditions.** Read `tasks.md`: every task must be `Verified: pass` with its evidence layers recorded, and the final check from the main `loopcraft` workflow must be done, including the confidence report (what was verified and what was not). Record whether reviewer passes were run or `not requested`. If verification is incomplete, stop and recommend `loopcraft` verification. For user-facing or multi-task work, suggest a reviewer pass — an offer, never an auto-run.
2. **Show the state:** `git branch --show-current`, `git status --short`, `git diff --stat`. If on the default branch, propose a branch name and ask before creating it.
3. **Propose the commit(s):** one per task or a single one, as the user prefers, with messages that match the style in `git log`. Follow the user's own instructions about attribution lines. Show them and ask before committing.
4. **Commit.** After the user confirms the messages, commit — then stop: commit-only is a complete, shipped outcome.
5. **Push only if the user asks.** A push is outward-facing; never push without an explicit request.
6. **PR only if the user asks.** Draft it from the verification summary: title, body, and `Closes #<n>` only if the work came from an issue. Show the exact title and body, then push and open the PR with `git push` and `gh pr create` only after the user confirms the exact action.
7. Suggest the handoff phase in `loopcraft` to record that the work is shipped — commit-only or with a PR.

## Rules

- Never force-push, skip hooks, or push to the default branch.
- Never stage unrelated files; stage by name.
- Do not comment on or close the issue except through the PR the user approved.

**Next:** the handoff phase in `loopcraft` to record the shipped state.
