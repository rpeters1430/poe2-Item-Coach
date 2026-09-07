// Run with: node scripts/test-monk-quarterstaff.js
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Mock window for app.js
global.window = {
  currentPobbBuild: null,
};

const {
  BUILD_PROFILES,
  inferBuildFocus,
  getAllowedSlotsForFocus,
  buildImportedRules,
  convertGuideItemToPasteText,
  buildNeededStats,
  buildShoppingList,
  healthAdviceForSlot,
  buildNextSteps,
  buildFixSlotsReport,
  pobbWarningsForReport,
} = require("../src/app.js");

// Extract helper functions from source files safely without booting Electron / DOM
const mainCode = fs.readFileSync(path.join(__dirname, "../src/main.js"), "utf8");
const overlayCode = fs.readFileSync(path.join(__dirname, "../src/overlay-renderer.js"), "utf8");

function extractFunction(code, name) {
  const regex = new RegExp(`function\\s+${name}\\s*\\([\\s\\S]*?\\n}`);
  const match = code.match(regex);
  if (!match) throw new Error(`Could not find function ${name}`);
  return match[0];
}

const mainSandbox = {};
vm.createContext(mainSandbox);
vm.runInContext(`
${extractFunction(mainCode, "inferSlotFromItemName")}
${extractFunction(mainCode, "pobSlotToCoachSlot")}
${extractFunction(mainCode, "inferSlotFromPobText")}
${extractFunction(mainCode, "itemClassForSlot")}
`, mainSandbox);

const {
  inferSlotFromItemName,
  pobSlotToCoachSlot,
  inferSlotFromPobText,
  itemClassForSlot,
} = mainSandbox;

const { parseItem, inferSlot } = require("../src/parser.js");
const overlaySandbox = { parseItem, inferSlot };
vm.createContext(overlaySandbox);
vm.runInContext(`
${extractFunction(overlayCode, "defaultFrostRules")}
${extractFunction(overlayCode, "defaultGenericRules")}
${extractFunction(overlayCode, "defaultQuarterstaffRules")}
${extractFunction(overlayCode, "defaultQuarterstaffSlotRules")}
${extractFunction(overlayCode, "defaultSlotRules")}
${overlayCode.match(/const DEFAULT_PROFILES = \{[\s\S]*?\n\};/)[0]}
${extractFunction(overlayCode, "accuracyMultiplier")}
${extractFunction(overlayCode, "splitItems")}
${extractFunction(overlayCode, "itemIdentity")}
${extractFunction(overlayCode, "sameItemIdentity")}
${extractFunction(overlayCode, "findSavedGearEntry")}
${overlayCode.match(/function uncutGemLevel[\s\S]*?\/\/ ─── Coach panel renderer/)[0].replace(/\/\/ ─── Coach panel renderer[\s\S]*$/, "")}
`, overlaySandbox);

const {
  accuracyMultiplier,
  DEFAULT_PROFILES,
  itemIdentity,
  sameItemIdentity,
  findSavedGearEntry,
  gemCoachPlan,
  splitItems,
} = overlaySandbox;

console.log("Running Monk Quarterstaff Test Suite...\n");

// ─── Test 1: inferBuildFocus Detection & Slot Isolation ─────────────────────
console.log("1. Testing inferBuildFocus...");
{
  const monkFocus = inferBuildFocus("Quarterstaff Monk Leveling Guide");
  assert.equal(monkFocus.quarterstaff, true, "Quarterstaff should be detected");
  assert.equal(monkFocus.monk, true, "Monk should be detected");
  assert.equal(monkFocus.melee, true, "Melee should be detected");
  assert.equal(monkFocus.attack, true, "Attack should be detected");
  assert.equal(monkFocus.bow, false, "Bow must be false for Quarterstaff build");
  assert.equal(monkFocus.quiver, false, "Quiver must be false for Quarterstaff build");
  assert.equal(monkFocus.crossbow, false, "Crossbow must be false for Quarterstaff build");

  // Even if guide text contains projectile phrases like "Deflect Projectiles" or "one-shot"
  const trickyMonkText = "Quarterstaff Strike Monk. Deflect Projectiles with evasive step. Avoid one-shot mechanics.";
  const trickyMonkFocus = inferBuildFocus(trickyMonkText);
  assert.equal(trickyMonkFocus.quarterstaff, true);
  assert.equal(trickyMonkFocus.bow, false, "Loose projectile words must not trigger bow on Quarterstaff build");
  assert.equal(trickyMonkFocus.quiver, false, "Quiver must not trigger on Quarterstaff build");

  // Unarmed monk
  const unarmedFocus = inferBuildFocus("Way of the Stonefist Monk");
  assert.equal(unarmedFocus.unarmed, true);
  assert.equal(unarmedFocus.bow, false);
  assert.equal(unarmedFocus.quiver, false);

  // Bow build
  const bowFocus = inferBuildFocus("0.5 Ice Shot Deadeye Leveling Guide");
  assert.equal(bowFocus.bow, true);
  assert.equal(bowFocus.quiver, true);
  assert.equal(bowFocus.quarterstaff, false);

  console.log("  PASS: inferBuildFocus correctly isolates Monk / Quarterstaff from Bow / Quiver");
}

// ─── Test 2: getAllowedSlotsForFocus ─────────────────────────────────────────
console.log("2. Testing getAllowedSlotsForFocus...");
{
  const monkFocus = { quarterstaff: true, monk: true, melee: true, attack: true, bow: false, quiver: false };
  const monkSlots = getAllowedSlotsForFocus(monkFocus);
  assert.ok(monkSlots.includes("weapon"), "Quarterstaff uses weapon");
  assert.ok(!monkSlots.includes("quiver"), "Quarterstaff must NOT include quiver");
  assert.ok(!monkSlots.includes("offhand"), "Quarterstaff must NOT include offhand");

  const unarmedFocus = { unarmed: true, monk: true, melee: true, attack: true, bow: false, quiver: false };
  const unarmedSlots = getAllowedSlotsForFocus(unarmedFocus);
  assert.ok(!unarmedSlots.includes("weapon"), "Unarmed must NOT include weapon");
  assert.ok(!unarmedSlots.includes("quiver"), "Unarmed must NOT include quiver");
  assert.ok(!unarmedSlots.includes("offhand"), "Unarmed must NOT include offhand");

  const bowFocus = { bow: true, quiver: true, attack: true };
  const bowSlots = getAllowedSlotsForFocus(bowFocus);
  assert.ok(bowSlots.includes("weapon"));
  assert.ok(bowSlots.includes("quiver"));

  console.log("  PASS: getAllowedSlotsForFocus prevents illegal offhand/quiver slots");
}

// ─── Test 3: PoB Slot & Text Helpers ─────────────────────────────────────────
console.log("3. Testing PoB slot and text helpers in main.js...");
{
  assert.equal(pobSlotToCoachSlot("Weapon 1"), "weapon");
  assert.equal(pobSlotToCoachSlot("Weapon 2"), "offhand", "Weapon 2 should map to offhand, not quiver");
  assert.equal(pobSlotToCoachSlot("Quiver"), "quiver");
  assert.equal(pobSlotToCoachSlot("Shield"), "offhand");

  assert.equal(inferSlotFromItemName("Gnarled Quarterstaff"), "weapon");
  assert.equal(inferSlotFromItemName("Iron Mask"), "helmet");
  assert.equal(inferSlotFromItemName("Silk Robe"), "body");
  assert.equal(inferSlotFromItemName("Embossed Boots"), "boots");
  assert.equal(inferSlotFromItemName("Studded Belt"), "belt");
  assert.equal(inferSlotFromItemName("Broadhead Quiver"), "quiver");
  assert.equal(inferSlotFromItemName("Round Shield"), "offhand");

  // Base types confirmed against poe2db.tw's own item-class pages (2026-09-07) —
  // these previously returned null because the keywords below were missing.
  assert.equal(inferSlotFromItemName("Wooden Club"), "weapon");
  assert.equal(inferSlotFromItemName("Oak Greathammer"), "weapon");
  assert.equal(inferSlotFromItemName("Kalguuran Forgehammer"), "weapon");
  assert.equal(inferSlotFromItemName("Warpick"), "weapon");
  assert.equal(inferSlotFromItemName("Aberrant Sledge"), "weapon");
  assert.equal(inferSlotFromItemName("Hardwood Spear"), "weapon");
  assert.equal(inferSlotFromItemName("Heartwood Shortbow"), "weapon");
  assert.equal(inferSlotFromItemName("Trarthan Cannon"), "weapon");
  assert.equal(inferSlotFromItemName("Runic Fork"), "weapon");
  assert.equal(inferSlotFromItemName("Morning Star"), "weapon");
  assert.equal(inferSlotFromItemName("Felled Greatclub"), "weapon");
  assert.equal(inferSlotFromItemName("Crescent Targe"), "offhand");
  assert.equal(inferSlotFromItemName("Glacial Fortress"), "offhand");
  assert.equal(inferSlotFromItemName("Venerable Defender"), "offhand");
  assert.equal(inferSlotFromItemName("Wicker Tiara"), "helmet");
  assert.equal(inferSlotFromItemName("Ancient Visor"), "helmet");
  assert.equal(inferSlotFromItemName("Grand Visage"), "helmet");
  assert.equal(inferSlotFromItemName("Bone Raiment"), "body");
  assert.equal(inferSlotFromItemName("Corvus Mantle"), "body");
  assert.equal(inferSlotFromItemName("Grand Regalia"), "body");
  assert.equal(inferSlotFromItemName("Waxed Jacket"), "body");
  assert.equal(inferSlotFromItemName("Primal Markings"), "body");
  assert.equal(inferSlotFromItemName("Rope Cuffs"), "gloves");
  assert.equal(inferSlotFromItemName("Gauze Wraps"), "gloves");
  assert.equal(inferSlotFromItemName("Grand Manchettes"), "gloves");
  assert.equal(inferSlotFromItemName("Straw Sandals"), "boots");
  assert.equal(inferSlotFromItemName("Braced Sabatons"), "boots");
  assert.equal(inferSlotFromItemName("Ancient Leggings"), "boots");
  assert.equal(inferSlotFromItemName("Grand Cuisses"), "boots");
  // Jewel/Tablet/Relic base types legitimately have no coach slot — must stay null.
  assert.equal(inferSlotFromItemName("Diamond"), null);
  assert.equal(inferSlotFromItemName("Timeless Jewel"), null);
  assert.equal(inferSlotFromItemName("Ritual Tablet"), null);
  assert.equal(inferSlotFromItemName("Seal Relic"), null);

  assert.equal(inferSlotFromPobText("Item Class: Quarterstaves\nPlain Quarterstaff"), "weapon");
  assert.equal(inferSlotFromPobText("Item Class: Shields\nRound Shield"), "offhand");

  assert.equal(itemClassForSlot("weapon", "Gnarled Quarterstaff"), "Quarterstaves");
  assert.equal(itemClassForSlot("weapon", "Iron Staff"), "Staves");
  assert.equal(itemClassForSlot("weapon", "Composite Bow"), "Bows");
  assert.equal(itemClassForSlot("offhand", "Round Shield"), "Shields");

  const originalRing = { raw: "Unique ID: abc-123", names: ["Doom Circle", "Ruby Ring"] };
  const upgradedRing = { raw: "Unique ID: ABC-123", names: ["Doom Circle", "Ruby Ring"] };
  const otherRing = { raw: "Unique ID: xyz-789", names: ["Doom Circle", "Ruby Ring"] };
  assert.equal(itemIdentity(originalRing), "id:abc-123");
  assert.equal(sameItemIdentity(originalRing, upgradedRing), true, "Crafted item should retain its equipped identity");
  assert.equal(sameItemIdentity(originalRing, otherRing), false, "Same-named gear with a different Unique ID must stay separate");

  const importedArmour = "Item Class: Body Armours\nRarity: MAGIC\nThorny Rusted Cuirass of the Whelpling\nArmour: 45\n--------\n+7% to Fire Resistance";
  const importedRing = "Item Class: Rings\nRarity: RARE\nDoom Circle\nRuby Ring\n--------\n+10 to maximum Life";
  const savedChunks = splitItems(`${importedArmour}\n\n${importedRing}`);
  assert.equal(savedChunks.length, 2);
  assert.match(savedChunks[0], /^Item Class: Body Armours/);
  assert.equal(inferSlot(parseItem(savedChunks[0])), "body", "Imported Body Armour must retain its class header in the overlay");

  const equipmentFixtures = [
    ["Weapons", "Doom Spire", "Rusted Sword", "weapon-1"],
    ["Weapons", "Rage Bite", "Broad Axe", "weapon-2"],
    ["Shields", "Victory Guard", "Painted Tower Shield", "offhand-shield"],
    ["Quivers", "Havoc Flight", "Fire Quiver", "offhand-quiver"],
    ["Helmets", "Gale Brow", "Iron Mask", "helmet"],
    ["Body Armours", "Hale Mantle", "Rusted Cuirass", "body"],
    ["Gloves", "Viper Fist", "Rawhide Gloves", "gloves"],
    ["Boots", "Storm Pace", "Laced Boots", "boots"],
    ["Amulets", "Victory Heart", "Amber Amulet", "amulet"],
    ["Rings", "Doom Circle", "Ruby Ring", "ring-1"],
    ["Rings", "Havoc Loop", "Sapphire Ring", "ring-2"],
    ["Belts", "Fate Strap", "Utility Belt", "belt"],
    ["Charms", "Thawing Charm", "Thawing Charm", "charm-1"],
    ["Charms", "Dousing Charm", "Dousing Charm", "charm-2"],
    ["Charms", "Grounding Charm", "Grounding Charm", "charm-3"],
    ["Flasks", "Grand Life Flask", "Grand Life Flask", "life-flask"],
    ["Flasks", "Grand Mana Flask", "Grand Mana Flask", "mana-flask"],
  ].map(([itemClass, name, base, id]) => `Item Class: ${itemClass}\nRarity: Rare\n${name}\n${base}\nUnique ID: ${id}\n--------\n+10 to maximum Life`);
  const fullImportedSet = equipmentFixtures.join("\n\n");
  for (const fixture of equipmentFixtures) {
    const copied = parseItem(fixture);
    const slot = inferSlot(copied);
    const found = findSavedGearEntry(fullImportedSet, slot, copied);
    assert.ok(found, `Overlay should find imported ${copied.names[0]}`);
    assert.equal(itemIdentity(found.item), itemIdentity(copied), `Overlay should match the exact ${copied.names[0]} record`);
  }

  const gemPlan = gemCoachPlan(
    { slot: "uncut_support", names: ["Uncut Support Gem (Level 3)"], raw: "" },
    { source: "mobalytics", stages: { campaign: { label: "Campaign", data: { skills: [{ name: "Storm Wave", supports: ["Rage II", "Lightning Attunement"] }] } } } },
    "campaign",
    { skillGroups: [{ name: "Storm Wave", level: 8, supports: ["Lightning Attunement"] }] }
  );
  assert.deepEqual(JSON.parse(JSON.stringify(gemPlan.recommendations)), [{
    gem: "Rage II",
    forSkill: "Storm Wave",
    reason: "Recommended by the current Mobalytics stage and not found in the current PoB setup.",
  }]);

  console.log("  PASS: PoB slot helpers properly distinguish quarterstaves, staves, and shields");
}

// ─── Test 4: accuracyMultiplier ──────────────────────────────────────────────
console.log("4. Testing accuracyMultiplier...");
{
  assert.equal(accuracyMultiplier(62), 2.0, "62% hit chance should get 2.0x multiplier due to severe miss penalty");
  assert.equal(accuracyMultiplier(70), 2.0, "70% hit chance should get 2.0x multiplier");
  assert.equal(accuracyMultiplier(75), 1.6, "75% hit chance should get 1.6x multiplier");
  assert.equal(accuracyMultiplier(85), 1.0, "85% hit chance should get standard 1.0x multiplier");
  assert.equal(accuracyMultiplier(96), 0.15, "96% hit chance should be reduced to 0.15x");

  console.log("  PASS: accuracyMultiplier scales accuracy value up for low hit chance");
}

// ─── Test 5: Build Health & Coaching for Level 20 Quarterstaff Monk ──────────
console.log("5. Testing build health coaching for Level 20 Quarterstaff Monk...");
{
  const profile = BUILD_PROFILES.quarterstaffMonk;
  const stageKey = "act1_2";
  const playerLevel = 20;
  const playerAttrs = { str: 45, dex: 55, int: 35 };

  // Mock character data matching user scenario
  global.window.currentPobbBuild = {
    stats: {
      level: 20,
      hitChance: 62,
      life: 438,
      resistances: { fire: 15, cold: 20, lightning: 10, chaos: -15 },
    },
  };

  const rows = [
    {
      slot: "weapon",
      score: 38,
      entry: { scored: { totalScore: 38, scores: { damage: 20, synergy: 18 }, item: { name: "Gnarled Quarterstaff", raw: "Quarterstaff\nAdds 2 to 4 Physical Damage" } } },
    },
    {
      slot: "helmet",
      score: 25,
      entry: { scored: { totalScore: 25, scores: { defense: 15, resistance: 10 }, item: { name: "Iron Mask" } } },
    },
    {
      slot: "body",
      score: 30,
      entry: { scored: { totalScore: 30, scores: { defense: 20, resistance: 10 }, item: { name: "Silk Robe" } } },
    },
    {
      slot: "gloves",
      score: 22,
      entry: { scored: { totalScore: 22, scores: { damage: 10, defense: 12 }, item: { name: "Rawhide Gloves" } } },
    },
    {
      slot: "boots",
      score: 24,
      entry: { scored: { totalScore: 24, scores: { mobility: 10, defense: 14 }, item: { name: "Rawhide Boots", raw: "10% increased Movement Speed\n+15 to maximum Life" } } },
    },
    {
      slot: "ring",
      score: 18,
      entry: { scored: { totalScore: 18, scores: { resistance: 12, attributes: 6 }, item: { name: "Iron Ring" } } },
    },
    {
      slot: "amulet",
      score: 0,
      entry: { scored: { totalScore: 0, scores: {}, item: { name: "Old Amulet" } } },
    },
    {
      slot: "belt",
      score: 0,
      entry: { scored: { totalScore: 0, scores: {}, item: { name: "Worn Sash" } } },
    },
  ];

  const equippedRows = rows;
  const gearTotals = {
    movementSpeed: 10,
    life: 35,
    fireRes: 10,
    coldRes: 10,
    lightningRes: 0,
    allRes: 5,
    addedPhysicalAvg: 3,
    addedColdAvg: 0,
    addedLightningAvg: 0,
    addedFireAvg: 0,
    attackSpeed: 0,
  };

  // 5a. Needed Stats
  const needed = buildNeededStats({
    rows,
    equippedRows,
    futureRows: [],
    gearTotals,
    requirementProblems: [],
    profile,
    stageKey,
    playerLevel,
    playerAttrs,
  });

  assert.ok(needed.some(n => n.includes("Hit chance is only 62%")), "Must warn critically about 62% hit chance");
  assert.ok(needed.some(n => n.includes("Quarterstaff score is only +38")), "Must note Quarterstaff +38 score bottleneck");
  assert.ok(needed.some(n => n.includes("10% is better than before, but upgrading to 15–20%+")), "Must advise on 10% vs 15-20%+ boots");
  assert.ok(!needed.some(n => /quiver/i.test(n)), "Needed stats must NOT mention quiver for Quarterstaff Monk");

  // 5b. Shopping List
  const shopping = buildShoppingList(profile, stageKey, rows, playerLevel);
  const shoppingSlots = shopping.map(s => s.slot);
  assert.ok(!shoppingSlots.includes("quiver"), "Shopping list must NEVER include quiver for Quarterstaff Monk");
  assert.ok(!shoppingSlots.includes("offhand"), "Shopping list must NOT include offhand for Quarterstaff Monk");
  // Check deduplication (ring should appear once)
  const ringCount = shoppingSlots.filter(s => s === "ring").length;
  assert.equal(ringCount, 1, "Shopping list slots must be deduplicated (only 1 ring card)");

  const weaponCard = shopping.find(s => s.slot === "weapon");
  assert.ok(weaponCard.items.some(i => i.includes("Accuracy")), "Quarterstaff weapon shopping advice should include Accuracy when hit chance is low");

  // 5c. Health Advice For Slot
  const amuletAdvice = healthAdviceForSlot("amulet", rows.find(r => r.slot === "amulet").entry.scored, profile);
  assert.ok(amuletAdvice.includes("Zero score amulet"), "Must call out zero score amulet as upgrade opportunity");

  const beltAdvice = healthAdviceForSlot("belt", rows.find(r => r.slot === "belt").entry.scored, profile);
  assert.ok(beltAdvice.includes("Zero score belt"), "Must call out zero score belt as upgrade opportunity");

  const weaponAdvice = healthAdviceForSlot("weapon", rows.find(r => r.slot === "weapon").entry.scored, profile);
  assert.ok(weaponAdvice.includes("Quarterstaff score is only +38"), "Must provide Quarterstaff-specific bottleneck advice");
  assert.ok(!weaponAdvice.includes("quiver"), "Weapon advice must NOT mention quiver");

  const bootAdvice = healthAdviceForSlot("boots", rows.find(r => r.slot === "boots").entry.scored, profile);
  assert.ok(bootAdvice.includes("10% movement speed is better than before, but upgrading to 15–20%+"), "Must give calibrated boot speed advice");

  // 5d. Next Steps
  const steps = buildNextSteps(rows, equippedRows, [], [], [], profile, stageKey, playerLevel, playerAttrs);
  assert.ok(steps.some(s => s.includes("Hit chance at 62% is a serious problem")), "Next steps must elevate hit chance urgency");
  assert.ok(steps.some(s => s.includes("Level 22 Transition ahead")), "Next steps must note upcoming Level 22 Storm Wave/Siphoning Strike milestone");
  assert.ok(steps.some(s => s.includes("zero-score slot(s)")), "Next steps must advise replacing zero score slots");
  assert.ok(steps.some(s => s.includes("quarterstaff score is only +38")), "Next steps must advise upgrading staff");
  assert.ok(!steps.some(s => /quiver/i.test(s)), "Next steps must NOT mention quiver for Quarterstaff Monk");

  // 5e. Fix Slots Report
  const fixSlots = buildFixSlotsReport(global.window.currentPobbBuild, rows, playerLevel, profile);
  assert.ok(fixSlots.some(s => s.includes("Quarterstaff:")), "Fix slots report must refer to Quarterstaff, NOT Weapon / Quiver");
  assert.ok(!fixSlots.some(s => /quiver/i.test(s)), "Fix slots report must NOT mention quiver");

  // 5f. PoBB Warnings
  const warnings = pobbWarningsForReport(global.window.currentPobbBuild, playerLevel);
  assert.ok(warnings.some(w => w.includes("Hit chance is critically low (62%)")), "pobbWarnings must include critical hit chance warning");
  assert.ok(warnings.some(w => w.includes("Life at 438 is okay-ish for level 20")), "pobbWarnings must note Life 438 is okay-ish but lacks defensive padding");

  console.log("  PASS: All Level 20 Quarterstaff Monk coaching requirements validated!");
}

console.log("\nAll Monk Quarterstaff tests passed successfully! 🎉");
