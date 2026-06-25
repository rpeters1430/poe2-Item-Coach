const SCORE_KEYS = ["damage", "defense", "attributes", "resistance", "mobility", "synergy"];

const BUILD_PROFILES = {
  frostCrossbow: {
    name: "Frost Crossbow / Bow Leveling",
    imported: false,
    slots: ["weapon", "quiver", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"],
    baseWeights: {
      damage: 1.0,
      defense: 1.0,
      attributes: 1.0,
      resistance: 1.0,
      mobility: 1.0,
      synergy: 1.25,
    },
    stages: {
      leveling: { label: "Leveling / Campaign", damage: 1.0, defense: 0.9, attributes: 1.35, resistance: 0.9, mobility: 1.25, synergy: 1.2 },
      earlyMaps: { label: "Early Maps", damage: 1.1, defense: 1.15, attributes: 1.0, resistance: 1.35, mobility: 1.1, synergy: 1.25 },
      endgame: { label: "Endgame", damage: 1.25, defense: 1.25, attributes: 0.8, resistance: 1.2, mobility: 1.0, synergy: 1.45 },
    },
    statRules: defaultFrostRules(),
    slotRules: defaultSlotRules(),
    importedStages: [],
  },
  genericAttack: {
    name: "Generic Attack Build",
    imported: false,
    slots: ["weapon", "offhand", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"],
    baseWeights: { damage: 1, defense: 1, attributes: 1, resistance: 1, mobility: 1, synergy: 1 },
    stages: {
      leveling: { label: "Leveling / Campaign", damage: 1.0, defense: 0.9, attributes: 1.25, resistance: 0.9, mobility: 1.2, synergy: 1.0 },
      earlyMaps: { label: "Early Maps", damage: 1.1, defense: 1.15, attributes: 1.0, resistance: 1.3, mobility: 1.0, synergy: 1.0 },
      endgame: { label: "Endgame", damage: 1.25, defense: 1.25, attributes: 0.8, resistance: 1.2, mobility: 1.0, synergy: 1.1 },
    },
    statRules: defaultGenericRules(),
    slotRules: defaultSlotRules(),
    importedStages: [],
  }
};

const SAMPLE_CURRENT = `Item Class: Quivers
Rarity: Rare
Oblivion Quill
Fire Quiver
--------
Requires: Level 26
--------
Item Level: 40
--------
Adds 3 to 5 Fire damage to Attacks
--------
Adds 2 to 8 Physical Damage to Attacks
35% increased Damage with Bow Skills`;

const SAMPLE_NEW = `Item Class: Quivers
Rarity: Rare
Frost Needle
Feathered Quiver
--------
Requires: Level 30, 42 Dex, 22 Int
--------
Item Level: 44
--------
Adds 4 to 9 Cold Damage to Attacks
+18 to Intelligence
+22 to maximum Life
18% increased Damage with Bow Skills
+16% to Cold Resistance`;

const SAMPLE_GEAR_SET = `${SAMPLE_CURRENT}

Item Class: Boots
Rarity: Rare
Trail Leapers
Embossed Boots
--------
Requires: Level 18, 22 Dex
--------
+15% increased Movement Speed
+18 to maximum Life
+21% to Lightning Resistance

Item Class: Gloves
Rarity: Rare
Cold Grips
Bound Bracers
--------
Requires: Level 22, 18 Dex, 12 Int
--------
Adds 2 to 5 Cold Damage to Attacks
+14 to Dexterity
+17 to maximum Life

Item Class: Amulets
Rarity: Rare
Bright Talisman
Lapis Amulet
--------
Requires: Level 31
--------
+22 to Intelligence
+18% to Cold Resistance
+20 to maximum Life`;

const SAMPLE_MOBALYTICS_GUIDE_TEXT = `https://mobalytics.gg/poe-2/builds/ice-shot-deadeye-leveling-guide
0.5 Ice Shot Deadeye Leveling Guide
Ranger Deadeye
By Fubgun

Variants
lvl 1-14
lvl 15-23
lvl 24-30
lvl 31-41
lvl 42-59
lvl 60+

Skills
Ice Shot
Freezing Salvo
Freezing Mark
Herald of Ice
Wind Dancer
Combat Frenzy

Gear
Early on, prioritize flat damage on your bow and rings.
Look for movement speed on boots.
Life and resistances are strong on helmet, body armour, gloves, boots, belt and jewelry.
Use helmet, belt and amulet to fix attributes if you are missing Strength, Dexterity or Intelligence.
For gloves and rings, flat damage to attacks is very useful while leveling.
Upgrade flasks around levels 10, 16, 23, 30, 40, 50 and 60.
Later, look for bow damage, projectile damage, cold damage to attacks, attack speed, critical stats, life and resistances.`;

const buildSelect = document.querySelector("#buildSelect");
const slotSelect = document.querySelector("#slotSelect");
const stageSelect = document.querySelector("#stageSelect");
const currentItem = document.querySelector("#currentItem");
const newItem = document.querySelector("#newItem");
const results = document.querySelector("#results");
const playerLevelInput = document.querySelector("#playerLevel");
const playerStrInput = document.querySelector("#playerStr");
const playerDexInput = document.querySelector("#playerDex");
const playerIntInput = document.querySelector("#playerInt");
const fullGearText = document.querySelector("#fullGearText");
const healthResults = document.querySelector("#healthResults");
const equipmentFields = document.querySelector("#equipmentFields");
const buildFileInput = document.querySelector("#buildFileInput");
const buildFolderInput = document.querySelector("#buildFolderInput");
const importSummary = document.querySelector("#importSummary");
const mobalyticsGuideText = document.querySelector("#mobalyticsGuideText");
const mobalyticsSummary = document.querySelector("#mobalyticsSummary");
const pobbInput = document.querySelector("#pobbInput");
const pobbSummary = document.querySelector("#pobbSummary");
const stageDetails = document.querySelector("#stageDetails");
const exportStatus = document.querySelector("#exportStatus");

function defaultFrostRules() {
  return [
    { match: /cold damage to attacks|adds .* cold damage/i, category: "synergy", points: 16, note: "Adds cold damage, which fits the frost attack plan." },
    { match: /lightning damage to attacks|adds .* lightning damage/i, category: "damage", points: 5, note: "Adds elemental attack damage. Useful while leveling, but less specific than cold." },
    { match: /physical damage to attacks|adds .* physical damage|increased physical damage/i, category: "damage", points: 10, note: "Adds or scales physical attack damage." },
    { match: /\+\d+ to level of all projectile skills|projectile skills/i, category: "synergy", points: 14, note: "Projectile skill levels are highly relevant to bow/projectile setups." },
    { match: /increased damage with bow skills|increased projectile damage|increased damage with crossbow skills/i, category: "synergy", points: 11, note: "Scales the type of attack damage this build wants." },
    { match: /attack speed|reload speed/i, category: "damage", points: 13, note: "Attack speed/reload speed is a strong quality-of-life and damage stat." },
    { match: /critical hit chance|critical damage bonus|critical damage/i, category: "damage", points: 5, note: "Crit can help, but only if the build is scaling it." },
    { match: /maximum life/i, category: "defense", points: 10, note: "Life is a strong general defensive stat." },
    { match: /evasion rating|armour|energy shield/i, category: "defense", points: 4, note: "Adds base defense." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance/i, category: "resistance", points: 8, note: "Resistance helps stabilize the character, especially in campaign and maps." },
    { match: /all elemental resistances|all resistances/i, category: "resistance", points: 16, note: "All-resistance is very valuable." },
    { match: /strength|dexterity|intelligence/i, category: "attributes", points: 7, note: "Attributes can fix gem or gear requirements." },
    { match: /movement speed/i, category: "mobility", points: 18, note: "Movement speed on boots is usually a major upgrade while leveling." },
    { match: /spell damage|minion damage/i, category: "synergy", points: -10, note: "This looks off-plan for a cold attack build." },
    { match: /damage over time|ignite|poison/i, category: "synergy", points: -4, note: "Damage-over-time stats are probably low value unless the build specifically uses them." },
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
    weapon: { damage: 1.55, synergy: 1.45, defense: 0.35, resistance: 0.25, mobility: 0.1 },
    offhand: { damage: 1.25, synergy: 1.35, attributes: 1.0, resistance: 0.8, defense: 0.6 },
    quiver: { damage: 1.25, synergy: 1.4, attributes: 1.0, resistance: 0.8, defense: 0.6 },
    boots: { mobility: 1.8, defense: 1.1, resistance: 1.1, attributes: 1.0, damage: 0.45 },
    gloves: { damage: 1.25, synergy: 1.25, defense: 0.9, resistance: 0.9, attributes: 1.0 },
    helmet: { defense: 1.15, resistance: 1.15, attributes: 1.1, synergy: 0.7 },
    body: { defense: 1.4, resistance: 1.0, attributes: 0.8, damage: 0.35 },
    ring: { resistance: 1.3, attributes: 1.25, damage: 0.9, synergy: 0.9 },
    amulet: { attributes: 1.35, damage: 1.0, synergy: 1.0, resistance: 1.0 },
    belt: { defense: 1.3, resistance: 1.15, attributes: 0.8 },
  };
}

function init() {
  renderBuildOptions();
  updateSlotsAndStages();
  buildSelect.addEventListener("change", () => { updateSlotsAndStages(); if (hasEquipmentEntries()) analyzeBuildHealth(); });
  slotSelect.addEventListener("change", renderStageDetails);
  stageSelect.addEventListener("change", () => { renderStageDetails(); if (hasEquipmentEntries()) analyzeBuildHealth(); });
  buildFileInput.addEventListener("change", handleBuildImport);
  buildFolderInput?.addEventListener("change", handleBuildImport);
  document.querySelector("#importMobalyticsBtn").addEventListener("click", handleMobalyticsImport);
  document.querySelector("#importPobbBtn")?.addEventListener("click", handlePobbImport);
  document.querySelector("#sampleMobalyticsBtn").addEventListener("click", () => {
    mobalyticsGuideText.value = SAMPLE_MOBALYTICS_GUIDE_TEXT;
    handleMobalyticsImport();
  });
  document.querySelector("#analyzeBtn").addEventListener("click", analyze);
  document.querySelector("#clearBtn").addEventListener("click", clearItems);
  document.querySelector("#sampleCurrentBtn").addEventListener("click", () => currentItem.value = SAMPLE_CURRENT);
  document.querySelector("#sampleNewBtn").addEventListener("click", () => newItem.value = SAMPLE_NEW);
  document.querySelector("#loadTargetBtn").addEventListener("click", loadGuideTargetForSlot);
  document.querySelector("#sampleGearSetBtn").addEventListener("click", () => {
    fullGearText.value = SAMPLE_GEAR_SET;
    refreshEquipmentFromPaste({ runReport: true });
  });
  document.querySelector("#refreshEquipmentBtn").addEventListener("click", () => refreshEquipmentFromPaste({ runReport: true }));
  document.querySelector("#healthReportBtn").addEventListener("click", analyzeBuildHealth);
  document.querySelector("#saveSessionBtn").addEventListener("click", saveSession);
  document.querySelector("#loadSessionBtn").addEventListener("click", loadSession);
  document.querySelector("#exportReportBtn").addEventListener("click", exportHealthReport);
  fullGearText.addEventListener("input", debounce(() => refreshEquipmentFromPaste({ runReport: true, silent: true }), 650));
  playerLevelInput.addEventListener("change", () => { renderStageDetails(); if (hasEquipmentEntries()) analyzeBuildHealth(); });
  [playerStrInput, playerDexInput, playerIntInput].forEach(input => input.addEventListener("change", () => {
    if (!results.classList.contains("hidden") && currentItem.value.trim() && newItem.value.trim()) analyze();
    if (hasEquipmentEntries()) analyzeBuildHealth();
  }));
}


function renderBuildOptions() {
  buildSelect.innerHTML = "";
  Object.entries(BUILD_PROFILES).forEach(([key, profile]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = profile.name;
    buildSelect.append(option);
  });
}

function getProfile() {
  return BUILD_PROFILES[buildSelect.value];
}

function updateSlotsAndStages() {
  const profile = getProfile();
  slotSelect.innerHTML = "";
  profile.slots.forEach(slot => {
    const option = document.createElement("option");
    option.value = slot;
    option.textContent = label(slot);
    slotSelect.append(option);
  });

  stageSelect.innerHTML = "";
  Object.entries(profile.stages).forEach(([key, stage]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = stage.label || key;
    stageSelect.append(option);
  });
  renderStageDetails();
}

async function handleBuildImport(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const parsed = [];
  const failures = [];

  for (const file of files) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      parsed.push(normalizeBuildFile(data, file.name));
    } catch (error) {
      failures.push(`${file.name}: ${error.message}`);
    }
  }

  if (!parsed.length) {
    importSummary.innerHTML = `<strong>Import failed.</strong><br>${escapeHtml(failures.join("\n"))}`;
    return;
  }

  parsed.sort((a, b) => a.minLevel - b.minLevel || a.maxLevel - b.maxLevel || a.name.localeCompare(b.name));
  const importedProfile = createImportedProfile(parsed);
  BUILD_PROFILES.importedBuild = importedProfile;
  renderBuildOptions();
  buildSelect.value = "importedBuild";
  updateSlotsAndStages();

  importSummary.innerHTML = renderImportSummary(importedProfile, failures);
}

function handleMobalyticsImport() {
  const text = (mobalyticsGuideText?.value || "").trim();
  if (!text) {
    mobalyticsSummary.innerHTML = `<strong>Paste guide text first.</strong><br><span>Paste copied Mobalytics page text, or at least the build URL and key gear notes.</span>`;
    return;
  }

  const parsed = normalizeMobalyticsGuideText(text);
  if (!parsed.stages.length) {
    mobalyticsSummary.innerHTML = `<strong>Could not find stages.</strong><br><span>Try copying more of the guide text, especially the variant buttons like lvl 1-14, lvl 15-23, etc.</span>`;
    return;
  }

  const importedProfile = createMobalyticsProfile(parsed);
  BUILD_PROFILES.mobalyticsBuild = importedProfile;
  renderBuildOptions();
  buildSelect.value = "mobalyticsBuild";
  updateSlotsAndStages();
  mobalyticsSummary.innerHTML = renderMobalyticsSummary(importedProfile, parsed);
}


async function handlePobbImport() {
  const input = (pobbInput?.value || "").trim();
  if (!pobbSummary) return;
  if (!input) {
    pobbSummary.innerHTML = `<strong>Paste a pobb.in link first.</strong><br><span>Example: https://pobb.in/3bx3Lmue0gEf</span>`;
    return;
  }
  if (!window.poe2Coach?.importPobb) {
    pobbSummary.innerHTML = `<strong>pobb.in importer is not available.</strong><br><span>Restart the app and make sure preload.js is loaded.</span>`;
    return;
  }

  const button = document.querySelector("#importPobbBtn");
  const previousText = button?.textContent || "Import pobb.in";
  if (button) {
    button.disabled = true;
    button.textContent = "Importing...";
  }
  pobbSummary.innerHTML = `<strong>Importing pobb.in build...</strong><br><span>This can take a few seconds the first time.</span>`;

  try {
    const result = await window.poe2Coach.importPobb(input);
    if (!result?.ok) {
      pobbSummary.innerHTML = `<strong>Could not import pobb.in.</strong><br><span>${escapeHtml(result?.error || "Unknown error")}</span>`;
      return;
    }

    const build = {
      name: result.name || "pobb.in imported build",
      url: result.url || input,
      source: result.source || "pobb.in",
      stats: result.stats || {},
      gear: result.gear || [],
      gems: result.gems || [],
      exportCode: result.exportCode || "",
      equippedGearText: result.equippedGearText || "",
      decodedItemCount: result.decodedItemCount || 0,
      decodedPobOk: Boolean(result.decodedPobOk),
      rawTextPreview: result.rawTextPreview || "",
    };

    window.currentPobbBuild = build;
    applyPobbBuildToSettings(build);
    pobbSummary.innerHTML = renderPobbSummary(build);

    if (build.equippedGearText) {
      fullGearText.value = build.equippedGearText;
      refreshEquipmentFromPaste({ runReport: true, silent: true });
    } else if (hasEquipmentEntries()) {
      analyzeBuildHealth();
    }
    saveSession();
  } catch (error) {
    pobbSummary.innerHTML = `<strong>Could not import pobb.in.</strong><br><span>${escapeHtml(error.message || String(error))}</span>`;
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = previousText;
    }
  }
}

function applyPobbBuildToSettings(build) {
  const stats = build?.stats || {};
  const level = Number(stats.level || 0);
  if (level && playerLevelInput) {
    selectStageForPlayerLevel(level);
    playerLevelInput.value = String(level);
  }
  if (Number.isFinite(Number(stats.str)) && Number(stats.str) > 0 && playerStrInput) playerStrInput.value = String(Math.floor(Number(stats.str)));
  if (Number.isFinite(Number(stats.dex)) && Number(stats.dex) > 0 && playerDexInput) playerDexInput.value = String(Math.floor(Number(stats.dex)));
  if (Number.isFinite(Number(stats.int)) && Number(stats.int) > 0 && playerIntInput) playerIntInput.value = String(Math.floor(Number(stats.int)));
}

function selectStageForPlayerLevel(level) {
  const profile = getProfile();
  if (!profile?.stages || !stageSelect) return;
  const entries = Object.entries(profile.stages);
  if (!entries.length) return;

  let bestKey = null;
  for (const [key, stage] of entries) {
    const min = Number(stage?.data?.minLevel ?? stage?.minLevel ?? 0);
    const max = Number(stage?.data?.maxLevel ?? stage?.maxLevel ?? 100);
    if (level >= min && level <= max) {
      bestKey = key;
      break;
    }
  }

  if (!bestKey) {
    let bestDistance = Infinity;
    for (const [key, stage] of entries) {
      const min = Number(stage?.data?.minLevel ?? stage?.minLevel ?? 0);
      const max = Number(stage?.data?.maxLevel ?? stage?.maxLevel ?? 100);
      const mid = (min + max) / 2;
      const distance = Math.abs(level - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestKey = key;
      }
    }
  }

  if (bestKey) {
    stageSelect.value = bestKey;
    renderStageDetails();
  }
}

function renderPobbSummary(build) {
  return `
    <div class="import-card">
      <h3>pobb.in current build imported</h3>
      ${renderPobbMiniCard(build)}
      <p class="mini-note"><strong>Imported:</strong> ${escapeHtml(build?.gear?.length || 0)} gear item(s), ${escapeHtml(build?.gems?.length || 0)} gem entry(s). ${build?.decodedPobOk ? `${escapeHtml(build?.decodedItemCount || build?.gear?.length || 0)} equipped item(s) were decoded from the PoB export and loaded into your saved gear.` : (build?.exportCode ? "PoB export code was found and saved locally, but equipped affixes were not decoded from it." : "No PoB export code was detected on the visible page.")}</p>
      <p class="mini-note">Player level and closest guide stage were updated automatically when possible. Strength, Dexterity, and Intelligence are auto-filled only when the decoded PoB export exposes them; otherwise enter them manually.</p>
    </div>
  `;
}

function normalizeMobalyticsGuideText(text) {
  const clean = text.replace(/\r/g, "");
  const urlMatch = clean.match(/https?:\/\/[^\s]+mobalytics\.gg\/poe-2\/builds\/([^\s?#]+)/i);
  const titleFromUrl = urlMatch ? slugToTitle(urlMatch[1]) : "";
  const titleLine = clean.split("\n").map(line => line.trim()).find(line => /guide|build/i.test(line) && line.length < 120 && !/^https?:/i.test(line));
  const name = titleLine || titleFromUrl || "Mobalytics Imported Guide";
  const authorMatch = clean.match(/(?:by|author)\s+([A-Za-z0-9_ -]{2,40})/i);
  const ascendancyMatch = clean.match(/\b(Deadeye|Pathfinder|Ranger|Witchhunter|Mercenary|Sorceress|Stormweaver|Infernalist|Monk|Invoker|Acolyte|Warrior|Titan|Warbringer)\b/i);
  const stageRanges = extractMobalyticsStages(clean);
  const focus = inferBuildFocus(clean);
  const priorities = extractMobalyticsPriorities(clean);
  const skills = extractMobalyticsSkills(clean);

  const stages = stageRanges.map((range, index) => ({
    fileName: `Mobalytics guide text stage ${index + 1}`,
    name,
    author: authorMatch ? authorMatch[1].trim() : "Mobalytics",
    ascendancy: ascendancyMatch ? ascendancyMatch[1] : "Unknown",
    minLevel: range.min,
    maxLevel: range.max,
    label: range.label,
    inventory: buildPriorityTargetsFromMobalytics(priorities),
    skills,
    passiveCount: 0,
    focus,
    priorityNotes: priorities.notes,
    prioritySlots: priorities.bySlot,
    source: "mobalytics",
    rawText: clean,
  }));

  return { name, author: authorMatch?.[1]?.trim() || "Mobalytics", stages, priorities, skills, focus, url: urlMatch?.[0] || "" };
}

function slugToTitle(slug) {
  return String(slug || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim();
}

function extractMobalyticsStages(text) {
  const ranges = [];
  const seen = new Set();
  const regexes = [
    /\b(?:lvl|level)\s*(\d+)\s*[-–]\s*(\d+)\b/gi,
    /\b(?:lvl|level)\s*(\d+)\s*\+\b/gi,
  ];
  for (const regex of regexes) {
    for (const match of text.matchAll(regex)) {
      const min = Number(match[1]);
      const max = match[2] ? Number(match[2]) : 100;
      const label = max === 100 ? `Level ${min}+` : `Level ${min}-${max}`;
      const key = `${min}-${max}`;
      if (!seen.has(key)) {
        seen.add(key);
        ranges.push({ min, max, label });
      }
    }
  }
  ranges.sort((a, b) => a.min - b.min || a.max - b.max);
  if (!ranges.length && /ice[- ]shot[- ]deadeye[- ]leveling[- ]guide|ice shot deadeye leveling guide/i.test(text)) {
    return [
      { min: 1, max: 14, label: "Level 1-14" },
      { min: 15, max: 23, label: "Level 15-23" },
      { min: 24, max: 30, label: "Level 24-30" },
      { min: 31, max: 41, label: "Level 31-41" },
      { min: 42, max: 59, label: "Level 42-59" },
      { min: 60, max: 100, label: "Level 60+" },
    ];
  }
  if (!ranges.length) {
    ranges.push({ min: 1, max: 100, label: "Guide stage" });
  }
  return ranges;
}

function extractMobalyticsSkills(text) {
  const known = [
    "Ice Shot", "Freezing Salvo", "Freezing Mark", "Herald of Ice", "Wind Dancer", "Combat Frenzy",
    "Lightning Arrow", "Explosive Shot", "Gas Arrow", "Magnetic Salvo", "Rain of Arrows", "Escape Shot",
    "Permafrost Bolts", "Fragmentation Rounds", "Frozen Shot", "Load Permafrost Bolts"
  ];
  const found = [];
  for (const name of known) {
    if (new RegExp(`\\b${escapeRegExp(name)}\\b`, "i").test(text)) {
      found.push({ id: name, name, levelInterval: [1, 100], supports: [] });
    }
  }
  return found;
}

function extractMobalyticsPriorities(text) {
  const lower = text.toLowerCase();
  const bySlot = { weapon: [], quiver: [], helmet: [], body: [], gloves: [], boots: [], ring: [], amulet: [], belt: [], flask: [] };
  const notes = [];
  const add = (slot, note) => {
    if (!bySlot[slot].includes(note)) bySlot[slot].push(note);
    if (!notes.includes(note)) notes.push(note);
  };

  if (/flat damage|added damage|damage to attacks/.test(lower)) {
    add("weapon", "Flat attack damage is a high-value leveling stat.");
    add("ring", "Flat damage on rings is useful while leveling.");
    add("gloves", "Flat damage to attacks on gloves is useful while leveling.");
  }
  if (/bow damage|projectile damage|bow skills|projectile/.test(lower)) {
    add("weapon", "Bow/projectile damage fits the guide damage plan.");
    add("quiver", "Projectile or bow-skill damage is a strong quiver stat.");
  }
  if (/cold|ice|freeze|chill/.test(lower)) {
    add("weapon", "Cold damage to attacks fits the Ice Shot plan.");
    add("quiver", "Cold/projectile attack scaling is preferred.");
    add("gloves", "Cold damage to attacks is useful on gloves.");
  }
  if (/attack speed|reload speed/.test(lower)) {
    add("weapon", "Attack speed is a strong damage and feel stat.");
    add("gloves", "Attack speed on gloves is valuable.");
    add("quiver", "Attack speed is valuable if available.");
  }
  if (/movement speed|move speed/.test(lower)) {
    add("boots", "Movement speed is a priority on boots.");
  }
  if (/life|maximum life/.test(lower)) {
    ["helmet", "body", "gloves", "boots", "belt", "ring", "amulet"].forEach(slot => add(slot, "Life is a strong general defensive stat."));
  }
  if (/resist|resistance/.test(lower)) {
    ["helmet", "body", "gloves", "boots", "belt", "ring", "amulet"].forEach(slot => add(slot, "Resistances are important on armor and jewelry slots."));
  }
  if (/attribute|strength|dexterity|intelligence|str|dex|int/.test(lower)) {
    ["helmet", "belt", "amulet", "ring"].forEach(slot => add(slot, "Use this slot to fix Str/Dex/Int requirements if needed."));
  }
  if (/flask/.test(lower)) {
    add("flask", "Keep flasks upgraded as level breakpoints unlock stronger bases.");
  }
  if (/critical|crit/.test(lower)) {
    add("weapon", "Crit can matter later if the build scales it.");
    add("quiver", "Crit stats may matter later if the guide scales them.");
  }

  if (!notes.length) {
    add("weapon", "Look for damage that matches the guide main skill.");
    add("boots", "Look for movement speed.");
    add("helmet", "Look for life, resistance, or needed attributes.");
  }

  return { notes, bySlot };
}

function buildPriorityTargetsFromMobalytics(priorities) {
  return Object.entries(priorities.bySlot)
    .filter(([, notes]) => notes.length)
    .map(([slot, notes]) => ({
      id: `mobalytics-${slot}`,
      slot,
      text: notes.join("\n"),
      name: `${label(slot)} priorities`,
      levelInterval: [1, 100],
      priorityOnly: true,
    }));
}

function createMobalyticsProfile(parsed) {
  const profile = createImportedProfile(parsed.stages);
  profile.name = `${parsed.name} (${parsed.stages.length} Mobalytics stages)`;
  profile.source = "mobalytics";
  profile.mobalytics = parsed;
  profile.statRules = buildMobalyticsRules(parsed);
  const defaultSlots = BUILD_PROFILES.frostCrossbow.slots;
  profile.slots = Array.from(new Set([...defaultSlots, ...profile.slots])).filter(slot => !["flask", "charm", "other"].includes(slot));
  return profile;
}

function buildMobalyticsRules(parsed) {
  const rules = buildImportedRules(parsed.stages);
  const text = `${parsed.name} ${(parsed.priorities?.notes || []).join(" ")}`;
  const lower = text.toLowerCase();
  if (/movement speed|move speed/.test(lower)) {
    rules.unshift({ match: /movement speed/i, category: "mobility", points: 22, note: "The imported Mobalytics guide specifically values movement speed." });
  }
  if (/flat attack damage|flat damage|damage to attacks/.test(lower)) {
    rules.unshift({ match: /adds .* damage to attacks|adds .* physical damage|adds .* cold damage/i, category: "damage", points: 12, note: "The imported Mobalytics guide values flat attack damage while leveling." });
  }
  if (/attribute|str\/dex\/int|strength|dexterity|intelligence/.test(lower)) {
    rules.unshift({ match: /strength|dexterity|intelligence/i, category: "attributes", points: 9, note: "The imported Mobalytics guide mentions attributes as requirement fixes." });
  }
  return rules;
}

function renderMobalyticsSummary(profile, parsed) {
  const stages = profile.importedStages || [];
  const priorityTags = (parsed.priorities?.notes || []).slice(0, 8).map(note => `<span class="tag">${escapeHtml(shortPriority(note))}</span>`).join(" ");
  return `
    <div class="summary-grid">
      <div><strong>${escapeHtml(profile.name)}</strong><br><span>${stages.length} stage(s) created from pasted guide text. Author/source: ${escapeHtml(parsed.author || "Mobalytics")}.</span></div>
      <div>${priorityTags || '<span class="tag">No priority tags detected</span>'}</div>
    </div>
    <div class="stage-chips">${stages.map(stage => `<span>${escapeHtml(stage.label)} · ${stage.skills.length} skills · ${stage.inventory.length} priority targets</span>`).join("")}</div>
  `;
}

function shortPriority(note) {
  return note
    .replace(" is a strong general defensive stat.", "")
    .replace(" are important on armor and jewelry slots.", "")
    .replace(" is a priority on boots.", "")
    .replace(" fits the Ice Shot plan.", "")
    .slice(0, 42);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeBuildFile(data, fileName) {
  let name = data.name || fileName.replace(/\.build$/i, "");
  // Fix the typo-trimmer: change Levelin back to Leveling
  name = name.replace(/\b([Ll]eveli)n\b/g, "$1ng").replace(/\b([Ll]eveli)N\b/g, "$1NG");
  const range = extractLevelRange(name, data);
  const inventory = Array.isArray(data.inventory_slots) ? data.inventory_slots.map(normalizeInventorySlot) : [];
  const skills = Array.isArray(data.skills) ? data.skills.map(normalizeSkill) : [];
  const skillNames = skills.map(skill => skill.name);
  const inferred = inferBuildFocus(`${name} ${skillNames.join(" ")} ${inventory.map(i => i.text).join(" ")}`);

  return {
    fileName,
    name,
    author: data.author || "Unknown",
    ascendancy: data.ascendancy || "Unknown",
    minLevel: range.min,
    maxLevel: range.max,
    label: range.label || name,
    inventory,
    skills,
    passiveCount: Array.isArray(data.passives) ? data.passives.length : 0,
    focus: inferred,
    raw: data,
  };
}

function extractLevelRange(name, data) {
  const text = String(name || "");
  const rangeMatch = text.match(/lvl\s*(\d+)\s*-\s*(\d+)/i) || text.match(/level\s*(\d+)\s*-\s*(\d+)/i);
  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]), label: `Level ${rangeMatch[1]}-${rangeMatch[2]}` };
  }
  const plusMatch = text.match(/lvl\s*(\d+)\s*\+/i) || text.match(/level\s*(\d+)\s*\+/i);
  if (plusMatch) {
    return { min: Number(plusMatch[1]), max: 100, label: `Level ${plusMatch[1]}+` };
  }
  const intervals = [];
  for (const slot of data.inventory_slots || []) {
    if (Array.isArray(slot.level_interval)) intervals.push(slot.level_interval);
  }
  for (const skill of data.skills || []) {
    if (Array.isArray(skill.level_interval)) intervals.push(skill.level_interval);
  }
  if (intervals.length) {
    const min = Math.min(...intervals.map(i => Number(i[0] || 1)));
    return { min, max: 100, label: `Level ${min}+` };
  }
  return { min: 1, max: 100, label: text || "Imported stage" };
}

function normalizeInventorySlot(slot) {
  const text = String(slot.additional_text || "").replace(/^\s+|\s+$/g, "");
  const name = text.split(/\r?\n/).find(Boolean) || slot.inventory_id || "Guide item";
  return {
    id: slot.inventory_id || "UnknownSlot",
    slot: mapInventoryIdToSlot(slot.inventory_id || "", text, name),
    text,
    name,
    levelInterval: slot.level_interval || [1, 100],
  };
}

function mapInventoryIdToSlot(id, text = "", name = "") {
  const value = String(id).toLowerCase();
  const itemText = `${name} ${text}`.toLowerCase();

  // Some exported guide files use Weapon2 for an off-set leveling item such as a talisman.
  // Prefer the item text/name when it clearly identifies a jewelry/flask/charm slot.
  if (/amulet|talisman/.test(itemText)) return "amulet";
  if (/ring/.test(itemText)) return "ring";
  if (/belt|sash/.test(itemText)) return "belt";
  if (/flask/.test(itemText)) return "flask";
  if (/charm/.test(itemText)) return "charm";
  if (/quiver/.test(itemText)) return "quiver";

  if (value.includes("offhand")) return "quiver";
  if (value.includes("helm")) return "helmet";
  if (value.includes("body")) return "body";
  if (value.includes("glove")) return "gloves";
  if (value.includes("boot")) return "boots";
  if (value.includes("ring")) return "ring";
  if (value.includes("amulet")) return "amulet";
  if (value.includes("belt")) return "belt";
  if (value.includes("flask")) return "flask";
  if (value.includes("charm")) return "charm";
  if (value.includes("weapon")) return "weapon";
  return "other";
}

function normalizeSkill(skill) {
  return {
    id: skill.id || "UnknownSkill",
    name: cleanGemName(skill.id || "UnknownSkill"),
    levelInterval: skill.level_interval || [1, 100],
    supports: (skill.support_skills || []).map(support => cleanGemName(support.id || "UnknownSupport")),
  };
}

function cleanGemName(id) {
  return String(id)
    .split("/").pop()
    .replace(/^SkillGem/i, "")
    .replace(/^SupportGem/i, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/Two$/i, " II")
    .trim() || id;
}

function inferBuildFocus(text) {
  const lower = text.toLowerCase();
  return {
    cold: /ice|cold|frost|freeze|chill/.test(lower),
    lightning: /lightning|shock/.test(lower),
    bow: /bow|quiver|arrow|shot|projectile/.test(lower),
    crossbow: /crossbow|bolt|reload/.test(lower),
    attack: /attack|bow|shot|projectile|arrow|crossbow/.test(lower),
    minion: /minion|skeletal|zombie|skeleton/.test(lower),
    spell: /spell|cast|sorcer|wizard/.test(lower),
  };
}

function createImportedProfile(stages) {
  const profileName = commonBuildName(stages);
  const allSlots = Array.from(new Set(stages.flatMap(stage => stage.inventory.map(item => item.slot)).filter(slot => slot !== "other")));
  const stageEntries = Object.fromEntries(stages.map((stage, index) => {
    const key = `stage_${index}`;
    return [key, {
      label: stage.label,
      data: stage,
      ...weightsForStage(stage),
    }];
  }));
  return {
    name: profileName,
    imported: true,
    slots: allSlots.length ? allSlots : BUILD_PROFILES.frostCrossbow.slots,
    baseWeights: BUILD_PROFILES.frostCrossbow.baseWeights,
    stages: stageEntries,
    statRules: buildImportedRules(stages),
    slotRules: defaultSlotRules(),
    importedStages: stages,
  };
}

function commonBuildName(stages) {
  const first = stages[0];
  let cleaned = first.name
    .replace(/lvl\s*\d+\s*-\s*\d+\s*-\s*/i, "")
    .replace(/lvl\s*\d+\+\s*-\s*/i, "")
    .trim();
  // Fix the typo-trimmer: change Levelin back to Leveling
  cleaned = cleaned.replace(/\b([Ll]eveli)n\b/g, "$1ng").replace(/\b([Ll]eveli)N\b/g, "$1NG");
  return `${cleaned || "Imported PoE2 Build"} (${stages.length} stages)`;
}

function weightsForStage(stage) {
  if (stage.minLevel >= 60) return { damage: 1.25, defense: 1.25, attributes: 0.9, resistance: 1.25, mobility: 1.0, synergy: 1.45 };
  if (stage.minLevel >= 42) return { damage: 1.15, defense: 1.1, attributes: 1.0, resistance: 1.15, mobility: 1.05, synergy: 1.35 };
  if (stage.minLevel >= 24) return { damage: 1.08, defense: 1.0, attributes: 1.15, resistance: 1.0, mobility: 1.15, synergy: 1.3 };
  return { damage: 1.0, defense: 0.9, attributes: 1.35, resistance: 0.9, mobility: 1.25, synergy: 1.15 };
}

function buildImportedRules(stages) {
  const text = stages.map(stage => `${stage.name} ${stage.skills.map(s => s.name).join(" ")} ${stage.inventory.map(i => i.text).join(" ")}`).join(" ");
  const focus = inferBuildFocus(text);
  const rules = [...defaultGenericRules()];
  if (focus.cold) {
    rules.unshift({ match: /cold damage to attacks|adds .* cold damage|cold damage/i, category: "synergy", points: 17, note: "The imported build appears to use Ice/cold scaling, so cold damage is highly relevant." });
  }
  if (focus.bow || focus.crossbow) {
    rules.unshift({ match: /projectile skills|projectile damage|bow skills|crossbow skills|quiver/i, category: "synergy", points: 14, note: "The imported build appears projectile/bow focused." });
    rules.unshift({ match: /attack speed|reload speed/i, category: "damage", points: 13, note: "The imported build is attack/projectile based, so attack speed/reload speed matters." });
  }
  if (!focus.spell) {
    rules.push({ match: /spell damage|minion damage/i, category: "synergy", points: -10, note: "This does not look relevant to the imported attack build." });
  }
  return rules;
}

function renderImportSummary(profile, failures) {
  const stages = profile.importedStages || [];
  const first = stages[0];
  const focusTags = summarizeFocus(stages).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join(" ");
  const warnings = failures.length ? `<p class="bad-text">Could not import: ${escapeHtml(failures.join("; "))}</p>` : "";
  return `
    <div class="summary-grid">
      <div><strong>${escapeHtml(profile.name)}</strong><br><span>${stages.length} stage(s) imported. Author: ${escapeHtml(first?.author || "Unknown")}. Ascendancy: ${escapeHtml(first?.ascendancy || "Unknown")}.</span></div>
      <div>${focusTags || '<span class="tag">No focus detected</span>'}</div>
    </div>
    <div class="stage-chips">${stages.map(stage => `<span>${escapeHtml(stage.label)} · ${stage.skills.length} skills · ${stage.inventory.length} gear targets</span>`).join("")}</div>
    ${warnings}
  `;
}

function summarizeFocus(stages) {
  const combined = stages.reduce((acc, stage) => {
    Object.entries(stage.focus).forEach(([key, value]) => { if (value) acc.add(key); });
    return acc;
  }, new Set());
  const labelMap = { cold: "Cold/Ice", lightning: "Lightning", bow: "Bow", crossbow: "Crossbow", attack: "Attack", spell: "Spell", minion: "Minion" };
  return Array.from(combined).map(key => labelMap[key] || key);
}

function renderStageDetails() {
  const profile = getProfile();
  const stage = profile.stages[stageSelect.value];
  if (!profile.imported || !stage?.data) {
    stageDetails.classList.add("hidden");
    stageDetails.innerHTML = "";
    return;
  }
  const data = stage.data;
  syncPlayerLevelToStage(data);
  const target = findTargetItem(data, slotSelect.value);
  const skills = data.skills.slice(0, 12).map(skill => {
    const supports = skill.supports.length ? ` <span class="muted">(${skill.supports.slice(0, 4).join(", ")})</span>` : "";
    return `<li>${escapeHtml(skill.name)}${supports}</li>`;
  }).join("");
  const gear = data.inventory.slice(0, 14).map(item => `<li><strong>${escapeHtml(label(item.slot))}</strong>: ${escapeHtml(item.name)}</li>`).join("");
  const priorityNotes = (data.priorityNotes || []).slice(0, 8).map(note => `<li>${escapeHtml(note)}</li>`).join("");
  const selectedSlotNotes = (data.prioritySlots?.[slotSelect.value] || []).map(note => `<li>${escapeHtml(note)}</li>`).join("");

  stageDetails.classList.remove("hidden");
  stageDetails.innerHTML = `
    <div class="stage-detail-grid">
      <div>
        <h2>${escapeHtml(data.label)} guide stage</h2>
        <p class="subtitle small">${escapeHtml(data.name)} · ${data.passiveCount} passive entries · ${data.inventory.length} guide gear targets</p>
        <div class="target-callout ${target ? "" : "missing"}">
          <strong>Selected slot target:</strong> ${target ? escapeHtml(target.name) : `No guide target found for ${escapeHtml(label(slotSelect.value))}.`}
        </div>
      </div>
      <div class="stage-section skills-section">
        <h3>Skills detected</h3>
        <ul>${skills || "<li>No skills found.</li>"}</ul>
      </div>
      <div class="stage-section gear-section">
        <h3>Guide gear detected</h3>
        <ul>${gear || "<li>No guide gear found.</li>"}</ul>
      </div>
      ${priorityNotes ? `<div><h3>Guide priorities</h3><ul>${priorityNotes}</ul></div>` : ""}
      ${selectedSlotNotes ? `<div><h3>${escapeHtml(label(slotSelect.value))} priorities</h3><ul>${selectedSlotNotes}</ul></div>` : ""}
    </div>
  `;
}

function findTargetItem(stageData, slot) {
  if (!stageData) return null;
  return stageData.inventory.find(item => item.slot === slot) || null;
}

function loadGuideTargetForSlot() {
  const profile = getProfile();
  const stage = profile.stages[stageSelect.value];
  const target = findTargetItem(stage?.data, slotSelect.value);
  if (!target) {
    results.classList.remove("hidden");
    results.innerHTML = `<article class="panel result-header"><div class="verdict warn">No guide target for this slot</div><p class="subtitle">The imported stage does not include a target item for <strong>${escapeHtml(label(slotSelect.value))}</strong>.</p></article>`;
    return;
  }
  currentItem.value = convertGuideItemToPasteText(target);
}

function convertGuideItemToPasteText(item) {
  const classMap = { weapon: "Bows", quiver: "Quivers", helmet: "Helmets", body: "Body Armours", gloves: "Gloves", boots: "Boots", amulet: "Amulets", ring: "Rings", belt: "Belts", flask: "Flasks", charm: "Charms" };
  const slotLabel = classMap[item.slot] || label(item.slot);
  const lines = item.text.split(/\r?\n/).map(line => line.replace(/^\d+\.\s*/, "")).filter(Boolean);
  const name = lines.shift() || item.name;
  return `Item Class: ${slotLabel}\nRarity: Rare\n${name}\n--------\n${lines.join("\n")}`;
}

function parseItem(text) {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => line !== "--------")
    .map(line => line.replace(/^\d+\.\s*/, ""));

  return {
    raw: text,
    lines,
    itemClass: findValue(lines, /^Item Class:\s*(.+)$/i),
    rarity: findValue(lines, /^Rarity:\s*(.+)$/i),
    name: detectName(lines),
    requirements: lines.filter(line => /^Requires:/i.test(line)),
    requiredLevel: extractRequiredLevel(lines),
    requiredAttributes: extractRequiredAttributes(lines),
    itemLevel: extractItemLevel(lines),
    mods: lines.filter(isLikelyMod),
    stats: extractItemStats(lines),
  };
}

function findValue(lines, regex) {
  const line = lines.find(l => regex.test(l));
  return line ? line.match(regex)[1] : "";
}

function detectName(lines) {
  const rarityIndex = lines.findIndex(l => /^Rarity:/i.test(l));
  if (rarityIndex >= 0 && lines[rarityIndex + 1]) return lines[rarityIndex + 1];
  const firstNonMeta = lines.find(line => !/^(Item Class|Rarity|Requires|Item Level):/i.test(line));
  return firstNonMeta || "Unnamed item";
}

function isLikelyMod(line) {
  if (/^(Item Class|Rarity|Requires|Item Level):/i.test(line)) return false;
  if (/^(Superior|Normal|Magic|Rare|Unique)$/i.test(line)) return false;
  if (/^[A-Z][a-z]+( [A-Z][a-z]+){0,4}$/.test(line)) return false;
  return /\d|adds|increased|reduced|resistance|maximum|speed|damage|life|strength|dexterity|intelligence|armour|evasion|energy shield|projectile|bow|crossbow/i.test(line);
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

function slotMismatch(item, selectedSlot) {
  const inferred = inferSlotFromItem(item);
  if (inferred === "unknown") return null;
  if (selectedSlot === inferred) return null;
  if (selectedSlot === "weapon" && item.itemClass && /weapon|bow|crossbow/i.test(item.itemClass)) return null;
  return { inferred, selected: selectedSlot };
}

function scoreItem(item, profile, slot, stageKey) {
  const scores = Object.fromEntries(SCORE_KEYS.map(key => [key, 0]));
  const hits = [];
  const warnings = [];
  const stageWeights = profile.stages[stageKey] || {};
  const slotWeights = profile.slotRules[slot] || {};
  const usedLineCategories = new Set();

  for (const line of item.mods) {
    for (const rule of profile.statRules) {
      if (rule.match.test(line)) {
        // Do not let one mod produce duplicate advice in the same category.
        const hitKey = `${line.toLowerCase()}::${rule.category}`;
        if (usedLineCategories.has(hitKey)) continue;
        usedLineCategories.add(hitKey);

        const base = rule.points;
        const slotMultiplier = slotWeights[rule.category] ?? 1;
        const stageMultiplier = stageWeights[rule.category] ?? profile.baseWeights[rule.category] ?? 1;
        const points = Math.round(base * slotMultiplier * stageMultiplier);
        scores[rule.category] += points;
        hits.push({ line, category: rule.category, points, note: rule.note });
        if (points < 0) warnings.push(rule.note);
      }
    }
  }

  const mismatch = slotMismatch(item, slot);
  if (mismatch) {
    warnings.push(`This item looks like ${label(mismatch.inferred)}, but the selected slot is ${label(mismatch.selected)}.`);
  }

  const playerLevel = getPlayerLevel();
  if (item.requiredLevel && item.requiredLevel > playerLevel) {
    warnings.push(`Requires level ${item.requiredLevel}, but player level is ${playerLevel}.`);
  }

  const attributeProblem = getAttributeRequirementProblem(item, getPlayerAttributes());
  if (attributeProblem) warnings.push(formatAttributeRequirementProblem(attributeProblem));

  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  return { item, scores, total, hits, warnings, mismatch, attributeProblem };
}

function analyze() {
  const currentText = currentItem.value.trim();
  const newText = newItem.value.trim();
  if (!currentText || !newText) {
    results.classList.remove("hidden");
    results.innerHTML = `<article class="panel result-header"><div class="verdict warn">Paste both items first</div><p class="subtitle">Add your current item and the replacement item so the tool can compare them.</p></article>`;
    return;
  }

  const profile = getProfile();
  const slot = slotSelect.value;
  const stage = stageSelect.value;
  const current = scoreItem(parseItem(currentText), profile, slot, stage);
  const replacement = scoreItem(parseItem(newText), profile, slot, stage);
  const diff = diffScores(current.scores, replacement.scores);
  const totalDiff = replacement.total - current.total;
  const verdict = getVerdict(totalDiff, diff, slot, current, replacement);

  results.classList.remove("hidden");
  results.innerHTML = renderResults({ profile, slot, stage, current, replacement, diff, totalDiff, verdict });
}

function diffScores(a, b) {
  return Object.fromEntries(SCORE_KEYS.map(key => [key, b[key] - a[key]]));
}

function getVerdict(totalDiff, diff, slot, current, replacement) {
  const playerLevel = getPlayerLevel();
  if (replacement?.item?.requiredLevel && replacement.item.requiredLevel > playerLevel) {
    return {
      text: "Too high level",
      tone: "warn",
      opinion: `The replacement requires level ${replacement.item.requiredLevel}, but your player level is ${playerLevel}. It may be good later, but you should not equip it yet.`
    };
  }
  if (replacement?.attributeProblem) {
    return {
      text: "Missing attributes",
      tone: "warn",
      opinion: `${formatAttributeRequirementProblem(replacement.attributeProblem)} It may be a good item later, but you cannot safely treat it as an upgrade until that requirement is fixed.`
    };
  }
  if (replacement?.mismatch) {
    return {
      text: "Check selected slot",
      tone: "warn",
      opinion: `The replacement appears to be ${label(replacement.mismatch.inferred)}, but you are comparing it as ${label(slot)}. Change the gear slot before trusting the score.`
    };
  }
  if (current?.mismatch) {
    return {
      text: "Current slot mismatch",
      tone: "warn",
      opinion: `The current item appears to be ${label(current.mismatch.inferred)}, but the selected slot is ${label(slot)}. Change the gear slot or reload the guide target.`
    };
  }
  if (totalDiff >= 25) return { text: "Equip now", tone: "good", opinion: "This looks like a clear upgrade for the selected build stage." };
  if (totalDiff >= 10) return { text: "Likely upgrade", tone: "good", opinion: "This is probably worth using, especially if it fixes a requirement or resistance gap." };
  if (totalDiff >= 1) return { text: "Small upgrade / sidegrade", tone: "warn", opinion: "This is close. Equip it if the specific positives solve a current problem." };
  if (totalDiff > -10) return { text: "Mostly sidegrade", tone: "warn", opinion: "The new item is not clearly better. Use the details below to decide if the tradeoff is worth it." };
  return { text: "Keep current item", tone: "bad", opinion: "The replacement looks worse for this build profile right now." };
}

function renderResults(data) {
  const { profile, slot, stage, current, replacement, diff, totalDiff, verdict } = data;
  const stageLabel = profile.stages[stage]?.label || stage;
  const positives = replacement.hits.filter(hit => hit.points > 0).sort((a, b) => b.points - a.points).slice(0, 8);
  const negatives = [
    ...replacement.hits.filter(hit => hit.points < 0).sort((a, b) => a.points - b.points).map(hit => `${hit.line} (${formatScore(hit.points)})`),
    ...replacement.warnings.filter((warning, index, arr) => arr.indexOf(warning) === index)
  ];
  const deltas = Object.entries(diff).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

  return `
    <article class="panel result-header">
      <div class="verdict ${verdict.tone}">${verdict.text}</div>
      <h2>${escapeHtml(replacement.item.name)} vs ${escapeHtml(current.item.name)}</h2>
      <p class="subtitle">
        ${verdict.opinion} Build: <strong>${escapeHtml(profile.name)}</strong>. Slot: <strong>${escapeHtml(label(slot))}</strong>. Stage: <strong>${escapeHtml(stageLabel)}</strong>.
      </p>
    </article>

    <section class="score-grid">
      ${renderScoreCard("Total", totalDiff)}
      ${deltas.map(([key, value]) => renderScoreCard(label(key), value)).join("")}
    </section>

    <section class="analysis-grid">
      <article class="panel analysis-card">
        <h3>Why it helps</h3>
        ${renderList(positives.map(hit => `${hit.line} (${formatScore(hit.points)})`), "good", "No major positive matches found.")}
      </article>
      <article class="panel analysis-card">
        <h3>Possible problems</h3>
        ${renderList(negatives, "bad", "No obvious off-build stats found.")}
      </article>
      <article class="panel analysis-card">
        <h3>Opinion</h3>
        ${renderOpinion(totalDiff, diff, slot)}
      </article>
    </section>
  `;
}

function renderScoreCard(title, value) {
  const className = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
  return `<article class="panel score-card"><span>${escapeHtml(title)}</span><strong class="${className}">${formatScore(value)}</strong></article>`;
}

function renderList(items, className, empty) {
  if (!items.length) return `<p class="subtitle small">${escapeHtml(empty)}</p>`;
  return `<ul>${items.map(item => `<li class="${className}">${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderOpinion(totalDiff, diff, slot) {
  const notes = [];
  if (diff.attributes >= 10) notes.push("This may be worth using if you are struggling with Str/Dex/Int requirements.");
  if (slot === "boots" && diff.mobility > 0) notes.push("Movement speed on boots is a big practical upgrade while playing.");
  if (diff.resistance >= 10) notes.push("This helps your resistance situation, which can matter more than small DPS changes.");
  if (diff.damage < -10 && totalDiff > 0) notes.push("You are losing damage, but other stats may be solving a bigger problem.");
  if (diff.synergy < 0) notes.push("Some stats look off-plan for the selected build profile.");
  if (!notes.length) notes.push(totalDiff >= 0 ? "The new item is usable. Check whether the positive categories match what your character currently lacks." : "The current item is probably safer unless the replacement fixes a hidden requirement issue.");
  return `<ul>${notes.map(note => `<li class="warn">${escapeHtml(note)}</li>`).join("")}</ul>`;
}


function getPlayerLevel() {
  const value = Number(playerLevelInput?.value || 1);
  return Math.max(1, Math.min(100, Number.isFinite(value) ? value : 1));
}

function getPlayerAttributes() {
  return {
    str: safeNumber(playerStrInput?.value, 0),
    dex: safeNumber(playerDexInput?.value, 0),
    int: safeNumber(playerIntInput?.value, 0),
  };
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : fallback;
}

function getAttributeRequirementProblem(item, playerAttrs) {
  const reqs = item.requiredAttributes || {};
  const missing = Object.entries(reqs)
    .map(([key, required]) => ({ key, required, current: playerAttrs[key] || 0, shortBy: required - (playerAttrs[key] || 0) }))
    .filter(entry => entry.required > 0 && entry.shortBy > 0);
  return missing.length ? { missing, playerAttrs } : null;
}

function formatAttributeRequirementProblem(problem) {
  const names = { str: "Strength", dex: "Dexterity", int: "Intelligence" };
  const parts = problem.missing.map(entry => `${names[entry.key]} ${entry.current}/${entry.required} — short ${entry.shortBy}`);
  return `Missing attribute requirement: ${parts.join(", ")}.`;
}

function syncPlayerLevelToStage(stageData) {
  if (!stageData || document.activeElement === playerLevelInput) return;
  const current = Number(playerLevelInput.value || 0);
  // Do not overwrite an imported/manual player level just because a guide stage was rendered.
  // Stage selection should guide scoring, while actual player level stays whatever the user/PoB import says.
  if (!current) {
    playerLevelInput.value = stageData.minLevel || 1;
  }
}

function extractRequiredLevel(lines) {
  const joined = lines.join(" ");
  const match = joined.match(/Requires:[^\n]*?Level\s+(\d+)/i) || joined.match(/Requires\s+Level\s+(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function extractItemLevel(lines) {
  const joined = lines.join(" ");
  const match = joined.match(/Item Level:\s*(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function extractRequiredAttributes(lines) {
  const joined = lines.join(" ");
  const attrs = {};
  for (const [name, regex] of Object.entries({ str: /(\d+)\s*Str/i, dex: /(\d+)\s*Dex/i, int: /(\d+)\s*Int/i })) {
    const match = joined.match(regex);
    if (match) attrs[name] = Number(match[1]);
  }
  return attrs;
}


function hasEquipmentEntries() {
  return Boolean((fullGearText?.value || "").trim()) || Boolean(equipmentFields?.querySelectorAll(".equipment-item-text").length);
}

function extractItemStats(lines) {
  const stats = {
    str: 0, dex: 0, int: 0,
    life: 0,
    fireRes: 0, coldRes: 0, lightningRes: 0, chaosRes: 0, allRes: 0,
    movementSpeed: 0,
    addedColdMin: 0, addedColdMax: 0,
    addedPhysicalMin: 0, addedPhysicalMax: 0,
    addedLightningMin: 0, addedLightningMax: 0,
    addedFireMin: 0, addedFireMax: 0,
    attackSpeed: 0,
    bowSkillDamage: 0,
    projectileDamage: 0,
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\([^)]*\)/g, "");
    addSignedStat(stats, "str", line, /([+-]?\d+)\s+to\s+Strength/i);
    addSignedStat(stats, "dex", line, /([+-]?\d+)\s+to\s+Dexterity/i);
    addSignedStat(stats, "int", line, /([+-]?\d+)\s+to\s+Intelligence/i);
    addSignedStat(stats, "life", line, /([+-]?\d+)\s+to\s+maximum Life/i);
    addSignedStat(stats, "fireRes", line, /([+-]?\d+)%\s+to\s+Fire Resistance/i);
    addSignedStat(stats, "coldRes", line, /([+-]?\d+)%\s+to\s+Cold Resistance/i);
    addSignedStat(stats, "lightningRes", line, /([+-]?\d+)%\s+to\s+Lightning Resistance/i);
    addSignedStat(stats, "chaosRes", line, /([+-]?\d+)%\s+to\s+Chaos Resistance/i);
    addSignedStat(stats, "allRes", line, /([+-]?\d+)%\s+to\s+All Elemental Resistances/i);
    addSignedStat(stats, "movementSpeed", line, /([+-]?\d+)%\s+increased Movement Speed/i);
    addSignedStat(stats, "attackSpeed", line, /([+-]?\d+)%\s+increased Attack Speed/i);
    addSignedStat(stats, "bowSkillDamage", line, /([+-]?\d+)%\s+increased Damage with Bow Skills/i);
    addSignedStat(stats, "projectileDamage", line, /([+-]?\d+)%\s+increased Projectile Damage/i);

    const added = line.match(/Adds\s+(\d+)\s+to\s+(\d+)\s+(Cold|Physical|Lightning|Fire)\s+Damage\s+to\s+Attacks/i);
    if (added) {
      const min = Number(added[1]);
      const max = Number(added[2]);
      const type = added[3].toLowerCase();
      const cap = type.charAt(0).toUpperCase() + type.slice(1);
      stats[`added${cap}Min`] += min;
      stats[`added${cap}Max`] += max;
    }
  }
  return stats;
}

function addSignedStat(stats, key, line, regex) {
  const match = line.match(regex);
  if (match) stats[key] += Number(match[1]);
}

function aggregateGearTotals(items) {
  const totals = {
    str: 0, dex: 0, int: 0,
    life: 0,
    fireRes: 0, coldRes: 0, lightningRes: 0, chaosRes: 0, allRes: 0,
    movementSpeed: 0,
    attackSpeed: 0,
    bowSkillDamage: 0,
    projectileDamage: 0,
    addedColdAvg: 0,
    addedPhysicalAvg: 0,
    addedLightningAvg: 0,
    addedFireAvg: 0,
  };
  for (const entry of items) {
    const stats = entry.scored?.item?.stats || {};
    for (const key of ["str", "dex", "int", "life", "fireRes", "coldRes", "lightningRes", "chaosRes", "allRes", "movementSpeed", "attackSpeed", "bowSkillDamage", "projectileDamage"]) {
      totals[key] += stats[key] || 0;
    }
    totals.addedColdAvg += ((stats.addedColdMin || 0) + (stats.addedColdMax || 0)) / 2;
    totals.addedPhysicalAvg += ((stats.addedPhysicalMin || 0) + (stats.addedPhysicalMax || 0)) / 2;
    totals.addedLightningAvg += ((stats.addedLightningMin || 0) + (stats.addedLightningMax || 0)) / 2;
    totals.addedFireAvg += ((stats.addedFireMin || 0) + (stats.addedFireMax || 0)) / 2;
  }
  return totals;
}

function buildNeededStats({ rows, equippedRows = [], futureRows = [], gearTotals, requirementProblems, profile, stageKey, playerLevel, playerAttrs }) {
  const needs = [];
  const stage = profile.stages?.[stageKey];
  const minLevel = stage?.data?.minLevel || 1;
  const maxLevel = stage?.data?.maxLevel || 100;
  const isEarly = maxLevel <= 23;
  const isMid = minLevel >= 24 && maxLevel <= 59;
  const isLate = minLevel >= 60;

  const allPastedAreFuture = rows.some(row => row.entry) && futureRows.length > 0 && equippedRows.length === 0;
  if (allPastedAreFuture && playerLevel <= 1 && playerAttrs.str === 0 && playerAttrs.dex === 0 && playerAttrs.int === 0) {
    needs.push("Player level/attributes look unset. Enter your real level and Str/Dex/Int before trusting requirement warnings.");
  }

  const missingAttrs = rows.flatMap(row => row.attrProblem?.missing || []);
  const byAttr = {};
  for (const miss of missingAttrs) byAttr[miss.key] = Math.max(byAttr[miss.key] || 0, miss.shortBy);
  for (const [key, shortBy] of Object.entries(byAttr)) {
    const name = { str: "Strength", dex: "Dexterity", int: "Intelligence" }[key];
    needs.push(`+${shortBy} ${name} needed to equip one or more pasted/future items. Best places to fix it: amulet, rings, helmet, or belt.`);
  }

  if (futureRows.some(row => row.levelProblem)) needs.push(`Some pasted items are above player level ${playerLevel}. They are now treated as future upgrades and are not counted in gear totals.`);
  if (equippedRows.length && gearTotals.movementSpeed <= 0) needs.push("Movement speed boots should be a top priority; they make leveling feel much better.");
  if (equippedRows.length && !isEarly) {
    const finalRes = window.currentPobbBuild?.stats?.resistances || null;
    const lowRes = [];
    if (finalRes && Object.keys(finalRes).length) {
      if (Number(finalRes.fire) < 75) lowRes.push("Fire");
      if (Number(finalRes.cold) < 75) lowRes.push("Cold");
      if (Number(finalRes.lightning) < 75) lowRes.push("Lightning");
    } else {
      if (gearTotals.fireRes + gearTotals.allRes < 25) lowRes.push("Fire");
      if (gearTotals.coldRes + gearTotals.allRes < 25) lowRes.push("Cold");
      if (gearTotals.lightningRes + gearTotals.allRes < 25) lowRes.push("Lightning");
    }
    if (lowRes.length) needs.push(`Add more ${lowRes.join("/")} resistance on armor or jewelry. Do not use weapon/quiver slots to solve every defensive problem.`);
  }
  if (equippedRows.length && (gearTotals.life || 0) < (isEarly ? 20 : isLate ? 120 : 60)) needs.push("Look for more +maximum Life on armor, belt, rings, and amulet.");
  if (equippedRows.length && gearTotals.addedColdAvg + gearTotals.addedPhysicalAvg < (isEarly ? 4 : isLate ? 18 : 9)) needs.push("Add more flat physical/cold damage to attacks on weapon, rings, gloves, or quiver.");
  if (equippedRows.length && (isMid || isLate)) {
    if (gearTotals.attackSpeed <= 0) needs.push("Start looking for attack speed, especially on gloves/weapon/quiver if available.");
    if (gearTotals.bowSkillDamage + gearTotals.projectileDamage <= 0) needs.push("Bow skill damage or projectile damage would improve build synergy.");
  }
  if (!needs.length) needs.push("No urgent stat gap detected. Your next upgrade can focus on replacing the lowest-scoring slot.");
  return [...new Set(needs)].slice(0, 8);
}

function buildShoppingList(profile, stageKey, rows) {
  const stageData = profile.stages?.[stageKey]?.data;
  const guide = stageData?.prioritySlots || {};
  const defaults = {
    weapon: ["Flat physical/cold damage to attacks", "Bow/projectile damage", "Attack speed if available"],
    quiver: ["Cold/physical damage to attacks", "Bow skill or projectile damage", "Attributes or resistance if needed"],
    helmet: ["Life", "Resistance", "Attributes if gems/items are blocked"],
    body: ["Life", "Strong defensive base", "Resistance"],
    gloves: ["Attack speed", "Flat cold/physical damage to attacks", "Life or resistance"],
    boots: ["Movement speed", "Life", "Resistance"],
    ring: ["Flat damage to attacks", "Resistance", "Attributes"],
    amulet: ["Attributes", "Life/resistance", "Damage stats if requirements are solved"],
    belt: ["Life", "Resistance", "Strength/attributes if needed"],
  };
  const slots = rows.map(row => row.slot).filter(slot => defaults[slot] || guide[slot]);
  return slots.map(slot => {
    const items = mergeShoppingTerms([...(guide[slot] || []), ...(defaults[slot] || [])]);
    return { slot, items: items.slice(0, 4) };
  });
}

function mergeShoppingTerms(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const text = String(item || "").trim();
    if (!text) continue;
    const key = text
      .toLowerCase()
      .replace(/is a strong general defensive stat|is a priority on boots|fits the guide damage plan|fits the ice shot plan|if available|while leveling|strong|general|stat|priority/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const simpleKey = key.includes("movement speed") ? "movement speed"
      : key.includes("resist") ? "resistance"
      : key.includes("attribute") || key.includes("str") || key.includes("dex") || key.includes("int") ? "attributes"
      : key.includes("life") ? "life"
      : key.includes("attack speed") ? "attack speed"
      : key.includes("flat") || key.includes("cold") || key.includes("physical") ? "flat damage"
      : key.includes("bow") || key.includes("projectile") ? "bow projectile"
      : key;
    if (seen.has(simpleKey)) continue;
    seen.add(simpleKey);
    result.push(text);
  }
  return result;
}

function renderGearTotals(totals) {
  const entries = [
    ["Attributes", `+${totals.str} Str / +${totals.dex} Dex / +${totals.int} Int`],
    ["Life", `+${totals.life}`],
    ["Resists", `Fire ${totals.fireRes + totals.allRes}% / Cold ${totals.coldRes + totals.allRes}% / Lightning ${totals.lightningRes + totals.allRes}% / Chaos ${totals.chaosRes}%`],
    ["Mobility", `${totals.movementSpeed}% movement speed`],
    ["Attack speed", `${totals.attackSpeed}%`],
    ["Flat attack damage", `Cold avg ${round1(totals.addedColdAvg)} / Phys avg ${round1(totals.addedPhysicalAvg)} / Lightning avg ${round1(totals.addedLightningAvg)} / Fire avg ${round1(totals.addedFireAvg)}`],
    ["Build scaling", `${totals.bowSkillDamage}% bow skill / ${totals.projectileDamage}% projectile`],
  ];
  return `<div class="totals-grid">${entries.map(([name, value]) => `<div class="total-pill"><span>${escapeHtml(name)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>`;
}

function renderShoppingList(shoppingList) {
  if (!shoppingList.length) return `<p class="subtitle small">No shopping list available yet.</p>`;
  return `<div class="shopping-grid">${shoppingList.map(group => `<article class="shopping-card"><h4>${escapeHtml(label(group.slot))}</h4><ul>${group.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>`).join("")}</div>`;
}

function buildExportText(report) {
  if (!report) return "No health report generated yet.";
  const { profile, stage, playerLevel, playerAttrs, rows, missing, levelProblems, attributeProblems, pobbWarnings = [], weak, nextSteps, neededStats, gearTotals, resistanceGaps = [], fixSlots = [], shoppingList, count, equippedCount = 0, futureCount = 0 } = report;
  const lines = [];
  lines.push("PoE2 Gear Coach Health Report");
  lines.push(`Build: ${profile.name}`);
  lines.push(`Stage: ${stage?.label || stageSelect.value}`);
  lines.push(`Player: Level ${playerLevel}, ${playerAttrs.str} Str / ${playerAttrs.dex} Dex / ${playerAttrs.int} Int`);
  lines.push(`Parsed items: ${count} (${equippedCount} currently equippable, ${futureCount} future/blocked)`);
  if (window.currentPobbBuild) {
    const pb = window.currentPobbBuild;
    const st = pb.stats || {};
    const r = st.resistances || {};
    lines.push(`pobb.in import: ${pb.name || "imported build"}`);
    lines.push(`pobb.in visible stats: Life ${st.life ?? "—"}, ES ${st.es ?? "—"}, eHP ${st.eHP ?? "—"}, DPS ${st.dps ?? "—"}, Res Fire ${r.fire ?? "—"}% / Cold ${r.cold ?? "—"}% / Lightning ${r.lightning ?? "—"}% / Chaos ${r.chaos ?? "—"}%`);
  }
  lines.push("");
  lines.push("Gear affix totals (currently equippable items only; pobb.in visible stats are final character stats):");
  lines.push(`- Attributes from gear: +${gearTotals.str} Str / +${gearTotals.dex} Dex / +${gearTotals.int} Int`);
  lines.push(`- Life from gear: +${gearTotals.life}`);
  lines.push(`- Resists from gear: Fire ${gearTotals.fireRes + gearTotals.allRes}% / Cold ${gearTotals.coldRes + gearTotals.allRes}% / Lightning ${gearTotals.lightningRes + gearTotals.allRes}% / Chaos ${gearTotals.chaosRes}%`);
  lines.push(`- Movement speed: ${gearTotals.movementSpeed}%`);
  lines.push(`- Flat attack damage avg: Cold ${round1(gearTotals.addedColdAvg)}, Phys ${round1(gearTotals.addedPhysicalAvg)}, Lightning ${round1(gearTotals.addedLightningAvg)}, Fire ${round1(gearTotals.addedFireAvg)}`);
  lines.push("");
  if (resistanceGaps.length) {
    lines.push("Resistance gaps from pobb.in final stats:");
    resistanceGaps.forEach(gap => lines.push(`- ${gap.name}: ${gap.value}% (${gap.priority}); needs +${gap.toZero} to reach 0%, +${gap.toFifty} to reach 50%, +${gap.toCap} to reach 75%.`));
    lines.push("");
  }
  if (fixSlots.length) {
    lines.push("Best slots to fix current problem:");
    fixSlots.forEach(item => lines.push(`- ${item}`));
    lines.push("");
  }
  lines.push("What stats I need next:");
  neededStats.forEach(item => lines.push(`- ${item}`));
  lines.push("");
  lines.push("Next upgrades:");
  nextSteps.forEach(item => lines.push(`- ${item}`));
  lines.push("");
  lines.push("Weakest slots:");
  weak.forEach(item => lines.push(`- ${item}`));
  lines.push("");
  lines.push("Warnings:");
  [...pobbWarnings, ...levelProblems, ...attributeProblems, ...missing].forEach(item => lines.push(`- ${item}`));
  if (![...pobbWarnings, ...levelProblems, ...attributeProblems, ...missing].length) lines.push("- None");
  lines.push("");
  lines.push("Slot summary:");
  rows.forEach(row => {
    lines.push(`- ${row.displaySlot || label(row.slot)}: ${row.entry?.scored.item.name || "missing"}; score ${row.score === null ? "—" : formatScore(row.score)}; requires ${summarizeRequirements(row.entry?.scored.item)}; guide target ${row.guideTarget?.name || "—"}`);
  });
  lines.push("");
  lines.push("Shopping list:");
  shoppingList.forEach(group => lines.push(`- ${label(group.slot)}: ${group.items.join("; ")}`));
  return lines.join("\n");
}

async function exportHealthReport() {
  if (!window.lastHealthReport) analyzeBuildHealth();
  const text = buildExportText(window.lastHealthReport);
  try {
    await navigator.clipboard.writeText(text);
    setExportStatus("Copied health report. Paste it here when you want me to tune the advice.", "good");
  } catch (error) {
    setExportStatus("Could not copy automatically. The report is shown below so you can select/copy it.", "warn");
    healthResults.classList.remove("hidden");
    healthResults.insertAdjacentHTML("afterbegin", `<article class="panel health-card"><h3>Copyable report</h3><textarea class="export-textarea" readonly>${escapeHtml(text)}</textarea></article>`);
  }
}

function setExportStatus(message, tone = "warn") {
  if (!exportStatus) return;
  exportStatus.className = `mini-note export-status ${tone}`;
  exportStatus.textContent = message;
  setTimeout(() => { if (exportStatus.textContent === message) exportStatus.textContent = ""; }, 5000);
}


function getCleanFullGearTextForSession() {
  const fieldTextareas = Array.from(equipmentFields?.querySelectorAll(".equipment-item-text") || []);
  const source = fieldTextareas.length
    ? fieldTextareas.map(textarea => textarea.value.trim()).filter(Boolean).join("\n\n")
    : (fullGearText.value || "");
  return splitMultipleItems(source).filter(isRealItemChunk).join("\n\n");
}

function buildSessionData() {
  const profile = getProfile();
  return {
    version: 30,
    buildKey: buildSelect.value,
    startWithWindows: document.getElementById("startupCheckbox")?.checked || false,
    slot: slotSelect.value,
    stage: stageSelect.value,
    playerLevel: playerLevelInput.value,
    playerStr: playerStrInput.value,
    playerDex: playerDexInput.value,
    playerInt: playerIntInput.value,
    fullGearText: getCleanFullGearTextForSession(),
    currentItem: currentItem.value,
    newItem: newItem.value,
    mobalyticsGuideText: mobalyticsGuideText.value,
    pobbInput: pobbInput?.value || "",
    pobbBuild: window.currentPobbBuild || null,
    importedProfile: profile ? serializeProfileForSession(profile) : null,
  };
}

function serializeProfileForSession(profile) {
  try {
    const clone = JSON.parse(JSON.stringify(profile, (_key, value) => {
      if (value instanceof RegExp) return value.toString();
      return value;
    }));
    if (Array.isArray(profile.statRules)) {
      clone.statRules = profile.statRules.map(rule => ({ ...rule, match: rule.match instanceof RegExp ? rule.match.toString() : String(rule.match || "") }));
    }
    return clone;
  } catch (_err) {
    return null;
  }
}

function saveSession() {
  const data = buildSessionData();
  localStorage.setItem("poe2GearCoachSession", JSON.stringify(data));
  if (window.poe2Coach?.saveSession) {
    try { window.poe2Coach.saveSession(data); } catch (_err) {}
  }
  setExportStatus("Session saved for settings and overlay.", "good");
}

function loadSession() {
  const raw = localStorage.getItem("poe2GearCoachSession");
  if (!raw) {
    setExportStatus("No saved session found in this browser.", "warn");
    return;
  }
  const data = JSON.parse(raw);
  if (typeof data.startWithWindows === "boolean" && document.getElementById("startupCheckbox")) {
    document.getElementById("startupCheckbox").checked = data.startWithWindows;
  }
  if (data.mobalyticsGuideText) {
    mobalyticsGuideText.value = data.mobalyticsGuideText;
    handleMobalyticsImport();
  }
  if (data.pobbInput && pobbInput) pobbInput.value = data.pobbInput;
  if (data.pobbBuild) { window.currentPobbBuild = data.pobbBuild; if (pobbSummary) pobbSummary.innerHTML = renderPobbSummary(data.pobbBuild); }
  if (data.buildKey && BUILD_PROFILES[data.buildKey]) buildSelect.value = data.buildKey;
  updateSlotsAndStages();
  if (data.slot) slotSelect.value = data.slot;
  if (data.stage) stageSelect.value = data.stage;
  playerLevelInput.value = data.playerLevel || 1;
  playerStrInput.value = data.playerStr || 0;
  playerDexInput.value = data.playerDex || 0;
  playerIntInput.value = data.playerInt || 0;
  fullGearText.value = data.fullGearText || "";
  currentItem.value = data.currentItem || "";
  newItem.value = data.newItem || "";
  renderStageDetails();
  refreshEquipmentFromPaste({ runReport: true, silent: true });
  setExportStatus("Session loaded.", "good");
}

function round1(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}


function debounce(fn, wait = 400) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function refreshEquipmentFromPaste({ runReport = false, silent = false } = {}) {
  const text = fullGearText.value.trim();
  if (!text) {
    equipmentFields.classList.add("hidden");
    equipmentFields.innerHTML = "";
    if (runReport && !silent) analyzeBuildHealth();
    return;
  }

  const chunks = splitMultipleItems(text);
  if (!chunks.length) {
    equipmentFields.classList.add("hidden");
    equipmentFields.innerHTML = "";
    return;
  }

  const entries = chunks.filter(isRealItemChunk).map((chunk, index) => {
    const item = parseItem(chunk);
    const detectedSlot = inferSlotFromItem(item);
    const slot = detectedSlot === "unknown" ? "other" : detectedSlot;
    return { index, slot, item, text: chunk };
  });

  renderEquipmentFields(entries);
  if (runReport) analyzeBuildHealth();
}

function renderEquipmentFields(entries) {
  const slotCounts = {};
  equipmentFields.classList.remove("hidden");
  equipmentFields.innerHTML = `
    <div class="equipment-fields-header">
      <div>
        <h3>Detected equipment fields</h3>
        <p class="mini-note">These fields are generated from the pasted gear set. Edit a field and the health report recalculates. Flasks/charms are kept as utility items and are not treated as armor slots.</p>
      </div>
      <span class="tag">${entries.length} item(s)</span>
    </div>
    <div class="equipment-card-grid">
      ${entries.map(entry => {
        slotCounts[entry.slot] = (slotCounts[entry.slot] || 0) + 1;
        const slotSuffix = slotCounts[entry.slot] > 1 ? ` ${slotCounts[entry.slot]}` : "";
        return `
          <article class="equipment-card" data-slot="${escapeHtml(entry.slot)}">
            <div class="equipment-card-title">
              <strong>${escapeHtml(label(entry.slot))}${escapeHtml(slotSuffix)}</strong>
              <span>${escapeHtml(entry.item.name)}</span>
            </div>
            <textarea class="equipment-item-text" data-slot="${escapeHtml(entry.slot)}" spellcheck="false">${escapeHtml(entry.text)}</textarea>
          </article>
        `;
      }).join("")}
    </div>
  `;

  equipmentFields.querySelectorAll(".equipment-item-text").forEach(textarea => {
    textarea.addEventListener("input", debounce(() => analyzeBuildHealth(), 450));
  });
}

function getEquipmentEntriesForHealthReport() {
  const fieldTextareas = Array.from(equipmentFields?.querySelectorAll(".equipment-item-text") || []);
  if (fieldTextareas.length) {
    return fieldTextareas
      .map(textarea => ({ text: textarea.value.trim(), slotHint: textarea.dataset.slot || "other" }))
      .filter(entry => entry.text && isRealItemChunk(entry.text))
      .map(entry => {
        const item = parseItem(entry.text);
        const detectedSlot = inferSlotFromItem(item);
        const slot = detectedSlot === "unknown" ? entry.slotHint : detectedSlot;
        return { slot, scored: scoreItem(item, getProfile(), slot, stageSelect.value) };
      });
  }

  const text = fullGearText.value.trim();
  if (!text) return [];
  return splitMultipleItems(text).filter(isRealItemChunk).map(parseItem).map(item => {
    const detectedSlot = inferSlotFromItem(item);
    const slot = detectedSlot === "unknown" ? "other" : detectedSlot;
    return { slot, scored: scoreItem(item, getProfile(), slot, stageSelect.value) };
  });
}

function splitMultipleItems(text) {
  const source = String(text || "").replace(/\r/g, "");
  const lines = source.split("\n");
  const chunks = [];
  let current = [];
  let currentHasRarity = false;
  let currentHasRealContent = false;

  const flush = () => {
    const chunk = current.join("\n").trim();
    if (isRealItemChunk(chunk)) chunks.push(chunk);
    current = [];
    currentHasRarity = false;
    currentHasRealContent = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const isItemClass = /^Item Class:/i.test(line);
    const isRarity = /^Rarity:\s*(Normal|Magic|Rare|Unique|Currency|Gem)/i.test(line);

    if (isItemClass && current.length && currentHasRealContent) {
      flush();
    } else if (isRarity && current.length && currentHasRarity && currentHasRealContent) {
      // Normal/white items may start directly with Rarity. Start a new item only
      // when the current chunk already has a rarity/name. Do not split the normal
      // Item Class -> Rarity layout into two fake items.
      flush();
    }

    current.push(rawLine);
    if (isRarity) currentHasRarity = true;
    if (line && line !== "--------" && !/^Item Class:/i.test(line)) currentHasRealContent = true;
  }
  flush();
  return chunks;
}

function isRealItemChunk(chunk) {
  const text = String(chunk || "").trim();
  if (!text) return false;
  const parsed = parseItem(text);
  if (!parsed.rarity) return false;
  if (!parsed.name || /^Unnamed item$/i.test(parsed.name)) return false;
  const meaningful = parsed.lines.filter(line => !/^(Item Class|Rarity|Unique ID|Item Level|LevelReq|Quality):/i.test(line) && line !== "--------");
  return meaningful.length >= 2;
}

function analyzeBuildHealth() {
  const text = fullGearText.value.trim();
  const hasEquipmentFields = equipmentFields && equipmentFields.querySelectorAll(".equipment-item-text").length > 0;
  if (!text && !hasEquipmentFields) {
    healthResults.classList.remove("hidden");
    healthResults.innerHTML = `<article class="panel health-card"><div class="verdict warn">Paste gear first</div><p class="subtitle small">Paste multiple copied items into the build health box, then run the report.</p></article>`;
    return;
  }

  const profile = getProfile();
  const stageKey = stageSelect.value;
  const stage = profile.stages[stageKey];
  const playerLevel = getPlayerLevel();
  const playerAttrs = getPlayerAttributes();
  const items = getEquipmentEntriesForHealthReport();

  if (!items.length) {
    healthResults.classList.remove("hidden");
    healthResults.innerHTML = `<article class="panel health-card"><div class="verdict warn">No equipment detected</div><p class="subtitle small">Paste gear, click Refresh equipment, or load the sample set.</p></article>`;
    return;
  }

  const entriesBySlot = new Map();
  for (const entry of items) {
    if (!entriesBySlot.has(entry.slot)) entriesBySlot.set(entry.slot, []);
    entriesBySlot.get(entry.slot).push(entry);
  }
  for (const list of entriesBySlot.values()) {
    list.sort((a, b) => (b.scored?.total || 0) - (a.scored?.total || 0));
  }

  const targetSlots = Array.from(new Set([...(profile.slots || []), ...(stage?.data?.inventory || []).map(i => i.slot)])).filter(slot => !["other", "flask", "charm"].includes(slot));
  const rows = targetSlots.map(slot => {
    const entry = (entriesBySlot.get(slot) || [])[0];
    const guideTarget = findTargetItem(stage?.data, slot);
    const score = entry?.scored.total ?? null;
    const levelProblem = entry?.scored.item.requiredLevel && entry.scored.item.requiredLevel > playerLevel;
    const attrProblem = entry?.scored.attributeProblem || null;
    return { slot, displaySlot: label(slot), entry, score, guideTarget, levelProblem, attrProblem, reqProblem: levelProblem || attrProblem };
  });

  // Preserve duplicate gear slots like Ring 1 / Ring 2 instead of hiding the second item.
  for (const [slot, list] of entriesBySlot.entries()) {
    if (["other", "flask", "charm"].includes(slot)) continue;
    if (list.length <= 1) continue;
    for (let i = 1; i < list.length; i++) {
      const entry = list[i];
      const score = entry?.scored.total ?? null;
      const levelProblem = entry?.scored.item.requiredLevel && entry.scored.item.requiredLevel > playerLevel;
      const attrProblem = entry?.scored.attributeProblem || null;
      rows.push({ slot, displaySlot: `${label(slot)} ${i + 1}`, entry, score, guideTarget: findTargetItem(stage?.data, slot), levelProblem, attrProblem, reqProblem: levelProblem || attrProblem });
    }
  }

  const missing = rows.filter(row => !row.entry && row.guideTarget).map(row => `${label(row.slot)}: no pasted item detected; guide target is ${row.guideTarget.name}.`);
  const levelProblems = rows
    .filter(row => row.levelProblem)
    .map(row => `${label(row.slot)}: ${row.entry.scored.item.name} requires level ${row.entry.scored.item.requiredLevel}, but player level is ${playerLevel}.`);
  const attributeProblems = rows
    .filter(row => row.attrProblem)
    .map(row => `${label(row.slot)}: ${row.entry.scored.item.name} — ${formatAttributeRequirementProblem(row.attrProblem)}`);
  const requirementProblems = [...levelProblems, ...attributeProblems];
  const equippedRows = rows.filter(row => row.entry && !row.reqProblem);
  const futureRows = rows.filter(row => row.entry && row.reqProblem);
  const weak = equippedRows
    .filter(row => row.score !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(row => `${label(row.slot)}: ${row.entry.scored.item.name} scored ${row.score}. ${healthAdviceForSlot(row.slot, row.entry.scored, profile, stageKey)}`);
  if (!weak.length && futureRows.length) weak.push("No currently equippable pasted gear detected. Update player level/attributes or paste your actually equipped low-level items.");
  const gearTotals = aggregateGearTotals(equippedRows.map(row => row.entry));
  const neededStats = buildNeededStats({ rows, equippedRows, futureRows, gearTotals, requirementProblems, profile, stageKey, playerLevel, playerAttrs });
  const shoppingList = buildShoppingList(profile, stageKey, rows);
  const resistanceGaps = buildResistanceGapReport(window.currentPobbBuild);
  const fixSlots = buildFixSlotsReport(window.currentPobbBuild, rows);
  const pobbWarnings = pobbWarningsForReport(window.currentPobbBuild);
  const nextSteps = [...pobbWarnings.slice(0, 2), ...buildNextSteps(rows, equippedRows, futureRows, requirementProblems, missing, profile, stageKey, playerLevel, playerAttrs)].slice(0, 6);

  window.lastHealthReport = { profile, stage, playerLevel, playerAttrs, rows, equippedRows, futureRows, missing, levelProblems, attributeProblems, requirementProblems, pobbWarnings, weak, nextSteps, neededStats, gearTotals, resistanceGaps, fixSlots, shoppingList, count: items.length, equippedCount: equippedRows.length, futureCount: futureRows.length };

  healthResults.classList.remove("hidden");
  healthResults.innerHTML = renderHealthReport(window.lastHealthReport);
}

function healthAdviceForSlot(slot, scored) {
  const low = [];
  if ((scored.scores.defense || 0) <= 0 && ["helmet", "body", "gloves", "boots", "belt"].includes(slot)) low.push("look for life/defense");
  if ((scored.scores.resistance || 0) <= 0 && !["weapon", "quiver"].includes(slot)) low.push("add resistance");
  if (slot === "boots" && (scored.scores.mobility || 0) <= 0) low.push("movement speed is a priority");
  if (["weapon", "quiver", "gloves"].includes(slot) && (scored.scores.synergy + scored.scores.damage) < 15) low.push("needs better damage/build synergy");
  return low.length ? `Improve: ${low.join(", ")}.` : "Looks usable for now.";
}

function buildNextSteps(rows, equippedRows = [], futureRows = [], requirementProblems, missing, profile, stageKey, playerLevel = 1, playerAttrs = { str: 0, dex: 0, int: 0 }) {
  const steps = [];
  const stageData = profile.stages?.[stageKey]?.data;
  const prioritySlots = stageData?.prioritySlots || {};
  if (futureRows.length && equippedRows.length === 0 && playerLevel <= 1 && playerAttrs.str === 0 && playerAttrs.dex === 0 && playerAttrs.int === 0) {
    steps.push("Enter your real player level and Str/Dex/Int, then refresh. The current report is treating every pasted item as future gear.");
  }
  if (requirementProblems.length) steps.push("Fix level or attribute requirements before treating those items as real upgrades.");
  const activeRows = equippedRows.length ? equippedRows : rows.filter(row => row.entry && !row.reqProblem);
  const boot = activeRows.find(row => row.slot === "boots" && row.entry && (row.entry.scored.scores.mobility || 0) <= 0);
  if (boot) steps.push(prioritySlots.boots?.[0] || "Find boots with movement speed first; it is one of the biggest leveling quality-of-life upgrades.");
  const hasAttributeRequirementProblem = (requirementProblems || []).some(text => /Strength|Dexterity|Intelligence/i.test(text));
  const attrsLookUnset = playerAttrs.str === 0 && playerAttrs.dex === 0 && playerAttrs.int === 0;
  const attrWeak = activeRows.find(row => row.entry && (row.entry.scored.scores.attributes || 0) <= 0 && ["ring", "amulet", "helmet"].includes(row.slot));
  if (attrWeak && (hasAttributeRequirementProblem || attrsLookUnset)) steps.push("Use jewelry or helmet slots to fix Str/Dex/Int problems before replacing good damage gear.");
  const resistWeak = activeRows.find(row => row.entry && (row.entry.scored.scores.resistance || 0) <= 0 && !["weapon", "quiver"].includes(row.slot));
  if (resistWeak) steps.push("Add resistances on armor/jewelry slots so weapon and quiver can stay focused on damage.");
  const damageWeak = activeRows.find(row => row.entry && ["weapon", "quiver", "gloves"].includes(row.slot) && (row.entry.scored.scores.damage + row.entry.scored.scores.synergy) < 18);
  if (damageWeak) {
    const guideNote = prioritySlots[damageWeak.slot]?.[0];
    steps.push(guideNote ? `${label(damageWeak.slot)}: ${guideNote}` : `Upgrade ${label(damageWeak.slot)} for better cold/projectile/attack damage once requirements are solved.`);
  }
  const guidePriority = Object.entries(prioritySlots).find(([slot, notes]) => notes.length && activeRows.some(row => row.slot === slot && row.entry && row.score !== null && row.score < 18));
  if (guidePriority) steps.push(`${label(guidePriority[0])}: ${guidePriority[1][0]}`);
  if (missing.length) steps.push("Paste the missing slots so the weakest-slot ranking is more accurate.");
  return steps.slice(0, 5);
}


function buildResistanceGapReport(build) {
  const stats = build?.stats || {};
  const res = stats.resistances || {};
  const names = [
    ["Fire", res.fire],
    ["Cold", res.cold],
    ["Lightning", res.lightning],
    ["Chaos", res.chaos],
  ];
  const rows = [];
  for (const [name, value] of names) {
    const n = Number(value);
    if (!Number.isFinite(n)) continue;
    const toZero = Math.max(0, 0 - n);
    const toFifty = Math.max(0, 50 - n);
    const toCap = Math.max(0, 75 - n);
    let priority = "OK for now";
    if (n < 0) priority = "Urgent";
    else if (n < 25) priority = "Low";
    else if (n < 50) priority = "Improve soon";
    rows.push({ name, value: n, toZero, toFifty, toCap, priority });
  }
  return rows.sort((a, b) => a.value - b.value);
}

function renderResistanceGaps(gaps) {
  if (!gaps || !gaps.length) return `<p class="subtitle small">No final resistance data imported yet.</p>`;
  return `<div class="res-gap-grid">${gaps.map(gap => `
    <div class="res-gap ${gap.value < 0 ? "urgent" : gap.value < 25 ? "warn" : ""}">
      <strong>${escapeHtml(gap.name)} ${gap.value}%</strong>
      <span>${escapeHtml(gap.priority)}</span>
      <small>+${gap.toZero} to 0% · +${gap.toFifty} to 50% · +${gap.toCap} to 75%</small>
    </div>`).join("")}</div>`;
}

function buildFixSlotsReport(build, rows) {
  const gaps = buildResistanceGapReport(build).filter(gap => gap.name !== "Chaos" && gap.value < 75);
  if (!gaps.length) return [];
  const urgentGaps = gaps.filter(gap => gap.value < 0);
  const main = (urgentGaps.length ? urgentGaps : gaps).slice(0, 3).map(gap => gap.name);
  const secondary = gaps.filter(gap => !main.includes(gap.name)).map(gap => gap.name);
  const resText = main.join(main.length > 1 ? " and " : "");
  const ringResText = gaps.map(gap => gap.name).join("/");
  const hasRingRows = rows.filter(row => row.slot === "ring" && row.entry).length;
  const suggestions = [
    `${resText} resistance ${main.length > 1 ? "are" : "is"} the main problem. Fix ${main.length > 1 ? "them" : "it"} before chasing small damage upgrades.`,
    `${hasRingRows > 1 ? "Ring 1 / Ring 2" : "Rings"}: best quick place to add ${ringResText} resistance without touching weapon damage.`,
    `Belt: look for life plus ${main.join(" or ")} resistance.`,
    "Body Armor / Helmet / Gloves: good defensive slots for life and resistances.",
    "Keep weapon and quiver mostly damage-focused unless a replacement also fixes resists without losing much damage.",
  ];
  if (secondary.length) suggestions.splice(1, 0, `${secondary.join("/")} resistance also needs improvement, but it is less urgent than ${resText}.`);
  return suggestions;
}

function renderHealthReport({ profile, stage, playerLevel, playerAttrs, rows, missing, levelProblems, attributeProblems, requirementProblems, pobbWarnings = [], weak, nextSteps, neededStats = [], gearTotals = {}, resistanceGaps = [], fixSlots = [], shoppingList = [], count, equippedCount = 0, futureCount = 0 }) {
  const stageLabel = stage?.label || stageSelect.value;
  const rowHtml = rows.map(row => {
    const name = row.entry?.scored.item.name || "—";
    const score = row.score === null ? "—" : formatScore(row.score);
    const req = summarizeRequirements(row.entry?.scored.item);
    const guide = row.guideTarget?.name || "—";
    const rowClass = row.reqProblem ? " class=\"requirement-warning\"" : "";
    return `<tr${rowClass}><td>${escapeHtml(row.displaySlot || label(row.slot))}</td><td>${escapeHtml(name)}</td><td>${escapeHtml(score)}</td><td>${escapeHtml(req)}</td><td>${escapeHtml(guide)}</td></tr>`;
  }).join("");

  return `
    <div class="muted-box"><strong>Build health report</strong><br>${count} item(s) parsed — ${equippedCount} counted as currently equippable, ${futureCount} treated as future/blocked. Build: ${escapeHtml(profile.name)}. Stage: ${escapeHtml(stageLabel)}. Player level: ${playerLevel}. Attributes: ${playerAttrs.str} Str / ${playerAttrs.dex} Dex / ${playerAttrs.int} Int.</div>
    ${window.currentPobbBuild ? `<article class="panel health-card" style="margin-top: 16px;"><h3>pobb.in current build</h3>${renderPobbMiniCard(window.currentPobbBuild)}</article>` : ""}
    ${resistanceGaps.length ? `<article class="panel health-card" style="margin-top: 16px;"><h3>Resistance gap calculator</h3><p class="mini-note">Based on pobb.in final character stats, not just parsed gear affixes.</p>${renderResistanceGaps(resistanceGaps)}</article>` : ""}
    ${fixSlots.length ? `<article class="panel health-card" style="margin-top: 16px;"><h3>Best slots to fix current problem</h3>${renderList(fixSlots, "warn", "No specific slot fix needed.")}</article>` : ""}
    <article class="panel health-card" style="margin-top: 16px;">
      <h3>Gear affix totals</h3>
      <p class="mini-note">These are totals parsed from equippable item affixes only. The pobb.in card above is the final character stat summary.</p>
      ${renderGearTotals(gearTotals)}
    </article>
    <div class="health-grid">
      <article class="panel health-card">
        <h3>What stats do I need next?</h3>
        ${renderList(neededStats, "warn", "No urgent stat gaps detected.")}
      </article>
      <article class="panel health-card">
        <h3>Next upgrades</h3>
        ${renderList(nextSteps, "warn", "No major problems detected from the pasted gear.")}
      </article>
      <article class="panel health-card">
        <h3>Weakest slots</h3>
        ${renderList(weak, "bad", "Paste more gear to rank weak slots.")}
      </article>
      <article class="panel health-card">
        <h3>Warnings</h3>
        ${renderList([...pobbWarnings, ...levelProblems, ...attributeProblems, ...missing], "warn", "No level, attribute, resistance, or missing-slot warnings from this pass.")}
      </article>
    </div>
    <article class="panel health-card" style="margin-top: 16px;">
      <h3>Shopping list for this stage</h3>
      ${renderShoppingList(shoppingList)}
    </article>
    <article class="panel health-card" style="margin-top: 16px;">
      <h3>Slot summary</h3>
      <table class="slot-table"><thead><tr><th>Slot</th><th>Pasted item</th><th>Score</th><th>Requires</th><th>Guide target</th></tr></thead><tbody>${rowHtml}</tbody></table>
    </article>
  `;
}




function pobbWarningsForReport(build) {
  if (!build || !build.stats) return [];
  const stats = build.stats || {};
  const res = stats.resistances || {};
  const warnings = [];

  const addResWarning = (name, value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    if (n < 0) warnings.push(`${name} resistance is negative (${n}%). Fix this on rings, belt, helmet, boots, gloves, or body armor before chasing small damage upgrades.`);
    else if (n < 25) warnings.push(`${name} resistance is low (${n}%). Add more on armor or jewelry when possible.`);
  };

  addResWarning("Fire", res.fire);
  addResWarning("Cold", res.cold);
  addResWarning("Lightning", res.lightning);
  addResWarning("Chaos", res.chaos);

  const level = Number(stats.level || 0);
  const life = Number(stats.life || 0);
  const ehp = Number(stats.eHP || 0);
  if (level >= 30 && life > 0 && life < 700) warnings.push(`Life looks low for level ${level} (${life}). Prioritize life on armor, belt, rings, and amulet.`);
  if (level >= 40 && life > 0 && life < 850) warnings.push(`Life is a little light for level ${level} (${life}). Keep upgrading life on defensive/jewelry slots.`);
  if (level >= 40 && ehp > 0 && ehp < 1200) warnings.push(`eHP is modest for level ${level} (${ehp}). Fix low resists and add life before focusing only on damage.`);

  const hit = Number(stats.hitChance || 0);
  if (hit > 0 && hit < 90) warnings.push(`Hit chance is low (${hit}%). Accuracy or level difference may be hurting damage consistency.`);

  if (!build.equippedGearText && (build.gear || []).length) {
    warnings.push("pobb.in imported gear names, but full item affixes were not decoded. Overlay comparisons may use saved/manual gear until full item text is available.");
  }

  return [...new Set(warnings)].slice(0, 8);
}

function renderPobbMiniCard(build) {
  const stats = build?.stats || {};
  const r = stats.resistances || {};
  const gear = (build?.gear || []).slice(0, 14).map(item => `${label(item.slot)}: ${item.name}`).join(" · ");
  const gems = (build?.gems || []).slice(0, 10).join(" · ");
  return `
    <p class="subtitle small"><strong>${escapeHtml(build?.name || "pobb.in imported build")}</strong></p>
    <div class="totals-grid">
      <div class="total-pill"><span>Life / ES / eHP</span><strong>${escapeHtml(stats.life ?? "—")} / ${escapeHtml(stats.es ?? "—")} / ${escapeHtml(stats.eHP ?? "—")}</strong></div>
      <div class="total-pill"><span>DPS / Hit</span><strong>${escapeHtml(stats.dps ?? "—")} / ${escapeHtml(stats.hitChance ?? "—")}%</strong></div>
      <div class="total-pill"><span>Resists</span><strong>F ${escapeHtml(r.fire ?? "—")}% / C ${escapeHtml(r.cold ?? "—")}% / L ${escapeHtml(r.lightning ?? "—")}% / Ch ${escapeHtml(r.chaos ?? "—")}%</strong></div>
      <div class="total-pill"><span>Attributes</span><strong>Str ${escapeHtml(stats.str ?? "—")} / Dex ${escapeHtml(stats.dex ?? "—")} / Int ${escapeHtml(stats.int ?? "—")}</strong></div>
    </div>
    <p class="mini-note"><strong>Gear:</strong> ${escapeHtml(gear || "not found")}</p>
    ${build?.equippedGearText ? `<p class="mini-note good-text"><strong>Equipped gear loaded:</strong> full PoB item text is now in the gear set box and will be used for overlay comparisons.</p>` : `<p class="mini-note warn-text"><strong>Equipped affixes not loaded:</strong> using gear names only until the PoB export can be decoded.</p>`}
    <p class="mini-note"><strong>Gems:</strong> ${escapeHtml(gems || "not found")}</p>
  `;
}

function summarizeRequirements(item) {
  if (!item) return "—";
  const parts = [];
  if (item.requiredLevel) parts.push(`Lvl ${item.requiredLevel}`);
  const attrs = item.requiredAttributes || {};
  if (attrs.str) parts.push(`${attrs.str} Str`);
  if (attrs.dex) parts.push(`${attrs.dex} Dex`);
  if (attrs.int) parts.push(`${attrs.int} Int`);
  return parts.length ? parts.join(" / ") : "—";
}

function clearItems() {
  currentItem.value = "";
  newItem.value = "";
  results.classList.add("hidden");
  results.innerHTML = "";
}

function formatScore(value) {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

function label(key) {
  const labels = { body: "Body Armor", quiver: "Quiver", offhand: "Offhand", flask: "Flask", charm: "Charm" };
  return labels[key] || String(key).charAt(0).toUpperCase() + String(key).slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
