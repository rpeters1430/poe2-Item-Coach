# Security Notes

PoE2 Gear Coach is designed as a lower-risk, clipboard-first personal tool.

## What the app does

- Watches the clipboard for item text that begins with `Item Class:`.
- Shows an Electron overlay with rule-based gear advice.
- Optionally sends a compact report to the configured AI provider when you click an AI button.

## What the app does not do

- Does not read Path of Exile 2 memory.
- Does not inject into the game process.
- Does not automate clicks, keypresses, buying, selling, or equipping gear.
- Does not modify game files.
- Does not use OCR or screen scraping.

## API key storage

AI API keys are stored locally in Electron `userData` as `ai-settings.json` and are not committed to the project. The `.gitignore` excludes common secret files and runtime data.

Do not paste or commit real API keys into source files, `.build` files, reports, issues, or screenshots.

## Sharing reports

Exported health reports intentionally do not include API keys. They may include character/build/item text, so review reports before sharing publicly.

## Policy note

No third-party tool can guarantee zero policy risk. This project intentionally avoids memory reading, injection, automation, and game-file modification. Use at your own discretion.
