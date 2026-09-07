// Run with: node scripts/test-recommendation-engine.js
"use strict";

const assert = require("node:assert/strict");
const RecommendationEngine = require("../src/recommendation-engine.js");

console.log("Running Recommendation Engine Test Suite...\n");

// ─── Test 1: Archetype & Allowed Slots Resolution ─────────────────────────────
console.log("1. Testing Archetype & Allowed Slots Resolution...");

// Quarterstaff Monk
const monkArchetype = RecommendationEngine.resolveArchetype({
  pobBuild: {
    stats: { className: "Monk", ascendancy: "Invoker" },
    gems: ["Quarterstaff Strike", "Charged Staff", "Wind Dancer"],
    gear: [{ slot: "weapon", name: "Iron Quarterstaff" }],
  },
});
assert.equal(monkArchetype.isQuarterstaff, true);
assert.equal(monkArchetype.hasQuiver, false);
assert.equal(monkArchetype.hasOffhand, false);
assert.equal(monkArchetype.weaponLabel, "Quarterstaff");
assert.deepEqual(monkArchetype.allowedSlots, ["weapon", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"]);
console.log("  PASS: Quarterstaff Monk archetype correctly isolated (no quiver/offhand)");

// Bow Deadeye
const bowArchetype = RecommendationEngine.resolveArchetype({
  pobBuild: {
    stats: { className: "Ranger", ascendancy: "Deadeye" },
    gems: ["Ice Shot", "Freezing Salvo"],
    gear: [{ slot: "weapon", name: "Recurve Bow" }, { slot: "quiver", name: "Broadhead Quiver" }],
  },
});
assert.equal(bowArchetype.isBow, true);
assert.equal(bowArchetype.hasQuiver, true);
assert.equal(bowArchetype.weaponLabel, "Bow");
assert.ok(bowArchetype.allowedSlots.includes("quiver"));
console.log("  PASS: Bow Deadeye archetype correctly isolated (with quiver)");

// Crossbow Mercenary
const xbowArchetype = RecommendationEngine.resolveArchetype({
  pobBuild: {
    stats: { className: "Mercenary", ascendancy: "Witchhunter" },
    gems: ["Rapid Fire", "Power Siphoning"],
    gear: [{ slot: "weapon", name: "Heavy Crossbow" }],
  },
});
assert.equal(xbowArchetype.isCrossbow, true);
assert.equal(xbowArchetype.hasQuiver, false);
assert.equal(xbowArchetype.hasOffhand, false);
assert.equal(xbowArchetype.weaponLabel, "Crossbow");
console.log("  PASS: Crossbow Mercenary correctly isolated (no quiver/offhand)");

// Unarmed Monk (Hollow Palm)
const unarmedArchetype = RecommendationEngine.resolveArchetype({
  pobBuild: {
    stats: { className: "Monk" },
    gems: ["Killing Palm", "Hollow Focus"],
    keystones: ["Hollow Palm Technique"],
  },
});
assert.equal(unarmedArchetype.isUnarmed, true);
assert.equal(unarmedArchetype.hasQuiver, false);
assert.equal(unarmedArchetype.hasOffhand, false);
assert.ok(!unarmedArchetype.allowedSlots.includes("weapon"));
console.log("  PASS: Unarmed Monk correctly isolated (no weapon/quiver/offhand slots)");

// ─── Test 2: Stage Baseline Thresholds ─────────────────────────────────────────
console.log("\n2. Testing Stage Baseline Thresholds...");

const act1 = RecommendationEngine.getStageBaseline(10);
assert.equal(act1.actName, "Act 1");
assert.equal(act1.resistTarget, 15);
assert.equal(act1.isEndgame, false);

const act2 = RecommendationEngine.getStageBaseline(20);
assert.equal(act2.actName, "Act 2");
assert.equal(act2.resistTarget, 25);
assert.equal(act2.isEndgame, false);

const maps = RecommendationEngine.getStageBaseline(75);
assert.equal(maps.actName, "Maps / Endgame");
assert.equal(maps.resistTarget, 75);
assert.equal(maps.isEndgame, true);
console.log("  PASS: Stage baselines correctly scale from Act 1 (15%) -> Act 2 (25%) -> Maps (75%)");

// ─── Test 3: The Four Decisions for Level 20 Quarterstaff Monk ─────────────────
console.log("\n3. Testing Four Decisions for Level 20 Quarterstaff Monk...");

const monkPob = {
  name: "Level 20 Monk",
  stats: {
    level: 20,
    className: "Monk",
    ascendancy: "Invoker",
    life: 438,
    hitChance: 62,
    resistances: { fire: 12, cold: -8, lightning: 18, chaos: -20 },
  },
  gems: ["Quarterstaff Strike", "Charged Staff"],
  gear: [
    { slot: "weapon", name: "Quarterstaff" },
    { slot: "boots", name: "Embossed Boots" },
    { slot: "amulet", name: "Pauper Amulet" },
    { slot: "belt", name: "Cloth Belt" },
  ],
};

const equippedRows = [
  { slot: "weapon", score: 38, entry: { scored: { item: { raw: "Quarterstaff\nAdds 2 to 4 Physical Damage" } } } },
  { slot: "boots", score: 45, entry: { scored: { item: { raw: "Embossed Boots\n10% increased Movement Speed\n+15 to maximum Life" } } } },
  { slot: "amulet", score: 0, entry: { scored: { item: { raw: "Pauper Amulet" } } } },
  { slot: "belt", score: 0, entry: { scored: { item: { raw: "Cloth Belt" } } } },
];

const decisions = RecommendationEngine.generateNextDecisions({
  pobBuild: monkPob,
  playerLevel: 20,
  equippedRows,
});

// Q1 Verification
assert.equal(decisions.q1_currentBuildAndStage.archetype, "Quarterstaff Monk");
assert.equal(decisions.q1_currentBuildAndStage.weapon, "Quarterstaff");
assert.ok(decisions.q1_currentBuildAndStage.stage.includes("Act 2"));
console.log("  PASS Q1: Correctly identified build as Level 20 Quarterstaff Monk in Act 2");

// Q2 Verification: 62% Hit chance MUST be top problem!
assert.ok(decisions.q2_topProblems.length >= 2);
const p1 = decisions.q2_topProblems[0];
assert.equal(p1.id, "accuracy_critical");
assert.equal(p1.urgency, "critical");
assert.ok(p1.detail.includes("38%"));
console.log("  PASS Q2: Hit chance 62% flagged as critical #1 problem (38% miss rate)");

// Q2 Verification: Empty slots and weapon bottleneck also flagged
const hasEmptySlots = decisions.q2_topProblems.some(p => p.id === "empty_slots");
assert.ok(hasEmptySlots, "Must identify empty/dead slots");
const hasWeaponBottleneck = decisions.q2_topProblems.some(p => p.id === "weapon_bottleneck");
assert.ok(hasWeaponBottleneck, "Must identify +38 Quarterstaff bottleneck");
console.log("  PASS Q2: Identified empty slots (Amulet/Belt) and Quarterstaff +38 bottleneck");

// Q3 Verification: Real slot assignment
assert.ok(decisions.q3_slotFixes.some(s => s.slot === "weapon"));
assert.ok(decisions.q3_slotFixes.some(s => s.slot === "gloves" || s.slot === "ring"));
// Ensure quiver is NEVER recommended in slot fixes
assert.ok(!decisions.q3_slotFixes.some(s => s.slot === "quiver" || s.slot === "offhand"));
console.log("  PASS Q3: Slots assigned properly with NO quiver or offhand recommendations");

// Q4 Verification: Ignore list
const ignores = decisions.q4_ignoreRightNow.join(" ");
assert.ok(ignores.includes("75% Elemental Resistance Cap"));
assert.ok(ignores.includes("Quivers & Bow"));
assert.ok(ignores.includes("Level 22 Transition"));
console.log("  PASS Q4: Noise filtered out (75% cap panic, quivers, level 22 transition stability)");

// ─── Test 4: Multi-Dimensional Slot Evaluation ────────────────────────────────
console.log("\n4. Testing Multi-Dimensional Slot Evaluation...");

const context = decisions.context;

// Serviceable Act 2 Ring (20 life, 15 cold res) — must NOT be labeled trash or 0!
const blueRing = {
  name: "Coral Ring",
  raw: "Coral Ring\n+22 to maximum Life\n+16% to Cold Resistance",
  mods: ["+22 to maximum Life", "+16% to Cold Resistance"],
};
const ringEval = RecommendationEngine.evaluateItemDimensions(blueRing, "ring", context);
assert.equal(ringEval.buildFit, "Clean");
assert.equal(ringEval.stageFit, "Good");
assert.ok(ringEval.defense > 20);
assert.equal(ringEval.replaceUrgency, "Serviceable");
console.log("  PASS: Temporary leveling ring correctly evaluated as Clean / Good stageFit / Serviceable");

// Contaminated Item (Bow mods on Quarterstaff build)
const bowStaff = {
  name: "Gilded Staff",
  raw: "Gilded Staff\n35% increased Damage with Bow Skills\n+1 to Level of all Projectile Skills",
  mods: ["35% increased Damage with Bow Skills", "+1 to Level of all Projectile Skills"],
};
const staffEval = RecommendationEngine.evaluateItemDimensions(bowStaff, "weapon", context);
assert.equal(staffEval.buildFit, "Contaminated");
assert.equal(staffEval.replaceUrgency, "Upgrade Priority");
console.log("  PASS: Contaminated bow mods on staff flagged as Contaminated / Upgrade Priority");

// Empty slot
const emptyBelt = { name: "Cloth Belt", raw: "Cloth Belt", mods: [] };
const beltEval = RecommendationEngine.evaluateItemDimensions(emptyBelt, "belt", context);
assert.equal(beltEval.stageFit, "Empty");
assert.equal(beltEval.replaceUrgency, "Immediate Fix");
console.log("  PASS: Empty slot evaluated as Immediate Fix");

console.log("\nAll Recommendation Engine tests passed successfully! 🎉\n");
