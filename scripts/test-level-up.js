// Regression test for the overlay's "Level Up" button support logic in
// src/overlay-renderer.js. Extracts the pure inferStageForLevel() helper and
// checks it against the campaign-stage thresholds the overlay already relies
// on for stage auto-inference, so a future edit can't silently break the
// stage nudge that happens when a player levels up in-game.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const rendererCode = fs.readFileSync(path.join(__dirname, "..", "src", "overlay-renderer.js"), "utf8");

function extractFunction(code, name) {
  const regex = new RegExp(`function\\s+${name}\\s*\\([\\s\\S]*?\\n}`);
  const match = code.match(regex);
  if (!match) throw new Error(`Could not find function ${name}`);
  return match[0];
}

const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(extractFunction(rendererCode, "inferStageForLevel"), sandbox);

const { inferStageForLevel } = sandbox;

console.log("Running Level Up Regression Suite...\n");

assert.equal(inferStageForLevel(1, "auto"), "leveling", "Level 1 auto should be leveling");
assert.equal(inferStageForLevel(34, "auto"), "leveling", "Level 34 auto should still be leveling");
assert.equal(inferStageForLevel(35, "auto"), "earlyMaps", "Level 35 auto should cross into earlyMaps");
assert.equal(inferStageForLevel(64, "auto"), "earlyMaps", "Level 64 auto should still be earlyMaps");
assert.equal(inferStageForLevel(65, "auto"), "endgame", "Level 65 auto should cross into endgame");
assert.equal(inferStageForLevel(100, "auto"), "endgame", "Max level auto should be endgame");
console.log("  PASS: auto act-context level thresholds");

assert.equal(inferStageForLevel(99, "act1"), "leveling", "Manual act1 override ignores level");
assert.equal(inferStageForLevel(99, "act2"), "leveling", "Manual act2 override ignores level");
assert.equal(inferStageForLevel(10, "maps"), "endgame", "Manual maps override ignores level");
assert.equal(inferStageForLevel(10, "act3plus"), "leveling", "act3plus below 35 stays leveling");
assert.equal(inferStageForLevel(40, "act3plus"), "earlyMaps", "act3plus at/above 35 becomes earlyMaps");
console.log("  PASS: manual actContext overrides");

console.log("\nAll Level Up tests passed successfully!");
