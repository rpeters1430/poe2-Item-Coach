# PoE2 Gear Coach — Overlay

A transparent, always-on-top overlay for Path of Exile 2 that watches your clipboard and pops up a gear evaluation whenever you press **Ctrl+C** on an item in-game.

## How it works

PoE2 already copies item text to your clipboard when you press Ctrl+C on a hovered tooltip. This app watches the clipboard 400ms at a time. When it sees text that looks like a PoE2 item (`Item Class: …`), it scores it against your current build profile and shows a popup near your cursor — without you doing anything extra.

```
You hover item in PoE2
  → Press Ctrl+C (game copies item text)
    → Overlay detects new clipboard text
      → Scores it vs. your build
        → Popup appears near cursor
          → Press Esc or click ✕ to dismiss
```

Lower-risk approach: no game memory reading, no OCR, no input automation, and no game-file modification. It only reacts to clipboard item text that you copy yourself. Use at your own discretion.

---

## Quick start

### Prerequisites

- **Node.js 18+** — https://nodejs.org

### Install & run

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Launch the overlay
npm start
```

The app starts in the system tray. A tray icon appears (bottom-right on Windows).

### Create a GitHub repo from this zip

After extracting the zip:

```bash
cd poe2-overlay
git init
git add .
git commit -m "Initial PoE2 Gear Coach overlay"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Do not commit real API keys. Use the Settings screen to save keys locally on each computer.

### First-time setup

1. **Double-click the tray icon** (or right-click → "Settings / Build Import").
2. Import your `.build` files or paste Mobalytics guide text.
3. Set your **Player level**, **Str/Dex/Int**.
4. Select the right **Build stage** for where you are in the game.
5. Paste your current gear set in the Build Health Report section if you want copied items compared against what you are wearing.
6. Click **💾 Save to Overlay**.
7. Close the settings window.

Now go play. Press **Ctrl+C** on any item in PoE2 — the overlay pops up.

---

## Hotkeys

| Key | Action |
|-----|--------|
| `Ctrl+C` in-game | Auto-triggers overlay on any PoE2 item |
| `Ctrl+Shift+G` | Manual trigger — re-evaluate current clipboard |
| `Esc` | Dismiss the overlay |

---

## Building a distributable .exe / .dmg

```bash
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

Output goes to `dist/`. You can share the installer with friends.

---

## Project layout

```
poe2-overlay/
├── package.json              ← Electron + electron-builder config
├── .gitignore                ← Keeps node_modules, dist, and secrets out of git
├── .env.example              ← Example only; do not commit real keys
├── SECURITY.md               ← Security notes and sharing guidance
├── CHANGELOG.md              ← Version notes
└── src/
    ├── main.js               ← Main process: clipboard watcher, windows, tray
    ├── preload.js            ← Secure IPC bridge (contextBridge)
    ├── overlay.html          ← Transparent popup shown in-game
    ├── overlay-renderer.js   ← Scoring engine for the popup
    ├── settings.html         ← Full settings / build import UI
    ├── app.js                ← Original browser app logic (unchanged)
    ├── styles.css            ← Original browser app styles (unchanged)
    ├── assets/
    │   ├── tray-icon.png     ← Tray icon
│   └── icon.ico          ← Windows installer icon
    └── sample-builds/        ← Ice Shot Deadeye sample .build files
```

---

## Tuning the clipboard poll rate

In `src/main.js`, change `CLIPBOARD_POLL_MS`:

```js
const CLIPBOARD_POLL_MS = 400; // ms — lower = more responsive, higher = less CPU
```

200ms is about as low as you'd want; 600ms is fine if you want to be gentle on CPU.

---

## Notes on GGG ToS

This tool **only reads the clipboard** after you copy an item yourself. It does not read game memory, inject into the process, automate clicks/keypresses, or modify game files. That is intentionally a lower-risk design, but no third-party tool can honestly promise zero policy risk. Use at your own discretion.

---

## What's next

- [x] Add a tray icon image (`src/assets/tray-icon.png`)
- [ ] Auto-detect which character slot you have open based on the item text
- [x] Compare copied items against saved equipped gear by slot
- [x] Add **Set as equipped** from the overlay for fast gear replacement
- [ ] Direct `.build` zip import without manual extraction
- [ ] PoB/PoB2 pastebin import
- [x] Optional AI Coach using Gemini or OpenAI APIs
- [x] Repo-ready GitHub files and basic syntax check

---

## Optional AI Coach

The core gear scoring still works completely offline. AI Coach is optional and is meant to turn the rule-engine output into clearer next-step advice.

Supported providers:

- Gemini
- OpenAI

Setup:

1. Open **Settings / Build Import**.
2. Scroll to **Optional AI Coach**.
3. Enable AI Coach.
4. Choose provider and model.
5. Paste your API key.
6. Click **Save AI settings** or **Test AI**.

Security notes:

- API keys are stored locally in Electron `userData` as `ai-settings.json`.
- API keys are not written to exported health reports.
- API keys are not included in `.build` files or saved gear text.
- Leave the API key field blank to keep an existing saved key.
- Use **Clear saved API key** to remove it.

AI features added in v11:

- **AI explain latest report** in Settings.
- **AI Coach** button in the overlay for the currently copied item.
- Gemini and OpenAI provider abstraction in the main process.
- Renderer processes never call provider APIs directly; they use the secure preload IPC bridge.


## v13 repo-ready rebuild

This package is ready to push into a GitHub repository. It includes `.gitignore`, `.env.example`, `SECURITY.md`, and `CHANGELOG.md`.

Before committing, keep these files out of git:

```bash
node_modules/
dist/
.env
ai-settings.json
session.json
```

Basic syntax check:

```bash
npm run check
```

## AI model defaults

AI Coach uses provider-specific model presets so you do not have to type model IDs manually.

Default presets:
- Gemini: `gemini-3.5-flash`
- OpenAI: `gpt-5.4-nano`

The settings screen also keeps a Custom model option for accounts/endpoints that support a different exact model ID. API keys remain stored locally in Electron userData and are not written into project files or exported reports. If a chosen model ID is not available on your API account, the Test AI button will show the provider error so you can switch to Custom or another preset.

## v0.14 pobb.in import

The settings window now has an **Import PoB / pobb.in current build** section. Paste a `pobb.in` URL and click **Import pobb.in**. The app fetches the public page through the Electron main process, then fills/uses visible data locally:

- player level, when visible
- Life / ES / eHP
- visible resistance summary
- DPS / hit chance
- visible gear names
- visible gem names
- the encoded PoB export code, stored locally for future decoding work

Current limitation: the visible `pobb.in` page usually shows gear names and stats, but not full copied item affixes or exact Strength/Dexterity/Intelligence totals. Those fields remain user-entered for now unless the page exposes them. Full PoB export decoding is planned as a later improvement.

## Updating without reinstalling every time

After the first `npm install`, routine updates should not require reinstalling dependencies. Keep your `node_modules` folder and update/pull only the changed source files.

```powershell
npm run check
npm start
```

Do not run `npm audit fix --force` for normal updates. It can upgrade Electron/electron-builder across major versions. See `UPDATE.md` for the safer workflow.



## v17 notes

- Improved pobb.in resistance parsing, including meta-description fallback and compact `-9%/43%/-33%/0%` formats.
- Player level imported from pobb.in is now preserved after auto-selecting the closest guide stage.
- Str/Dex/Int auto-fill is attempted when pobb.in exposes those values; otherwise manual entry is still required.
- No dependency reinstall is needed when updating from v16; overwrite source files and run `npm run check && npm start`.


## v22 update

The overlay popup is now larger and uses bigger text for easier in-game reading. Update by copying the v22 source files over your current project folder while keeping your existing `node_modules`, then run:

```powershell
npm run check
npm start
```


### Build file import tip

If Windows only lets you pick one `.build` file, use **Choose build folder** instead. Extract the Mobalytics/build zip, choose the folder that contains the `.build` files, and the app will import all `.build` files in that folder.


## v27 pobb.in fallback

The pobb.in importer tries the public raw endpoint first (`/pob/:id/raw`) and then reads the preview page for final visible stats. If the preview page returns error 1101, the app still imports equipped gear from the raw export when possible.


## v28 notes

- Fixed pobb.in raw import splitting so Item Class headers are no longer created as empty equipment cards.
- Re-detects slot from decoded item text so belts, charms, and flasks are not misfiled when PoB slot names are ambiguous.
- Keeps flasks/charms as utility items instead of ranking them as armor upgrades.
