# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Electron desktop overlay for Path of Exile 2. It polls the clipboard, and when it detects PoE2 item text (`Item Class: ...`, copied via in-game Ctrl+C), it parses the item, scores it against the user's imported build, and pops up a transparent, always-on-top tooltip near the cursor with buy/replace advice. No memory reading, OCR, or input automation — clipboard text only.

## Commands

```bash
npm run setup          # first-time: install deps + syntax check (safe to re-run)
npm start               # launch the Electron app from source
npm run check            # node --check syntax validation across core src/*.js files
npm test                 # check + every test:* suite below
npm run test:parser
npm run test:build-knowledge
npm run test:pob-code
npm run test:mobalytics
npm run test:monk
npm run test:recommendation
npm run test:clipboard
npm run fetch-mods       # refreshes PoE2DB modifier data — review the diff carefully
npm run build-win        # electron-builder → dist/ (also build-mac, build-linux)
```

There is no linter/formatter configured — run `npm run check` before committing instead. Tests are standalone Node scripts in `scripts/test-*.js` (not a test framework); each exits nonzero on failure. To run just one, execute it directly: `node scripts/test-parser.js`. Add new regression cases near the feature they cover, with descriptive names (e.g. `Rare belt (no Item Class)`).

Node.js 18+ required; CI builds releases with Node 20.

## Architecture

**Process split (Electron):**
- `src/main.js` — main process. Owns all windows, the system tray, the clipboard-polling watcher (`CLIPBOARD_POLL_MS`, default 400ms), the global hotkey (`Ctrl+Shift+G` manual trigger), and every `ipcMain` handler: session persistence, pobb.in/Mobalytics import, poe.ninja price fetch, PoE2 trade API search, and the AI coach request. This is the largest file (~2400 lines) and the integration point for anything touching the OS, network, or filesystem.
- `src/preload.js` — the *only* bridge between renderer and main. Exposes a narrow `window.poe2Coach.*` API via `contextBridge`. Renderers (`overlay.html`, `settings.html`) must never `require()` Electron/Node directly — always go through `poe2Coach`.
- `src/overlay-renderer.js` — renders the popup tooltip: item vs. equipped-gear comparison, stat deltas, fit score.
- `src/app.js` — the settings/build-import UI logic (largest single file, ~3500 lines): profile editing, `.build` file import, Mobalytics/PoB import UI, AI Coach settings.

**Domain modules (pure, DOM-independent, safe to `require()` from Node tests):**
- `src/parser.js` — parses raw PoE2 clipboard item text into a structured item object (item class, rarity, requirements, properties, mods, socket bonuses). This is the entry point for any change to item-text recognition.
- `src/recommendation-engine.js` — the scoring engine. Enforces a "Build-Context Gate" so advice is never generic: every recommendation is stage-aware (Act 1 → maps, via `getStageBaseline()`) and build-aware. Scores items across 5 dimensions — buildFit, stageFit, defense, damage, replaceUrgency — rather than a single catch-all number.
- `src/build-knowledge.js` — merges three provenance-tagged sources into one compact context object consumed by both the recommendation engine and the AI coach: **Mobalytics** (creator intent + stage progression), **PoB/pobb.in** (current character snapshot), and **user preferences** (manual corrections). Keeping these sources distinct — and labeling advice by which one it came from — is a deliberate design constraint; don't collapse them into a single merged blob.
- `src/pob-code.js` — detects/decodes Path of Building export codes and pobb.in URLs (base64 + zlib/gzip inflate of the XML payload).
- `src/poe2-mod-data.js` — static PoE2 modifier reference data, refreshed via `npm run fetch-mods` (scrapes PoE2DB — review before committing).

**Data flow for the core loop:** clipboard text → `main.js` watcher → IPC `item:detected` → `overlay-renderer.js` → `parser.js` (parse) → `recommendation-engine.js` + `build-knowledge.js` (score, using the saved session/profile) → tooltip render. AI Coach is a separate, optional, user-triggered path: `overlay-renderer.js`/`app.js` → IPC `ai:coach` → `main.js requestAIAdvice()` → Gemini or OpenAI.

**Session/profile persistence:** `saveSession`/`loadSession` in `main.js` read/write a JSON profile in Electron `userData` (build stages, imported `.build` files, Mobalytics/PoB data, player level/attributes). AI settings (`ai-settings.json`, including API keys) are stored separately in `userData` and are never written into session exports or `.build` files — preserve that separation in any change touching settings persistence.

## Conventions

Plain CommonJS JavaScript, no bundler/TypeScript. Two-space indent, double-quoted strings, semicolons, `const`/`let`. `camelCase` for variables/functions, `UPPER_SNAKE_CASE` for constants, kebab-case filenames (e.g. `recommendation-engine.js`). Keep main-process, preload, and renderer responsibilities separate — don't reach across the `contextBridge` boundary.

Never commit `.env`, `session.json`, `ai-settings.json`, or `dist/`. Do not paste real API keys into source, `.build` files, or exported reports — `SECURITY.md` and `AGENTS.md` cover the full policy.

Commit subjects: short, imperative, optionally Conventional-Commit-prefixed (`feat:`, `ci:`), referencing an issue/PR number when relevant. PRs should describe user-visible behavior, list verification commands run, and include screenshots for overlay/settings UI changes.
