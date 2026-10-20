---
name: loopcraft
description: "Run or continue a spec-driven delivery workflow in a repository (research, plan approval, task approval, implementation, verification, and handoff). Use when the user asks to start, plan, implement, verify, resume, or hand off work."
license: MIT
---

# Loopcraft

Use this as the default workflow for repository changes. Inspect `specs/` first, choose the current phase, and read only the matching reference:

- [Research](references/research.md): gather facts before deciding.
- [Plan](references/plan.md): write a draft and stop for approval.
- [Tasks](references/tasks.md): turn an approved plan into reviewable tasks and stop for approval.
- [Implement](references/implement.md): do one approved task and verify it.
- [Verify](references/verify.md): record evidence for a task or the final check.
- [Resume](references/resume.md): continue from a handoff after checking git state.
- [Handoff](references/handoff.md): capture compact continuation state.

## Gates

1. Do not plan from a guess: clarify missing goal, scope, done condition, or constraints.
2. Stop after a draft plan until the user explicitly approves it.
3. Stop after draft tasks until the user explicitly approves them.
4. Implement only approved tasks, one at a time, and run each task's verification before marking it done.
5. Use `loopcraft-adr` only when the user asks to record a decision.
6. Use `loopcraft-ship` only when the user asks to commit, push, or open a PR.

## State layout

Store work artifacts under `specs/<id>-slug/`: `research.md`, `plan.md`, `tasks.md`, and optional `handoff.md`. Read repository tests and conventions before writing a plan. Keep approvals and verification evidence in those files, not only in chat.

## Principles

- State assumptions; ask when ambiguity changes the plan.
- Make the smallest change that meets observable criteria.
- Do not claim verification you did not run.
- Keep changes traceable to an approved task.

**Next:** read the reference for the current phase.
