import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

export const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "skills");

// Verified in docs: Claude Code reads .claude/skills; pi reads .agents/skills.
// Codex repo skills: .agents/skills (from search summary of official docs).
export const AGENT_DIRS = {
  claude: ".claude/skills",
  codex: ".agents/skills",
  pi: ".agents/skills",
};

export const GLOBAL_AGENT_DIRS = {
  claude: ".claude/skills",
  codex: ".codex/skills",
  pi: ".agents/skills",
};

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const MANIFEST = ".specloop-manifest.json";

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// Each direct child of skills/ is a discoverable skill. Preserve that layout in
// the target so the directory name matches the SKILL.md name.
function installedPath(rel) {
  return rel;
}

// Returns [{path, action}] where action is "create" | "unchanged" | "update" | "conflict" | "overwrite".
// A manifest lets later runs update files that SpecLoop installed previously while
// preserving files changed by the user. --force remains available for legacy installs.
export function init({ agent, target = homedir(), global = false, dryRun = false, force = false, skillsDir = SKILLS_DIR }) {
  const base = (global ? GLOBAL_AGENT_DIRS : AGENT_DIRS)[agent];
  if (!base) {
    const supported = Object.keys(AGENT_DIRS).join(", ");
    throw new Error(agent ? `unknown agent "${agent}" (supported: ${supported})` : `--agent is required (supported: ${supported})`);
  }

  const manifestPath = join(target, base, MANIFEST);
  let manifest = {};
  if (existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch {
      manifest = {};
    }
  }

  const results = [];
  const nextManifest = { ...manifest };
  for (const src of walk(skillsDir)) {
    const dest = join(target, base, installedPath(relative(skillsDir, src)));
    const key = relative(target, dest);
    const content = readFileSync(src);
    const currentHash = existsSync(dest) ? sha(readFileSync(dest)) : null;
    const sourceHash = sha(content);
    let action = "create";
    if (existsSync(dest)) {
      if (currentHash === sourceHash) action = "unchanged";
      else if (manifest[key] === currentHash) action = "update";
      else action = force ? "overwrite" : "conflict";
    }
    if (!dryRun && (action === "create" || action === "update" || action === "overwrite")) {
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, content);
    }
    if (action !== "conflict") nextManifest[key] = sourceHash;
    results.push({ path: relative(target, dest), action });
  }
  if (!dryRun) {
    mkdirSync(dirname(manifestPath), { recursive: true });
    writeFileSync(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`);
  }
  return results;
}
