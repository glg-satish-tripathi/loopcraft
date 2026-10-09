import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { main } from "../src/cli.js";
import { AGENT_DIRS, GLOBAL_AGENT_DIRS, SKILLS_DIR, init } from "../src/init.js";

const tmp = () => mkdtempSync(join(tmpdir(), "specloop-"));
const quiet = { log() {}, error() {} };

test("claude installs under .claude/skills", () => {
  const target = tmp();
  init({ agent: "claude", target });
  assert.ok(existsSync(join(target, ".claude/skills/specloop/SKILL.md")));
  assert.ok(existsSync(join(target, ".claude/skills/specloop/assets/plan-template.md")));
});

test("codex and pi install under .agents/skills", () => {
  for (const agent of ["codex", "pi"]) {
    const target = tmp();
    init({ agent, target });
    assert.ok(existsSync(join(target, ".agents/skills/specloop/SKILL.md")), agent);
  }
});

test("global install uses each agent's user skill directory", () => {
  for (const agent of Object.keys(GLOBAL_AGENT_DIRS)) {
    const target = tmp();
    init({ agent, target, global: true });
    assert.ok(existsSync(join(target, GLOBAL_AGENT_DIRS[agent], "specloop/SKILL.md")), agent);
  }
});

test("second run is a no-op", () => {
  const target = tmp();
  init({ agent: "pi", target });
  const again = init({ agent: "pi", target });
  assert.ok(again.every((r) => r.action === "unchanged"));
});

test("rerun updates files installed by an earlier run", () => {
  const target = tmp();
  const source = tmp();
  mkdirSync(join(source, "demo"));
  const sourceFile = join(source, "demo/SKILL.md");
  writeFileSync(sourceFile, "version one");
  init({ agent: "pi", target, skillsDir: source });
  writeFileSync(sourceFile, "version two");
  const results = init({ agent: "pi", target, skillsDir: source });
  assert.ok(results.some((r) => r.action === "update"));
  assert.equal(readFileSync(join(target, ".agents/skills/demo/SKILL.md"), "utf8"), "version two");
});

test("edited file is kept as conflict, overwritten with force", () => {
  const target = tmp();
  init({ agent: "claude", target });
  const file = join(target, ".claude/skills/specloop/SKILL.md");
  writeFileSync(file, "mine");
  const kept = init({ agent: "claude", target });
  assert.ok(kept.some((r) => r.action === "conflict"));
  assert.equal(readFileSync(file, "utf8"), "mine");
  init({ agent: "claude", target, force: true });
  assert.notEqual(readFileSync(file, "utf8"), "mine");
});

test("dry run writes nothing", () => {
  const target = tmp();
  const res = init({ agent: "claude", target, dryRun: true });
  assert.ok(res.every((r) => r.action === "create"));
  assert.ok(!existsSync(join(target, ".claude")));
});

test("unknown agent throws, cli exits 1", () => {
  assert.throws(() => init({ agent: "nope", target: tmp() }), /unknown agent/);
  assert.equal(main(["init", "--agent", "nope", "--dir", tmp()], quiet), 1);
  assert.throws(() => init({ target: tmp() }), /--agent is required/);
});

test("cli: version and usage exit codes", () => {
  assert.equal(main(["--version"], quiet), 0);
  assert.equal(main([], quiet), 2);
  assert.equal(main(["bogus"], quiet), 2);
});

const SKILLS = ["specloop", "specloop-adr", "specloop-ship"];

test("global workflow ships as three valid skills", () => {
  assert.deepEqual(readdirSync(SKILLS_DIR).sort(), [...SKILLS].sort());
  for (const installed of SKILLS) {
    const skill = readFileSync(join(SKILLS_DIR, installed, "SKILL.md"), "utf8");
    assert.match(skill, new RegExp(`^name: ${installed}$`, "m"), `${installed}: name must match directory`);
    assert.match(installed, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(installed.length <= 64);
    const desc = skill.match(/^description: (.+)$/m)?.[1] ?? "";
    assert.ok(desc.length > 0 && desc.length <= 1024, `${installed}: description length`);
    assert.ok(skill.split("\n").length < 500, `${installed}: SKILL.md under 500 lines`);
    for (const [, link] of skill.matchAll(/\]\(([^)]+)\)/g)) {
      if (link.startsWith("http")) continue;
      assert.ok(existsSync(join(SKILLS_DIR, installed, link)), `${installed}: broken link ${link}`);
    }
    assert.match(skill, /^\*\*Next:\*\*/m, `${installed}: needs a **Next:** line`);
    for (const [, ref] of skill.matchAll(/`(specloop-[a-z-]+)`/g)) {
      assert.ok(SKILLS.includes(ref), `${installed}: references unknown skill ${ref}`);
    }
  }
});

test("every global skill installs for every agent", () => {
  for (const agent of Object.keys(AGENT_DIRS)) {
    const target = tmp();
    init({ agent, target });
    for (const skill of SKILLS) {
      assert.ok(existsSync(join(target, AGENT_DIRS[agent], skill, "SKILL.md")), `${agent}/${skill}`);
    }
  }
});
