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
  synergy:    "Cold/ice, bow/projectile, and guide-stage scaling stats.",
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

const DEFAULT_PROFILES = {
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
  return 1.0;                       // full value
}

function getResistWarning(scored, resistances) {
  if (!resistances) return null;
  const fire = Number(resistances.fire) || 0;
  const cold = Number(resistances.cold) || 0;
  const lightning = Number(resistances.lightning) || 0;

  const criticals = [];
  if (fire < 0) criticals.push({ name: "Fire", val: fire });
  if (lightning < 0) criticals.push({ name: "Lightning", val: lightning });
  if (cold < 0) criticals.push({ name: "Cold", val: cold });

  if (criticals.length === 0) return null;

  const itemText = String(scored.item.raw || "").toLowerCase();
  const helped = [];
  criticals.forEach(c => {
    const regex = new RegExp(`\\+?\\d+%\\s*to\\s*(all\\s+elemental|${c.name.toLowerCase()})\\s*resistance`, "i");
    if (regex.test(itemText)) {
      helped.push(c.name);
    }
  });

  const critStr = criticals.map(c => `${c.name} (${c.val}%)`).join(" and ");
  if (helped.length === 0) {
    return `Build warning: ${critStr} are uncapped. This item does not help these resistances — defense is critical right now.`;
  } else {
    const remaining = criticals.filter(c => !helped.includes(c.name));
    if (remaining.length === 0) {
      return `This item helps reduce your uncapped resistances (${helped.join(", ")}).`;
    } else {
      const remStr = remaining.map(c => `${c.name} (${c.val}%)`).join(" and ");
      return `This item adds ${helped.join(" & ")} resistance, but ${remStr} still needs fixing.`;
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

function getVerdict(scored, playerLevel, compDelta) {
  const unmet = [];
  if (scored.item.reqLevel && scored.item.reqLevel > playerLevel) unmet.push(`Level ${scored.item.reqLevel} (you are ${playerLevel})`);
  if (scored.item.reqStr && scored.item.reqStr > (currentSession.playerStr || 0)) unmet.push(`Str ${scored.item.reqStr} (you have ${currentSession.playerStr || 0})`);
  if (scored.item.reqDex && scored.item.reqDex > (currentSession.playerDex || 0)) unmet.push(`Dex ${scored.item.reqDex} (you have ${currentSession.playerDex || 0})`);
  if (scored.item.reqInt && scored.item.reqInt > (currentSession.playerInt || 0)) unmet.push(`Int ${scored.item.reqInt} (you have ${currentSession.playerInt || 0})`);
  
  if (unmet.length) {
    return { tone: "warn", label: "Future item — save for later", opinion: `Unmet requirements: ${unmet.join(", ")}.` };
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
  // Spell/minion damage isn't universally bad — each is negative only when
  // the active build doesn't actually use that damage type. Check the
  // imported build's detected focus per mod type rather than hardcoding "neg".
  if (/spell damage/i.test(l) && !activeProfile?.focus?.spell)            return "neg";
  if (/minion damage/i.test(l) && !activeProfile?.focus?.minion)          return "neg";
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
  const m = { body:"Body Armor", quiver:"Quiver", offhand:"Offhand", flask:"Flask", charm:"Charm" };
  return m[k] || String(k).charAt(0).toUpperCase()+String(k).slice(1);
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

// ─── Coach panel renderer ─────────────────────────────────────────────────────

function renderCoach(scored, compDelta, savedItem) {
  const slot     = slotSelect.value;
  const stageKey = stageSelect.value;
  const verdict  = getVerdict(scored, currentSession.playerLevel||1, compDelta);

  // Verdict badge
  const badge = document.getElementById("verdict-badge");
  badge.className = `verdict-badge ${verdict.tone}`;  // note: keep id
  badge.id = "verdict-badge";
  document.getElementById("verdict-icon").textContent  = verdict.tone==="good"?"✦":verdict.tone==="bad"?"✗":"◈";
  const vl = document.getElementById("verdict-label");
  vl.textContent = verdict.label;
  vl.className   = `verdict-label ${verdict.tone}`;
  document.getElementById("verdict-opinion").textContent = verdict.opinion;

  // Urgent Needs Bar
  const needsDiv = document.getElementById("urgent-needs");
  if (needsDiv && currentSession.resistances) {
    const r = currentSession.resistances;
    const fireVal = Number(r.fire) || 0;
    const coldVal = Number(r.cold) || 0;
    const lightVal = Number(r.lightning) || 0;

    const fireGap = 75 - fireVal;
    const coldGap = 75 - coldVal;
    const lightGap = 75 - lightVal;

    const makeChip = (val, gap, label, emoji, elId) => {
      const el = document.getElementById(elId);
      if (!el) return;
      if (gap > 0) {
        const color = val < 0 ? "var(--bad)" : "var(--warn)";
        el.innerHTML = `${emoji} ${label} <span style="color:${color}; font-weight:bold;">+${gap} to cap</span>`;
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    };

    makeChip(fireVal, fireGap, "Fire", "🔥", "need-fire");
    makeChip(coldVal, coldGap, "Cold", "❄", "need-cold");
    makeChip(lightVal, lightGap, "Lightning", "⚡", "need-lightning");

    const anyUncapped = fireGap > 0 || coldGap > 0 || lightGap > 0;
    needsDiv.style.display = anyUncapped ? "flex" : "none";
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
  if (savedItem) {
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
    const eqTradeBtn = document.getElementById("eq-trade-btn");
    if (eqTradeBtn) eqTradeBtn.style.display = "";
  } else {
    eqBox.style.display = "";
    document.getElementById("eq-name").textContent = "(No equipped item saved)";
    document.getElementById("eq-deltas").innerHTML = `<div class="eq-delta-stat neutral" style="color:var(--poe-muted); font-style:italic;">No equipped item saved for this slot. Paste/copy an item and set it as equipped below to enable comparisons.</div>`;
    const confEl = document.getElementById("eq-confidence");
    if (confEl) confEl.style.display = "none";
    document.getElementById("set-equipped-btn").style.display = "";
    const eqTradeBtn = document.getElementById("eq-trade-btn");
    if (eqTradeBtn) eqTradeBtn.style.display = "none";
  }

  // Why it won/lost (Gains and Losses delta breakdown)
  const whyWonLostSection = document.getElementById("why-won-lost-section");
  const whyWonLostList = document.getElementById("why-won-lost-list");
  if (savedItem && whyWonLostSection && whyWonLostList) {
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
    const resistWarning = getResistWarning(scored, currentSession.resistances);
    if (resistWarning) {
      banner.textContent = resistWarning;
      banner.style.display = "";
    } else {
      banner.style.display = "none";
    }
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
        const resistances = ["fire", "cold", "lightning"].filter(res => {
          const val = currentSession.resistances ? Number(currentSession.resistances[res]) || 0 : 75;
          return val < 75;
        });
        if (resistances.length > 0) {
          const resNames = resistances.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join("/");
          recs.push(`💡 Benchcraft <strong>${resNames} Resistance</strong> (Suffix) to cap resists.`);
        } else {
          recs.push(`💡 Benchcraft a Suffix (e.g. Attribute, Resistance, or Attack Speed).`);
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
  const norm = String(text||"").replace(/\r\n/g,"\n");
  const starts = [...norm.matchAll(/^(?:Item Class:|Rarity:\s*(?:Normal|Magic|Rare|Unique|Currency|Gem))/gmi)].map(m=>m.index);
  if (!starts.length) return [];
  return starts.map((s,i)=>norm.slice(s,starts[i+1]??norm.length).trim()).filter(chunk => {
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

function replaceInGearMap(gearText, slot, newText) {
  const parts = splitItems(gearText||"").filter(chunk => {
    const item = parseItem(chunk);
    return item.rarity && item.names.length && !/^Unnamed item$/i.test(item.names[0]);
  });
  let replaced = false;
  const out = [];
  for (const part of parts) {
    const s = inferSlot(parseItem(part));
    if (s === slot && !replaced) { out.push(newText.trim()); replaced = true; continue; }
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
  } catch { return DEFAULT_PROFILES.frostCrossbow; }
}

// ─── State ────────────────────────────────────────────────────────────────────

// Extra weight multipliers applied per actContext on top of stage/slot weights.
// Lets "Campaign progress" in Settings actually nudge priorities without replacing stage weights.
const ACT_CONTEXT_WEIGHTS = {
  act1:     { resistance: 0.65, attributes: 1.45, mobility: 1.35, defense: 0.85 },
  act2plus: { resistance: 1.5,  defense: 1.2,  attributes: 0.9 },
  maps:     { damage: 1.2,  synergy: 1.25, resistance: 1.1, attributes: 0.7 },
};

function actContextMult(category) {
  const w = ACT_CONTEXT_WEIGHTS[currentSession.actContext] || {};
  return w[category] ?? 1.0;
}

let activeProfile   = DEFAULT_PROFILES.frostCrossbow;
let currentSession  = { playerLevel:1, playerStr:0, playerDex:0, playerInt:0, actContext:"auto" };
let savedGearMap    = {};
let savedFullSession= null;
let lastItem        = null;
let lastScored      = null;
let lastSlot        = "unknown";
let lastItemText    = "";

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
  if (det !== "unknown" && slotSelect.querySelector(`option[value="${det}"]`)) {
    slotSelect.value = det;
  }
  lastSlot = slotSelect.value;

  const stageKey = stageSelect.value;
  const scored   = scoreItem(item, activeProfile, lastSlot, stageKey);
  lastScored     = scored;

  // Saved comparison
  const savedEntry = savedGearMap[lastSlot];
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
  const league = currentSession.league || "Standard";

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

  let tradeUrl = "https://www.pathofexile.com/trade2/search/poe2/Standard";
  if (openBtn) openBtn.onclick = () => window.poe2Coach.openTrade(tradeUrl);

  try {
    const result = await window.poe2Coach.priceCheck({
      rarity: item.rarity,
      name:   item.names?.[0] || "",
      slot:   slot,
      mods:   item.explicits || [],
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

window.poe2Coach.onItemDetected(({ itemText, session }) => {
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

    // Trigger ignore mouse state to match active HUD Mode when item is updated
    if (window.poe2Coach?.setIgnoreMouseEvents) {
      window.poe2Coach.setIgnoreMouseEvents(hudMode);
    }

    if (session.importedProfile) {
      activeProfile = deserializeProfile(session.importedProfile);
      noBuildWarn.style.display = "none";
    } else {
      activeProfile = DEFAULT_PROFILES.frostCrossbow;
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
        actCtx === "act2plus" ? "leveling"  :
        actCtx === "maps"     ? "endgame"   :
        lvl >= 65 ? "endgame" : lvl >= 30 ? "earlyMaps" : "leveling";
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

// Set as equipped
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

  const savedEntry = savedGearMap[lastSlot];
  let savedScored  = null;
  if (savedEntry?.item) savedScored = scoreItem(savedEntry.item, activeProfile, lastSlot, stageSelect.value);

  const categoryDeltas = {};
  ["damage", "resistance", "defense", "mobility", "attributes", "synergy"].forEach(k => {
    const copiedScore = lastScored.scores[k] || 0;
    const equippedScore = savedScored ? (savedScored.scores[k] || 0) : 0;
    categoryDeltas[k] = copiedScore - equippedScore;
  });

  const resistGaps = {};
  const urgentNeeds = [];
  if (currentSession.resistances) {
    ["fire", "cold", "lightning", "chaos"].forEach(key => {
      const val = Number(currentSession.resistances[key]) || 0;
      if (val < 75) {
        resistGaps[key] = val - 75;
      }
      if (val < 0) {
        urgentNeeds.push(`${key} resistance`);
      }
    });
  }

  const payload = {
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
    buildContext: {
      stage: stageSelect.options[stageSelect.selectedIndex]?.textContent || stageSelect.value,
      hitChance: currentSession.hitChance,
      resistGaps,
      playerLevel: currentSession.playerLevel || 1,
      urgentNeeds,
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
document.getElementById("close-btn").addEventListener("click",      () => window.poe2Coach.dismiss());
document.getElementById("settings-btn").addEventListener("click",   () => window.poe2Coach.openSettings());
document.getElementById("fullcompare-btn").addEventListener("click",() => window.poe2Coach.openSettings());
document.addEventListener("keydown", e => { if (e.key==="Escape") window.poe2Coach.dismiss(); });

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

// Trade Research
document.getElementById("price-btn").addEventListener("click", () => {
  if (lastItem) fetchAndShowTradeValueForItem(lastItem, lastSlot, false);
});

const eqTradeBtn = document.getElementById("eq-trade-btn");
if (eqTradeBtn) {
  eqTradeBtn.addEventListener("click", () => {
    const savedEntry = savedGearMap[lastSlot];
    if (savedEntry?.item) {
      fetchAndShowTradeValueForItem(savedEntry.item, lastSlot, true);
    }
  });
}

// Initial populate
populateSlots(activeProfile);
populateStages(activeProfile);
