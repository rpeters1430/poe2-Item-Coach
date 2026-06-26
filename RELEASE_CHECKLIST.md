# PoE2 Item Coach — Release Checklist

Complete these checks before each release. All items should pass before tagging a version.

## Code quality

- [ ] `npm run check` passes (all .js files pass syntax check)
- [ ] `npm run test:parser` passes (all parser regression cases pass)

## Core overlay

- [ ] Settings window opens from tray icon
- [ ] Settings saves successfully (tray shows updated state)
- [ ] Overlay appears above PoE2 in Windowed Fullscreen mode
- [ ] Overlay does not appear on the taskbar while game is active

## Build import

- [ ] `.build` folder import loads all guide stages correctly
- [ ] `.build` file import loads a single stage correctly
- [ ] Stage label shows correctly (e.g. "Level 42-59", not "Levelin")
- [ ] Mobalytics guide text import fills stages and priorities
- [ ] pobb.in URL import fills player stats, resistances, and gear names
- [ ] After pobb.in import, "Import quality" checklist shows correct checkmarks/warnings
- [ ] Guide identity is preserved after pobb.in import (profile name not overwritten)

## Clipboard overlay

- [ ] Ctrl+C on a Normal item triggers the overlay
- [ ] Ctrl+C on a Rare item triggers the overlay
- [ ] Ctrl+C on a Unique item triggers the overlay
- [ ] Ctrl+C on non-item text hides the overlay
- [ ] Escape key dismisses the overlay (does not fire when overlay is hidden)
- [ ] "Set as equipped" button updates the saved gear slot correctly
- [ ] Overlay position persists after dragging and re-opening

## Health report

- [ ] Paste gear → Run report generates correctly
- [ ] Resistance gap table shows correct colors (red/yellow/green) per resistance
- [ ] "Survival upgrades" and "Damage upgrades" sections are split correctly
- [ ] Weakest slots show slot-specific advice (not just generic text)
- [ ] Act/Campaign progress dropdown changes the resistance advice urgency
- [ ] Export report text can be copied to clipboard

## Comparison / scoring

- [ ] Overlay comparison shows "Why it won/lost" top gains/losses
- [ ] Accuracy modifier reduces accuracy value when hit chance >= 95%
- [ ] Resist-emergency banner appears when Fire/Lightning are negative
- [ ] "Urgent build needs" strip shows correct uncapped resistances
- [ ] Action label verdict shows (Equip now / Sidegrade / Vendor / etc.)
- [ ] Confidence level indicator shows (High / Medium / Low)

## AI Coach

- [ ] Gemini Test AI returns a valid response with model name + token count
- [ ] OpenAI Test AI returns a valid response with model name + token count
- [ ] Claude Test AI returns a valid response with model name + token count
- [ ] AI short summary shown in overlay; "Show full analysis" button toggles details
- [ ] Missing API key shows a clear error (not a generic failure)

## Distribution

- [ ] Windows NSIS installer builds without error (`npm run build-win`)
- [ ] Portable .exe builds without error (`npm run build-win-portable`)
- [ ] NSIS installer runs and app launches correctly
- [ ] Portable .exe runs without installation
- [ ] Windows SmartScreen bypass is documented in README.md
