#!/usr/bin/env node
// One-time machine setup: installs dependencies, approves required install
// scripts, and runs a syntax check so a fresh clone is ready for `npm start`.
"use strict";

const { execSync } = require("node:child_process");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT });
}

function checkNodeVersion() {
  const major = Number(process.versions.node.split(".")[0]);
  if (!major || major < 18) {
    console.error(`Node.js 18+ is required. Found ${process.version}.`);
    console.error("Install a current version from https://nodejs.org and re-run: npm run setup");
    process.exit(1);
  }
  console.log(`Node ${process.version} OK.`);
}

function approveScripts() {
  // npm 11+ blocks dependency install scripts (electron/electron-builder ship
  // native postinstall steps) until they're explicitly approved. Older npm
  // versions don't have this command at all, so failure here is non-fatal.
  try {
    run("npm approve-scripts --all");
  } catch (_err) {
    console.warn("Skipping \"npm approve-scripts\" (unsupported npm version, or nothing pending).");
  }
}

function main() {
  console.log("PoE2 Gear Coach - machine setup");
  console.log("================================");

  checkNodeVersion();
  run("npm install");
  approveScripts();
  run("npm run check");

  console.log("\nSetup complete.");
  console.log("  Run the app:               npm start");
  console.log("  Build a Windows installer: npm run build-win");
}

main();
