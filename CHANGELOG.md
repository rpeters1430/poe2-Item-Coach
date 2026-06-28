# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - v32 - 2026-06-27

### Added
- **Fubgun level ranges**: Added dedicated level ranges for Fubgun's Deadeye guide stages (`Early`: 1–76, `non-crit Midgame`: 77–84, `non-crit Hybrid swap`: 85–89, `Crit Hybrid`: 90–94, `Uber Endgame`: 95–100, `Live Gear`: 100).
- **Targeted non-crit advice**: Weapon shopping and upgrade suggestions now dynamically swap critical stats for physical/cold damage and attack speed in early/non-crit build stages.
- **Robust text-signature comparison**: Mod deltas now match by stat signature and extract values directly from text (handling averages for ranges and negative numbers correctly) rather than depending on the database containing the tier range.
- **Importance-based delta sorting**: Mod deltas are now sorted by the guide/profile's rules points (stat importance) descending, showing the most critical changes first.
- **Path of Building-styled delta layout**: Cleaned up the comparison HUD layout to display simple, color-coded net difference lines matching PoB exactly, with positive deltas showing a standard plus sign.
- **Human-readable delta losses**: Negative deltas now render as descriptive lost actions (e.g. `Loses 80% to Fire Resistance` or `Loses 20 Cold damage to Attacks`) in red instead of raw minus signs or double-negative syntax.
- **Equipped comparison helper**: Enabled equipped comparison panel visibility when a slot is empty, offering helpful user guidance and a "Set as equipped" button that updates deltas instantly.

### Fixed
- **PoB build gear normalization**: Fixed a major parser bug where PoB items from pobb.in imports were normalized with `--------` delimiters separating every single line, corrupting name/rarity detection and causing the overlay to show no equipment loaded. Items are now reconstructed into proper block-level sections.
- **Cleaned build names**: Stripped guide variant prefixes (`Early`, `non-crit Midgame`, etc.) from build names during folder imports.
- **Softer resistance warning**: Wording for Fire/Cold resistance gaps is softened to "uncapped cleanup" rather than a "main problem" when both are above 50%.
- **Safe offhand slot mapping**: Hardened mapping in `mapInventoryIdToSlot` to prioritize actual Weapon/Offhand slot IDs, preventing weapons with quiver modifiers from being misclassified.
- **Cleaned tooltip roll ranges**: Stripped parenthesized roll ranges, advanced mod metadata enclosed in braces, and removed confusing tier badges (e.g. `T3 45%`) from implicits and explicits to maximize readability.
- **Filtered ModRange tags**: Filtered out POB internal `<ModRange>` XML tags from tooltips and comparison views.
- **Cleaned inline mod tags**: Stripped inline modifier tag prefixes like `{enchant}`, `{rune}`, `{crafted}`, and `{bonded}` from explicit/implicit mods to avoid cluttering.
- **Ignored name headers and meta in mods**: Excluded the rarity header block from being matched as a mod section (preventing weapon base names like `Militant Bow` from appearing as mods) and ignored colon-less metadata lines starting with `Requires` or `Item Level`.
- **Preserved decimal fractions**: Negative or positive deltas for fraction stats (e.g. `0.4%`) no longer round to zero (preventing outputs like `Loses 0%`).

## [2.0.0] - 2026-06-27

### Added
- Documented English-only client support limitation in the README.

### Fixed
- **IPC listener leak**: Moved settings and overlay IPC registrations to the module's top-level in `main.js` to register them exactly once, resolving MaxListeners warnings and redundant disk writes.
- **Ternary selector bug**: Fixed identical-ternary selector bug in `overlay-renderer.js` where the copied-item implicit/explicit separator toggled the equipped panel's separator instead of its own.
- **HTML escaping**: Unified on the stronger quote-escaping `escapeHtml` function from `parser.js` and loaded it globally in both settings and overlay windows, resolving a latent security injection vector.
- **Harden redirect following**: Added protocol (HTTPS only) and domain checks (`pobb.in`, `poe.ninja` and their subdomains only) in `httpsTextRequest` to prevent SSRF redirects.
- **Decompression bomb defense**: Added a `maxOutputLength` size cap of 5MB to all `zlib` decompression calls in `decodePobExport`.
- **Tray Pause desync**: Unified clipboard watcher paused state tracking using a single `isPaused` boolean, ensuring the context menu checkbox remains synchronized across rebuilds.
- **OpenAI model parameters**: Changed the reasoning effort level from `"none"` (which is invalid for Responses API) to `"low"`.

### Cleaned
- **Repo Hygiene**: Untracked and gitignored the 6.6MB local `data/poe2db-cache/` database cache.
- **Root Clutter**: Created `docs/` for screenshots and moved root `.build` files to `src/sample-builds/fubgun-ice-shot-deadeye/` folder.

---

## [0.28.0] - v30

### Fixed
- Fixed normal/raw item splitting that created empty Item Class-only equipment fields.
- Reclassified decoded PoB utility/belt items from item text instead of trusting ambiguous slot tags.
- Added clearer utility-item note for flasks and charms.
- Fixed overlay comparisons using invalid placeholder items such as `Item Class: Quivers` with no real rarity/name.
- Settings now saves a cleaned equipped-gear set to the Electron session, using generated equipment fields when present.
- Overlay ignores flasks/charms and empty placeholder chunks when building the saved gear comparison map, preventing comparisons against unnamed/empty slots.
- Treat charms/flasks as utility items instead of scoring them as armour slots (prevents charms appearing as body armor).
- Resistance priorities now include Cold when it is below the cap, while still ranking Fire/Lightning as more urgent when they are negative.
- Best-slots advice now names the resistances that need fixing instead of only saying Lightning/Fire.

---

## [0.27.0]

### Added
- pobb.in import now uses the public `/pob/:id/raw` endpoint first.
- If the preview page returns Cloudflare/worker error 1101, the app falls back to the raw PoB export instead of failing.
- Added clearer import warning when preview stats are unavailable.

---

## [0.26.0]

### Added
- Overlay clipboard detection now accepts normal/white gear that starts with `Rarity: Normal`, not only items with `Item Class:`.
- Full gear paste splitting now recognizes item boundaries that start with either `Item Class:` or `Rarity:`.

---

## [0.25.0]

### Added
- Added a **Choose build folder** import option for `.build` files to avoid Windows file picker limitations.
- Updated import instructions to mention folder import options.

---

## [0.24.0]

### Changed
- Clarified overlay score wording: +/- now says it is an overall build-fit score, not DPS.
- Saved item comparisons now show category deltas like Damage, Defense, Resistance, Attributes, Mobility, and Synergy.
- Added hover/tooltips and helper text explaining what each score category means.

---

## [0.23.0]

### Added
- Added resistance gap calculator based on pobb.in final character stats.
- Added "Best slots to fix current problem" recommendations.
- Kept duplicate gear slots visible, especially Ring 1 / Ring 2.
- Reduced generic attribute advice when attributes are already satisfied.
- Exported reports now include resistance gap and fix-slot sections.

---

## [0.21.0]

### Added
- Settings now saves the active session to the Electron main process, not just browser localStorage.
- Overlay now uses imported pobb.in level and Str/Dex/Int for requirement checks.
- Overlay popup now shows player level and attributes next to the copied item info.
- Saved imported profile is serialized for overlay comparisons.

---

## [0.20.0]

### Changed
- Shows pobb.in visible-stat warnings in the Health Report warning panel and export text.
- Clarifies that gear totals are parsed item-affix totals, while pobb.in visible stats are final character stats.

---

## [0.19.0]

### Fixed
- Fixed pobb.in import crash when warnings were undefined.
- Health report now adds pobb.in-based warnings for negative/low resistances, low life/eHP, and low hit chance.

---

## [0.18.0]

### Added
- Decodes pobb.in PoB export when possible to load full equipped item text, not just gear names.
- Automatically fills the gear set box from decoded pobb.in equipment so overlay comparisons use saved equipped items.
- Attempts to auto-fill Strength/Dexterity/Intelligence from decoded PoB stats when exposed.

---

## [0.17.0]

### Fixed
- Fixed pobb.in resistance parsing fallback.
- Preserved imported player level after guide-stage selection.
- Attempted Str/Dex/Int auto-fill when visible in pobb.in stats.

---

## [0.16.0]

### Added
- Improved pobb.in stat parsing so Life / ES / eHP / DPS / Hit / Resistances are read from the visible build summary instead of hidden page fragments.
- Added `UPDATE.md` with the safer update workflow.

---

## [0.15.0]

### Added
- Fixes the Settings import button so clicking **Import pobb.in** now calls the main-process importer.
- Adds player-level auto-fill and closest-stage selection after a successful pobb.in import.
- Auto-fills player level from the pobb.in page when visible.
- Adds visible pobb.in stats to the health report: Life, ES, eHP, DPS, hit chance, and resistances.
- Imports visible gear names and gem names from pobb.in pages.

---

## [0.13.0]

### Added
- Repo-ready rebuild for GitHub sharing.
- Added `npm run check` for basic JavaScript syntax checks.
- Added `.gitignore`, `.env.example`, `SECURITY.md`, and this changelog.
- Documents the security posture and API-key handling.

---

## [0.12.0]

### Added
- Adds model preset dropdowns for Gemini and OpenAI.
- Defaults Gemini to `gemini-3.5-flash` and OpenAI to `gpt-5.4-nano`.

---

## [0.11.0]

### Added
- Adds optional AI Coach provider layer for Gemini and OpenAI.
- Stores API keys locally in Electron `userData`.
- Adds AI explanation for latest health report and copied overlay item.

---

## Earlier MVPs

- Adds clipboard-first Electron overlay.
- Adds `.build` import, Mobalytics guide text import, health reports, saved gear comparison, equippable-only gear totals, and exportable reports.
