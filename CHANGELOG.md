# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added
- **Dedicated Recommendation Engine & Build-Context Filter (`src/recommendation-engine.js`)**:
  - Solves the collision between character state, build guide stages, and generic slot heuristics by gating all recommendations through an authoritative `BuildContext` filter.
  - Answers four core questions reliably:
    1. *What build/stage am I actually on?* (Identifies archetype, weapon style, and stage level).
    2. *What are my 2–3 biggest current problems?* (Ranks real leveling bottlenecks: hit chance, weapon base/damage, empty slots).
    3. *Which equipped slots can realistically fix those problems?* (Assigns slot targets without off-archetype pollution).
    4. *What should I ignore right now?* (Suppresses 75% cap panic, offhand/quiver stats, and premature endgame mechanics).
  - Replaces the monolithic catch-all score with a **5-Dimension Slot Evaluation Model**:
    - `buildFit`: Clean / Synergy / Neutral / Contaminated.
    - `stageFit`: Ideal / Good / Acceptable / Weak / Empty.
    - `defense`: Survival contribution relative to stage targets.
    - `damage`: Offensive contribution relative to archetype.
    - `replaceUrgency`: Immediate Fix / Upgrade Priority / Serviceable / Locked In.
  - Added dedicated **"Coach's 4 Next Decisions"** card in Settings and real-time dimension chips in the in-game overlay.
- **PoE2 0.5.5 "The Forbidden Rites" Event League Support**:
  - Set `poe2/Forbidden Rites` as the default league across the app, overlay, trade search, and poe.ninja pricing.
  - Added support for all event league variants: `poe2/Forbidden Rites`, `poe2/Forbidden Rites Hardcore`, `poe2/Forbidden Rites Solo Self-Found`, and `poe2/Forbidden Rites Hardcore Solo Self-Found`.
  - Added real-time league synchronization between Character settings, Trade Search, and `session.json`.
- **Special 0.5.5 Item Parsing & Slot Classification**:
  - Added smart slot detection for Soul Cores (`soul_core`), Runes (`rune`), Precursor / Ritual Tablets (`tablet`), Waystones (`waystone`), Inscribed Ultimatums (`ultimatum`), Jewels (`jewel`), and Relics (`relic`).
  - Added extraction of socket bonuses (`weapon`, `armour`, etc.), `waystoneTier`, and Inscribed Ultimatum wager costs and rewards.
  - Expanded clipboard item detection (`isPoe2Item`) to recognize `Socketable`, `Augment`, `Waystone Tier:`, `Reward:`, `Charm Slots:`, and `Can be inserted into`.
- **Specialized Item Coaching Panels**:
  - **Soul Core Dual-Nature Advisor**: Evaluates weapon socketing (damage scaling) vs armour socketing (resistance capping against current uncapped resists). Details 0.5.5 3-to-1 vendor reforging and Desecration extraction.
  - **Waystone Hazard Audit**: Real-time danger scan alerting players to lethal map affixes (elemental reflect, physical reflect matched to build damage focus, no life/mana regen, -max resistances).
  - **Ritual Tablet Stacking Guide**: Explains 0.5.5 multi-tablet map device stacking, Azmeri Wisp density scaling, and Sacred Bloom drops.
  - **Inscribed Ultimatum Wager Audit**: Highlights wager requirements vs returns and survivability advice for the 30-room Trial of Chaos overhaul.
  - **Runesmithing Socket Card**: Shows weapon vs armour bonuses for Runes of Aldur and core runes.
- **Build Focus & Mod Data Expansion**:
  - Added build focus detection and scoring rules for `fire`, `chaos` (Forbidden Rites theme), `physical`, and `spirit`.
  - Added `forbiddenRitesChaos` and `infernalistFire` archetype presets.
  - Added `flat_spirit` tier table (T1–T4).
- **Settings 0.5.5 Cheat Sheet & Reference**:
  - Added a dedicated "Forbidden Rites 0.5.5" reference tab in Settings with quick-lookup mechanics guides for 17 new Soul Cores, 30-room Trial of Chaos, and multi-tablet Ritual stacking.
- **AI Coach 0.5.5 Integration**:
  - Updated AI coach system prompt and model context with 0.5.5 patch mechanics, Soul Core dual socketing, and Waystone hazard checks.
- **Mobalytics Community Build Import & Direct URL Fetching**:
  - Added support for importing community builds directly via URL (e.g. `mobalytics.gg/poe-2/profile/:username/builds/:id`, `mobalytics.gg/poe-2/builds/:id`, and raw UUIDs) as well as curated guides (`mobalytics.gg/poe-2/builds/:slug`).
  - Implemented GraphQL-based document fetching and variant `.build` JSON extraction directly from Mobalytics' PoE2 API, using Electron's Chromium network stack to safely bypass Cloudflare Turnstile blocks.
  - Automatically converts all progression variants (e.g. Act 1–4, Interludes, Mapping, Endgame) into distinct, non-overlapping stage profiles with accurate level ranges (1–15, 16–28, 29–42, 43–55, 56–64, 65–84, 85–100).
  - Normalizes weapon and armour unique items (e.g. Amor Mandragora, Lochtonial Caress) without requiring manual text markup.
  - Extracts rich-text creator notes, playstyle advice, and gear instructions using Lexical AST extraction, integrating them directly into stage evidence and AI coaching.
  - Added a dedicated Build URL input row in the Settings Mobalytics tab with Enter key submission and loading indicators, while preserving manual text paste fallback.
- Added a provenance-aware build knowledge model that combines Mobalytics creator intent, build stages, current PoB character data, and personal coaching priorities.
- Added direct local import of raw Path of Building export codes, including grouped active skills/supports, notes, passive node ids, attributes, and equipped item affixes.
- Added public Mobalytics URL fetching with a paste-the-page-text fallback when a guide cannot be read automatically.
- Added Martial Artist, lightning, quarterstaff, and Hollow Palm focus detection and scoring rules.

- **Level-Adaptive Coaching & Dynamic Progression Scaling**:
  - Replaced hardcoded 75% endgame resistance cap expectations with progressive level targets (Act 1: 15%, Act 2: 25%, Act 3+: 45%, Cruel / Late Campaign: 65%, Maps: 75%).
  - Dynamically scales affix evaluation weights by campaign stage (boosting flat weapon damage, mobility, and early life during leveling while tapering high endgame resist bias).
  - Differentiated immediate attribute requirements (current gear & items within +5 levels) from distant future gear (>+10 levels), preventing low-level players from being spammed with endgame stat demands.
  - Adapted the resistance gap calculator, slot fix advisor, shopping lists, craft suggestions, urgent needs bar, and AI coach prompt to respect character level and progression stage.

### Fixed
- **Quarterstaff Monk & Melee Build Isolation**:
  - Fixed guide parsing and build health reports mistakenly classifying Quarterstaff Monk builds as bow/projectile builds and recommending quivers, bow skills, and projectile damage.
  - Hardened `inferBuildFocus` with strict word boundaries to prevent phrases like "Deflect Projectiles" or "one-shot" from falsely setting `bow: true` or `quiver: true`.
  - Added strict slot isolation (`getAllowedSlotsForFocus`) preventing two-handed Quarterstaff and Unarmed builds from ever showing or generating offhand/quiver targets, shopping cards, or advice.
  - Fixed `pobSlotToCoachSlot`, `inferSlotFromItemName`, `inferSlotFromPobText`, and `itemClassForSlot` in `main.js` which previously hardcoded `slotOrder[1] = "quiver"` and converted all weapons to `"Bows"`. Quarterstaves and staves now properly map to `"Quarterstaves"` and `"Staves"`.
  - Fixed `buildFixSlotsReport`, `healthAdviceForSlot`, and `buildNeededStats` hardcoding `"Weapon / Quiver"` across all archetypes. They now use dynamic, build-aware weapon labels.
- **Accuracy Rating & Low Hit Chance Escalation**:
  - Elevated low hit chance (e.g. 62% in Act 2) to a critical warning across needed stats, next steps, and pobb warnings, highlighting the severe ~38% attack miss penalty.
  - Boosted accuracy rating scoring and shopping priority (`accuracyMultiplier(62) = 2.0x`) when hit chance is low (< 80%), while scaling it down when hit chance is already near cap (≥ 95%).
- **Calibrated Level 20 Gear & Progression Coaching**:
  - Added Quarterstaff bottleneck advice when staff score is low (+38) to emphasize that flat damage and attack speed drops are huge upgrades.
  - Calibrated boots movement speed advice to recognize 10% movement speed as a good start while encouraging upgrades to 15–20%+.
  - Added empty/dead slot detection for zero-score slots (e.g. Amulet, Belt), recommending basic magic/rare items with Life, attributes, or a resistance.
  - Added Level 22 Monk milestone transition reminder (Storm Wave / Siphoning Strike swap) to keep gear steady and prevent unnecessary early respecs.
- Fixed critical false alarm banners during early leveling (e.g. at level 16 in Act 2) that falsely claimed lacking 75% capped resistances was "critical" or an emergency.
- Fixed early campaign builds being warned about negative chaos resistance or having "uncapped resistance cleanup" block damage upgrade advice.
- Fixed a mod parsing bug in `parser.js` where property lines without numbers (such as `Armour: +15% to all Elemental Resistances` on Soul Cores) were mistakenly discarded as gear property headers.
- Fixed trade search and poe.ninja price lookups hardcoding `poe2/Standard`, now dynamically querying the user's active event league.
- Fixed typo-trimmer in `cleanStageLabel` and `normalizeGuideNameText` with `\b([Ll]eveli)n(?=[\s\-_]|$)`.
- Removed Frost/Ice Shot as the fallback profile for the overlay and imported builds.
- Fixed raw PoB export codes being mistaken for enormous pobb.in build ids.
- Fixed the settings page registering two competing pobb.in import handlers.
- Fixed Save to Overlay dropping build-specific Mobalytics metadata by using one canonical session builder.

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
