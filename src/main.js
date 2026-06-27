/**
 * PoE2 Gear Coach Overlay — Main Process (src/main.js)
 *
 * Responsibilities:
 *   1. Create a transparent, always-on-top overlay window for the popup result.
 *   2. Create a normal settings/config window (loaded on demand).
 *   3. Watch the clipboard for PoE2 item text (triggered by Ctrl+C in-game).
 *   4. Register a global hotkey (Ctrl+Shift+G) as a manual trigger fallback.
 *   5. Send clipboard text to the overlay renderer via IPC.
 *   6. Manage a system tray icon with a menu to open settings and quit.
 */

const {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  ipcMain,
  Tray,
  Menu,
  screen,
  nativeImage,
  shell,
  net,
  session,
} = require("electron");
const path = require("path");

// ─── State ───────────────────────────────────────────────────────────────────

let overlayWindow = null;   // Transparent popup shown near cursor
let settingsWindow = null;  // Full settings / build-import UI
let tray = null;
let clipboardPoller = null;
let lastClipboardText = "";

// How often we check the clipboard (ms). Lower = more responsive, higher = less CPU.
const CLIPBOARD_POLL_MS = 400;

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createOverlayWindow();
  createTray();
  startClipboardWatcher();
  registerHotkeys();

  // Apply startup settings from session
  try {
    const session = loadSession();
    if (session && typeof session.startWithWindows === "boolean") {
      app.setLoginItemSettings({ openAtLogin: session.startWithWindows, openAsHidden: true });
    }
  } catch (err) {
    console.error("Failed to load startup setting from session:", err);
  }

  app.on("activate", () => {
    // macOS: re-open settings window on dock click
    if (BrowserWindow.getAllWindows().length === 0) createSettingsWindow();
  });
});

app.on("window-all-closed", () => {
  // Keep running in tray on all platforms (including macOS)
  // Only quit when explicitly triggered from the tray menu.
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  stopClipboardWatcher();
});

// ─── Overlay window ───────────────────────────────────────────────────────────

function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 700,
    height: 720,
    // Start off-screen; we move it near the cursor when an item is detected.
    x: -9999,
    y: -9999,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    focusable: false,       // Don't steal focus from the game
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  overlayWindow.loadFile(path.join(__dirname, "overlay.html"));
  overlayWindow.setAlwaysOnTop(true, "screen-saver", 1);
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Hide when clicked outside (the renderer sends this message)
  ipcMain.on("overlay:dismiss", () => hideOverlay());

  // Settings button inside the overlay opens the settings window
  ipcMain.on("overlay:open-settings", () => createSettingsWindow());

  // Renderer requests the current saved session/profile data
  ipcMain.handle("session:load", () => loadSession());

  // Dynamic window resizing
  ipcMain.on("overlay:resize", (event, { width, height }) => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      const bounds = overlayWindow.getBounds();
      overlayWindow.setBounds({
        x: bounds.x,
        y: bounds.y,
        width: Math.round(width),
        height: Math.round(height)
      });
    }
  });

  // Toggle click-through (HUD mode)
  ipcMain.on("overlay:set-click-through", (event, enabled) => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.setIgnoreMouseEvents(enabled, { forward: true });
    }
  });

  overlayWindow.on("blur", () => {
    // Only auto-hide if the overlay is focusable (it normally isn't)
  });
}

function showOverlay(itemText) {
  if (!overlayWindow) return;

  const session = loadSession();
  let wx, wy;
  let useSaved = false;

  if (session && session.overlayPos) {
    const { x, y } = session.overlayPos;
    // Check if the saved position fits on any active display
    const display = screen.getDisplayMatching({ x, y, width: 700, height: 720 });
    if (display) {
      wx = x;
      wy = y;
      useSaved = true;
    }
  }

  const cursor = screen.getCursorScreenPoint();
  const display = useSaved
    ? (screen.getDisplayMatching({ x: wx, y: wy, width: 700, height: 720 }) || screen.getDisplayNearestPoint(cursor))
    : screen.getDisplayNearestPoint(cursor);
  const { width: sw, height: sh, x: sx, y: sy } = display.workArea;
  const [ow, oh] = [700, 720];

  if (!useSaved) {
    // Prefer to show to the right and below cursor; flip if near screen edge.
    wx = cursor.x + 24;
    wy = cursor.y + 24;
    if (wx + ow > sx + sw) wx = cursor.x - ow - 8;
    if (wy + oh > sy + sh) wy = cursor.y - oh - 8;
  }

  // Clamping: Keep the window fully visible on the current display work area
  if (wx < sx) wx = sx;
  if (wx + ow > sx + sw) wx = sx + sw - ow;
  if (wy < sy) wy = sy;
  if (wy + oh > sy + sh) wy = sy + sh - oh;

  overlayWindow.setPosition(Math.round(wx), Math.round(wy));
  overlayWindow.webContents.send("item:detected", { itemText, session });
  
  overlayWindow.setSkipTaskbar(true);
  overlayWindow.showInactive(); // Show without stealing focus

  if (!globalShortcut.isRegistered("Escape")) {
    globalShortcut.register("Escape", () => hideOverlay());
  }
}

function hideOverlay() {
  if (globalShortcut.isRegistered("Escape")) {
    globalShortcut.unregister("Escape");
  }
  if (overlayWindow && overlayWindow.isVisible()) {
    try {
      const bounds = overlayWindow.getBounds();
      // Only save if it's not the initial off-screen coordinates (-9999)
      if (bounds.x > -9000 && bounds.y > -9000) {
        const session = loadSession() || {};
        session.overlayPos = { x: bounds.x, y: bounds.y };
        saveSession(session);
      }
    } catch (err) {
      console.error("Failed to save overlay position:", err);
    }
    overlayWindow.hide();
  }
}

// ─── Settings window ──────────────────────────────────────────────────────────

function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "PoE2 Gear Coach — Settings & Build Import",
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  settingsWindow.loadFile(path.join(__dirname, "settings.html"));
  settingsWindow.once("ready-to-show", () => settingsWindow.show());
  settingsWindow.on("closed", () => { settingsWindow = null; });

  // Save session from the settings window
  ipcMain.on("session:save", (_event, data) => saveSession(data));
}

// ─── Clipboard watcher ────────────────────────────────────────────────────────

/**
 * PoE2 copies item text to the clipboard when you press Ctrl+C on a hovered item.
 * Rare/magic items usually include "Item Class:". Normal items can be more minimal
 * and may start at "Rarity: Normal", so the detector accepts either form.
 * We poll every CLIPBOARD_POLL_MS and fire when we see a new PoE2 item.
 */
const CLIPBOARD_RETRY_MS = 80; // short retry after a transient Windows clipboard lock

function scheduleClipboardPoll(delayMs = CLIPBOARD_POLL_MS) {
  clipboardPoller = setTimeout(() => {
    try {
      const text = clipboard.readText();
      if (text !== lastClipboardText) {
        lastClipboardText = text;
        if (isPoe2Item(text)) {
          showOverlay(text);
        } else {
          hideOverlay();
        }
      }
      scheduleClipboardPoll(CLIPBOARD_POLL_MS); // normal cadence on success
    } catch (_err) {
      scheduleClipboardPoll(CLIPBOARD_RETRY_MS); // short retry on Windows clipboard lock
    }
  }, delayMs);
}

function startClipboardWatcher() {
  lastClipboardText = (() => { try { return clipboard.readText(); } catch { return ""; } })();
  scheduleClipboardPoll();
}

function stopClipboardWatcher() {
  if (clipboardPoller) {
    clearTimeout(clipboardPoller);
    clipboardPoller = null;
  }
}

/**
 * Quick check: does this clipboard text look like a PoE2 item tooltip?
 * Rare/magic/unique items often begin with Item Class, but normal gear may only
 * expose Rarity + name + requirements/item level. Keep this broad enough to
 * pop up for white/normal gear, but strict enough to ignore ordinary text.
 */
function isPoe2Item(text) {
  if (!text || text.length < 12) return false;
  const trimmed = String(text).trimStart();
  const hasRarity = /^Rarity:\s*(Normal|Magic|Rare|Unique|Currency|Gem)/im.test(trimmed);
  const hasItemClass = /^Item Class:/im.test(trimmed);
  const hasItemSignals = /(^|\n)(Requires:|Item Level:|Quality:|Armour:|Evasion:|Energy Shield:|Physical Damage:|Elemental Damage:|Critical Hit Chance:)/im.test(trimmed);
  const hasSeparator = trimmed.includes("--------");

  if (hasItemClass && (hasSeparator || hasRarity || hasItemSignals)) return true;
  if (hasRarity && (hasSeparator || hasItemSignals)) return true;
  return false;
}

// ─── Global hotkeys ───────────────────────────────────────────────────────────

function registerHotkeys() {
  // Ctrl+Shift+G — manual trigger: re-evaluate whatever is currently in the clipboard
  globalShortcut.register("CommandOrControl+Shift+G", () => {
    const text = clipboard.readText();
    if (isPoe2Item(text)) {
      showOverlay(text);
    }
  });
}

// ─── Session persistence ──────────────────────────────────────────────────────
// We use a simple JSON file next to the app for session data so it survives restarts.

const fs = require("fs");
const SESSION_PATH = path.join(app.getPath("userData"), "session.json");

function saveSession(data) {
  try {
    fs.writeFileSync(SESSION_PATH, JSON.stringify(data, null, 2), "utf8");
    if (data && typeof data.startWithWindows === "boolean") {
      app.setLoginItemSettings({ openAtLogin: data.startWithWindows, openAsHidden: true });
      updateTrayStartupCheckbox(data.startWithWindows);
    }
  } catch (err) {
    console.error("Could not save session:", err.message);
  }
}

function loadSession() {
  try {
    if (fs.existsSync(SESSION_PATH)) {
      return JSON.parse(fs.readFileSync(SESSION_PATH, "utf8"));
    }
  } catch (_err) {
    // Corrupt or missing — start fresh
  }
  return null;
}


// ─── poe.ninja price cache ────────────────────────────────────────────────────
// Prices are fetched once and cached in userData for 2 hours to avoid hammering the API.

const PRICES_CACHE_PATH = path.join(app.getPath("userData"), "prices.json");
let _pricesMemCache = null;
let _pricesMemFetched = 0;

ipcMain.handle("prices:get", async (_event, { type, league } = {}) => {
  return fetchNinjaPrices(type || "UniqueWeapon", league || "Standard");
});

async function fetchNinjaPrices(type, league) {
  const cacheKey = `${type}:${league}`;
  const now = Date.now();
  const TWO_HOURS = 2 * 60 * 60 * 1000;

  // In-memory cache
  if (_pricesMemCache?.[cacheKey] && now - _pricesMemFetched < TWO_HOURS) {
    return { ok: true, prices: _pricesMemCache[cacheKey], cached: true };
  }

  // Disk cache
  if (!_pricesMemCache) {
    try {
      if (fs.existsSync(PRICES_CACHE_PATH)) {
        const disk = JSON.parse(fs.readFileSync(PRICES_CACHE_PATH, "utf8"));
        if (disk?.fetched && now - disk.fetched < TWO_HOURS) {
          _pricesMemCache  = disk.data || {};
          _pricesMemFetched = disk.fetched;
          if (_pricesMemCache[cacheKey]) {
            return { ok: true, prices: _pricesMemCache[cacheKey], cached: true };
          }
        }
      }
    } catch { /* stale or missing cache */ }
    _pricesMemCache = {};
  }

  try {
    const url = `https://poe.ninja/api/data/itemoverview?league=${encodeURIComponent(league)}&type=${encodeURIComponent(type)}&language=en`;
    const json = JSON.parse(await httpsTextRequest(url, {
      method: "GET",
      headers: { "user-agent": "PoE2GearCoach/2.0 overlay personal use", "accept": "application/json" },
    }));

    const priceMap = {};
    for (const entry of (json.lines || [])) {
      if (entry.name) {
        priceMap[entry.name.toLowerCase()] = {
          name: entry.name,
          chaos: Math.round(entry.chaosValue || 0),
          divine: entry.divineValue ? Number(entry.divineValue.toFixed(2)) : null,
          variant: entry.variant || null,
        };
      }
    }

    _pricesMemCache[cacheKey] = priceMap;
    _pricesMemFetched = now;
    try {
      fs.writeFileSync(PRICES_CACHE_PATH, JSON.stringify({ fetched: now, data: _pricesMemCache }, null, 2), "utf8");
    } catch { /* non-fatal */ }

    return { ok: true, prices: priceMap };
  } catch (err) {
    return { ok: false, error: String(err?.message || err), prices: _pricesMemCache[cacheKey] || {} };
  }
}

// ─── PoE2 Trade API ──────────────────────────────────────────────────────────
// Fetches live listings from the official trade site and returns price data.
// Unique items fall back to poe.ninja (already cached). Rare items hit the
// trade API: we fetch the stat-ID registry once (24 h disk cache), match mod
// lines against it, then POST a search and fetch the first 5 listings.
//
// Cloudflare protection: pathofexile.com uses Cloudflare. Node's https module
// gets blocked due to TLS fingerprinting. We use two mitigations:
//   1. Electron's net module — uses Chromium's networking stack (correct TLS)
//   2. Session warm-up — load the trade site in a hidden BrowserWindow once per
//      session so Cloudflare issues a cf_clearance cookie; net.request with
//      useSessionCookies:true then carries it on every API call.

let _tradeSessionWarmed = false;

async function warmTradeSession() {
  if (_tradeSessionWarmed) return;
  await new Promise((resolve) => {
    const win = new BrowserWindow({
      show: false, width: 1, height: 1,
      webPreferences: { contextIsolation: true, nodeIntegration: false },
    });
    const done = () => { _tradeSessionWarmed = true; if (!win.isDestroyed()) win.destroy(); resolve(); };
    win.webContents.once("did-finish-load", done);
    win.webContents.once("did-fail-load", done);
    setTimeout(done, 18000); // give up after 18 s
    win.loadURL("https://www.pathofexile.com/trade2/search/Standard").catch(done);
  });
}

// net.request() uses Chromium networking (proper TLS + session cookies),
// unlike Node's https which Cloudflare rejects on TLS fingerprint alone.
function netRequest(urlString, { method = "GET", headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const req = net.request({ method, url: urlString, redirect: "follow", useSessionCookies: true });
    req.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36");
    req.setHeader("Accept", "application/json, */*");
    req.setHeader("Accept-Language", "en-US,en;q=0.9");
    req.setHeader("Sec-Fetch-Dest", "empty");
    req.setHeader("Sec-Fetch-Mode", "cors");
    req.setHeader("Sec-Fetch-Site", "same-origin");
    for (const [k, v] of Object.entries(headers)) req.setHeader(k, v);
    if (body) {
      const payload = typeof body === "string" ? body : JSON.stringify(body);
      req.setHeader("Content-Type", "application/json");
      req.setHeader("Content-Length", String(Buffer.byteLength(payload)));
      req.write(payload);
    }
    const chunks = [];
    req.on("response", res => {
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 200)}`));
        } else if (raw.trimStart().startsWith("<")) {
          // Cloudflare returned an HTML challenge page instead of JSON
          reject(new Error("Cloudflare challenge — session not yet warm"));
        } else {
          resolve(raw);
        }
      });
      res.on("error", reject);
    });
    req.on("error", reject);
    req.end();
  });
}

const TRADE_STATS_PATH = path.join(app.getPath("userData"), "trade-stats.json");
let _tradeStatsCache = null;

function normalizeStatText(text) {
  return text
    .replace(/[\d]+\.?[\d]*/g, "#")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Cache version — bump to force-expire old stats caches that may have wrong IDs
const TRADE_STATS_VER = 2;

async function getTradeStats(forceRefresh = false) {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  if (!forceRefresh && _tradeStatsCache && now - _tradeStatsCache.fetched < DAY) {
    return _tradeStatsCache.map;
  }
  if (!forceRefresh) {
    try {
      if (fs.existsSync(TRADE_STATS_PATH)) {
        const disk = JSON.parse(fs.readFileSync(TRADE_STATS_PATH, "utf8"));
        if (disk?.v === TRADE_STATS_VER && disk?.fetched && now - disk.fetched < DAY) {
          _tradeStatsCache = { map: new Map(Object.entries(disk.map)), fetched: disk.fetched };
          return _tradeStatsCache.map;
        }
      }
    } catch { /* stale or missing — fall through to fetch */ }
  }

  const raw = await netRequest("https://www.pathofexile.com/api/trade2/data/stats", {
    headers: { "Referer": "https://www.pathofexile.com/trade2/search/Standard" },
  });
  const data = JSON.parse(raw);
  const map = new Map();
  // Only index Explicit stat IDs — implicit/pseudo/monster IDs cause "Invalid id" in search
  for (const cat of (data.result || [])) {
    if (cat.label !== "Explicit") continue;
    for (const entry of (cat.entries || [])) {
      if (entry.text && entry.id) map.set(normalizeStatText(entry.text), entry.id);
    }
  }
  _tradeStatsCache = { map, fetched: now };
  try { fs.writeFileSync(TRADE_STATS_PATH, JSON.stringify({ v: TRADE_STATS_VER, fetched: now, map: Object.fromEntries(map) }), "utf8"); } catch {}
  return map;
}

function buildTradeFilters(modLines, statsMap) {
  const filters = [];
  for (const line of modLines) {
    const statId = statsMap.get(normalizeStatText(line));
    if (!statId) continue;
    const firstNum = parseFloat(line.match(/[\d]+\.?[\d]*/)?.[0]);
    // Omit value entirely if no number found; don't send empty {} which some API versions reject
    const filter = { id: statId, disabled: false };
    if (Number.isFinite(firstNum)) filter.value = { min: Math.floor(firstNum * 0.9) };
    filters.push(filter);
  }
  return filters;
}

const SLOT_TO_NINJA_TYPE = {
  weapon: "UniqueWeapon", offhand: "UniqueArmour", quiver: "UniqueWeapon",
  helmet: "UniqueArmour", body: "UniqueArmour", gloves: "UniqueArmour", boots: "UniqueArmour",
  ring: "UniqueAccessory", amulet: "UniqueAccessory", belt: "UniqueAccessory",
  flask: "UniqueFlask", jewel: "UniqueJewel",
};

const SLOT_TO_TRADE_CATEGORY = {
  offhand: "armour.shield", quiver: "weapon.quiver",
  helmet: "armour.helmet", body: "armour.chest", gloves: "armour.gloves", boots: "armour.boots",
  ring: "accessory.ring", amulet: "accessory.amulet", belt: "accessory.belt",
};

ipcMain.handle("trade:price-check", async (_event, { rarity, name, slot, mods } = {}) => {
  const rarityL = (rarity || "").toLowerCase();
  const league  = "Standard";
  const baseUrl = `https://www.pathofexile.com/trade2/search/${league}`;

  // Warm up Cloudflare session on first use (idempotent — no-op after first call)
  try { await warmTradeSession(); } catch { /* non-fatal */ }

  try {
    // Unique items: reuse poe.ninja cache
    if (rarityL === "unique") {
      const ninjaType = SLOT_TO_NINJA_TYPE[slot?.toLowerCase()] || "UniqueArmour";
      const pr = await fetchNinjaPrices(ninjaType, league);
      if (pr.ok && pr.prices) {
        const key   = (name || "").toLowerCase();
        const entry = pr.prices[key]
          || Object.values(pr.prices).find(v => v.name?.toLowerCase() === key);
        if (entry) {
          return { ok: true, rarity: "unique", name: entry.name, price: entry.chaos, divine: entry.divine, tradeUrl: baseUrl };
        }
      }
      return { ok: false, rarity: "unique", name, error: "Not found in poe.ninja", tradeUrl: baseUrl };
    }

    // Rare / Magic: live trade search
    let statsMap;
    try { statsMap = await getTradeStats(); }
    catch (err) { return { ok: false, rarity: rarityL, error: `Could not load trade stats: ${err.message}`, tradeUrl: baseUrl }; }

    const filters = buildTradeFilters(mods || [], statsMap);
    if (!filters.length) {
      return { ok: false, rarity: rarityL, error: "No mods matched trade stat IDs — open trade site to search manually.", tradeUrl: baseUrl };
    }

    const category   = SLOT_TO_TRADE_CATEGORY[slot?.toLowerCase()] || null;
    const searchBody = {
      query: {
        status: { option: "online" },
        stats: [{ type: "and", filters: filters.slice(0, 3) }],
        ...(category ? { filters: { type_filters: { filters: { category: { option: category } } } } } : {}),
      },
      sort: { price: "asc" },
    };

    let searchData;
    try {
      const raw = await netRequest(`https://www.pathofexile.com/api/trade2/search/${league}`, {
        method: "POST",
        headers: { "Origin": "https://www.pathofexile.com", "Referer": baseUrl },
        body: searchBody,
      });
      searchData = JSON.parse(raw);
      // Surface any API-level error embedded in a 200 response
      if (searchData?.error) throw new Error(searchData.error.message || JSON.stringify(searchData.error));
    } catch (err) {
      const msg = String(err.message || "");
      // "Invalid id" means our stat IDs are stale — wipe cache so next click re-fetches
      if (/invalid.id/i.test(msg) || /invalid.stat/i.test(msg)) {
        _tradeStatsCache = null;
        try { fs.unlinkSync(TRADE_STATS_PATH); } catch {}
        return { ok: false, rarity: rarityL, error: "Stat IDs were stale — cache cleared. Click Trade Value again to retry.", tradeUrl: baseUrl };
      }
      return { ok: false, rarity: rarityL, error: `Trade search failed: ${msg}`, tradeUrl: baseUrl };
    }

    const { id: queryId, result: ids, total } = searchData;
    const queryUrl = queryId ? `${baseUrl}/${queryId}` : baseUrl;

    if (!ids?.length) {
      return { ok: true, rarity: rarityL, listings: [], total: total || 0, tradeUrl: queryUrl };
    }

    // Fetch first 5 listing prices
    let listings = [];
    try {
      const fetchRaw = await netRequest(
        `https://www.pathofexile.com/api/trade2/fetch/${ids.slice(0, 5).join(",")}?query=${queryId}&realm=pc`,
        { headers: { "Referer": queryUrl } }
      );
      listings = (JSON.parse(fetchRaw).result || []).map(r => {
        const p = r.listing?.price;
        if (!p) return null;
        return { price: `${p.amount} ${p.currency}`, account: r.listing?.account?.name || "?", indexed: r.listing?.indexed };
      }).filter(Boolean);
    } catch { /* non-fatal: return whatever we have */ }

    return { ok: true, rarity: rarityL, listings, total: total || 0, tradeUrl: queryUrl };

  } catch (err) {
    return { ok: false, error: err.message, tradeUrl: baseUrl };
  }
});

ipcMain.handle("trade:open", async (_event, url) => {
  const safe = String(url || "");
  if (/^https:\/\/www\.pathofexile\.com\/trade2\//.test(safe)) {
    shell.openExternal(safe);
  }
});

// ─── pobb.in import ─────────────────────────────────────────────────────────
// Fetching happens in the main process so the settings renderer is not blocked
// by browser CSP/CORS. We only parse public pobb.in page data and keep it local.
ipcMain.handle("pobb:import", async (_event, input) => importPobb(input));

async function importPobb(input) {
  const normalized = normalizePobbInput(input);
  if (!normalized?.url) return { ok: false, error: "Paste a pobb.in URL or build id." };

  const { url, id } = normalized;
  const userAgent = "PoE2GearCoach/0.27 personal overlay (contact: local-user)";
  let rawResult = null;
  let htmlError = null;

  // Prefer the public raw endpoint first. It avoids Cloudflare/worker HTML errors
  // and gives us the real PoB export code for equipped gear.
  if (id) {
    try {
      const raw = await httpsTextRequest(`https://pobb.in/pob/${id}/raw`, {
        method: "GET",
        headers: { "user-agent": userAgent, "accept": "text/plain,*/*" }
      });
      rawResult = parsePobbRaw(raw, url);
    } catch (err) {
      rawResult = { rawError: cleanHttpError(err) };
    }
  }

  // Then try the normal preview page for final character stats/resistances.
  // If pobb.in returns a 1101/worker error, keep the raw import instead of failing.
  try {
    const html = await httpsTextRequest(url, {
      method: "GET",
      headers: { "user-agent": userAgent, "accept": "text/html,*/*" }
    });
    const htmlResult = parsePobbHtml(html, url);
    return { ok: true, url, importMode: rawResult?.decodedPobOk ? "raw+preview" : "preview", ...mergePobbResults(rawResult, htmlResult) };
  } catch (err) {
    htmlError = cleanHttpError(err);
  }

  if (rawResult?.decodedPobOk || rawResult?.exportCode) {
    return {
      ok: true,
      url,
      importMode: "raw-fallback",
      importWarning: `pobb.in preview page could not be read (${htmlError}). Used /pob/${id}/raw instead. Visible final stats/resists may be missing until preview works again.`,
      ...rawResult
    };
  }

  return { ok: false, error: htmlError || rawResult?.rawError || "Could not import pobb.in build.", url };
}

function normalizePobbInput(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  const found = raw.match(/https?:\/\/pobb\.in\/([^\s/?#)]+)(?:[^\s)]*)?/i);
  if (found) {
    const id = found[1];
    return { url: `https://pobb.in/${id}`, id };
  }
  if (/^[A-Za-z0-9_-]{6,}$/.test(raw)) return { url: `https://pobb.in/${raw}`, id: raw };
  return null;
}

function cleanHttpError(err) {
  const msg = String(err?.message || err || "Unknown error").trim();
  if (/1101|Worker threw exception|Cloudflare/i.test(msg)) {
    return "pobb.in preview returned Cloudflare/worker error 1101";
  }
  return msg.replace(/\s+/g, " ").slice(0, 300);
}

function parsePobbRaw(raw, url) {
  const exportCode = String(raw || "").trim();
  const decodedPob = exportCode ? decodePobExport(exportCode) : null;
  const decodedData = decodedPob?.xml ? parseDecodedPobExport(decodedPob.xml) : null;
  const stats = decodedPob?.xml ? extractPobStatsFromXml(decodedPob.xml) : {};
  const gear = decodedData?.gear?.map(({ slot, name }) => ({ slot, name })) || [];
  return {
    name: stats?.name || "pobb.in raw imported build",
    stats: stats || {},
    gear,
    gems: decodedPob?.xml ? extractGemsFromPobXml(decodedPob.xml) : [],
    keystones: [],
    exportCode,
    equippedGearText: decodedData?.equippedGearText || "",
    decodedItemCount: decodedData?.gear?.length || 0,
    decodedPobOk: Boolean(decodedData),
    rawTextPreview: "Imported through pobb.in raw endpoint.",
    source: "pobb.in"
  };
}

function mergePobbResults(rawResult, htmlResult) {
  if (!rawResult) return htmlResult;
  if (!htmlResult) return rawResult;
  return {
    ...htmlResult,
    stats: { ...(rawResult.stats || {}), ...(htmlResult.stats || {}) },
    gear: rawResult.gear?.length ? rawResult.gear : htmlResult.gear,
    gems: htmlResult.gems?.length ? htmlResult.gems : (rawResult.gems || []),
    keystones: htmlResult.keystones || rawResult.keystones || [],
    exportCode: rawResult.exportCode || htmlResult.exportCode || "",
    equippedGearText: rawResult.equippedGearText || htmlResult.equippedGearText || "",
    decodedItemCount: rawResult.decodedItemCount || htmlResult.decodedItemCount || 0,
    decodedPobOk: Boolean(rawResult.decodedPobOk || htmlResult.decodedPobOk),
    rawTextPreview: htmlResult.rawTextPreview || rawResult.rawTextPreview || "",
  };
}

function htmlToPlainText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style[\s\S]*?<\/style>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>|<\/div>|<\/h\d>|<\/li>|<\/tr>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function uniqueStrings(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    const text = String(value || "").trim();
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

function parseNumberText(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function firstNumberAfter(label, text, fallbackText = "") {
  const source = String(text || "");
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escaped}\\s*:\\s*([+-]?\\d[\\d,]*(?:\\.\\d+)?)`, "i"));
  if (match) return parseNumberText(match[1]);
  if (fallbackText) return firstNumberAfter(label, fallbackText, "");
  return null;
}

function normalizeMinusSigns(value) {
  return String(value || "").replace(/[−–—]/g, "-");
}

function parseResistancesFrom(text, fallbackText = "") {
  const source = normalizeMinusSigns(text);
  const patterns = [
    /Resistances:\s*([+-]?\d+)%\s*[\/|]\s*([+-]?\d+)%\s*[\/|]\s*([+-]?\d+)%\s*[\/|]\s*([+-]?\d+)%/i,
    /(?:Fire|F)\s*(?:Res(?:istance)?s?)?\s*:?\s*([+-]?\d+)%[\s\S]{0,80}?(?:Cold|C)\s*(?:Res(?:istance)?s?)?\s*:?\s*([+-]?\d+)%[\s\S]{0,80}?(?:Lightning|L)\s*(?:Res(?:istance)?s?)?\s*:?\s*([+-]?\d+)%[\s\S]{0,80}?(?:Chaos|Ch)\s*(?:Res(?:istance)?s?)?\s*:?\s*([+-]?\d+)%/i,
  ];
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match) {
      return {
        fire: Number(match[1]),
        cold: Number(match[2]),
        lightning: Number(match[3]),
        chaos: Number(match[4]),
      };
    }
  }
  return fallbackText ? parseResistancesFrom(fallbackText, "") : null;
}

function extractMetaText(html) {
  const meta = [];
  for (const match of String(html || "").matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]*>/gi)) {
    meta.push(match[1]);
  }
  return htmlToPlainText(meta.join("\n"));
}

function extractKeystones(plainText) {
  const keystones = [
    "Blood Magic", "Precise Technique", "Ancestral Bond", "Acrobatics", "Iron Reflexes", 
    "Ghost Dance", "Pain Attunement", "Minion Instability", "Magebane", "Wind Dancer", 
    "Divine Shield", "Hex Master", "Perfect Agility", "Gravebind", "Solipsism", 
    "Glancing Blows", "Imbalanced Guard", "Iron Grip", "Point Blank"
  ];
  const allocated = [];
  for (const k of keystones) {
    const regex = new RegExp(`\\b${k}\\b`, "i");
    if (regex.test(plainText)) {
      // Avoid false matches like "no keystones" or "no blood magic"
      const negRegex = new RegExp(`no\\s+${k}`, "i");
      if (negRegex.test(plainText)) continue;
      allocated.push(k);
    }
  }
  return allocated;
}

function parsePobbHtml(html, url) {
  const plain = htmlToPlainText(html);
  const metaText = extractMetaText(html);
  const combinedText = `${plain}\n${metaText}`;
  const titleMatch = combinedText.match(/Level\s+(\d+)\s+([^\n]+?)(?:\n|\s+Life:)/i)
    || combinedText.match(/#\s*Level\s+(\d+)\s+([^\n]+)/i);
  const level = titleMatch ? parseInt(titleMatch[1], 10) : null;
  const name = titleMatch ? `Level ${titleMatch[1]} ${titleMatch[2].trim()}` : "pobb.in imported build";

  // pobb.in pages can contain hidden tooltip/stat fragments before the build summary.
  // Parse visible character stats from the header block between the Level title and Gear section first,
  // then fall back to the whole page. This avoids false `Life: 0%` / empty stat matches.
  const titleIndex = plain.search(/Level\s+\d+/i);
  const gearIndex = plain.search(/\bGear\b/i);
  const header = titleIndex >= 0 && gearIndex > titleIndex ? plain.slice(titleIndex, gearIndex) : plain;
  const statSource = `${header}\n${metaText}`;

  const stats = {
    level,
    life: firstNumberAfter("Life", statSource, combinedText),
    es: firstNumberAfter("ES", statSource, combinedText),
    mana: firstNumberAfter("Mana", statSource, combinedText),
    eHP: firstNumberAfter("eHP", statSource, combinedText),
    dps: firstNumberAfter("DPS", statSource, combinedText),
    speed: firstNumberAfter("Speed", statSource, combinedText),
    hitChance: firstNumberAfter("Hit Chance", statSource, combinedText),
    str: firstNumberAfter("Str", statSource, combinedText) ?? firstNumberAfter("Strength", statSource, combinedText),
    dex: firstNumberAfter("Dex", statSource, combinedText) ?? firstNumberAfter("Dexterity", statSource, combinedText),
    int: firstNumberAfter("Int", statSource, combinedText) ?? firstNumberAfter("Intelligence", statSource, combinedText),
  };
  const parsedResists = parseResistancesFrom(statSource, combinedText);
  if (parsedResists) stats.resistances = parsedResists;

  const exportCode = plain.match(/\b([A-Za-z0-9_-]{500,}=*)\b/)?.[1] || "";
  const decodedPob = exportCode ? decodePobExport(exportCode) : null;
  const decodedData = decodedPob?.xml ? parseDecodedPobExport(decodedPob.xml) : null;
  if (decodedData?.attributes) {
    for (const key of ["str", "dex", "int"]) {
      if (!stats[key] && decodedData.attributes[key]) stats[key] = decodedData.attributes[key];
    }
  }

  const altNames = uniqueStrings(Array.from(String(html).matchAll(/alt=["']([^"']+)["']/gi)).map(m => m[1]))
    .filter(name => !/image|ascendancy|thumbnail|pobb\.in/i.test(name));

  let gearNames = [];
  const gearSection = plain.match(/Gear\s+Default\s+([\s\S]*?)\s+Gems\b/i)?.[1] || "";
  if (gearSection) {
    gearNames = uniqueStrings(gearSection.split(/\n+/).map(x => x.trim()))
      .filter(line => line.length > 2 && !/^(copy|web|open|default)$/i.test(line));
  }
  if (altNames.length) gearNames = uniqueStrings([...gearNames, ...altNames]);

  const slotOrder = ["weapon", "quiver", "helmet", "body", "gloves", "boots", "amulet", "ring", "ring", "belt", "flask", "charm", "charm", "flask", "charm"];
  let gear = gearNames.slice(0, slotOrder.length).map((itemName, index) => ({ slot: slotOrder[index] || "other", name: itemName }));
  let equippedGearText = "";
  let decodedItemCount = 0;
  if (decodedData?.gear?.length) {
    gear = decodedData.gear.map(({ slot, name }) => ({ slot, name }));
    equippedGearText = decodedData.equippedGearText || "";
    decodedItemCount = decodedData.gear.length;
  }

  const gemSection = plain.match(/Gems\s+([\s\S]*?)\s+Tree Preview/i)?.[1] || "";
  const gems = uniqueStrings(gemSection.split(/\n+/).map(x => x.trim()))
    .filter(line => line.length > 2 && !/^no keystones/i.test(line))
    .slice(0, 80);

  const keystones = extractKeystones(plain);

  return {
    name,
    stats,
    gear,
    gems,
    keystones,
    exportCode,
    equippedGearText,
    decodedItemCount,
    decodedPobOk: Boolean(decodedData),
    rawTextPreview: plain.slice(0, 2000),
    source: "pobb.in"
  };
}

function decodePobExport(exportCode) {
  try {
    const zlib = require("zlib");
    let b64 = String(exportCode || "").trim().replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const buffer = Buffer.from(b64, "base64");
    const attempts = [
      () => zlib.inflateRawSync(buffer),
      () => zlib.inflateSync(buffer),
      () => zlib.gunzipSync(buffer),
      () => buffer,
    ];
    for (const attempt of attempts) {
      try {
        const xml = attempt().toString("utf8");
        if (/<(PathOfBuilding|Build|Items|Item)\b/i.test(xml)) return { xml };
      } catch (_err) {
        // Try the next decode mode.
      }
    }
  } catch (_err) {
    // Ignore decode errors; visible pobb.in parsing still works.
  }
  return null;
}

function decodeXmlEntities(text) {
  return String(text || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function parseTagAttributes(tag) {
  const attrs = {};
  for (const match of String(tag || "").matchAll(/([A-Za-z0-9_:-]+)\s*=\s*["']([^"']*)["']/g)) {
    attrs[match[1]] = decodeXmlEntities(match[2]);
  }
  return attrs;
}

function parseDecodedPobExport(xml) {
  const itemsById = new Map();
  for (const match of String(xml || "").matchAll(/<Item\b([^>]*)>([\s\S]*?)<\/Item>/gi)) {
    const attrs = parseTagAttributes(match[1]);
    const id = attrs.id || attrs.itemId || attrs.uid || String(itemsById.size + 1);
    let text = decodeXmlEntities(match[2]).replace(/\r/g, "").trim();
    if (!text || /^None$/i.test(text)) continue;
    itemsById.set(String(id), text);
  }

  const itemsTag = String(xml || "").match(/<Items\b([^>]*)>/i)?.[1] || "";
  const activeItemSet = parseTagAttributes(itemsTag).activeItemSet || "1";
  const itemSets = Array.from(String(xml || "").matchAll(/<ItemSet\b([^>]*)>([\s\S]*?)<\/ItemSet>/gi));
  let activeSet = itemSets.find(m => String(parseTagAttributes(m[1]).id || "") === String(activeItemSet)) || itemSets[0];

  const gear = [];
  if (activeSet && itemsById.size) {
    for (const slotMatch of activeSet[2].matchAll(/<Slot\b([^>]*)\/?>(?:<\/Slot>)?/gi)) {
      const attrs = parseTagAttributes(slotMatch[1]);
      const itemId = attrs.itemId || attrs.itemID || attrs.id;
      if (!itemId || itemId === "0" || !itemsById.has(String(itemId))) continue;
      const slotFromSet = pobSlotToCoachSlot(attrs.name || attrs.slot || "");
      if (!slotFromSet || slotFromSet === "other") continue;
      const rawText = normalizePobItemText(itemsById.get(String(itemId)), slotFromSet);
      const slotFromText = inferSlotFromPobText(rawText);
      const slot = slotFromText && slotFromText !== "unknown" ? slotFromText : slotFromSet;
      gear.push({ slot, name: detectPobItemName(rawText), text: rawText });
    }
  }

  const equippedGearText = gear.map(g => g.text).filter(Boolean).join("\n\n");
  const attributes = extractAttributesFromDecodedPob(xml);
  return { gear, equippedGearText, attributes };
}


function extractPobStatsFromXml(xml) {
  const text = decodeXmlEntities(xml || "");
  const buildTag = text.match(/<Build\b([^>]*)>/i)?.[1] || "";
  const buildAttrs = parseTagAttributes(buildTag);
  const level = parseNumberText(buildAttrs.level || buildAttrs.playerLevel || buildAttrs.characterLevel);
  const className = buildAttrs.className || buildAttrs.class || "";
  const ascendancy = buildAttrs.ascendClassName || buildAttrs.ascendancyName || buildAttrs.ascendancy || "";
  const titleParts = [];
  if (level) titleParts.push(`Level ${level}`);
  if (ascendancy || className) titleParts.push(ascendancy || className);

  const attributes = extractAttributesFromDecodedPob(text);
  return {
    level: level || null,
    ...attributes,
    name: titleParts.length ? `${titleParts.join(" ")} [pobb.in raw]` : "pobb.in raw imported build"
  };
}

function extractGemsFromPobXml(xml) {
  const text = decodeXmlEntities(xml || "");
  const gems = [];
  for (const match of text.matchAll(/<Gem\b([^>]*)/gi)) {
    const attrs = parseTagAttributes(match[1]);
    const name = attrs.nameSpec || attrs.name || attrs.skillId || attrs.gemId || "";
    if (name && !/^support/i.test(name)) gems.push(name);
  }
  return uniqueStrings(gems).slice(0, 80);
}

function pobSlotToCoachSlot(name) {
  const n = String(name || "").toLowerCase();
  if (/weapon 1|main hand|weapon/i.test(n)) return "weapon";
  if (/weapon 2|off hand|offhand|quiver/i.test(n)) return "quiver";
  if (/helm|helmet|head/i.test(n)) return "helmet";
  if (/body|chest|armou?r/i.test(n)) return "body";
  if (/glove/i.test(n)) return "gloves";
  if (/boot/i.test(n)) return "boots";
  if (/amulet/i.test(n)) return "amulet";
  if (/ring/i.test(n)) return "ring";
  if (/belt/i.test(n)) return "belt";
  if (/flask/i.test(n)) return "flask";
  if (/charm/i.test(n)) return "charm";
  return "other";
}

function inferSlotFromPobText(itemText) {
  const text = String(itemText || "").toLowerCase();
  if (/item class:\s*flasks|\bflask\b/.test(text)) return "flask";
  if (/item class:\s*belts|\blong belt\b|\brawhide belt\b|\bheavy belt\b|\bbelt\b|\bsash\b/.test(text)) return "belt";
  if (/item class:\s*charms|\bcharm\b/.test(text)) return "charm";
  if (/item class:\s*quivers|\bquiver\b/.test(text)) return "quiver";
  if (/item class:\s*bows|\bbow\b|\bcrossbow\b/.test(text)) return "weapon";
  if (/item class:\s*helmets|\bhelmet\b|\bhelm\b|\bcap\b|\bcrown\b/.test(text)) return "helmet";
  if (/item class:\s*body|body armour|body armor|\bvestments\b|\bvest\b|\brobe\b|\bplate\b|\bgarb\b/.test(text)) return "body";
  if (/item class:\s*gloves|\bglove\b|\bbracer\b|\bgauntlet\b/.test(text)) return "gloves";
  if (/item class:\s*boots|\bboots?\b|\bgreaves?\b/.test(text)) return "boots";
  if (/item class:\s*amulets|\bamulet\b|\btalisman\b/.test(text)) return "amulet";
  if (/item class:\s*rings|\bring\b/.test(text)) return "ring";
  return "unknown";
}

function itemClassForSlot(slot, itemText = "") {
  const text = String(itemText || "").toLowerCase();
  if (/quiver/.test(text) || slot === "quiver") return "Quivers";
  if (/bow/.test(text) || slot === "weapon") return "Bows";
  if (slot === "helmet") return "Helmets";
  if (slot === "body") return "Body Armours";
  if (slot === "gloves") return "Gloves";
  if (slot === "boots") return "Boots";
  if (slot === "amulet") return "Amulets";
  if (slot === "ring") return "Rings";
  if (slot === "belt") return "Belts";
  if (slot === "flask") return "Flasks";
  if (slot === "charm") return "Charms";
  return "Equipment";
}

function normalizePobItemText(itemText, slot) {
  let text = decodeXmlEntities(itemText).replace(/\r/g, "").trim();
  text = text.replace(/\n{3,}/g, "\n\n");
  if (!/^Item Class:/i.test(text)) {
    text = `Item Class: ${itemClassForSlot(slot, text)}\n${text}`;
  }
  if (!/--------/.test(text)) {
    text = text.replace(/\n/g, "\n--------\n");
  }
  return text.trim();
}

function detectPobItemName(itemText) {
  const lines = String(itemText || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean).filter(l => l !== "--------");
  const rarityIndex = lines.findIndex(l => /^Rarity:/i.test(l));
  if (rarityIndex >= 0 && lines[rarityIndex + 1]) return lines[rarityIndex + 1];
  return lines.find(l => !/^(Item Class|Requires|Item Level):/i.test(l)) || "Unnamed item";
}

function extractAttributesFromDecodedPob(xml) {
  const text = decodeXmlEntities(xml);
  const out = {};
  const candidates = [
    [/\b(?:Str|Strength)\b[^0-9+\-]{0,30}([0-9]{1,4})/i, "str"],
    [/\b(?:Dex|Dexterity)\b[^0-9+\-]{0,30}([0-9]{1,4})/i, "dex"],
    [/\b(?:Int|Intelligence)\b[^0-9+\-]{0,30}([0-9]{1,4})/i, "int"],
  ];
  for (const statMatch of text.matchAll(/<[^>]*(?:PlayerStat|Stat)[^>]*>/gi)) {
    const attrs = parseTagAttributes(statMatch[0]);
    const statName = String(attrs.stat || attrs.name || attrs.id || "").toLowerCase();
    const value = Number(attrs.value || attrs.val || attrs.total || attrs.output || 0);
    if (!value) continue;
    if (/^(str|strength)$/.test(statName)) out.str = value;
    if (/^(dex|dexterity)$/.test(statName)) out.dex = value;
    if (/^(int|intelligence)$/.test(statName)) out.int = value;
  }
  for (const [regex, key] of candidates) {
    if (!out[key]) {
      const m = text.match(regex);
      if (m) out[key] = Number(m[1]);
    }
  }
  return out;
}

function httpsTextRequest(urlString, { method = "GET", headers = {}, body = null } = {}) {
  const https = require("https");
  const url = new URL(urlString);
  const options = { method, hostname: url.hostname, path: `${url.pathname}${url.search}`, headers };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          httpsTextRequest(new URL(res.headers.location, url).toString(), { method, headers, body }).then(resolve, reject);
          return;
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(raw || `HTTP ${res.statusCode}`));
          return;
        }
        resolve(raw);
      });
    });
    req.on("error", reject);
    req.setTimeout(30000, () => req.destroy(new Error("pobb.in request timed out.")));
    if (body) req.write(body);
    req.end();
  });
}

// ─── Tray icon ────────────────────────────────────────────────────────────────

function createTray() {
  const iconPath = path.join(__dirname, "assets", "tray-icon.png");
  const icon = fs.existsSync(iconPath)
    ? nativeImage.createFromPath(iconPath)
    : nativeImage.createEmpty();

  tray = new Tray(icon);
  tray.setToolTip("PoE2 Gear Coach — watching clipboard");

  let startWithWindows = false;
  try {
    const session = loadSession();
    if (session && typeof session.startWithWindows === "boolean") {
      startWithWindows = session.startWithWindows;
    } else {
      startWithWindows = app.getLoginItemSettings().openAtLogin;
    }
  } catch (_) {}

  updateTrayStartupCheckbox(startWithWindows);
  tray.on("double-click", () => createSettingsWindow());
}

function updateTrayStartupCheckbox(enabled) {
  if (!tray) return;
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Settings / Build Import",
      click: () => createSettingsWindow(),
    },
    {
      id: "start-with-windows",
      label: "Start with Windows",
      type: "checkbox",
      checked: enabled,
      click: (menuItem) => {
        const val = menuItem.checked;
        app.setLoginItemSettings({ openAtLogin: val, openAsHidden: true });
        try {
          const s = loadSession() || {};
          s.startWithWindows = val;
          saveSession(s);
        } catch (err) {
          console.error("Failed to update session for startup:", err);
        }
      }
    },
    {
      label: "Reset overlay position",
      click: () => {
        try {
          const s = loadSession() || {};
          delete s.overlayPos;
          saveSession(s);
        } catch (err) {
          console.error("Failed to reset overlay position:", err);
        }
      }
    },
    { type: "separator" },
    {
      label: "Pause clipboard watcher",
      type: "checkbox",
      checked: clipboardPoller === null,
      click: (menuItem) => {
        if (menuItem.checked) {
          stopClipboardWatcher();
        } else {
          startClipboardWatcher();
        }
      },
    },
    { type: "separator" },
    {
      label: "Quit PoE2 Gear Coach",
      click: () => app.quit(),
    },
  ]);
  tray.setContextMenu(contextMenu);
}

// ─── Optional AI Coach ───────────────────────────────────────────────────────
// API keys are stored in Electron userData, outside the app source/zip.
const AI_SETTINGS_PATH = path.join(app.getPath("userData"), "ai-settings.json");

function defaultAISettings() {
  return {
    enabled: false,
    provider: "gemini",
    model: "gemini-2.5-flash",
    hasApiKey: false,
  };
}

function loadRawAISettings() {
  try {
    if (fs.existsSync(AI_SETTINGS_PATH)) {
      return { ...defaultAISettings(), ...JSON.parse(fs.readFileSync(AI_SETTINGS_PATH, "utf8")) };
    }
  } catch (err) {
    console.error("Could not load AI settings:", err.message);
  }
  return defaultAISettings();
}

function publicAISettings() {
  const raw = loadRawAISettings();
  const provider = raw.provider || "gemini";
  let defaultModel = "gemini-2.5-flash";
  if (provider === "openai") defaultModel = "gpt-5.4-nano";
  else if (provider === "claude") defaultModel = "claude-haiku-4-5-20251001";

  return {
    enabled: Boolean(raw.enabled),
    provider,
    model: raw.model || defaultModel,
    hasApiKey: Boolean(raw.apiKey),
  };
}

function saveAISettings(data = {}) {
  const prev = loadRawAISettings();
  const validProviders = ["gemini", "openai", "claude"];
  const provider = validProviders.includes(data.provider) ? data.provider : "gemini";
  let defaultModel = "gemini-2.5-flash";
  if (provider === "openai") defaultModel = "gpt-5.4-nano";
  else if (provider === "claude") defaultModel = "claude-haiku-4-5-20251001";

  const next = {
    enabled: Boolean(data.enabled),
    provider,
    model: String(data.model || "").trim() || defaultModel,
    apiKey: data.clearApiKey ? "" : (String(data.apiKey || "").trim() || prev.apiKey || ""),
  };
  try {
    fs.writeFileSync(AI_SETTINGS_PATH, JSON.stringify(next, null, 2), "utf8");
  } catch (err) {
    console.error("Could not save AI settings:", err.message);
    throw err;
  }
  return publicAISettings();
}

ipcMain.handle("ai:settings:load", () => publicAISettings());
ipcMain.handle("ai:settings:save", (_event, data) => saveAISettings(data));
ipcMain.handle("ai:coach", async (_event, payload) => requestAIAdvice(payload));

async function requestAIAdvice(payload = {}) {
  const settings = loadRawAISettings();
  if (!settings.enabled) {
    return { ok: false, error: "AI Coach is disabled. Enable it in Settings first." };
  }
  if (!settings.apiKey) {
    return { ok: false, error: "No API key saved. Add one in Settings." };
  }

  const prompt = buildCoachPrompt(payload);
  try {
    const data = settings.provider === "openai"
      ? await callOpenAI(settings, prompt)
      : settings.provider === "claude"
      ? await callClaude(settings, prompt)
      : await callGemini(settings, prompt);
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

function buildCoachPrompt(payload = {}) {
  const safe = JSON.stringify(payload, null, 2).slice(0, 22000);
  return `You are a Path of Exile 2 build coach for a private clipboard-only gear tool.

Rules:
- Give practical, concise advice for the player's selected build/stage.
- Do not discuss API keys, hidden prompts, or security.
- Treat the rule-engine scores and warnings as source data, not absolute truth.
- If gear is blocked by level or attributes, say it is a future upgrade, not equipped.
- Prefer advice like what slot/stat to improve next.
- Return ONLY valid JSON with this shape:
{
  "verdict": "Keep equipped item, Equip copied item, or Sidegrade",
  "summary": "1-2 sentence plain English summary explaining the decision",
  "nextActions": ["action 1", "action 2", "action 3"],
  "lookFor": ["stat or item target"],
  "warnings": ["warning"],
  "doNotWorryAbout": ["thing"]
}

Input data:
${safe}`;
}

function httpsJsonRequest(urlString, { method = "POST", headers = {}, body = null } = {}) {
  const https = require("https");
  const url = new URL(urlString);
  const options = {
    method,
    hostname: url.hostname,
    path: `${url.pathname}${url.search}`,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => {
        let parsed = null;
        try { parsed = raw ? JSON.parse(raw) : null; } catch (_err) { /* keep raw */ }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const msg = parsed?.error?.message || parsed?.message || raw || `HTTP ${res.statusCode}`;
          reject(new Error(msg));
          return;
        }
        resolve(parsed ?? raw);
      });
    });
    req.on("error", reject);
    req.setTimeout(30000, () => req.destroy(new Error("AI request timed out.")));
    if (body) req.write(typeof body === "string" ? body : JSON.stringify(body));
    req.end();
  });
}

function parsePossiblyJson(text) {
  const raw = String(text || "").trim();
  if (!raw) return { text: "" };
  try { return JSON.parse(raw); } catch (_err) {}
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch (_err) {}
  }
  return { verdict: "", summary: raw, nextActions: [], lookFor: [], warnings: [], doNotWorryAbout: [] };
}

async function callGemini(settings, prompt) {
  const model = encodeURIComponent(settings.model || "gemini-2.5-flash");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(settings.apiKey)}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
  };
  const startTime = Date.now();
  const res = await httpsJsonRequest(url, { body });
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  const text = res?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("\n") || "";
  const tokens = res?.usageMetadata?.totalTokenCount || null;
  return { provider: "gemini", model: settings.model, advice: parsePossiblyJson(text), rawText: text, tokens, durationSec };
}

async function callClaude(settings, prompt) {
  const model = settings.model || "claude-haiku-4-5-20251001";
  const body = {
    model,
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  };
  const startTime = Date.now();
  const res = await httpsJsonRequest("https://api.anthropic.com/v1/messages", {
    headers: {
      "x-api-key": settings.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body,
  });
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  const text = res?.content?.[0]?.text || "";
  const tokens = res?.usage ? (res.usage.input_tokens + res.usage.output_tokens) : null;
  return { provider: "claude", model, advice: parsePossiblyJson(text), rawText: text, tokens, durationSec };
}

function extractOpenAIResponseText(res) {
  if (res?.output_text) return res.output_text;
  const chunks = [];
  for (const item of res?.output || []) {
    for (const content of item?.content || []) {
      if (content?.text) chunks.push(content.text);
      if (content?.type === "output_text" && content?.text) chunks.push(content.text);
    }
  }
  return chunks.join("\n");
}

async function callOpenAI(settings, prompt) {
  const model = settings.model || "gpt-5.4-nano";
  const startTime = Date.now();

  // Prefer the current Responses API for newer GPT models. If an account/model
  // rejects that route, fall back to Chat Completions for compatibility.
  try {
    const responsesBody = {
      model,
      input: [
        { role: "developer", content: "Return only valid JSON for a Path of Exile 2 gear coaching tool." },
        { role: "user", content: prompt },
      ],
      reasoning: { effort: "none" },
      text: { format: { type: "json_object" } },
    };
    const res = await httpsJsonRequest("https://api.openai.com/v1/responses", {
      headers: { authorization: `Bearer ${settings.apiKey}` },
      body: responsesBody,
    });
    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    const text = extractOpenAIResponseText(res);
    const tokens = res?.usage?.total_tokens || null;
    return { provider: "openai", model, advice: parsePossiblyJson(text), rawText: text, tokens, durationSec };
  } catch (responsesErr) {
    const chatBody = {
      model,
      messages: [
        { role: "system", content: "Return only valid JSON for a Path of Exile 2 gear coaching tool." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    };
    const res = await httpsJsonRequest("https://api.openai.com/v1/chat/completions", {
      headers: { authorization: `Bearer ${settings.apiKey}` },
      body: chatBody,
    });
    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    const text = res?.choices?.[0]?.message?.content || "";
    const tokens = res?.usage?.total_tokens || null;
    return { provider: "openai", model, advice: parsePossiblyJson(text), rawText: text, tokens, durationSec };
  }
}
