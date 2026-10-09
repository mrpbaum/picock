#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const shaPattern = /^[0-9a-f]{40}$/;
const skillRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = resolve(skillRoot, "../../..");
const target = process.argv[2] ?? "";

if (!shaPattern.test(target)) {
  console.error("usage: check-state.mjs <target-full-sha>");
  process.exit(2);
}

let marker = "";
try {
  marker = readFileSync(resolve(skillRoot, "last-consolidated.sha"), "utf8");
} catch (error) {
  console.error(`marker unavailable: ${error.message}`);
  process.exit(2);
}

if (!shaPattern.test(marker.replace(/\n$/, "")) || !marker.endsWith("\n")) {
  console.error("marker must contain one full lowercase SHA followed by one newline");
  process.exit(2);
}

const markerSha = marker.slice(0, 40);
const document = readFileSync(resolve(repoRoot, "docs/pi-compatibilty.md"), "utf8");
const baseline = document.match(/^\| Upstream commit \| `([0-9a-f]{40})` \|$/m)?.[1];
if (!baseline) {
  console.error("compatibility document has no unique upstream commit baseline");
  process.exit(2);
}

function git(args) {
  const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
  if (result.status !== 0) {
    console.error(result.stderr.trim() || `git ${args.join(" ")} failed`);
    process.exit(2);
  }
  return result.stdout.trim();
}

git(["rev-parse", "--verify", `${target}^{commit}`]);
git(["rev-parse", "--verify", `${markerSha}^{commit}`]);
const ancestor = spawnSync("git", ["merge-base", "--is-ancestor", markerSha, target], { cwd: repoRoot, encoding: "utf8" });
if (ancestor.status !== 0) {
  console.error(`marker is not an ancestor of target: ${markerSha}..${target}`);
  process.exit(2);
}

if (markerSha !== target || baseline !== target) {
  console.error(`stale: marker=${markerSha} document=${baseline} target=${target}`);
  process.exit(1);
}

console.log(`consolidated: ${target}`);
