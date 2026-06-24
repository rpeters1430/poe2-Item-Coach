/**
 * overlay-renderer.js
 *
 * Runs inside overlay.html (renderer process).
 * Receives item text from main process via window.poe2Coach.onItemDetected,
 * scores it using the same engine as the browser app (ported from app.js),
 * and renders the result into the overlay card.
 *
 * The session object (build profile, stage, slot, player stats) is passed in
 * from the saved session so the overlay knows what build you're on.
 */

"use strict";

// ─── Scoring engine (ported from app.js) ─────────────────────────────────────

const SCORE_KEYS = ["damage", "defense", "attributes", "resistance", "mobility", "synergy"];
const SCORE_EXPLAIN = {
  damage: "Damage stats: flat attack damage, attack speed, phys/elemental damage, crit, etc.",
  defense: "Defense stats: life, armour, evasion, energy shield, and defensive base value.",
  attributes: "Attribute value: Str/Dex/Int that can unlock gear or gems.",
  resistance: "Resistance value: fire/cold/lightning/chaos resists.",
  mobility: "Mobility value: mainly movement speed, especially on boots.",
  synergy: "Build synergy: cold/ice, bow/projectile, and stats that match the selected guide stage."
};

function defaultFrostRules() {
  return [
    { match: /cold damage to attacks|adds .* cold damage/i, category: "synergy", points: 16, note: "Adds cold damage, which fits the frost attack plan." },
    { match: /lightning damage to attacks|adds .* lightning damage/i, category: "damage", points: 5, note: "Elemental attack damage. Useful while leveling, but less specific than cold." },
    { match: /physical damage to attacks|adds .* physical damage|increased physical damage/i, category: "damage", points: 10, note: "Adds or scales physical attack damage." },
    { match: /\+\d+ to level of all projectile skills|projectile skills/i, category: "synergy", points: 14, note: "Projectile skill levels are highly relevant to bow/projectile setups." },
    { match: /increased damage with bow skills|increased projectile damage|increased damage with crossbow skills/i, category: "synergy", points: 11, note: "Scales the type of attack damage this build wants." },
    { match: /attack speed|reload speed/i, category: "damage", points: 13, note: "Attack/reload speed is a strong QoL and damage stat." },
    { match: /critical hit chance|critical damage bonus|critical damage/i, category: "damage", points: 5, note: "Crit can help, but only if the build is scaling it." },
    { match: /maximum life/i, category: "defense", points: 10, note: "Life is a strong general defensive stat." },
    { match: /evasion rating|armour|energy shield/i, category: "defense", points: 4, note: "Adds base defense." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance/i, category: "resistance", points: 8, note: "Resistance helps stabilize the character." },
    { match: /all elemental resistances|all resistances/i, category: "resistance", points: 16, note: "All-resistance is very valuable." },
    { match: /strength|dexterity|intelligence/i, category: "attributes", points: 7, note: "Attributes can fix gem or gear requirements." },
    { match: /movement speed/i, category: "mobility", points: 18, note: "Movement speed on boots is usually a major upgrade while leveling." },
    { match: /spell damage|minion damage/i, category: "synergy", points: -10, note: "This looks off-plan for a cold attack build." },
    { match: /damage over time|ignite|poison/i, category: "synergy", points: -4, note: "DoT stats are probably low value unless specifically used." },
  ];
}

function defaultGenericRules() {
  return [
    { match: /adds .* damage to attacks|physical damage to attacks|increased physical damage/i, category: "damage", points: 10, note: "Adds or scales attack damage." },
    { match: /attack speed|reload speed/i, category: "damage", points: 12, note: "Attack speed/reload speed is a strong offensive stat." },
    { match: /maximum life/i, category: "defense", points: 10, note: "Life is useful on most builds." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance|all resistances/i, category: "resistance", points: 9, note: "Resistance improves survivability." },
    { match: /strength|dexterity|intelligence/i, category: "attributes", points: 7, note: "Attributes can fix requirements." },
    { match: /movement speed/i, category: "mobility", points: 18, note: "Movement speed is very valuable on boots." },
    { match: /spell damage|minion damage/i, category: "synergy", points: -7, note: "This may not help an attack build." },
  ];
}

function defaultSlotRules() {
  return {
    weapon:  { damage: 1.55, synergy: 1.45, defense: 0.35, resistance: 0.25, mobility: 0.1 },
    offhand: { damage: 1.25, synergy: 1.35, attributes: 1.0, resistance: 0.8, defense: 0.6 },
    quiver:  { damage: 1.25, synergy: 1.40, attributes: 1.0, resistance: 0.8, defense: 0.6 },
    boots:   { mobility: 1.8, defense: 1.1, resistance: 1.1, attributes: 1.0, damage: 0.45 },
    gloves:  { damage: 1.25, synergy: 1.25, defense: 0.9, resistance: 0.9, attributes: 1.0 },
    helmet:  { defense: 1.15, resistance: 1.15, attributes: 1.1, synergy: 0.7 },
    body:    { defense: 1.4, resistance: 1.0, attributes: 0.8, damage: 0.35 },
    ring:    { resistance: 1.3, attributes: 1.25, damage: 0.9, synergy: 0.9 },
    amulet:  { attributes: 1.35, damage: 1.0, synergy: 1.0, resistance: 1.0 },
    belt:    { defense: 1.3, resistance: 1.15, attributes: 0.8 },
  };
}

const DEFAULT_PROFILES = {
  frostCrossbow: {
    name: "Frost Crossbow / Bow",
    slots: ["weapon","quiver","helmet","body","gloves","boots","ring","amulet","belt"],
    baseWeights: { damage:1.0, defense:1.0, attributes:1.0, resistance:1.0, mobility:1.0, synergy:1.25 },
    stages: {
      leveling:   { label:"Leveling / Campaign", damage:1.0, defense:0.9, attributes:1.35, resistance:0.9, mobility:1.25, synergy:1.2 },
      earlyMaps:  { label:"Early Maps",          damage:1.1, defense:1.15, attributes:1.0, resistance:1.35, mobility:1.1, synergy:1.25 },
      endgame:    { label:"Endgame",             damage:1.25, defense:1.25, attributes:0.8, resistance:1.2, mobility:1.0, synergy:1.45 },
    },
    statRules: defaultFrostRules(),
    slotRules: defaultSlotRules(),
  },
  genericAttack: {
    name: "Generic Attack",
    slots: ["weapon","offhand","helmet","body","gloves","boots","ring","amulet","belt"],
    baseWeights: { damage:1, defense:1, attributes:1, resistance:1, mobility:1, synergy:1 },
    stages: {
      leveling:  { label:"Leveling / Campaign", damage:1.0, defense:0.9, attributes:1.25, resistance:0.9, mobility:1.2, synergy:1.0 },
      earlyMaps: { label:"Early Maps",          damage:1.1, defense:1.15, attributes:1.0, resistance:1.3, mobility:1.0, synergy:1.0 },
      endgame:   { label:"Endgame",             damage:1.25, defense:1.25, attributes:0.8, resistance:1.2, mobility:1.0, synergy:1.1 },
    },
    statRules: defaultGenericRules(),
    slotRules: defaultSlotRules(),
  },
};

// ── Item parsing ──────────────────────────────────────────────────────────────

function parseItem(text) {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .filter(l => l !== "--------")
    .map(l => l.replace(/^\d+\.\s*/, ""));

  return {
    raw: text,
    lines,
    itemClass:  findValue(lines, /^Item Class:\s*(.+)$/i),
    rarity:     findValue(lines, /^Rarity:\s*(.+)$/i),
    name:       detectName(lines),
    requiredLevel: extractRequiredLevel(lines),
    requiredAttributes: extractRequiredAttributes(lines),
    itemLevel: extractItemLevel(lines),
    mods: lines.filter(isLikelyMod),
  };
}

function findValue(lines, regex) {
  const line = lines.find(l => regex.test(l));
  return line ? line.match(regex)[1] : "";
}

function detectName(lines) {
  const rarityIndex = lines.findIndex(l => /^Rarity:/i.test(l));
  if (rarityIndex >= 0 && lines[rarityIndex + 1]) return lines[rarityIndex + 1];
  return lines.find(l => !/^(Item Class|Rarity|Requires|Item Level):/i.test(l)) || "Unnamed item";
}

function isLikelyMod(line) {
  if (/^(Item Class|Rarity|Requires|Item Level):/i.test(line)) return false;
  if (/^(Superior|Normal|Magic|Rare|Unique)$/i.test(line)) return false;
  if (/^[A-Z][a-z]+( [A-Z][a-z]+){0,4}$/.test(line)) return false;
  return /\d|adds|increased|reduced|resistance|maximum|speed|damage|life|strength|dexterity|intelligence|armour|evasion|energy shield|projectile|bow|crossbow/i.test(line);
}

function extractRequiredLevel(lines) {
  const joined = lines.join(" ");
  const m = joined.match(/Requires:[^\n]*?Level\s+(\d+)/i) || joined.match(/Requires\s+Level\s+(\d+)/i);
  return m ? Number(m[1]) : 0;
}

function extractItemLevel(lines) {
  const m = lines.join(" ").match(/Item Level:\s*(\d+)/i);
  return m ? Number(m[1]) : 0;
}

function extractRequiredAttributes(lines) {
  const joined = lines.join(" ");
  const attrs = {};
  for (const [name, regex] of Object.entries({ str: /(\d+)\s*Str/i, dex: /(\d+)\s*Dex/i, int: /(\d+)\s*Int/i })) {
    const m = joined.match(regex);
    if (m) attrs[name] = Number(m[1]);
  }
  return attrs;
}

function inferSlotFromItem(item) {
  const itemClass = String(item.itemClass || "").toLowerCase();
  const nameAndBase = `${item.name} ${item.lines.slice(0, 5).join(" ")}`.toLowerCase();
  const allText = `${item.itemClass} ${item.name} ${item.lines.join(" ")}`.toLowerCase();

  // Prefer explicit Item Class first. This prevents belt text such as
  // "Charm Slots: 1" from being misclassified as a charm.
  if (/\bflasks?\b/.test(itemClass)) return "flask";
  if (/\bcharms?\b/.test(itemClass)) return "charm";
  if (/\bbelts?\b/.test(itemClass)) return "belt";
  if (/\brings?\b/.test(itemClass)) return "ring";
  if (/\bamulets?\b/.test(itemClass)) return "amulet";
  if (/\bquivers?\b/.test(itemClass)) return "quiver";
  if (/\bgloves?\b/.test(itemClass)) return "gloves";
  if (/\bboots?\b/.test(itemClass)) return "boots";
  if (/\bhelmets?\b/.test(itemClass)) return "helmet";
  if (/\bbody\s+armou?rs?\b/.test(itemClass)) return "body";
  if (/\bbows?\b|\bcrossbows?\b|\bstaves\b|\bstaff\b|\bwands?\b|\bsceptres?\b|\bmaces?\b|\bswords?\b|\baxes\b|\bdaggers?\b|\bquarterstaves\b/.test(itemClass)) return "weapon";

  // Then use name/base text. Do not let mods like "Charm Slots" override a belt base.
  if (/\blong belt\b|\bbelt\b|\bsash\b/.test(nameAndBase)) return "belt";
  if (/\bflask\b/.test(nameAndBase)) return "flask";
  if (/\bcharm\b/.test(nameAndBase)) return "charm";
  if (/quiver/.test(nameAndBase)) return "quiver";
  if (/bow|crossbow|staff|wand|sceptre|mace|sword|axe|dagger|quarterstaff/.test(nameAndBase)) return "weapon";
  if (/helmet|helm|cap|hood|mask|crown/.test(nameAndBase)) return "helmet";
  if (/body armour|body armor|vestments|vest|robe|coat|plate|garb|jacket|mail/.test(nameAndBase)) return "body";
  if (/glove|bracer|gauntlet|mitt/.test(nameAndBase)) return "gloves";
  if (/boot|greave|shoe|sandal|slipper/.test(nameAndBase)) return "boots";
  if (/amulet|talisman/.test(nameAndBase)) return "amulet";
  if (/ring/.test(nameAndBase)) return "ring";

  // Last-resort fallback for oddly formatted copied text.
  if (/\bflasks?\b|\bflask\b/.test(allText)) return "flask";
  if (/\bcharms?\b|\bcharm\b/.test(allText)) return "charm";
  if (/\bbelts?\b|\bbelt\b|\bsash\b/.test(allText)) return "belt";
  return "unknown";
}

function splitItemsFromText(text) {
  const normalized = String(text || "").replace(/\r\n/g, "\n");
  const starts = [...normalized.matchAll(/^(?:Item Class:|Rarity:\s*(?:Normal|Magic|Rare|Unique|Currency|Gem))/gmi)].map(m => m.index);
  if (!starts.length) return [];
  return starts
    .map((start, i) => normalized.slice(start, starts[i + 1] ?? normalized.length).trim())
    .filter(isRealItemChunk);
}

function isRealItemChunk(chunk) {
  const text = String(chunk || "").trim();
  if (!text) return false;
  const parsed = parseItem(text);
  if (!parsed.rarity) return false;
  if (!parsed.name || /^Unnamed item$/i.test(parsed.name)) return false;
  const meaningful = parsed.lines.filter(line =>
    !/^(Item Class|Rarity|Unique ID|Item Level|LevelReq|Quality):/i.test(line) &&
    line !== "--------"
  );
  return meaningful.length >= 2;
}

function getPlayerAttrs() {
  return {
    str: Number(currentSession.playerStr) || 0,
    dex: Number(currentSession.playerDex) || 0,
    int: Number(currentSession.playerInt) || 0,
  };
}

function formatPlayerLine() {
  const lvl = Number(currentSession.playerLevel) || 1;
  const attrs = getPlayerAttrs();
  const source = currentSavedSession?.pobbBuild?.stats ? " from pobb.in/session" : "";
  return ` · Player L${lvl} ${attrs.str} Str / ${attrs.dex} Dex / ${attrs.int} Int${source}`;
}

function getRequirementProblems(item) {
  const problems = [];
  const level = Number(currentSession.playerLevel) || 1;
  if (item.requiredLevel && item.requiredLevel > level) {
    problems.push(`Requires level ${item.requiredLevel}; you are level ${level}.`);
  }
  const attrs = getPlayerAttrs();
  const labels = { str: "Strength", dex: "Dexterity", int: "Intelligence" };
  for (const key of ["str", "dex", "int"]) {
    const required = Number(item.requiredAttributes?.[key]) || 0;
    if (required > attrs[key]) {
      problems.push(`${labels[key]} ${attrs[key]}/${required} — short ${required - attrs[key]}.`);
    }
  }
  return problems;
}

function parseSavedGearMap(text) {
  const map = {};
  for (const part of splitItemsFromText(text)) {
    if (!isRealItemChunk(part)) continue;
    const item = parseItem(part);
    const slot = inferSlotFromItem(item);
    if (slot !== "unknown" && !["flask", "charm"].includes(slot) && !map[slot]) {
      map[slot] = { raw: part, item, scored: null };
    }
  }
  return map;
}

function replaceSavedGearText(fullText, slot, newText) {
  const parts = splitItemsFromText(fullText).filter(isRealItemChunk);
  let replaced = false;
  const next = [];
  for (const part of parts) {
    const item = parseItem(part);
    const itemSlot = inferSlotFromItem(item);
    if (itemSlot === slot) {
      if (!replaced) {
        next.push(newText.trim());
        replaced = true;
      }
      continue;
    }
    next.push(part.trim());
  }
  if (!replaced) next.push(newText.trim());
  return next.filter(isRealItemChunk).join("\n\n");
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreItem(item, profile, slot, stageKey) {
  const scores = Object.fromEntries(SCORE_KEYS.map(k => [k, 0]));
  const hits = [];
  const warnings = [];
  const stageWeights = profile.stages[stageKey] || {};
  const slotWeights  = (profile.slotRules || defaultSlotRules())[slot] || {};
  const used = new Set();

  for (const line of item.mods) {
    for (const rule of profile.statRules) {
      if (rule.match.test(line)) {
        const hitKey = `${line.toLowerCase()}::${rule.category}`;
        if (used.has(hitKey)) continue;
        used.add(hitKey);
        const base = rule.points;
        const slotMul  = slotWeights[rule.category]  ?? 1;
        const stageMul = stageWeights[rule.category] ?? profile.baseWeights[rule.category] ?? 1;
        const points = Math.round(base * slotMul * stageMul);
        scores[rule.category] += points;
        hits.push({ line, category: rule.category, points, note: rule.note });
        if (points < 0) warnings.push(rule.note);
      }
    }
  }

  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  return { item, scores, total, hits, warnings };
}

function getVerdict(total, slot, scored, comparisonDelta = null) {
  const requirementProblems = getRequirementProblems(scored.item);
  if (requirementProblems.length) {
    return { tone: "warn", label: "Future / blocked item", opinion: requirementProblems.join(" ") };
  }

  if (comparisonDelta !== null) {
    if (comparisonDelta >= 18) return { tone: "good", label: "Upgrade vs equipped", opinion: `Overall build-fit score is ${comparisonDelta >= 0 ? "+" : ""}${comparisonDelta} vs your saved ${slotLabel(slot)}.` };
    if (comparisonDelta >= 6)  return { tone: "good", label: "Small upgrade vs equipped", opinion: `Overall build-fit score is +${comparisonDelta} vs your saved ${slotLabel(slot)}. Worth using if it fixes a problem.` };
    if (comparisonDelta >= -5) return { tone: "warn", label: "Sidegrade vs equipped", opinion: `Only ${comparisonDelta >= 0 ? "+" : ""}${comparisonDelta} overall build-fit score vs your saved ${slotLabel(slot)}.` };
    return { tone: "bad", label: "Worse than equipped", opinion: `Overall build-fit score is ${comparisonDelta} vs your saved ${slotLabel(slot)}.` };
  }

  if (total >= 35) return { tone: "good", label: "Strong item",   opinion: "This looks strong for your selected build stage." };
  if (total >= 18) return { tone: "good", label: "Good item",   opinion: "Probably worth considering, especially if it fixes a gap." };
  if (total >= 6)  return { tone: "warn", label: "Useful but not amazing",    opinion: "Marginal. Good if it solves a specific problem." };
  if (total >= -5) return { tone: "warn", label: "Neutral item",        opinion: "Not clearly useful. Check the details below." };
  return              { tone: "bad",  label: "Skip it",           opinion: "This item looks weak for the selected build stage." };
}

// ─── Slot label helpers ───────────────────────────────────────────────────────

function slotLabel(key) {
  const map = { body:"Body Armor", quiver:"Quiver", offhand:"Offhand", flask:"Flask", charm:"Charm" };
  return map[key] || String(key).charAt(0).toUpperCase() + String(key).slice(1);
}

function escHtml(v) {
  return String(v)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

// ─── UI state ─────────────────────────────────────────────────────────────────

let activeProfile = DEFAULT_PROFILES.frostCrossbow;
let activeStageKey = "leveling";
let activeSlot = "quiver";
let currentSession = { playerLevel: 1, playerStr: 0, playerDex: 0, playerInt: 0 };

const card        = document.getElementById("card");
const slotSelect  = document.getElementById("slot-select");
const stageSelect = document.getElementById("stage-select");
const itemName    = document.getElementById("item-name");
const itemClass   = document.getElementById("item-class");
const verdictEl   = document.getElementById("verdict");
const verdictLabel= document.getElementById("verdict-label");
const verdictIcon = document.getElementById("verdict-icon");
const verdictOpinion = document.getElementById("verdict-opinion");
const scoreGrid   = document.getElementById("score-grid");
const prosList    = document.getElementById("pros-list");
const consList    = document.getElementById("cons-list");
const noBuildWarn = document.getElementById("no-build-warning");
const savedCompare = document.getElementById("saved-compare");
const savedCompareTitle = document.getElementById("saved-compare-title");
const savedCompareBody = document.getElementById("saved-compare-body");
const setEquippedBtn = document.getElementById("set-equipped-btn");
const aiCoachBtn = document.getElementById("ai-coach-btn");
const aiCoachBox = document.getElementById("ai-coach-box");
let currentSavedSession = null;
let savedGearMap = {};
let lastDetectedSlot = "unknown";
let lastParsedItemText = "";
let lastScoredItem = null;
let lastComparisonDelta = null;
let lastVerdict = null;

// ─── Populate selects ─────────────────────────────────────────────────────────

function populateSlots(profile) {
  slotSelect.innerHTML = "";
  (profile.slots || []).forEach(s => {
    const o = document.createElement("option");
    o.value = s; o.textContent = slotLabel(s);
    slotSelect.append(o);
  });
  slotSelect.value = activeSlot;
}

function populateStages(profile) {
  stageSelect.innerHTML = "";
  Object.entries(profile.stages || {}).forEach(([key, stage]) => {
    const o = document.createElement("option");
    o.value = key; o.textContent = stage.label || key;
    stageSelect.append(o);
  });
  stageSelect.value = activeStageKey;
}

// ─── Render result ────────────────────────────────────────────────────────────

let lastItemText = "";

function renderItem(itemText) {
  lastItemText = itemText;
  const slot = slotSelect.value;
  const stageKey = stageSelect.value;

  const item = parseItem(itemText);
  const detected = inferSlotFromItem(item);
  let effectiveSlot = slot;
  if (detected !== "unknown" && slotSelect.querySelector(`option[value="${detected}"]`)) {
    slotSelect.value = detected;
    effectiveSlot = detected;
  }
  lastDetectedSlot = effectiveSlot;
  lastParsedItemText = itemText;

  const scored = scoreItem(item, activeProfile, effectiveSlot, stageKey);
  let comparisonDelta = null;
  const saved = savedGearMap[effectiveSlot];
  if (saved?.item) {
    saved.scored = scoreItem(saved.item, activeProfile, effectiveSlot, stageKey);
    comparisonDelta = scored.total - saved.scored.total;
  }
  const verdict = getVerdict(scored.total, effectiveSlot, scored, comparisonDelta);
  lastScoredItem = scored;
  lastComparisonDelta = comparisonDelta;
  lastVerdict = verdict;
  if (aiCoachBox) { aiCoachBox.style.display = "none"; aiCoachBox.textContent = ""; }

  // Item identity
  itemName.textContent = item.name || "Unknown item";
  itemClass.textContent = `${item.itemClass || ""} · Item level ${item.itemLevel || "?"}${formatPlayerLine()}`;

  // Verdict
  verdictEl.className = verdict.tone;
  verdictLabel.className = verdict.tone;
  verdictLabel.textContent = verdict.label;
  verdictIcon.textContent = verdict.tone === "good" ? "✦" : verdict.tone === "bad" ? "✗" : "◈";
  verdictOpinion.textContent = verdict.opinion;

  // Score chips
  const totalSign = scored.total > 0 ? "+" : "";
  const totalClass = scored.total > 0 ? "positive" : scored.total < 0 ? "negative" : "neutral";
  const scorePairs = [
    ["Overall build-fit score", scored.total],
    ...SCORE_KEYS.map(k => [slotLabel(k), scored.scores[k]]).filter(([,v]) => v !== 0)
  ];
  scoreGrid.innerHTML = scorePairs.map(([lbl, val]) => {
    const cls = val > 0 ? "positive" : val < 0 ? "negative" : "neutral";
    const sign = val > 0 ? "+" : "";
    return `<div class="score-chip ${cls}" title="${escHtml(scoreExplanation(lbl))}"><span class="chip-label">${escHtml(lbl)}</span><span class="chip-val ${cls}">${sign}${val}</span></div>`;
  }).join("");

  renderSavedComparison(effectiveSlot, scored, comparisonDelta);

  // Pros
  const pros = scored.hits.filter(h => h.points > 0).sort((a,b) => b.points - a.points).slice(0, 5);
  prosList.innerHTML = pros.length
    ? pros.map(h => `<li class="good">${escHtml(h.note || h.line)}</li>`).join("")
    : `<li class="empty">No strong positives for this build.</li>`;

  // Cons
  const cons = [
    ...scored.hits.filter(h => h.points < 0).map(h => h.note || h.line),
    ...scored.warnings,
  ];
  consList.innerHTML = cons.length
    ? [...new Set(cons)].slice(0, 5).map(c => `<li class="bad">${escHtml(c)}</li>`).join("")
    : `<li class="empty">No obvious problems.</li>`;

  // Show the card
  card.classList.add("visible");
}

function renderSavedComparison(slot, scored, delta) {
  if (!savedCompare) return;
  const saved = savedGearMap[slot];
  if (!saved?.item) {
    savedCompare.style.display = "block";
    savedCompareTitle.textContent = `No saved ${slotLabel(slot)} yet`;
    savedCompareBody.innerHTML = [
      `<div><strong>No equipped ${escHtml(slotLabel(slot))} was found for comparison.</strong></div>`,
      `<div>This item was scored against the selected build/stage rules only.</div>`,
      `<div class="muted-small">Overall build-fit score = damage + defense + attributes + resistance + mobility + build synergy. It is not PoB DPS.</div>`
    ].join("");
    setEquippedBtn.style.display = "inline-block";
    return;
  }
  const sign = delta > 0 ? "+" : "";
  const reqProblems = getRequirementProblems(scored.item);
  savedCompare.style.display = "block";
  savedCompareTitle.textContent = `Compared to saved ${slotLabel(slot)}: ${saved.item.name}`;
  savedCompareBody.innerHTML = [
    `<div><strong>${sign}${delta} overall build-fit score vs equipped.</strong></div>`,
    `<div>Saved ${escHtml(slotLabel(slot))}: ${saved.scored?.total ?? "?"}. Copied item: ${scored.total}.</div>`,
    renderCategoryDelta(scored, saved.scored),
    `<div class="muted-small">Positive means the copied item matches the selected build/stage rules better. Negative means your saved item is a better rules match. This is not direct PoB DPS.</div>`,
    reqProblems.length ? `<div><strong>Blocked:</strong> ${escHtml(reqProblems.join(" "))}</div>` : ""
  ].filter(Boolean).join("");
  setEquippedBtn.style.display = reqProblems.length ? "none" : "inline-block";
}

function scoreExplanation(labelText) {
  if (labelText === "Overall build-fit score") {
    return "The weighted total of damage, defense, attributes, resistance, mobility, and build synergy for the selected build/stage. This is not PoB DPS.";
  }
  const key = Object.entries({ Damage:"damage", Defense:"defense", Attributes:"attributes", Resistance:"resistance", Mobility:"mobility", Synergy:"synergy" })
    .find(([label]) => label === labelText)?.[1];
  return key ? SCORE_EXPLAIN[key] : "Build-rule score component.";
}

function renderCategoryDelta(copied, saved) {
  if (!saved?.scores) return "";
  const changes = SCORE_KEYS
    .map(key => ({ key, delta: (copied.scores[key] || 0) - (saved.scores[key] || 0), copied: copied.scores[key] || 0, saved: saved.scores[key] || 0 }))
    .filter(row => row.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  if (!changes.length) return `<div>Category scores are unchanged.</div>`;
  const chips = changes.map(row => {
    const cls = row.delta > 0 ? "positive" : "negative";
    const sign = row.delta > 0 ? "+" : "";
    return `<span class="delta-pill ${cls}" title="${escHtml(SCORE_EXPLAIN[row.key])}">${escHtml(slotLabel(row.key))}: ${sign}${row.delta} <small>(${row.saved} → ${row.copied})</small></span>`;
  }).join(" ");
  return `<div class="category-delta"><strong>What changed:</strong><div>${chips}</div></div>`;
}

async function setCurrentItemAsEquipped() {
  if (!currentSavedSession || !lastParsedItemText || lastDetectedSlot === "unknown") return;
  currentSavedSession.fullGearText = replaceSavedGearText(currentSavedSession.fullGearText || "", lastDetectedSlot, lastParsedItemText);
  savedGearMap = parseSavedGearMap(currentSavedSession.fullGearText);
  try {
    window.poe2Coach.saveSession(currentSavedSession);
    if (savedCompareBody) savedCompareBody.textContent = `Saved as your ${slotLabel(lastDetectedSlot)}. Future copied items will compare against it.`;
  } catch (_err) {
    if (savedCompareBody) savedCompareBody.textContent = "Could not save this item to your equipped gear.";
  }
}


async function askAIAboutCurrentItem() {
  if (!lastScoredItem) return;
  if (!window.poe2Coach?.requestAIAdvice) {
    if (aiCoachBox) { aiCoachBox.style.display = "block"; aiCoachBox.textContent = "AI Coach bridge is not available."; }
    return;
  }
  const slot = lastDetectedSlot;
  const saved = savedGearMap[slot];
  if (aiCoachBox) {
    aiCoachBox.style.display = "block";
    aiCoachBox.textContent = "Asking AI Coach...";
  }
  const payload = {
    kind: "overlay-item",
    build: activeProfile?.name || "Unknown build",
    stage: stageSelect.options[stageSelect.selectedIndex]?.textContent || activeStageKey,
    player: {
      level: currentSession.playerLevel,
      str: currentSession.playerStr,
      dex: currentSession.playerDex,
      int: currentSession.playerInt,
    },
    copiedItem: {
      name: lastScoredItem.item.name,
      itemClass: lastScoredItem.item.itemClass,
      slot,
      requiredLevel: lastScoredItem.item.requiredLevel,
      requiredAttributes: lastScoredItem.item.requiredAttributes,
      totalScore: lastScoredItem.total,
      categoryScores: lastScoredItem.scores,
      positiveHits: lastScoredItem.hits.filter(h => h.points > 0).slice(0, 8),
      negativeHits: lastScoredItem.hits.filter(h => h.points < 0).slice(0, 8),
      requirementProblems: getRequirementProblems(lastScoredItem.item),
    },
    equippedItem: saved?.item ? {
      name: saved.item.name,
      itemClass: saved.item.itemClass,
      totalScore: saved.scored?.total,
    } : null,
    comparisonDelta: lastComparisonDelta,
    ruleVerdict: lastVerdict,
  };
  try {
    const result = await window.poe2Coach.requestAIAdvice(payload);
    if (!result?.ok) {
      aiCoachBox.textContent = `AI Coach error: ${result?.error || "Unknown error"}`;
      return;
    }
    const a = result.advice || {};
    const lines = [];
    if (a.summary) lines.push(a.summary);
    if (Array.isArray(a.nextActions) && a.nextActions.length) lines.push(`\nNext:\n- ${a.nextActions.join("\n- ")}`);
    if (Array.isArray(a.lookFor) && a.lookFor.length) lines.push(`\nLook for:\n- ${a.lookFor.join("\n- ")}`);
    if (Array.isArray(a.warnings) && a.warnings.length) lines.push(`\nWarnings:\n- ${a.warnings.join("\n- ")}`);
    aiCoachBox.textContent = lines.join("\n") || result.rawText || "AI returned no advice.";
  } catch (err) {
    aiCoachBox.textContent = `AI Coach failed: ${err.message}`;
  }
}

// ─── IPC plumbing ─────────────────────────────────────────────────────────────

window.poe2Coach.onItemDetected(({ itemText, session }) => {
  currentSavedSession = session || null;
  savedGearMap = session?.fullGearText ? parseSavedGearMap(session.fullGearText) : {};

  if (session) {
    const pobbStats = session.pobbBuild?.stats || {};
    currentSession.playerLevel = Number(session.playerLevel) || Number(pobbStats.level) || 1;
    currentSession.playerStr   = Number(session.playerStr)   || Number(pobbStats.str) || 0;
    currentSession.playerDex   = Number(session.playerDex)   || Number(pobbStats.dex) || 0;
    currentSession.playerInt   = Number(session.playerInt)   || Number(pobbStats.int) || 0;

    if (session.importedProfile) {
      activeProfile = deserializeProfile(session.importedProfile);
      noBuildWarn.style.display = "none";
    } else {
      activeProfile = DEFAULT_PROFILES.frostCrossbow;
      noBuildWarn.style.display = "block";
    }
  } else {
    activeProfile = DEFAULT_PROFILES.frostCrossbow;
    noBuildWarn.style.display = "block";
  }

  populateSlots(activeProfile);
  populateStages(activeProfile);

  if (session?.slot && slotSelect.querySelector(`option[value="${session.slot}"]`)) {
    slotSelect.value = session.slot;
    activeSlot = session.slot;
  }
  if (session?.stage && stageSelect.querySelector(`option[value="${session.stage}"]`)) {
    stageSelect.value = session.stage;
    activeStageKey = session.stage;
  }

  renderItem(itemText);
});

// Re-render when the user changes slot or stage in the overlay
slotSelect.addEventListener("change",  () => { if (lastItemText) renderItem(lastItemText); });
stageSelect.addEventListener("change", () => { if (lastItemText) renderItem(lastItemText); });

if (setEquippedBtn) setEquippedBtn.addEventListener("click", setCurrentItemAsEquipped);
if (aiCoachBtn) aiCoachBtn.addEventListener("click", askAIAboutCurrentItem);

// Dismiss
document.getElementById("close-btn").addEventListener("click",   () => window.poe2Coach.dismiss());
document.getElementById("settings-btn").addEventListener("click", () => window.poe2Coach.openSettings());
document.getElementById("compare-btn").addEventListener("click",  () => window.poe2Coach.openSettings());

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") window.poe2Coach.dismiss();
});

// ─── Profile deserialization ──────────────────────────────────────────────────
// When session data is loaded from disk, regex objects are plain strings.
// We need to rebuild them.

function deserializeProfile(raw) {
  try {
    const profile = JSON.parse(JSON.stringify(raw)); // deep clone
    if (Array.isArray(profile.statRules)) {
      profile.statRules = profile.statRules.map(rule => ({
        ...rule,
        match: typeof rule.match === "string"
          ? new RegExp(rule.match.replace(/^\/|\/[gimsuy]*$/g, ""), rule.match.replace(/.*\/([gimsuy]*)$/, "$1") || "i")
          : rule.match,
      }));
    }
    return profile;
  } catch (_err) {
    return DEFAULT_PROFILES.frostCrossbow;
  }
}

// Initial state
populateSlots(activeProfile);
populateStages(activeProfile);
