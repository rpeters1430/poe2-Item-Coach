# PoE2 Item Coach Overlay — Next Fixes & Improvements

This file tracks the next practical improvements for the PoE2 Item Coach overlay after the v2 UI rebuild.

## Priority 1 — Correctness / Trust Fixes

### 1. Improve the “why this item won/lost” explanation
The overlay now shows build-fit score deltas, but the user still needs clearer plain-English reasons.

**Goal:** When an item is better or worse, explain the deciding factors.

Example:

```text
Worse than equipped
Reason:
- Loses flat physical/cold attack damage
- Gains accuracy, but hit chance is already high
- No resistance help while Fire/Lightning are negative
```

**Implementation notes:**
- Expand comparison output to include top 3 positive deltas and top 3 negative deltas.
- Add special-case explanations for stats that are technically positive but low priority.
- Show these in the Coach panel under “Why it won/lost.”

---

### 2. Lower accuracy value when hit chance is already high
Current scoring can overvalue accuracy-heavy items, especially quivers.

**Current problem:**
A quiver with accuracy + attack speed may look better than it should, even when pobb.in reports ~95–96% hit chance.

**Goal:** If imported hit chance is already high, reduce or ignore accuracy scoring.

Suggested logic:

```text
Hit chance >= 95%: accuracy has very low value
Hit chance 90–94%: accuracy has medium value
Hit chance < 90%: accuracy has normal/high value
```

**Affected slots:**
- Quiver
- Gloves
- Rings
- Weapon

---

### 3. Put resist emergency context directly in the overlay
The health report correctly identifies low Fire/Lightning/Cold resistance, but the Ctrl+C overlay should also use that context.

**Goal:** When resists are bad, the overlay should say whether the copied item helps or ignores that problem.

Example:

```text
Build warning:
Lightning and Fire resistance are currently negative.
This item does not help either resistance, so damage gains are less important.
```

Or:

```text
This item helps Fire resistance but still leaves Lightning as the major problem.
```

**Implementation notes:**
- Use pobb.in final resist stats when available.
- Calculate resistance gaps from final character stats, not only gear affixes.
- Add “Current problem match” to scoring/explanation.

---

### 4. Preserve imported guide identity after pobb.in import
Sometimes the build label can become truncated or reduced to one stage after importing Mobalytics text or pobb.in.

**Observed issue:**

```text
Build: 0.5 Ice Shot Deadeye Levelin (1 stages)
```

**Goal:** Keep the full `.build` guide as the target build:

```text
0.5 Ice Shot Deadeye Leveling (6 stages)
```

**Implementation notes:**
- Treat `.build` import as the target guide.
- Treat pobb.in as the current character/build state.
- Do not let pobb.in overwrite guide stages unless explicitly requested.
- Fix display-name cleanup: `Levelin` → `Leveling`.

---

### 5. Continue hardening item slot detection
The parser has improved, but this should stay a major test area.

**Must remain correct:**
- Belts with `Charm Slots` are still Belt, not Charm.
- Charms are utility items, not armor/ring/belt.
- Flasks are utility items, not gear-score items.
- Ring 1 and Ring 2 are separate.
- Empty pobb.in placeholders are ignored.
- Normal/white items trigger the overlay.

**Regression tests to add manually or in code:**
- Normal body armor
- Magic quiver
- Rare belt with charm slot
- Unique helmet
- Charm
- Flask
- Two rings
- Empty placeholder item from raw pobb.in decode

---

## Priority 2 — Overlay UX Improvements

### 6. Add an “Urgent build needs” strip at the top of the overlay
A small strip under the item title could show the current major build problems.

Example:

```text
Current needs: Lightning Res +108 to cap · Fire Res +84 to cap · Cold Res +32 to cap
```

This makes every item comparison easier to interpret.

---

### 7. Improve category bar labels
The six score bars are useful, but they should show what contributed.

Example:

```text
Damage +19
- +9% attack speed
- no flat cold/physical damage
```

Or:

```text
Resistance +20
- +20% Fire Resistance
```

---

### 8. Add “Keep / Replace / Future / Vendor” action labels
The verdict should be actionable, not just numerical.

Suggested verdicts:

```text
Equip now
Keep equipped item
Sidegrade / test in-game
Future item — blocked by level/stat
Stash for later
Vendor/sell
```

---

### 9. Add confidence level
Some comparisons are straightforward, while others need in-game testing.

Example:

```text
Confidence: High — copied item loses major damage stats.
Confidence: Medium — copied item trades damage for resistance.
Confidence: Low — current gear affixes are incomplete from pobb.in.
```

This is useful when the parser has names but not full affixes.

---

### 10. Add “Why accuracy/crit may not matter yet” warnings
For leveling Ice Shot Deadeye, crit and accuracy can be useful, but they should not automatically beat flat damage/resists.

Example warnings:

```text
Accuracy is lower priority because hit chance is already high.
Crit damage is not enough by itself unless crit chance/scaling is also strong.
```

---

## Priority 3 — Health Report Improvements

### 11. Add Act/Progress checkpoint logic
The tool should change advice based on campaign progress.

Suggested stages:

```text
Act 1: damage, movement speed, basic attributes
Act 2: attributes, life, early resists
Act 3: resists and life become priority
Cruel / later campaign: push toward capped elemental resists
Early maps: cap elemental resists and improve life/eHP
```

For Act 3, the report should strongly prefer fixing negative Fire/Lightning over small DPS upgrades.

---

### 12. Add resistance priority table
The current gap section is useful; make it more visual and sortable.

Example:

```text
Resistance | Current | To 0% | To 50% | To 75% | Priority
Lightning  | -33%    | +33   | +83    | +108   | Critical
Fire       | -9%     | +9    | +59    | +84    | Critical
Cold       | 43%     | +0    | +7     | +32    | Improve soon
Chaos      | 0%      | +0    | +50    | +75    | Later
```

---

### 13. Improve weakest-slot explanations
Instead of only saying “add resistance,” explain why the slot is weak.

Example:

```text
Ring 2 is weak because rings are your best place to fix Lightning/Fire resistance, but this one has little defensive value.
```

---

### 14. Separate “damage upgrades” from “survival upgrades”
Health report should split next actions:

```text
Survival upgrades:
1. Ring with Lightning + Fire resistance
2. Belt with life + resistance
3. Body armor with life + resistance

Damage upgrades:
1. Gloves with attack speed / flat cold or physical damage
2. Quiver with flat damage and bow/projectile damage
3. Bow with higher physical/cold attack damage
```

This prevents the report from mixing priorities.

---

### 15. Improve full gear import summary
After pobb.in import, show whether the gear import is complete.

Example:

```text
pobb.in import quality:
- Character stats: imported
- Equipped gear names: imported
- Full item affixes: imported
- Attributes: imported
- Final resists: imported
```

If full affixes are missing, warn that overlay comparisons may be lower confidence.

---

## Priority 4 — AI Coach Improvements

### 16. Make AI Coach use structured context
The AI should receive a compact JSON summary instead of raw text only.

Include:
- copied item parsed stats
- equipped item parsed stats
- category deltas
- pobb.in final stats
- current urgent build needs
- selected guide stage priorities
- player level/attributes

Ask AI to return structured output:

```json
{
  "verdict": "Keep equipped item",
  "summary": "The copied quiver gains attack speed but loses key flat attack damage.",
  "topReasons": ["..."],
  "nextAction": "Keep Oblivion Quill and look for Lightning/Fire resistance on rings or belt."
}
```

---

### 17. Add AI “short answer” mode
The overlay should default to a short answer for readability.

Example:

```text
Keep your current quiver. This one has attack speed, but it loses flat damage and does not fix your resists.
```

A longer explanation can stay in the full compare panel.

---

### 18. Add AI provider/model test details
The Test AI button should show:

```text
Gemini OK — gemini-3.5-flash
OpenAI OK — gpt-5.4-nano
```

If it fails, show a useful reason:
- missing API key
- invalid model
- network error
- rate limit
- bad JSON response

---

## Priority 5 — Developer Workflow / GitHub

### 19. Add GitHub Actions build workflow
Build Windows artifacts automatically on push or release tag.

Suggested workflow:

```text
.github/workflows/build.yml
- checkout
- setup node
- npm ci
- npm run check
- npm run build-win
- upload artifact
```

---

### 20. Add release checklist
Create `RELEASE_CHECKLIST.md`:

```text
- npm run check passes
- settings opens
- .build import works
- pobb.in import works
- normal/magic/rare/unique item overlay works
- Set as equipped works
- AI test works
- Windows build created
```

---

### 21. Add lightweight parser tests
A small test script would prevent regressions.

Suggested file:

```text
scripts/test-parser.js
```

Test cases:
- magic quiver
- rare quiver
- belt with charm slots
- charm
- flask
- normal gear
- pobb.in decoded gear block

Run with:

```bash
npm run test:parser
```

---

## Near-Term Suggested Roadmap

### v2.1
- Fix guide name/stage preservation
- Add urgent build needs strip to overlay
- Improve item won/lost explanations
- Lower accuracy value if hit chance is already high

### v2.2
- Add resistance priority table
- Add separate survival vs damage upgrade sections
- Improve Ring 1/Ring 2 and utility display
- Add parser regression tests

### v2.3
- Improve AI structured output
- Add short AI coach mode
- Add GitHub Actions build workflow
- Add release checklist

## Current Gameplay Context Used for Tuning

Current Ice Shot Deadeye imported from pobb.in around level 47:

```text
Fire: -9%
Cold: 43%
Lightning: -33%
Chaos: 0%
Life/eHP: modest for level
```

For this state, the coach should heavily favor:

```text
1. Lightning resistance
2. Fire resistance
3. Cold resistance
4. Life/eHP
5. Damage upgrades after resist problems improve
```

Preferred gear slots to solve defenses:

```text
Rings
Belt
Body Armor
Helmet
Gloves
Boots
Amulet
```

Weapon and quiver should remain mostly damage-focused unless a replacement also fixes resistances without losing meaningful damage.
