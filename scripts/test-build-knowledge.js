// Run with: node scripts/test-build-knowledge.js
"use strict";

const assert = require("node:assert/strict");
const BuildKnowledge = require("../src/build-knowledge.js");

const profile = {
  name: "Martial Artist guide",
  imported: true,
  source: "mobalytics",
  mobalytics: {
    name: "Whirling Trinity Martial Artist",
    author: "Build Creator",
    url: "https://mobalytics.gg/poe-2/builds/example",
    creatorInstructions: ["Keep Storm Wave until the campaign transition.", "Respec before switching to Whirling Assault."],
    priorities: { notes: ["Movement speed is important on boots."], bySlot: { boots: ["Movement speed is important on boots."] } },
  },
  stages: {
    campaign: { label: "Campaign", data: { minLevel: 1, maxLevel: 64, skills: [{ name: "Storm Wave" }], passiveNodes: ["melee1"], inventory: [] } },
    maps: { label: "Early Maps", data: { minLevel: 65, maxLevel: 90, skills: [{ name: "Whirling Assault" }], passiveNodes: ["melee1", "melee2"], inventory: [] } },
  },
};

const pobBuild = {
  name: "Level 54 Martial Artist",
  source: "path-of-building",
  exportCode: "present",
  stats: { level: 54, str: 89, dex: 99, int: 66, resistances: { lightning: 13 } },
  skillGroups: [{ name: "Storm Wave", level: 11, supports: ["Lightning Attunement", "Rage II"] }],
  keystones: ["Hollow Palm Technique"],
  gear: [{ slot: "boots", name: "Example Boots" }],
};

const knowledge = BuildKnowledge.create({ profile, pobBuild, stageKey: "campaign", playerLevel: 54 });
assert.equal(knowledge.identity.creator, "Build Creator");
assert.equal(knowledge.progression.activeStage.label, "Campaign");
assert.equal(knowledge.progression.nextStage.label, "Early Maps");
assert.ok(knowledge.progression.creatorInstructions.some(line => line.includes("Respec")));
assert.equal(knowledge.currentCharacter.skills[0].name, "Storm Wave");
assert.deepEqual(knowledge.currentCharacter.skills[0].supports, ["Lightning Attunement", "Rage II"]);
assert.ok(knowledge.sources.some(source => source.type === "mobalytics" && source.available));
assert.ok(knowledge.sources.some(source => source.type === "path-of-building" && source.available));

const compact = BuildKnowledge.compactForCoach(knowledge);
assert.equal(compact.currentCharacter.stats.resistances.lightning, 13);
assert.equal(compact.nextStage.skills[0], "Whirling Assault");
assert.deepEqual(compact.nextPassiveTargets, ["melee2"]);

// Defensive checks
const invalidLevelKnowledge = BuildKnowledge.create({ profile, pobBuild, playerLevel: "not-a-number" });
assert.equal(invalidLevelKnowledge.progression.activeStage.label, "Campaign");

const stringPassivesKnowledge = BuildKnowledge.create({ profile, pobBuild: { ...pobBuild, passiveNodes: "not-an-array" } });
assert.ok(Array.isArray(stringPassivesKnowledge.currentCharacter.passiveNodes));

assert.deepEqual(BuildKnowledge.uniqueStrings("single string"), ["single string"]);

console.log("All build knowledge tests passed.");
