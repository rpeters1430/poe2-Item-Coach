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
