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
npm install
npm approve-scripts
npm run check
npm start
```

Approve Electron-related scripts when prompted. You should not need to approve them again unless you delete `node_modules` or dependencies change.

## Audit

Use `npm audit` to inspect issues. Do not use `npm audit fix --force` unless you intentionally want to test major dependency upgrades.
