// Run with: node scripts/test-pob-code.js
"use strict";

const assert = require("node:assert/strict");
const zlib = require("node:zlib");
const PobCode = require("../src/pob-code.js");

const xml = `<PathOfBuilding><Build level="54" className="Monk" ascendClassName="Martial Artist"/><Skills><Skill><Gem nameSpec="Storm Wave" level="11"/><Gem nameSpec="Lightning Attunement" gemId="SupportGemAddedLightningDamage"/></Skill></Skills><Items/></PathOfBuilding>`;
const exportCode = zlib.deflateRawSync(Buffer.from(xml)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const paddedExport = exportCode + "A".repeat(Math.max(0, 500 - exportCode.length));

// Real exports are long; padding after a compressed stream is ignored by inflateRaw.
const detected = PobCode.detectInput(paddedExport);
assert.equal(detected.type, "export");
assert.equal(PobCode.detectInput("https://pobb.in/abc123").type, "pobb");
assert.equal(PobCode.detectInput("abc123").type, "pobb");
assert.equal(PobCode.detectInput("not valid"), null);
assert.match(PobCode.decode(paddedExport).xml, /Storm Wave/);

// Standard base64 with + and /
const standardB64Export = zlib.deflateRawSync(Buffer.from(xml)).toString("base64");
assert.equal(PobCode.detectInput(standardB64Export).type, "export");
assert.match(PobCode.decode(standardB64Export).xml, /Storm Wave/);

console.log("All PoB code tests passed.");
