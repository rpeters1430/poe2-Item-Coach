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
    { match: /cold damage to attacks|adds .* cold damage/i,         category:"synergy",    points:16, note:"Cold damage fits the frost attack plan." },
    { match: /lightning damage to attacks|adds .* lightning damage/i,category:"damage",    points:5,  note:"Elemental damage — useful while leveling." },
    { match: /physical damage to attacks|adds .* physical damage|increased physical damage/i, category:"damage", points:10, note:"Physical attack damage." },
    { match: /\+\d+ to level of all projectile skills|projectile skills/i, category:"synergy", points:14, note:"+Level to projectile skills is very strong." },
    { match: /increased damage with bow skills|increased projectile damage|increased damage with crossbow skills/i, category:"synergy", points:11, note:"Scales bow/crossbow/projectile damage." },
    { match: /attack speed|reload speed/i,                           category:"damage",    points:13, note:"Attack or reload speed." },
    { match: /critical hit chance|critical damage bonus|critical damage/i, category:"damage", points:5, note:"Crit — only if the build scales it." },
    { match: /maximum life/i,                                        category:"defense",   points:10, note:"+Max life." },
    { match: /evasion rating|armour|energy shield/i,                 category:"defense",   points:4,  note:"Base defence value." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance/i, category:"resistance", points:8, note:"Elemental resistance." },
    { match: /all elemental resistances|all resistances/i,           category:"resistance",points:16, note:"All-res is excellent." },
    { match: /strength|dexterity|intelligence/i,                     category:"attributes",points:7,  note:"Attributes for gem/gear requirements." },
    { match: /movement speed/i,                                      category:"mobility",  points:18, note:"Movement speed — big leveling upgrade." },
    { match: /spell damage|minion damage/i,                          category:"synergy",   points:-10,note:"Off-plan for a cold attack build." },
    { match: /damage over time|ignite|poison/i,                      category:"synergy",   points:-4, note:"DoT stats are low value here." },
  ];
}

function defaultGenericRules() {
  return [
    { match: /adds .* damage to attacks|physical damage to attacks|increased physical damage/i, category:"damage", points:10, note:"Attack damage." },
    { match: /attack speed|reload speed/i,    category:"damage",    points:12, note:"Attack/reload speed." },
    { match: /maximum life/i,                 category:"defense",   points:10, note:"+Max life." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance|all resistances/i, category:"resistance", points:9, note:"Resistance." },
    { match: /strength|dexterity|intelligence/i, category:"attributes", points:7, note:"Attributes." },
    { match: /movement speed/i,               category:"mobility",  points:18, note:"Movement speed." },
    { match: /spell damage|minion damage/i,   category:"synergy",   points:-7, note:"May not help an attack build." },
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

  for (const line of item.mods) {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (!rule.match.test(line)) continue;
      const key = `${line.toLowerCase()}::${rule.category}`;
      if (used.has(key)) continue;
      used.add(key);

      let basePoints = rule.points;
      if (/accuracy|accuracy rating/i.test(rule.match.source || String(rule.match))) {
        const mult = accuracyMultiplier(currentSession.hitChance);
        basePoints = Math.round(basePoints * mult);
      }

      const pts = Math.round(basePoints * (lw[rule.category]??1) * (sw[rule.category]??profile.baseWeights[rule.category]??1));
      scores[rule.category] += pts;
      hits.push({ line, category:rule.category, points:pts, note:rule.note, ruleIndex: i });
      if (pts < 0) warnings.push(rule.note);
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
    if (compDelta > 20)  return { tone:"good", label:"Equip now",                 opinion:`+${compDelta} build-fit score over your equipped piece.` };
    if (compDelta >= 5)  return { tone:"good", label:"Equip — clear upgrade",     opinion:`+${compDelta} build-fit score.` };
    if (compDelta >= -5) return { tone:"warn", label:"Sidegrade — test in-game",  opinion:`${compDelta >= 0?"+":""}${compDelta} vs. equipped. Check the category breakdown.` };
    if (compDelta >= -20)return { tone:"bad",  label:"Keep equipped item",        opinion:`${compDelta} vs. equipped — keep what you have.` };
    return               { tone:"bad",  label:"Vendor / sell",             opinion:`${compDelta} vs. equipped — safe to discard.` };
  }

  const t = scored.total;
  if (t >= 35) return { tone:"good", label:"Strong item",        opinion:"This item scores very well for your selected build and stage." };
  if (t >= 18) return { tone:"good", label:"Good item",          opinion:"Likely worth equipping. Check if it fills a gap." };
  if (t >= 6)  return { tone:"warn", label:"Decent",             opinion:"Useful, especially if it solves a specific requirement." };
  if (t >= -5) return { tone:"warn", label:"Neutral",            opinion:"Not clearly useful for this build. Check the details." };
  return             { tone:"bad",  label:"Pass on this one",    opinion:"This item looks weak for your current build focus." };
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
  if (/spell damage|minion damage/i.test(l))                return "neg";
  return "";
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function esc(v) {
  return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function slotLabel(k) {
  const m = { body:"Body Armor", quiver:"Quiver", offhand:"Offhand", flask:"Flask", charm:"Charm" };
  return m[k] || String(k).charAt(0).toUpperCase()+String(k).slice(1);
}

// ─── Item tooltip renderer ────────────────────────────────────────────────────

function renderTooltip(item) {
  const rarity = String(item.rarity||"Normal").toLowerCase().replace(/\s+/g,"-");

  // Rarity bar
  document.getElementById("rarity-bar").className = `item-rarity-bar ${rarity}`;

  // Name / base
  const nameEl = document.getElementById("item-name");
  nameEl.textContent = item.names[0] || "Unknown Item";
  nameEl.className = `item-name ${rarity}`;
  const baseEl = document.getElementById("item-base");
  baseEl.textContent = item.names.length > 1 ? item.names[1] : "";

  // Meta (ilvl, quality)
  const meta = [];
  if (item.ilvl) meta.push(`<div class="ilvl-line">Item Level: <span style="color:#fff">${esc(item.ilvl)}</span></div>`);
  if (item.quality) meta.push(`<div class="prop-row"><span class="prop-label">Quality:</span><span class="prop-val aug">${esc(item.quality.trim())}%</span></div>`);
  document.getElementById("item-meta").innerHTML = meta.join("");

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
  document.getElementById("item-reqs").innerHTML = reqHtml;
  document.getElementById("sep-reqs").style.display = reqHtml ? "" : "none";

  // Properties (armour / evasion / damage etc)
  const propsHtml = item.propLines.map(l => {
    const m = l.match(/^([^:]+):\s*(.+)$/);
    if (!m) return "";
    return `<div class="prop-row"><span class="prop-label">${esc(m[1])}:</span><span class="prop-val aug">${esc(m[2])}</span></div>`;
  }).join("");
  document.getElementById("item-props").innerHTML = propsHtml;
  document.getElementById("sep-props").style.display = propsHtml ? "" : "none";

  // Implicits
  const implHtml = item.implicits.map(l => `<div class="affix-line ${modClass(l)}">${esc(l)}</div>`).join("");
  document.getElementById("item-implicits").innerHTML = implHtml;
  document.getElementById("sep-implicits").style.display = (implHtml && item.explicits.length) ? "" : "none";

  // Explicits
  const explHtml = item.explicits.map(l => `<div class="affix-line ${modClass(l)}">${esc(l)}</div>`).join("");
  document.getElementById("item-affixes").innerHTML = explHtml || (item.mods.length === 0 ? '<div class="affix-line plain" style="color:var(--poe-muted);font-style:italic">Unidentified</div>' : "");
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
        el.style.display = "";
        const color = val < 0 ? "var(--bad)" : "var(--warn)";
        el.innerHTML = `${emoji} ${label} <span style="color:${color}; font-weight:bold;">+${gap} to cap</span>`;
      } else {
        el.style.display = "";
        el.innerHTML = `${emoji} ${label} <span style="color:var(--good); font-weight:bold;">Capped</span>`;
      }
    };

    makeChip(fireVal, fireGap, "Fire", "🔥", "need-fire");
    makeChip(coldVal, coldGap, "Cold", "❄", "need-cold");
    makeChip(lightVal, lightGap, "Lightning", "⚡", "need-lightning");

    needsDiv.style.display = "flex";
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
      return `<div style="font-size: 10px; color: var(--poe-muted); line-height: 1.4; padding: 2px 0;">↳ ${esc(h.line)} (${signPts}${h.points})</div>`;
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
    // Per-category deltas
    const chips = SCORE_KEYS.map(k => {
      const delta = (scored.scores[k]||0) - (savedItem.scores[k]||0);
      if (delta === 0) return "";
      const cls = delta>0?"positive":delta<0?"negative":"neutral";
      const sign = delta>0?"+":"";
      return `<span class="eq-delta-chip ${cls}" title="${esc(SCORE_EXPLAIN[k]||k)}">${SCORE_LABELS[k]}: ${sign}${delta}</span>`;
    }).filter(Boolean).join("");
    document.getElementById("eq-deltas").innerHTML = chips || `<span class="eq-delta-chip neutral">No change in categories</span>`;
    
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
  } else {
    eqBox.style.display = "none";
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
      let text = `Gains ${g.rule.note} (+${g.delta} pts)`;
      if (/accuracy|accuracy rating/i.test(g.rule.match.source || String(g.rule.match)) && currentSession.hitChance >= 95) {
        text = `Gains ${g.rule.note} (+${g.delta} pts, but hit chance is already high)`;
      }
      reasons.push(`<div class="pca-item good"><span class="pca-bullet">✓</span><span class="pca-text">${esc(text)}</span></div>`);
    });

    losses.forEach(l => {
      const text = `Loses ${l.rule.note} (-${Math.abs(l.delta)} pts)`;
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
      `<div class="pca-item good"><span class="pca-bullet">✔</span><span class="pca-text">${esc(h.note)}</span></div>`
    ).join("");
  } else {
    prosList.innerHTML = `<div class="pca-empty">No strong positives for this build.</div>`;
  }

  // Cons
  const conItems = [
    ...scored.hits.filter(h=>h.points<0).map(h=>h.note),
    ...scored.warnings
  ];

  // 3.5 Context-sensitive warnings for accuracy/crit during leveling stage
  if (stageKey === "leveling") {
    const hasAccuracy = scored.hits.some(h => /accuracy|accuracy rating/i.test(h.line));
    if (hasAccuracy && currentSession.hitChance >= 95) {
      conItems.push(`Accuracy is lower priority — hit chance is already ${currentSession.hitChance}%.`);
    }

    const hasCrit = scored.hits.some(h => /critical hit chance|critical damage bonus/i.test(h.line));
    if (hasCrit) {
      conItems.push("Crit scaling is low — crit damage alone does not outweigh flat attack damage at this stage.");
    }
  }

  const reqs = [];
  if (scored.item.reqLevel && scored.item.reqLevel > (currentSession.playerLevel||1)) reqs.push(`Level ${scored.item.reqLevel} required — you are ${currentSession.playerLevel||1}.`);
  const consList = document.getElementById("cons-list");
  const allCons = [...new Set([...reqs, ...conItems])].slice(0,6);
  if (allCons.length) {
    consList.innerHTML = allCons.map((c,i) => {
      const cls = i < reqs.length ? "warn" : "bad";
      const icon = i < reqs.length ? "⚠" : "✖";
      return `<div class="pca-item ${cls}"><span class="pca-bullet">${icon}</span><span class="pca-text">${esc(c)}</span></div>`;
    }).join("");
  } else {
    consList.innerHTML = `<div class="pca-empty">No obvious problems.</div>`;
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

let activeProfile   = DEFAULT_PROFILES.frostCrossbow;
let currentSession  = { playerLevel:1, playerStr:0, playerDex:0, playerInt:0 };
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

function render(itemText) {
  lastItemText = itemText;
  const item = parseItem(itemText);
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

  // Hide AI box on new item
  const aiArea = document.getElementById("ai-area");
  aiArea.classList.remove("visible");
  document.getElementById("ai-text").textContent  = "";
  document.getElementById("ai-loading").style.display = "none";

  renderTooltip(item);
  renderCoach(scored, compDelta, savedScored ? { ...savedEntry, scores:savedScored.scores, hits:savedScored.hits } : null);

  shell.classList.add("visible");
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
    if (session.stage && stageSelect.querySelector(`option[value="${session.stage}"]`)) stageSelect.value = session.stage;
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
  document.getElementById("eq-name").textContent = lastScored?.item?.names[0] || "New item";
  document.getElementById("eq-deltas").innerHTML = `<span class="eq-delta-chip neutral">Set as equipped ✓</span>`;
  document.getElementById("set-equipped-btn").style.display = "none";
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

// Initial populate
populateSlots(activeProfile);
populateStages(activeProfile);
