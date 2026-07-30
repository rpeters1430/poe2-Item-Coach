# Safe Update Workflow

Do not run `npm audit fix --force` for routine updates. It can jump Electron/electron-builder major versions and break the app.

## Normal code update

If you already ran `npm install` once and the dependencies did not change:

```powershell
# replace/pull only the project files, keep node_modules
npm run check
npm start
```

## Fresh install only

Use this only on a new clone/folder or if `package.json` / `package-lock.json` changes:

```powershell
npm run setup
npm start
```

`npm run setup` runs `npm install`, then `npm approve-scripts --all` (approves Electron's install scripts — npm 11+ blocks these until reviewed), then `npm run check`. You should not need to approve scripts again unless you delete `node_modules` or dependencies change. On npm versions that predate `approve-scripts`, that step is skipped automatically and setup continues.

## Audit

Use `npm audit` to inspect issues. Do not use `npm audit fix --force` unless you intentionally want to test major dependency upgrades.
