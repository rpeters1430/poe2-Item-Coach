// Run with: node scripts/test-parser.js
"use strict";
const { parseItem } = require("../src/parser.js");

const cases = [
  { label: "Magic quiver",              text: "Item Class: Quivers\nRarity: Magic\n--------\nRequires: Level 5\n", expect: "quiver" },
  { label: "Rare belt w/ charm slots",  text: "Item Class: Belts\nRarity: Rare\nCharm Slots: 1\n--------\n", expect: "belt" },
  { label: "Charm",                     text: "Item Class: Charms\nRarity: Normal\n--------\n", expect: "charm" },
  { label: "Flask",                     text: "Item Class: Flasks\nRarity: Normal\n--------\n", expect: "flask" },
  { label: "Normal body armour",        text: "Rarity: Normal\nSilk Robe\n--------\nEnergy Shield: 14\n", expect: "body" },
  { label: "Unique helmet",             text: "Item Class: Helmets\nRarity: Unique\n--------\n", expect: "helmet" },
  { label: "Empty placeholder",         text: "Item Class: Quivers\n", expect: null },
  { label: "Thawing Charm",             text: "Item Class: Charms\nRarity: Magic\nThawing Charm\n--------\n", expect: "charm" },
  { label: "Iron Ring",                 text: "Item Class: Rings\nRarity: Normal\nIron Ring\n--------\n", expect: "ring" },
  // 2.5 — harden slot detection regression cases
  { label: "Rare belt (no Item Class)", text: "Rarity: Rare\nHard Leather Belt\n--------\n+35 to maximum Life\n", expect: "belt" },
  { label: "Divine Life Flask",         text: "Item Class: Flasks\nRarity: Normal\nDivine Life Flask\n--------\nRequires: Level 6\n", expect: "flask" },
  { label: "Rare quiver (no IC)",       text: "Rarity: Rare\nOblivion Quill\nFire Quiver\n--------\nAdds 3 to 5 Fire damage to Attacks\n", expect: "quiver" },
  { label: "Rare helmet",               text: "Item Class: Helmets\nRarity: Rare\nIron Mask\n--------\n+20 to maximum Life\n", expect: "helmet" },
  { label: "Rare gloves",               text: "Item Class: Gloves\nRarity: Rare\nBound Bracers\n--------\n+14 to Dexterity\n", expect: "gloves" },
  { label: "Rare boots",                text: "Item Class: Boots\nRarity: Rare\nEmbossed Boots\n--------\n+15% increased Movement Speed\n", expect: "boots" },
  { label: "Rare amulet",               text: "Item Class: Amulets\nRarity: Rare\nBright Talisman\nLapis Amulet\n--------\n+22 to Intelligence\n", expect: "amulet" },
  { label: "Rare body armour",          text: "Item Class: Body Armours\nRarity: Rare\nSilk Robe\n--------\n+55 to maximum Life\n", expect: "body" },
  { label: "Rare bow",                  text: "Item Class: Bows\nRarity: Rare\nCrossbow\n--------\nAdds 5 to 10 Physical Damage to Attacks\n", expect: "weapon" },
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
