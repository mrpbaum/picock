import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile, realpath, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageManifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const pluginManifest = JSON.parse(
  await readFile(join(root, ".claude-plugin/plugin.json"), "utf8"),
);

const excludedBuckets = ["deprecated", "in-progress", "misc", "personal"];
const expectedPiSkills = [
  "./skills",
  ...excludedBuckets.map((bucket) => `!skills/${bucket}/**`),
];

assert.deepEqual(
  packageManifest.pi?.skills,
  expectedPiSkills,
  "package.json pi.skills must use the shared blacklist policy",
);
assert.ok(
  packageManifest.keywords?.includes("pi-package"),
  "package.json must include the pi-package keyword",
);
assert.equal(
  packageManifest.version,
  pluginManifest.version,
  "package and Claude plugin versions must match",
);

async function findSkillDirectories(directory) {
  const skills = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name);
    if (entry.name === "node_modules") continue;
    try {
      if ((await stat(join(path, "SKILL.md"))).isFile()) skills.push(path);
    } catch {
      // This directory is not itself a skill; continue recursively.
    }
    skills.push(...(await findSkillDirectories(path)));
  }
  return skills;
}

const allSkills = await findSkillDirectories(join(root, "skills"));
const distributedSkills = allSkills.filter((path) => {
  const [bucket] = relative(join(root, "skills"), path).split("/");
  return !excludedBuckets.includes(bucket);
});
const expectedPaths = distributedSkills
  .map((path) => `./${relative(root, path)}`)
  .sort();

const names = distributedSkills.map((path) => path.split("/").at(-1));
assert.equal(
  new Set(names).size,
  names.length,
  "distributed skills must have unique directory names for flat linking",
);

const pluginPaths = [...pluginManifest.skills].sort();
assert.deepEqual(
  pluginPaths,
  expectedPaths,
  "Claude plugin skills must match blacklist-based discovery",
);

const temporaryHome = await mkdtemp(join(tmpdir(), "picock-skill-validation-"));
try {
  const result = spawnSync("bash", [join(root, "scripts/link-skills.sh")], {
    cwd: root,
    env: { ...process.env, HOME: temporaryHome },
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  for (const destination of [".claude/skills", ".agents/skills"]) {
    const linkedNames = (await readdir(join(temporaryHome, destination))).sort();
    assert.deepEqual(
      linkedNames,
      [...names].sort(),
      `${destination} links must match blacklist-based discovery`,
    );

    for (const name of linkedNames) {
      const target = await realpath(join(temporaryHome, destination, name));
      assert.ok(
        expectedPaths.includes(`./${relative(root, target)}`),
        `${destination}/${name} points outside the distributed skill set`,
      );
    }
  }
} finally {
  await rm(temporaryHome, { recursive: true, force: true });
}

console.log(`Validated ${expectedPaths.length} distributed skills.`);
