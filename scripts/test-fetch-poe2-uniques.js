// Run with: node scripts/test-fetch-poe2-uniques.js
//
// Regression test for the pure HTML-parsing logic in fetch-poe2-uniques.js,
// using two real item blocks captured verbatim from
// https://poe2db.tw/us/Unique_item (2026-09-07). No network access needed —
// these fixtures are frozen HTML, not live-fetched.
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const {
  stripHtml,
  extractRanges,
  parseRequirements,
  splitItemBlocks,
  parseItemBlock,
} = require("./fetch-poe2-uniques.js");

const mainCode = fs.readFileSync(path.join(__dirname, "../src/main.js"), "utf8");
function extractFunction(code, name) {
  const regex = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\([\\s\\S]*?\\n}`);
  const match = code.match(regex);
  if (!match) throw new Error(`Could not find function ${name}`);
  return match[0];
}
const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(extractFunction(mainCode, "inferSlotFromItemName"), sandbox);
const { inferSlotFromItemName } = sandbox;

console.log("Running fetch-poe2-uniques parsing tests...\n");

// ─── Fixture: Brynhand's Mark (simple case — no attribute req, one non-ranged mod) ───
const BRYNHANDS_MARK_HTML = `<div class="d-flex border-top rounded"><div class="flex-shrink-0"><a class="UniqueItems UniqueItem" data-hover="https://cdn.poe2db.tw/x" href="Brynhands_Mark"><img loading="lazy" src="https://cdn.poe2db.tw/x.webp" alt="BrynhandsMark" class="w2" /></a></div><div class="flex-grow-1 ms-2"><div><a class="UniqueItem" data-hover="https://cdn.poe2db.tw/x" href="/us/Brynhands_Mark"><span class="uniqueName">Brynhand's Mark</span> <span class="uniqueTypeLine">Wooden Club</span></a></div><div class="requirements">Requires:  <span class="colourDefault">Level 1</span></div><div class="explicitMod">Adds <span class='mod-value'>(10<span class="ndash">—</span>14)</span> to <span class='mod-value'>(16<span class="ndash">—</span>20)</span> <a data-keyword="Physical" href="Physical_Damage" class="KeywordPopups" data-hover="x">Physical</a> Damage</div><div class="explicitMod"><span class='mod-value'>+(30<span class="ndash">—</span>50)</span> to <a data-keyword="Accuracy" href="Accuracy" class="KeywordPopups" data-hover="x">Accuracy</a> Rating</div><div class="explicitMod"><span class='mod-value'>20</span>% reduced <a data-keyword="Attack" href="Attacks" class="KeywordPopups" data-hover="x">Attack</a> Speed</div><div class="explicitMod"><span class='mod-value'>+(10<span class="ndash">—</span>20)</span> to <a data-keyword="Strength" href="Strength" class="KeywordPopups" data-hover="x">Strength</a></div><div class="explicitMod">Causes Double <a data-keyword="Stun" href="Stun" class="KeywordPopups" data-hover="x">Stun</a> Buildup</div></div></div></div>`;

// ─── Fixture: Trenchtimbre (attribute req present, only single/dual-range mods) ───
const TRENCHTIMBRE_HTML = `<div class="d-flex border-top rounded"><div class="flex-shrink-0"><a class="UniqueItems UniqueItem" data-hover="https://cdn.poe2db.tw/x" href="Trenchtimbre"><img loading="lazy" src="https://cdn.poe2db.tw/x.webp" alt="Trenchtimbre" class="w2" /></a></div><div class="flex-grow-1 ms-2"><div><a class="UniqueItem" data-hover="https://cdn.poe2db.tw/x" href="/us/Trenchtimbre"><span class="uniqueName">Trenchtimbre</span> <span class="uniqueTypeLine">Spiked Club</span></a></div><div class="requirements">Requires:  <span class="colourDefault">Level 16</span>, <span class="colourDefault">31 Str</span></div><div class="explicitMod">Adds <span class='mod-value'>(13<span class="ndash">—</span>15)</span> to <span class='mod-value'>(22<span class="ndash">—</span>25)</span> <a data-keyword="Physical" href="Physical_Damage" class="KeywordPopups" data-hover="x">Physical</a> Damage</div><div class="explicitMod"><span class='mod-value'>(20<span class="ndash">—</span>30)</span>% increased <a data-keyword="Attack" href="Attacks" class="KeywordPopups" data-hover="x">Attack</a> Speed</div><div class="explicitMod"><span class='mod-value'>+(1<span class="ndash">—</span>2)</span> to Level of all <a data-keyword="Minion" href="Minions" class="KeywordPopups" data-hover="x">Minion</a> Skills</div><div class="explicitMod">Increases and Reductions to <a data-keyword="Minion" href="Minions" class="KeywordPopups" data-hover="x">Minion</a> <a data-keyword="Attack" href="Attacks" class="KeywordPopups" data-hover="x">Attack</a> Speed also affect you</div></div></div></div>`;

// ─── stripHtml ────────────────────────────────────────────────────────────────
{
  assert.equal(stripHtml("20</span>% reduced Attack Speed"), "20% reduced Attack Speed", "must not leave a stray space before %");
  assert.equal(stripHtml('(10<span class="ndash">—</span>14)'), "(10–14)", "ndash span must become an en dash");
  console.log("  PASS: stripHtml");
}

// ─── extractRanges ────────────────────────────────────────────────────────────
{
  assert.deepEqual(extractRanges("Adds (10–14) to (16–20) Physical Damage"), [[10, 14], [16, 20]]);
  assert.deepEqual(extractRanges("+(30–50) to Accuracy Rating"), [[30, 50]]);
  assert.deepEqual(extractRanges("Causes Double Stun Buildup"), []);
  assert.deepEqual(extractRanges("(-40–40)% to Fire Resistance"), [[-40, 40]]);
  assert.deepEqual(extractRanges("(-40–-30)% to Lightning Resistance"), [[-40, -30]]);
  assert.deepEqual(extractRanges("+(0.1–1.1)% to Unarmed Melee Crit Chance"), [[0.1, 1.1]]);
  assert.deepEqual(extractRanges("(3.1–6) Life Regeneration per second"), [[3.1, 6]]);
  console.log("  PASS: extractRanges");
}

// ─── parseRequirements ────────────────────────────────────────────────────────
{
  const noAttr = parseRequirements('<span class="colourDefault">Level 1</span>');
  assert.deepEqual(noAttr, { levelReq: 1, attrReqs: { str: 0, dex: 0, int: 0 } });

  const withStr = parseRequirements('<span class="colourDefault">Level 16</span>, <span class="colourDefault">31 Str</span>');
  assert.deepEqual(withStr, { levelReq: 16, attrReqs: { str: 31, dex: 0, int: 0 } });

  // Real observed edge case: some rows show "Int 200" (label before value) instead of "200 Int"
  const labelFirst = parseRequirements('<span class="colourDefault">Level 65</span>, <span class="colourAugmented">214 Str</span>, <span class="colourAugmented">Int 200</span>');
  assert.deepEqual(labelFirst, { levelReq: 65, attrReqs: { str: 214, dex: 0, int: 200 } });

  const decimalAttr = parseRequirements('<span class="colourDefault">Level 33</span>, <span class="colourDefault">40.5 Dex</span>');
  assert.deepEqual(decimalAttr, { levelReq: 33, attrReqs: { str: 0, dex: 40.5, int: 0 } });
  console.log("  PASS: parseRequirements");
}

// ─── splitItemBlocks ──────────────────────────────────────────────────────────
{
  const combined = BRYNHANDS_MARK_HTML + '<div class="col">' + TRENCHTIMBRE_HTML;
  const blocks = splitItemBlocks(combined);
  assert.equal(blocks.length, 2, `expected 2 blocks, got ${blocks.length}`);
  console.log("  PASS: splitItemBlocks");
}

// ─── parseItemBlock: Brynhand's Mark ──────────────────────────────────────────
{
  const result = parseItemBlock(BRYNHANDS_MARK_HTML, inferSlotFromItemName);
  assert.deepEqual(result, {
    id: "brynhands_mark",
    name: "Brynhand's Mark",
    baseType: "Wooden Club",
    slot: "weapon",
    levelReq: 1,
    attrReqs: { str: 0, dex: 0, int: 0 },
    implicits: [],
    explicits: [
      { text: "Adds (10–14) to (16–20) Physical Damage", ranges: [[10, 14], [16, 20]] },
      { text: "+(30–50) to Accuracy Rating", ranges: [[30, 50]] },
      { text: "20% reduced Attack Speed", ranges: [] },
      { text: "+(10–20) to Strength", ranges: [[10, 20]] },
      { text: "Causes Double Stun Buildup", ranges: [] },
    ],
  });
  console.log("  PASS: parseItemBlock (Brynhand's Mark)");
}

// ─── parseItemBlock: Trenchtimbre ─────────────────────────────────────────────
{
  const result = parseItemBlock(TRENCHTIMBRE_HTML, inferSlotFromItemName);
  assert.deepEqual(result, {
    id: "trenchtimbre",
    name: "Trenchtimbre",
    baseType: "Spiked Club",
    slot: "weapon",
    levelReq: 16,
    attrReqs: { str: 31, dex: 0, int: 0 },
    implicits: [],
    explicits: [
      { text: "Adds (13–15) to (22–25) Physical Damage", ranges: [[13, 15], [22, 25]] },
      { text: "(20–30)% increased Attack Speed", ranges: [[20, 30]] },
      { text: "+(1–2) to Level of all Minion Skills", ranges: [[1, 2]] },
      { text: "Increases and Reductions to Minion Attack Speed also affect you", ranges: [] },
    ],
  });
  console.log("  PASS: parseItemBlock (Trenchtimbre)");
}

// ─── parseItemBlock: malformed chunk returns null, not a throw ───────────────
{
  assert.equal(parseItemBlock("<div>not an item</div>", inferSlotFromItemName), null);
  console.log("  PASS: parseItemBlock returns null for a non-item chunk");
}

// ─── parseItemBlock: "Cultivated Uniques" tab markup is intentionally skipped ─
// The listing page's "Cultivated Uniques /48" tab renders items with a
// different template — no uniqueTypeLine, no requirements div, and no /us/
// href, just a bare <a href="Slug">Name</a>. Verified live (2026-09-07):
// every one of those 48 names also has a full standard-tab entry elsewhere on
// the same page (Weapon/Armour/Other), so this markup variant is always a
// redundant "bonus mutated-mod" view of an item already captured elsewhere —
// skipping it here loses zero real unique-item coverage. This fixture is
// Greed's Embrace's real Cultivated-tab block, trimmed.
{
  const CULTIVATED_VARIANT_HTML = `<div class="d-flex border-top rounded"><div class="flex-shrink-0"><a class="UniqueItems UniqueItem" data-hover="x" href="Greeds_Embrace"><img loading="lazy" src="https://cdn.poe2db.tw/x.webp" alt="GreedsEmbrace" class="w2" /></a></div><div class="flex-grow-1 ms-2"><a class="UniqueItems UniqueItem" data-hover="x" href="Greeds_Embrace">Greed's Embrace</a><div class="explicitMod"><span class='mod-value'>(100<span class="ndash">—</span>150)</span>% increased Armour</div></div></div>`;
  assert.equal(
    parseItemBlock(CULTIVATED_VARIANT_HTML, inferSlotFromItemName),
    null,
    "Cultivated-tab markup (no uniqueTypeLine/requirements/us-href) must be skipped, not mis-parsed"
  );
  console.log("  PASS: parseItemBlock skips Cultivated-tab markup (no coverage loss — verified duplicate of standard-tab entry)");
}

console.log("\nAll fetch-poe2-uniques parsing tests passed.");
