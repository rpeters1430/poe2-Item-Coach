# Unique Item Data Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the app a bundled, offline dataset of every current PoE2 unique item (name, base type, slot, requirements, and every implicit/explicit mod with its real value range), scraped from poe2db.tw, so the recommendation engine and any future AI layer have real ground truth instead of zero unique-item awareness.

**Architecture:** A new scraper script (`scripts/fetch-poe2-uniques.js`, sibling to the existing `scripts/fetch-poe2db.js`) fetches one page from poe2db.tw, parses ~493 repeating item blocks with regex, and fully generates a new bundled data file (`src/poe2-unique-data.js`, sibling to `src/poe2-mod-data.js`) loaded as a `<script>` in both the overlay and settings windows. Slot inference reuses `inferSlotFromItemName()` from `src/main.js` rather than adding a fourth divergent slot-inference implementation — which surfaced a real, pre-existing gap in that function (25% of real base types didn't match any keyword) that gets fixed first, as its own task, because both this scraper and the live PoB-import path depend on it.

**Tech Stack:** Plain Node.js (`https`, `fs`, `vm`), no new dependencies. No headless browser — the source page is fully server-rendered.

**Spec:** `docs/superpowers/specs/2026-09-07-unique-item-data-design.md`

## Global Constraints

- No new npm dependencies (per existing project convention — plain CommonJS, no bundler).
- `src/main.js` must never be `require()`'d directly from a plain Node script; extract only the needed function's source via regex + `vm.runInContext()`, matching the pattern already established in `scripts/test-clipboard-watcher.js` and `scripts/test-pobb-gear-slots.js`.
- Slot inference must go through `inferSlotFromItemName()` — do not write a fourth independent slot-inference implementation (the codebase already has three: `main.js`, `parser.js`, `app.js`).
- Every new `scripts/test-*.js` file must be a plain Node script using `node:assert/strict`, print `PASS`/a final success line, and exit nonzero on failure (no test framework) — matching every existing `scripts/test-*.js`.
- `npm run check` (syntax check) and `npm test` must both pass after every task.

---

### Task 1: Fix `inferSlotFromItemName()` gaps in `src/main.js`

While prototyping the scraper against live poe2db.tw data, 94 of 368 distinct unique base types (25%) failed to match any keyword in `inferSlotFromItemName()` — e.g. "Wooden Club", "Oak Greathammer", "Hardwood Spear", "Bone Raiment", "Wicker Tiara", "Rope Cuffs", "Straw Sandals" all returned `null`. This isn't a scraper-specific bug — this same function is used for live PoB-import slot inference — so it must be fixed at the source, benefiting both call sites. Verified against poe2db.tw's own Body Armours/Helmets/Gloves/Boots/Belts/One&Two-Hand-Maces/Spears/Crossbows/Shields pages (2026-09-07) to confirm every added keyword against real base-type lists — not guessed.

After the fix, only 16 base types still return `null`, and all 16 are legitimately non-equipment items with no coach slot (5 jewel bases: Diamond, Ruby, Sapphire, Time-Lost Diamond, Timeless Jewel; 6 tablet bases; 5 relic bases) — confirmed correct, not a gap.

**Files:**
- Modify: `src/main.js:1806-1823` (the `inferSlotFromItemName` function)
- Modify: `scripts/test-monk-quarterstaff.js:156` (add assertions right after the existing `inferSlotFromItemName` assertions)

**Interfaces:**
- Produces: `inferSlotFromItemName(name: string): "weapon"|"offhand"|"helmet"|"body"|"gloves"|"boots"|"amulet"|"ring"|"belt"|"flask"|"charm"|null` — same signature as today, just wider keyword coverage. Task 2 and Task 3 both call this via the existing `vm.runInContext` extraction pattern.

- [ ] **Step 1: Write the failing test assertions**

In `scripts/test-monk-quarterstaff.js`, immediately after line 156 (`assert.equal(inferSlotFromItemName("Round Shield"), "offhand");`), insert:

```javascript
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node scripts/test-monk-quarterstaff.js`
Expected: `AssertionError` on the first new `Wooden Club` assertion (`null !== "weapon"`).

- [ ] **Step 3: Patch `inferSlotFromItemName()` in `src/main.js`**

Replace the function body (`src/main.js:1806-1823`) with:

```javascript
function inferSlotFromItemName(name) {
  const n = String(name || "").toLowerCase();
  if (/^primal markings$/i.test(n)) return "body"; // no shared body-armour keyword; exact-name special case
  if (/quiver/.test(n)) return "quiver";
  if (/quarterstaff|\bstaff\b|\bstaves\b|\bwarstaff\b/.test(n)) return "weapon";
  if (/\bbow\b|\bcrossbow\b|shortbow/.test(n)) return "weapon";
  if (/\bsword\b|\bblade\b|\baxe\b|\bmace\b|\bflail\b|\bdagger\b|\bwand\b|\bsceptre\b|\bscepter\b|\bclaw\b|\bclub\b|hammer|\bpick\b|\bmaul\b|\bspear\b|\bcannon\b|\bfork\b|\bsledge\b|greatclub|warpick|morning star/.test(n)) return "weapon";
  if (/shield|buckler|crest|tower shield|round shield|kite shield|spiked shield|\bfocus\b|\bdefender\b|\btarge\b|\bfortress\b/.test(n)) return "offhand";
  if (/helm|helmet|circlet|crown|cap\b|hood|mask|casque|sallet|burgonet|coif|tiara|visor|visage/.test(n)) return "helmet";
  if (/armour|armor|vestments|vest\b|robe|chest|plate|garb|mail\b|tunic|cuirass|jerkin|coat\b|raiment|mantle|regalia|garment|jacket/.test(n)) return "body";
  if (/glove|mitt|gauntlet|bracer|touch\b|cuffs|wraps|manchettes/.test(n)) return "gloves";
  if (/boot|greave|shoe|slipper|foot|stride|sandal|sabaton|legging|cuisse/.test(n)) return "boots";
  if (/amulet|talisman|collar|choker|pendant/.test(n)) return "amulet";
  if (/ring|band\b|loop\b|signet|finger/.test(n)) return "ring";
  if (/belt|sash|girdle|strap|wrap\b|chain\b/.test(n)) return "belt";
  if (/flask|vial/.test(n)) return "flask";
  if (/charm/.test(n)) return "charm";
  return null;
}
```

Notes on what changed vs. the original (for the reviewer): added `\bclub\b`, `hammer` (no boundary — "Greathammer"/"Forgehammer" are concatenated words, so `\bhammer\b` would miss them, and no non-weapon base type contains "hammer"), `\bpick\b`, `\bmaul\b`, `\bspear\b`, `\bcannon\b`, `\bfork\b`, `\bsledge\b`, `greatclub`, `warpick`, `morning star` to the weapon group; `\bdefender\b`, `\btarge\b`, `\bfortress\b` to offhand; `tiara|visor|visage` to helmet; `raiment|mantle|regalia|garment|jacket` to body; `cuffs|wraps|manchettes` to gloves; `sandal|sabaton|legging|cuisse` to boots; and one exact-name special case for "Primal Markings" (a confirmed body-armour base type sharing no keyword with any other body armour name).

- [ ] **Step 4: Run the test to verify it passes**

Run: `node scripts/test-monk-quarterstaff.js`
Expected: all sections print `PASS`, ending with `All Monk Quarterstaff tests passed successfully! 🎉`

- [ ] **Step 5: Run the full check + test suite**

Run: `npm test`
Expected: every `test:*` script passes (this function is also exercised by `scripts/test-pobb-gear-slots.js` indirectly through `parseDecodedPobExport`, so confirm nothing else regressed).

- [ ] **Step 6: Commit**

```bash
git add src/main.js scripts/test-monk-quarterstaff.js
git commit -m "$(cat <<'EOF'
fix: widen inferSlotFromItemName() base-type keyword coverage

Discovered while building the unique-item scraper: 94 of 368 real PoE2
base types (Club, Greathammer, Spear, Raiment, Mantle, Tiara, Cuffs,
Wraps, Sabatons, Leggings, and more) matched no keyword and silently
returned null. Verified the fix against poe2db.tw's own item-class
pages. This function is shared with the live PoB-import slot
inference path, so the fix benefits both.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XSdx8v5t93Qvso2UanmBzp
EOF
)"
```

---

### Task 2: Parsing helpers for the unique-item scraper (TDD against real fixtures)

Build the pure, network-free parsing logic first, against two real HTML fixtures captured verbatim from poe2db.tw's unique-item listing page (2026-09-07) — `Brynhand's Mark` (a simple case: no attribute requirement, one non-ranged mod, one dual-range mod) and `Trenchtimbre` (a case with an attribute requirement and only single/dual-range mods). This isolates the regex-parsing logic from network/file-writing concerns and is fully testable in CI with no network access.

**Files:**
- Create: `scripts/fetch-poe2-uniques.js` (parsing functions only in this task; network/orchestration added in Task 3)
- Create: `scripts/test-fetch-poe2-uniques.js`

**Interfaces:**
- Consumes: `inferSlotFromItemName` from `src/main.js`, extracted via the `extractFunction` + `vm.runInContext` pattern (same as `scripts/test-pobb-gear-slots.js:21-26`).
- Produces (all exported via `module.exports` from `scripts/fetch-poe2-uniques.js`, consumed by Task 3 and by the test in this task):
  - `stripHtml(html: string): string`
  - `extractRanges(text: string): number[][]`
  - `parseRequirements(reqHtml: string): { levelReq: number, attrReqs: { str: number, dex: number, int: number } }`
  - `splitItemBlocks(html: string): string[]` — splits the full listing page into one chunk per item, using the `d-flex border-top rounded` marker
  - `parseItemBlock(chunk: string, inferSlotFromItemName: Function): object|null` — returns `null` if the chunk has no recognizable item (defensive against a malformed/partial chunk), otherwise the full item record shape from the spec

- [ ] **Step 1: Write the failing test with real fixtures**

Create `scripts/test-fetch-poe2-uniques.js`:

```javascript
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node scripts/test-fetch-poe2-uniques.js`
Expected: `Error: Cannot find module './fetch-poe2-uniques.js'` (the file doesn't exist yet).

- [ ] **Step 3: Implement the parsing functions**

Create `scripts/fetch-poe2-uniques.js` with this content:

```javascript
/**
 * scripts/fetch-poe2-uniques.js — Build src/poe2-unique-data.js from poe2db.tw
 *
 * Usage:  npm run fetch-uniques
 *
 * Unlike fetch-poe2db.js (which patches individual mod tiers into a hand-
 * maintained file), this script fully regenerates src/poe2-unique-data.js —
 * every field in that file is scraped, nothing is hand-curated, so a full
 * overwrite is simpler and safer than a partial patch.
 *
 * Source: a single page (https://poe2db.tw/us/Unique_item) embeds all ~493
 * current unique items across four tabs (Weapon/Armour/Other/Cultivated).
 * No headless browser needed — fully server-rendered. Confirmed live
 * 2026-09-07: one fetch yields every item, no per-item page crawl required.
 */
"use strict";

// ─── Pure parsing helpers (network-free, unit tested in test-fetch-poe2-uniques.js) ───

function stripHtml(html) {
  return html
    .replace(/<span\s[^>]*class="ndash"[^>]*>[^<]*<\/span>/g, "–")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+%/g, "%")
    .trim();
}

function extractRanges(text) {
  const ranges = [];
  const re = /\((\d+)[–—-](\d+)\)/g;
  let m;
  while ((m = re.exec(text))) ranges.push([Number(m[1]), Number(m[2])]);
  return ranges;
}

function parseRequirements(reqHtml) {
  const spans = [...reqHtml.matchAll(/<span class="colour\w+">([^<]+)<\/span>/g)].map(m => m[1].trim());
  let levelReq = 0;
  const attrReqs = { str: 0, dex: 0, int: 0 };
  for (const s of spans) {
    const lvlM = s.match(/^Level\s+(\d+)$/i);
    if (lvlM) { levelReq = Number(lvlM[1]); continue; }
    const valueFirst = s.match(/^(\d+)\s*(Str|Dex|Int)$/i);
    const labelFirst = s.match(/^(Str|Dex|Int)\s*(\d+)$/i);
    const attr = (valueFirst?.[2] || labelFirst?.[1] || "").toLowerCase();
    const value = Number(valueFirst?.[1] ?? labelFirst?.[2] ?? 0);
    if (attr === "str") attrReqs.str = value;
    else if (attr === "dex") attrReqs.dex = value;
    else if (attr === "int") attrReqs.int = value;
  }
  return { levelReq, attrReqs };
}

const BLOCK_MARKER = "d-flex border-top rounded";

function splitItemBlocks(html) {
  const idxs = [];
  let i = 0;
  while (true) {
    const idx = html.indexOf(BLOCK_MARKER, i);
    if (idx === -1) break;
    idxs.push(idx);
    i = idx + BLOCK_MARKER.length;
  }
  const blocks = [];
  for (let b = 0; b < idxs.length; b++) {
    // Each block's own wrapper div starts a bit before the marker text itself.
    const start = html.lastIndexOf('<div class="d-flex border-top rounded">', idxs[b] + BLOCK_MARKER.length);
    const end = idxs[b + 1] !== undefined
      ? html.lastIndexOf('<div class="col">', idxs[b + 1])
      : html.indexOf('<div class="col">', idxs[b]) === -1
        ? html.length
        : html.length;
    blocks.push(html.slice(start === -1 ? idxs[b] : start, end > (start === -1 ? idxs[b] : start) ? end : html.length));
  }
  return blocks;
}

function parseItemBlock(chunk, inferSlotFromItemName) {
  const nameM = chunk.match(/<span class="uniqueName">([^<]+)<\/span>/);
  const typeM = chunk.match(/<span class="uniqueTypeLine">([^<]+)<\/span>/);
  const hrefM = chunk.match(/href="\/us\/([^"]+)"/);
  if (!nameM || !typeM || !hrefM) return null;

  const name = nameM[1].trim();
  const baseType = typeM[1].trim();
  const id = hrefM[1].toLowerCase();

  const reqM = chunk.match(/<div class="requirements">Requires:\s*([\s\S]*?)<\/div>/);
  const { levelReq, attrReqs } = reqM
    ? parseRequirements(reqM[1])
    : { levelReq: 0, attrReqs: { str: 0, dex: 0, int: 0 } };

  const implicits = [];
  const explicits = [];
  const modRe = /<div class="(explicitMod|implicitMod)">([\s\S]*?)<\/div>/g;
  let mm;
  while ((mm = modRe.exec(chunk))) {
    const text = stripHtml(mm[2]);
    const entry = { text, ranges: extractRanges(text) };
    if (mm[1] === "implicitMod") implicits.push(entry); else explicits.push(entry);
  }

  const slot = inferSlotFromItemName(baseType) || null;

  return { id, name, baseType, slot, levelReq, attrReqs, implicits, explicits };
}

module.exports = {
  stripHtml,
  extractRanges,
  parseRequirements,
  splitItemBlocks,
  parseItemBlock,
};
```

**Note for the implementer:** the `splitItemBlocks` boundary logic above is deliberately defensive about the two ways a block can end (followed by another `<div class="col">` item wrapper, or by the end of the tab section) — but the real, load-bearing correctness check is Step 4, not a read of this code. Run it.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node scripts/test-fetch-poe2-uniques.js`
Expected: every section prints `PASS`, ending with `All fetch-poe2-uniques parsing tests passed.`

If `splitItemBlocks` doesn't produce exactly 2 blocks from the two-fixture test, debug by logging `blocks.map(b => b.length)` — the most likely failure mode is the boundary arithmetic between blocks; simplify it if needed (e.g. slice from marker-start to next-marker-start rather than trying to land exactly on `<div class="col">`, since parseItemBlock only needs the fields it explicitly regexes for and tolerates trailing garbage from the next block's leading wrapper divs — as long as it doesn't tolerate trailing garbage that itself matches `uniqueName`/`uniqueTypeLine`, which the `<div class="col">` split point already guards against).

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-poe2-uniques.js scripts/test-fetch-poe2-uniques.js
git commit -m "$(cat <<'EOF'
feat: add poe2db.tw unique-item HTML parsing (no network yet)

Pure, network-free parsing functions for the upcoming unique-item
scraper, TDD'd against two real HTML fixtures captured verbatim from
poe2db.tw's unique-item listing page. Network fetching and the
src/poe2-unique-data.js file generation land in the next commit.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XSdx8v5t93Qvso2UanmBzp
EOF
)"
```

---

### Task 3: Network fetching, file generation, and wiring

Add the HTTP fetch (with disk cache + retry/backoff, copied from the proven pattern in `scripts/fetch-poe2db.js`), the `src/poe2-unique-data.js` file generator, and the `main()` orchestration to `scripts/fetch-poe2-uniques.js`. Wire up `npm run fetch-uniques` and the new `<script>` include in both HTML windows.

**Files:**
- Modify: `scripts/fetch-poe2-uniques.js` (append to the file from Task 2 — do not touch the exports from Task 2)
- Modify: `package.json` (add `fetch-uniques` script)
- Modify: `src/overlay.html:695` (add `<script src="poe2-unique-data.js"></script>` before `parser.js`, alongside the existing `poe2-mod-data.js` include)
- Modify: `src/settings.html:683` (same, alongside the existing `poe2-mod-data.js` include)

**Interfaces:**
- Consumes: `stripHtml`, `extractRanges`, `parseRequirements`, `splitItemBlocks`, `parseItemBlock` from Task 2 (already in this same file, no import needed).
- Consumes: `inferSlotFromItemName` extracted from `src/main.js` via the `vm.runInContext` pattern (same as Task 2's test).
- Produces: `npm run fetch-uniques` — a working CLI command; `src/poe2-unique-data.js` — the generated data file (not created by this task's code changes alone; created by actually *running* the command in Task 4).

- [ ] **Step 1: Append the HTTP/cache/retry helpers, copied from `scripts/fetch-poe2db.js`**

Append to `scripts/fetch-poe2-uniques.js` (after the `module.exports` block from Task 2 — move that `module.exports` to the very end of the file once this step is done, since Node only honors the last assignment to `module.exports`):

```javascript
// ─── HTTP + disk cache (same pattern as fetch-poe2db.js) ──────────────────────

const https = require("https");
const fs = require("fs");
const path = require("path");

const SOURCE_URL = "https://poe2db.tw/us/Unique_item";
const OUT_FILE = path.resolve(__dirname, "../src/poe2-unique-data.js");
const CACHE_FILE = path.resolve(__dirname, "../data/poe2db-cache/unique_item.html");
const RETRY_DELAYS = [5_000, 15_000, 30_000];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function cachedHtml() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    if (Date.now() - fs.statSync(CACHE_FILE).mtimeMs > 24 * 3600_000) return null; // 24h TTL
    return fs.readFileSync(CACHE_FILE, "utf8");
  } catch { return null; }
}

function saveCachedHtml(html) {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, html, "utf8");
  } catch {}
}

function httpsGet(urlString) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const req = https.request({
      method: "GET", hostname: url.hostname, path: url.pathname + url.search,
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "referer": "https://poe2db.tw/us/",
      },
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsGet(new URL(res.headers.location, urlString).toString()).then(resolve, reject);
        return;
      }
      let body = ""; res.setEncoding("utf8");
      res.on("data", c => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject); req.end();
  });
}

async function fetchListingPage() {
  const cached = cachedHtml();
  if (cached) {
    console.log(`[fetch-uniques] Using cached HTML (24h TTL) — skipping network request`);
    return cached;
  }
  let lastStatus = null;
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    if (attempt > 0) {
      const wait = RETRY_DELAYS[attempt - 1];
      console.log(`[fetch-uniques]   → ${lastStatus} — retrying in ${wait / 1000}s…`);
      await sleep(wait);
    }
    console.log(`[fetch-uniques] GET ${SOURCE_URL}${attempt > 0 ? ` (attempt ${attempt + 1})` : ""}`);
    const res = await httpsGet(SOURCE_URL);
    lastStatus = res.status;
    if (res.status === 503 || res.status === 429) continue;
    if (res.status !== 200) throw new Error(`Unexpected HTTP ${res.status} from ${SOURCE_URL}`);
    saveCachedHtml(res.body);
    return res.body;
  }
  throw new Error(`Failed after ${RETRY_DELAYS.length + 1} attempts, last status: ${lastStatus}`);
}
```

- [ ] **Step 2: Append the file generator**

```javascript
// ─── File generation ───────────────────────────────────────────────────────────

function formatDataFile(items) {
  const now = new Date().toISOString();
  const itemsJson = JSON.stringify(items, null, 2);
  return `/**
 * poe2-unique-data.js — PoE2 unique item database
 *
 * Loaded as <script> in overlay.html / settings.html (declares POE2_UNIQUE_DATA),
 * and require()'d in Node.js for tests / the fetch script.
 *
 * Fully generated from poe2db.tw — do not hand-edit. Run \`npm run fetch-uniques\`
 * to refresh after a league update adds/removes/rebalances uniques.
 */
"use strict";

/* eslint-disable no-unused-vars */
const POE2_UNIQUE_DATA = {
  version: "1.0.0",
  fetched: "${now}",
  source: "poe2db.tw/us/Unique_item",
  items: ${itemsJson}
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { POE2_UNIQUE_DATA };
}
`;
}
```

- [ ] **Step 3: Append `main()` orchestration**

```javascript
// ─── Main ─────────────────────────────────────────────────────────────────────

function getInferSlotFromItemName() {
  const vm = require("vm");
  const mainCode = fs.readFileSync(path.join(__dirname, "../src/main.js"), "utf8");
  const match = mainCode.match(/function\s+inferSlotFromItemName\s*\([\s\S]*?\n}/);
  if (!match) throw new Error("Could not find inferSlotFromItemName in src/main.js");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(match[0], sandbox);
  return sandbox.inferSlotFromItemName;
}

async function main() {
  console.log(`[fetch-uniques] Starting unique-item refresh — ${new Date().toISOString()}`);

  const html = await fetchListingPage();
  const inferSlotFromItemName = getInferSlotFromItemName();
  const blocks = splitItemBlocks(html);
  console.log(`[fetch-uniques] Found ${blocks.length} item blocks`);

  const items = [];
  const nullSlotNames = [];
  let skippedCultivated = 0;
  for (const block of blocks) {
    const item = parseItemBlock(block, inferSlotFromItemName);
    if (!item) { skippedCultivated++; continue; }
    items.push(item);
    if (!item.slot) nullSlotNames.push(`${item.name} (${item.baseType})`);
  }
  if (skippedCultivated) {
    // Expected: ~48, all "Cultivated Uniques" tab entries — verified 2026-09-07
    // that every one of those names also has a full standard-tab entry
    // elsewhere on the page, so this is not data loss. See the comment on the
    // "Cultivated Uniques tab markup is intentionally skipped" test case in
    // test-fetch-poe2-uniques.js for the full explanation.
    console.log(`[fetch-uniques] Skipped ${skippedCultivated} blocks with no recognizable standard item markup (expected: Cultivated Uniques tab duplicates)`);
  }

  if (items.length < 400) {
    console.error(`[fetch-uniques] ERROR: only parsed ${items.length} items, expected 400+. Aborting without writing — poe2db.tw's markup may have changed.`);
    process.exit(1);
  }

  console.log(`[fetch-uniques] Parsed ${items.length} items`);
  if (nullSlotNames.length) {
    console.log(`[fetch-uniques] ${nullSlotNames.length} items have no coach slot (expected for jewels/tablets/relics — verify any surprises):`);
    nullSlotNames.forEach(n => console.log(`[fetch-uniques]   - ${n}`));
  }

  const output = formatDataFile(items);
  fs.writeFileSync(OUT_FILE, output, "utf8");

  // Verify the freshly written file is valid and loadable before keeping it.
  try {
    delete require.cache[require.resolve(OUT_FILE)];
    const written = require(OUT_FILE);
    const count = written.POE2_UNIQUE_DATA?.items?.length || 0;
    console.log(`[fetch-uniques] ✓ Wrote ${OUT_FILE} (${count} items)`);
  } catch (err) {
    console.error(`[fetch-uniques] ERROR: ${OUT_FILE} invalid after write: ${err.message}`);
    process.exit(1);
  }

  console.log("\n[fetch-uniques] Done. Re-run anytime: npm run fetch-uniques");
}

module.exports = {
  stripHtml,
  extractRanges,
  parseRequirements,
  splitItemBlocks,
  parseItemBlock,
  formatDataFile,
};

if (require.main === module) {
  main().catch(err => {
    console.error(`[fetch-uniques] Fatal: ${err.message}`);
    process.exit(1);
  });
}
```

Note: this `module.exports` block replaces the one from the end of Task 2 (delete that earlier one — Task 2's five functions are still exported here, plus the new `formatDataFile`). The `if (require.main === module)` guard means `require("./fetch-poe2-uniques.js")` from `test-fetch-poe2-uniques.js` does **not** trigger a live network fetch — only running the file directly (`node scripts/fetch-poe2-uniques.js`) does.

- [ ] **Step 4: Wire `npm run fetch-uniques`**

In `package.json`, in the `scripts` block, add a new line right after `"fetch-mods": "node scripts/fetch-poe2db.js",`:

```json
    "fetch-uniques": "node scripts/fetch-poe2-uniques.js",
```

- [ ] **Step 5: Add the `<script>` include to both HTML windows**

In `src/overlay.html`, line 695 currently reads:
```html
<script src="poe2-mod-data.js"></script>
```
Change to:
```html
<script src="poe2-mod-data.js"></script>
<script src="poe2-unique-data.js"></script>
```

In `src/settings.html`, line 683 currently reads:
```html
<script src="poe2-mod-data.js"></script>
```
Change to the same two-line form.

- [ ] **Step 6: Verify the parsing tests still pass (no network needed)**

Run: `node scripts/test-fetch-poe2-uniques.js`
Expected: still passes — Task 2's tests call the exported functions directly and never trigger `main()`, since `require()` doesn't execute code under the `require.main === module` guard.

- [ ] **Step 7: Run `npm run check`**

Run: `npm run check`
Expected: passes (this only syntax-checks the core `src/*.js` files listed in that script — `scripts/*.js` files aren't included, but `node --check scripts/fetch-poe2-uniques.js` should be run manually here too to catch typos before Task 4's real network run):

Run: `node --check scripts/fetch-poe2-uniques.js`
Expected: no output, exit code 0.

- [ ] **Step 8: Commit**

```bash
git add scripts/fetch-poe2-uniques.js package.json src/overlay.html src/settings.html
git commit -m "$(cat <<'EOF'
feat: wire up npm run fetch-uniques and load poe2-unique-data.js

Adds network fetching (with the same disk-cache + retry/backoff
pattern as fetch-poe2db.js) and file generation on top of the parsing
logic from the previous commit, plus the npm script and <script>
includes. src/poe2-unique-data.js itself is generated by actually
running the command in the next commit, not by this one.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XSdx8v5t93Qvso2UanmBzp
EOF
)"
```

---

### Task 4: Run the scraper for real and commit the generated dataset

**Files:**
- Create (generated, not hand-written): `src/poe2-unique-data.js`

**Interfaces:**
- Produces: the real, committed `src/poe2-unique-data.js` that Task 5's regression test asserts against.

- [ ] **Step 1: Run the scraper**

Run: `npm run fetch-uniques`

Expected output ends with something like:
```
[fetch-uniques] Found 493 item blocks
[fetch-uniques] Skipped 48 blocks with no recognizable standard item markup (expected: Cultivated Uniques tab duplicates)
[fetch-uniques] Parsed 445 items
[fetch-uniques] N items have no coach slot (expected for jewels/tablets/relics — verify any surprises):
[fetch-uniques]   - ...
[fetch-uniques] ✓ Wrote .../src/poe2-unique-data.js (445 items)

[fetch-uniques] Done. Re-run anytime: npm run fetch-uniques
```

The gap between 493 blocks and ~445 parsed items is expected, not a bug — the ~48 skipped blocks are the "Cultivated Uniques" tab's duplicate-name entries, every one of which already has a full standard-tab entry among the 445 (verified 2026-09-07). If the parsed count comes back well under 445 (e.g. under 400, which the script's own abort-and-don't-write guard already catches) or the skipped count is well over ~50, that's the real signal something broke.

- [ ] **Step 2: Review the null-slot list printed above**

Confirm every name in the "no coach slot" list is a jewel, tablet, or relic (per Task 1's investigation, expect ~16: Diamond, Ruby, Sapphire, Time-Lost Diamond, Timeless Jewel, and 6 Tablet + 5 Relic variants). If anything else shows up in that list, it means poe2db.tw added a new base type this run that Task 1's `inferSlotFromItemName()` fix doesn't cover yet — note it, but don't block this task on it (a `slot: null` item is safely inert everywhere it's consumed; file a follow-up rather than expanding scope here).

- [ ] **Step 3: Spot-check the generated file**

Run: `node -e "const d = require('./src/poe2-unique-data.js').POE2_UNIQUE_DATA; console.log(d.items.find(i => i.id === 'brynhands_mark'))"`

Expected: prints the Brynhand's Mark record with `slot: 'weapon'`, `levelReq: 1`, and 5 `explicits` entries — confirming the real live scrape matches the fixture-based test from Task 2.

- [ ] **Step 4: Run `npm run check`**

Run: `npm run check`
Expected: passes (confirms the generated file is syntactically valid — this is also checked by the scraper's own `require()`-verification step, so this is a second, independent confirmation).

- [ ] **Step 5: Commit**

```bash
git add src/poe2-unique-data.js
git commit -m "$(cat <<'EOF'
data: generate src/poe2-unique-data.js from poe2db.tw

First real run of npm run fetch-uniques — ~445 unique items with
slot, requirements, and full implicit/explicit mod ranges (493
listing-page blocks minus ~48 "Cultivated Uniques" tab duplicates,
each already covered by its own standard-tab entry).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XSdx8v5t93Qvso2UanmBzp
EOF
)"
```

Note: this commit is expected to be large (493 items × several fields each). That's fine — it's fully machine-generated and reviewable via the spot-checks above, not line-by-line.

---

### Task 5: Regression test against the committed dataset, wired into `npm test`

**Files:**
- Create: `scripts/test-poe2-unique-data.js`
- Modify: `package.json` (add `test:unique-data` script and insert it into the `test` chain)

**Interfaces:**
- Consumes: `POE2_UNIQUE_DATA` from `src/poe2-unique-data.js` (the real, committed file from Task 4 — this test has no fixtures of its own; it asserts against production data, the same way `scripts/test-parser.js` and friends do).

- [ ] **Step 1: Write the test**

Create `scripts/test-poe2-unique-data.js`:

```javascript
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
```

- [ ] **Step 2: Run it standalone first**

Run: `node scripts/test-poe2-unique-data.js`
Expected: all six sections print `PASS`, ending with `All poe2-unique-data tests passed.` (This should pass immediately since Task 4 already produced and spot-checked the real data — this step just confirms the assertions match reality exactly.)

- [ ] **Step 3: Wire into `npm test`**

In `package.json`, add the script:

```json
    "test:unique-data": "node scripts/test-poe2-unique-data.js",
```

And insert `&& npm run test:unique-data` into the `test` chain, right after `test:pobb-gear` (matching the existing ordering convention of newest-added-last-among-siblings isn't required — group it near the other data/PoB-related tests):

```json
    "test": "npm run check && npm run test:parser && npm run test:build-knowledge && npm run test:pob-code && npm run test:pobb-gear && npm run test:unique-data && npm run test:level-up && npm run test:mobalytics && npm run test:monk && npm run test:recommendation && npm run test:clipboard",
```

- [ ] **Step 4: Run the full suite**

Run: `npm test`
Expected: every `test:*` script passes, including the new `test:unique-data`.

- [ ] **Step 5: Commit**

```bash
git add scripts/test-poe2-unique-data.js package.json
git commit -m "$(cat <<'EOF'
test: add regression coverage for the bundled unique-item dataset

Guards src/poe2-unique-data.js against a silently half-completed
future scrape or markup-drift corruption — shape checks, a plausible
item-count floor, two known-item assertions, and a sanity bound on
how many items are allowed to have no coach slot. Wired into npm test.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01XSdx8v5t93Qvso2UanmBzp
EOF
)"
```

---

## Self-Review Notes

- **Spec coverage:** Data shape (Task 2/3 `parseItemBlock`/`formatDataFile`) ✓. Scraper implementation steps 1-6 from the spec ✓ (steps 1-2 → Task 3 Step 1/3, step 3 → Task 2, step 4 → Task 1 + Task 2/3, step 5 → Task 3 Step 2, step 6 → Task 3 Step 3). Wiring (`fetch-uniques` script, HTML includes) ✓ Task 3 Steps 4-5. Testing (regression test, `npm test` wiring) ✓ Task 5. Risks (markup drift → the `items.length < 400` abort in Task 3 Step 3; league churn → re-run instructions are just "run `npm run fetch-uniques` again", no special task needed; slot mapping edge cases → Task 1 + the null-slot logging/assertion in Tasks 3-5) ✓.
- **Placeholder scan:** No TBD/TODO; every step has real code or a real command.
- **Type consistency:** `parseItemBlock(chunk, inferSlotFromItemName)` signature is identical across Task 2's test, Task 2's implementation, and Task 3's `main()` call site. The item record shape (`id, name, baseType, slot, levelReq, attrReqs, implicits, explicits`) is identical across the spec, Task 2's fixtures, Task 3's generator, and Task 5's assertions.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-07-unique-item-data.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
