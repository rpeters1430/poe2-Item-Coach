/**
 * poe2-mod-data.js — PoE2 affix tier database
 *
 * Loaded as <script> in overlay.html / settings.html (sets window.POE2_MOD_DATA),
 * and require()'d in Node.js for tests / the fetch script.
 *
 * Life mod tiers: VERIFIED from poe2db.tw/us/Life (2026-06-25).
 * Resistance/speed/damage tiers: calibrated estimates for PoE2 0.2.x.
 * Run `npm run fetch-mods` to update all tiers from poe2db.tw.
 */
"use strict";

/* eslint-disable no-unused-vars */
const POE2_MOD_DATA = {
  version: "1.2.0",
  fetched: "2026-06-25T19:36:08.747Z",
  source: "poe2db.tw (life verified; other mods calibrated estimates)",
  note: "Run `npm run fetch-mods` to update from poe2db.tw stat pages",

  // ── Build meta: extra score bonus for mods a specific build wants most ───
  buildMeta: {
    iceShotDeadeye: {
      label: "Ice Shot Deadeye",
      topMods: [
        /cold damage to attacks|adds .* cold damage/i,
        /increased damage with bow skills/i,
        /increased projectile damage/i,
        /attack speed|reload speed/i,
        /\+\d+ to level of all projectile skills/i,
      ],
      metaBonus: 0.30,
    },
    genericAttack: {
      label: "Generic Attack",
      topMods: [
        /adds .* physical damage to attacks/i,
        /attack speed/i,
        /increased physical damage/i,
      ],
      metaBonus: 0.20,
    },
  },

  // ── Mod definitions ───────────────────────────────────────────────────────
  // Tiers are stored best→worst (tier 1 = highest ilvl requirement / best values).
  // Multiplier is computed dynamically from tier position — see tierScoreMultiplier().
  mods: [

    // ── LIFE ─────────────────────────────────────────────────────────────
    // VERIFIED from poe2db.tw/us/Life (2026-06-25)
    // Slots with weight ≥ 1: body, shield, helmet, gloves, boots, belt, amulet, ring
    // (Higher tiers progressively restrict to fewer slots)
    {
      id: "flat_life",
      label: "Flat Life",
      category: "defense",
      pattern: /^\+(\d+) to maximum Life$/i,
      tiers: [
        { tier:  1, ilvl: 80, min: 200, max: 214, name: "Prime" },
        { tier:  2, ilvl: 75, min: 190, max: 199, name: "Rapturous" },
        { tier:  3, ilvl: 70, min: 175, max: 189, name: "Vigorous" },
        { tier:  4, ilvl: 65, min: 150, max: 174, name: "Fecund" },
        { tier:  5, ilvl: 60, min: 120, max: 149, name: "Athlete's" },
        { tier:  6, ilvl: 54, min: 100, max: 119, name: "Virile" },
        { tier:  7, ilvl: 46, min:  85, max:  99, name: "Rotund" },
        { tier:  8, ilvl: 38, min:  70, max:  84, name: "Robust" },
        { tier:  9, ilvl: 33, min:  60, max:  69, name: "Stout" },
        { tier: 10, ilvl: 24, min:  40, max:  59, name: "Stalwart" },
        { tier: 11, ilvl: 16, min:  30, max:  39, name: "Sanguine" },
        { tier: 12, ilvl:  6, min:  20, max:  29, name: "Healthy" },
        { tier: 13, ilvl:  1, min:  10, max:  19, name: "Hale" },
      ],
    },

    // ── RESISTANCES ───────────────────────────────────────────────────────
    // Calibrated estimates for PoE2 0.2.x — will be updated by fetch-mods
    {
      id: "fire_resist",
      label: "Fire Res",
      category: "resistance",
      pattern: /^\+(\d+)% to Fire Resistance$/i,
      tiers: [
        { tier: 1, ilvl: 68, min: 35, max: 40, name: "of the Volcano"  },
        { tier: 2, ilvl: 46, min: 28, max: 34, name: "of the Furnace"  },
        { tier: 3, ilvl: 30, min: 22, max: 27, name: "of the Hearth"   },
        { tier: 4, ilvl: 18, min: 16, max: 21, name: "of the Flame"    },
        { tier: 5, ilvl:  9, min: 10, max: 15, name: "of the Ember"    },
      ],
    },
    {
      id: "cold_resist",
      label: "Cold Res",
      category: "resistance",
      pattern: /^\+(\d+)% to Cold Resistance$/i,
      tiers: [
        { tier: 1, ilvl: 68, min: 35, max: 40, name: "of the Tundra"  },
        { tier: 2, ilvl: 46, min: 28, max: 34, name: "of the Glacier"  },
        { tier: 3, ilvl: 30, min: 22, max: 27, name: "of the Ice"      },
        { tier: 4, ilvl: 18, min: 16, max: 21, name: "of the Sleet"    },
        { tier: 5, ilvl:  9, min: 10, max: 15, name: "of the Frost"    },
      ],
    },
    {
      id: "lightning_resist",
      label: "Lightning Res",
      category: "resistance",
      pattern: /^\+(\d+)% to Lightning Resistance$/i,
      tiers: [
        { tier: 1, ilvl: 68, min: 35, max: 40, name: "of the Tempest"   },
        { tier: 2, ilvl: 46, min: 28, max: 34, name: "of the Maelstrom" },
        { tier: 3, ilvl: 30, min: 22, max: 27, name: "of the Storm"     },
        { tier: 4, ilvl: 18, min: 16, max: 21, name: "of the Thunder"   },
        { tier: 5, ilvl:  9, min: 10, max: 15, name: "of the Static"    },
      ],
    },
    {
      id: "chaos_resist",
      label: "Chaos Res",
      category: "resistance",
      pattern: /^\+(\d+)% to Chaos Resistance$/i,
      tiers: [
        { tier: 1, ilvl: 68, min: 22, max: 26, name: "of the Abyss"  },
        { tier: 2, ilvl: 50, min: 16, max: 21, name: "of the Void"   },
        { tier: 3, ilvl: 34, min: 11, max: 15, name: "of the Chaos"  },
        { tier: 4, ilvl: 20, min:  7, max: 10, name: "of the Rift"   },
        { tier: 5, ilvl:  5, min:  3, max:  6, name: "of the Breach" },
      ],
    },
    {
      id: "all_elem_resist",
      label: "All Res",
      category: "resistance",
      pattern: /^\+(\d+)% to all Elemental Resistances$/i,
      tiers: [
        { tier:  1, ilvl: 80, min:  17, max:  18, name: "of the Span" },
        { tier:  2, ilvl: 68, min:  15, max:  16, name: "of the Rainbow" },
        { tier:  3, ilvl: 54, min:  12, max:  14, name: "of Variegation" },
        { tier:  4, ilvl: 40, min:   9, max:  11, name: "of the Kaleidoscope" },
        { tier:  5, ilvl: 26, min:   6, max:   8, name: "of the Prism" },
        { tier:  6, ilvl: 12, min:   3, max:   5, name: "of the Crystal" },
      ],
    },

    // ── ATTRIBUTES ────────────────────────────────────────────────────────
    {
      id: "flat_strength",
      label: "Strength",
      category: "attributes",
      pattern: /^\+(\d+) to Strength$/i,
      tiers: [
        { tier:  1, ilvl: 81, min:  34, max:  36, name: "of the Gods" },
        { tier:  2, ilvl: 74, min:  31, max:  33, name: "of the Titan" },
        { tier:  3, ilvl: 66, min:  28, max:  30, name: "of the Leviathan" },
        { tier:  4, ilvl: 55, min:  25, max:  27, name: "of the Goliath" },
        { tier:  5, ilvl: 44, min:  21, max:  24, name: "of the Gorilla" },
        { tier:  6, ilvl: 33, min:  17, max:  20, name: "of the Lion" },
        { tier:  7, ilvl: 22, min:  13, max:  16, name: "of the Bear" },
        { tier:  8, ilvl: 11, min:   9, max:  12, name: "of the Wrestler" },
        { tier:  9, ilvl:  1, min:   5, max:   8, name: "of the Brute" },
      ],
    },
    {
      id: "flat_dexterity",
      label: "Dexterity",
      category: "attributes",
      pattern: /^\+(\d+) to Dexterity$/i,
      tiers: [
        { tier:  1, ilvl: 74, min:  31, max:  33, name: "of the Phantom" },
        { tier:  2, ilvl: 66, min:  28, max:  30, name: "of the Jaguar" },
        { tier:  3, ilvl: 55, min:  25, max:  27, name: "of the Leopard" },
        { tier:  4, ilvl: 44, min:  21, max:  24, name: "of the Panther" },
        { tier:  5, ilvl: 33, min:  17, max:  20, name: "of the Falcon" },
        { tier:  6, ilvl: 22, min:  13, max:  16, name: "of the Fox" },
        { tier:  7, ilvl: 11, min:   9, max:  12, name: "of the Lynx" },
        { tier:  8, ilvl:  1, min:   5, max:   8, name: "of the Mongoose" },
      ],
    },
    {
      id: "flat_intelligence",
      label: "Intelligence",
      category: "attributes",
      pattern: /^\+(\d+) to Intelligence$/i,
      tiers: [
        { tier:  1, ilvl: 74, min:  31, max:  33, name: "of the Virtuoso" },
        { tier:  2, ilvl: 66, min:  28, max:  30, name: "of the Savant" },
        { tier:  3, ilvl: 55, min:  25, max:  27, name: "of the Sage" },
        { tier:  4, ilvl: 44, min:  21, max:  24, name: "of the Philosopher" },
        { tier:  5, ilvl: 33, min:  17, max:  20, name: "of the Augur" },
        { tier:  6, ilvl: 22, min:  13, max:  16, name: "of the Prodigy" },
        { tier:  7, ilvl: 11, min:   9, max:  12, name: "of the Student" },
        { tier:  8, ilvl:  1, min:   5, max:   8, name: "of the Pupil" },
      ],
    },

    // ── MOBILITY ──────────────────────────────────────────────────────────
    {
      id: "movement_speed",
      label: "Move Speed",
      category: "mobility",
      pattern: /^\+?(\d+)% increased Movement Speed$/i,
      tiers: [
        { tier: 1, ilvl: 65, min: 30, max: 35 },
        { tier: 2, ilvl: 50, min: 25, max: 29 },
        { tier: 3, ilvl: 35, min: 20, max: 24 },
        { tier: 4, ilvl: 20, min: 15, max: 19 },
        { tier: 5, ilvl:  8, min: 10, max: 14 },
      ],
    },

    // ── DAMAGE ────────────────────────────────────────────────────────────
    {
      id: "attack_speed",
      label: "Attack Speed",
      category: "damage",
      pattern: /^(\d+)% increased Attack Speed$/i,
      tiers: [
        { tier: 1, ilvl: 69, min: 15, max: 18 },
        { tier: 2, ilvl: 50, min: 12, max: 14 },
        { tier: 3, ilvl: 30, min:  9, max: 11 },
        { tier: 4, ilvl: 15, min:  6, max:  8 },
        { tier: 5, ilvl:  5, min:  3, max:  5 },
      ],
    },
    {
      id: "reload_speed",
      label: "Reload Speed",
      category: "damage",
      pattern: /^(\d+)% increased Reload Speed$/i,
      tiers: [
        { tier: 1, ilvl: 66, min: 18, max: 22 },
        { tier: 2, ilvl: 48, min: 14, max: 17 },
        { tier: 3, ilvl: 30, min: 10, max: 13 },
        { tier: 4, ilvl: 15, min:  6, max:  9 },
        { tier: 5, ilvl:  5, min:  3, max:  5 },
      ],
    },

    // ── FLAT ADDED DAMAGE TO ATTACKS ─────────────────────────────────────
    // getValue returns average (min+max)/2 for tier lookup
    {
      id: "added_cold_attacks",
      label: "Flat Cold Dmg",
      category: "synergy",
      pattern: /^Adds (\d+) to (\d+) Cold Damage to Attacks$/i,
      getValue: (m) => (Number(m[1]) + Number(m[2])) / 2,
      tiers: [
        { tier: 1, ilvl: 65, min: 18, max: 40 },
        { tier: 2, ilvl: 46, min: 11, max: 22 },
        { tier: 3, ilvl: 28, min:  6, max: 13 },
        { tier: 4, ilvl: 14, min:  3, max:  7 },
        { tier: 5, ilvl:  4, min:  1, max:  4 },
      ],
    },
    {
      id: "added_physical_attacks",
      label: "Flat Phys Dmg",
      category: "damage",
      pattern: /^Adds (\d+) to (\d+) Physical Damage to Attacks$/i,
      getValue: (m) => (Number(m[1]) + Number(m[2])) / 2,
      tiers: [
        { tier: 1, ilvl: 65, min: 15, max: 36 },
        { tier: 2, ilvl: 46, min:  9, max: 20 },
        { tier: 3, ilvl: 28, min:  5, max: 11 },
        { tier: 4, ilvl: 14, min:  2, max:  6 },
        { tier: 5, ilvl:  4, min:  1, max:  3 },
      ],
    },
    {
      id: "added_lightning_attacks",
      label: "Flat Lightning Dmg",
      category: "damage",
      pattern: /^Adds (\d+) to (\d+) Lightning Damage to Attacks$/i,
      getValue: (m) => (Number(m[1]) + Number(m[2])) / 2,
      tiers: [
        { tier: 1, ilvl: 66, min: 14, max: 36 },
        { tier: 2, ilvl: 47, min:  8, max: 21 },
        { tier: 3, ilvl: 29, min:  4, max: 12 },
        { tier: 4, ilvl: 13, min:  2, max:  6 },
        { tier: 5, ilvl:  3, min:  1, max:  3 },
      ],
    },
    {
      id: "added_fire_attacks",
      label: "Flat Fire Dmg",
      category: "damage",
      pattern: /^Adds (\d+) to (\d+) Fire Damage to Attacks$/i,
      getValue: (m) => (Number(m[1]) + Number(m[2])) / 2,
      tiers: [
        { tier: 1, ilvl: 66, min: 14, max: 35 },
        { tier: 2, ilvl: 47, min:  8, max: 20 },
        { tier: 3, ilvl: 29, min:  4, max: 11 },
        { tier: 4, ilvl: 13, min:  2, max:  5 },
        { tier: 5, ilvl:  3, min:  1, max:  3 },
      ],
    },

    // ── BUILD SCALING ─────────────────────────────────────────────────────
    {
      id: "bow_skill_damage",
      label: "Bow Skill Damage",
      category: "synergy",
      pattern: /^(\d+)% increased Damage with Bow Skills$/i,
      tiers: [
        { tier: 1, ilvl: 65, min: 30, max: 40 },
        { tier: 2, ilvl: 47, min: 22, max: 29 },
        { tier: 3, ilvl: 30, min: 16, max: 21 },
        { tier: 4, ilvl: 15, min: 10, max: 15 },
        { tier: 5, ilvl:  5, min:  5, max:  9 },
      ],
    },
    {
      id: "projectile_damage",
      label: "Projectile Damage",
      category: "synergy",
      pattern: /^(\d+)% increased Projectile Damage$/i,
      tiers: [
        { tier: 1, ilvl: 65, min: 30, max: 40 },
        { tier: 2, ilvl: 47, min: 22, max: 29 },
        { tier: 3, ilvl: 30, min: 16, max: 21 },
        { tier: 4, ilvl: 15, min: 10, max: 15 },
        { tier: 5, ilvl:  5, min:  5, max:  9 },
      ],
    },
    {
      id: "increased_physical_damage",
      label: "Increased Phys Dmg",
      category: "damage",
      pattern: /^(\d+)% increased Physical Damage$/i,
      tiers: [
        { tier: 1, ilvl: 66, min: 60, max: 80 },
        { tier: 2, ilvl: 48, min: 45, max: 59 },
        { tier: 3, ilvl: 30, min: 30, max: 44 },
        { tier: 4, ilvl: 16, min: 18, max: 29 },
        { tier: 5, ilvl:  5, min:  8, max: 17 },
      ],
    },
    {
      id: "increased_cold_damage",
      label: "Increased Cold Dmg",
      category: "synergy",
      pattern: /^(\d+)% increased Cold Damage$/i,
      tiers: [
        { tier: 1, ilvl: 66, min: 55, max: 75 },
        { tier: 2, ilvl: 48, min: 40, max: 54 },
        { tier: 3, ilvl: 30, min: 27, max: 39 },
        { tier: 4, ilvl: 16, min: 16, max: 26 },
        { tier: 5, ilvl:  5, min:  7, max: 15 },
      ],
    },

    // ── DEFENSE ───────────────────────────────────────────────────────────
    {
      id: "flat_armour",
      label: "Armour",
      category: "defense",
      pattern: /^\+(\d+) to Armour$/i,
      tiers: [
        { tier: 1, ilvl: 70, min: 200, max: 280 },
        { tier: 2, ilvl: 52, min: 140, max: 199 },
        { tier: 3, ilvl: 36, min:  90, max: 139 },
        { tier: 4, ilvl: 22, min:  50, max:  89 },
        { tier: 5, ilvl:  8, min:  20, max:  49 },
      ],
    },
    {
      id: "flat_evasion",
      label: "Evasion Rating",
      category: "defense",
      pattern: /^\+(\d+) to Evasion Rating$/i,
      tiers: [
        { tier: 1, ilvl: 70, min: 200, max: 280 },
        { tier: 2, ilvl: 52, min: 140, max: 199 },
        { tier: 3, ilvl: 36, min:  90, max: 139 },
        { tier: 4, ilvl: 22, min:  50, max:  89 },
        { tier: 5, ilvl:  8, min:  20, max:  49 },
      ],
    },
    {
      id: "flat_es",
      label: "Energy Shield",
      category: "defense",
      pattern: /^\+(\d+) to maximum Energy Shield$/i,
      tiers: [
        { tier: 1, ilvl: 70, min: 50, max: 70 },
        { tier: 2, ilvl: 52, min: 35, max: 49 },
        { tier: 3, ilvl: 36, min: 22, max: 34 },
        { tier: 4, ilvl: 22, min: 12, max: 21 },
        { tier: 5, ilvl:  8, min:  5, max: 11 },
      ],
    },

    // ── CRIT ──────────────────────────────────────────────────────────────
    {
      id: "crit_hit_chance",
      label: "Crit Chance",
      category: "damage",
      pattern: /^(\d+)% increased Critical Hit Chance$/i,
      tiers: [
        { tier: 1, ilvl: 65, min: 55, max: 70 },
        { tier: 2, ilvl: 47, min: 40, max: 54 },
        { tier: 3, ilvl: 30, min: 28, max: 39 },
        { tier: 4, ilvl: 15, min: 18, max: 27 },
        { tier: 5, ilvl:  5, min:  8, max: 17 },
      ],
    },
    {
      id: "crit_dmg_bonus",
      label: "Crit Damage Bonus",
      category: "damage",
      pattern: /^\+(\d+)% to Critical Damage Bonus$/i,
      tiers: [
        { tier: 1, ilvl: 65, min: 28, max: 40 },
        { tier: 2, ilvl: 47, min: 20, max: 27 },
        { tier: 3, ilvl: 30, min: 14, max: 19 },
        { tier: 4, ilvl: 15, min:  8, max: 13 },
        { tier: 5, ilvl:  4, min:  3, max:  7 },
      ],
    },
  ],
};

// ── Tier detection ─────────────────────────────────────────────────────────

/**
 * Match a mod line against the tier database.
 * Returns { modId, label, category, tier, tierCount, tierName, value, min, max, rollPct }
 * or null if the line doesn't match any known mod.
 */
function detectModTier(line, itemIlvl) {
  const mods = POE2_MOD_DATA.mods;

  for (const mod of mods) {
    const m = String(line).match(mod.pattern);
    if (!m) continue;

    const value = mod.getValue ? mod.getValue(m) : Number(m[1]);
    if (!Number.isFinite(value)) continue;

    for (const t of mod.tiers) {
      if (value >= t.min && value <= t.max) {
        const rollPct = t.max === t.min ? 100 : Math.round(((value - t.min) / (t.max - t.min)) * 100);
        return {
          modId: mod.id, label: mod.label, category: mod.category,
          tier: t.tier, tierCount: mod.tiers.length, tierName: t.name || null,
          value, min: t.min, max: t.max, rollPct,
          ilvlRequired: t.ilvl,
        };
      }
    }

    // Value outside all defined tiers — clamp to best or worst
    const best  = mod.tiers[0];
    const worst = mod.tiers[mod.tiers.length - 1];
    if (value > best.max) {
      return { modId: mod.id, label: mod.label, category: mod.category,
        tier: 1, tierCount: mod.tiers.length, tierName: best.name || null,
        value, min: best.min, max: best.max, rollPct: 100, superTier: true };
    }
    if (value < worst.min) {
      const n = mod.tiers.length;
      return { modId: mod.id, label: mod.label, category: mod.category,
        tier: n, tierCount: n, tierName: worst.name || null,
        value, min: worst.min, max: worst.max, rollPct: 0 };
    }
  }
  return null;
}

/**
 * Scoring multiplier based on relative tier position.
 * Uses a continuous formula so variable tier counts are handled naturally.
 * T1/N (best) → 1.40   T_N/N (worst) → 0.45
 */
function tierScoreMultiplier(tierInfo) {
  if (!tierInfo) return 1.0;
  const t = tierInfo.tier;
  const n = Math.max(1, tierInfo.tierCount);
  if (n === 1) return 1.15;
  return Math.round((1.40 - (1.40 - 0.45) * (t - 1) / (n - 1)) * 100) / 100;
}

/**
 * Return the build-meta bonus multiplier for a mod line given the active build focus.
 * Returns 1.0 (no bonus) if the mod is not in the meta priority list.
 */
function metaBonusMultiplier(line, buildFocusKey) {
  const meta = POE2_MOD_DATA.buildMeta[buildFocusKey];
  if (!meta) return 1.0;
  for (const pattern of meta.topMods) {
    if (pattern.test(line)) return 1.0 + meta.metaBonus;
  }
  return 1.0;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { POE2_MOD_DATA, detectModTier, tierScoreMultiplier, metaBonusMultiplier };
}
