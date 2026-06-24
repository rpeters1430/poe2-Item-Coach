## 0.28.0

- Fixed normal/raw item splitting that created empty Item Class-only equipment fields.
- Reclassified decoded PoB utility/belt items from item text instead of trusting ambiguous slot tags.
- Added clearer utility-item note for flasks and charms.

# Changelog

## v27

- pobb.in import now uses the public `/pob/:id/raw` endpoint first.
- If the preview page returns Cloudflare/worker error 1101, the app falls back to the raw PoB export instead of failing.
- Added clearer import warning when preview stats are unavailable.


## v26
- Overlay clipboard detection now accepts normal/white gear that starts with `Rarity: Normal`, not only items with `Item Class:`.
- Full gear paste splitting now recognizes item boundaries that start with either `Item Class:` or `Rarity:`.
- This should make Ctrl+C popups work for normal gear, magic gear, rares, uniques, and copied PoB item text.

## v25

- Added a **Choose build folder** import option for `.build` files.
- This avoids the Windows file picker issue where selecting multiple individual `.build` files is awkward or appears limited to one file.
- Updated import instructions to mention Ctrl/Shift-click for multi-select and folder import after extracting a zip.


## 0.24.0

- Clarified overlay score wording: +/- now says it is an overall build-fit score, not DPS.
- Saved item comparisons now show category deltas like Damage, Defense, Resistance, Attributes, Mobility, and Synergy.
- Added hover/tooltips and helper text explaining what each score category means.


## v23

- Added resistance gap calculator based on pobb.in final character stats.
- Added “Best slots to fix current problem” recommendations.
- Kept duplicate gear slots visible, especially Ring 1 / Ring 2.
- Reduced generic attribute advice when attributes are already satisfied.
- Exported reports now include resistance gap and fix-slot sections.

## v21

- Settings now saves the active session to the Electron main process, not just browser localStorage.
- Overlay now uses imported pobb.in level and Str/Dex/Int for requirement checks.
- Overlay popup now shows player level and attributes next to the copied item info.
- Saved imported profile is serialized for overlay comparisons.

# Changelog

## v20

- Shows pobb.in visible-stat warnings in the Health Report warning panel and export text.
- Clarifies that gear totals are parsed item-affix totals, while pobb.in visible stats are final character stats.
- Keeps v19 pobb.in export decoding and equipped gear loading behavior.


## v18
- Decodes pobb.in PoB export when possible to load full equipped item text, not just gear names.
- Automatically fills the gear set box from decoded pobb.in equipment so overlay comparisons use saved equipped items.
- Attempts to auto-fill Strength/Dexterity/Intelligence from decoded PoB stats when exposed.
- Keeps visible pobb.in summary import as a fallback when full export decoding fails.

## 0.16.0

- Improved pobb.in stat parsing so Life / ES / eHP / DPS / Hit / Resistances are read from the visible build summary instead of hidden page fragments.
- Added UPDATE.md with the safer update workflow: keep node_modules, do not run `npm audit fix --force` for routine updates.
- Clarified pobb.in import limitation: gear names are imported, but full affixes/attribute totals still require decoded PoB export support later.

# Changelog

## v0.15.0

- Fixes the Settings import button so clicking **Import pobb.in** now calls the main-process importer.
- Shows an importing/error/success status in the pobb.in summary panel.
- Adds player-level auto-fill and closest-stage selection after a successful pobb.in import.
- Adds pobb.in current-build import through the Electron main process.
- Auto-fills player level from the pobb.in page when visible.
- Adds visible pobb.in stats to the health report: Life, ES, eHP, DPS, hit chance, and resistances.
- Imports visible gear names and gem names from pobb.in pages.
- Adds pobb.in resistance/life warnings to the next-upgrade advice.
- Gives more room to the Skills detected and Guide gear detected columns.
- Notes that Str/Dex/Int totals are not auto-filled unless exposed; full PoB export decoding is planned later.

## v0.13.0

- Repo-ready rebuild for GitHub sharing.
- Keeps Gemini default model preset as `gemini-3.5-flash`.
- Keeps OpenAI default model preset as `gpt-5.4-nano`.
- Adds `npm run check` for basic JavaScript syntax checks.
- Adds `.gitignore`, `.env.example`, `SECURITY.md`, and this changelog.
- Documents the security posture and API-key handling.

## v0.12.0

- Adds model preset dropdowns for Gemini and OpenAI.
- Adds Custom model option.
- Defaults Gemini to `gemini-3.5-flash` and OpenAI to `gpt-5.4-nano`.

## v0.11.0

- Adds optional AI Coach provider layer for Gemini and OpenAI.
- Stores API keys locally in Electron userData.
- Adds AI explanation for latest health report and copied overlay item.

## Earlier MVPs

- Adds clipboard-first Electron overlay.
- Adds `.build` import, Mobalytics guide text import, health reports, saved gear comparison, equippable-only gear totals, and exportable reports.


## 0.17.0

- Fix pobb.in resistance parsing fallback.
- Preserve imported player level after guide-stage selection.
- Attempt Str/Dex/Int auto-fill when visible in pobb.in stats.
## 0.19.0

- Fixed pobb.in import crash: `pobbWarningsForReport is not defined`.
- Health report now adds pobb.in-based warnings for negative/low resistances, low life/eHP, and low hit chance.
- Keeps v18 behavior that attempts to decode PoB export gear into saved equipment for overlay comparisons.


## 0.25.0

- Treat charms/flasks as utility items instead of scoring them as armour slots.
- Fixes cases where Thawing Charm could appear as Body Armor 2 in the health report.
- Resistance priorities now include Cold when it is below the cap, while still ranking Fire/Lightning as more urgent when they are negative.
- Best-slots advice now names the resistances that need fixing instead of only saying Lightning/Fire.

## v30
- Fixed overlay comparisons using invalid placeholder items such as `Item Class: Quivers` with no real rarity/name.
- Settings now saves a cleaned equipped-gear set to the Electron session, using generated equipment fields when present.
- Overlay ignores flasks/charms and empty placeholder chunks when building the saved gear comparison map.
- This prevents copied gear from comparing against `Unnamed item` saved slots.
