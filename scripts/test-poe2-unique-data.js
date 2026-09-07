// Run with: node scripts/test-poe2-unique-data.js
//
// Regression test for the committed src/poe2-unique-data.js — guards against
// a future `npm run fetch-uniques` silently half-completing or poe2db.tw's
// markup drifting in a way that corrupts the bundled dataset without the
// scraper itself noticing.
"use strict";

const assert = require("node:assert/strict");
const { POE2_UNIQUE_DATA } = require("../src/poe2-unique-data.js");

console.log("Running poe2-unique-data regression tests...\n");

// ─── Shape ────────────────────────────────────────────────────────────────────
{
  assert.equal(typeof POE2_UNIQUE_DATA.version, "string");
  assert.equal(typeof POE2_UNIQUE_DATA.fetched, "string");
  assert.ok(Array.isArray(POE2_UNIQUE_DATA.items), "items must be an array");
  console.log("  PASS: top-level shape");
}

// ─── Plausible item count (guards against a half-completed scrape) ───────────
{
  assert.ok(
    POE2_UNIQUE_DATA.items.length > 400,
    `expected 400+ items, got ${POE2_UNIQUE_DATA.items.length} — scrape may have partially failed`
  );
  console.log(`  PASS: item count (${POE2_UNIQUE_DATA.items.length} items)`);
}

// ─── Every item has the expected record shape ─────────────────────────────────
{
  for (const item of POE2_UNIQUE_DATA.items) {
    assert.equal(typeof item.id, "string");
    assert.equal(typeof item.name, "string");
    assert.equal(typeof item.baseType, "string");
    assert.ok(item.slot === null || typeof item.slot === "string");
    assert.equal(typeof item.levelReq, "number");
    assert.equal(typeof item.attrReqs, "object");
    assert.ok(Array.isArray(item.implicits));
    assert.ok(Array.isArray(item.explicits));
  }
  console.log("  PASS: every item matches the expected record shape");
}

// ─── Known, stable item: Brynhand's Mark ──────────────────────────────────────
{
  const item = POE2_UNIQUE_DATA.items.find(i => i.id === "brynhands_mark");
  assert.ok(item, "Brynhand's Mark must be present");
  assert.equal(item.name, "Brynhand's Mark");
  assert.equal(item.baseType, "Wooden Club");
  assert.equal(item.slot, "weapon");
  assert.equal(item.levelReq, 1);
  assert.ok(item.explicits.length >= 4, "Brynhand's Mark should have at least 4 explicit mods");
  const damageMod = item.explicits.find(m => /Physical Damage/i.test(m.text));
  assert.ok(damageMod, "must have a Physical Damage mod");
  assert.ok(damageMod.ranges.length === 2, "the damage mod must carry a dual range");
  console.log("  PASS: Brynhand's Mark known-item check");
}

// ─── Known, stable item: Trenchtimbre (has an attribute requirement) ──────────
{
  const item = POE2_UNIQUE_DATA.items.find(i => i.id === "trenchtimbre");
  assert.ok(item, "Trenchtimbre must be present");
  assert.equal(item.baseType, "Spiked Club");
  assert.equal(item.slot, "weapon");
  assert.equal(item.levelReq, 16);
  assert.equal(item.attrReqs.str, 31);
  console.log("  PASS: Trenchtimbre known-item check");
}

// ─── No item silently lost its slot due to a keyword-coverage regression ──────
{
  const nullSlotItems = POE2_UNIQUE_DATA.items.filter(i => !i.slot);
  // Expected: only jewel/tablet/relic base types have no coach slot (~16 today).
  // A much larger number would mean inferSlotFromItemName() regressed.
  assert.ok(
    nullSlotItems.length < 40,
    `${nullSlotItems.length} items have no slot — expected roughly ~16 (jewels/tablets/relics). ` +
    `Names: ${nullSlotItems.map(i => i.name).join(", ")}`
  );
  console.log(`  PASS: null-slot count is plausible (${nullSlotItems.length} items, expected ~16)`);
}

console.log("\nAll poe2-unique-data tests passed.");
