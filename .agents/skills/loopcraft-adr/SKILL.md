---
name: loopcraft-adr
description: Write an Architecture Decision Record at docs/adr/NNNN-title.md capturing one decision, its context, the options considered and the consequences. Use only when the user asks for an ADR or says "record this decision"; never write one on your own after planning.
license: MIT
---

# ADR

Record one decision so its reason survives after the code changes. Optional: write it only on request.

## Steps

1. Identify the single decision to record. If the user names several, ask which one first; one ADR per decision.
2. Read `specs/<id>-slug/plan.md` and `research.md` if they exist, and any existing records in `docs/adr/` to match their style and find the next number.
3. Write `docs/adr/NNNN-short-title.md` from [adr-template.md](adr-template.md): `NNNN` is the next 4-digit number after the highest existing record, starting at `0001`.
4. State the context in facts the reader can check, list the options actually considered with their trade-offs, name the decision, and list the consequences, including the costs and what becomes harder.
5. Set Status to `Proposed` unless the user says it is accepted.
6. Show the record to the user and wait for approval of the wording.

## Rules

- Never invent options or consequences that were not discussed or evidenced; mark inferences as such.
- Do not edit or renumber existing ADRs; to change a decision write a new one that supersedes it and link both.
- Write only the new file under `docs/adr/`.

**Next:** return to the main `loopcraft` workflow.
