// Run with: node scripts/test-pobb-gear-slots.js
//
// Regression test for a bug where main.js's parseDecodedPobExport() let naive
// keyword-sniffing (inferSlotFromPobText) override the authoritative PoB
// <Slot name="..."> assignment. Any equipped item whose mods merely mention
// "Energy Shield" (extremely common on PoE2 body armour/helmet/gloves/boots)
// or "Flasks" (common belt/recovery mods) was silently reassigned to the
// wrong coach slot ("offhand" / "flask"), leaving its real slot empty — which
// is what made the overlay report "nothing equipped" for gear the character
// actually has on.
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const zlib = require("node:zlib");

const mainCode = fs.readFileSync(path.join(__dirname, "../src/main.js"), "utf8");

function extractFunction(code, name) {
  const regex = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\([\\s\\S]*?\\n}`);
  const match = code.match(regex);
  if (!match) throw new Error(`Could not find function ${name}`);
  return match[0];
}

const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(`
${extractFunction(mainCode, "decodeXmlEntities")}
${extractFunction(mainCode, "parseTagAttributes")}
${extractFunction(mainCode, "pobSlotToCoachSlot")}
${extractFunction(mainCode, "inferSlotFromPobText")}
${extractFunction(mainCode, "itemClassForSlot")}
${extractFunction(mainCode, "normalizePobItemText")}
${extractFunction(mainCode, "detectPobItemName")}
${extractFunction(mainCode, "extractAttributesFromDecodedPob")}
${extractFunction(mainCode, "parseDecodedPobExport")}
`, sandbox);

// A body armour with a maximum Energy Shield roll, and a belt with a "recovery
// from Flasks" mod — both realistic, common PoE2 affixes — equipped via PoB's
// own reliable slot attributes (Body Armour / Belt).
const xml = `<PathOfBuilding>
<Items activeItemSet="1">
<Item id="1">
Rarity: RARE
Sanguine Ward
Vaal Regalia
Energy Shield: 210
Unique ID: aaaa
Item Level: 82
LevelReq: 60
Implicits: 0
+87 to maximum Energy Shield
+45 to maximum Life
+30% to Fire Resistance
</Item>
<Item id="2">
Rarity: RARE
Doom Snare
Linen Belt
Unique ID: bbbb
Item Level: 13
LevelReq: 4
Implicits: 0
30% increased Mana Recovery from Flasks
+24 to maximum Mana
</Item>
<ItemSet id="1" title="Default">
<Slot name="Body Armour" itemId="1"/>
<Slot name="Belt" itemId="2"/>
</ItemSet>
</Items>
</PathOfBuilding>`;

const result = sandbox.parseDecodedPobExport(xml);
const bySlot = Object.fromEntries(result.gear.map(g => [g.slot, g.name]));

assert.equal(bySlot.body, "Sanguine Ward", `Body armour with an Energy Shield mod must stay in the "body" slot, got: ${JSON.stringify(bySlot)}`);
assert.equal(bySlot.belt, "Doom Snare", `Belt with a "Flasks" mod must stay in the "belt" slot, got: ${JSON.stringify(bySlot)}`);
assert.equal(bySlot.offhand, undefined, "Body armour must not be misclassified as offhand");
assert.equal(bySlot.flask, undefined, "Belt must not be misclassified as a flask");

console.log("All pobb.in gear-slot tests passed.");
