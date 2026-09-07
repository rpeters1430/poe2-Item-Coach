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
  // PoE2 0.5.5 update cases
  { label: "Soul Core (0.5.5 Trial of Chaos)", text: "Item Class: Soul Cores\nRarity: Normal\nSoul Core of Citaqualotl\n--------\nItem Level: 68\n--------\nWeapon: 30% increased Elemental Damage with Attacks\nArmour: +15% to all Elemental Resistances\n--------\n", expect: "soul_core" },
  { label: "Rune",                      text: "Item Class: Runes\nRarity: Normal\nIron Rune\n--------\nItem Level: 20\n--------\nWeapon: Adds 5 to 10 Physical Damage to Attacks\nArmour: +25 to maximum Life\n", expect: "rune" },
  { label: "Ritual Tablet (0.5.5)",     text: "Item Class: Tablets\nRarity: Magic\nRitual Tablet of the Wildwood\n--------\nItem Level: 75\n--------\nContains 1 Ritual Encounter\nRituals in Area yield 25% increased Tribute\n--------\n", expect: "tablet" },
  { label: "Waystone Map",              text: "Item Class: Waystones\nRarity: Rare\nBramble Valley Waystone (Tier 12)\n--------\nWaystone Tier: 12\nItem Level: 79\n--------\nMonsters deal 40% extra Damage as Fire\nPlayers have 20% less Area of Effect\n--------\n", expect: "waystone" },
  { label: "Inscribed Ultimatum (0.5.5)", text: "Item Class: Inscribed Ultimatum\nRarity: Normal\nInscribed Ultimatum\n--------\nItem Level: 75\n--------\nRequires: 10 Chaos Orbs\nReward: 20 Chaos Orbs\n--------\n", expect: "ultimatum" },
  { label: "Rare Jewel",                text: "Item Class: Jewels\nRarity: Rare\nCrimson Jewel\n--------\nItem Level: 65\n--------\n12% increased Physical Damage\n+14% to Cold Resistance\n", expect: "jewel" },
  { label: "Relic (Trial of Sekhema)",  text: "Item Class: Relics\nRarity: Magic\nUrn Relic\n--------\nItem Level: 50\n--------\n+30 to Maximum Resolve\n", expect: "relic" },
  { label: "Uncut Skill Gem",           text: "Item Class: Uncut Skill Gems\nRarity: Currency\nUncut Skill Gem (Level 14)\n--------\nCreates a Skill Gem or levels an existing gem to Level 14\n", expect: "uncut_skill" },
  { label: "Uncut Support Gem",         text: "Item Class: Uncut Support Gems\nRarity: Currency\nUncut Support Gem (Level 3)\n--------\nCreates a Support Gem\n", expect: "uncut_support" },
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
