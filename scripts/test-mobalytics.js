// Run with: node scripts/test-mobalytics.js
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Read source files to test production code directly
const mainCode = fs.readFileSync(path.join(__dirname, "../src/main.js"), "utf8");
const appCode = fs.readFileSync(path.join(__dirname, "../src/app.js"), "utf8");

// Extract helper functions from source
function extractFunction(code, name) {
  const regex = new RegExp(`function\\s+${name}\\s*\\([\\s\\S]*?\\n}`);
  const match = code.match(regex);
  if (!match) {
    throw new Error(`Could not find function ${name} in source code`);
  }
  return match[0];
}

// Set up sandbox for main.js functions
const mainSandbox = { URL };
vm.createContext(mainSandbox);
vm.runInContext(`
${extractFunction(mainCode, "parseMobalyticsInput")}
${extractFunction(mainCode, "extractLexicalText")}
`, mainSandbox);

const { parseMobalyticsInput, extractLexicalText } = mainSandbox;

// ─── Test 1: URL Input Parsing ────────────────────────────────────────────────
console.log("Testing Mobalytics URL input parsing...");

// Community build URL (user example)
const communityUrl = "https://mobalytics.gg/poe-2/profile/fierce-golem-xc5lul/builds/e4321b1e-aa41-4c49-855d-97ffba18f5f5";
const parsedCommunity = parseMobalyticsInput(communityUrl);
assert.ok(parsedCommunity, "Community URL should parse");
assert.equal(parsedCommunity.type, "id");
assert.equal(parsedCommunity.id, "e4321b1e-aa41-4c49-855d-97ffba18f5f5");
assert.equal(parsedCommunity.username, "fierce-golem-xc5lul");

// Direct build UUID URL
const uuidUrl = "https://mobalytics.gg/poe-2/builds/e4321b1e-aa41-4c49-855d-97ffba18f5f5";
const parsedUuid = parseMobalyticsInput(uuidUrl);
assert.ok(parsedUuid);
assert.equal(parsedUuid.type, "id");
assert.equal(parsedUuid.id, "e4321b1e-aa41-4c49-855d-97ffba18f5f5");

// Raw UUID input
const rawUuid = "e4321b1e-aa41-4c49-855d-97ffba18f5f5";
const parsedRaw = parseMobalyticsInput(rawUuid);
assert.ok(parsedRaw);
assert.equal(parsedRaw.type, "id");
assert.equal(parsedRaw.id, "e4321b1e-aa41-4c49-855d-97ffba18f5f5");

// Slug URL (curated guide)
const slugUrl = "https://mobalytics.gg/poe-2/builds/ice-shot-deadeye-leveling-guide";
const parsedSlug = parseMobalyticsInput(slugUrl);
assert.ok(parsedSlug);
assert.equal(parsedSlug.type, "slug");
assert.equal(parsedSlug.slug, "ice-shot-deadeye-leveling-guide");

// Invalid / unrelated URLs
assert.equal(parseMobalyticsInput("https://google.com"), null);
assert.equal(parseMobalyticsInput("https://poe2db.tw/us/"), null);
assert.equal(parseMobalyticsInput(""), null);

console.log("  PASS: All URL parsing test cases passed.");

// ─── Test 2: Lexical Rich Text Extraction ─────────────────────────────────────
console.log("Testing Lexical rich text AST extraction...");

const lexicalDoc = {
  root: {
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "Look for " },
          { type: "text", text: "movement speed on boots.", format: 1 }
        ]
      },
      {
        type: "paragraph",
        children: [
          { type: "text", text: "Prioritize flat damage on rings and gloves early on." }
        ]
      }
    ]
  }
};

const extracted = extractLexicalText(lexicalDoc);
assert.ok(extracted.includes("Look for movement speed on boots."));
assert.ok(extracted.includes("Prioritize flat damage on rings"));
assert.ok(!extracted.includes("[object Object]"));

console.log("  PASS: Lexical AST extraction passed.");

// ─── Test 3: Stage Range Inference & Normalization (from app.js) ──────────────
console.log("Testing Stage range inference and normalizers...");

// Set up sandbox for app.js functions
const appSandbox = {};
vm.createContext(appSandbox);
vm.runInContext(`
${extractFunction(appCode, "cleanStageLabel")}
${extractFunction(appCode, "normalizeGuideNameText")}
${extractFunction(appCode, "stripStagePrefixFromName")}
${extractFunction(appCode, "inferVariantRange")}
${extractFunction(appCode, "cleanAscendancyName")}
${extractFunction(appCode, "baseClassForAscendancy")}
const escapeHtml = value => String(value);
${extractFunction(appCode, "buildIdentityMismatchWarning")}
${extractFunction(appCode, "mapInventoryIdToSlot")}
${extractFunction(appCode, "normalizeInventorySlot")}
`, appSandbox);

const {
  cleanStageLabel,
  stripStagePrefixFromName,
  inferVariantRange,
  cleanAscendancyName,
  baseClassForAscendancy,
  buildIdentityMismatchWarning,
  normalizeInventorySlot,
  mapInventoryIdToSlot
} = appSandbox;

const toPlain = (val) => JSON.parse(JSON.stringify(val));

// Community build variant names
const act1 = inferVariantRange("Act 1 - Whirling Assault Martial Artist ");
assert.deepEqual(toPlain(act1), { min: 1, max: 15, label: "Act 1 (1-15)" });

const act2 = inferVariantRange("Act 2 - Whirling Assault Martial Artist ");
assert.deepEqual(toPlain(act2), { min: 16, max: 28, label: "Act 2 (16-28)" });

const act3 = inferVariantRange("Act 3 - Whirling Assault Martial Artist ");
assert.deepEqual(toPlain(act3), { min: 29, max: 42, label: "Act 3 (29-42)" });

const act4 = inferVariantRange("Act 4 - Whirling Assault Martial Artist ");
assert.deepEqual(toPlain(act4), { min: 43, max: 55, label: "Act 4 (43-55)" });

const interludes = inferVariantRange("Interludes - Whirling Assault Martial Artist ");
assert.deepEqual(toPlain(interludes), { min: 56, max: 64, label: "Interludes (56-64)" });

const mapping = inferVariantRange("Mapping - Whirling Assault Martial Artist ");
assert.deepEqual(toPlain(mapping), { min: 65, max: 84, label: "Mapping (65-84)" });

const endgame = inferVariantRange("End Game - Whirling Assault Martial Artist ");
assert.deepEqual(toPlain(endgame), { min: 85, max: 100, label: "Endgame (85-100)" });

// Fubgun style variants
const uber = inferVariantRange("Uber Endgame - 0.5 Fubgun Ice Shot Deade");
assert.deepEqual(toPlain(uber), { min: 95, max: 100, label: "Uber Endgame" });

const critHybrid = inferVariantRange("Crit Hybrid - 0.5 Fubgun Ice Shot Deade");
assert.deepEqual(toPlain(critHybrid), { min: 90, max: 94, label: "Crit Hybrid" });

console.log("  PASS: Stage range inference passed.");

// ─── Test 4: Stage Prefix Stripping ──────────────────────────────────────────
console.log("Testing Stage prefix stripping...");

assert.equal(
  stripStagePrefixFromName("Act 1 - Whirling Assault Martial Artist "),
  "Whirling Assault Martial Artist"
);
assert.equal(
  stripStagePrefixFromName("Interludes - Whirling Assault Martial Artist "),
  "Whirling Assault Martial Artist"
);
assert.equal(
  stripStagePrefixFromName("End Game - Whirling Assault Martial Artist "),
  "Whirling Assault Martial Artist"
);
assert.equal(
  stripStagePrefixFromName("Uber Endgame - Fubgun Ice Shot Deadeye"),
  "Fubgun Ice Shot Deadeye"
);

console.log("  PASS: Stage prefix stripping passed.");

// ─── Test 5: Ascendancy Name Normalization ────────────────────────────────────
console.log("Testing Ascendancy name normalization...");

assert.equal(cleanAscendancyName("Monk1"), "Invoker");
assert.equal(cleanAscendancyName("Monk2"), "Acolyte of Chayula");
assert.equal(cleanAscendancyName("Ranger1"), "Deadeye");
assert.equal(cleanAscendancyName("Warrior1"), "Titan");
assert.equal(cleanAscendancyName("Mercenary1"), "Witchhunter");
assert.equal(cleanAscendancyName("Mercenary3"), "Tactician");
assert.equal(cleanAscendancyName("Sorceress1"), "Stormweaver");
assert.equal(cleanAscendancyName("Deadeye"), "Deadeye");
assert.equal(cleanAscendancyName(""), "Unknown");
assert.equal(baseClassForAscendancy("Tactician", "Mercenary3"), "Mercenary");

const mercenaryGuide = { source: "mobalytics", mobalytics: { stages: [{ ascendancy: "Mercenary3" }] } };
assert.equal(buildIdentityMismatchWarning(mercenaryGuide, { className: "Mercenary", ascendancy: "None" }), "");
assert.match(buildIdentityMismatchWarning(mercenaryGuide, { className: "Mercenary", ascendancy: "Witchhunter" }), /different build/i);

console.log("  PASS: Ascendancy name normalization passed.");

// ─── Test 6: Slot and Unique Item Normalization ──────────────────────────────
console.log("Testing Slot and unique item normalization...");

// Unique weapon without additional_text (typical in exported .build files)
const uniqueSlot = normalizeInventorySlot({
  inventory_id: "Weapon1",
  slot_x: 0,
  slot_y: 0,
  unique_name: "Amor Mandragora"
});
assert.equal(uniqueSlot.slot, "weapon");
assert.equal(uniqueSlot.name, "Amor Mandragora");
assert.equal(uniqueSlot.uniqueName, "Amor Mandragora");
assert.equal(uniqueSlot.isUnique, true);
assert.equal(uniqueSlot.text, "Amor Mandragora");

// Unique gloves
const uniqueGloves = normalizeInventorySlot({
  inventory_id: "Gloves1",
  slot_x: 0,
  slot_y: 0,
  unique_name: "Lochtonial Caress"
});
assert.equal(uniqueGloves.slot, "gloves");
assert.equal(uniqueGloves.name, "Lochtonial Caress");
assert.equal(uniqueGloves.isUnique, true);

// Shield offhand
const shieldSlot = normalizeInventorySlot({
  inventory_id: "Offhand1",
  additional_text: "Splendid Tower Shield\n+60 maximum Life"
});
assert.equal(shieldSlot.slot, "offhand");

// Quiver offhand
const quiverSlot = normalizeInventorySlot({
  inventory_id: "Offhand1",
  additional_text: "Broadhead Quiver\n+1 to Level of all Projectile Skills"
});
assert.equal(quiverSlot.slot, "quiver");

console.log("  PASS: Slot and unique item normalization passed.");

// ─── Test 7: Full 7-Stage Progression Sorting & Verification ──────────────────
console.log("Testing 7-stage community build progression sorting...");

const variantNames = [
  "End Game - Whirling Assault Martial Artist ",
  "Act 3 - Whirling Assault Martial Artist ",
  "Act 1 - Whirling Assault Martial Artist ",
  "Interludes - Whirling Assault Martial Artist ",
  "Mapping - Whirling Assault Martial Artist ",
  "Act 4 - Whirling Assault Martial Artist ",
  "Act 2 - Whirling Assault Martial Artist ",
];

const normalizedStages = variantNames.map((name, i) => {
  const range = inferVariantRange(name);
  return {
    name,
    minLevel: range.min,
    maxLevel: range.max,
    label: range.label,
  };
});

normalizedStages.sort((a, b) => a.minLevel - b.minLevel || a.maxLevel - b.maxLevel);

assert.equal(normalizedStages[0].label, "Act 1 (1-15)");
assert.equal(normalizedStages[1].label, "Act 2 (16-28)");
assert.equal(normalizedStages[2].label, "Act 3 (29-42)");
assert.equal(normalizedStages[3].label, "Act 4 (43-55)");
assert.equal(normalizedStages[4].label, "Interludes (56-64)");
assert.equal(normalizedStages[5].label, "Mapping (65-84)");
assert.equal(normalizedStages[6].label, "Endgame (85-100)");

console.log("  PASS: 7-stage progression sorting passed.");

console.log("\nAll Mobalytics import tests passed successfully!");
