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
});
