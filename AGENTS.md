# Repository Guidelines

## Project Structure & Module Organization

This is an Electron desktop overlay written in CommonJS JavaScript. Application code lives in `src/`: `main.js` owns Electron lifecycle and windows; `preload.js` exposes IPC; renderer behavior lives in `overlay-renderer.js`, `app.js`, and the HTML/CSS files. Parsing, build knowledge, PoB import, modifier data, and recommendations have focused modules. Icons are under `src/assets/`, sample `.build` files under `src/sample-builds/`, documentation images under `docs/`, and maintenance/test scripts under `scripts/`. Generated packages belong in `dist/` and must not be committed.

## Build, Test, and Development Commands

- `npm run setup` installs dependencies and performs initial validation.
- `npm start` launches the Electron app from source.
- `npm run check` runs Node syntax checks across core JavaScript modules.
- `npm test` runs syntax validation and every script-based test suite.
- `npm run test:parser` (or another `test:*` script) runs one focused suite.
- `npm run build-win`, `build-mac`, or `build-linux` creates platform packages in `dist/`.
- `npm run fetch-mods` refreshes PoE2DB modifier data; review changes carefully.

Use Node.js 18 or newer. CI currently builds releases with Node 20.

## Coding Style & Naming Conventions

Match the surrounding plain-JavaScript style: two-space indentation, double-quoted strings, semicolons, trailing commas in multiline structures, and `const`/`let` rather than `var`. Use `camelCase` for variables and functions, `UPPER_SNAKE_CASE` for constants, and kebab-case filenames such as `recommendation-engine.js`. Keep Electron main-process, preload, and renderer responsibilities separate. There is no configured formatter or linter, so run `npm run check` before committing and avoid unrelated formatting churn.

## Testing Guidelines

Tests are standalone Node scripts in `scripts/test-*.js`, using explicit cases and nonzero exit codes. Add regression cases near the affected feature and name them descriptively (for example, `Rare belt (no Item Class)`). Run the focused suite while developing, then `npm test` before opening a pull request. No numeric coverage threshold is enforced; prioritize parser edge cases, recommendation outcomes, and import compatibility.

## Commit & Pull Request Guidelines

Recent history mixes concise imperative summaries with Conventional Commit prefixes, for example `feat: update build process and documentation` and `ci: harden Windows release workflow (#8)`. Prefer a short, imperative subject with an optional scope/prefix; include an issue or PR number when relevant. Pull requests should explain user-visible behavior, list verification commands, link related issues, and include screenshots for overlay or settings UI changes. Never commit `.env`, API keys, `session.json`, `ai-settings.json`, `node_modules/`, or build outputs.
