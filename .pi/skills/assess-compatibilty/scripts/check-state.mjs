#!/usr/bin/env node
import { sourceGit } from "../../../../scripts/source-git.mjs";
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
const baselines = [...document.matchAll(/^\| Source commit \| `([0-9a-f]{40})` \|$/gm)];
const baseline = baselines[0]?.[1];
if (baselines.length !== 1) {
  console.error("compatibility document has no unique source commit baseline");
  process.exit(2);
}

try {
  sourceGit("rev-parse", "--verify", `${target}^{commit}`);
  sourceGit("rev-parse", "--verify", `${markerSha}^{commit}`);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
if (markerSha !== target || baseline !== target) {
  console.error(`stale: marker=${markerSha} document=${baseline} target=${target}`);
  process.exit(1);
}

console.log(`consolidated: ${target}`);
