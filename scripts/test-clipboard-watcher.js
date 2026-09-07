// Run with: node scripts/test-clipboard-watcher.js
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Mock electron module in sandbox to test readClipboardText without Electron runtime
const mockClipboard = {
  text: "",
  asyncMode: true,
  readText() {
    if (this.asyncMode) {
      return Promise.resolve(this.text);
    }
    return this.text;
  },
  writeText(val) {
    this.text = String(val || "");
  },
};

const mainCode = fs.readFileSync(path.join(__dirname, "../src/main.js"), "utf8");

function extractFunction(code, name) {
  const regex = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\([\\s\\S]*?\\n}`);
  const match = code.match(regex);
  if (!match) throw new Error(`Could not find function ${name}`);
  return match[0];
}

const sandbox = {
  clipboard: mockClipboard,
  console,
};
vm.createContext(sandbox);
vm.runInContext(`
${extractFunction(mainCode, "readClipboardText")}
${extractFunction(mainCode, "isPoe2Item")}
`, sandbox);

const { readClipboardText, isPoe2Item } = sandbox;

async function runTests() {
  console.log("Running Clipboard Watcher Regression Suite...\n");

  // Test 1: Async Promise clipboard resolution (Electron 44+)
  mockClipboard.asyncMode = true;
  mockClipboard.writeText("Item Class: Bows\nRarity: Rare\n--------\nItem Level: 10\n");
  const asyncText = await readClipboardText();
  assert.equal(typeof asyncText, "string", "readClipboardText should resolve to a string in async mode");
  assert.equal(isPoe2Item(asyncText), true, "isPoe2Item should recognize PoE2 item from async clipboard text");
  console.log("  PASS: readClipboardText properly resolves Promise returned in Electron 44+");

  // Test 2: Synchronous clipboard return value (legacy Electron)
  mockClipboard.asyncMode = false;
  mockClipboard.writeText("Item Class: Helmets\nRarity: Magic\n--------\nItem Level: 5\n");
  const syncText = await readClipboardText();
  assert.equal(typeof syncText, "string", "readClipboardText should return a string in sync mode");
  assert.equal(isPoe2Item(syncText), true, "isPoe2Item should recognize PoE2 item from sync clipboard text");
  console.log("  PASS: readClipboardText seamlessly handles synchronous string return in legacy Electron");

  // Test 3: Raw Promise without await must not pass isPoe2Item
  mockClipboard.asyncMode = true;
  const rawPromise = mockClipboard.readText();
  assert.equal(isPoe2Item(rawPromise), false, "Unawaited Promise must return false for isPoe2Item, demonstrating the root cause");
  console.log("  PASS: Regression check verifies unawaited Promise is rejected by isPoe2Item");

  // Test 4: Non-item clipboard text
  mockClipboard.asyncMode = true;
  mockClipboard.writeText("https://www.pathofexile.com/trade2/search/poe2");
  const urlText = await readClipboardText();
  assert.equal(isPoe2Item(urlText), false, "Non-item URL should not match isPoe2Item");
  console.log("  PASS: Non-item clipboard text returns false for isPoe2Item");

  // Test 5: Standard PoE2 item copied with CRLF
  mockClipboard.writeText("Item Class: Body Armours\r\nRarity: Rare\r\nSilk Robe\r\n--------\r\nEnergy Shield: 14\r\n");
  const crlfText = await readClipboardText();
  assert.equal(isPoe2Item(crlfText), true, "CRLF formatted item should match isPoe2Item");
  console.log("  PASS: CRLF formatted item matches isPoe2Item");

  console.log("\nAll Clipboard Watcher tests passed successfully! 🎉");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
