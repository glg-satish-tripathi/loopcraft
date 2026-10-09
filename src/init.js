import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "skills");

// Verified in docs: Claude Code reads .claude/skills; pi reads .agents/skills.
// Codex repo skills: .agents/skills (from search summary of official docs).
export const AGENT_DIRS = {
  claude: ".claude/skills",
  codex: ".agents/skills",
  pi: ".agents/skills",
};

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// Source layout is skills/<namespace>/<stage>/...; tools discover flat skills, so the
// installed directory is <namespace>-<stage> (must equal the skill's `name`).
function installedPath(rel) {
  const [namespace, stage, ...rest] = rel.split(sep);
  return join(`${namespace}-${stage}`, ...rest);
}

// Returns [{path, action}] where action is "create" | "unchanged" | "conflict" | "overwrite".
// Writes only when dryRun is false; conflicts are kept unless force is set.
export function init({ agent, target, dryRun = false, force = false, skillsDir = SKILLS_DIR }) {
  const base = AGENT_DIRS[agent];
  if (!base) {
    const supported = Object.keys(AGENT_DIRS).join(", ");
    throw new Error(agent ? `unknown agent "${agent}" (supported: ${supported})` : `--agent is required (supported: ${supported})`);
  }

  const results = [];
  for (const src of walk(skillsDir)) {
    const dest = join(target, base, installedPath(relative(skillsDir, src)));
    const content = readFileSync(src);
    let action = "create";
    if (existsSync(dest)) {
      if (sha(readFileSync(dest)) === sha(content)) action = "unchanged";
      else action = force ? "overwrite" : "conflict";
    }
    if (!dryRun && (action === "create" || action === "overwrite")) {
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, content);
    }
    results.push({ path: relative(target, dest), action });
  }
  return results;
}
