# Unique Item Data Expansion — Design Spec

**Date:** 2026-09-07
**Status:** Approved, not yet implemented
**Scope:** Phase 1 of 2. This spec covers only expanding the bundled PoE2 dataset to
include unique items. A follow-up spec will cover redesigning the AI Coach to consume
this data (see "Relationship to the AI integration work" below) — no AI/overlay code
changes are part of this spec.

## Problem

`src/recommendation-engine.js` has zero unique-item awareness. Every item — rare or
unique — is scored purely by pattern-matching generic affixes (flat life, resistances,
flat damage, etc.) defined in `src/poe2-mod-data.js`. A unique's actual defining
effects — "Causes Double Stun Buildup," conversion effects, "Trigger Level X Spell,"
minion/totem behavior changes, and dozens of other unique-only mod types — don't match
any generic pattern and are silently invisible to scoring. The tool can under- or
over-value a unique for reasons that have nothing to do with what actually makes it
good, and any future AI layer has nothing authoritative to ground its explanation in
beyond raw mod text copied off the item.

## Goal

Give the app a bundled, offline dataset of every current unique item — name, base
type, slot, requirements, and every implicit/explicit mod with its real value range —
sourced from poe2db.tw, refreshed the same way `src/poe2-mod-data.js` already is via
`npm run fetch-mods`. This is groundwork: it doesn't change scoring or AI behavior by
itself, but makes both possible without hallucination.

## Data source

`https://poe2db.tw/us/Unique_item` is a single page (~1.5MB) that embeds all ~493
current uniques across four tabs (Weapon /88, Armour /219, Other /138, Cultivated
/48). Each item renders as a repeating block:

```html
<div class="d-flex border-top rounded">
  ...
  <a href="/us/Brynhands_Mark">
    <span class="uniqueName">Brynhand's Mark</span>
    <span class="uniqueTypeLine">Wooden Club</span>
  </a>
  <div class="requirements">Requires: <span class="colourDefault">Level 1</span></div>
  <div class="explicitMod">Adds <span class='mod-value'>(10<span class="ndash">—</span>14)</span>
    to <span class='mod-value'>(16<span class="ndash">—</span>20)</span> Physical Damage</div>
  <div class="explicitMod">+<span class='mod-value'>(30<span class="ndash">—</span>50)</span> to Accuracy Rating</div>
  ...
</div>
```

Confirmed live (2026-09-07): one fetch of this single page yields all items —
445 `uniqueName` spans / 493 item blocks, 2256 `explicitMod` divs, 270 `implicitMod`
divs. No need to crawl ~490 individual item detail pages (those exist too, each with
an embedded JSON blob, but the listing page alone already carries everything this
dataset needs).

This means the whole dataset can be refreshed with **one HTTP request**, not hundreds
— materially lower risk of rate-limiting and much faster than the individual-page
approach originally assumed going in.

## Data shape

New file `src/poe2-unique-data.js`, structured like the existing `poe2-mod-data.js`:
a `window.POE2_UNIQUE_DATA` global (loaded as a `<script>` in `overlay.html` /
`settings.html`) that is also `module.exports`-able for Node/tests.

```js
const POE2_UNIQUE_DATA = {
  version: "1.0.0",
  fetched: "2026-09-07T00:00:00.000Z",
  source: "poe2db.tw/us/Unique_item",
  items: [
    {
      id: "brynhands_mark",          // slugified name, stable key
      name: "Brynhand's Mark",
      baseType: "Wooden Club",
      slot: "weapon",                 // mapped via itemClassForSlot()-style logic (see below)
      levelReq: 1,
      attrReqs: { str: 0, dex: 0, int: 0 },
      implicits: [
        { text: "...", ranges: [[min, max]] }
      ],
      explicits: [
        // ranges captures every "(min–max)" span found in the mod text, in order —
        // handles both single-range mods and dual-range mods (e.g. "Adds X to Y ... Damage")
        // uniformly. Empty array for mods with no numeric roll (e.g. "Causes Double Stun Buildup").
        { text: "Adds (10–14) to (16–20) Physical Damage", ranges: [[10, 14], [16, 20]] },
        { text: "+(30–50) to Accuracy Rating", ranges: [[30, 50]] },
        { text: "Causes Double Stun Buildup", ranges: [] }
      ]
    },
    // ...~493 items
  ]
};
```

Core fields only (per your call) — no hand-curated "build-defining for X archetype"
tags. That kind of curation is real future value but isn't scrapable and would need
manual authorship; out of scope here.

## Scraper implementation

New script `scripts/fetch-poe2-uniques.js`, sibling to `scripts/fetch-poe2db.js`,
reusing its existing HTTP/cache/retry helpers directly (`httpsGet`, `cachedHtml`/
`saveCachedHtml` with 24h TTL, `RETRY_DELAYS` backoff on 429/503). No headless browser
needed — the listing page is fully server-rendered.

1. Fetch `https://poe2db.tw/us/Unique_item` (or serve from 24h cache).
2. Parse each repeating item block (regex-based extraction, same style as
   `extractCells`/`parseTableRows` in `fetch-poe2db.js` — this markup is `<div>`-based
   rather than `<table>`-based, so it needs its own block-extraction function, but the
   same balanced-tag-scanning approach applies).
3. For each block, extract `uniqueName`, `uniqueTypeLine`, the `requirements` line
   (level + optional Str/Dex/Int, comma-separated), and every `explicitMod`/
   `implicitMod` div's text with its `mod-value` ranges.
4. Derive `slot` from the unique's `baseType` string (e.g. "Wooden Club" → `weapon`)
   by reusing `inferSlotFromItemName()` from `src/main.js` — already exported via
   `module.exports` for exactly this kind of name→slot lookup — rather than writing a
   fourth independent slot-inference implementation (the codebase already has three:
   `main.js`, `parser.js`, `app.js`; this must not become a fourth divergent one). The
   tab a block is under (Weapon/Armour/Other/Cultivated) is a useful cross-check but
   not authoritative on its own — "Other" includes jewelry, flasks, and charms, which
   still need the base-type match to resolve to a real slot.
   `src/main.js` cannot be `require()`'d directly from a plain Node script, though —
   its top-level code calls `app.on(...)` immediately and throws outside Electron.
   Reuse it the same way `scripts/test-clipboard-watcher.js` and
   `scripts/test-pobb-gear-slots.js` already do: extract just the
   `inferSlotFromItemName` function's source out of `main.js`'s raw text via regex and
   run it with `vm.runInContext()`, rather than requiring the whole module.
5. Write the result to `src/poe2-unique-data.js`, matching the existing file's header
   comment conventions (`version`, `fetched` timestamp, `source` note).
6. Verify by `require()`-ing the freshly written file back (same pattern
   `fetch-poe2db.js` already uses at the end of `main()`) — on failure, restore the
   original file and exit nonzero rather than leaving a broken bundle.

## Wiring

- New `package.json` script: `"fetch-uniques": "node scripts/fetch-poe2-uniques.js"`.
  Kept **separate** from `fetch-mods` (not folded into one combined command) — uniques
  change far less often per-league than affix tiers, and keeping them independent lets
  you refresh one without forcing a full run of the other.
- `overlay.html` and `settings.html` each get one more `<script src="poe2-unique-data.js">`
  tag, alongside the existing `poe2-mod-data.js` include.

## Testing

New `scripts/test-poe2-unique-data.js`, matching the project's existing no-framework
`scripts/test-*.js` pattern (plain Node script, `assert`, nonzero exit on failure):

- Bundled file loads and has the expected top-level shape (`version`, `fetched`,
  `items` array).
- Item count is plausible (e.g. `> 400`, guards against a scrape that silently
  half-completed).
- A couple of known, stable items (e.g. Brynhand's Mark) parse with the expected
  `slot`, `levelReq`, and at least one `explicits` entry with a nonempty `ranges`
  array — a real assertion against real data, not just a shape check.
- Wired into `npm test` as `test:unique-data`, same as every other `test:*` script.

## Risks

- **Markup drift**: if poe2db.tw changes this page's structure, the scraper breaks
  loudly (0 items parsed → script logs the failure and leaves the bundled file
  untouched) rather than silently writing corrupted data — same fail-safe the
  existing `fetch-poe2db.js` already relies on.
- **League churn**: uniques are added/removed/rebalanced most leagues. Handled by
  re-running `npm run fetch-uniques` manually when needed; the diff goes through
  normal review before commit, same as `fetch-mods` today (per `CLAUDE.md`: "review
  the diff carefully").
- **Slot mapping edge cases**: some unique base types are ambiguous or not covered by
  `inferSlotFromItemName()`'s current keyword list (e.g. quarterstaff-classed uniques
  under the "Other" tab, or a base type spelled differently than the regexes expect).
  Reusing `inferSlotFromItemName()` means any fix benefits both this scraper and the
  existing PoB import path, rather than needing two parallel fixes — but it also means
  a handful of items may need `slot: null` with a logged warning rather than a guess,
  for a human to patch later.

## Relationship to the AI integration work (out of scope here)

The already-agreed direction for the follow-up spec: the rule engine stays
authoritative (AI explains, never overrides), grounded in this dataset instead of
hardcoded prompt text, auto-triggered only on meaningful score deltas (not every
item), and scoped to the overlay (per-item popup + proactive insight) — not the
Settings Health Report. This dataset's shape (per-item `explicits`/`implicits` with
real ranges) is designed to drop directly into that prompt's grounding context without
rework.
