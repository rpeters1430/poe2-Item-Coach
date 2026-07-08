# PoE2 Item Coach — Next Steps & Improvements

This file tracks actionable improvements for the PoE2 Item Coach overlay after the v2 UI rebuild.
Organized by impact tier. Items marked ✅ are **implemented and in the codebase**; items marked 🔧 are in-progress; items with no marker are **not yet started**.

**Last reviewed against codebase: 2026-06-25 (updated 2026-07-08)**

---

## Priority 2b — Minion Build Scoring (added 2026-07-08)

Found while auditing the coach against an imported Minion Army Infernalist leveling guide.

### ✅ Minion builds were scored as if they were attack builds
`inferBuildFocus()` only sets `focus.spell` when skill/gear text literally contains
`spell|cast|sorcer|wizard`. Minion skill names (`Skeletal Sniper`, `Volcano`, `Raging Spirits`,
`Summon Infernal Hound`) never match that, so `buildImportedRules()` fell through to
`if (!focus.spell) { ... points: -10 ... }` and penalized minion damage on every minion build,
even though `focus.minion` was already being detected correctly (it just wasn't used for
anything besides a display tag).

**Fix (`src/app.js`, `src/overlay-renderer.js`):**
- `defaultGenericRules()` no longer bundles "minion damage" into the generic attack-build
  penalty — only "spell damage" keeps the default penalty.
- `buildImportedRules()` now has a real `if (focus.minion)` branch with positive rules for
  minion damage, minion attack/cast speed, minion life/resistance, Spirit, reservation
  efficiency, and minion extra-elemental-damage mods — instead of falling into the generic
  attack-build penalty.
- `createImportedProfile()` computes `focus` once and stores it on the profile (`profile.focus`)
  so both the rule engine and slot weighting can use it, and so it survives serialization to
  `session.json` for the live overlay to read.
- New `slotRulesForFocus()` de-weights weapon/quiver damage and up-weights ring/amulet/gloves
  synergy when `focus.minion` is true — minions deal the damage, not your weapon.
- `overlay-renderer.js`'s `modClass()` no longer hardcodes "spell damage" as red/negative
  coloring when the active imported profile is minion-focused.

### ✅ Spirit (minion/aura resource) was completely unparsed
PoE2's Spirit stat — the resource that caps how many minions/auras you can run — didn't
exist anywhere in the codebase. `main.js`'s pobb.in scraper now captures `stats.spirit`
(same pattern as `hitChance`), and the pobb.in import summary shows a Spirit pill plus a
warning when the imported build looks minion/aura-based (gem list matches
`skeleton|skeletal|zombie|spectre|golem|raging spirit|summon|minion`) but Spirit is low or
missing.

**Not yet done:** dedicated "Spirit budget" card in the full health report (only the pobb.in
import summary surfaces it today); the same minion-focus audit hasn't been extended to
`overlay-renderer.js`'s built-in `DEFAULT_PROFILES` (only the imported-build path is fixed,
which is what actually matters since imported builds always replace the defaults).

---

## Priority 1 — Windows Platform Optimization

These are specific to the Windows target and have the highest day-to-day impact.

### ✅ 1.1 Fix clipboard polling race on Windows
**Problem:** Windows clipboard access can briefly throw `Access Denied` or return an empty string
when another process (e.g. the game's anti-cheat, Discord, or a password manager) holds the
clipboard open. The current catch-all silently swallows these errors, causing missed detections.

**Fix:** Refactor from `setInterval` to recursive `setTimeout` so the retry delay can vary
per tick. With `setInterval` you cannot insert an 80ms short-retry — returning early from the
callback just waits for the next 400ms tick. Recursive `setTimeout` schedules the next poll
dynamically based on outcome:

```js
const CLIPBOARD_POLL_MS = 400;
const CLIPBOARD_RETRY_MS = 80; // short retry after a transient Windows clipboard lock

function scheduleClipboardPoll(delayMs = CLIPBOARD_POLL_MS) {
  clipboardPoller = setTimeout(() => {
    try {
      const text = clipboard.readText();
      if (text !== lastClipboardText) {
        lastClipboardText = text;
        if (isPoe2Item(text)) showOverlay(text);
        else hideOverlay();
      }
      scheduleClipboardPoll(CLIPBOARD_POLL_MS); // normal cadence on success
    } catch (_err) {
      scheduleClipboardPoll(CLIPBOARD_RETRY_MS); // short retry on Windows clipboard lock
    }
  }, delayMs);
}

function startClipboardWatcher() {
  lastClipboardText = (() => { try { return clipboard.readText(); } catch { return ""; } })();
  scheduleClipboardPoll();
}

function stopClipboardWatcher() {
  if (clipboardPoller) { clearTimeout(clipboardPoller); clipboardPoller = null; }
}
```

---

### ✅ 1.2 Use Windows DPI-aware window positioning
**Problem:** On Windows with display scaling (125%, 150%, 200%) the overlay can appear in the
wrong position. `screen.getCursorScreenPoint()` and `display.bounds` both use Electron's DIP
(device-independent pixel) space, so manual `scaleFactor` arithmetic mixes coordinate spaces
incorrectly on multi-monitor setups with different per-monitor scaling.

**Fix in `showOverlay()`:** Use Electron's built-in conversion helpers to stay in DIP throughout:
```js
// cursor is already in DIP — use it directly with workArea bounds (also DIP)
const { width: sw, height: sh, x: sx, y: sy } = display.workArea;
const [ow, oh] = [620, 720];
let wx = cursor.x + 24;
let wy = cursor.y + 24;
if (wx + ow > sx + sw) wx = cursor.x - ow - 8;
if (wy + oh > sy + sh) wy = cursor.y - oh - 8;
overlayWindow.setPosition(Math.round(wx), Math.round(wy));
// If physical-pixel conversion is ever needed, use screen.screenToDipPoint(point)
// rather than dividing by scaleFactor, which breaks on mixed-DPI multi-monitor setups.
```
Test: 1080p at 100%, 1440p at 125%, 4K at 150%, and 4K at 200%.

---

### ✅ 1.3 Add Windows startup-with-system option
Allow the overlay to start automatically when Windows boots, so players don't need to launch it
before each PoE2 session.

**Implementation:**
- Use Electron's `app.setLoginItemSettings({ openAtLogin: true })` (built-in, no extra packages).
- Add a checkbox in Settings: **"Launch at Windows startup"**.
- Store the preference in `session.json` and apply it on save.
- Add a corresponding tray menu entry: **"Start with Windows (on/off)"**.

```js
ipcMain.on("system:set-startup", (_event, enabled) => {
  app.setLoginItemSettings({ openAtLogin: Boolean(enabled), openAsHidden: true });
});
ipcMain.handle("system:get-startup", () => app.getLoginItemSettings().openAtLogin);
```

---

### ✅ 1.4 Prevent Escape from closing the game's own menus
**Problem:** The global `Escape` hotkey registered in `registerHotkeys()` fires even when the
overlay is not visible. If a player presses Escape to close a PoE2 menu, the shortcut intercepts
it and the game may not receive the key.

**Fix:** Only register the Escape shortcut while the overlay is visible:
```js
function showOverlay(itemText) {
  // ... existing logic ...
  if (!globalShortcut.isRegistered("Escape")) {
    globalShortcut.register("Escape", () => hideOverlay());
  }
}

function hideOverlay() {
  globalShortcut.unregister("Escape");
  // ... existing hide logic ...
}
```

---

### ✅ 1.5 Sign the Windows installer (or document the unsigned bypass)
Unsigned `.exe` files trigger Windows Defender SmartScreen ("Windows protected your PC").
This causes many users to think the app is malware.

**Options (in order of preference):**
1. **Paid OV/EV code-signing cert** — the only way to fully suppress SmartScreen for end users.
   EV (Extended Validation) certs cost ~$200–$500/year from a CA (DigiCert, Sectigo, etc.).
   Self-signed certs do **not** satisfy SmartScreen — they are only useful for internal testing
   on machines where you manually trust the cert. Document this in `SIGNING.md`.
2. Add a step to the build script that calls `signtool.exe` when `CODE_SIGN_CERT` env var is set.
3. In `README.md`, add a "If Windows warns you" section with the click-through steps (minimum
   action for unsigned personal builds).

**Minimum action:** Add the following to `README.md` under "Quick start":
```
> **Windows SmartScreen warning?**  
> Click "More info" → "Run anyway". This happens because the installer is not yet code-signed.  
> The app only reads your clipboard — it does not write files outside its own userData folder.
```

---

### ✅ 1.6 Reduce tray icon flash on Windows 10/11
On Windows, showing a previously hidden window causes the taskbar to briefly flash. The overlay
already sets `skipTaskbar: true` as a `BrowserWindow` constructor option (in `createOverlayWindow()`),
which suppresses the taskbar entry. Verify that `showInactive()` doesn't cause a taskbar flash
on your Windows version — if it does, the runtime method `overlayWindow.setSkipTaskbar(true)`
can be called again before each `showInactive()` as a workaround.

**Add to `createOverlayWindow()`:**
```js
overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
```
This keeps the overlay above the game even when PoE2 is in fullscreen mode (important since
PoE2 defaults to fullscreen on Windows).

---

### ✅ 1.7 Support Windows fullscreen (DirectX exclusive mode)
PoE2 on Windows can run in exclusive fullscreen mode. Electron `alwaysOnTop` does not pierce
DirectX exclusive fullscreen by default.

**Recommended overlay guidance:** Document in `README.md` that the overlay requires PoE2 to run
in **Windowed Fullscreen** mode (not exclusive fullscreen). Add a note in the overlay itself:

```
If the overlay does not appear, switch PoE2 to Windowed Fullscreen mode.
(In-game: Options → Display → Fullscreen Mode → Windowed)
```

Add the following to `createOverlayWindow()` for best results on Windows:
```js
overlayWindow.setAlwaysOnTop(true, "screen-saver", 1);
```
The `"screen-saver"` level is the highest available on Windows without requiring admin rights.

---

### ✅ 1.8 Bundle as a portable .exe (no-install option)
Many Windows users prefer a single portable `.exe` they can run without an installer.

**Add to `package.json` build section:**
```json
"win": {
  "target": [
    { "target": "nsis", "arch": ["x64"] },
    { "target": "portable", "arch": ["x64"] }
  ],
  "icon": "src/assets/icon.ico"
}
```

Add `npm run build-win-portable` script:
```json
"build-win-portable": "electron-builder --win portable --x64"
```

---

## Priority 2 — Correctness / Scoring Fixes

### ✅ 2.1 Improve the "why this item won/lost" explanation
The overlay shows build-fit score deltas but not plain-English reasons for the verdict.

**Goal:** Show top 3 positive and top 3 negative deltas under "Why it won/lost."

```text
Worse than equipped
Reason:
- Loses flat cold/physical attack damage (-18 pts)
- Gains accuracy, but hit chance is already high (low priority)
- Does not help Fire/Lightning resistance (critical need)
```

**Implementation:**
- In `overlay-renderer.js`, after scoring collect the top 3 contributing rules per category.
- Pass them through `window.poe2Coach.onItemDetected` as `topGains` and `topLosses` arrays.
- Render them in the coach panel under "Why it won/lost."

---

### ✅ 2.2 Lower accuracy value when hit chance is already high
Quivers with accuracy + attack speed can outscore better quivers when the character already has
~95% hit chance from pobb.in.

**Prerequisite — plumb `hitChance` into `currentSession`:**
`hitChance` is parsed from pobb.in in `main.js` and lives in `session.pobStats.hitChance`, but
the scoring engine in `overlay-renderer.js` does not currently copy it into `currentSession`.
Add to the `onItemDetected` handler before calling `scoreItem`:

```js
// In overlay-renderer.js — onItemDetected handler:
const ps = session?.pobStats || {};
currentSession.hitChance = Number(ps.hitChance) || null;
```

**Scoring adjustment logic:**
```js
function accuracyMultiplier(hitChance) {
  if (!hitChance || hitChance >= 95) return 0.15; // near-zero value
  if (hitChance >= 90) return 0.5;                // medium value
  return 1.0;                                      // full value
}
```
Apply to any scoring rule that matches `/accuracy|accuracy rating/i` before accumulating points,
passing `currentSession.hitChance` as the argument.

**Affected slots:** Quiver, Gloves, Rings, Weapon.

---

### ✅ 2.3 Add resist-emergency context to every overlay comparison
When Fire/Lightning resistances are negative (from pobb.in import), the overlay should flag
whether the copied item helps or ignores that problem.

**Example output in coach panel:**
```text
Build warning: Lightning (-33%) and Fire (-9%) are uncapped.
This item does not help either resistance — damage upgrades are lower priority right now.
```
or:
```text
This item adds +20 Fire Resistance, reducing one critical gap. Lightning (-33%) still needs fixing.
```

**Implementation:**
- Read `session.pobStats.resistances` in the renderer.
- Compare copied item's resistance mods against the gaps.
- Emit a `resistWarning` string that renders at the top of the coach panel.

---

### 2.4 Preserve imported guide identity after pobb.in import
The build label sometimes becomes `"Levelin (1 stages)"` instead of keeping the full guide name.

**Fix:**
- Treat `.build` import as the canonical guide name/stages.
- Treat pobb.in as current character state only.
- Never let pobb.in import overwrite guide stages.
- Fix the typo-trimmer: change `Levelin` back to `Leveling` if the last character before the
  space is `n` and the preceding 6 characters spell `leveli`.

---

### ✅ 2.5 Harden item slot detection (regression test list)
The parser has improved through v28, but slot detection should be locked down with explicit tests.

**Items that must classify correctly:**
| Item | Expected slot |
|------|--------------|
| Belt with Charm Slots | `belt` |
| Thawing Charm | `charm` |
| Divine Life Flask | `flask` |
| Iron Ring | `ring` |
| Quiver (rare, no Item Class) | `quiver` |
| Body Armour (normal rarity) | `body` |
| Unique Helmet | `helmet` |
| Empty pobb.in placeholder `Item Class: Quivers` | ignored |

Add `scripts/test-parser.js` (see Priority 5, item 5.3).

---

## Priority 3 — Overlay UX Improvements

### ✅ 3.1 Add "Urgent build needs" strip at the top of the overlay
A compact strip below the item title that always shows the current top deficiencies.

```text
Needs: ⚡ Lightning +108 to cap  🔥 Fire +84 to cap  ❄ Cold +32 to cap
```

This makes every item comparison easier to interpret without opening the health report.

**Implementation:**
- Read from `session.pobStats.resistances` (already imported from pobb.in).
- Calculate gaps to 75% cap.
- Render as colored chips: red for negative, orange for 0–74%, green for capped.

---

### 3.2 Improve category bar breakdown labels (not yet started)
The six score bars should show what stat contributed to the score.

```text
Damage  +19
  ↳ +9% attack speed (+13)  · no flat cold/physical damage (−4)

Resistance  +20
  ↳ +20% Fire Resistance (+8 × slot weight 1.3 = +10)
```

Add an expandable "detail" section per bar (click to expand or always show on hover).

---

### ✅ 3.3 Add "Keep / Replace / Future / Vendor" action labels
The verdict should be actionable, not just numerical.

| Score range | Label |
|-------------|-------|
| > +20 | **Equip now** |
| +5 to +20 | **Equip — clear upgrade** |
| -5 to +5 | **Sidegrade — test in-game** |
| Blocked by level/attribs | **Future item — save for later** |
| -5 to -20 | **Keep equipped item** |
| < -20 | **Vendor / sell** |

---

### ✅ 3.4 Add confidence level indicator
Some comparisons are definitive; others depend on incomplete affix data.

```text
Confidence: High — both items fully parsed, decisive score gap.
Confidence: Medium — item trades damage for resistance. Try in-game.
Confidence: Low — equipped item affixes incomplete (pobb.in gear names only).
```

Confidence rules:
- **High:** Equipped item has full affix text AND score delta > 15.
- **Medium:** Score delta 5–15, or resistance/damage trade-off detected.
- **Low:** Equipped item was imported as a name only (no affixes).

---

### ✅ 3.5 Add "Why accuracy/crit may not matter yet" inline warnings
For leveling, show context-sensitive notes when accuracy or crit are lower priority:

```text
⚠ Accuracy is lower priority — hit chance is already 95%.
⚠ Crit scaling is low — crit damage alone does not outweigh flat attack damage at this stage.
```

---

### ✅ 3.6 Persist overlay position between sessions
If the user moves the overlay to a preferred screen corner, remember it.

**Implementation:**
- On `overlay:dismiss`, record `{ x, y }` from `overlayWindow.getBounds()` in `session.json`.
- On `showOverlay()`, if a saved position exists and it fits on the current display, use it
  instead of the cursor-relative default.
- Add a "Reset overlay position" option in the tray menu.

---

## Priority 4 — Health Report Improvements

### ✅ 4.1 Add Act/Progress checkpoint logic
Build advice should shift based on campaign progress, not just build stage.

| Stage | Top priorities |
|-------|---------------|
| Act 1 | Damage, movement speed, basic attributes |
| Act 2 | Attributes, life, early resists |
| Act 3 | Resists and life before DPS |
| Cruel / late campaign | Push toward capped elemental resists |
| Early maps | Cap elemental resists + life/eHP |

**Implementation:** Add an "Act" dropdown alongside the Stage selector. When Act 2 or later is
selected, boost resistance weights in the active profile automatically.

---

### ✅ 4.2 Add resistance priority table to health report
Make the resistance gap section visual and sortable.

```text
Resistance | Current | To 0% | To 50% | To 75% | Priority
Lightning  | -33%    | +33   | +83    | +108   | Critical
Fire       | -9%     | +9    | +59    | +84    | Critical
Cold       | 43%     |  —    |  +7    |  +32   | Improve soon
Chaos      |  0%     |  —    | +50    |  +75   | Later
```

Highlight cells: red = negative, orange = 0–74%, green = capped.

---

### ✅ 4.3 Separate "survival upgrades" from "damage upgrades"
The health report currently mixes priorities. Split into two lists:

```text
Survival upgrades (do first):
  1. Ring with Lightning + Fire resistance
  2. Belt with life + resistance
  3. Body armor with life + resistance

Damage upgrades (after resists improve):
  1. Gloves with attack speed / flat cold damage
  2. Quiver with flat damage + bow/projectile damage
  3. Bow with higher physical/cold attack damage
```

---

### ✅ 4.4 Improve weakest-slot explanations
Instead of only "add resistance here," explain the opportunity:

```text
Ring 2 is weak: rings can carry 2 resistance mods + attributes. This slot is your best
lever for fixing Lightning/Fire without losing damage.
```

---

### ✅ 4.5 Show pobb.in import completeness after import
After a pobb.in import, show a quality summary in the settings panel:

```text
pobb.in import quality:
✅ Player level imported (47)
✅ Resistances imported (Fire -9 / Cold 43 / Lightning -33 / Chaos 0)
✅ Life / eHP imported
✅ Full item affixes decoded (13 items)
⚠ Str/Dex/Int: not exposed by pobb.in — enter manually
```

---

## Priority 5 — AI Coach Improvements

### ✅ 5.1 Send structured context to AI instead of raw text
Replace the raw JSON dump with a compact, well-labeled summary the AI can use reliably.

```json
{
  "copiedItem": { "name": "...", "slot": "quiver", "mods": ["..."] },
  "equippedItem": { "name": "...", "slot": "quiver", "mods": ["..."] },
  "categoryDeltas": { "damage": -8, "resistance": 0, "synergy": +5 },
  "buildContext": {
    "stage": "leveling",
    "hitChance": 95,
    "resistGaps": { "lightning": -108, "fire": -84 },
    "playerLevel": 47,
    "urgentNeeds": ["lightning resistance", "fire resistance"]
  }
}
```

Return structured output:
```json
{
  "verdict": "Keep equipped item",
  "summary": "The copied quiver gains attack speed but loses flat damage and ignores resist gaps.",
  "topReasons": ["Loses flat cold damage (-18 pts)", "No Lightning/Fire resistance help"],
  "nextAction": "Look for a quiver with Lightning/Fire resist + flat cold damage for rings upgrade first."
}
```

---

### ✅ 5.2 Add AI "short answer" mode as overlay default
The overlay should show the 1–2 sentence summary immediately, with a "Show full analysis" button.

```text
Keep your current quiver. This one trades flat damage for attack speed but ignores
your uncapped Lightning/Fire resistances.

[Show full analysis ▾]
```

---

### ✅ 5.3 Show model name and version in Test AI result
The "Test AI" button should confirm exactly what model responded:

```text
✅ Gemini OK — gemini-3.5-flash (200 tokens, 1.2s)
✅ OpenAI OK — gpt-5.4-nano (180 tokens, 0.9s)
```

If it fails, show a specific reason:
- `Missing API key` → link to the key field
- `Invalid model ID` → suggest checking the model dropdown
- `Rate limited` → suggest waiting or switching models
- `Network error` → check connection

---

### ✅ 5.4 Add Claude (Anthropic) as an AI provider option
The app currently supports Gemini and OpenAI. Claude models (especially `claude-haiku-4-5`) are
fast, inexpensive, and produce structured JSON reliably.

**Provider config addition in `main.js`:**
```js
// In callClaude():
const body = {
  model: settings.model || "claude-haiku-4-5-20251001",
  max_tokens: 512,
  messages: [{ role: "user", content: prompt }],
};
const res = await httpsJsonRequest("https://api.anthropic.com/v1/messages", {
  headers: {
    "x-api-key": settings.apiKey,
    "anthropic-version": "2023-06-01",
  },
  body,
});
const text = res?.content?.[0]?.text || "";
return { provider: "claude", model: settings.model, advice: parsePossiblyJson(text), rawText: text };
```

**Settings UI and validation changes** (do not add `{ label, value }` entries to `defaultAISettings()` —
that function returns a flat settings object, not a preset list):

1. Add `"claude"` as a valid provider in `saveAISettings()` alongside `"gemini"` and `"openai"`.
2. Add Claude model options to the provider dropdown in `settings.html`:
   ```html
   <optgroup label="Claude (Anthropic)">
     <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (fast, cheap)</option>
     <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (balanced)</option>
   </optgroup>
   ```
3. In `saveAISettings()`, extend the provider guard:
   ```js
   const validProviders = ["gemini", "openai", "claude"];
   provider: validProviders.includes(data.provider) ? data.provider : "gemini",
   ```
4. In `requestAIAdvice()`, add the Claude branch:
   ```js
   const data = settings.provider === "openai" ? await callOpenAI(settings, prompt)
              : settings.provider === "claude"  ? await callClaude(settings, prompt)
              : await callGemini(settings, prompt);
   ```

---

## Priority 6 — Developer Workflow

### ✅ 6.1 Add GitHub Actions build workflow
Automate Windows builds on push and release tags.

**Create `.github/workflows/build.yml`:**
```yaml
name: Build Windows
on:
  push:
    tags: ["v*"]
  workflow_dispatch:

jobs:
  build-win:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run check
      - run: npm run build-win
      - uses: actions/upload-artifact@v4
        with:
          name: poe2-gear-coach-windows
          path: dist/*.exe
```

---

### ✅ 6.2 Add parser regression test script
Prevent item-slot classification regressions.

**Prerequisite — extract parsing into `src/parser.js`:**
`overlay-renderer.js` references browser globals (`document`, `window`) at the top level,
so it cannot be `require()`d directly in Node.js — doing so throws
`ReferenceError: document is not defined`. Before writing the test script, extract the
pure parsing functions (`parseItem`, `inferSlotFromText`, `isModLike`, etc.) into a new
DOM-independent file that works in both Node and the Electron renderer:

```
src/parser.js       ← pure text parsing, no DOM references
src/overlay-renderer.js  ← imports from parser.js, keeps all DOM/UI code
```

**Create `scripts/test-parser.js`:**
```js
// Run with: node scripts/test-parser.js
"use strict";
const { parseItem, inferSlotFromText } = require("../src/parser.js");

const cases = [
  { label: "Magic quiver",       text: "Item Class: Quivers\nRarity: Magic\n--------\nRequires: Level 5\n", expect: "quiver" },
  { label: "Rare belt w/ charm", text: "Item Class: Belts\nRarity: Rare\nCharm Slots: 1\n--------\n", expect: "belt" },
  { label: "Charm",              text: "Item Class: Charms\nRarity: Normal\n--------\n", expect: "charm" },
  { label: "Flask",              text: "Item Class: Flasks\nRarity: Normal\n--------\n", expect: "flask" },
  { label: "Normal body armour", text: "Rarity: Normal\nSilk Robe\n--------\nEnergy Shield: 14\n", expect: "body" },
  { label: "Unique helmet",      text: "Item Class: Helmets\nRarity: Unique\n--------\n", expect: "helmet" },
  { label: "Empty placeholder",  text: "Item Class: Quivers\n", expect: null },
];

let failed = 0;
for (const c of cases) {
  try {
    const parsed = parseItem(c.text);
    const slot = parsed?.slot ?? null;
    if (slot === c.expect) {
      console.log(`PASS: ${c.label}`);
    } else {
      console.error(`FAIL: ${c.label} — expected "${c.expect}", got "${slot}"`);
      failed++;
    }
  } catch (err) {
    console.error(`FAIL: ${c.label} — threw: ${err.message}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
} else {
  console.log("\nAll tests passed.");
}
```

Add to `package.json`:
```json
"test:parser": "node scripts/test-parser.js"
```

---

### ✅ 6.3 Add release checklist
Create `RELEASE_CHECKLIST.md`:

```text
Before each release:
- [ ] npm run check passes (all .js files pass syntax check)
- [ ] Settings opens from tray icon
- [ ] .build folder import loads all guide stages
- [ ] pobb.in import fills stats, resistances, and gear names
- [ ] Ctrl+C on a normal item triggers overlay
- [ ] Ctrl+C on a rare item triggers overlay
- [ ] Ctrl+C on non-item text hides overlay
- [ ] Set as equipped updates the saved gear slot
- [ ] AI Test returns a valid response (Gemini or OpenAI)
- [ ] Build Health Report generates and exports correctly
- [ ] Windows NSIS installer runs without SmartScreen block (or bypass is documented)
- [ ] Portable .exe runs without installation
- [ ] Overlay appears above PoE2 in Windowed Fullscreen
- [ ] Overlay does not appear on taskbar while game is active
```

---

### 6.4 Use electron-updater for in-app auto-update (optional)
For users running the installed build, auto-update saves having to re-download manually.

**Add to `package.json` devDependencies:**
```json
"electron-updater": "^6.x"
```

**In `main.js`:**
```js
const { autoUpdater } = require("electron-updater");
autoUpdater.checkForUpdatesAndNotify();
```

**In `electron-builder` config:**
```json
"publish": {
  "provider": "github",
  "owner": "rpeters1430",
  "repo": "poe2-item-coach"
}
```

Requires a GitHub release with build artifacts. Electron-updater handles diff updates.

---

## Implementation Status Summary (as of 2026-06-25)

### ✅ Completed (30 of 32 items)
| # | Item |
|---|------|
| 1.1 | Clipboard polling race fix (recursive setTimeout) |
| 1.2 | DPI-aware overlay positioning using workArea |
| 1.3 | Windows startup-with-system (Login Item Settings) |
| 1.4 | Escape only registered while overlay is visible |
| 1.5 | SmartScreen bypass documented in README.md |
| 1.6 | skipTaskbar + setVisibleOnAllWorkspaces for fullscreen |
| 1.7 | setAlwaysOnTop with "screen-saver" level |
| 1.8 | Portable .exe build target added to package.json |
| 2.1 | "Why it won/lost" top gains/losses in coach panel |
| 2.2 | accuracyMultiplier() reduces accuracy value at ≥95% hit chance |
| 2.3 | Resist-emergency banner in overlay (resistWarning) |
| 2.5 | Parser regression test suite expanded to 18 cases |
| 3.1 | Urgent build needs strip (id="urgent-needs" in overlay.html) |
| 3.3 | Action label verdicts: Equip now / Sidegrade / Vendor / etc. |
| 3.4 | Confidence level indicator (High / Medium / Low) |
| 3.5 | Inline accuracy/crit context warnings when hit chance ≥ 95% |
| 3.6 | Overlay position persisted to session.json; tray "Reset position" |
| 4.1 | Act/Campaign progress dropdown with resistance urgency boost |
| 4.2 | Resistance priority table (color-coded, full % breakdown) |
| 4.3 | Survival upgrades / Damage upgrades split in health report |
| 4.4 | Improved weakest-slot explanations with per-slot opportunity text |
| 4.5 | pobb.in import quality checklist (level / resists / life / gear / attrs) |
| 5.1 | Structured JSON context sent to AI; structured JSON response parsed |
| 5.2 | Collapsible AI panel — short summary shown, "Show full analysis" toggle |
| 5.3 | Test AI button shows model name + token count + duration |
| 5.4 | Claude (Anthropic) as third AI provider option |
| 6.1 | GitHub Actions build workflow (.github/workflows/build.yml) |
| 6.2 | Parser extracted to src/parser.js; scripts/test-parser.js with 18 cases |
| 6.3 | RELEASE_CHECKLIST.md created |

### Not Yet Started (2 items)
| # | Item | Priority |
|---|------|----------|
| 2.4 | Preserve imported guide identity after pobb.in import | Medium |
| 3.2 | Expandable category bar breakdown labels (click to expand) | Low |
| 6.4 | electron-updater in-app auto-update | Low |

---

## Near-Term Suggested Roadmap

### ✅ v2.1 — Windows Stability (complete)
- ✅ Fix clipboard race condition on Windows (1.1)
- ✅ Fix DPI-aware overlay positioning (1.2)
- ✅ Add Windows startup option (1.3)
- ✅ Fix Escape-key game interference (1.4)
- 1.5 Document SmartScreen bypass — **still needed**
- ✅ Set overlay above fullscreen with `"screen-saver"` level (1.7)

### ✅ v2.2 — Scoring & Explanations (complete)
- ✅ Add "why it won/lost" plain-English breakdown (2.1)
- ✅ Lower accuracy value when hit chance is high (2.2)
- ✅ Add resist-emergency context in every overlay (2.3)
- ✅ Add "Urgent build needs" strip at top of overlay (3.1)
- ✅ Add action label verdict (3.3)

### v2.3 — Health Report & UX (next focus)
- 4.2 Add resistance priority table
- 4.3 Separate survival vs damage upgrade sections
- 4.1 Add Act/Progress checkpoint logic
- ✅ Confidence level indicator (3.4) — done
- 4.5 Add pobb.in import quality summary

### ✅ v2.4 — AI & Build (complete)
- ✅ Structured AI context (5.1)
- ✅ Short-answer AI overlay mode (5.2)
- ✅ Add Claude as provider option (5.4)
- ✅ Add GitHub Actions build workflow (6.1)
- ✅ Add parser regression tests (6.2)

### v2.5 — Polish & Distribution
- 1.8 Bundle portable .exe option
- 6.4 Add in-app auto-updater
- ✅ Persist overlay position (3.6) — done
- 6.3 Add release checklist

---

## Current Gameplay Context (used for scoring tuning)

Ice Shot Deadeye, approximately level 47, imported from pobb.in:

| Resistance | Current | Gap to 75% cap |
|-----------|---------|----------------|
| Fire       | -9%     | +84            |
| Cold       | 43%     | +32            |
| Lightning  | -33%    | +108           |
| Chaos      | 0%      | +75            |

**Priority order for this character:**
1. Lightning resistance (+108 to cap — critical)
2. Fire resistance (+84 to cap — critical)
3. Cold resistance (+32 to cap — improve soon)
4. Life / eHP — modest for level
5. Damage upgrades — after resist gaps improve

**Slots best used for defensive fixes:**
Rings → Belt → Body Armor → Helmet → Gloves → Boots → Amulet

**Weapon and quiver** should stay damage-focused unless a replacement also fixes resistances
without meaningful damage loss.

**Accuracy scoring note:** Hit chance is ~95% for this character. Accuracy mods should be
scored at 15% of their default value until hit chance drops below 90%.
