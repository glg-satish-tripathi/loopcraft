import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { main } from "../src/cli.js";
import { AGENT_DIRS, SKILLS_DIR, init } from "../src/init.js";

const tmp = () => mkdtempSync(join(tmpdir(), "specloop-"));
const quiet = { log() {}, error() {} };

test("claude installs under .claude/skills", () => {
  const target = tmp();
  init({ agent: "claude", target });
  assert.ok(existsSync(join(target, ".claude/skills/specloop-plan/SKILL.md")));
  assert.ok(existsSync(join(target, ".claude/skills/specloop-plan/assets/plan-template.md")));
});

test("codex and pi install under .agents/skills", () => {
  for (const agent of ["codex", "pi"]) {
    const target = tmp();
    init({ agent, target });
    assert.ok(existsSync(join(target, ".agents/skills/specloop-plan/SKILL.md")), agent);
  }
});

test("second run is a no-op", () => {
  const target = tmp();
  init({ agent: "pi", target });
  const again = init({ agent: "pi", target });
  assert.ok(again.every((r) => r.action === "unchanged"));
});

test("edited file is kept as conflict, overwritten with force", () => {
  const target = tmp();
  init({ agent: "claude", target });
  const file = join(target, ".claude/skills/specloop-plan/SKILL.md");
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

const STAGES = ["start", "research", "plan", "adr", "tasks", "implement", "verify", "handoff", "resume", "ship"];
const PRINCIPLED = ["start", "research", "plan", "tasks", "implement"];

test("all workflow stages ship as valid skills", () => {
  assert.deepEqual(readdirSync(SKILLS_DIR), ["specloop"]);
  const srcRoot = join(SKILLS_DIR, "specloop");
  assert.deepEqual(readdirSync(srcRoot).sort(), [...STAGES].sort());
  for (const stage of STAGES) {
    const installed = `specloop-${stage}`; // the directory name tools discover; must equal `name`
    const skill = readFileSync(join(srcRoot, stage, "SKILL.md"), "utf8");
    assert.match(skill, new RegExp(`^name: ${installed}$`, "m"), `${stage}: name must equal ${installed}`);
    assert.match(installed, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(installed.length <= 64);
    const desc = skill.match(/^description: (.+)$/m)?.[1] ?? "";
    assert.ok(desc.length > 0 && desc.length <= 1024, `${stage}: description length`);
    assert.ok(skill.split("\n").length < 500, `${stage}: SKILL.md under 500 lines`);
    for (const [, link] of skill.matchAll(/\]\((assets\/[^)]+)\)/g)) {
      assert.ok(existsSync(join(srcRoot, stage, link)), `${stage}: broken link ${link}`);
    }
    assert.match(skill, /^\*\*Next:\*\*/m, `${stage}: needs a **Next:** line`);
    for (const [, ref] of skill.matchAll(/`(specloop-[a-z]+)`/g)) {
      assert.ok(STAGES.includes(ref.slice("specloop-".length)), `${stage}: references unknown skill ${ref}`);
    }
  }
});

test("principles block is present and identical in the working skills", () => {
  const blocks = PRINCIPLED.map((stage) => {
    const skill = readFileSync(join(SKILLS_DIR, "specloop", stage, "SKILL.md"), "utf8");
    const block = skill.match(/## Principles\n([\s\S]*?)\n## /)?.[1];
    assert.ok(block, `${stage}: missing ## Principles`);
    return block;
  });
  assert.ok(blocks.every((b) => b === blocks[0]), "principles blocks differ between skills");
});

test("every stage installs for every agent", () => {
  for (const agent of Object.keys(AGENT_DIRS)) {
    const target = tmp();
    init({ agent, target });
    for (const stage of STAGES) {
      assert.ok(existsSync(join(target, AGENT_DIRS[agent], `specloop-${stage}`, "SKILL.md")), `${agent}/${stage}`);
    }
  }
});
