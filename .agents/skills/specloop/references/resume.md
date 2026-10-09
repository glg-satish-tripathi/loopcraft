---
name: specloop-resume-reference
description: Continue earlier work in a fresh session by reading specs/<id>-slug/handoff.md and checking it against git before acting. Use at the start of a session when the user says "resume", "continue", "pick up where we left off", or names a specs directory with a handoff.
license: MIT
---

# Resume

Start small. Read the handoff, confirm it still matches reality, then continue; do not re-explore.

## Steps

1. **Locate the handoff.** Use the directory the user names. Otherwise list `specs/*/handoff.md` by modification time and take the newest; if two or more were touched recently, list them and ask which.
2. **Read `handoff.md` first, then only the files its "Read first" list names.** Do not re-run research, re-read the whole codebase, or redo verified tasks.
3. **Check it against reality:** `git branch --show-current`, `git rev-parse --short HEAD`, `git status --short`. If the branch, HEAD or uncommitted files differ from the handoff, say exactly how and ask before continuing.
4. **Report in five lines or fewer:** phase, last verified task, the next action, open questions, and anything that did not match. Ask the user to confirm.
5. **Continue with the matching phase in `specloop`; use `specloop-ship` only for an explicitly requested outward-facing action.**

## No handoff found

Fall back to `tasks.md` and its `Status:` and verification lines in the newest `specs/*/`. If there is nothing, say so and suggest starting the research or plan phase in `specloop`.

## Rules

- Treat the handoff as a claim to check, not as truth; mark mismatches.
- Do not change code or artifacts until the user confirms the report.

**Next:** the matching phase in `specloop`.
