/**
 * preload.js — Secure IPC bridge
 *
 * This script runs in the renderer context but has access to Node/Electron APIs.
 * It exposes a narrow, safe API to the renderer via contextBridge.
 * The renderer (overlay.html / settings.html) ONLY uses window.poe2Coach.* — never
 * require() or direct Electron APIs, which keeps the app secure.
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("poe2Coach", {
  // ── Overlay renderer calls these ──────────────────────────────────────────

  /** Called by overlay.html when the user clicks the X or presses Escape */
  dismiss: () => ipcRenderer.send("overlay:dismiss"),

  /** Called by overlay.html when the user clicks "Open Settings" */
  openSettings: () => ipcRenderer.send("overlay:open-settings"),

  /**
   * Register a listener for incoming item text.
   * Main process sends { itemText, session } whenever a new PoE2 item is detected.
   * @param {function({ itemText: string, session: object|null }): void} callback
   */
  onItemDetected: (callback) => {
    ipcRenderer.on("item:detected", (_event, payload) => callback(payload));
  },

  // ── Settings renderer calls these ─────────────────────────────────────────

  /** Save the current session/build config to disk via main process */
  saveSession: (data) => ipcRenderer.send("session:save", data),

  /** Load the saved session from disk (returns a Promise) */
  loadSession: () => ipcRenderer.invoke("session:load"),

  // ── Optional AI Coach calls ───────────────────────────────────────────────
  /** Load AI settings without exposing the stored API key */
  loadAISettings: () => ipcRenderer.invoke("ai:settings:load"),

  /** Save AI settings. apiKey is optional; blank keeps the old key unless clearApiKey is true. */
  saveAISettings: (data) => ipcRenderer.invoke("ai:settings:save", data),

  /** Ask the configured AI provider for a build/item coaching summary */
  requestAIAdvice: (payload) => ipcRenderer.invoke("ai:coach", payload),

  /** Import a pobb.in link/export summary through the main process so CSP/CORS do not block the settings UI. */
  importPobb: (input) => ipcRenderer.invoke("pobb:import", input),

  /**
   * Fetch unique item prices from poe.ninja (cached 2 h in userData/prices.json).
   * @param {{ type?: string, league?: string }} options
   *   type: poe.ninja item type (UniqueWeapon, UniqueArmour, UniqueAccessory, UniqueJewel, UniqueFlask)
   *   league: PoE2 league name, e.g. "Standard"
   * @returns {Promise<{ ok: boolean, prices: Record<string,{name,chaos,divine,variant}>, cached?: boolean, error?: string }>}
   */
  getPrices: (options) => ipcRenderer.invoke("prices:get", options || {}),

  /**
   * Look up trade value for the current item.
   * Uniques use poe.ninja median price; rares use a live PoE2 trade API search.
   * @param {{ rarity: string, name: string, slot: string, mods: string[] }} options
   * @returns {Promise<{ ok: boolean, rarity: string, listings?: Array, total?: number, price?: number, divine?: number, tradeUrl: string, error?: string }>}
   */
  priceCheck: (options) => ipcRenderer.invoke("trade:price-check", options || {}),

  /** Open a pathofexile.com/trade2 URL in the system default browser. */
  openTrade: (url) => ipcRenderer.invoke("trade:open", url),
});
