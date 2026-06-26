/**
 * scripts/fetch-poe2db.js — Refresh poe2-mod-data.js tier values from poe2db.tw
 *
 * Usage:  npm run fetch-mods
 *
 * poe2db.tw "keyword" pages (e.g. /us/Life, /us/Strength) contain HTML tables
 * with columns: Name | Level | Pre/Suf | Description | Weight.
 * We fetch each relevant page, parse the table, and patch src/poe2-mod-data.js.
 *
 * Note: pages like /us/Fire_Resistance use DataTables (JS-rendered, empty HTML tbody).
 * Those can't be scraped without a headless browser, so single-element resistance
 * tiers remain as calibrated estimates in poe2-mod-data.js.
 *
 * Pages we CAN scrape:
 *   /us/Life            → flat_life
 *   /us/Resistance      → all_elem_resist
 *   /us/Strength        → flat_strength
 *   /us/Dexterity       → flat_dexterity
 *   /us/Intelligence    → flat_intelligence
 */
"use strict";

const https = require("https");
const fs    = require("fs");
const path  = require("path");

const OUT_FILE  = path.resolve(__dirname, "../src/poe2-mod-data.js");
const DELAY_MS  = 2200; // polite pause between requests
const CACHE_DIR = path.resolve(__dirname, "../data/poe2db-cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

function cachedHtml(key) {
  const f = path.join(CACHE_DIR, `${key}.html`);
  try {
    if (!fs.existsSync(f)) return null;
    if (Date.now() - fs.statSync(f).mtimeMs > 24 * 3600_000) return null; // 24 h TTL
    return fs.readFileSync(f, "utf8");
  } catch { return null; }
}

function saveCachedHtml(key, html) {
  try { fs.writeFileSync(path.join(CACHE_DIR, `${key}.html`), html, "utf8"); } catch {}
}

// ─── HTTP ────────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function httpsGet(urlString) {
  return new Promise((resolve, reject) => {
    const url  = new URL(urlString);
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
      res.on("end",  () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject); req.end();
  });
}

// ─── HTML parser ─────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<span\s[^>]*class="ndash"[^>]*>[^<]*<\/span>/g, "–")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCells(rowHtml) {
  const cells = [];
  let i = 0;
  while (i < rowHtml.length) {
    const start = rowHtml.indexOf("<td", i);
    if (start === -1) break;
    const openEnd = rowHtml.indexOf(">", start);
    if (openEnd === -1) break;
    let depth = 1, j = openEnd + 1;
    while (j < rowHtml.length && depth > 0) {
      const lt = rowHtml.indexOf("<", j);
      if (lt === -1) break;
      const tm = rowHtml.slice(lt).match(/^<(\/?)td(\s|>)/i);
      if (tm) {
        depth += tm[1] === "/" ? -1 : 1;
        if (depth === 0) {
          const inner = rowHtml.slice(openEnd + 1, lt);
          cells.push({ html: inner, text: stripHtml(inner) });
          i = lt + 5; break;
        }
      }
      j = lt + 1;
    }
    if (depth > 0) break;
  }
  return cells;
}

function parseTableRows(html) {
  const rows = [];
  const tbodyRe = /<tbody[^>]*>([\s\S]*?)<\/tbody>/gi;
  let tm;
  while ((tm = tbodyRe.exec(html)) !== null) {
    const tbody = tm[1];
    const trRe  = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rm;
    while ((rm = trRe.exec(tbody)) !== null) {
      const cells = extractCells(rm[1]);
      if (cells.length >= 4) rows.push(cells);
    }
  }
  return rows;
}

function parseRange(text) {
  // "Adds X to Y Cold Damage" pattern
  const addM = text.match(/Adds\s+(\d+)\s+to\s+(\d+)/i);
  if (addM) return { min: Number(addM[1]), max: Number(addM[2]) };
  // Parenthesised or bare range: +(10–19), (10–19)%, 22–27
  const rangeM = text.match(/[+(]?\s*(\d+)\s*[–—\-]\s*(\d+)/);
  if (rangeM) return { min: Number(rangeM[1]), max: Number(rangeM[2]) };
  // Fixed value
  const fixM = text.match(/[+(]?(\d+)[)%]?/);
  if (fixM) { const v = Number(fixM[1]); return { min: v, max: v }; }
  return null;
}

// ─── Stat page definitions ────────────────────────────────────────────────────
//
// filter(desc, weight) must return true for rows that belong to this mod.
// Descriptions include trailing badge text, e.g. "+(5–8) to Strength Attribute"
// — use \b word-boundary anchors rather than $ end anchors.
//
// weight text looks like: "body_armour 1shield 1helmet 1..." (no space before key name)

const STAT_PAGES = [
  {
    url: "https://poe2db.tw/us/Life",
    key: "life",
    mods: [
      {
        modId: "flat_life",
        // Only want the standard-slot flat-life prefix mods.
        // Require body_armour weight ≥ 1 to exclude boots/gloves-only variants.
        // Do NOT require amulet — top tiers (ilvl65+) are body/shield/belt only.
        filter: (desc, weight) =>
          /to maximum Life/i.test(desc) &&
          /body_armour\s+[1-9]/.test(weight),
        onlyPrefix: true,
      },
    ],
  },
  {
    url: "https://poe2db.tw/us/Resistance",
    key: "resistance",
    mods: [
      {
        modId: "all_elem_resist",
        // Match "+(X–Y) % to all Elemental Resistances" suffix on rings/amulets.
        // Exclude "Allies in your Presence" and "Minions have" variants.
        filter: (desc, weight) =>
          /^\+\(\d+[–—\-]\d+\)\s*%\s*to all Elemental Resistances/i.test(desc) &&
          (/ring\s+[1-9]/.test(weight) || /amulet\s+[1-9]/.test(weight)),
        onlySuffix: true,
      },
    ],
  },
  {
    url: "https://poe2db.tw/us/Strength",
    key: "strength",
    mods: [
      {
        modId: "flat_strength",
        // Description: "+(5–8) to Strength Attribute" — use \b not $
        // Top tier is belt-only (no ring weight), so check ring OR belt OR amulet
        filter: (desc, weight) =>
          /^\+.*to Strength\b/i.test(desc) &&
          (/ring\s+[1-9]/.test(weight) || /belt\s+[1-9]/.test(weight) || /amulet\s+[1-9]/.test(weight)),
        onlySuffix: true,
      },
    ],
  },
  {
    url: "https://poe2db.tw/us/Dexterity",
    key: "dexterity",
    mods: [
      {
        modId: "flat_dexterity",
        filter: (desc, weight) =>
          /^\+.*to Dexterity\b/i.test(desc) &&
          (/ring\s+[1-9]/.test(weight) || /belt\s+[1-9]/.test(weight) || /amulet\s+[1-9]/.test(weight)),
        onlySuffix: true,
      },
    ],
  },
  {
    url: "https://poe2db.tw/us/Intelligence",
    key: "intelligence",
    mods: [
      {
        modId: "flat_intelligence",
        filter: (desc, weight) =>
          /^\+.*to Intelligence\b/i.test(desc) &&
          (/ring\s+[1-9]/.test(weight) || /belt\s+[1-9]/.test(weight) || /amulet\s+[1-9]/.test(weight)),
        onlySuffix: true,
      },
    ],
  },
];

// ─── Fetcher ─────────────────────────────────────────────────────────────────

const RETRY_DELAYS = [5_000, 15_000, 30_000]; // backoff on 429/503

async function fetchPage(pageConfig) {
  // Serve from disk cache when available (24 h TTL)
  const cached = cachedHtml(pageConfig.key);
  if (cached) {
    const rows = parseTableRows(cached);
    if (rows.length > 0) {
      console.log(`[fetch-mods]   → cached HTML (${rows.length} rows) — skipping network request`);
      return { rows, url: pageConfig.url + " (cached)" };
    }
  }

  const urls = [pageConfig.url, ...(pageConfig.altUrls || [])];
  for (const url of urls) {
    let lastStatus = null;
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      if (attempt > 0) {
        const wait = RETRY_DELAYS[attempt - 1];
        console.log(`[fetch-mods]   → ${lastStatus} — retrying in ${wait / 1000}s…`);
        await sleep(wait);
      }
      console.log(`[fetch-mods]   GET ${url}${attempt > 0 ? ` (attempt ${attempt + 1})` : ""}`);
      try {
        const res = await httpsGet(url);
        lastStatus = res.status;
        if (res.status === 503 || res.status === 429) continue; // rate-limited — retry
        if (res.status === 404) { console.log(`[fetch-mods]   → 404`); break; }
        if (res.status !== 200) { console.log(`[fetch-mods]   → ${res.status}`); break; }
        const rows = parseTableRows(res.body);
        console.log(`[fetch-mods]   → ${res.body.length} bytes, ${rows.length} table rows`);
        if (rows.length === 0) break;
        saveCachedHtml(pageConfig.key, res.body);
        return { rows, url };
      } catch (err) {
        console.log(`[fetch-mods]   → Error: ${err.message}`);
        if (attempt >= RETRY_DELAYS.length) break;
      }
    }
  }
  return null;
}

function extractModTiers(rows, modConfig) {
  const candidates = [];
  for (const cells of rows) {
    const name   = cells[0].text;
    const ilvl   = Number(cells[1].text) || 0;
    const preSuf = cells[2].text.toLowerCase();
    const desc   = cells[3].text;
    const weight = cells[4]?.text || "";

    if (!ilvl) continue;
    // Exclude Unique, Corrupted, Torment, Map, Strongbox, Jewel, Abyss, SanctumRelic rows
    if (/unique|corrupted|torment|strongbox|abyss|sanctum|expedition|jewel|mapdevice|ultimatum/i.test(preSuf)) continue;
    if (modConfig.onlyPrefix  && !/prefix/i.test(preSuf))  continue;
    if (modConfig.onlySuffix  && !/suffix/i.test(preSuf))  continue;
    if (!modConfig.filter(desc, weight)) continue;

    const range = parseRange(desc);
    if (!range || (range.min === 0 && range.max === 0)) continue;

    candidates.push({ name, ilvl, min: range.min, max: range.max });
  }

  if (candidates.length === 0) return null;

  // Sort by ilvl descending → tier 1 = best
  candidates.sort((a, b) => b.ilvl - a.ilvl || b.min - a.min);

  // Deduplicate by value range
  const seen = new Set();
  const tiers = [];
  for (const c of candidates) {
    const key = `${c.min}-${c.max}`;
    if (seen.has(key)) continue;
    seen.add(key);
    tiers.push({ tier: tiers.length + 1, ilvl: c.ilvl, min: c.min, max: c.max, name: c.name });
  }

  return tiers.length > 0 ? tiers : null;
}

// ─── Patcher ─────────────────────────────────────────────────────────────────

function patchModDataFile(source, updates) {
  let out = source;
  let patchCount = 0;

  for (const [modId, tiers] of Object.entries(updates)) {
    if (!tiers || tiers.length === 0) continue;

    const tierLines = tiers.map(t => {
      const namePart = t.name ? `, name: ${JSON.stringify(t.name)}` : "";
      return `        { tier: ${String(t.tier).padStart(2)}, ilvl: ${String(t.ilvl).padStart(2)}, min: ${String(t.min).padStart(3)}, max: ${String(t.max).padStart(3)}${namePart} },`;
    }).join("\n");

    const modBlockRe = new RegExp(
      `(id:\\s*["']${modId}["'][\\s\\S]*?\\btiers:\\s*)\\[[\\s\\S]*?\\]`,
      "m"
    );
    if (!modBlockRe.test(out)) {
      console.log(`[fetch-mods]   ⚠ Mod "${modId}" not found in source — skipping`);
      continue;
    }
    const newOut = out.replace(modBlockRe, (_, prefix) =>
      `${prefix}[\n${tierLines}\n      ]`
    );
    if (newOut !== out) {
      out = newOut;
      patchCount++;
      console.log(`[fetch-mods]   ✓ ${modId}: ${tiers.length} tiers, T1 = ${tiers[0].min}–${tiers[0].max} @ ilvl${tiers[0].ilvl}`);
    } else {
      // Regex matched but replacement is byte-identical — data already up to date
      console.log(`[fetch-mods]   = ${modId}: already up to date (${tiers.length} tiers, T1 = ${tiers[0].min}–${tiers[0].max})`);
    }
  }

  // Update fetched timestamp
  const now = new Date().toISOString();
  out = out.replace(/fetched:\s*(?:null|"[^"]*")/, `fetched: "${now}"`);
  return { source: out, patchCount };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const now = new Date().toISOString();
  console.log(`[fetch-mods] Starting mod tier refresh — ${now}`);
  console.log(`[fetch-mods] Source: poe2db.tw keyword pages`);
  console.log(`[fetch-mods] Note: single-resistance and speed pages use JS rendering`);
  console.log(`[fetch-mods]       and cannot be scraped — those tiers remain as estimates.\n`);

  let currentSource;
  try { currentSource = fs.readFileSync(OUT_FILE, "utf8"); }
  catch (err) { console.error(`[fetch-mods] Cannot read ${OUT_FILE}: ${err.message}`); process.exit(1); }

  const allUpdates = {};
  let pagesOk = 0;

  for (let pi = 0; pi < STAT_PAGES.length; pi++) {
    if (pi > 0) { console.log(`\n[fetch-mods] Pausing ${DELAY_MS}ms...`); await sleep(DELAY_MS); }
    const pg = STAT_PAGES[pi];
    console.log(`\n[fetch-mods] [${pi+1}/${STAT_PAGES.length}] ${pg.key}`);
    const result = await fetchPage(pg);
    if (!result) { console.log(`[fetch-mods]   ✗ All URLs failed`); continue; }
    pagesOk++;

    for (const modCfg of pg.mods) {
      const tiers = extractModTiers(result.rows, modCfg);
      if (tiers) {
        allUpdates[modCfg.modId] = tiers;
        console.log(`[fetch-mods]   Found ${tiers.length} tiers for "${modCfg.modId}"`);
      } else {
        console.log(`[fetch-mods]   No matching rows for "${modCfg.modId}"`);
      }
    }
  }

  console.log(`\n[fetch-mods] Pages OK: ${pagesOk}/${STAT_PAGES.length}`);
  console.log(`[fetch-mods] Mods updated: ${Object.keys(allUpdates).length}`);

  if (Object.keys(allUpdates).length === 0) {
    console.log("[fetch-mods] Nothing updated — bundled data unchanged.");
    console.log("[fetch-mods] If rate-limited (503), wait a few minutes and retry.");
  } else {
    const { source: patched, patchCount } = patchModDataFile(currentSource, allUpdates);
    fs.writeFileSync(OUT_FILE, patched, "utf8");
    console.log(`\n[fetch-mods] ✓ Wrote ${OUT_FILE} (${patchCount} mods patched)`);
  }

  // Verify file is still valid JS
  try {
    delete require.cache[require.resolve(OUT_FILE)];
    const cur = require(OUT_FILE);
    const count = cur.POE2_MOD_DATA?.mods?.length || 0;
    console.log(`[fetch-mods] ✓ src/poe2-mod-data.js valid — ${count} mods loaded`);
  } catch (err) {
    console.error(`[fetch-mods] ERROR: poe2-mod-data.js invalid after write: ${err.message}`);
    console.error("[fetch-mods] Restoring original.");
    fs.writeFileSync(OUT_FILE, currentSource, "utf8");
    process.exit(1);
  }

  console.log("\n[fetch-mods] Done. Re-run anytime: npm run fetch-mods");
}

main().catch(err => {
  console.error(`[fetch-mods] Fatal: ${err.message}`);
  process.exit(1);
});
