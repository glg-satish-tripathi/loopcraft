import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { AGENT_DIRS, init } from "./init.js";
import { homedir } from "node:os";

const USAGE = `Usage:
  specloop init --agent <${Object.keys(AGENT_DIRS).join("|")}> [--dir <path>] [--global] [--dry-run] [--force]
  specloop --version`;

export function main(argv, out = console) {
  let args;
  try {
    args = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        agent: { type: "string" },
        dir: { type: "string", default: "." },
        global: { type: "boolean", default: false },
        "dry-run": { type: "boolean", default: false },
        force: { type: "boolean", default: false },
        version: { type: "boolean", default: false },
        help: { type: "boolean", short: "h", default: false },
      },
    });
  } catch (err) {
    out.error(`${err.message}\n${USAGE}`);
    return 2;
  }
  const { values, positionals } = args;

  if (values.version) {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    out.log(pkg.version);
    return 0;
  }
  if (values.help || positionals.length === 0) {
    out.log(USAGE);
    return values.help ? 0 : 2;
  }
  if (positionals[0] !== "init") {
    out.error(`unknown command "${positionals[0]}"\n${USAGE}`);
    return 2;
  }

  let results;
  try {
    results = init({
      agent: values.agent,
      target: values.global ? homedir() : resolve(values.dir),
      global: values.global,
      dryRun: values["dry-run"],
      force: values.force,
    });
  } catch (err) {
    out.error(`${err.message}\n${USAGE}`);
    return 1;
  }
  for (const { path, action } of results) out.log(`${action.padEnd(9)} ${path}`);
  const conflicts = results.filter((r) => r.action === "conflict").length;
  if (conflicts) out.log(`${conflicts} file(s) differ and were kept; re-run with --force to overwrite.`);
  return 0;
}
