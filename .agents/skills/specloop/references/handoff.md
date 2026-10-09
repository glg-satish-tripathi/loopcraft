---
name: specloop-handoff-reference
description: Write or refresh specs/<id>-slug/handoff.md, a compact state file that lets a fresh session continue without re-reading everything. Use when the user says "handoff", "wrap up", "save progress" or is about to end a long session, and offer it after plan approval, tasks approval and every few verified tasks.
license: MIT
---

# Handoff

Long sessions cost money. Capture only what a new session cannot cheaply rediscover, so it can start small and continue exactly here.

## Steps

1. **Find the work directory** `specs/<id>-slug/` in use. If more than one is plausible, ask.
2. **Gather facts from files and git, not from memory of the chat.** Read `tasks.md`, `plan.md` (including their `Status:` lines) and `research.md`. Run `git branch --show-current`, `git rev-parse --short HEAD` and `git status --short`.
3. **Write `handoff.md`** from [assets/handoff-template.md](../assets/handoff-template.md), overwriting the previous one. Keep it under about 60 lines and link to files instead of copying their content.
4. **Record approval only from evidence:** plan or tasks count as approved only if their `Status:` line says so. Otherwise write "not approved".
5. **Be exact about the next step:** one concrete first action for the next session, and an ordered list of the few files to read first, plus what not to re-read or redo.
6. **Mark uncertainty:** anything you could not confirm from files, git or command output is written as "unconfirmed".
7. Tell the user the path and the line to start the next session: `Use the specloop workflow on specs/<id>-slug`.

## Rules

- No secrets, tokens, environment values or long log output in the file.
- Do not commit, push or post the file anywhere.
- Write only `handoff.md`.

**Next:** start a new session and use the `specloop` workflow.
