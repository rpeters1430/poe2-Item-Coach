/**
 * recommendation-engine.js — PoE2 Gear Coach v3
 *
 * Dedicated, stage-aware, build-aware recommendation engine.
 * Solves the 3-truths collision (pobb.in character, build guide stage, generic heuristics)
 * by enforcing a strict Build-Context Gate before generating any gearing advice.
 *
 * Answers four core questions reliably:
 * 1. What build / stage am I actually on?
 * 2. What are my 2–3 biggest current problems?
 * 3. Which equipped slots can realistically fix those problems?
 * 4. What should I ignore right now because it belongs to a later stage or different archetype?
 *
 * Replaces the monolithic catch-all score with a 5-dimension slot evaluation:
 * - buildFit: Is this item compatible with the build archetype?
 * - stageFit: Does this item fulfill the needs of the current campaign stage?
 * - defense: Survivability contribution relative to stage targets.
 * - damage: Offensive contribution relative to build weapon/attack style.
 * - replaceUrgency: Immediate Fix, Upgrade Priority, Serviceable / Keep for Now, or Locked In.
 */

(function initRecommendationEngine(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RecommendationEngine = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function recommendationEngineFactory() {
  "use strict";

  // ─── Stage Thresholds ────────────────────────────────────────────────────────

  function getStageBaseline(level = 1, actOverride = null) {
    const lvl = Number(level) || 1;
    let act = actOverride;
    if (!act || act === "auto") {
      if (lvl <= 15) act = "act1";
      else if (lvl <= 25) act = "act2";
      else if (lvl <= 40) act = "act3";
      else if (lvl <= 55) act = "act4";
      else if (lvl <= 64) act = "cruel";
      else act = "maps";
    }

    switch (act) {
      case "act1":
        return {
          actName: "Act 1",
          levelRange: [1, 15],
          resistTarget: 15,
          resistCriticalThreshold: -30,
          resistMinAcceptable: -10,
          expectedLife: [150, 300],
          targetHitChance: 85,
          criticalHitChance: 75,
          isEndgame: false,
          damagePriority: "Weapon base & flat physical/elemental damage",
          mobilityPriority: "Any movement speed on boots is a luxury bonus",
        };
      case "act2":
        return {
          actName: "Act 2",
          levelRange: [16, 28],
          resistTarget: 25,
          resistCriticalThreshold: -15,
          resistMinAcceptable: 0,
          expectedLife: [350, 550],
          targetHitChance: 88,
          criticalHitChance: 75,
          isEndgame: false,
          damagePriority: "Weapon flat damage + attack speed; Accuracy rating if missing attacks",
          mobilityPriority: "10% movement speed minimum, 15–20%+ recommended",
        };
      case "act3":
      case "act4":
        return {
          actName: act === "act3" ? "Act 3" : "Act 4",
          levelRange: [29, 55],
          resistTarget: 50,
          resistCriticalThreshold: 0,
          resistMinAcceptable: 20,
          expectedLife: [600, 1100],
          targetHitChance: 90,
          criticalHitChance: 80,
          isEndgame: false,
          damagePriority: "Weapon upgrades with increased % damage, flat damage, and attack speed",
          mobilityPriority: "15–25% movement speed on boots",
        };
      case "cruel":
        return {
          actName: "Late Campaign / Cruel",
          levelRange: [56, 64],
          resistTarget: 65,
          resistCriticalThreshold: 20,
          resistMinAcceptable: 45,
          expectedLife: [1100, 1600],
          targetHitChance: 90,
          criticalHitChance: 82,
          isEndgame: false,
          damagePriority: "High-tier weapon base, 4+ links, synergized damage affixes",
          mobilityPriority: "20–30% movement speed on boots",
        };
      case "maps":
      default:
        return {
          actName: "Maps / Endgame",
          levelRange: [65, 100],
          resistTarget: 75,
          resistCriticalThreshold: 50,
          resistMinAcceptable: 70,
          expectedLife: [1800, 3500],
          targetHitChance: 95,
          criticalHitChance: 88,
          isEndgame: true,
          damagePriority: "Critical strikes, skill levels, penetration, and weapon DPS ceiling",
          mobilityPriority: "30%+ movement speed on boots",
        };
    }
  }

  // ─── Build Archetype Resolution ──────────────────────────────────────────────

  /**
   * Resolves the authoritative build archetype from available sources.
   * Priority:
   * 1. Direct character state from pobb.in (equipped weapon, active skills, class)
   * 2. Guide stage specification (current variant's weapon & main skill)
   * 3. Overall guide title/focus
   */
  function resolveArchetype({ pobBuild = null, activeStage = null, profile = null } = {}) {
    const pobStats = pobBuild?.stats || {};
    const pobGems = (pobBuild?.gems || []).join(" ").toLowerCase();
    const pobSkillGroups = (pobBuild?.skillGroups || []).map(g => `${g.name} ${(g.supports || []).join(" ")}`).join(" ").toLowerCase();
    const pobGear = (pobBuild?.gear || []).map(g => `${g.slot} ${g.name}`).join(" ").toLowerCase();
    const stageSkills = (activeStage?.skills || []).map(s => (typeof s === "string" ? s : s.name || s.id || "")).join(" ").toLowerCase();
    const stageGear = (activeStage?.inventory || activeStage?.equipmentTargets || []).map(i => `${i.slot || ""} ${i.name || ""} ${i.text || ""}`).join(" ").toLowerCase();
    const profileName = String(profile?.name || "").toLowerCase();

    const allContext = `${pobStats.className || ""} ${pobStats.ascendancy || ""} ${pobGems} ${pobSkillGroups} ${pobGear} ${stageSkills} ${stageGear} ${profileName}`.toLowerCase();

    // Archetype detection
    const isQuarterstaff = /\b(quarterstaff|quarterstaves|charged staff|storm wave|falling thunder|tempest bell|siphoning strike|whirling assault|quarterstaff strike)\b/i.test(allContext)
      || (profile?.focus?.quarterstaff ?? false);

    const isUnarmed = !isQuarterstaff && (
      /\b(unarmed|hollow palm|hollow focus|way of the stonefist|martial artist)\b/i.test(allContext)
      || (profile?.focus?.unarmed ?? false)
    );

    const isCrossbow = !isQuarterstaff && !isUnarmed && (
      /\b(crossbows?|bolts?|power siphoning|rapid fire|fragmentation rounds|permafrost bolts)\b/i.test(allContext)
      || (profile?.focus?.crossbow ?? false)
    );

    const isBow = !isQuarterstaff && !isUnarmed && !isCrossbow && (
      /\b(bows?|quivers?|arrows?|ice shot|tornado shot|lightning arrow|toxic rain|rain of arrows)\b/i.test(allContext)
      || (profile?.focus?.bow ?? false)
    );

    const isMinion = /\b(minion|skeletal|zombie|skeleton|golem|spectre|summon)\b/i.test(allContext);
    const isSpell = !isQuarterstaff && !isUnarmed && !isBow && !isCrossbow && !isMinion && /\b(spell|cast|sorceress|stormweaver|infernalist)\b/i.test(allContext);
    const isMelee = isQuarterstaff || isUnarmed || /\b(melee|strike|cleave|slam|boneshatter|sunder)\b/i.test(allContext);

    // Slot allowlist based on weapon type
    let allowedSlots = ["weapon", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
    let weaponLabel = "Weapon";
    let archetypeLabel = "Generic Attack";

    if (isQuarterstaff) {
      allowedSlots = ["weapon", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
      weaponLabel = "Quarterstaff";
      archetypeLabel = "Quarterstaff Monk";
    } else if (isUnarmed) {
      allowedSlots = ["helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
      weaponLabel = "Unarmed (No Weapon)";
      archetypeLabel = "Unarmed Monk";
    } else if (isBow) {
      allowedSlots = ["weapon", "quiver", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
      weaponLabel = "Bow";
      archetypeLabel = "Bow / Quiver Attack";
    } else if (isCrossbow) {
      allowedSlots = ["weapon", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
      weaponLabel = "Crossbow";
      archetypeLabel = "Crossbow Attack";
    } else {
      allowedSlots = ["weapon", "offhand", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
      weaponLabel = "Weapon";
      archetypeLabel = isSpell ? "Caster" : isMinion ? "Minion Army" : "Melee 1H / Shield";
    }

    return {
      name: archetypeLabel,
      weaponLabel,
      allowedSlots,
      isQuarterstaff,
      isUnarmed,
      isBow,
      isCrossbow,
      isMelee,
      isSpell,
      isMinion,
      hasQuiver: isBow,
      hasOffhand: !isQuarterstaff && !isUnarmed && !isCrossbow && !isBow,
    };
  }

  // ─── Build Context Resolution ────────────────────────────────────────────────

  function resolveBuildContext({ pobBuild = null, profile = null, activeStage = null, playerLevel = 1, playerAttrs = { str: 0, dex: 0, int: 0 } } = {}) {
    const lvl = Number(playerLevel || pobBuild?.stats?.level || 1);
    const baseline = getStageBaseline(lvl);
    const archetype = resolveArchetype({ pobBuild, activeStage, profile });

    // Extract character statistics
    const stats = pobBuild?.stats || {};
    const resistances = stats.resistances || {};
    const hitChance = Number.isFinite(Number(stats.hitChance)) ? Number(stats.hitChance) : null;
    const life = Number(stats.life || 0);
    const es = Number(stats.es || 0);

    return {
      playerLevel: lvl,
      playerAttrs,
      baseline,
      archetype,
      activeStage,
      stats: {
        hitChance,
        life,
        es,
        resistances: {
          fire: Number(resistances.fire ?? 0),
          cold: Number(resistances.cold ?? 0),
          lightning: Number(resistances.lightning ?? 0),
          chaos: Number(resistances.chaos ?? 0),
        },
      },
    };
  }

  // ─── Problem Detection (Question 2) ──────────────────────────────────────────

  function detectTopProblems(context, equippedRows = []) {
    const { playerLevel, baseline, archetype, stats } = context;
    const problems = [];

    // Problem 1: Hit chance bottleneck (Attacks only)
    if (!archetype.isSpell && stats.hitChance !== null && stats.hitChance > 0) {
      if (stats.hitChance <= baseline.criticalHitChance) {
        const missRate = 100 - stats.hitChance;
        problems.push({
          id: "accuracy_critical",
          urgency: "critical",
          title: `Hit chance is dangerously low (${stats.hitChance}%)`,
          detail: `Over ${missRate}% of your attacks are completely missing! Accuracy Rating on gloves, rings, helmet, or the passive tree is hurting your damage much more than raw damage rolls.`,
          fixSlots: ["gloves", "ring", "helmet"],
          targetStat: "Accuracy Rating",
        });
      } else if (stats.hitChance < baseline.targetHitChance) {
        problems.push({
          id: "accuracy_low",
          urgency: "notable",
          title: `Hit chance is sub-optimal (${stats.hitChance}%)`,
          detail: `Attacks miss ~${100 - stats.hitChance}% of the time. Adding some Accuracy Rating on gloves or jewelry will give you a noticeable consistency boost.`,
          fixSlots: ["gloves", "ring"],
          targetStat: "Accuracy Rating",
        });
      }
    }

    // Problem 2: Empty or zero-stat slots
    const allowedSet = new Set(archetype.allowedSlots);
    const zeroScoreSlots = equippedRows.filter(row => allowedSet.has(row.slot) && (row.score === null || row.score <= 0));
    if (zeroScoreSlots.length) {
      const slotNames = zeroScoreSlots.map(r => r.slot === "weapon" ? archetype.weaponLabel : r.slot).join(", ");
      problems.push({
        id: "empty_slots",
        urgency: "high",
        title: `Empty or dead slot(s): ${slotNames}`,
        detail: `You have zero-score gear in ${slotNames}. Even basic magic or rare items with Life, attributes, or a single resistance will instantly improve survivability.`,
        fixSlots: zeroScoreSlots.map(r => r.slot),
        targetStat: "Life / Attributes / Resistances",
      });
    }

    // Problem 3: Weapon damage bottleneck
    if (!archetype.isUnarmed) {
      const weaponRow = equippedRows.find(r => r.slot === "weapon");
      const weaponScore = weaponRow?.score ?? 0;
      if (weaponRow && weaponScore < 45 && playerLevel >= 15) {
        problems.push({
          id: "weapon_bottleneck",
          urgency: "high",
          title: `${archetype.weaponLabel} damage is falling behind (score +${weaponScore})`,
          detail: `Your weapon is one of the weaker functional parts of your setup. Upgrading to a ${archetype.weaponLabel.toLowerCase()} with higher base damage, flat physical/elemental damage, and attack speed will be your single biggest DPS upgrade.`,
          fixSlots: ["weapon"],
          targetStat: `Flat damage / Attack speed on ${archetype.weaponLabel}`,
        });
      }
    }

    // Problem 4: Boots mobility
    const bootRow = equippedRows.find(r => r.slot === "boots");
    const bootText = String(bootRow?.entry?.scored?.item?.raw || bootRow?.entry?.raw || "").toLowerCase();
    const msMatch = bootText.match(/(\d+)%\s+increased\s+movement\s+speed/i);
    const currentMs = msMatch ? parseInt(msMatch[1], 10) : 0;
    if (bootRow && currentMs < 10 && playerLevel >= 12) {
      problems.push({
        id: "boots_mobility",
        urgency: "high",
        title: "No movement speed on boots",
        detail: "Boots without movement speed make dodging boss attacks and traveling through campaign zones sluggish. Look for boots with 10–20%+ movement speed.",
        fixSlots: ["boots"],
        targetStat: "Movement Speed (10–20%+)",
      });
    } else if (bootRow && currentMs === 10 && playerLevel >= 18) {
      problems.push({
        id: "boots_mobility_upgrade",
        urgency: "moderate",
        title: "10% movement speed boots",
        detail: "10% speed is better than base, but pushing to 15–20%+ will significantly improve your leveling speed.",
        fixSlots: ["boots"],
        targetStat: "Movement Speed (15–20%+)",
      });
    }

    // Problem 5: Life pool below stage expectations
    if (stats.life > 0 && stats.life < baseline.expectedLife[0]) {
      problems.push({
        id: "life_danger",
        urgency: "high",
        title: `Life (${stats.life}) is low for ${baseline.actName}`,
        detail: `Expected life pool is at least ${baseline.expectedLife[0]}–${baseline.expectedLife[1]}. Look for maximum Life rolls on belt, body armor, helmet, and rings to avoid sudden deaths.`,
        fixSlots: ["belt", "body", "ring"],
        targetStat: "+to maximum Life",
      });
    }

    // Problem 6: Severely negative resistances (only if truly dangerous)
    const negResists = [];
    if (stats.resistances.fire < baseline.resistCriticalThreshold) negResists.push(`Fire (${stats.resistances.fire}%)`);
    if (stats.resistances.cold < baseline.resistCriticalThreshold) negResists.push(`Cold (${stats.resistances.cold}%)`);
    if (stats.resistances.lightning < baseline.resistCriticalThreshold) negResists.push(`Lightning (${stats.resistances.lightning}%)`);

    if (negResists.length) {
      problems.push({
        id: "resists_critical",
        urgency: baseline.isEndgame ? "critical" : "high",
        title: `Severely negative resistance: ${negResists.join(", ")}`,
        detail: `Incoming elemental damage will hit extremely hard. Pick up a ruby/sapphire/topaz ring or benchcraft small resists to pull them out of the negative zone.`,
        fixSlots: ["ring", "belt"],
        targetStat: "Elemental Resistances",
      });
    }

    // Sort by urgency: critical -> high -> notable -> moderate
    const urgencyOrder = { critical: 0, high: 1, notable: 2, moderate: 3 };
    problems.sort((a, b) => (urgencyOrder[a.urgency] ?? 4) - (urgencyOrder[b.urgency] ?? 4));

    return problems.slice(0, 3);
  }

  // ─── Slot Fix Mapping (Question 3) ───────────────────────────────────────────

  function mapSlotsToFixProblems(problems, archetype, baseline) {
    const slotActions = {};
    for (const prob of problems) {
      for (const slot of prob.fixSlots || []) {
        if (!archetype.allowedSlots.includes(slot)) continue;
        if (!slotActions[slot]) slotActions[slot] = [];
        slotActions[slot].push({
          problemTitle: prob.title,
          targetStat: prob.targetStat,
          urgency: prob.urgency,
        });
      }
    }

    const suggestions = [];
    for (const [slot, actions] of Object.entries(slotActions)) {
      const displayName = slot === "weapon" ? archetype.weaponLabel : slot.charAt(0).toUpperCase() + slot.slice(1);
      const targets = actions.map(a => a.targetStat).join(" + ");
      suggestions.push({
        slot,
        displayName,
        recommendation: `Use ${displayName} to solve: ${targets}.`,
        urgency: actions[0].urgency,
      });
    }

    return suggestions;
  }

  // ─── Ignore Filter (Question 4) ──────────────────────────────────────────────

  function buildIgnoreList(context) {
    const { playerLevel, baseline, archetype } = context;
    const ignores = [];

    // Campaign resistance cap noise filter
    if (!baseline.isEndgame) {
      ignores.push(`75% Elemental Resistance Cap: Your current target in ${baseline.actName} is only ~${baseline.resistTarget}%. Do NOT sacrifice weapon flat damage or accuracy to chase 75% cap.`);
      ignores.push("Chaos Resistance: Negative chaos resistance is completely normal throughout the campaign.");
    }

    // Weapon/Slot noise filter
    if (!archetype.hasQuiver) {
      ignores.push("Quivers & Bow / Projectile stats: Your build is 2H Quarterstaff / Melee. Completely ignore quivers and bow modifiers.");
    }
    if (!archetype.hasOffhand) {
      ignores.push("Shields & Offhands: Two-handed / unarmed builds do not equip an offhand.");
    }
    if (archetype.isQuarterstaff || archetype.isMelee) {
      ignores.push("Spell Damage & Minion Damage: Off-plan modifiers that do not scale your melee strikes.");
    }

    // Milestone timing filter
    if (playerLevel < 22 && (archetype.isQuarterstaff || archetype.isUnarmed)) {
      ignores.push(`Level 22 Transition: You are at Level ${playerLevel}. Keep gear stable and avoid major rebuilds until Storm Wave / Siphoning Strike unlocks at Level 22.`);
    }

    // Crit scaling filter
    if (playerLevel < 60) {
      ignores.push("Critical Strike Multiplier & Crit Chance: Raw flat damage and attack speed scale early leveling much harder than critical strikes.");
    }

    return ignores;
  }

  // ─── Multi-Dimensional Slot Scorer ───────────────────────────────────────────

  /**
   * Evaluates an item along 5 distinct dimensions instead of collapsing into a single score.
   */
  function evaluateItemDimensions(item, slot, context) {
    const { playerLevel, baseline, archetype } = context;
    const itemText = String(item.raw || item.text || (item.mods || []).join("\n")).toLowerCase();
    const mods = item.mods || [];

    // 1. Build Fit (Clean / Neutral / Contaminated)
    let buildFit = "Clean";
    let buildFitNotes = [];
    if (!archetype.hasQuiver && /quiver|bow skill|arrow|projectile damage/i.test(itemText)) {
      buildFit = "Contaminated";
      buildFitNotes.push("Carries bow/quiver affixes useless to a melee build.");
    } else if (archetype.isQuarterstaff && /spell damage|minion damage/i.test(itemText)) {
      buildFit = "Neutral";
      buildFitNotes.push("Has off-archetype spell/minion rolls.");
    } else if (archetype.isQuarterstaff && /adds .* damage to attacks|attack speed|accuracy|melee/i.test(itemText)) {
      buildFit = "Synergy";
      buildFitNotes.push("Matches Quarterstaff melee scaling.");
    }

    // 2. Current-Stage Fit (Ideal / Good / Acceptable / Weak)
    let stageFit = "Acceptable";
    let stageFitNotes = [];
    const hasLife = /maximum life/i.test(itemText);
    const hasRes = /to (fire|cold|lightning|all elemental) resistance/i.test(itemText);
    const hasSpeed = /movement speed/i.test(itemText);
    const hasDamage = /adds .* damage|physical damage|lightning damage|cold damage|attack speed/i.test(itemText);
    const hasAccuracy = /accuracy rating/i.test(itemText);

    if (slot === "boots") {
      if (hasSpeed) {
        stageFit = "Ideal";
        stageFitNotes.push("Provides movement speed for campaign traversal.");
      } else {
        stageFit = "Weak";
        stageFitNotes.push("Missing movement speed.");
      }
    } else if (slot === "weapon") {
      if (hasDamage) {
        stageFit = "Good";
        stageFitNotes.push("Carries flat damage / attack speed.");
      } else {
        stageFit = "Weak";
        stageFitNotes.push("Lacks meaningful flat damage or attack speed.");
      }
    } else if (["ring", "amulet", "belt"].includes(slot)) {
      if (hasLife && (hasRes || hasAccuracy || hasDamage)) {
        stageFit = "Good";
        stageFitNotes.push(`Solid leveling jewelry (Life + ${hasRes ? "Resist" : hasAccuracy ? "Accuracy" : "Damage"}).`);
      } else if (hasLife || hasRes) {
        stageFit = "Acceptable";
        stageFitNotes.push("Provides basic survival padding.");
      } else if (!mods.length) {
        stageFit = "Empty";
        stageFitNotes.push("Empty / dead slot.");
      }
    }

    // 3. Defense Rating
    let defenseScore = 0;
    if (hasLife) defenseScore += 15;
    if (hasRes) defenseScore += 12;
    if (/evasion rating|energy shield|armour/i.test(itemText)) defenseScore += 8;

    // 4. Damage Rating
    let damageScore = 0;
    if (hasDamage) damageScore += 18;
    if (hasAccuracy) damageScore += 14;
    if (/attack speed/i.test(itemText)) damageScore += 12;

    // 5. Replace Urgency
    let replaceUrgency = "Serviceable";
    if (stageFit === "Empty" || mods.length === 0) {
      replaceUrgency = "Immediate Fix";
    } else if (slot === "boots" && !hasSpeed && playerLevel >= 12) {
      replaceUrgency = "Upgrade Priority";
    } else if (slot === "weapon" && damageScore === 0) {
      replaceUrgency = "Upgrade Priority";
    } else if (buildFit === "Contaminated") {
      replaceUrgency = "Upgrade Priority";
    } else if (stageFit === "Ideal" || (hasLife && hasRes && hasDamage)) {
      replaceUrgency = "Locked In";
    }

    return {
      buildFit,
      buildFitNotes,
      stageFit,
      stageFitNotes,
      defense: defenseScore,
      damage: damageScore,
      replaceUrgency,
    };
  }

  // ─── Master Engine Entrypoint ────────────────────────────────────────────────

  function generateNextDecisions({ pobBuild = null, profile = null, activeStage = null, playerLevel = 1, playerAttrs = { str: 0, dex: 0, int: 0 }, equippedRows = [] } = {}) {
    const context = resolveBuildContext({ pobBuild, profile, activeStage, playerLevel, playerAttrs });
    const problems = detectTopProblems(context, equippedRows);
    const slotFixes = mapSlotsToFixProblems(problems, context.archetype, context.baseline);
    const ignoreList = buildIgnoreList(context);

    // Question 1: What build / stage am I actually on?
    const q1 = {
      archetype: context.archetype.name,
      weapon: context.archetype.weaponLabel,
      stage: `${context.baseline.actName} (Level ${context.playerLevel})`,
      summary: `You are playing a Level ${context.playerLevel} ${context.archetype.name} in ${context.baseline.actName}.`,
    };

    // Question 2: What are my 2–3 biggest current problems?
    const q2 = problems;

    // Question 3: Which equipped slots can realistically fix those problems?
    const q3 = slotFixes;

    // Question 4: What should I ignore right now?
    const q4 = ignoreList;

    return {
      context,
      q1_currentBuildAndStage: q1,
      q2_topProblems: q2,
      q3_slotFixes: q3,
      q4_ignoreRightNow: q4,
    };
  }

  return {
    getStageBaseline,
    resolveArchetype,
    resolveBuildContext,
    detectTopProblems,
    mapSlotsToFixProblems,
    buildIgnoreList,
    evaluateItemDimensions,
    generateNextDecisions,
  };
}));
