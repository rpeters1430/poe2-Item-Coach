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
  const re = /\((-?\d+(?:\.\d+)?)[–—](-?\d+(?:\.\d+)?)\)/g;
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
    const valueFirst = s.match(/^(\d+(?:\.\d+)?)\s*(Str|Dex|Int)$/i);
    const labelFirst = s.match(/^(Str|Dex|Int)\s*(\d+(?:\.\d+)?)$/i);
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
