# IT'S STILL IN DEVELOPMENT.

# Loopcraft

Loopcraft is a spec-driven delivery workflow packaged as portable Agent Skills for Claude Code, Codex, and Pi.

It turns a repository change into a reviewable loop:

```text
research → plan approval → task approval → implement → verify → handoff/ship
```

The workflow is global-first. Install it once for your agent, then keep the work artifacts in each repository under `specs/`.

## Install

### From a cloned repository

```bash
git clone https://github.com/glg-satish-tripathi/loopcraft.git
cd loopcraft
node bin/loopcraft.js init --agent codex --global
```

This is useful when you want to test the latest repository checkout before publishing a package.

### Install the CLI globally from Git

```bash
npm install --global git+https://github.com/glg-satish-tripathi/loopcraft.git
loopcraft init --agent codex --global
```

To update that Git-based installation after new commits are pushed:

```bash
npm install --global git+https://github.com/glg-satish-tripathi/loopcraft.git
loopcraft init --agent codex --global
```

### Remove it

Uninstalling the CLI does not remove skills that were already copied into an agent's skill directory. Remove both explicitly:

```bash
# Remove the globally installed CLI
npm uninstall --global loopcraft

# Remove the global Pi installation
rm -rf ~/.agents/skills/loopcraft ~/.agents/skills/loopcraft-adr ~/.agents/skills/loopcraft-ship ~/.agents/skills/.loopcraft-manifest.json
```

Use the corresponding directory for another agent:

```bash
# Claude Code
rm -rf ~/.claude/skills/loopcraft ~/.claude/skills/loopcraft-adr ~/.claude/skills/loopcraft-ship ~/.claude/skills/.loopcraft-manifest.json

# Codex
rm -rf ~/.codex/skills/loopcraft ~/.codex/skills/loopcraft-adr ~/.codex/skills/loopcraft-ship ~/.codex/skills/.loopcraft-manifest.json
```

For a project-local installation, run the same removal against `.agents/skills/` or `.claude/skills/` inside that project. These commands remove only the three Loopcraft skill directories and their manifest.

### Install from the project directory

From a checkout of the repository:

```bash
# Install globally for one agent
node bin/loopcraft.js init --agent codex --global
node bin/loopcraft.js init --agent claude --global
node bin/loopcraft.js init --agent pi --global
```

Global destinations are:

| Agent | User skill directory |
| --- | --- |
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.codex/skills/` |
| Pi | `~/.agents/skills/` |

To pin the workflow to one repository instead:

```bash
node bin/loopcraft.js init --agent codex --dir .
```

Project installation writes to `.claude/skills/` for Claude Code and `.agents/skills/` for Codex or Pi. Existing files are preserved as conflicts; use `--force` only when you intend to overwrite them. Use `--dry-run` to inspect changes first.

Rerunning `init` upgrades files that Loopcraft installed on an earlier run. A small `.loopcraft-manifest.json` records those file hashes so a newer version can update them safely. If a user edited an installed file, it is reported as a conflict and left untouched. Older installations from before the manifest was introduced require one intentional migration run with `--force`.

```bash
node bin/loopcraft.js init --agent pi --global --force
```

## Use it

The main skill is `loopcraft`. It replaces separate start, research, plan, tasks, implement, verify, resume, and handoff skills.

```text
Claude Code: /loopcraft
Pi:          /skill:loopcraft
Codex:       ask Codex to use the loopcraft skill
```

Examples:

```text
Start work on issue #123. Begin with research only.
Plan this feature using the existing Loopcraft workflow.
Grill me on this plan until we agree.
Continue the work in specs/123-health-check/.
Implement the next approved task and verify it.
Review the local diff with a fresh reviewer agent.
Create a handoff for this work.
Write a handoff a human can read.
```

The workflow stops at explicit gates:

1. Research is written and reviewed.
2. The plan is written and approved.
3. Tasks are written and approved.
4. Each task is implemented and verified before the next one.
5. Shipping actions happen only when explicitly requested.

## Project artifacts

Work state lives in the repository, not in the global skill installation:

```text
specs/<id>-slug/
├── research.md   # evidence and sources
├── plan.md       # goal, criteria, approach, risks, status
├── tasks.md      # ordered tasks and verification records
└── handoff.md    # optional continuation state
```

Project-specific conventions belong in the repository's `AGENTS.md`, `CLAUDE.md`, or equivalent. Loopcraft supplies the workflow; the repository supplies its commands, architecture, and constraints.

## Design decisions

### Tasks and criteria carry IDs (T1, A1) and live in tables

Every task and acceptance criterion gets a stable ID, and each is a table row with fixed fields (Serves, Files, Verify, Verified), not a bullet in prose.

This is not faster to write — it is faster to refer to. A bullet has no name, so pointing at it means quoting text that breaks when edited. An ID survives rewording, reordering, and insertion, which the artifacts need because they are amended constantly and re-read by fresh agent sessions in implement, verify, resume, and ship. IDs make coverage mechanical (every A-id must appear in at least one task), keep references true when tasks are inserted (new task becomes T9 between T8 and T10, nothing renumbers), and turn verification into a per-row record instead of a sentence. Fixed fields also make gaps visible: an empty Verify cell cannot hide the way a missing bullet sub-item can.

The trade-off is ceremony on small changes; the format pays off exactly when state must survive across sessions, agents, and amendments — which is what this workflow is for. Larger decisions are recorded as ADRs under `docs/adr/`.

## Skill layout

```text
skills/
├── loopcraft/
│   ├── SKILL.md
│   ├── references/       # phase instructions, loaded on demand
│   └── assets/           # plan, task, research, and handoff templates
├── loopcraft-adr/
│   ├── SKILL.md
│   └── adr-template.md
└── loopcraft-ship/
    └── SKILL.md
```

Only skill metadata is visible during discovery. When `loopcraft` is selected, the agent reads its main `SKILL.md`, then the reference and template needed for the current phase. ADR and shipping instructions remain separate because they are optional and can have outward-facing effects.

## CLI

```text
loopcraft init --agent <claude|codex|pi> [--global] [--dir <path>] [--dry-run] [--force]
loopcraft --version
```

The CLI is idempotent: a second install reports unchanged files, previously managed files are reported as updates when the bundled version changes, and edited destination files are reported as conflicts instead of being silently replaced.

## Development

Run the test suite:

```bash
npm test
```

The tests cover installation for all three agents, global and project destinations, conflict handling, dry runs, CLI behavior, skill metadata, references, and complete skill installation.

## License

MIT
