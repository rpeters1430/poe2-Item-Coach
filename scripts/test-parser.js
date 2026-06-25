// Run with: node scripts/test-parser.js
"use strict";
const { parseItem } = require("../src/parser.js");

const cases = [
  { label: "Magic quiver",       text: "Item Class: Quivers\nRarity: Magic\n--------\nRequires: Level 5\n", expect: "quiver" },
  { label: "Rare belt w/ charm", text: "Item Class: Belts\nRarity: Rare\nCharm Slots: 1\n--------\n", expect: "belt" },
  { label: "Charm",              text: "Item Class: Charms\nRarity: Normal\n--------\n", expect: "charm" },
  { label: "Flask",              text: "Item Class: Flasks\nRarity: Normal\n--------\n", expect: "flask" },
  { label: "Normal body armour", text: "Rarity: Normal\nSilk Robe\n--------\nEnergy Shield: 14\n", expect: "body" },
  { label: "Unique helmet",      text: "Item Class: Helmets\nRarity: Unique\n--------\n", expect: "helmet" },
  { label: "Empty placeholder",  text: "Item Class: Quivers\n", expect: null },
  { label: "Thawing Charm",      text: "Item Class: Charms\nRarity: Magic\nThawing Charm\n--------\n", expect: "charm" },
  { label: "Iron Ring",          text: "Item Class: Rings\nRarity: Normal\nIron Ring\n--------\n", expect: "ring" },
];

let failed = 0;
for (const c of cases) {
  try {
    const parsed = parseItem(c.text);
    const slot = parsed?.slot ?? null;
    if (slot === c.expect) {
      console.log(`PASS: ${c.label}`);
    } else {
      console.error(`FAIL: ${c.label} — expected "${c.expect}", got "${slot}"`);
      failed++;
    }
  } catch (err) {
    console.error(`FAIL: ${c.label} — threw: ${err.message}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
} else {
  console.log("\nAll tests passed.");
}
