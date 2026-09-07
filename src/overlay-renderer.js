/**
 * overlay-renderer.js  — PoE2 Gear Coach v2
 *
 * Renders a PoE2-styled item tooltip on the left and a coach panel on the right.
 * Receives { itemText, session } via window.poe2Coach.onItemDetected.
 */
"use strict";

// ─── Scoring engine ───────────────────────────────────────────────────────────

const SCORE_KEYS = ["damage","defense","attributes","resistance","mobility","synergy"];
const SCORE_LABELS = { damage:"Damage", defense:"Defense", attributes:"Attribs", resistance:"Resists", mobility:"Mobility", synergy:"Synergy" };
const SCORE_EXPLAIN = {
  damage:     "Flat attack damage, attack/reload speed, phys/ele damage, crit.",
  defense:    "Life, armour, evasion, energy shield.",
  attributes: "Str/Dex/Int — unlock gear and gem requirements.",
  resistance: "Fire/Cold/Lightning/Chaos resistance.",
  mobility:   "Movement speed (especially on boots).",
  synergy:    "Stats that match the imported build, current stage, and creator guidance.",
};

function defaultFrostRules() {
  return [
    { match: /cold damage to attacks|adds .* cold damage/i,         category:"synergy",    points:16, label:"cold damage",                      note:"Scales your primary Ice Shot damage type." },
    { match: /lightning damage to attacks|adds .* lightning damage/i,category:"damage",    points:5,  label:"lightning damage",                 note:"Off-element — minor bonus while leveling." },
    { match: /physical damage to attacks|adds .* physical damage|increased physical damage/i, category:"damage", points:8, label:"physical damage", note:"Physical base — low conversion value for Ice Shot." },
    { match: /\+\d+ to level of all projectile skills/i,            category:"synergy",   points:22, label:"+levels to projectile skills",      note:"Massively scales Ice Shot — the best mod type for this build." },
    { match: /increased damage with bow skills|increased projectile damage|increased damage with crossbow skills/i, category:"synergy", points:13, label:"projectile/bow damage", note:"Scales Ice Shot and all projectile damage." },
    { match: /attack speed|reload speed/i,                           category:"damage",    points:13, label:"attack speed",                      note:"More shots per second — direct DPS increase." },
    { match: /critical hit chance|critical damage bonus|critical damage/i, category:"damage", points:3, label:"critical stats",                note:"Low priority until the guide stage swaps into crit scaling." },
    { match: /cold penetration/i,                                    category:"synergy",   points:14, label:"cold penetration",                 note:"Bypasses enemy cold resistance — high value." },
    { match: /maximum life/i,                                        category:"defense",   points:10, label:"maximum life",                      note:"Survivability — always a priority." },
    { match: /evasion rating/i,                                      category:"defense",   points:12, label:"evasion rating",                    note:"Core defensive stat for Deadeye — evasion scales this ascendancy." },
    { match: /armour|energy shield/i,                                category:"defense",   points:4,  label:"armour/energy shield",             note:"Secondary defense — Deadeye scales from evasion, not armour/ES." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance/i, category:"resistance", points:8, label:"elemental resistance", note:"Helps cap your elemental resistances." },
    { match: /all elemental resistances|all resistances/i,           category:"resistance",points:16, label:"all elemental resistances",         note:"Efficiently caps all three resistances at once." },
    { match: /strength|dexterity|intelligence/i,                     category:"attributes",points:7,  label:"attributes",                       note:"Required for gem and gear stat requirements." },
    { match: /movement speed/i,                                      category:"mobility",  points:18, label:"movement speed",                   note:"Critical for survival — major leveling priority." },
    { match: /spell damage|minion damage/i,                          category:"synergy",   points:-10,label:"spell/minion damage",              note:"Off-plan — this build deals attack damage, not spell damage." },
    { match: /damage over time|ignite|poison/i,                      category:"synergy",   points:-4, label:"damage over time",                 note:"DoT mods do nothing for Ice Shot." },
  ];
}

function defaultGenericRules() {
  return [
    { match: /adds .* damage to attacks|physical damage to attacks|increased physical damage/i, category:"damage", points:10, label:"attack damage",   note:"Flat attack damage — core DPS stat." },
    { match: /attack speed|reload speed/i,    category:"damage",    points:12, label:"attack speed",       note:"More attacks per second — direct DPS increase." },
    { match: /maximum life/i,                 category:"defense",   points:10, label:"maximum life",       note:"Survivability — always a priority." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance|all resistances/i, category:"resistance", points:9, label:"elemental resistance", note:"Helps cap your resistances." },
    { match: /strength|dexterity|intelligence/i, category:"attributes", points:7, label:"attributes",     note:"Required for gem and gear stat requirements." },
    { match: /movement speed/i,               category:"mobility",  points:18, label:"movement speed",    note:"Critical for survival and map clearing." },
    { match: /spell damage/i,                 category:"synergy",   points:-7, label:"spell damage",      note:"Likely not useful for an attack build." },
  ];
}

function defaultSlotRules() {
  return {
    weapon:  { damage:1.55, synergy:1.45, defense:0.35, resistance:0.25, mobility:0.1 },
    offhand: { damage:1.25, synergy:1.35, attributes:1.0, resistance:0.8, defense:0.6 },
    quiver:  { damage:1.25, synergy:1.40, attributes:1.0, resistance:0.8, defense:0.6 },
    boots:   { mobility:1.8, defense:1.1, resistance:1.1, attributes:1.0, damage:0.45 },
    gloves:  { damage:1.25, synergy:1.25, defense:0.9, resistance:0.9, attributes:1.0 },
    helmet:  { defense:1.15, resistance:1.15, attributes:1.1, synergy:0.7 },
    body:    { defense:1.4, resistance:1.0, attributes:0.8, damage:0.35 },
    ring:    { resistance:1.3, attributes:1.25, damage:0.9, synergy:0.9 },
    amulet:  { attributes:1.35, damage:1.0, synergy:1.0, resistance:1.0 },
    belt:    { defense:1.3, resistance:1.15, attributes:0.8 },
  };
}

function defaultQuarterstaffRules() {
  return [
    { match: /adds .* damage to attacks|physical damage to attacks|increased physical damage|melee physical damage/i, category: "damage", points: 14, label: "physical damage", note: "Flat attack damage scales Quarterstaff base hits." },
    { match: /lightning damage to attacks|adds .* lightning damage/i, category: "synergy", points: 16, label: "lightning damage", note: "Lightning damage synergizes with Monk shock and skill combos." },
    { match: /cold damage to attacks|adds .* cold damage/i, category: "synergy", points: 14, label: "cold damage", note: "Cold damage provides freeze and elemental strike synergy." },
    { match: /fire damage to attacks|adds .* fire damage/i, category: "synergy", points: 10, label: "fire damage", note: "Elemental attack damage adds to overall melee DPS." },
    { match: /attack speed/i, category: "damage", points: 15, label: "attack speed", note: "High attack speed is vital for Quarterstaff combo flow and responsiveness." },
    { match: /accuracy rating|accuracy/i, category: "damage", points: 13, label: "accuracy rating", note: "Accuracy rating ensures attacks hit and prevents damage loss from misses." },
    { match: /critical hit chance|critical strike chance|critical damage bonus|critical multiplier/i, category: "damage", points: 13, label: "critical stats", note: "Scales Quarterstaff critical strikes." },
    { match: /maximum life/i, category: "defense", points: 11, label: "maximum life", note: "Melee characters need strong life pools for close-range survival." },
    { match: /evasion rating/i, category: "defense", points: 10, label: "evasion rating", note: "Primary defense for Monk / Dexterity bases." },
    { match: /energy shield/i, category: "defense", points: 8, label: "energy shield", note: "Secondary defense for Monk (Dex/Int hybrid)." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance/i, category: "resistance", points: 8, label: "elemental resistance", note: "Helps cap your elemental resistances." },
    { match: /all elemental resistances|all resistances/i, category: "resistance", points: 16, label: "all elemental resistances", note: "Efficiently caps resistances across slots." },
    { match: /strength|dexterity|intelligence/i, category: "attributes", points: 8, label: "attributes", note: "Dexterity and Intelligence for Monk gems, Strength for life/gear requirements." },
    { match: /movement speed/i, category: "mobility", points: 18, label: "movement speed", note: "Essential for engaging and repositioning in melee combat." },
    { match: /bow skills|projectile skills|quiver|crossbow/i, category: "synergy", points: -12, label: "ranged/bow stats", note: "Useless for a Quarterstaff melee Monk." },
    { match: /spell damage|minion damage/i, category: "synergy", points: -8, label: "spell/minion damage", note: "Off-plan for an attack-based Monk." },
  ];
}

function defaultQuarterstaffSlotRules() {
  return {
    weapon: { damage: 1.6, synergy: 1.5, defense: 0.2, resistance: 0.2, mobility: 0.1 },
    boots: { mobility: 1.85, defense: 1.1, resistance: 1.1, attributes: 1.0, damage: 0.4 },
    gloves: { damage: 1.35, synergy: 1.3, defense: 0.9, resistance: 0.9, attributes: 1.0 },
    helmet: { defense: 1.15, resistance: 1.15, attributes: 1.15, synergy: 0.7 },
    body: { defense: 1.45, resistance: 1.0, attributes: 0.8, damage: 0.3 },
    ring: { resistance: 1.3, attributes: 1.25, damage: 1.0, synergy: 1.0 },
    amulet: { attributes: 1.35, damage: 1.05, synergy: 1.05, resistance: 1.0 },
    belt: { defense: 1.3, resistance: 1.15, attributes: 0.9 },
  };
}

const DEFAULT_PROFILES = {
  quarterstaffMonk: {
    name: "Quarterstaff Monk Leveling",
    slots: ["weapon", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"],
    focus: { quarterstaff: true, monk: true, melee: true, attack: true, bow: false, quiver: false, crossbow: false },
    baseWeights: { damage: 1.15, defense: 1.0, attributes: 1.05, resistance: 1.0, mobility: 1.2, synergy: 1.25 },
    stages: {
      act1_2: { label: "Act 1-2 Bridge (1-21)", damage: 1.1, defense: 0.9, attributes: 1.2, resistance: 0.8, mobility: 1.25, synergy: 1.1 },
      act2_swap: { label: "Storm Wave Swap (22-41)", damage: 1.2, defense: 1.0, attributes: 1.1, resistance: 1.0, mobility: 1.15, synergy: 1.3 },
      endgame: { label: "Endgame", damage: 1.25, defense: 1.25, attributes: 0.8, resistance: 1.2, mobility: 1.0, synergy: 1.45 },
    },
    statRules: defaultQuarterstaffRules(),
    slotRules: defaultQuarterstaffSlotRules(),
  },
  frostCrossbow: {
    name:"Frost Crossbow / Bow",
    slots:["weapon","quiver","helmet","body","gloves","boots","ring","amulet","belt"],
    baseWeights:{ damage:1.0, defense:1.0, attributes:1.0, resistance:1.0, mobility:1.0, synergy:1.25 },
    stages:{
      leveling:  { label:"Leveling / Campaign", damage:1.0, defense:0.9, attributes:1.35, resistance:0.9, mobility:1.25, synergy:1.2 },
      earlyMaps: { label:"Early Maps",          damage:1.1, defense:1.15, attributes:1.0,  resistance:1.35, mobility:1.1, synergy:1.25 },
      endgame:   { label:"Endgame",             damage:1.25, defense:1.25, attributes:0.8, resistance:1.2,  mobility:1.0, synergy:1.45 },
    },
    statRules: defaultFrostRules(),
    slotRules: defaultSlotRules(),
  },
  genericAttack: {
    name:"Generic Attack",
    slots:["weapon","offhand","helmet","body","gloves","boots","ring","amulet","belt"],
    baseWeights:{ damage:1, defense:1, attributes:1, resistance:1, mobility:1, synergy:1 },
    stages:{
      leveling:  { label:"Leveling / Campaign", damage:1.0, defense:0.9, attributes:1.25, resistance:0.9, mobility:1.2, synergy:1.0 },
      earlyMaps: { label:"Early Maps",          damage:1.1, defense:1.15, attributes:1.0,  resistance:1.3, mobility:1.0, synergy:1.0 },
      endgame:   { label:"Endgame",             damage:1.25, defense:1.25, attributes:0.8, resistance:1.2, mobility:1.0, synergy:1.1 },
    },
    statRules: defaultGenericRules(),
    slotRules: defaultSlotRules(),
  },
};

// ─── Item parsing (Loaded from parser.js) ─────────────────────────────────────

function accuracyMultiplier(hitChance) {
  if (hitChance === null || hitChance === undefined) return 1.0;
  if (hitChance >= 95) return 0.15; // near-zero value
  if (hitChance >= 90) return 0.5;  // medium value
  if (hitChance <= 70) return 2.0;  // critical: hit chance is terrible, over 30% attacks miss
  if (hitChance <= 80) return 1.6;  // notable miss rate
  return 1.0;                       // full value
}

function getResistWarning(scored, resistances, playerLevel = 1) {
  if (!resistances) return null;
  const lvl = Number(playerLevel) || Number(currentSession.playerLevel) || 1;
  const fire = Number(resistances.fire) || 0;
  const cold = Number(resistances.cold) || 0;
  const lightning = Number(resistances.lightning) || 0;

  const itemText = String(scored.item.raw || "").toLowerCase();
  const helped = [];
  ["Fire", "Lightning", "Cold"].forEach(name => {
    const regex = new RegExp(`\\+?\\d+%\\s*to\\s*(all\\s+elemental|${name.toLowerCase()})\\s*resistance`, "i");
    if (regex.test(itemText)) helped.push(name);
  });

  if (lvl >= 65) {
    // Maps / Endgame: 75% cap is mandatory and critical
    const uncapped = [];
    if (fire < 75) uncapped.push({ name: "Fire", val: fire });
    if (lightning < 75) uncapped.push({ name: "Lightning", val: lightning });
    if (cold < 75) uncapped.push({ name: "Cold", val: cold });
    if (uncapped.length === 0) return null;

    const severe = uncapped.filter(c => c.val < 0);
    const critList = severe.length ? severe : uncapped;
    const critStr = critList.map(c => `${c.name} (${c.val}%)`).join(" & ");

    if (helped.length === 0) {
      return `Endgame warning: ${critStr} below 75% map cap. This item does not help resistances — defense is critical for maps.`;
    } else {
      const remaining = uncapped.filter(c => !helped.includes(c.name));
      if (remaining.length === 0) {
        return `This item helps cap your endgame resistances (${helped.join(", ")}).`;
      } else {
        const remStr = remaining.map(c => `${c.name} (${c.val}%)`).join(" & ");
        return `This item adds ${helped.join(" & ")} resistance, but ${remStr} still below 75% map cap.`;
      }
    }
  } else if (lvl <= 25) {
    // Early Leveling / Act 1-2 (e.g. Level 16):
    // 75% is NOT required or critical! Only severe negative resists (< -15%) get a mild note.
    const severeNegative = [];
    if (fire < -15) severeNegative.push({ name: "Fire", val: fire });
    if (lightning < -15) severeNegative.push({ name: "Lightning", val: lightning });
    if (cold < -15) severeNegative.push({ name: "Cold", val: cold });

    if (severeNegative.length > 0) {
      const negStr = severeNegative.map(c => `${c.name} (${c.val}%)`).join(" & ");
      if (helped.length > 0) {
        return `Act 2 note: Adds ${helped.join(" & ")} resistance, helping patch negative ${negStr}.`;
      } else {
        return `Act 2 note: ${negStr} is negative. Look for a resist ring or bench mod, but prioritize weapon flat damage and life.`;
      }
    }

    if (helped.length > 0) {
      return `This item adds ${helped.join(" & ")} resistance (nice bonus for Act 2).`;
    }
    return null;
  } else {
    // Mid Campaign (Level 26–64, Act 3 to Cruel):
    const target = lvl <= 40 ? 45 : 65;
    const belowTarget = [];
    if (fire < 0) belowTarget.push({ name: "Fire", val: fire });
    if (lightning < 0) belowTarget.push({ name: "Lightning", val: lightning });
    if (cold < 0) belowTarget.push({ name: "Cold", val: cold });

    if (belowTarget.length === 0) {
      if (helped.length > 0) return `This item adds ${helped.join(" & ")} resistance towards your ~${target}% campaign target.`;
      return null;
    }

    const str = belowTarget.map(c => `${c.name} (${c.val}%)`).join(" & ");
    if (helped.length === 0) {
      return `Campaign note: ${str} is negative. Pick up resistances on rings or belt without sacrificing core weapon damage.`;
    } else {
      const remaining = belowTarget.filter(c => !helped.includes(c.name));
      if (remaining.length === 0) {
        return `This item helps improve your campaign resistances (${helped.join(", ")}).`;
      } else {
        return `This item adds ${helped.join(" & ")} resistance; ${remaining.map(c => c.name).join(" & ")} still negative.`;
      }
    }
  }
}

function scoreItem(item, profile, slot, stageKey) {
  const scores = Object.fromEntries(SCORE_KEYS.map(k=>[k,0]));
  const hits = [], warnings = [];
  const sw = profile.stages[stageKey] || {};
  const lw = (profile.slotRules||defaultSlotRules())[slot] || {};
  const used = new Set();
  const rules = profile.statRules || [];

  const keystones = currentSession.keystones || [];
  const hasBloodMagic = keystones.some(k => /blood magic/i.test(k));
  const hasPreciseTechnique = keystones.some(k => /precise technique/i.test(k));

  for (const line of item.mods) {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (!rule.match.test(line)) continue;
      const key = `${line.toLowerCase()}::${rule.category}`;
      if (used.has(key)) continue;
      used.add(key);

      let basePoints = rule.points;
      let overrideNote = rule.note;

      // Bonded mods are conditional — only active when matching bonded piece is equipped
      if (/^bonded:/i.test(line)) {
        basePoints = Math.round(basePoints * 0.3);
        overrideNote = `(Bonded — only active with the matching item) ${overrideNote}`;
      }

      // Dynamic keystone overrides
      if (hasBloodMagic && /maximum mana|mana regeneration|mana reservation/i.test(line)) {
        basePoints = -10;
        overrideNote = "⚠️ Blood Magic removes Mana. Mana stats are useless.";
      }
      if (hasPreciseTechnique && /critical hit chance|critical damage/i.test(line)) {
        basePoints = -10;
        overrideNote = "⚠️ Precise Technique prevents Critical Strikes. Crit is useless.";
      }
      const stageText = `${stageKey || ""} ${sw?.label || ""} ${activeProfile?.name || ""}`.toLowerCase();
      if (!hasPreciseTechnique && /critical hit chance|critical damage/i.test(line) && /non[-\s]?crit|early|midgame/.test(stageText) && !/crit hybrid|uber endgame/.test(stageText)) {
        basePoints = Math.min(basePoints, 2);
        overrideNote = "Low priority in this non-crit stage — flat cold/physical damage and attack speed usually matter more.";
      }
      if (hasPreciseTechnique && /accuracy rating/i.test(line)) {
        basePoints = Math.max(basePoints, 15);
        overrideNote = "Accuracy rating (highly valued for Precise Technique).";
      }

      if (/accuracy|accuracy rating/i.test(rule.match.source || String(rule.match)) && !hasPreciseTechnique) {
        const mult = accuracyMultiplier(currentSession.hitChance);
        basePoints = Math.round(basePoints * mult);
      }

      // Tier quality multiplier — rewards high-roll mods, penalises low-roll ones
      const tierInfo = item.modTierMap?.get(line) || null;
      const tierMult = (typeof tierScoreMultiplier === "function") ? tierScoreMultiplier(tierInfo) : 1.0;

      const leagueWeight  = lw[rule.category] ?? 1;
      const stageWeight   = sw[rule.category] ?? profile.baseWeights?.[rule.category] ?? 1;
      const actMult       = actContextMult(rule.category);
      const pts = Math.round(basePoints * leagueWeight * stageWeight * tierMult * actMult);
      scores[rule.category] += pts;
      hits.push({ line, category:rule.category, points:pts, note:overrideNote, ruleIndex: i, tierInfo });
      if (pts < 0) warnings.push(overrideNote);
    }
  }
  return { item, scores, total:Object.values(scores).reduce((a,b)=>a+b,0), hits, warnings };
}

function checkWaystoneDanger(item, profile = {}) {
  const dangers = [];
  const warnings = [];
  const mods = (item.mods || []).concat(item.explicits || []);
  const text = mods.join("\n").toLowerCase();
  const focus = profile.focus || {};

  // Reflect checks
  const hasEleReflect = /reflect.*(?:elemental|fire|cold|lightning)|monsters reflect.*elemental/i.test(text);
  const hasPhysReflect = /reflect.*physical|monsters reflect.*physical/i.test(text);

  if (hasEleReflect) {
    if (focus.elemental || focus.fire || focus.cold || focus.lightning || profile.name?.toLowerCase().includes("frost")) {
      dangers.push("⛔ DEADLY: Monsters reflect Elemental Damage (build scales elemental damage)");
    } else {
      warnings.push("⚠️ Monsters reflect Elemental Damage");
    }
  }

  if (hasPhysReflect) {
    if (focus.physical) {
      dangers.push("⛔ DEADLY: Monsters reflect Physical Damage (build scales physical damage)");
    } else {
      warnings.push("⚠️ Monsters reflect Physical Damage");
    }
  }

  // Recovery / Regen
  if (/players cannot regenerate life|cannot regenerate mana|no life or mana recovery/i.test(text)) {
    dangers.push("⛔ DEADLY: Players cannot regenerate Life or Mana");
  } else if (/reduced (?:life|mana) recovery rate|reduced recovery rate of life/i.test(text)) {
    warnings.push("⚠️ Reduced Life/Mana Recovery Rate");
  }

  // Max resistances
  if (/-(?:\d+)% to maximum (?:all|elemental|player) resistances|maximum player resistances are reduced/i.test(text)) {
    dangers.push("⛔ LETHAL: Minus to Maximum Player Resistances");
  }

  // Curses
  if (/players are cursed with/i.test(text)) {
    const curseMatch = text.match(/players are cursed with ([a-zA-Z\s]+)/i);
    warnings.push(`⚠️ Cursed Map: ${curseMatch ? curseMatch[1].trim() : "Curse applied"}`);
  }

  // Monster crits / added elemental
  if (/monsters have \+?\d+% (?:increased )?critical strike chance|increased critical damage/i.test(text)) {
    warnings.push("⚠️ High Monster Crit Chance / Multiplier");
  }
  if (/monsters deal \d+% extra (?:damage as )?(?:fire|cold|lightning|chaos)/i.test(text)) {
    warnings.push("⚠️ Monster Added Elemental/Chaos Damage");
  }

  return {
    lethal: dangers.length > 0,
    dangers,
    warnings,
  };
}

function analyzeSoulCore(item, profile = {}, session = {}) {
  const socketBonuses = item.socketBonuses || {};
  const weaponBonus = socketBonuses.weapon || "";
  const armourBonus = socketBonuses.armour || "";
  const focus = profile.focus || {};
  const res = session.resistances || {};
  const lvl = Number(session.playerLevel) || 1;
  const isEndgame = lvl >= 65;
  const target = isEndgame ? 75 : lvl <= 20 ? 25 : lvl <= 35 ? 40 : 55;
  const underTarget = (Number(res.fire) || 0) < target || (Number(res.cold) || 0) < target || (Number(res.lightning) || 0) < target;

  let weaponFit = "neutral";
  let armourFit = "neutral";
  let recTone = "good";
  let recText = "";

  const wLower = weaponBonus.toLowerCase();
  const aLower = armourBonus.toLowerCase();

  if ((focus.chaos && wLower.includes("chaos")) ||
      (focus.fire && wLower.includes("fire")) ||
      (focus.cold && (wLower.includes("cold") || wLower.includes("freeze"))) ||
      (focus.lightning && (wLower.includes("lightning") || wLower.includes("shock"))) ||
      (focus.physical && wLower.includes("physical")) ||
      wLower.includes("attack speed") || wLower.includes("critical")) {
    weaponFit = "great";
  }

  if (aLower.includes("resist") || aLower.includes("armour") || aLower.includes("energy shield") || aLower.includes("evasion") || aLower.includes("life")) {
    armourFit = underTarget ? "great" : "good";
  }

  if (weaponFit === "great" && armourFit === "great") {
    recText = isEndgame
      ? "Top-tier Soul Core! Excellent scaling for your weapon and solves armour defense/resist needs."
      : "Great Soul Core! Socket in Weapon for faster clear, or Armour for campaign defenses.";
  } else if (weaponFit === "great") {
    recText = "Recommended: Socket in Weapon to scale your primary damage type.";
  } else if (armourFit === "great") {
    recText = isEndgame
      ? "Recommended: Socket in Armour to cap your elemental/chaos resistances for maps."
      : "Recommended: Socket in Armour for added defensive padding during campaign.";
  } else {
    recTone = "warn";
    recText = "Secondary value for current build. Keep for 3-to-1 vendor reforge (0.5.5) or extract via Desecration.";
  }

  return {
    weaponBonus,
    armourBonus,
    weaponFit,
    armourFit,
    recommendation: recText,
    verdict: {
      tone: recTone,
      label: recTone === "good" ? "Valuable Soul Core" : "Reforge / Crafting Core",
      opinion: recText,
    },
  };
}

function getVerdict(scored, playerLevel, compDelta) {
  const item = scored.item;
  const slot = item.slot;

  if (slot === "uncut_skill" || slot === "uncut_support") {
    const kind = slot === "uncut_support" ? "support" : "skill";
    return { tone: "good", label: `Build ${kind} choice`, opinion: `Compare the current PoB setup with the selected Mobalytics stage before engraving this uncut ${kind} gem.` };
  }

  if (slot === "waystone") {
    const danger = checkWaystoneDanger(item, activeProfile);
    if (danger.lethal) {
      return { tone: "bad", label: "DEADLY WAYSTONE", opinion: danger.dangers[0] + ". Reroll before running!" };
    }
    if (danger.warnings.length) {
      return { tone: "warn", label: "Hazardous Waystone", opinion: danger.warnings[0] + ". Run with caution." };
    }
    const t = item.waystoneTier ? `Tier ${item.waystoneTier}` : "Map";
    return { tone: "good", label: "Safe Waystone", opinion: `${t} Waystone has clean affixes with no lethal modifiers for your build.` };
  }

  if (slot === "soul_core") {
    const analysis = analyzeSoulCore(item, activeProfile, currentSession);
    return analysis.verdict;
  }

  if (slot === "ultimatum") {
    if (item.ultimatumReward) {
      return { tone: "good", label: "Trial of Chaos Wager", opinion: `Reward: ${item.ultimatumReward}. 0.5.5 Trial has 30 rooms (currency & cores only).` };
    }
    return { tone: "warn", label: "Inscribed Ultimatum", opinion: "Examine wager risk against potential currency and soul core returns (0.5.5 Trial of Chaos)." };
  }

  if (slot === "tablet") {
    return { tone: "good", label: "Stackable Tablet", opinion: "Stack with multiple tablets in the Map Device (0.5.5 Ritual overhaul) to boost altars & wisps." };
  }

  if (slot === "rune") {
    return { tone: "good", label: "Runesmithing Rune", opinion: "Use at the Runesmith to craft onto equipment sockets (Runes of Aldur now core in 0.5.5)." };
  }

  const unmet = [];
  if (scored.item.reqLevel && scored.item.reqLevel > playerLevel) unmet.push(`Level ${scored.item.reqLevel} (you are ${playerLevel})`);
  if (scored.item.reqStr && scored.item.reqStr > (currentSession.playerStr || 0)) unmet.push(`Str ${scored.item.reqStr} (you have ${currentSession.playerStr || 0})`);
  if (scored.item.reqDex && scored.item.reqDex > (currentSession.playerDex || 0)) unmet.push(`Dex ${scored.item.reqDex} (you have ${currentSession.playerDex || 0})`);
  if (scored.item.reqInt && scored.item.reqInt > (currentSession.playerInt || 0)) unmet.push(`Int ${scored.item.reqInt} (you have ${currentSession.playerInt || 0})`);
  
  if (unmet.length) {
    const isFarFuture = scored.item.reqLevel && (scored.item.reqLevel > playerLevel + 10);
    const label = isFarFuture ? "Future endgame item — stash" : "Future item — save for later";
    return { tone: "warn", label, opinion: `Unmet requirements: ${unmet.join(", ")}.` };
  }

  if (compDelta !== null) {
    if (compDelta > 20)  return { tone:"good", label:"Equip now",          opinion:"Significantly better than your equipped piece for this build." };
    if (compDelta >= 5)  return { tone:"good", label:"Clear upgrade",      opinion:"Solid improvement over your equipped piece. Check the stat breakdown below." };
    if (compDelta >= -5) return { tone:"warn", label:"Sidegrade",          opinion:"Very similar to your equipped piece. Check which stats you'd be trading." };
    if (compDelta >= -20)return { tone:"bad",  label:"Keep equipped item", opinion:"Your equipped piece is better for this build. Hold onto it." };
    return               { tone:"bad",  label:"Vendor / sell",             opinion:"Clearly weaker than your equipped piece. Safe to vendor." };
  }

  const t = scored.total;
  if (t >= 35) return { tone:"good", label:"Strong item",   opinion:"Multiple high-value stats for your build. Strong pickup." };
  if (t >= 18) return { tone:"good", label:"Good item",     opinion:"Solid stats for your build. Check the Pros below for what makes it good." };
  if (t >= 6)  return { tone:"warn", label:"Decent",        opinion:"Some useful stats, but nothing standout. Worth equipping if it solves a gap." };
  if (t >= -5) return { tone:"warn", label:"Neutral",       opinion:"Limited value for this build. Check if any specific stat helps you right now." };
  return             { tone:"bad",  label:"Skip",           opinion:"Few or no relevant stats for your build. Not worth equipping." };
}

function getConfidence(scored, savedItem, compDelta) {
  if (!savedItem) return null;
  const isNameOnly = !savedItem.item.mods || savedItem.item.mods.length === 0;

  if (isNameOnly) {
    return { level: "Low", text: "Equipped item was imported as a name only (no affixes)." };
  }

  const absDelta = Math.abs(compDelta);
  if (absDelta > 15) {
    return { level: "High", text: "Both items fully parsed, decisive score gap." };
  }

  const copiedDamage = scored.scores.damage || 0;
  const equippedDamage = savedItem.scores.damage || 0;
  const copiedResist = scored.scores.resistance || 0;
  const equippedResist = savedItem.scores.resistance || 0;

  const damageTrade = (copiedDamage > equippedDamage && copiedResist < equippedResist) ||
                     (copiedDamage < equippedDamage && copiedResist > equippedResist);

  if (damageTrade || (absDelta >= 5 && absDelta <= 15)) {
    return { level: "Medium", text: "Item trades damage for resistance. Try in-game." };
  }

  return { level: "Medium", text: "Close comparison, check category breakdown." };
}

// ─── PoE mod colouring ────────────────────────────────────────────────────────

function modClass(line) {
  const l = line.toLowerCase();
  if (/fire resist|fire damage|adds.*fire/i.test(l))        return "fire";
  if (/cold resist|cold damage|adds.*cold|ice|frost/i.test(l)) return "cold";
  if (/lightning resist|lightning damage|adds.*lightning/i.test(l)) return "lightning";
  if (/chaos resist|chaos damage/i.test(l))                 return "chaos";
  if (/maximum life|\+.*to.*life/i.test(l))                 return "life";
  if (/movement speed/i.test(l))                            return "move";
  if (/physical damage|adds.*physical/i.test(l))            return "phys";
  // Spell/minion damage isn't universally bad — it's negative only for attack
  // builds. Check the imported build's detected focus rather than hardcoding
  // "neg", which used to mislabel minion damage on minion builds as bad.
  if (/spell damage/i.test(l) && !activeProfile?.focus?.minion)           return "neg";
  return "";
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────


function tierRelClass(ti) {
  if (!ti || ti.tierCount <= 1) return "t1";
  const pct = (ti.tier - 1) / (ti.tierCount - 1); // 0=best, 1=worst
  if (pct < 0.20) return "t1";
  if (pct < 0.45) return "t2";
  if (pct < 0.70) return "t3";
  return "tN";
}

function tierBadgeHtml(ti) {
  if (!ti) return "";
  const cls   = tierRelClass(ti);
  const label = ti.tierCount > 1 ? `T${ti.tier}/${ti.tierCount}` : `T${ti.tier}`;
  const name  = ti.tierName ? ` "${ti.tierName}"` : "";
  const title = `${esc(ti.label)}${name}: T${ti.tier} of ${ti.tierCount} — roll ${esc(ti.min)}–${esc(ti.max)}, you got ${esc(ti.value)} (${esc(ti.rollPct)}% of tier)`;
  return `<span class="tier-badge ${cls}" title="${title}">${label} <span class="tier-roll">${ti.rollPct}%</span></span>`;
}

function slotLabel(k) {
  const m = {
    body: "Body Armor",
    quiver: "Quiver",
    offhand: "Offhand",
    flask: "Flask",
    charm: "Charm",
    soul_core: "Soul Core",
    rune: "Rune",
    tablet: "Precursor / Ritual Tablet",
    waystone: "Waystone",
    ultimatum: "Inscribed Ultimatum",
    jewel: "Jewel",
    relic: "Relic",
  };
  return m[k] || String(k).charAt(0).toUpperCase() + String(k).slice(1);
}

// ─── Item tooltip renderer ────────────────────────────────────────────────────

function renderTooltip(item, isEquipped = false) {
  const rarity = String(item.rarity||"Normal").toLowerCase().replace(/\s+/g,"-");
  const prefix = isEquipped ? "eq-tooltip" : "item";

  // Rarity gradient panel
  const panelId = isEquipped ? "equipped-tooltip" : "item-tooltip";
  const panel = document.getElementById(panelId);
  if (panel) panel.className = rarity;

  // Header accent
  const header = panel ? panel.querySelector(".item-header") : null;
  if (header) header.className = `item-header ${rarity}`;

  // Name / base
  const nameEl = document.getElementById(`${prefix}-name`);
  if (nameEl) {
    nameEl.textContent = item.names[0] || "Unknown Item";
    nameEl.className = `item-name ${rarity}`;
  }
  const baseEl = document.getElementById(`${prefix}-base`);
  if (baseEl) baseEl.textContent = item.names.length > 1 ? item.names[1] : "";

  // Meta (ilvl, quality)
  const meta = [];
  if (item.ilvl) meta.push(`<div class="ilvl-line">Item Level: <span style="color:#fff">${esc(item.ilvl)}</span></div>`);
  if (item.quality) meta.push(`<div class="prop-row"><span class="prop-label">Quality:</span><span class="prop-val aug">${esc(item.quality.trim())}%</span></div>`);
  const metaEl = document.getElementById(`${prefix}-meta`);
  if (metaEl) metaEl.innerHTML = meta.join("");

  // Requirements
  let reqHtml = "";
  if (item.reqLevel || item.reqStr || item.reqDex || item.reqInt) {
    const parts = [];
    if (item.reqLevel) parts.push(`Level <span class="req-val ${item.reqLevel > (currentSession.playerLevel||1) ? "unmet":""}">${item.reqLevel}</span>`);
    if (item.reqStr)   parts.push(`<span class="req-val">${item.reqStr}</span> Str`);
    if (item.reqDex)   parts.push(`<span class="req-val">${item.reqDex}</span> Dex`);
    if (item.reqInt)   parts.push(`<span class="req-val">${item.reqInt}</span> Int`);
    reqHtml = `<div class="req-line">Requires: ${parts.join(", ")}</div>`;
  }
  const reqsEl = document.getElementById(`${prefix}-reqs`);
  if (reqsEl) reqsEl.innerHTML = reqHtml;
  const sepReqs = document.getElementById(isEquipped ? "eq-sep-reqs" : "sep-reqs");
  if (sepReqs) sepReqs.style.display = reqHtml ? "" : "none";

  // Properties (armour / evasion / damage etc)
  const propsHtml = item.propLines.map(l => {
    const m = l.match(/^([^:]+):\s*(.+)$/);
    if (!m) return "";
    return `<div class="prop-row"><span class="prop-label">${esc(m[1])}:</span><span class="prop-val aug">${esc(m[2])}</span></div>`;
  }).join("");
  const propsEl = document.getElementById(`${prefix}-props`);
  if (propsEl) propsEl.innerHTML = propsHtml;
  const sepProps = document.getElementById(isEquipped ? "eq-sep-props" : "sep-props");
  if (sepProps) sepProps.style.display = propsHtml ? "" : "none";

  // Implicits
  const implHtml = item.implicits.map((l, i) => {
    return `<div class="affix-line ${modClass(l)}">${esc(l)}</div>`;
  }).join("");
  const implicitsEl = document.getElementById(`${prefix}-implicits`);
  if (implicitsEl) implicitsEl.innerHTML = implHtml;
  const sepImplicits = document.getElementById(isEquipped ? "eq-sep-implicits" : "sep-implicits");
  if (sepImplicits) sepImplicits.style.display = (implHtml && item.explicits.length) ? "" : "none";

  // Explicits
  const explHtml = item.explicits.map((l, i) => {
    return `<div class="affix-line ${modClass(l)}">${esc(l)}</div>`;
  }).join("");
  const affixesEl = document.getElementById(`${prefix}-affixes`);
  if (affixesEl) affixesEl.innerHTML = explHtml || (item.mods.length === 0 ? '<div class="affix-line plain" style="color:var(--poe-muted);font-style:italic">Unidentified</div>' : "");
}

// ─── PoB-style per-stat delta comparison ─────────────────────────────────────

function getStatSignature(line) {
  // Strip leading +/- only if attached to a digit
  let sig = line.replace(/[-+]\s*(\d)/g, "$1");
  // Replace all numbers (with optional decimals) with '#'
  sig = sig.replace(/\d+(?:\.\d+)?/g, "#");
  // Normalize spaces and lowercase
  return sig.toLowerCase().replace(/\s+/g, " ").trim();
}

function getStatValues(line) {
  const matches = line.match(/[-+]?\d+(?:\.\d+)?/g) || [];
  const numbers = matches.map(Number).filter(n => !isNaN(n));
  if (numbers.length === 0) return null;
  if (numbers.length === 2) {
    return (numbers[0] + numbers[1]) / 2;
  }
  return numbers[0];
}

function getStatImportance(line) {
  const rules = activeProfile?.statRules || [];
  for (const rule of rules) {
    if (rule.match.test(line)) {
      return rule.points || 0;
    }
  }
  return 0;
}

function formatModDelta(line, delta, type) {
  if (delta === null || delta === undefined) {
    if (type === "new") return `+ ${line}`;
    if (type === "lost") return `− ${line}`;
    return line;
  }

  const roundedVal = delta % 1 !== 0 ? Math.round(delta * 10) / 10 : Math.round(delta);
  const absVal = Math.abs(roundedVal);
  
  if (roundedVal < 0) {
    // Range matching (e.g. "Adds 24 to 42 Physical Damage")
    const rangeMatch = line.match(/(?:Adds\s+)?[-+]?\d+\s+to\s+[-+]?\d+\s+(.+)/i);
    if (rangeMatch) {
      return `Loses ${absVal} ${rangeMatch[1]}`;
    }
    
    // Non-range matching (e.g. "+80% to Fire Resistance")
    const match = line.match(/[-+]?[0-9]+\.?[0-9]*%?/);
    if (!match) {
      return `Loses ${line}`;
    }
    const numStr = match[0];
    const index = line.indexOf(numStr);
    const prefix = line.substring(0, index);
    const suffix = line.substring(index + numStr.length);
    
    const isPercent = numStr.includes("%");
    const unit = isPercent ? "%" : "";
    
    const cleanPrefix = prefix.replace(/[-+\s]+/g, "").trim();
    const cleanSuffix = suffix.replace(/[-+\s]+/g, " ").trim();
    const joined = [cleanPrefix, cleanSuffix].filter(Boolean).join(" ");
    return `Loses ${absVal}${unit} ${joined}`.trim();
  }

  // Positive changes
  const sign = roundedVal > 0 ? "+" : "";
  const rangeMatch = line.match(/(?:Adds\s+)?[-+]?\d+\s+to\s+[-+]?\d+\s+(.+)/i);
  if (rangeMatch) {
    const statName = rangeMatch[1];
    if (line.toLowerCase().startsWith("adds")) {
      return `Adds ${sign}${absVal} ${statName}`;
    }
    return `${sign}${absVal} ${statName}`;
  }

  const match = line.match(/[-+]?[0-9]+\.?[0-9]*%?/);
  if (!match) {
    return `+ ${line}`;
  }
  const numStr = match[0];
  const index = line.indexOf(numStr);
  const prefix = line.substring(0, index);
  const suffix = line.substring(index + numStr.length);
  
  const isPercent = numStr.includes("%");
  const unit = isPercent ? "%" : "";

  if (prefix.trim() === "" || /^[-+]$/.test(prefix.trim())) {
    return `${sign}${absVal}${unit}${suffix}`;
  }
  
  return `${prefix}${sign}${absVal}${unit}${suffix}`;
}

function buildStatDelta(newItem, equippedItem) {
  const newMap = new Map();   // sig → { value, line }
  const eqMap  = new Map();

  const newMods = [...(newItem.implicits || []), ...(newItem.explicits || [])];
  const eqMods  = [...(equippedItem.implicits || []), ...(equippedItem.explicits || [])];

  for (const mod of newMods) {
    const sig = getStatSignature(mod);
    const val = getStatValues(mod);
    if (sig && !newMap.has(sig)) {
      newMap.set(sig, { line: mod, value: val });
    }
  }

  for (const mod of eqMods) {
    const sig = getStatSignature(mod);
    const val = getStatValues(mod);
    if (sig && !eqMap.has(sig)) {
      eqMap.set(sig, { line: mod, value: val });
    }
  }

  const rows = [];
  const seen = new Set();

  for (const [sig, ns] of newMap) {
    seen.add(sig);
    const es = eqMap.get(sig);
    if (es) {
      // Shared stat
      let delta = null;
      if (ns.value !== null && es.value !== null) {
        delta = ns.value - es.value;
      }
      if (delta === 0) {
        // Shared stat has identical values -> skip
        continue;
      }
      if (ns.value === null && es.value === null) {
        // Shared stat has no numeric values and is identical -> skip
        continue;
      }
      const cls = delta >= 0 ? "positive" : "negative";
      const text = formatModDelta(ns.line, ns.value !== null && es.value !== null ? delta : null, "shared");
      rows.push({ line: ns.line, delta: delta !== null ? delta : 0, cls, text });
    } else {
      // New stat
      const cls = "positive";
      const text = formatModDelta(ns.line, ns.value, "new");
      rows.push({ line: ns.line, delta: ns.value !== null ? ns.value : 0, cls, text });
    }
  }

  for (const [sig, es] of eqMap) {
    if (seen.has(sig)) continue;
    // Lost stat
    const cls = "negative";
    const text = formatModDelta(es.line, es.value !== null ? -es.value : null, "lost");
    rows.push({ line: es.line, delta: es.value !== null ? -es.value : 0, cls, text });
  }

  // Sort by rules points (importance) descending first, then by absolute raw magnitude descending
  rows.sort((a, b) => {
    const impA = Math.abs(getStatImportance(a.line));
    const impB = Math.abs(getStatImportance(b.line));
    if (impB !== impA) return impB - impA;
    return Math.abs(b.delta) - Math.abs(a.delta);
  });

  return rows.slice(0, 10);
}

function uncutGemLevel(item) {
  const text = `${item?.names?.join(" ") || ""}\n${item?.raw || ""}`;
  return Number(text.match(/(?:Level|Tier)\s*[:(]?\s*(\d+)/i)?.[1] || 0) || null;
}

function gemCoachPlan(item, profile, stageKey, pobBuild) {
  const stage = profile?.stages?.[stageKey];
  const guide = stage?.data || stage || {};
  const guideSkills = Array.isArray(guide.skills) ? guide.skills : [];
  const currentGroups = Array.isArray(pobBuild?.skillGroups) ? pobBuild.skillGroups : [];
  const currentActive = new Set(currentGroups.map(group => String(group.name || "").toLowerCase()));
  const currentSupports = new Set(currentGroups.flatMap(group => group.supports || []).map(name => String(name).toLowerCase()));
  const type = item?.slot === "uncut_support" ? "support" : "skill";
  const recommendations = [];

  if (type === "support") {
    for (const skill of guideSkills) {
      for (const support of skill.supports || []) {
        if (!currentSupports.has(String(support).toLowerCase())) {
          recommendations.push({ gem: support, forSkill: skill.name, reason: "Recommended by the current Mobalytics stage and not found in the current PoB setup." });
        }
      }
    }
  } else {
    for (const skill of guideSkills) {
      const current = currentGroups.find(group => String(group.name || "").toLowerCase() === String(skill.name || "").toLowerCase());
      if (!currentActive.has(String(skill.name || "").toLowerCase())) {
        recommendations.push({ gem: skill.name, forSkill: "New active skill", reason: "Used by the current Mobalytics stage but not found in the current PoB setup." });
      } else if (uncutGemLevel(item) && Number(current?.level || 0) < uncutGemLevel(item)) {
        recommendations.push({ gem: skill.name, forSkill: "Upgrade existing gem", reason: `Current PoB gem is level ${current?.level || "unknown"}; this uncut gem is level ${uncutGemLevel(item)}.` });
      }
    }
  }

  return {
    type,
    level: uncutGemLevel(item),
    stageLabel: stage?.label || guide.label || stageKey,
    currentGroups,
    recommendations: recommendations.filter((entry, index, all) => all.findIndex(other => other.gem === entry.gem && other.forSkill === entry.forSkill) === index).slice(0, 10),
    hasMobalytics: profile?.source === "mobalytics" || Boolean(profile?.mobalytics),
  };
}

function renderGemCoachHtml(plan) {
  const current = plan.currentGroups.length
    ? plan.currentGroups.slice(0, 8).map(group => `<div style="margin:3px 0"><strong>${esc(group.name)}</strong>${group.level ? ` (Lvl ${esc(group.level)})` : ""}${group.supports?.length ? `<br><span style="color:var(--poe-muted)">Supports: ${group.supports.map(esc).join(" · ")}</span>` : ""}</div>`).join("")
    : `<div style="color:var(--warn)">No current PoB skill setup is loaded.</div>`;
  const recommended = plan.recommendations.length
    ? plan.recommendations.map((entry, index) => `<div style="margin:4px 0"><strong style="color:${index === 0 ? "var(--good)" : "var(--poe-gold)"}">${index === 0 ? "Best next choice: " : ""}${esc(entry.gem)}</strong> <span style="color:var(--poe-muted)">→ ${esc(entry.forSkill)}</span><br><span style="font-size:10px">${esc(entry.reason)}</span></div>`).join("")
    : `<div style="color:var(--warn)">${plan.hasMobalytics ? "No missing gem from this stage was detected; save the uncut gem or upgrade a listed skill when the cutting menu allows it." : "Import and select a Mobalytics build to receive build-specific choices."}</div>`;
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><strong style="color:var(--poe-gold)">Current PoB setup</strong>${current}</div><div><strong style="color:var(--poe-gold)">Mobalytics: ${esc(plan.stageLabel)}</strong>${recommended}</div></div><div style="margin-top:7px;color:var(--poe-muted);font-size:10px">Confirm the gem is enabled in the in-game cutting menu; level/tier and attribute limits still apply.</div>`;
}

// ─── Coach panel renderer ─────────────────────────────────────────────────────

function renderCoach(scored, compDelta, savedItem) {
  const slot     = slotSelect.value;
  const stageKey = stageSelect.value;
  const verdict  = getVerdict(scored, currentSession.playerLevel||1, compDelta);
  const isSpecialSlot = ["soul_core", "rune", "tablet", "waystone", "ultimatum", "uncut_skill", "uncut_support"].includes(slot);

  // Verdict badge
  const badge = document.getElementById("verdict-badge");
  badge.className = `verdict-badge ${verdict.tone}`;  // note: keep id
  badge.id = "verdict-badge";
  document.getElementById("verdict-icon").textContent  = verdict.tone==="good"?"✦":verdict.tone==="bad"?"✗":"◈";
  const vl = document.getElementById("verdict-label");
  vl.textContent = verdict.label;
  vl.className   = `verdict-label ${verdict.tone}`;
  document.getElementById("verdict-opinion").textContent = verdict.opinion;

  // 5-Dimension Evaluation & Archetype Gate
  const engine = typeof RecommendationEngine !== "undefined" ? RecommendationEngine : null;
  const dimRow = document.getElementById("dimensions-badge-row");
  if (engine && scored?.item && !isSpecialSlot) {
    const context = engine.resolveBuildContext({
      pobBuild: { stats: { level: currentSession.playerLevel, hitChance: currentSession.hitChance, resistances: currentSession.resistances } },
      profile: activeProfile,
      playerLevel: currentSession.playerLevel || 1,
    });

    if (!context.archetype.allowedSlots.includes(slot)) {
      badge.className = "verdict-badge bad";
      vl.textContent = "Off-Archetype Item";
      vl.className = "verdict-label bad";
      document.getElementById("verdict-opinion").textContent = `Your build is ${context.archetype.name} (${context.archetype.weaponLabel}). This slot is not used by your build.`;
    }

    if (dimRow) {
      const dim = engine.evaluateItemDimensions(scored.item, slot, context);
      const urgEl = document.getElementById("dim-urgency");
      const stageEl = document.getElementById("dim-stage-fit");
      const buildEl = document.getElementById("dim-build-fit");

      if (urgEl) {
        urgEl.textContent = `Urgency: ${dim.replaceUrgency}`;
        urgEl.className = `dim-chip ${dim.replaceUrgency === "Immediate Fix" ? "urgent" : dim.replaceUrgency === "Upgrade Priority" ? "warn" : "good"}`;
      }
      if (stageEl) {
        stageEl.textContent = `Stage: ${dim.stageFit} Fit`;
        stageEl.className = `dim-chip ${dim.stageFit === "Weak" || dim.stageFit === "Empty" ? "warn" : "good"}`;
      }
      if (buildEl) {
        buildEl.textContent = `Build: ${dim.buildFit}`;
        buildEl.className = `dim-chip ${dim.buildFit === "Contaminated" ? "urgent" : dim.buildFit === "Synergy" ? "good" : ""}`;
      }
      dimRow.style.display = "flex";
    }
  } else if (dimRow) {
    dimRow.style.display = "none";
  }

  // Urgent Needs Bar
  const needsDiv = document.getElementById("urgent-needs");
  if (needsDiv && currentSession.resistances) {
    const r = currentSession.resistances;
    const lvl = Number(currentSession.playerLevel) || 1;
    const fireVal = Number(r.fire) || 0;
    const coldVal = Number(r.cold) || 0;
    const lightVal = Number(r.lightning) || 0;

    const isEndgame = lvl >= 65;
    const target = isEndgame ? 75 : lvl <= 20 ? 25 : lvl <= 35 ? 40 : 55;
    const targetLabel = isEndgame ? "to cap" : `to target (${target}%)`;

    const fireGap = target - fireVal;
    const coldGap = target - coldVal;
    const lightGap = target - lightVal;

    const makeChip = (val, gap, label, emoji, elId) => {
      const el = document.getElementById(elId);
      if (!el) return;
      if (gap > 0) {
        const isUrgent = isEndgame ? val < 50 : val < 0;
        const color = val < 0 ? "var(--bad)" : isUrgent ? "var(--bad)" : "var(--warn)";
        el.innerHTML = `${emoji} ${label} <span style="color:${color}; font-weight:bold;">${val}% (+${gap} ${targetLabel})</span>`;
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    };

    makeChip(fireVal, fireGap, "Fire", "🔥", "need-fire");
    makeChip(coldVal, coldGap, "Cold", "❄", "need-cold");
    makeChip(lightVal, lightGap, "Lightning", "⚡", "need-lightning");

    const anyNeeded = fireGap > 0 || coldGap > 0 || lightGap > 0;
    needsDiv.style.display = anyNeeded ? "flex" : "none";
  } else if (needsDiv) {
    needsDiv.style.display = "none";
  }

  // Score total
  const sv = document.getElementById("score-val");
  sv.textContent = (scored.total>0?"+":"")+scored.total;
  sv.className   = `score-total-val ${scored.total>0?"positive":scored.total<0?"negative":"neutral"}`;
  const svs = document.getElementById("score-vs");
  if (compDelta !== null && savedItem) {
    const sign = compDelta>0?"+":"";
    svs.textContent = `(${sign}${compDelta} vs equipped)`;
    svs.style.color = compDelta>0?"var(--good)":compDelta<0?"var(--bad)":"var(--poe-muted)";
  } else {
    svs.textContent = "(no comparison saved)";
    svs.style.color = "var(--poe-muted)";
  }

  // Category bars
  const maxAbs = Math.max(...SCORE_KEYS.map(k=>Math.abs(scored.scores[k]||0)), 1);
  document.getElementById("cat-bars").innerHTML = SCORE_KEYS.map(k => {
    const val = scored.scores[k]||0;
    const pct = Math.min(100, Math.round(Math.abs(val)/maxAbs*100));
    const cls = val>0?"positive":val<0?"negative":"neutral";
    const sign = val>0?"+":"";
    const tip = SCORE_EXPLAIN[k]||"";

    const categoryHits = scored.hits.filter(h => h.category === k);
    const hitsDetails = categoryHits.map(h => {
      const signPts = h.points > 0 ? "+" : "";
      const ti = h.tierInfo;
      const tierTag = ti
        ? ` <span class="hit-tier-tag ${tierRelClass(ti)}" title="${esc(ti.label)}: T${ti.tier}/${ti.tierCount}, roll ${esc(ti.min)}–${esc(ti.max)}">T${ti.tier}/${ti.tierCount} ${ti.rollPct}%</span>`
        : "";
      return `<div style="font-size: 10px; color: var(--poe-muted); line-height: 1.4; padding: 2px 0;">↳ ${esc(h.line)} (${signPts}${h.points})${tierTag}</div>`;
    }).join("");

    return `<div class="cat-bar-container" onclick="this.classList.toggle('expanded')" title="${esc(tip)}">
      <div class="cat-bar-row">
        <div class="cat-bar-label">${esc(SCORE_LABELS[k]||k)}</div>
        <div class="cat-bar-track"><div class="cat-bar-fill ${cls}" style="width:${pct}%"></div></div>
        <div class="cat-bar-delta ${cls}">${sign}${val}</div>
      </div>
      <div class="cat-bar-details">
        ${hitsDetails || `<div style="font-size: 10px; color: var(--poe-muted); font-style: italic;">No matching stats</div>`}
      </div>
    </div>`;
  }).join("");

  // Equipped comparison
  const eqBox = document.getElementById("equipped-compare");
  if (isSpecialSlot) {
    eqBox.style.display = "none";
  } else if (savedItem) {
    eqBox.style.display = "";
    document.getElementById("eq-name").textContent = savedItem.item.names[0] || "Equipped item";
    // PoB-style per-stat delta lines
    const statRows = buildStatDelta(scored.item, savedItem.item);
    const deltaHtml = statRows.map(d => {
      return `<div class="eq-delta-stat ${d.cls}">${esc(d.text)}</div>`;
    }).join("");
    document.getElementById("eq-deltas").innerHTML = deltaHtml || `<div class="eq-delta-stat neutral">No detected stat changes</div>`;
    
    // Confidence indicator
    const conf = getConfidence(scored, savedItem, compDelta);
    const confEl = document.getElementById("eq-confidence");
    if (conf && confEl) {
      confEl.innerHTML = `Confidence: <strong style="color:${conf.level==="High"?"var(--good)":conf.level==="Low"?"var(--bad)":"var(--warn)"};">${conf.level}</strong> — ${conf.text}`;
      confEl.style.display = "";
    } else if (confEl) {
      confEl.style.display = "none";
    }

    document.getElementById("set-equipped-btn").style.display = "";
    document.getElementById("set-equipped-btn").textContent = sameItemIdentity(savedItem.item, scored.item)
      ? "Update equipped item ↑"
      : "Replace equipped item ↑";
    const eqTradeBtn = document.getElementById("eq-trade-btn");
    if (eqTradeBtn) eqTradeBtn.style.display = "";
  } else {
    eqBox.style.display = "";
    document.getElementById("eq-name").textContent = "(No equipped item saved)";
    document.getElementById("eq-deltas").innerHTML = `<div class="eq-delta-stat neutral" style="color:var(--poe-muted); font-style:italic;">No equipped item saved for this slot. Paste/copy an item and set it as equipped below to enable comparisons.</div>`;
    const confEl = document.getElementById("eq-confidence");
    if (confEl) confEl.style.display = "none";
    document.getElementById("set-equipped-btn").style.display = "";
    document.getElementById("set-equipped-btn").textContent = "Set as equipped ↑";
    const eqTradeBtn = document.getElementById("eq-trade-btn");
    if (eqTradeBtn) eqTradeBtn.style.display = "none";
  }

  // Why it won/lost (Gains and Losses delta breakdown)
  const whyWonLostSection = document.getElementById("why-won-lost-section");
  const whyWonLostList = document.getElementById("why-won-lost-list");
  if (!isSpecialSlot && savedItem && whyWonLostSection && whyWonLostList) {
    const ruleDeltas = [];
    const rules = activeProfile.statRules || [];
    const savedHits = savedItem.hits || [];
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const copiedPts = scored.hits.filter(h => h.ruleIndex === i).reduce((sum, h) => sum + h.points, 0);
      const equippedPts = savedHits.filter(h => h.ruleIndex === i).reduce((sum, h) => sum + h.points, 0);
      const delta = copiedPts - equippedPts;
      if (delta !== 0) {
        ruleDeltas.push({ rule, delta });
      }
    }

    const gains = ruleDeltas.filter(x => x.delta > 0).sort((a,b) => b.delta - a.delta).slice(0, 3);
    const losses = ruleDeltas.filter(x => x.delta < 0).sort((a,b) => b.delta - a.delta).slice(0, 3);

    const reasons = [];
    gains.forEach(g => {
      const label = g.rule.label || g.rule.note;
      let text = `Better ${label} (+${g.delta} pts)`;
      if (/accuracy|accuracy rating/i.test(g.rule.match.source || String(g.rule.match)) && currentSession.hitChance >= 95) {
        text = `Better ${label} (+${g.delta} pts, but hit chance already high — low impact)`;
      }
      reasons.push(`<div class="pca-item good"><span class="pca-bullet">✓</span><span class="pca-text">${esc(text)}</span></div>`);
    });

    losses.forEach(l => {
      const label = l.rule.label || l.rule.note;
      const text = `Less ${label} (${l.delta} pts)`;
      reasons.push(`<div class="pca-item bad"><span class="pca-bullet">✗</span><span class="pca-text">${esc(text)}</span></div>`);
    });

    if (reasons.length) {
      whyWonLostList.innerHTML = reasons.join("");
      whyWonLostSection.style.display = "";
    } else {
      whyWonLostList.innerHTML = `<div class="pca-empty">No difference in key stats.</div>`;
      whyWonLostSection.style.display = "";
    }
  } else if (whyWonLostSection) {
    whyWonLostSection.style.display = "none";
  }

  // Resist Warning Banner
  const banner = document.getElementById("resist-warning-banner");
  if (banner) {
    const resistWarning = getResistWarning(scored, currentSession.resistances, currentSession.playerLevel);
    if (resistWarning && !isSpecialSlot) {
      banner.textContent = resistWarning;
      banner.style.display = "";
    } else {
      banner.style.display = "none";
    }
  }

  // Special Item Section (0.5.5 Soul Cores, Runes, Tablets, Waystones, Ultimatums)
  const specialSection = document.getElementById("special-item-section");
  const specialTitle   = document.getElementById("special-item-title");
  const specialContent = document.getElementById("special-item-content");

  if (specialSection && specialTitle && specialContent && isSpecialSlot) {
    specialSection.style.display = "";
    if (slot === "uncut_skill" || slot === "uncut_support") {
      const plan = gemCoachPlan(scored.item, activeProfile, stageKey, savedFullSession?.pobbBuild);
      const kind = slot === "uncut_support" ? "SUPPORT" : "SKILL";
      specialTitle.innerHTML = `<span style="color:var(--poe-gold-bright);">💎 UNCUT ${kind} GEM — BUILD CHOICE</span>`;
      specialContent.innerHTML = renderGemCoachHtml(plan);
    } else if (slot === "waystone") {
      const danger = checkWaystoneDanger(scored.item, activeProfile);
      specialTitle.innerHTML = `<span style="color:${danger.lethal ? "var(--bad)" : danger.warnings.length ? "var(--warn)" : "var(--good)"};">🗺️ WAYSTONE RUN READINESS & HAZARD AUDIT</span>`;
      let contentHtml = "";
      if (danger.dangers.length > 0) {
        contentHtml += `<div style="color:var(--bad); font-weight:600; margin-bottom:4px;">Lethal Hazards Detected:</div>`;
        danger.dangers.forEach(d => {
          contentHtml += `<div style="padding:2px 0; color:var(--bad); font-size:11px;">${esc(d)}</div>`;
        });
      }
      if (danger.warnings.length > 0) {
        contentHtml += `<div style="color:var(--warn); font-weight:600; margin-top:4px; margin-bottom:2px;">Cautions:</div>`;
        danger.warnings.forEach(w => {
          contentHtml += `<div style="padding:2px 0; color:var(--warn); font-size:11px;">${esc(w)}</div>`;
        });
      }
      if (!danger.lethal && danger.warnings.length === 0) {
        contentHtml += `<div style="color:var(--good); font-size:11px;">✓ No lethal reflect, no-regen, or -max-resist modifiers found. Safe to run.</div>`;
      }
      if (scored.item.waystoneTier) {
        contentHtml += `<div style="margin-top:6px; color:var(--poe-muted); font-size:10px;">Waystone Tier: <strong>${esc(scored.item.waystoneTier)}</strong> · Delirium & Ritual Tablet compatible (0.5.5).</div>`;
      }
      specialContent.innerHTML = contentHtml;
    } else if (slot === "soul_core") {
      const sc = analyzeSoulCore(scored.item, activeProfile, currentSession);
      specialTitle.innerHTML = `<span style="color:var(--poe-gold-bright);">🔮 SOUL CORE COACHING (0.5.5 TRIAL OF CHAOS)</span>`;
      let html = `<div style="margin-bottom:6px; font-weight:600; color:${sc.verdict.tone === "good" ? "var(--good)" : "var(--warn)"}; font-size:11.5px;">${esc(sc.recommendation)}</div>`;
      if (sc.weaponBonus) {
        html += `<div style="padding:2px 0;"><span style="color:var(--poe-gold); font-weight:600;">⚔️ Weapon:</span> <span>${esc(sc.weaponBonus)}</span></div>`;
      }
      if (sc.armourBonus) {
        html += `<div style="padding:2px 0;"><span style="color:var(--poe-gold); font-weight:600;">🛡️ Armour:</span> <span>${esc(sc.armourBonus)}</span></div>`;
      }
      html += `<div style="margin-top:6px; color:var(--poe-muted); font-size:10px;">0.5.5 Overhaul: Trial of Chaos drops cores across all 30 rooms. Vendor 3-to-1 reforging can upgrade tiers up to T4, or extract via Desecration.</div>`;
      specialContent.innerHTML = html;
    } else if (slot === "tablet") {
      specialTitle.innerHTML = `<span style="color:var(--poe-gold-bright);">📜 RITUAL / PRECURSOR TABLET (0.5.5 STACKING)</span>`;
      let html = `<div style="margin-bottom:4px; color:var(--good); font-weight:600; font-size:11.5px;">Map Device Stackable:</div>`;
      html += `<div style="color:var(--poe-text); font-size:11px;">In update 0.5.5, multiple Ritual Tablets can be slotted simultaneously into the Map Device to stack Altars, increase Azmeri Wisp density, and access Sacred Blooms.</div>`;
      if (scored.item.explicits?.length) {
        html += `<div style="margin-top:6px; color:var(--poe-gold); font-size:10.5px; font-weight:600;">Tablet Effects:</div>`;
        scored.item.explicits.forEach(e => {
          html += `<div style="font-size:10.5px; color:var(--poe-muted); padding:1px 0;">↳ ${esc(e)}</div>`;
        });
      }
      specialContent.innerHTML = html;
    } else if (slot === "ultimatum") {
      specialTitle.innerHTML = `<span style="color:var(--poe-gold-bright);">⚖️ INSCRIBED ULTIMATUM (0.5.5 TRIAL OF CHAOS)</span>`;
      let html = "";
      if (scored.item.ultimatumReq) {
        html += `<div style="font-size:11.5px;"><span style="color:var(--warn); font-weight:600;">Wager Cost:</span> ${esc(scored.item.ultimatumReq)}</div>`;
      }
      if (scored.item.ultimatumReward) {
        html += `<div style="margin-top:2px; font-size:11.5px;"><span style="color:var(--good); font-weight:600;">Reward:</span> ${esc(scored.item.ultimatumReward)}</div>`;
      }
      html += `<div style="margin-top:6px; color:var(--poe-muted); font-size:10px;">0.5.5 Overhaul: Complete up to 30 trial rooms. Exclusively rewards currency and Soul Cores. Ensure build can survive escalating wager modifiers.</div>`;
      specialContent.innerHTML = html;
    } else if (slot === "rune") {
      specialTitle.innerHTML = `<span style="color:var(--poe-gold-bright);">🔨 RUNESMITHING SOCKET ADVICE (0.5.5)</span>`;
      const sb = scored.item.socketBonuses || {};
      let html = `<div style="margin-bottom:4px; color:var(--poe-text); font-size:11px;">Socket into equipment at the Runesmith. Runes of Aldur now drop in core tables.</div>`;
      Object.entries(sb).forEach(([k, v]) => {
        html += `<div style="padding:1px 0; font-size:11px;"><span style="color:var(--poe-gold); text-transform:capitalize; font-weight:600;">${esc(k)}:</span> ${esc(v)}</div>`;
      });
      specialContent.innerHTML = html;
    }
  } else if (specialSection) {
    specialSection.style.display = "none";
  }

  // Pros
  const pros = scored.hits.filter(h=>h.points>0).sort((a,b)=>b.points-a.points).slice(0,5);
  const prosList = document.getElementById("pros-list");
  if (pros.length) {
    prosList.innerHTML = pros.map(h =>
      `<div class="pca-item good"><span class="pca-bullet">✔</span><div class="pca-text"><div class="pca-mod-line">${esc(h.line)}</div><div class="pca-note">${esc(h.note)}</div></div></div>`
    ).join("");
  } else {
    prosList.innerHTML = `<div class="pca-empty">No strong positives for this build.</div>`;
  }

  // Cons — build requirement warnings first, then negative rule hits, then contextual
  const consList = document.getElementById("cons-list");
  const conEntries = []; // { line, text, cls, icon }

  // Unmet requirements
  if (scored.item.reqLevel && scored.item.reqLevel > (currentSession.playerLevel||1)) {
    conEntries.push({ line:null, text:`Level ${scored.item.reqLevel} required — you are ${currentSession.playerLevel||1}.`, cls:"warn", icon:"⚠" });
  }

  // Rule-based negative hits (show mod line + reason)
  const seenConNotes = new Set();
  for (const h of scored.hits.filter(h=>h.points<0).sort((a,b)=>a.points-b.points)) {
    if (!seenConNotes.has(h.note)) {
      seenConNotes.add(h.note);
      conEntries.push({ line:h.line, text:h.note, cls:"bad", icon:"✖" });
    }
  }

  // Context-sensitive warnings (no mod line — these are build-level observations)
  if (stageKey === "leveling") {
    const hasAccuracy = scored.hits.some(h => /accuracy|accuracy rating/i.test(h.line));
    if (hasAccuracy && currentSession.hitChance >= 95) {
      conEntries.push({ line:null, text:`Accuracy is lower priority — hit chance is already ${currentSession.hitChance}%.`, cls:"warn", icon:"⚠" });
    }
    const hasCrit = scored.hits.some(h => /critical hit chance|critical damage bonus/i.test(h.line));
    if (hasCrit && activeProfile.name.includes("Generic")) {
      conEntries.push({ line:null, text:"Crit scaling is low at this stage — flat damage outperforms crit investment early.", cls:"warn", icon:"⚠" });
    }
  }

  if (conEntries.length) {
    consList.innerHTML = conEntries.slice(0,6).map(({line, text, cls, icon}) => {
      const inner = line
        ? `<div class="pca-mod-line">${esc(line)}</div><div class="pca-note">${esc(text)}</div>`
        : esc(text);
      return `<div class="pca-item ${cls}"><span class="pca-bullet">${icon}</span><div class="pca-text">${inner}</div></div>`;
    }).join("");
  } else {
    consList.innerHTML = `<div class="pca-empty">No obvious problems.</div>`;
  }

  // Crafting Potential
  const craftSection = document.getElementById("crafting-potential-section");
  const craftDetails = document.getElementById("crafting-potential-details");
  if (craftSection && craftDetails && scored.item) {
    const cp = typeof analyzeCraftingPotential === "function" ? analyzeCraftingPotential(scored.item) : null;
    if (cp && (cp.openPrefixes > 0 || cp.openSuffixes > 0)) {
      let html = `<div>Mods: <strong>${cp.prefixes} Prefixes</strong>, <strong>${cp.suffixes} Suffixes</strong></div>`;
      html += `<div style="margin-top: 4px;">Open slots: `;
      const openChips = [];
      if (cp.openPrefixes > 0) openChips.push(`<span style="color:var(--good); font-weight:bold;">${cp.openPrefixes} Prefix</span>`);
      if (cp.openSuffixes > 0) openChips.push(`<span style="color:var(--good); font-weight:bold;">${cp.openSuffixes} Suffix</span>`);
      html += openChips.join(" and ") + `</div>`;
      
      const recs = [];
      if (cp.openPrefixes > 0) {
        const hasLife = scored.item.mods.some(m => /maximum life/i.test(m));
        if (!hasLife && ["ring", "amulet", "belt", "body", "helmet", "gloves", "boots"].includes(slot)) {
          recs.push(`💡 Benchcraft <strong>+Max Life</strong> (Prefix) for defensive upgrade.`);
        } else {
          recs.push(`💡 Benchcraft a Prefix (e.g. Added Flat Damage or Defenses).`);
        }
      }
      if (cp.openSuffixes > 0) {
        const lvl = Number(currentSession.playerLevel) || 1;
        const target = lvl >= 65 ? 75 : lvl <= 20 ? 25 : lvl <= 35 ? 40 : 55;
        const resistances = ["fire", "cold", "lightning"].filter(res => {
          const val = currentSession.resistances ? Number(currentSession.resistances[res]) || 0 : target;
          return val < target;
        });
        if (resistances.length > 0) {
          const resNames = resistances.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join("/");
          const craftGoal = lvl >= 65 ? "to cap resists for maps" : `for Level ${lvl} defenses`;
          recs.push(`💡 Benchcraft <strong>${resNames} Resistance</strong> (Suffix) ${craftGoal}.`);
        } else {
          recs.push(`💡 Benchcraft a Suffix (e.g. Added Damage, Attack Speed, Attributes, or Resistance).`);
        }
      }

      if (scored.item.ilvl >= 70 && scored.item.rarity !== "Unique") {
        recs.push(`🔥 High-level base (iLvl ${scored.item.ilvl}) suitable for endgame crafting.`);
      }

      if (recs.length > 0) {
        html += `<ul style="margin-top: 6px; padding-left: 14px; list-style-type: disc;">${recs.map(r => `<li style="margin-top: 2px;">${r}</li>`).join("")}</ul>`;
      }
      craftDetails.innerHTML = html;
      craftSection.style.display = "";
    } else {
      craftSection.style.display = "none";
    }
  } else if (craftSection) {
    craftSection.style.display = "none";
  }
}

// ─── Saved gear map ───────────────────────────────────────────────────────────

function splitItems(text) {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const chunks = [];
  let current = [];
  let hasRarity = false;
  const flush = () => {
    const chunk = current.join("\n").trim();
    if (chunk) chunks.push(chunk);
    current = [];
    hasRarity = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const startsWithClass = /^Item Class:/i.test(line);
    const startsWithRarity = /^Rarity:\s*(?:Normal|Magic|Rare|Unique|Currency|Gem)/i.test(line);
    if (startsWithClass && current.some(existing => existing.trim())) {
      flush();
    } else if (startsWithRarity && hasRarity) {
      flush();
    }
    current.push(rawLine);
    if (startsWithRarity) hasRarity = true;
  }
  flush();

  return chunks.filter(chunk => {
    const parsed = parseItem(chunk);
    return parsed.rarity && parsed.names.length && !/^Unnamed item$/i.test(parsed.names[0]);
  });
}

function buildGearMap(gearText) {
  const map = {};
  for (const chunk of splitItems(gearText||"")) {
    const item = parseItem(chunk);
    annotateItemTiers(item);
    const slot = inferSlot(item);
    if (slot !== "unknown" && !["flask","charm"].includes(slot) && !map[slot]) {
      map[slot] = { item, raw:chunk };
    }
  }
  return map;
}

function itemIdentity(item) {
  if (!item) return "";
  const uniqueId = String(item.raw || "").match(/^Unique ID:\s*(.+)$/im)?.[1]?.trim();
  if (uniqueId) return `id:${uniqueId.toLowerCase()}`;
  const name = String(item.names?.[0] || "").trim().toLowerCase();
  return name ? `name:${name}` : "";
}

function sameItemIdentity(a, b) {
  const aIdentity = itemIdentity(a);
  return Boolean(aIdentity && aIdentity === itemIdentity(b));
}

function findSavedGearEntry(gearText, slot, copiedItem) {
  const matches = splitItems(gearText || "")
    .map(raw => ({ raw, item: parseItem(raw) }))
    .filter(entry => inferSlot(entry.item) === slot);
  return matches.find(entry => sameItemIdentity(entry.item, copiedItem)) || matches[0] || null;
}

function replaceInGearMap(gearText, slot, newText) {
  const parts = splitItems(gearText||"").filter(chunk => {
    const item = parseItem(chunk);
    return item.rarity && item.names.length && !/^Unnamed item$/i.test(item.names[0]);
  });
  const newItem = parseItem(newText);
  const exactIndex = parts.findIndex(part => {
    const item = parseItem(part);
    return inferSlot(item) === slot && sameItemIdentity(item, newItem);
  });
  let replaced = false;
  const out = [];
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    const s = inferSlot(parseItem(part));
    const isTarget = exactIndex >= 0 ? index === exactIndex : s === slot && !replaced;
    if (isTarget) { out.push(newText.trim()); replaced = true; continue; }
    out.push(part.trim());
  }
  if (!replaced) out.push(newText.trim());
  return out.join("\n\n");
}

// ─── Profile deserialization ──────────────────────────────────────────────────

function deserializeProfile(raw) {
  try {
    const p = JSON.parse(JSON.stringify(raw));
    if (Array.isArray(p.statRules)) {
      p.statRules = p.statRules.map(r => ({
        ...r,
        match: typeof r.match === "string"
          ? new RegExp(r.match.replace(/^\/|\/[gimsuy]*$/g,""), r.match.replace(/.*\/([gimsuy]*)$/,"$1")||"i")
          : r.match,
      }));
    }
    return p;
  } catch { return DEFAULT_PROFILES.genericAttack; }
}

// ─── State ────────────────────────────────────────────────────────────────────

// Extra weight multipliers applied per actContext on top of stage/slot weights.
// Lets "Campaign progress" in Settings actually nudge priorities without replacing stage weights.
const ACT_CONTEXT_WEIGHTS = {
  act1:     { resistance: 0.5,  attributes: 1.4, mobility: 1.4, defense: 0.8, damage: 1.25 },
  act2:     { resistance: 0.75, attributes: 1.2, mobility: 1.3, defense: 0.9, damage: 1.25 },
  act2plus: { resistance: 1.3,  defense: 1.2,  attributes: 0.9, damage: 1.1 },
  act3plus: { resistance: 1.3,  defense: 1.2,  attributes: 0.9, damage: 1.1 },
  maps:     { damage: 1.2,      synergy: 1.25, resistance: 1.4, defense: 1.25, attributes: 0.7 },
};

function getEffectiveActContext() {
  const raw = currentSession.actContext || "auto";
  if (raw !== "auto") {
    if (raw === "act2plus") return "act3plus";
    if (ACT_CONTEXT_WEIGHTS[raw]) return raw;
  }
  const lvl = Number(currentSession.playerLevel) || 1;
  if (lvl <= 15) return "act1";
  if (lvl <= 25) return "act2";
  if (lvl <= 64) return "act3plus";
  return "maps";
}

function actContextMult(category) {
  const effectiveAct = getEffectiveActContext();
  const w = ACT_CONTEXT_WEIGHTS[effectiveAct] || {};
  return w[category] ?? 1.0;
}

let activeProfile   = DEFAULT_PROFILES.genericAttack;
let currentSession  = { playerLevel:1, playerStr:0, playerDex:0, playerInt:0, actContext:"auto", league:"poe2/Forbidden Rites" };
let savedGearMap    = {};
let savedFullSession= null;
let lastItem        = null;
let lastScored      = null;
let lastSlot        = "unknown";
let lastItemText    = "";
let currentSavedEntry = null;

const shell      = document.getElementById("shell");
const slotSelect = document.getElementById("slot-select");
const stageSelect= document.getElementById("stage-select");
const noBuildWarn= document.getElementById("no-build-warn");

function populateSlots(profile) {
  slotSelect.innerHTML = "";
  (profile.slots||[]).forEach(s => {
    const o = document.createElement("option");
    o.value = s; o.textContent = slotLabel(s); slotSelect.append(o);
  });
}

function populateStages(profile) {
  stageSelect.innerHTML = "";
  Object.entries(profile.stages||{}).forEach(([k,s]) => {
    const o = document.createElement("option");
    o.value = k; o.textContent = s.label||k; stageSelect.append(o);
  });
}

// ─── Main render ──────────────────────────────────────────────────────────────

function annotateItemTiers(item) {
  if (typeof detectModTier !== "function") return;
  item.explicitTiers = item.explicits.map(l => detectModTier(l, item.ilvl));
  item.implicitTiers = item.implicits.map(l => detectModTier(l, item.ilvl));
  item.modTierMap    = new Map();
  item.explicits.forEach((l, i) => { if (item.explicitTiers[i]) item.modTierMap.set(l, item.explicitTiers[i]); });
  item.implicits.forEach((l, i) => { if (item.implicitTiers[i]) item.modTierMap.set(l, item.implicitTiers[i]); });
}

function render(itemText) {
  lastItemText = itemText;
  const item = parseItem(itemText);
  annotateItemTiers(item);
  lastItem    = item;

  // Auto-set slot
  const det = inferSlot(item);
  if (det !== "unknown") {
    let opt = slotSelect.querySelector(`option[value="${det}"]`);
    if (!opt) {
      opt = document.createElement("option");
      opt.value = det;
      opt.textContent = slotLabel(det);
      slotSelect.append(opt);
    }
    slotSelect.value = det;
  }
  lastSlot = slotSelect.value;

  const stageKey = stageSelect.value;
  const scored   = scoreItem(item, activeProfile, lastSlot, stageKey);
  lastScored     = scored;

  // Saved comparison
  const savedEntry = findSavedGearEntry(savedFullSession?.fullGearText || "", lastSlot, item) || savedGearMap[lastSlot];
  currentSavedEntry = savedEntry;
  let savedScored  = null;
  let compDelta    = null;
  if (savedEntry?.item) {
    savedScored = scoreItem(savedEntry.item, activeProfile, lastSlot, stageKey);
    compDelta   = scored.total - savedScored.total;
  }

  // Hide AI & Trade box on new item
  const aiArea = document.getElementById("ai-area");
  aiArea.classList.remove("visible");
  document.getElementById("ai-text").textContent  = "";
  document.getElementById("ai-loading").style.display = "none";

  const tradeSection = document.getElementById("trade-value-section");
  if (tradeSection) tradeSection.style.display = "none";

  // Dynamic side-by-side view resizing
  const shellEl = document.getElementById("shell");
  const bodyEl  = document.getElementById("body");
  const eqTooltipEl = document.getElementById("equipped-tooltip");

  if (savedEntry?.item && window.poe2Coach?.resizeWindow) {
    eqTooltipEl.style.display = "";
    if (shellEl) shellEl.classList.add("three-col");
    if (bodyEl) bodyEl.classList.add("three-col");
    window.poe2Coach.resizeWindow(1050, 720);
    renderTooltip(savedEntry.item, true); // Render equipped item
  } else {
    eqTooltipEl.style.display = "none";
    if (shellEl) shellEl.classList.remove("three-col");
    if (bodyEl) bodyEl.classList.remove("three-col");
    if (window.poe2Coach?.resizeWindow) {
      window.poe2Coach.resizeWindow(700, 720);
    }
  }

  renderTooltip(item);
  renderCoach(scored, compDelta, savedScored ? { ...savedEntry, scores:savedScored.scores, hits:savedScored.hits } : null);

  // Unique item price lookup (non-blocking — updates badge once fetched)
  if (String(item.rarity||"").toLowerCase() === "unique") {
    fetchUniquePrice(item);
  } else {
    const pb = document.getElementById("unique-price-badge");
    if (pb) pb.style.display = "none";
  }

  shell.classList.add("visible");
}

async function fetchUniquePrice(item) {
  const pb = document.getElementById("unique-price-badge");
  if (!pb || !window.poe2Coach?.getPrices) return;
  pb.style.display = "none";

  const itemName = (item.names[0] || "").toLowerCase();
  if (!itemName) return;

  const typeMap = {
    weapon: "UniqueWeapon", body: "UniqueArmour", helmet: "UniqueArmour",
    gloves: "UniqueArmour", boots: "UniqueArmour", amulet: "UniqueAccessory",
    ring: "UniqueAccessory", belt: "UniqueAccessory", quiver: "UniqueAccessory",
    flask: "UniqueFlask",
  };
  const type = typeMap[item.slot] || "UniqueAccessory";
  const league = (currentSession.league || "Forbidden Rites").replace(/^poe2\//, "");

  try {
    const result = await window.poe2Coach.getPrices({ type, league });
    if (!result?.prices) return;
    const entry = result.prices[itemName];
    if (!entry) return;
    const label = entry.divine && entry.divine >= 1
      ? `${entry.divine} div`
      : `${entry.chaos}c`;
    pb.textContent = `poe.ninja: ${label}`;
    pb.title = `${entry.name} · ${entry.chaos} chaos · ${entry.divine ?? "—"} div · League: ${league}`;
    pb.style.display = "inline-flex";
  } catch { /* price fetch failed silently */ }
}

// ─── Trade Research popup ─────────────────────────────────────────────────────

function formatAge(indexed) {
  if (!indexed) return "";
  const m = Math.floor((Date.now() - new Date(indexed).getTime()) / 60000);
  if (m < 2)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function renderPriceResult(result) {
  if (!result) return '<div class="tr-error" style="color:var(--bad);">No response received.</div>';

  if (result.rarity === "unique") {
    if (result.ok && result.price != null) {
      const divLine = result.divine != null
        ? ` <span class="tr-curr" style="color:var(--poe-muted);">/ ~${result.divine.toFixed(1)} divine</span>` : "";
      return `
        <div class="tr-item-name" style="color:var(--poe-unique); font-weight:bold;">${esc(result.name)}</div>
        <div class="tr-price-main" style="font-size:18px; font-weight:bold; color:var(--poe-gold-bright); margin:4px 0;">${Math.round(result.price)}<span class="tr-curr" style="color:var(--poe-muted); font-size:11px;"> chaos</span>${divLine}</div>
        <div class="tr-source" style="font-size:10px; color:var(--poe-muted);">poe.ninja · 30-day median</div>`;
    }
    return `<div class="tr-no-data" style="color:var(--poe-muted);">No poe.ninja listing for "${esc(result.name || "this item")}".</div>`;
  }

  if (result.ok && result.listings?.length) {
    const rows = result.listings.map(l =>
      `<div class="tr-listing-row" style="display:flex; justify-content:space-between; align-items:center; padding:3px 6px; border:1px solid var(--poe-border-dim); border-radius:3px; margin-top:3px; background:rgba(0,0,0,0.25);">
        <span class="tr-listing-price" style="color:var(--poe-gold-bright); font-weight:600; font-size:11.5px;">${esc(l.price)}</span>
        <span class="tr-listing-acct" style="color:var(--poe-muted); font-size:10px;">${esc(l.account)} · ${formatAge(l.indexed)}</span>
      </div>`
    ).join("");
    return `<div class="tr-found" style="color:var(--poe-muted); font-size:11px; margin-bottom:4px;">${result.total} online listing${result.total !== 1 ? "s" : ""} · cheapest:</div>
            <div class="tr-listing-list" style="display:flex; flex-direction:column; gap:2px; max-height:120px; overflow-y:auto;">${rows}</div>`;
  }

  if (result.ok && result.total === 0) {
    return `<div class="tr-no-data" style="color:var(--poe-muted);">No online listings found matching key mods.</div>`;
  }

  return `<div class="tr-no-data" style="color:var(--poe-muted);">${esc(result.error || "Trade search unavailable.")}</div>`;
}

async function fetchAndShowTradeValueForItem(item, slot, isEquipped = false) {
  if (!item) return;
  const section = document.getElementById("trade-value-section");
  const summary = document.getElementById("trade-value-summary");
  const listings = document.getElementById("trade-value-listings");
  const openBtn = document.getElementById("trade-value-open-btn");
  if (!section || !summary || !listings) return;

  section.style.display = "";
  section.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const label = isEquipped ? "equipped item" : "copied item";
  summary.innerHTML = `<div class="tr-loading" style="color:var(--poe-muted);">Fetching trade data for ${label}…</div>`;
  listings.innerHTML = "";

  const leagueParam = encodeURIComponent(currentSession?.league || "poe2/Forbidden Rites");
  let tradeUrl = `https://www.pathofexile.com/trade2/search/${leagueParam}`;
  if (openBtn) openBtn.onclick = () => window.poe2Coach.openTrade(tradeUrl);

  try {
    const result = await window.poe2Coach.priceCheck({
      rarity: item.rarity,
      name:   item.names?.[0] || "",
      slot:   slot,
      mods:   item.explicits || [],
      league: currentSession.league || "poe2/Forbidden Rites",
    });

    if (result?.tradeUrl) {
      tradeUrl = result.tradeUrl;
      if (openBtn) openBtn.onclick = () => window.poe2Coach.openTrade(tradeUrl);
    }

    summary.innerHTML = renderPriceResult(result);

    const rarityL = (item.rarity || "").toLowerCase();
    const mods = item.explicits || [];
    if (rarityL !== "unique" && !result?.listings?.length && mods.length) {
      const modRows = mods.slice(0, 5).map((l, i) => {
        return `<div class="tr-mod-row" style="display:flex; align-items:center; gap:4px; font-size:11px; margin-top:2px;"><span style="color:var(--poe-mod);">${esc(l)}</span></div>`;
      }).join("");
      listings.innerHTML = `<div class="tr-mods-header" style="color:var(--poe-muted); margin-top:6px; font-size:11px;">Search manually on trade for:</div><div class="tr-mods">${modRows}</div>`;
    }
  } catch (err) {
    summary.innerHTML = `<div class="tr-error" style="color:var(--bad);">Error: ${esc(err.message)}</div>`;
  }
}

// ─── IPC ─────────────────────────────────────────────────────────────────────

window?.poe2Coach?.onItemDetected?.(({ itemText, session }) => {
  savedFullSession = session || null;

  if (session) {
    const ps = session.pobbBuild?.stats || {};
    const pStats = session.pobStats || session.pobbBuild?.stats || {};
    currentSession.playerLevel = Number(session.playerLevel) || Number(ps.level) || 1;
    currentSession.playerStr   = Number(session.playerStr)   || Number(ps.str)   || 0;
    currentSession.playerDex   = Number(session.playerDex)   || Number(ps.dex)   || 0;
    currentSession.playerInt   = Number(session.playerInt)   || Number(ps.int)   || 0;
    currentSession.hitChance   = pStats.hitChance !== undefined ? Number(pStats.hitChance) : null;
    currentSession.resistances = pStats.resistances || null;
    currentSession.keystones   = session.pobbBuild?.keystones || [];
    currentSession.actContext  = session.actContext || "auto";
    currentSession.league      = session.league || "poe2/Forbidden Rites";

    // Trigger ignore mouse state to match active HUD Mode when item is updated
    if (window.poe2Coach?.setIgnoreMouseEvents) {
      window.poe2Coach.setIgnoreMouseEvents(hudMode);
    }

    if (session.importedProfile) {
      activeProfile = deserializeProfile(session.importedProfile);
      noBuildWarn.style.display = "none";
    } else {
      activeProfile = DEFAULT_PROFILES.genericAttack;
      noBuildWarn.style.display = "";
    }
    savedGearMap = buildGearMap(session.fullGearText || "");

    populateSlots(activeProfile);
    populateStages(activeProfile);

    if (session.slot  && slotSelect.querySelector(`option[value="${session.slot}"]`))   slotSelect.value  = session.slot;
    if (session.stage && stageSelect.querySelector(`option[value="${session.stage}"]`)) {
      stageSelect.value = session.stage;
    } else {
      // Auto-infer stage from actContext or player level
      const lvl = currentSession.playerLevel;
      const actCtx = currentSession.actContext;
      const inferredStage =
        actCtx === "act1"     ? "leveling"  :
        actCtx === "act2"     ? "leveling"  :
        actCtx === "act2plus" || actCtx === "act3plus" ? (lvl >= 35 ? "earlyMaps" : "leveling") :
        actCtx === "maps"     ? "endgame"   :
        lvl >= 65 ? "endgame" : lvl >= 35 ? "earlyMaps" : "leveling";
      if (stageSelect.querySelector(`option[value="${inferredStage}"]`)) {
        stageSelect.value = inferredStage;
      }
    }
  } else {
    noBuildWarn.style.display = "";
    populateSlots(activeProfile);
    populateStages(activeProfile);
  }

  render(itemText);
});

// Re-render on slot/stage change
slotSelect.addEventListener("change",  () => { if (lastItemText) render(lastItemText); });
stageSelect.addEventListener("change", () => { if (lastItemText) render(lastItemText); });

// Set, replace, or update the exact equipped item. Matching by Unique ID/name
// prevents an upgraded Ring 2 or second weapon from overwriting the first one.
document.getElementById("set-equipped-btn").addEventListener("click", () => {
  if (!savedFullSession || !lastItemText || lastSlot === "unknown") return;
  savedFullSession.fullGearText = replaceInGearMap(savedFullSession.fullGearText||"", lastSlot, lastItemText);
  savedGearMap = buildGearMap(savedFullSession.fullGearText);
  window.poe2Coach.saveSession(savedFullSession);
  
  // Re-render immediately to update comparison HUD
  render(lastItemText);
});

// AI Coach
document.getElementById("ai-btn").addEventListener("click", async () => {
  if (!lastScored || !window.poe2Coach?.requestAIAdvice) return;
  const aiArea    = document.getElementById("ai-area");
  const aiLoading = document.getElementById("ai-loading");
  const aiText    = document.getElementById("ai-text");
  aiArea.classList.add("visible");
  aiLoading.style.display = "";
  aiText.textContent = "";

  const savedEntry = currentSavedEntry || savedGearMap[lastSlot];
  let savedScored  = null;
  if (savedEntry?.item) savedScored = scoreItem(savedEntry.item, activeProfile, lastSlot, stageSelect.value);

  const categoryDeltas = {};
  ["damage", "resistance", "defense", "mobility", "attributes", "synergy"].forEach(k => {
    const copiedScore = lastScored.scores[k] || 0;
    const equippedScore = savedScored ? (savedScored.scores[k] || 0) : 0;
    categoryDeltas[k] = copiedScore - equippedScore;
  });

  const lvl = Number(currentSession.playerLevel) || 1;
  const isEndgame = lvl >= 65;
  const resistTarget = isEndgame ? 75 : lvl <= 20 ? 25 : lvl <= 35 ? 40 : 55;
  const resistGaps = {};
  const urgentNeeds = [];
  if (currentSession.resistances) {
    ["fire", "cold", "lightning", "chaos"].forEach(key => {
      const val = Number(currentSession.resistances[key]) || 0;
      if (key === "chaos") {
        if (isEndgame && val < 0) resistGaps[key] = val;
      } else {
        if (val < resistTarget) {
          resistGaps[key] = val - resistTarget;
        }
        if (isEndgame ? val < 50 : val < -15) {
          urgentNeeds.push(`${key} resistance`);
        }
      }
    });
  }

  const payload = {
    playerLevel: lvl,
    campaignStage: lvl <= 15 ? "Act 1" : lvl <= 25 ? "Act 2" : lvl <= 40 ? "Act 3" : lvl <= 64 ? "Cruel / Late Campaign" : "Maps / Endgame",
    resistTarget,
    copiedItem: {
      name: lastScored.item.names[0] || "Unknown Item",
      slot: lastSlot,
      mods: lastScored.item.mods || [],
    },
    equippedItem: savedScored ? {
      name: savedEntry.item.names[0] || "Unknown Item",
      slot: lastSlot,
      mods: savedEntry.item.mods || [],
    } : null,
    categoryDeltas,
    buildKnowledge: window.BuildKnowledge?.compactForCoach(savedFullSession?.buildKnowledge) || null,
    buildContext: {
      buildName: activeProfile.name || "Unknown build",
      buildFocus: activeProfile.focus || {},
      stage: stageSelect.options[stageSelect.selectedIndex]?.textContent || stageSelect.value,
      hitChance: currentSession.hitChance,
      resistGaps,
      playerLevel: lvl,
      urgentNeeds,
      league: currentSession.league || "poe2/Forbidden Rites",
    }
  };

  try {
    const res = await window.poe2Coach.requestAIAdvice(payload);
    aiLoading.style.display = "none";
    if (!res?.ok) {
      aiText.textContent = `AI error: ${res?.error||"Unknown"}`;
      return;
    }
    const a = res.advice||{};
    
    // Clear previous elements
    aiText.innerHTML = "";
    
    // Summary view (always visible)
    const summaryDiv = document.createElement("div");
    summaryDiv.className = "ai-summary";
    summaryDiv.textContent = a.summary || res.rawText || "No advice returned.";
    aiText.appendChild(summaryDiv);
    
    const hasDetails = a.verdict || 
                       (Array.isArray(a.nextActions) && a.nextActions.length > 0) ||
                       (Array.isArray(a.lookFor) && a.lookFor.length > 0) ||
                       (Array.isArray(a.warnings) && a.warnings.length > 0) ||
                       (Array.isArray(a.doNotWorryAbout) && a.doNotWorryAbout.length > 0);
                       
    if (hasDetails) {
      const toggleBtn = document.createElement("div");
      toggleBtn.className = "ai-toggle-btn";
      toggleBtn.textContent = "Show full analysis ▾";
      
      const detailsDiv = document.createElement("div");
      detailsDiv.className = "ai-details hidden";
      
      if (a.verdict) {
        const sect = document.createElement("div");
        sect.className = "ai-details-section";
        sect.innerHTML = `<div class="ai-details-title">Verdict</div><div>${esc(a.verdict)}</div>`;
        detailsDiv.appendChild(sect);
      }
      
      if (Array.isArray(a.nextActions) && a.nextActions.length > 0) {
        const sect = document.createElement("div");
        sect.className = "ai-details-section";
        sect.innerHTML = `<div class="ai-details-title">Next Actions</div><ul class="ai-details-list">${a.nextActions.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
        detailsDiv.appendChild(sect);
      }
      
      if (Array.isArray(a.lookFor) && a.lookFor.length > 0) {
        const sect = document.createElement("div");
        sect.className = "ai-details-section";
        sect.innerHTML = `<div class="ai-details-title">Look For</div><ul class="ai-details-list">${a.lookFor.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
        detailsDiv.appendChild(sect);
      }
      
      if (Array.isArray(a.warnings) && a.warnings.length > 0) {
        const sect = document.createElement("div");
        sect.className = "ai-details-section";
        sect.innerHTML = `<div class="ai-details-title">Warnings</div><ul class="ai-details-list">${a.warnings.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
        detailsDiv.appendChild(sect);
      }
      
      if (Array.isArray(a.doNotWorryAbout) && a.doNotWorryAbout.length > 0) {
        const sect = document.createElement("div");
        sect.className = "ai-details-section";
        sect.innerHTML = `<div class="ai-details-title">Not Urgent</div><ul class="ai-details-list">${a.doNotWorryAbout.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
        detailsDiv.appendChild(sect);
      }
      
      toggleBtn.addEventListener("click", () => {
        const isHidden = detailsDiv.classList.toggle("hidden");
        toggleBtn.textContent = isHidden ? "Show full analysis ▾" : "Hide full analysis ▴";
      });
      
      aiText.appendChild(toggleBtn);
      aiText.appendChild(detailsDiv);
    }
  } catch(err) {
    aiLoading.style.display = "none";
    aiText.textContent = `AI failed: ${err.message}`;
  }
});

// Dismiss / settings / full compare
if (typeof document !== "undefined") {
  document.getElementById("close-btn")?.addEventListener("click",      () => window.poe2Coach?.dismiss?.());
  document.getElementById("settings-btn")?.addEventListener("click",   () => window.poe2Coach?.openSettings?.());
  document.getElementById("fullcompare-btn")?.addEventListener("click",() => window.poe2Coach?.openSettings?.());
  document.addEventListener?.("keydown", e => { if (e.key==="Escape") window.poe2Coach?.dismiss?.(); });
}

// HUD click-through toggle
let hudMode = false;
const hudToggleBtn = document.getElementById("hud-toggle-btn");
if (hudToggleBtn) {
  hudToggleBtn.addEventListener("click", () => {
    hudMode = !hudMode;
    if (hudMode) {
      hudToggleBtn.textContent = "🔒 HUD Mode";
      hudToggleBtn.title = "HUD Mode Active (clicks pass through to game)";
      hudToggleBtn.classList.add("primary");
      const hint = document.getElementById("footer-hint");
      if (hint) hint.textContent = "HUD Mode Active · Press Escape to close overlay";
      if (window.poe2Coach?.setIgnoreMouseEvents) {
        window.poe2Coach.setIgnoreMouseEvents(true);
      }
    } else {
      hudToggleBtn.textContent = "🔓 HUD Mode";
      hudToggleBtn.title = "Toggle Click-Through HUD Mode";
      hudToggleBtn.classList.remove("primary");
      const hint = document.getElementById("footer-hint");
      if (hint) hint.textContent = "Ctrl+C on item in-game · Esc to dismiss";
      if (window.poe2Coach?.setIgnoreMouseEvents) {
        window.poe2Coach.setIgnoreMouseEvents(false);
      }
    }
  });
}

if (typeof document !== "undefined") {
  // Trade Research
  document.getElementById("price-btn")?.addEventListener("click", () => {
    if (lastItem) fetchAndShowTradeValueForItem(lastItem, lastSlot, false);
  });

  const eqTradeBtn = document.getElementById("eq-trade-btn");
  if (eqTradeBtn) {
    eqTradeBtn.addEventListener("click", () => {
      const savedEntry = currentSavedEntry || savedGearMap[lastSlot];
      if (savedEntry?.item) {
        fetchAndShowTradeValueForItem(savedEntry.item, lastSlot, true);
      }
    });
  }

  // Initial populate
  if (typeof activeProfile !== "undefined" && typeof populateSlots === "function") {
    populateSlots(activeProfile);
    populateStages(activeProfile);
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DEFAULT_PROFILES,
    accuracyMultiplier,
    defaultQuarterstaffRules,
    defaultQuarterstaffSlotRules,
    itemIdentity,
    sameItemIdentity,
    findSavedGearEntry,
    gemCoachPlan,
  };
}
