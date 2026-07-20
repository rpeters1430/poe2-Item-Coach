"use strict";

const zlib = require("zlib");

function detectInput(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  const found = raw.match(/https?:\/\/pobb\.in\/([^\s/?#)]+)(?:[^\s)]*)?/i);
  if (found) return { type: "pobb", url: `https://pobb.in/${found[1]}`, id: found[1] };
  if (raw.length >= 500 && /^[A-Za-z0-9_-]+=*$/.test(raw)) return { type: "export", exportCode: raw };
  if (/^[A-Za-z0-9_-]{6,120}$/.test(raw)) return { type: "pobb", url: `https://pobb.in/${raw}`, id: raw };
  return null;
}

function decode(exportCode) {
  try {
    let b64 = String(exportCode || "").trim().replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const buffer = Buffer.from(b64, "base64");
    const attempts = [
      () => zlib.inflateRawSync(buffer, { maxOutputLength: 5 * 1024 * 1024 }),
      () => zlib.inflateSync(buffer, { maxOutputLength: 5 * 1024 * 1024 }),
      () => zlib.gunzipSync(buffer, { maxOutputLength: 5 * 1024 * 1024 }),
      () => buffer,
    ];
    for (const attempt of attempts) {
      try {
        const xml = attempt().toString("utf8");
        if (/<(PathOfBuilding|Build|Items|Item)\b/i.test(xml)) return { xml };
      } catch (_err) { /* try next compression mode */ }
    }
  } catch (_err) { /* invalid export */ }
  return null;
}

module.exports = { detectInput, decode };
