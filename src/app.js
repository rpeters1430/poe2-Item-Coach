const SCORE_KEYS = ["damage", "defense", "attributes", "resistance", "mobility", "synergy"];

const BUILD_PROFILES = {
  quarterstaffMonk: {
    name: "Quarterstaff Monk Leveling",
    imported: false,
    slots: ["weapon", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"],
    focus: { quarterstaff: true, monk: true, melee: true, attack: true, bow: false, quiver: false, crossbow: false },
    baseWeights: {
      damage: 1.15,
      defense: 1.0,
      attributes: 1.05,
      resistance: 1.0,
      mobility: 1.2,
      synergy: 1.25,
    },
    stages: {
      act1_2: { label: "Act 1-2 Bridge (1-21)", damage: 1.1, defense: 0.9, attributes: 1.2, resistance: 0.8, mobility: 1.25, synergy: 1.1 },
      act2_swap: { label: "Storm Wave Swap (22-41)", damage: 1.2, defense: 1.0, attributes: 1.1, resistance: 1.0, mobility: 1.15, synergy: 1.3 },
      endgame: { label: "Endgame", damage: 1.25, defense: 1.25, attributes: 0.8, resistance: 1.2, mobility: 1.0, synergy: 1.45 },
    },
    statRules: defaultQuarterstaffRules(),
    slotRules: defaultQuarterstaffSlotRules(),
    importedStages: [],
  },
  frostCrossbow: {
    name: "Frost Crossbow / Bow Leveling",
    imported: false,
    slots: ["weapon", "quiver", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"],
    focus: { bow: true, quiver: true, attack: true, cold: true },
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
    focus: { attack: true, melee: true },
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

const qs = sel => (typeof document !== "undefined" ? document.querySelector(sel) : null);
const buildSelect = qs("#buildSelect");
const slotSelect = qs("#slotSelect");
const stageSelect = qs("#stageSelect");
const currentItem = qs("#currentItem");
const newItem = qs("#newItem");
const results = qs("#results");
const playerLevelInput = qs("#playerLevel");
const playerStrInput = qs("#playerStr");
const playerDexInput = qs("#playerDex");
const playerIntInput = qs("#playerInt");
const userPreferencesInput = qs("#userPreferences");
const fullGearText = qs("#fullGearText");
const healthResults = qs("#healthResults");
const equipmentFields = qs("#equipmentFields");
const buildFileInput = qs("#buildFileInput");
const buildFolderInput = qs("#buildFolderInput");
const importSummary = qs("#importSummary");
const mobalyticsUrlInput = qs("#mobalyticsUrlInput");
const mobalyticsGuideText = qs("#mobalyticsGuideText");
const mobalyticsSummary = qs("#mobalyticsSummary");
const pobbInput = qs("#pobbInput");
const pobbSummary = qs("#pobbSummary");
const stageDetails = qs("#stageDetails");
const exportStatus = qs("#exportStatus");

function defaultFrostRules() {
  return [
    { match: /cold damage to attacks|adds .* cold damage/i,         category: "synergy",    points: 16, label: "cold damage",                    note: "Scales your primary Ice Shot damage type." },
    { match: /lightning damage to attacks|adds .* lightning damage/i,category: "damage",    points: 5,  label: "lightning damage",               note: "Off-element — minor bonus while leveling." },
    { match: /physical damage to attacks|adds .* physical damage|increased physical damage/i, category: "damage", points: 8, label: "physical damage", note: "Physical base — low conversion value for Ice Shot." },
    { match: /\+\d+ to level of all projectile skills/i,            category: "synergy",   points: 22, label: "+levels to projectile skills",    note: "Massively scales Ice Shot — the best mod type for this build." },
    { match: /increased damage with bow skills|increased projectile damage|increased damage with crossbow skills/i, category: "synergy", points: 13, label: "projectile/bow damage", note: "Scales Ice Shot and all projectile damage." },
    { match: /attack speed|reload speed/i,                           category: "damage",    points: 13, label: "attack speed",                    note: "More shots per second — direct DPS increase." },
    { match: /critical hit chance|critical damage bonus|critical damage/i, category: "damage", points: 14, label: "critical stats",              note: "Highly valued — this build is deeply invested in critical hits." },
    { match: /cold penetration/i,                                    category: "synergy",   points: 14, label: "cold penetration",               note: "Bypasses enemy cold resistance — high value." },
    { match: /maximum life/i,                                        category: "defense",   points: 10, label: "maximum life",                    note: "Survivability — always a priority." },
    { match: /evasion rating/i,                                      category: "defense",   points: 12, label: "evasion rating",                  note: "Core defensive stat for Deadeye — evasion scales this ascendancy." },
    { match: /armour|energy shield/i,                                category: "defense",   points: 4,  label: "armour/energy shield",            note: "Secondary defense — Deadeye scales from evasion, not armour/ES." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance/i, category: "resistance", points: 8, label: "elemental resistance", note: "Helps cap your elemental resistances." },
    { match: /all elemental resistances|all resistances/i,           category: "resistance",points: 16, label: "all elemental resistances",       note: "Efficiently caps all three resistances at once." },
    { match: /strength|dexterity|intelligence/i,                     category: "attributes",points: 7,  label: "attributes",                     note: "Required for gem and gear stat requirements." },
    { match: /movement speed/i,                                      category: "mobility",  points: 18, label: "movement speed",                 note: "Critical for survival — major leveling priority." },
    { match: /spell damage|minion damage/i,                          category: "synergy",   points: -10,label: "spell/minion damage",            note: "Off-plan — this build deals attack damage, not spell damage." },
    { match: /damage over time|ignite|poison/i,                      category: "synergy",   points: -4, label: "damage over time",               note: "DoT mods do nothing for Ice Shot." },
  ];
}

function defaultGenericRules() {
  return [
    { match: /adds .* damage to attacks|physical damage to attacks|increased physical damage/i, category: "damage", points: 10, label: "attack damage",    note: "Flat attack damage — core DPS stat." },
    { match: /attack speed|reload speed/i,    category: "damage",    points: 12, label: "attack speed",       note: "More attacks per second — direct DPS increase." },
    { match: /maximum life/i,                 category: "defense",   points: 10, label: "maximum life",       note: "Survivability — always a priority." },
    { match: /fire resistance|cold resistance|lightning resistance|chaos resistance|all resistances/i, category: "resistance", points: 9, label: "elemental resistance", note: "Helps cap your resistances." },
    { match: /strength|dexterity|intelligence/i, category: "attributes", points: 7, label: "attributes",     note: "Required for gem and gear stat requirements." },
    { match: /movement speed/i,               category: "mobility",  points: 18, label: "movement speed",    note: "Critical for survival and map clearing." },
    { match: /spell damage/i,                 category: "synergy",   points: -7, label: "spell damage",      note: "Likely not useful for an attack build." },
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

function init() {
  renderBuildOptions();
  updateSlotsAndStages();
  buildSelect.addEventListener("change", () => { updateSlotsAndStages(); if (hasEquipmentEntries()) analyzeBuildHealth(); });
  slotSelect.addEventListener("change", renderStageDetails);
  stageSelect.addEventListener("change", () => { renderStageDetails(); if (hasEquipmentEntries()) analyzeBuildHealth(); });
  buildFileInput.addEventListener("change", handleBuildImport);
  buildFolderInput?.addEventListener("change", handleBuildImport);
  document.querySelector("#importMobalyticsUrlBtn")?.addEventListener("click", () => handleMobalyticsImport({ fromUrl: true }));
  mobalyticsUrlInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleMobalyticsImport({ fromUrl: true });
    }
  });
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

  parsed.sort((a, b) => 
    a.minLevel - b.minLevel || 
    a.maxLevel - b.maxLevel || 
    (a.passiveCount || 0) - (b.passiveCount || 0) || 
    a.name.localeCompare(b.name)
  );
  const importedProfile = createImportedProfile(parsed);
  BUILD_PROFILES.importedBuild = importedProfile;
  renderBuildOptions();
  buildSelect.value = "importedBuild";
  updateSlotsAndStages();
  saveSession();

  importSummary.innerHTML = renderImportSummary(importedProfile, failures);
}

async function handleMobalyticsImport(opts = {}) {
  const urlVal = (mobalyticsUrlInput?.value || "").trim();
  let text = (mobalyticsGuideText?.value || "").trim();

  let targetUrl = opts.url || "";
  if (opts.fromUrl) {
    targetUrl = urlVal;
  } else if (!targetUrl) {
    const urlMatch = text.match(/^https?:\/\/(?:www\.)?mobalytics\.gg\/\S+$/i);
    if (urlMatch) {
      targetUrl = urlMatch[0];
    } else if (!text && urlVal) {
      targetUrl = urlVal;
    }
  }

  // URL import path
  if (targetUrl) {
    if (!window.poe2Coach?.importMobalytics) {
      mobalyticsSummary.innerHTML = `<strong>Mobalytics importer is not available.</strong><br><span>Restart the app and ensure preload.js is loaded.</span>`;
      return;
    }

    const urlBtn = document.querySelector("#importMobalyticsUrlBtn");
    const textBtn = document.querySelector("#importMobalyticsBtn");
    if (urlBtn) { urlBtn.disabled = true; urlBtn.textContent = "Importing..."; }
    if (textBtn) { textBtn.disabled = true; textBtn.textContent = "Importing..."; }

    mobalyticsSummary.innerHTML = `<strong>Fetching Mobalytics build...</strong><br><span>Querying build variants, gear targets, and creator notes...</span>`;

    try {
      const fetched = await window.poe2Coach.importMobalytics(targetUrl);
      if (!fetched?.ok) {
        mobalyticsSummary.innerHTML = `<strong>Could not import Mobalytics build.</strong><br><span>${escapeHtml(fetched?.error || "Check the URL and try again, or paste copied guide text.")}</span>`;
        return;
      }

      if (mobalyticsUrlInput && fetched.url) mobalyticsUrlInput.value = fetched.url;
      if (mobalyticsGuideText && fetched.text) mobalyticsGuideText.value = fetched.text;

      if (Array.isArray(fetched.variants) && fetched.variants.length > 0) {
        const stages = fetched.variants.map((v, i) => normalizeBuildFile(v, `${v.name || `Variant ${i + 1}`}.build`));
        stages.forEach(st => {
          st.creatorInstructions = fetched.creatorInstructions || [];
          st.notes = fetched.notes || {};
          st.source = "mobalytics";
          st.url = fetched.url;
        });

        stages.sort((a, b) =>
          a.minLevel - b.minLevel ||
          a.maxLevel - b.maxLevel ||
          (a.passiveCount || 0) - (b.passiveCount || 0) ||
          a.name.localeCompare(b.name)
        );

        const focus = inferBuildFocus(`${fetched.name} ${buildFocusText(stages)} ${(fetched.creatorInstructions || []).join(" ")}`);
        const priorities = extractMobalyticsPriorities(fetched.text || "", focus);

        // Supplement stage inventory with priority notes if any slots lack items
        const allowedSlots = new Set(getAllowedSlotsForFocus(focus));
        for (const stage of stages) {
          stage.focus = focus;
          stage.priorityNotes = priorities.notes;
          stage.prioritySlots = priorities.bySlot;
          const existingSlots = new Set(stage.inventory.map(i => i.slot));
          const missingFallbacks = buildPriorityTargetsFromMobalytics(priorities, focus)
            .filter(p => allowedSlots.has(p.slot) && !existingSlots.has(p.slot));
          stage.inventory.push(...missingFallbacks);
          stage.inventory = stage.inventory.filter(item => allowedSlots.has(item.slot) || ["flask", "charm"].includes(item.slot));
        }

        const parsed = {
          name: fetched.name || "Mobalytics Build",
          author: fetched.author || "Mobalytics",
          stages,
          priorities,
          skills: stages.flatMap(s => s.skills),
          focus,
          creatorInstructions: fetched.creatorInstructions || [],
          notes: fetched.notes || {},
          url: fetched.url,
          isDirectExport: true,
        };

        const importedProfile = createMobalyticsProfile(parsed);
        const guideAscendancy = parsed.stages?.[0]?.ascendancy;
        const mismatchWarning = window.currentPobbBuild
          ? buildIdentityMismatchWarning({ source: "mobalytics", mobalytics: { stages: [{ ascendancy: guideAscendancy }] } }, window.currentPobbBuild.stats)
          : "";

        BUILD_PROFILES.mobalyticsBuild = importedProfile;
        renderBuildOptions();
        buildSelect.value = "mobalyticsBuild";
        updateSlotsAndStages();
        selectStageForPlayerLevel(Number(playerLevelInput.value) || 1);
        if (opts?.skipSave !== true) {
          saveSession();
        }
        mobalyticsSummary.innerHTML = renderMismatchBanner(mismatchWarning) + renderMobalyticsSummary(importedProfile, parsed);
        return;
      }

      // If no variants were returned, fall back to parsing the synthesized guide text
      text = fetched.text || "";
    } catch (err) {
      mobalyticsSummary.innerHTML = `<strong>Import error.</strong><br><span>${escapeHtml(err.message)}</span>`;
      return;
    } finally {
      if (urlBtn) { urlBtn.disabled = false; urlBtn.textContent = "Import URL"; }
      if (textBtn) { textBtn.disabled = false; textBtn.textContent = "Import guide text"; }
    }
  }

  // Fallback / manual text paste path
  if (!text) {
    mobalyticsSummary.innerHTML = `<strong>Enter a Mobalytics URL or paste guide text first.</strong><br><span>Supports mobalytics.gg/poe-2/profile/.../builds/... or mobalytics.gg/poe-2/builds/...</span>`;
    return;
  }

  const parsed = normalizeMobalyticsGuideText(text);
  if (!parsed.stages.length) {
    mobalyticsSummary.innerHTML = `<strong>Could not find stages.</strong><br><span>Try copying more of the guide text, especially the variant buttons like lvl 1-14, lvl 15-23, or Act 1, Act 2, etc.</span>`;
    return;
  }

  const importedProfile = createMobalyticsProfile(parsed);
  const guideAscendancy = parsed.stages?.[0]?.ascendancy;
  const mismatchWarning = window.currentPobbBuild
    ? buildIdentityMismatchWarning({ source: "mobalytics", mobalytics: { stages: [{ ascendancy: guideAscendancy }] } }, window.currentPobbBuild.stats)
    : "";
  BUILD_PROFILES.mobalyticsBuild = importedProfile;
  renderBuildOptions();
  buildSelect.value = "mobalyticsBuild";
  updateSlotsAndStages();
  selectStageForPlayerLevel(Number(playerLevelInput.value) || 1);
  if (opts?.skipSave !== true) {
    saveSession();
  }
  mobalyticsSummary.innerHTML = renderMismatchBanner(mismatchWarning) + renderMobalyticsSummary(importedProfile, parsed);
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
      skillGroups: result.skillGroups || [],
      keystones: result.keystones || [],
      passiveNodes: result.passiveNodes || [],
      notes: result.notes || "",
      exportCode: result.exportCode || "",
      equippedGearText: result.equippedGearText || "",
      decodedItemCount: result.decodedItemCount || 0,
      decodedPobOk: Boolean(result.decodedPobOk),
      rawTextPreview: result.rawTextPreview || "",
    };

    const mismatchWarning = buildIdentityMismatchWarning(getProfile(), build.stats);

    window.currentPobbBuild = build;
    refreshImportedProfileFromCharacter(build);
    applyPobbBuildToSettings(build);
    pobbSummary.innerHTML = renderMismatchBanner(mismatchWarning) + renderPobbSummary(build);

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

function refreshImportedProfileFromCharacter(build) {
  const profile = getProfile();
  if (!profile?.imported) return;
  const gearText = (build?.gear || []).map(g => `${g.slot} ${g.name}`).join(" ");
  const liveFocus = inferBuildFocus(`${build?.name || ""} ${gearText} ${(build?.gems || []).join(" ")} ${(build?.keystones || []).join(" ")}`);
  profile.focus = { ...profile.focus, ...liveFocus };
  if (liveFocus.quarterstaff) {
    profile.focus.bow = false;
    profile.focus.quiver = false;
    profile.focus.crossbow = false;
  }
  if (liveFocus.unarmed) {
    profile.focus.bow = false;
    profile.focus.quiver = false;
    profile.focus.crossbow = false;
  }
  profile.slots = getAllowedSlotsForFocus(profile.focus);
  profile.slotRules = slotRulesForFocus(profile.focus);
  profile.statRules = profile.source === "mobalytics" && profile.mobalytics
    ? buildMobalyticsRules(profile.mobalytics, build)
    : buildImportedRules(profile.importedStages || [], build, profile.focus);

  const allowedSlots = new Set(profile.slots);
  for (const st of profile.importedStages || []) {
    st.inventory = (st.inventory || []).filter(item => allowedSlots.has(item.slot) || ["flask", "charm"].includes(item.slot));
    if (st.prioritySlots) {
      if (!profile.focus.bow) delete st.prioritySlots.quiver;
      if (profile.focus.quarterstaff) delete st.prioritySlots.offhand;
    }
  }
  updateSlotsAndStages();
}

function buildIdentityMismatchWarning(profile, pobStats) {
  if (!profile || profile.source !== "mobalytics") return "";
  const rawGuideAscendancy = String(profile.mobalytics?.stages?.[0]?.ascendancy || "").trim();
  const guideAscendancy = cleanAscendancyName(rawGuideAscendancy);
  if (!guideAscendancy || /^unknown$/i.test(guideAscendancy)) return "";
  const rawPobAscendancy = String(pobStats?.ascendancy || "").trim();
  const pobAscendancy = /^(?:none|unknown|null)$/i.test(rawPobAscendancy) ? "" : cleanAscendancyName(rawPobAscendancy);
  const pobClassName = String(pobStats?.className || "").trim();
  const candidates = [pobAscendancy, pobClassName].filter(Boolean);
  if (!candidates.length) return "";
  const matches = pobAscendancy
    ? pobAscendancy.toLowerCase() === guideAscendancy.toLowerCase()
    : baseClassForAscendancy(guideAscendancy, rawGuideAscendancy).toLowerCase() === pobClassName.toLowerCase();
  if (matches) return "";
  return `This character is ${escapeHtml(candidates.join(" / "))}, but the currently loaded Mobalytics guide is for ${escapeHtml(guideAscendancy)}. The guide's creator instructions and gear priorities may be for a different build — re-import the matching Mobalytics guide, or switch the Build dropdown to Generic Attack Build until you do.`;
}

function baseClassForAscendancy(ascendancy, rawId = "") {
  const internalBase = String(rawId).match(/^(Ranger|Monk|Warrior|Mercenary|Sorceress|Witch|Huntress|Shadow|Duelist|Templar|Druid)\d+$/i)?.[1];
  if (internalBase) return internalBase;
  const byAscendancy = {
    deadeye: "Ranger", pathfinder: "Ranger",
    invoker: "Monk", "acolyte of chayula": "Monk",
    titan: "Warrior", warbringer: "Warrior",
    witchhunter: "Mercenary", "gemling legionnaire": "Mercenary", tactician: "Mercenary",
    stormweaver: "Sorceress", chronomancer: "Sorceress",
    "blood mage": "Witch", infernalist: "Witch",
    amazon: "Huntress", survivalist: "Huntress",
    assassin: "Shadow", trickster: "Shadow",
    slayer: "Duelist", gladiator: "Duelist",
    inquisitor: "Templar", hierophant: "Templar",
    shaman: "Druid", animist: "Druid",
  };
  return byAscendancy[String(ascendancy || "").toLowerCase()] || String(ascendancy || "");
}

function renderMismatchBanner(message) {
  if (!message) return "";
  return `<div class="import-result warn" style="margin-bottom:10px;"><strong>&#9888; Build mismatch detected.</strong><br><span>${message}</span></div>`;
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

  const eligible = entries.filter(([, stage]) => !stage?.data?.manualOnly);
  let bestKey = null;
  for (const [key, stage] of eligible) {
    const min = Number(stage?.data?.minLevel ?? stage?.minLevel ?? 0);
    const max = Number(stage?.data?.maxLevel ?? stage?.maxLevel ?? 100);
    if (level >= min && level <= max) {
      bestKey = key;
      break;
    }
  }

  if (!bestKey) {
    let bestDistance = Infinity;
    for (const [key, stage] of eligible.length ? eligible : entries) {
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

function renderPobbImportQuality(build) {
  if (!build) return "";
  const stats = build?.stats || {};
  const r = stats.resistances || {};
  const checks = [];

  const ok = (text) => `<li class="pobb-quality-ok">&#10003; ${escapeHtml(text)}</li>`;
  const warn = (text) => `<li class="pobb-quality-warn">&#9888; ${escapeHtml(text)}</li>`;

  const level = Number(stats.level || 0);
  checks.push(level > 0 ? ok(`Player level imported (${level})`) : warn("Player level not detected — enter manually in the Character tab"));

  const hasRes = [r.fire, r.cold, r.lightning, r.chaos].some(v => v !== undefined && v !== null);
  checks.push(hasRes
    ? ok(`Resistances imported (Fire ${r.fire ?? "—"}% / Cold ${r.cold ?? "—"}% / Lightning ${r.lightning ?? "—"}% / Chaos ${r.chaos ?? "—"}%)`)
    : warn("Resistances not imported from this build"));

  checks.push((stats.life != null || stats.eHP != null)
    ? ok(`Life / eHP imported (${stats.life ?? "—"} / ${stats.eHP ?? "—"})`)
    : warn("Life / eHP not imported"));

  if (build.decodedPobOk) {
    checks.push(ok(`Full item affixes decoded (${build.decodedItemCount || build.gear?.length || 0} items)`));
  } else if ((build.gear || []).length) {
    checks.push(warn("Gear names imported, but full item affixes were not decoded from the PoB export"));
  } else {
    checks.push(warn("No gear detected in this build"));
  }

  const hasStr = Number(stats.str) > 0;
  const hasDex = Number(stats.dex) > 0;
  const hasInt = Number(stats.int) > 0;
  checks.push(hasStr && hasDex && hasInt
    ? ok(`Str/Dex/Int imported (${Math.floor(Number(stats.str))} / ${Math.floor(Number(stats.dex))} / ${Math.floor(Number(stats.int))})`)
    : warn("Str/Dex/Int not exposed by pobb.in — enter manually in the Character tab"));

  return `<div class="pobb-quality-box"><h4 style="margin:0 0 8px">Import quality</h4><ul class="pobb-quality-list">${checks.join("")}</ul></div>`;
}

function renderPobbSummary(build) {
  return `
    <div class="import-card">
      <h3>pobb.in current build imported</h3>
      ${renderPobbMiniCard(build)}
      ${renderPobbImportQuality(build)}
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
  const priorities = extractMobalyticsPriorities(clean, focus);
  const skills = extractMobalyticsSkills(clean);
  const creatorInstructions = extractCreatorInstructions(clean);

  const stages = stageRanges.map((range, index) => ({
    fileName: `Mobalytics guide text stage ${index + 1}`,
    name,
    author: authorMatch ? authorMatch[1].trim() : "Mobalytics",
    ascendancy: ascendancyMatch ? ascendancyMatch[1] : "Unknown",
    minLevel: range.min,
    maxLevel: range.max,
    label: range.label,
    inventory: buildPriorityTargetsFromMobalytics(priorities, focus),
    skills,
    passiveCount: 0,
    focus,
    priorityNotes: priorities.notes,
    prioritySlots: priorities.bySlot,
    creatorInstructions,
    source: "mobalytics",
    rawText: clean,
  }));

  return { name, author: authorMatch?.[1]?.trim() || "Mobalytics", stages, priorities, skills, focus, creatorInstructions, url: urlMatch?.[0] || "" };
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
    "Permafrost Bolts", "Fragmentation Rounds", "Frozen Shot", "Load Permafrost Bolts",
    "Storm Wave", "Falling Thunder", "Killing Palm", "Conductive Runes", "Hollow Focus",
    "Herald of Thunder", "Quarterstaff Strike", "Charged Staff", "Rend", "Tempest Bell", "Siphoning Strike", "Vaulting Impact",
    "Devour", "Whirling Assault", "Herald of Ash", "Herald of Ice", "Flicker Strike"
  ];
  const found = [];
  for (const name of known) {
    if (new RegExp(`\\b${escapeRegExp(name)}\\b`, "i").test(text)) {
      found.push({ id: name, name, levelInterval: [1, 100], supports: [] });
    }
  }
  return found;
}

function extractCreatorInstructions(text) {
  const instructionCue = /\b(prioriti[sz]e|look for|use |swap|switch|replace|respec|keep |avoid|upgrade|until|later|early|then|after|before|recommend|need |important|focus on)\b/i;
  const ignored = /^(cookie|privacy|sign in|log in|download|advert|comments?|likes?|views?)\b/i;
  const lines = String(text || "")
    .split(/\r?\n+/)
    .map(line => line.replace(/^[-*•\d.)\s]+/, "").replace(/\s+/g, " ").trim())
    .filter(line => line.length >= 18 && line.length <= 500 && instructionCue.test(line) && !ignored.test(line));
  return Array.from(new Set(lines)).slice(0, 80);
}

function extractMobalyticsPriorities(text, buildFocus = null) {
  const lower = text.toLowerCase();
  const focus = buildFocus || inferBuildFocus(text);
  const bySlot = { weapon: [], offhand: [], quiver: [], helmet: [], body: [], gloves: [], boots: [], ring: [], amulet: [], belt: [], flask: [] };
  const notes = [];
  const add = (slot, note) => {
    // If the build does not use quiver (e.g. quarterstaff, unarmed, melee), NEVER add notes to quiver!
    if (slot === "quiver" && !focus.bow) return;
    // If unarmed, do not add notes to weapon or offhand or quiver!
    if (focus.unarmed && (slot === "weapon" || slot === "offhand" || slot === "quiver")) return;
    // If quarterstaff or two-handed, do not add notes to offhand or quiver!
    if (focus.quarterstaff && (slot === "offhand" || slot === "quiver")) return;
    if (!bySlot[slot].includes(note)) bySlot[slot].push(note);
    if (!notes.includes(note)) notes.push(note);
  };

  if (/flat damage|added damage|damage to attacks/.test(lower)) {
    if (!focus.unarmed) add("weapon", focus.quarterstaff ? "Flat physical/elemental attack damage is a high-value quarterstaff leveling stat." : "Flat attack damage is a high-value leveling stat.");
    add("ring", "Flat damage on rings is useful while leveling.");
    add("gloves", "Flat damage to attacks on gloves is useful while leveling.");
  }
  if (focus.quarterstaff) {
    add("weapon", "Quarterstaff flat physical/elemental damage and attack speed set your melee damage ceiling.");
    if (/critical|crit/.test(lower)) add("weapon", "Critical strike stats scale Quarterstaff burst damage.");
    if (/lightning|shock/.test(lower)) add("weapon", "Added lightning damage synergizes with Monk lightning combos.");
    if (/cold|ice|freeze/.test(lower)) add("weapon", "Added cold damage synergizes with Monk freeze / shatter strikes.");
    add("gloves", "Attack speed, accuracy, and flat damage on gloves improve Quarterstaff responsiveness.");
  }
  if (focus.bow && /bow damage|projectile damage|bow skills|projectile/.test(lower)) {
    add("weapon", "Bow/projectile damage fits the guide damage plan.");
    add("quiver", "Projectile or bow-skill damage is a strong quiver stat.");
  }
  if (/cold|ice|freeze|chill/.test(lower)) {
    if (!focus.unarmed) add("weapon", "Cold damage matches the guide's detected cold-damage plan.");
    if (focus.bow) add("quiver", "Cold/projectile attack scaling matches the guide.");
    add("gloves", "Cold damage is relevant because the guide uses cold skills or mechanics.");
  }
  if (/lightning|shock|electrocute|conductive/.test(lower)) {
    if (!focus.unarmed) add("weapon", "Lightning damage matches the guide's detected lightning plan.");
    add("gloves", "Lightning or elemental attack scaling is relevant to the guide.");
    add("ring", "Lightning or elemental attack scaling may be useful when defenses are covered.");
  }
  if (/attack speed|reload speed/.test(lower)) {
    if (!focus.unarmed) add("weapon", "Attack speed is a strong damage and feel stat.");
    add("gloves", "Attack speed on gloves is valuable.");
    if (focus.bow) add("quiver", "Attack speed is valuable if available.");
  }
  if (/movement speed|move speed/.test(lower)) {
    add("boots", "Movement speed is a priority on boots (aim for 15–20%+).");
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
  if (/accuracy|hit chance/.test(lower) || focus.attack) {
    ["gloves", "helmet", "ring", "amulet"].forEach(slot => add(slot, "Accuracy rating improves hit chance consistency."));
  }
  if (/flask/.test(lower)) {
    add("flask", "Keep flasks upgraded as level breakpoints unlock stronger bases.");
  }
  if (/critical|crit/.test(lower)) {
    if (!focus.unarmed) add("weapon", "Crit can matter later if the build scales it.");
    if (focus.bow) add("quiver", "Crit stats may matter later if the guide scales them.");
  }

  if (!notes.length) {
    if (!focus.unarmed) add("weapon", focus.quarterstaff ? "Look for flat damage and attack speed on quarterstaff." : "Look for damage that matches the guide main skill.");
    add("boots", "Look for movement speed (15–20%+).");
    add("helmet", "Look for life, resistance, or needed attributes.");
  }

  return { notes, bySlot };
}

function buildPriorityTargetsFromMobalytics(priorities, focus = null) {
  const allowed = focus ? new Set(getAllowedSlotsForFocus(focus)) : null;
  return Object.entries(priorities.bySlot)
    .filter(([slot, notes]) => notes.length && (!allowed || allowed.has(slot)))
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
  profile.statRules = buildMobalyticsRules(parsed, window.currentPobbBuild);
  profile.slots = getAllowedSlotsForFocus(parsed.focus);
  return profile;
}

function buildMobalyticsRules(parsed, pobBuild = null) {
  const rules = buildImportedRules(parsed.stages, pobBuild, parsed.focus);
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
  const sourceDesc = parsed.isDirectExport
    ? `${stages.length} stage(s) imported directly from Mobalytics build planner. Creator: ${escapeHtml(parsed.author || "Mobalytics")}.`
    : `${stages.length} stage(s) created from guide text. Author/source: ${escapeHtml(parsed.author || "Mobalytics")}.`;
  return `
    <div class="summary-grid">
      <div><strong>${escapeHtml(profile.name)}</strong><br><span>${sourceDesc}</span></div>
      <div>${priorityTags || '<span class="tag">No priority tags detected</span>'}</div>
    </div>
    <div class="stage-chips">${stages.map(stage => `<span>${escapeHtml(stage.label)} · ${stage.skills?.length || 0} skills · ${stage.inventory?.length || 0} items/targets</span>`).join("")}</div>
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

function cleanStageLabel(name) {
  let text = String(name || "").trim();
  if (text.includes(" - ")) {
    text = text.split(" - ")[0].trim();
  }
  text = text.replace(/\b([Ll]eveli)n(?=[\s\-_]|$)/g, "$1ng").replace(/\b([Ll]eveli)N(?=[\s\-_]|$)/g, "$1NG");
  return text;
}

function normalizeGuideNameText(text) {
  return String(text || "")
    .replace(/\.build$/i, "")
    .replace(/\b([Ll]eveli)n(?=[\s\-_]|$)/g, "$1ng")
    .replace(/\b([Dd]eade|[Dd]eadey)\b/g, "Deadeye")
    .replace(/\s+/g, " ")
    .trim();
}

function stripStagePrefixFromName(text) {
  return normalizeGuideNameText(text)
    .replace(/^(?:early|live gear|uber endgame|crit hybrid|non[-\s]?crit\s+(?:midgame|hybrid swap)|midgame|hybrid swap|act\s*\d+|interludes?|mapping|maps|end[-\s]?game)\s*[-–—]\s*/i, "")
    .replace(/^(?:lvl|level)\s*\d+\s*(?:[-–—]\s*\d+|\+)?\s*[-–—]\s*/i, "")
    .trim();
}

function inferVariantRange(name, data = null) {
  const lower = normalizeGuideNameText(name).toLowerCase();
  // Mobalytics/Fubgun endgame export variants do not expose useful level ranges.
  // The item level_intervals mostly describe required gear levels, so use the guide variant names.
  if (/live gear/.test(lower)) return { min: 1, max: 100, label: "Live Gear", manualOnly: true };
  if (/uber endgame/.test(lower)) return { min: 95, max: 100, label: "Uber Endgame" };
  if (/crit hybrid/.test(lower) && !/non[-\s]?crit/.test(lower)) return { min: 90, max: 94, label: "Crit Hybrid" };
  if (/non[-\s]?crit.*hybrid swap|hybrid swap/.test(lower)) return { min: 85, max: 89, label: "non-crit Hybrid swap" };
  if (/non[-\s]?crit.*midgame|midgame/.test(lower)) return { min: 77, max: 84, label: "non-crit Midgame" };
  if (/^early\b/.test(lower)) return { min: 1, max: 76, label: "Early" };

  // Acts and PoE2 progression stages
  const actMatch = lower.match(/\bact\s*([1-4])\b/);
  if (actMatch) {
    const act = Number(actMatch[1]);
    const actRanges = {
      1: { min: 1, max: 15, label: "Act 1 (1-15)" },
      2: { min: 16, max: 28, label: "Act 2 (16-28)" },
      3: { min: 29, max: 42, label: "Act 3 (29-42)" },
      4: { min: 43, max: 55, label: "Act 4 (43-55)" },
    };
    return actRanges[act];
  }
  if (/\binterludes?\b/.test(lower)) return { min: 56, max: 64, label: "Interludes (56-64)" };
  if (/\b(?:mapping|maps)\b/.test(lower)) return { min: 65, max: 84, label: "Mapping (65-84)" };
  if (/\b(?:end[-\s]?game|endgame)\b/.test(lower)) return { min: 85, max: 100, label: "Endgame (85-100)" };

  return null;
}

function isNonCritStageContext(profile, stageKey) {
  const stage = profile?.stages?.[stageKey];
  const text = `${profile?.name || ""} ${stage?.label || ""} ${stage?.data?.name || ""}`.toLowerCase();
  if (/non[-\s]?crit|early|midgame/.test(text) && !/crit hybrid|uber endgame/.test(text)) return true;
  const crit = Number(window.currentPobbBuild?.stats?.critChance ?? window.currentPobbBuild?.stats?.offense?.critChance ?? NaN);
  return Number.isFinite(crit) && crit > 0 && crit < 15;
}

function isCritStageContext(profile, stageKey) {
  const stage = profile?.stages?.[stageKey];
  const text = `${stage?.label || ""} ${stage?.data?.name || ""}`.toLowerCase();
  return /crit hybrid|uber endgame/.test(text) && !/non[-\s]?crit/.test(text);
}

function normalizeBuildFile(data, fileName) {
  const fileBaseName = fileName.replace(/\.build$/i, "");
  const fileHasLevel = /(?:lvl|level|leveling|stage)\s*\d+|\b\d+\s*[-–—]\s*\d+|\b\d+\s*\+/i.test(fileBaseName);
  const jsonHasLevel = /(?:lvl|level|leveling|stage)\s*\d+|\b\d+\s*[-–—]\s*\d+|\b\d+\s*\+/i.test(data.name || "");
  
  let name = data.name || fileBaseName;
  if (fileHasLevel && !jsonHasLevel) {
    name = fileBaseName;
  }

  // Fix the typo-trimmer: change Levelin back to Leveling
  name = name.replace(/\b([Ll]eveli)n\b/g, "$1ng").replace(/\b([Ll]eveli)N\b/g, "$1NG");
  const range = inferVariantRange(name, data) || extractLevelRange(name, data, fileName);
  const inventory = Array.isArray(data.inventory_slots) ? data.inventory_slots.map(normalizeInventorySlot) : [];
  const skills = Array.isArray(data.skills) ? data.skills.map(normalizeSkill) : [];
  const skillNames = skills.map(skill => skill.name);
  const inferred = inferBuildFocus(`${name} ${skillNames.join(" ")} ${inventory.map(i => i.text).join(" ")}`);

  return {
    fileName,
    name,
    author: data.author || "Unknown",
    ascendancy: cleanAscendancyName(data.ascendancy) || data.ascendancy || "Unknown",
    minLevel: range.min,
    maxLevel: range.max,
    label: range.label || cleanStageLabel(name),
    manualOnly: Boolean(range.manualOnly),
    inventory,
    skills,
    passiveCount: Array.isArray(data.passives) ? data.passives.length : 0,
    passiveNodes: Array.isArray(data.passives) ? data.passives.map(passive => passive?.id || passive).filter(Boolean) : [],
    focus: inferred,
    raw: data,
  };
}

function extractLevelRange(name, data, fileName = "") {
  const text = String(name || "");
  const fileText = String(fileName || "");

  // Fubgun variant names mapping
  if (/early/i.test(text) || /early/i.test(fileText)) {
    return { min: 1, max: 76, label: "Early (1-76)" };
  }
  if (/non-crit midgame/i.test(text) || /non-crit midgame/i.test(fileText) || /midgame/i.test(text) || /midgame/i.test(fileText)) {
    return { min: 77, max: 84, label: "non-crit Midgame (77-84)" };
  }
  if (/non-crit hybrid swap/i.test(text) || /non-crit hybrid swap/i.test(fileText) || /hybrid swap/i.test(text) || /hybrid swap/i.test(fileText)) {
    return { min: 85, max: 89, label: "non-crit Hybrid swap (85-89)" };
  }
  if (/crit hybrid/i.test(text) || /crit hybrid/i.test(fileText)) {
    return { min: 90, max: 94, label: "Crit Hybrid (90-94)" };
  }
  if (/uber endgame/i.test(text) || /uber endgame/i.test(fileText) || /endgame/i.test(text) || /endgame/i.test(fileText)) {
    return { min: 95, max: 100, label: "Uber Endgame (95-100)" };
  }
  if (/live gear/i.test(text) || /live gear/i.test(fileText) || /live/i.test(text) || /live/i.test(fileText)) {
    return { min: 100, max: 100, label: "Live Gear Reference (100)" };
  }

  const rangeRegex = /(?:lvl|level|leveling|stage)\.?\s*(\d+)\s*[-–—]\s*(\d+)/i;
  const rawRangeRegex = /\b(\d+)\s*[-–—]\s*(\d+)\b/;
  const plusRegex = /(?:lvl|level|leveling|stage)\.?\s*(\d+)\s*\+/i;
  const rawPlusRegex = /\b(\d+)\s*\+/;
  const singleRegex = /(?:lvl|level|leveling|stage)\.?\s*(\d+)\b/i;

  let m = text.match(rangeRegex) || text.match(rawRangeRegex);
  if (m) {
    return { min: Number(m[1]), max: Number(m[2]), label: `Level ${m[1]}-${m[2]}` };
  }
  m = text.match(plusRegex) || text.match(rawPlusRegex);
  if (m) {
    return { min: Number(m[1]), max: 100, label: `Level ${m[1]}+` };
  }
  m = text.match(singleRegex);
  if (m) {
    const lvl = Number(m[1]);
    return { min: lvl, max: lvl >= 60 ? 100 : lvl + 9, label: lvl >= 60 ? `Level ${lvl}+` : `Level ${lvl}` };
  }

  // Fallback to checking filename
  if (fileName) {
    const fText = String(fileName).replace(/\.build$/i, "");
    m = fText.match(rangeRegex) || fText.match(rawRangeRegex);
    if (m) {
      return { min: Number(m[1]), max: Number(m[2]), label: `Level ${m[1]}-${m[2]}` };
    }
    m = fText.match(plusRegex) || fText.match(rawPlusRegex);
    if (m) {
      return { min: Number(m[1]), max: 100, label: `Level ${m[1]}+` };
    }
    m = fText.match(singleRegex);
    if (m) {
      const lvl = Number(m[1]);
      return { min: lvl, max: lvl >= 60 ? 100 : lvl + 9, label: lvl >= 60 ? `Level ${lvl}+` : `Level ${lvl}` };
    }
  }

  const intervals = [];
  for (const slot of data.inventory_slots || []) {
    if (Array.isArray(slot.level_interval)) intervals.push(slot.level_interval);
  }
  for (const skill of data.skills || []) {
    if (Array.isArray(skill.level_interval)) intervals.push(skill.level_interval);
  }
  if (intervals.length) {
    const starts = intervals.map(i => Number(i[0] || 1));
    const nonOneStarts = starts.filter(s => s > 1);
    const min = nonOneStarts.length ? Math.min(...nonOneStarts) : Math.min(...starts);
    return { min, max: 100, label: "" };
  }
  return { min: 1, max: 100, label: "" };
}

function normalizeInventorySlot(slot) {
  const text = String(slot.additional_text || slot.unique_name || slot.name || slot.base_item_name || "").replace(/^\s+|\s+$/g, "");
  const name = slot.unique_name || slot.name || slot.base_item_name || text.split(/\r?\n/).find(Boolean) || slot.inventory_id || "Guide item";
  return {
    id: slot.inventory_id || "UnknownSlot",
    slot: mapInventoryIdToSlot(slot.inventory_id || "", text, name),
    text,
    name,
    uniqueName: slot.unique_name || "",
    isUnique: Boolean(slot.unique_name),
    levelInterval: slot.level_interval || [1, 100],
    raw: slot,
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

  // Prefer actual Weapon/Offhand IDs before reading modifier text
  if (value.includes("weapon")) return "weapon";
  if (value.includes("offhand")) return /quiver/.test(itemText) ? "quiver" : "offhand";

  if (/quiver/.test(itemText)) return "quiver";
  if (/shield|focus/.test(itemText)) return "offhand";
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

function cleanAscendancyName(id) {
  if (!id) return "Unknown";
  const map = {
    "Ranger1": "Deadeye",
    "Ranger2": "Pathfinder",
    "Monk1": "Invoker",
    "Monk2": "Acolyte of Chayula",
    "Warrior1": "Titan",
    "Warrior2": "Warbringer",
    "Mercenary1": "Witchhunter",
    "Mercenary2": "Gemling Legionnaire",
    "Mercenary3": "Tactician",
    "Sorceress1": "Stormweaver",
    "Sorceress2": "Chronomancer",
    "Witch1": "Blood Mage",
    "Witch2": "Infernalist",
    "Huntress1": "Amazon",
    "Huntress2": "Survivalist",
    "Shadow1": "Assassin",
    "Shadow2": "Trickster",
    "Duelist1": "Slayer",
    "Duelist2": "Gladiator",
    "Templar1": "Inquisitor",
    "Templar2": "Hierophant",
    "Druid1": "Shaman",
    "Druid2": "Animist",
  };
  return map[id] || id;
}

function inferBuildFocus(text, options = {}) {
  const lower = String(text || "").toLowerCase();

  const isQuarterstaff = /\b(quarterstaff|quarterstaves|charged staff|storm wave|falling thunder|tempest bell|siphoning strike|whirling assault|flicker strike|rend)\b/i.test(lower) ||
    /quarterstaff strike/i.test(lower) ||
    Boolean(options.isQuarterstaff);

  const isUnarmed = /\b(unarmed|hollow palm|hollow focus|way of the stonefist|martial artist)\b/i.test(lower) ||
    Boolean(options.isUnarmed);

  const isCrossbow = !isQuarterstaff && !isUnarmed && /\b(crossbows?|bolts?|power siphoning|rapid fire)\b/i.test(lower);

  // Bow requires specific bow terms, not generic "projectile" or substring "shot"
  const hasExplicitBow = /\b(bows?|quivers?|arrows?|ice shot|tornado shot|lightning arrow|toxic rain|split shot|barrage|snipe|rain of arrows)\b/i.test(lower);
  const isBow = !isQuarterstaff && !isUnarmed && hasExplicitBow;

  const isMonk = /\b(monk|invoker|acolyte of chayula)\b/i.test(lower) || isQuarterstaff || isUnarmed;

  const isMelee = isQuarterstaff || isUnarmed || /\b(melee|spear|strike|cleave|slam|boneshatter|sunder|ground slam)\b/i.test(lower);

  return {
    cold: /\b(ice|cold|frost|freeze|chill)\b/i.test(lower),
    lightning: /\b(lightning|shock|electrocute|conductive)\b/i.test(lower),
    fire: /\b(fire|ignite|burn|flame|pyro|infernal|sun|flamethrower)\b/i.test(lower),
    chaos: /\b(chaos|poison|wither|decay|void|forbidden)\b/i.test(lower),
    physical: /\b(physical|bleed|puncture|lacerate|rupture)\b/i.test(lower),
    bow: Boolean(isBow),
    quiver: Boolean(isBow),
    crossbow: Boolean(isCrossbow),
    attack: Boolean(isBow || isCrossbow || isMelee || /\battack\b/i.test(lower)),
    minion: /\b(minion|skeletal|zombie|skeleton|golem|spectre)\b/i.test(lower),
    spell: !isQuarterstaff && !isUnarmed && /\b(spell|cast|sorcer|wizard)\b/i.test(lower),
    melee: Boolean(isMelee),
    unarmed: Boolean(isUnarmed),
    quarterstaff: Boolean(isQuarterstaff),
    monk: Boolean(isMonk),
    spirit: /\b(spirit|reservation|aura)\b/i.test(lower),
  };
}

function getAllowedSlotsForFocus(focus) {
  if (focus?.unarmed) {
    return ["helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
  }
  if (focus?.quarterstaff || focus?.crossbow) {
    return ["weapon", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
  }
  if (focus?.bow) {
    return ["weapon", "quiver", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
  }
  return ["weapon", "offhand", "helmet", "body", "gloves", "boots", "ring", "amulet", "belt"];
}

function buildFocusText(stages) {
  return stages.map(stage => `${stage.name} ${stage.skills.map(s => s.name).join(" ")} ${stage.inventory.map(i => i.text).join(" ")}`).join(" ");
}

function createImportedProfile(stages) {
  const profileName = commonBuildName(stages);
  const focus = inferBuildFocus(buildFocusText(stages));
  const allowedSlots = getAllowedSlotsForFocus(focus);
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
    focus,
    slots: allSlots.length ? allSlots.filter(s => allowedSlots.includes(s)) : allowedSlots,
    baseWeights: BUILD_PROFILES.genericAttack.baseWeights,
    stages: stageEntries,
    statRules: buildImportedRules(stages, window.currentPobbBuild, focus),
    slotRules: slotRulesForFocus(focus),
    importedStages: stages,
  };
}

// Minion armies don't care about weapon/quiver DPS (minions deal the damage),
// and lean on rings/amulet/gloves for minion damage/life rolls instead.
function slotRulesForFocus(focus) {
  const rules = defaultSlotRules();
  if (focus?.minion) {
    rules.weapon  = { ...rules.weapon,  damage: 0.35, synergy: 1.0 };
    rules.offhand = { ...rules.offhand, damage: 0.5,  synergy: 1.3 };
    rules.quiver  = { ...rules.quiver,  damage: 0.5,  synergy: 1.2 };
    rules.gloves  = { ...rules.gloves,  damage: 0.6,  synergy: 1.35 };
    rules.ring    = { ...rules.ring,    synergy: 1.35 };
    rules.amulet  = { ...rules.amulet,  synergy: 1.3 };
  } else if (focus?.quarterstaff) {
    return defaultQuarterstaffSlotRules();
  } else if (focus?.unarmed) {
    rules.weapon  = { damage: 0, synergy: 0, defense: 0, resistance: 0, mobility: 0 };
    rules.offhand = { damage: 0, synergy: 0, defense: 0, resistance: 0, mobility: 0 };
    rules.quiver  = { damage: 0, synergy: 0, defense: 0, resistance: 0, mobility: 0 };
    rules.gloves  = { damage: 1.45, synergy: 1.45, defense: 1.0, resistance: 0.9, attributes: 1.2 };
    rules.ring    = { resistance: 1.2, attributes: 1.4, damage: 1.2, synergy: 1.2 };
    rules.amulet  = { attributes: 1.5, damage: 1.2, synergy: 1.2, resistance: 1.0 };
  }
  return rules;
}

function commonBuildName(stages) {
  const cleaned = stages
    .map(stage => stripStagePrefixFromName(stage.name || stage.fileName || ""))
    .filter(Boolean);
  if (!cleaned.length) return `Imported PoE2 Build (${stages.length} stages)`;

  const counts = new Map();
  for (const name of cleaned) counts.set(name, (counts.get(name) || 0) + 1);
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0]?.[0] || cleaned[0];
  return `${normalizeGuideNameText(best) || "Imported PoE2 Build"} (${stages.length} stages)`;
}

function weightsForStage(stage) {
  if (stage.minLevel >= 60) return { damage: 1.25, defense: 1.25, attributes: 0.9, resistance: 1.25, mobility: 1.0, synergy: 1.45 };
  if (stage.minLevel >= 42) return { damage: 1.15, defense: 1.1, attributes: 1.0, resistance: 1.15, mobility: 1.05, synergy: 1.35 };
  if (stage.minLevel >= 24) return { damage: 1.08, defense: 1.0, attributes: 1.15, resistance: 1.0, mobility: 1.15, synergy: 1.3 };
  return { damage: 1.0, defense: 0.9, attributes: 1.35, resistance: 0.9, mobility: 1.25, synergy: 1.15 };
}

function buildImportedRules(stages, pobBuild = null, precomputedFocus = null) {
  const focus = precomputedFocus || inferBuildFocus(buildFocusText(stages));

  // Dynamic weight modifiers based on Keystones
  const keystones = pobBuild?.keystones || [];
  const hasBloodMagic = keystones.some(k => /blood magic/i.test(k));
  const hasPreciseTechnique = keystones.some(k => /precise technique/i.test(k));
  const hasHollowPalm = keystones.some(k => /hollow palm|hollow focus|way of the stonefist/i.test(k)) || focus.unarmed;

  const rules = [...defaultGenericRules()];

  if (hasBloodMagic) {
    rules.push({
      match: /maximum mana|mana regeneration|mana reservation/i,
      category: "synergy",
      points: -10,
      note: "⚠️ Blood Magic removes Mana. Mana stats are useless."
    });
  } else {
    rules.push({
      match: /maximum mana/i,
      category: "defense",
      points: 3
    });
  }

  if (hasPreciseTechnique) {
    rules.push({
      match: /critical hit chance|critical damage/i,
      category: "damage",
      points: -10,
      note: "⚠️ Precise Technique prevents Critical Strikes. Crit is useless."
    });
    rules.push({
      match: /accuracy rating/i,
      category: "damage",
      points: 15,
      note: "Accuracy rating (highly valued for Precise Technique)."
    });
  } else {
    rules.push({
      match: /critical hit chance|critical damage/i,
      category: "damage",
      points: 2,
      note: "Low priority until the selected guide stage actually swaps into crit scaling."
    });
    rules.push({
      match: /accuracy rating/i,
      category: "damage",
      points: 4
    });
  }

  // Universal PoE2 Spirit resource rule and Gear Sockets
  rules.unshift(
    { match: /\+\d+\s+to\s+spirit|%\s+increased\s+spirit|\bspirit\b/i, category: "synergy", points: 14, label: "Spirit", note: "Spirit is vital in PoE2 to run persistent buffs, auras, and minion reservations." },
    { match: /has\s+\d+\s+socket|socketed\s+gems|socketed\s+runes|socketed\s+soul\s+cores/i, category: "synergy", points: 12, label: "gear sockets", note: "Allows socketing powerful Soul Cores and Runes." }
  );

  if (focus.cold) {
    rules.unshift({ match: /cold damage to attacks|adds .* cold damage|cold damage/i, category: "synergy", points: 17, note: "The imported build appears to use Ice/cold scaling, so cold damage is highly relevant." });
  }
  if (focus.lightning) {
    rules.unshift({ match: /lightning damage to attacks|adds .* lightning damage|lightning damage|elemental damage with attacks/i, category: "synergy", points: 17, note: "The imported build uses lightning skills or mechanics, so lightning/elemental attack scaling is highly relevant." });
  }
  if (focus.fire) {
    rules.unshift({ match: /fire damage to attacks|adds .* fire damage|fire damage|elemental damage with attacks|fire penetration|ignite/i, category: "synergy", points: 17, note: "The imported build utilizes Fire scaling, so fire/elemental damage is highly relevant." });
  }
  if (focus.chaos) {
    rules.unshift({ match: /chaos damage|adds .* chaos damage|poison|wither|chaos penetration/i, category: "synergy", points: 18, note: "The imported build utilizes Chaos/Poison scaling (Forbidden Rites theme), so chaos modifiers are top priority." });
  }
  if (focus.physical) {
    rules.unshift({ match: /physical damage|adds .* physical damage|bleed|puncture/i, category: "damage", points: 15, note: "The imported build scales Physical/Bleed damage." });
  }
  if (focus.quarterstaff) {
    rules.unshift(
      { match: /quarterstaff|melee damage|damage with staves|attack speed|adds .* damage to attacks|melee physical damage/i, category: "synergy", points: 18, label: "quarterstaff melee damage", note: "Quarterstaff Monk scales attack speed, flat added damage, and melee/staff damage." },
      { match: /bow skills|projectile skills|arrows?|quivers?/i, category: "synergy", points: -15, label: "bow / quiver stats", note: "⚠️ Quarterstaff Monk does not use bows, arrows, or quivers." }
    );
  }
  if (focus.unarmed) {
    rules.unshift(
      { match: /unarmed|melee damage|attack speed|adds .* damage to attacks|melee physical damage/i, category: "synergy", points: 18, label: "unarmed damage", note: "Unarmed builds scale attack speed, flat added damage, and melee multipliers without weapon requirements." },
      { match: /bow skills|projectile skills|arrows?|quivers?|quarterstaff|staff|staves|weapon damage/i, category: "synergy", points: -15, label: "weapon / quiver stats", note: "⚠️ Unarmed builds do not equip weapons or quivers." }
    );
  }
  if (focus.bow || focus.crossbow) {
    rules.unshift({ match: /projectile skills|projectile damage|bow skills|crossbow skills|quiver/i, category: "synergy", points: 14, note: "The imported build appears projectile/bow focused." });
    rules.unshift({ match: /attack speed|reload speed/i, category: "damage", points: 13, note: "The imported build is attack/projectile based, so attack speed/reload speed matters." });
  }
  if (focus.minion) {
    // Minion armies deal damage through their summons, so minion/Spirit stats
    // are the core damage/defense scaling for this build — not off-plan noise.
    rules.unshift(
      { match: /minions deal .*% (increased|more) damage|minion damage/i, category: "synergy", points: 18, label: "minion damage", note: "Directly scales your summoned minions — the core damage stat for this build." },
      { match: /minion attack speed|minion cast speed|minion attack and cast speed/i, category: "synergy", points: 15, label: "minion speed", note: "Faster minion attacks/casts — high value for a minion army." },
      { match: /minions? have .*% (increased|to) (all )?(elemental )?resistance|minion (maximum )?life/i, category: "defense", points: 13, label: "minion life/resistance", note: "Keeps your minions alive — a dead minion deals no damage." },
      { match: /\bspirit\b/i, category: "synergy", points: 16, label: "Spirit", note: "Spirit lets you summon more minions and run more auras — the core resource for a minion army." },
      { match: /reservation/i, category: "synergy", points: 6, label: "reservation efficiency", note: "Cheaper aura/minion upkeep frees Spirit for more minions." },
      { match: /minions? deal .*% of (their |your )?damage as extra (fire|cold|lightning|chaos)/i, category: "synergy", points: 10, label: "minion extra elemental damage", note: "Extra elemental damage scales your minions further." },
      { match: /curse effect|critical hit chance with spells/i, category: "synergy", points: 6, label: "curse/spell support", note: "Supports the curses and spells that set up your minions." }
    );
  } else if (!focus.spell) {
    rules.push({ match: /spell damage|minion damage/i, category: "synergy", points: -10, note: "This does not look relevant to the imported attack build." });
  }
  if (hasHollowPalm) {
    rules.unshift(
      { match: /evasion rating/i, category: "synergy", points: 16, label: "armour-piece evasion", note: "Hollow Palm gains attack speed from Evasion on equipped armour pieces." },
      { match: /energy shield/i, category: "synergy", points: 16, label: "armour-piece energy shield", note: "Hollow Palm gains critical chance from Energy Shield on equipped armour pieces." }
    );
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
    Object.entries(stage.focus || {}).forEach(([key, value]) => { if (value) acc.add(key); });
    return acc;
  }, new Set());
  const labelMap = {
    cold: "Cold/Ice", lightning: "Lightning", fire: "Fire", chaos: "Chaos (0.5.5)", physical: "Physical",
    bow: "Bow", crossbow: "Crossbow", attack: "Attack", spell: "Spell", minion: "Minion", melee: "Melee",
    unarmed: "Unarmed", quarterstaff: "Quarterstaff", spirit: "Spirit"
  };
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
  const profile = typeof getProfile === "function" ? getProfile() : null;
  const focus = profile?.focus || inferBuildFocus(profile?.name || "");
  const textCheck = `${item.name || ""} ${item.text || ""}`.toLowerCase();

  let weaponClass = "Weapons";
  if (focus.quarterstaff || /quarterstaff/.test(textCheck)) weaponClass = "Quarterstaves";
  else if (/staff|staves/.test(textCheck)) weaponClass = "Staves";
  else if (focus.crossbow || /crossbow/.test(textCheck)) weaponClass = "Crossbows";
  else if (focus.bow || /bow|quiver/.test(textCheck)) weaponClass = "Bows";
  else if (/wand/.test(textCheck)) weaponClass = "Wands";
  else if (/sceptre|scepter/.test(textCheck)) weaponClass = "Sceptres";

  const classMap = { weapon: weaponClass, quiver: "Quivers", helmet: "Helmets", body: "Body Armours", gloves: "Gloves", boots: "Boots", amulet: "Amulets", ring: "Rings", belt: "Belts", flask: "Flasks", charm: "Charms", offhand: "Shields" };
  const slotLabel = classMap[item.slot] || label(item.slot);
  const rarity = item.isUnique || item.uniqueName ? "Unique" : "Rare";
  const lines = item.text.split(/\r?\n/).map(line => line.replace(/^\d+\.\s*/, "")).filter(Boolean);
  const name = lines.shift() || item.name;
  return `Item Class: ${slotLabel}\nRarity: ${rarity}\n${name}\n--------\n${lines.join("\n")}`;
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

// Stat-rule scoring only understands numeric affixes. Unique items frequently carry
// a mechanic instead — a granted skill, a reservation waiver, a free support, a
// passive allocation, a status immunity — whose value comes from what it *unlocks*,
// not from a point total. These patterns catch that mechanic text so the coach can
// say "this may be underrated by its score" instead of just reporting a low number.
const BUILD_ENABLING_PATTERNS = [
  {
    id: "grants-skill",
    match: /grants?\s+(level\s+\d+\s+)?[\w' -]+?\bskill\b/i,
    label: "Grants a skill",
    reason: line => `Grants a skill for free ("${line}"). This can replace a gem slot or unlock a mechanic your build depends on — losing it means finding that skill another way.`,
  },
  {
    id: "socketed-support",
    match: /socketed (gems|skills) are supported by/i,
    label: "Free support gem",
    reason: line => `Supports socketed skills for free ("${line}"). This effectively gives you an extra support gem slot — replacing this item costs you that support somewhere else.`,
  },
  {
    id: "reservation",
    match: /no reservation|reservation efficiency|reduced (mana|spirit) reservation|reservation.*cost/i,
    label: "Reservation reduction",
    reason: line => `Reduces or removes a reservation cost ("${line}"). This can be what lets you fit your current aura/minion setup — losing it may mean you can no longer run everything you currently have active.`,
  },
  {
    id: "allocates",
    match: /\ballocates?\s+[\w' -]{3,}/i,
    label: "Grants a passive",
    reason: line => `Grants a passive tree node for free ("${line}"). Removing this item means finding those points elsewhere on the tree.`,
  },
  {
    id: "status-immunity",
    match: /cannot be (frozen|chilled|ignited|shocked|stunned|poisoned)/i,
    label: "Status immunity",
    reason: line => `Grants immunity to a status ailment ("${line}"). This is a defensive mechanic, not a stat — losing it reopens a death risk the score doesn't show.`,
  },
];

function detectBuildEnabling(item) {
  const hits = [];
  const seen = new Set();
  for (const rawLine of item.mods || []) {
    const line = String(rawLine || "").trim();
    for (const pattern of BUILD_ENABLING_PATTERNS) {
      if (!seen.has(pattern.id) && pattern.match.test(line)) {
        seen.add(pattern.id);
        hits.push({ id: pattern.id, label: pattern.label, line, reason: pattern.reason(line) });
      }
    }
  }
  return hits;
}

function buildUtilityStars(buildEnabling) {
  return buildEnabling && buildEnabling.length ? Math.min(5, buildEnabling.length + 1) : 0;
}

function renderUtilityStars(stars) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

// Different slots can carry very different point budgets by design (a weapon
// stacks attack speed + crit + flat damage; an amulet mostly carries life/
// resistance/attributes at 1x multipliers). Comparing raw totals across slots
// would always flag low-budget slots like amulet/ring/belt as "weakest" no
// matter how good the equipped item is. This estimates each slot's own
// realistic ceiling — the best single rule per category, scaled by that
// slot's own multipliers — so "weakest slots" can rank relative shortfall
// instead of absolute points.
function slotScoreCeiling(profile, slot, stageKey) {
  const stageWeights = profile.stages[stageKey] || {};
  const slotWeights = profile.slotRules[slot] || {};
  const bestByCategory = {};
  for (const rule of profile.statRules) {
    if (rule.points <= 0) continue;
    if ((rule.points) > (bestByCategory[rule.category] || 0)) bestByCategory[rule.category] = rule.points;
  }
  let ceiling = 0;
  for (const [category, points] of Object.entries(bestByCategory)) {
    const slotMultiplier = slotWeights[category] ?? 1;
    const stageMultiplier = stageWeights[category] ?? profile.baseWeights[category] ?? 1;
    ceiling += points * slotMultiplier * stageMultiplier;
  }
  return Math.max(ceiling, 1);
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

        const keystones = window.currentPobbBuild?.keystones || [];
        const hasBloodMagic = keystones.some(k => /blood magic/i.test(k));
        const hasPreciseTechnique = keystones.some(k => /precise technique/i.test(k));

        let base = rule.points;
        let note = rule.note;
        // Bonded mods are conditional — only active with a matching bonded piece
        if (/^bonded:/i.test(line)) {
          base = Math.round(base * 0.3);
          note = `(Bonded — only active with the matching item) ${note}`;
        }
        if (hasBloodMagic && /maximum mana|mana regeneration|mana reservation/i.test(line)) {
          base = -10;
          note = "⚠️ Blood Magic removes Mana. Mana stats are useless.";
        }
        if (hasPreciseTechnique && /critical hit chance|critical damage/i.test(line)) {
          base = -10;
          note = "⚠️ Precise Technique prevents Critical Strikes. Crit is useless.";
        }
        if (hasPreciseTechnique && /accuracy rating/i.test(line)) {
          base = Math.max(base, 15);
          note = "Accuracy rating (highly valued for Precise Technique).";
        }
        const currentHitChance = Number(window.currentPobbBuild?.stats?.hitChance);
        if (Number.isFinite(currentHitChance) && /accuracy rating/i.test(line)) {
          if (currentHitChance <= 70) {
            base = Math.max(base, 18);
            note = `Accuracy rating (CRITICAL: current hit chance is only ${currentHitChance}%).`;
          } else if (currentHitChance <= 80) {
            base = Math.max(base, 14);
            note = `Accuracy rating (important: current hit chance is ${currentHitChance}%).`;
          } else if (currentHitChance >= 95) {
            base = Math.round(base * 0.25);
            note = `Accuracy rating (low value: hit chance is already ${currentHitChance}%).`;
          }
        }
        const slotMultiplier = slotWeights[rule.category] ?? 1;
        const stageMultiplier = stageWeights[rule.category] ?? profile.baseWeights[rule.category] ?? 1;
        const actMult = typeof actContextMult === "function" ? actContextMult(rule.category, getPlayerLevel()) : 1;
        const points = Math.round(base * slotMultiplier * stageMultiplier * actMult);
        scores[rule.category] += points;
        hits.push({ line, category: rule.category, points, note });
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

  const buildEnabling = detectBuildEnabling(item);

  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  return { item, scores, total, hits, warnings, mismatch, attributeProblem, buildEnabling };
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

function getActContext() {
  return (typeof document !== "undefined" ? document.getElementById("actSelect")?.value : null) || "auto";
}

const ACT_CONTEXT_WEIGHTS = {
  act1:     { resistance: 0.5,  attributes: 1.4, mobility: 1.4, defense: 0.8, damage: 1.25 },
  act2:     { resistance: 0.75, attributes: 1.2, mobility: 1.3, defense: 0.9, damage: 1.25 },
  act2plus: { resistance: 1.3,  defense: 1.2,  attributes: 0.9, damage: 1.1 },
  act3plus: { resistance: 1.3,  defense: 1.2,  attributes: 0.9, damage: 1.1 },
  maps:     { damage: 1.2,      synergy: 1.25, resistance: 1.4, defense: 1.25, attributes: 0.7 },
};

function getEffectiveActContext(playerLevel = 1) {
  const raw = getActContext();
  if (raw !== "auto") {
    if (raw === "act2plus") return "act3plus";
    if (ACT_CONTEXT_WEIGHTS[raw]) return raw;
  }
  const lvl = Number(playerLevel) || getPlayerLevel() || 1;
  if (lvl <= 15) return "act1";
  if (lvl <= 25) return "act2";
  if (lvl <= 64) return "act3plus";
  return "maps";
}

function actContextMult(category, playerLevel = 1) {
  const effectiveAct = getEffectiveActContext(playerLevel);
  const w = ACT_CONTEXT_WEIGHTS[effectiveAct] || {};
  return w[category] ?? 1.0;
}

function getLevelResistTarget(playerLevel = 1) {
  const lvl = Number(playerLevel) || 1;
  if (lvl <= 15) return { target: 15, minAcceptable: 0, criticalThreshold: -30, stageName: "Act 1", isEndgame: false };
  if (lvl <= 25) return { target: 25, minAcceptable: 0, criticalThreshold: -20, stageName: "Act 2", isEndgame: false };
  if (lvl <= 40) return { target: 45, minAcceptable: 20, criticalThreshold: -10, stageName: "Act 3", isEndgame: false };
  if (lvl <= 64) return { target: 65, minAcceptable: 40, criticalThreshold: 0, stageName: "Cruel / Late Campaign", isEndgame: false };
  return { target: 75, minAcceptable: 60, criticalThreshold: 0, stageName: "Maps / Endgame", isEndgame: true };
}

function buildNeededStats({ rows, equippedRows = [], futureRows = [], gearTotals, requirementProblems, profile, stageKey, playerLevel, playerAttrs }) {
  const needs = [];
  const effectiveAct = getEffectiveActContext(playerLevel);
  const isEarly = effectiveAct === "act1" || effectiveAct === "act2" || playerLevel <= 25;
  const isMid = effectiveAct === "act3plus" || (playerLevel >= 26 && playerLevel <= 64);
  const isLate = effectiveAct === "maps" || playerLevel >= 65;

  const allPastedAreFuture = rows.some(row => row.entry) && futureRows.length > 0 && equippedRows.length === 0;
  if (allPastedAreFuture && playerLevel <= 1 && playerAttrs.str === 0 && playerAttrs.dex === 0 && playerAttrs.int === 0) {
    needs.push("Player level/attributes look unset. Enter your real level and Str/Dex/Int before trusting requirement warnings.");
  }

  // Differentiate immediate attribute requirements (current gear or near-level items <= playerLevel + 5)
  // from distant future gear (e.g. req level 70 while player is level 16)
  const nearOrEquippedMissing = [];
  const distantFutureMissing = [];
  for (const row of rows) {
    if (!row.attrProblem?.missing?.length) continue;
    const itemReqLevel = Number(row.entry?.scored.item.requiredLevel || 0);
    const isNear = itemReqLevel <= playerLevel + 5;
    for (const miss of row.attrProblem.missing) {
      if (isNear) {
        nearOrEquippedMissing.push(miss);
      } else {
        distantFutureMissing.push(miss);
      }
    }
  }

  const byAttr = {};
  for (const miss of nearOrEquippedMissing) byAttr[miss.key] = Math.max(byAttr[miss.key] || 0, miss.shortBy);
  for (const [key, shortBy] of Object.entries(byAttr)) {
    const name = { str: "Strength", dex: "Dexterity", int: "Intelligence" }[key];
    needs.push(`+${shortBy} ${name} needed to equip your current/near-level gear. Best places to fix it: amulet, rings, helmet, or belt.`);
  }
  if (!nearOrEquippedMissing.length && distantFutureMissing.length && isEarly) {
    needs.push("Some distant future gear targets need higher attributes eventually, but don't divert your early leveling build to fix them yet.");
  }

  if (futureRows.some(row => row.levelProblem)) {
    needs.push(`Some pasted items are above player level ${playerLevel}. They are treated as future upgrades and not counted in current gear totals.`);
  }

  // Hit chance / Accuracy check
  const hitChance = Number(window.currentPobbBuild?.stats?.hitChance);
  if (Number.isFinite(hitChance) && hitChance > 0) {
    if (hitChance <= 75) {
      needs.unshift(`CRITICAL: Hit chance is only ${hitChance}% (over ${100 - hitChance}% of your attacks miss!). Prioritize Accuracy Rating on gloves, rings, helmet, or the passive tree immediately.`);
    } else if (hitChance < 88) {
      needs.push(`Hit chance is ${hitChance}%. Adding Accuracy Rating on gloves or jewelry will give a noticeable DPS boost by reducing misses.`);
    }
  }

  if (equippedRows.length) {
    if (gearTotals.movementSpeed <= 0) {
      needs.push("Movement speed boots should be a top priority; they make leveling feel much better.");
    } else if (gearTotals.movementSpeed < 15) {
      needs.push(`Boots only have ${gearTotals.movementSpeed}% movement speed. 10% is better than before, but upgrading to 15–20%+ will make campaign navigation much faster.`);
    }
  }

  // Level-scaled resistance check
  if (equippedRows.length) {
    const targetInfo = getLevelResistTarget(playerLevel);
    const finalRes = window.currentPobbBuild?.stats?.resistances || null;
    const lowRes = [];
    if (finalRes && Object.keys(finalRes).length) {
      if (Number(finalRes.fire) < targetInfo.target) lowRes.push("Fire");
      if (Number(finalRes.cold) < targetInfo.target) lowRes.push("Cold");
      if (Number(finalRes.lightning) < targetInfo.target) lowRes.push("Lightning");
    } else {
      const minRes = isEarly ? 0 : isMid ? 30 : 60;
      if (gearTotals.fireRes + gearTotals.allRes < minRes) lowRes.push("Fire");
      if (gearTotals.coldRes + gearTotals.allRes < minRes) lowRes.push("Cold");
      if (gearTotals.lightningRes + gearTotals.allRes < minRes) lowRes.push("Lightning");
    }
    if (lowRes.length) {
      if (isLate) {
        needs.push(`Cap ${lowRes.join("/")} resistance to 75% on armor or jewelry. In endgame maps, capping resistances is mandatory for survival.`);
      } else if (isEarly) {
        const severeNeg = lowRes.filter(name => {
          const val = finalRes ? Number(finalRes[name.toLowerCase()]) : (gearTotals[`${name.toLowerCase()}Res`] + gearTotals.allRes);
          return val < 0;
        });
        if (severeNeg.length) {
          needs.push(`${severeNeg.join("/")} resistance is negative. Look for a modest resist roll on rings/belt for Act 2, but prioritize weapon flat damage and life.`);
        }
      } else {
        needs.push(`Look for ${lowRes.join("/")} resistance on armor or jewelry to reach ~${targetInfo.target}% for ${targetInfo.stageName}.`);
      }
    }
  }

  if (equippedRows.length && (gearTotals.life || 0) < (isEarly ? 20 : isLate ? 120 : 60)) {
    needs.push("Look for more +maximum Life on armor, belt, rings, and amulet.");
  }

  const focus = profile.focus || inferBuildFocus(profile.name);
  if (focus.quarterstaff) {
    const weaponRow = rows.find(r => r.slot === "weapon" && r.entry);
    const weaponScore = weaponRow?.entry?.scored?.totalScore ?? 0;
    if (weaponScore > 0 && weaponScore < 50) {
      needs.push(`Quarterstaff score is only +${weaponScore}. The weapon is one of the weaker functional parts of your setup—if a better staff drops with flat damage and attack speed, that could be a huge upgrade.`);
    }
  }

  const totalFlatDamage = (gearTotals.addedColdAvg || 0) + (gearTotals.addedPhysicalAvg || 0) + (gearTotals.addedLightningAvg || 0) + (gearTotals.addedFireAvg || 0);
  if (equippedRows.length && totalFlatDamage < (isEarly ? 4 : isLate ? 18 : 9)) {
    if (focus.quarterstaff) {
      needs.push("Add more flat physical, lightning, or cold damage to attacks on your quarterstaff, rings, or gloves.");
    } else if (focus.bow) {
      needs.push("Add more flat elemental or physical damage to attacks on weapon, quiver, rings, or gloves.");
    } else if (focus.unarmed) {
      needs.push("Add more flat damage to attacks on rings, amulet, and gloves.");
    } else {
      needs.push("Add more flat physical or elemental damage to attacks on weapon, rings, or gloves.");
    }
  }

  if (equippedRows.length) {
    if (gearTotals.attackSpeed <= 0) {
      const speedSlots = focus.bow ? "gloves, weapon, or quiver" : focus.quarterstaff ? "quarterstaff and gloves" : focus.unarmed ? "gloves" : "weapon and gloves";
      needs.push(`Look for attack speed on ${speedSlots} to improve attack responsiveness.`);
    }
    if ((isMid || isLate) && focus.bow && (gearTotals.bowSkillDamage + gearTotals.projectileDamage <= 0)) {
      needs.push("Bow skill damage or projectile damage would improve build synergy.");
    }
  }

  if (!needs.length) needs.push("No urgent stat gap detected. Your next upgrade can focus on replacing the lowest-scoring slot.");
  return [...new Set(needs)].slice(0, 8);
}

function buildShoppingList(profile, stageKey, rows, playerLevel = 1) {
  const stageData = profile.stages?.[stageKey]?.data;
  const guide = stageData?.prioritySlots || {};
  const focus = profile.focus || inferBuildFocus(profile.name);
  const isBowBuild = focus.bow || /frost|bow|ice shot|projectile/i.test(profile.name);
  const isQuarterstaff = focus.quarterstaff || /quarterstaff|monk/i.test(profile.name);
  const nonCrit = isNonCritStageContext(profile, stageKey);
  const lvl = Number(playerLevel) || getPlayerLevel() || 1;
  const isEarly = lvl <= 25;
  const hitChance = Number(window.currentPobbBuild?.stats?.hitChance);
  const needsAccuracy = Number.isFinite(hitChance) && hitChance < 88;

  let defaults;
  if (isQuarterstaff) {
    defaults = {
      weapon: ["Flat physical / lightning / fire damage to attacks", "Attack speed", "+% Melee or staff damage", ...(needsAccuracy ? ["Accuracy rating"] : ["Critical damage bonus"])],
      helmet: isEarly ? ["Life", "Attributes (Dex/Str/Int)", ...(needsAccuracy ? ["Accuracy rating"] : ["Light resistance"])] : ["Life", "Resistance", "Attributes", "Accuracy rating"],
      body: isEarly ? ["Life", "Armour / Evasion / ES base", "Light resistance"] : ["Life", "High defense base", "Resistance"],
      gloves: ["Attack speed", ...(needsAccuracy ? ["Accuracy rating"] : []), "Flat damage to attacks", "Life or resistance"],
      boots: ["Movement speed (15–20%+)", "Life", "Resistance"],
      ring: isEarly ? [ ...(needsAccuracy ? ["Accuracy rating"] : []), "Flat damage to attacks", "Life", "Modest resistance", "Attributes"] : ["Accuracy rating", "Flat damage to attacks", "Resistance", "Life"],
      amulet: isEarly ? ["Attributes for skills (Dex/Str/Int)", "Life", "Flat damage to attacks", "Accuracy rating"] : ["Attributes", "+Level to Melee / Strike Skills", "Life", "Resistance"],
      belt: isEarly ? ["Life", "Strength / attributes", "Modest resistance"] : ["Life", "Resistance", "Strength"],
    };
  } else if (isBowBuild) {
    defaults = {
      weapon: nonCrit ? ["Flat physical/cold damage to attacks", "+Level to Projectile Skills", "Attack speed", "Bow/projectile damage"] : ["+Level to Projectile Skills", "Cold damage to attacks", "Critical damage bonus", "Attack speed"],
      quiver: nonCrit ? ["Flat cold/physical damage to attacks", "+Level to Projectile Skills", "Attack speed", "Life or resistance"] : ["+Level to Projectile Skills", "Cold damage to attacks", "Attack speed", "Life or resistance"],
      helmet: isEarly ? ["Life", "Attributes if needed", "Light resistance"] : ["Life", "Resistance", "Attributes if gems/items are blocked"],
      body: isEarly ? ["Life", "Strong defensive base", "Light resistance"] : ["Life", "Strong defensive base", "Resistance"],
      gloves: ["Flat cold damage to attacks", "Attack speed", "Life or resistance"],
      boots: ["Movement speed (top leveling priority)", "Life", "Resistance"],
      ring: isEarly ? ["Flat cold/lightning damage to attacks", "Life", "Attributes", "Modest resistance"] : ["Flat cold or lightning damage to attacks", "Resistance", "Attributes"],
      amulet: isEarly ? ["Attributes for skills", "+Level to Projectile Skills", "Flat damage", "Life"] : ["+Level to Projectile Skills", "Attributes", "Resistance"],
      belt: isEarly ? ["Life", "Strength if needed", "Modest resistance"] : ["Life", "Resistance", "Strength if needed"],
    };
  } else {
    defaults = {
      weapon: ["Flat physical damage to attacks", "Attack speed", "Increased damage"],
      helmet: isEarly ? ["Life", "Attributes if needed", "Light resistance"] : ["Life", "Resistance", "Attributes if gems/items are blocked"],
      body: isEarly ? ["Life", "Defensive base", "Light resistance"] : ["Life", "Strong defensive base", "Resistance"],
      gloves: ["Attack speed", "Flat damage to attacks", "Life or resistance"],
      boots: ["Movement speed (top leveling priority)", "Life", "Resistance"],
      ring: isEarly ? ["Flat damage to attacks", "Life", "Attributes", "Modest resistance"] : ["Flat damage to attacks", "Resistance", "Attributes"],
      amulet: isEarly ? ["Attributes for skills", "Flat damage", "Life"] : ["Attributes", "Life/resistance", "Damage stats if requirements are solved"],
      belt: isEarly ? ["Life", "Strength/attributes", "Modest resistance"] : ["Life", "Resistance", "Strength/attributes if needed"],
    };
    if (focus.bow) {
      defaults.quiver = ["Flat physical/elemental damage to attacks", "Attack speed", "Life or resistance"];
    }
  }

  const allowedSlots = new Set(getAllowedSlotsForFocus(focus));
  const rawSlots = rows.map(row => row.slot).filter(slot => allowedSlots.has(slot) && (defaults[slot] || guide[slot]));
  const slots = [...new Set(rawSlots)];
  return slots.map(slot => {
    let items = mergeShoppingTerms([...(guide[slot] || []), ...(defaults[slot] || [])]);
    if (nonCrit) items = items.filter(item => !/critical|crit/i.test(item));
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
  const { profile, stage, playerLevel, playerAttrs, rows, missing, levelProblems, attributeProblems, pobbWarnings = [], weak, buildEnablingNotes = [], nextSteps, neededStats, gearTotals, resistanceGaps = [], fixSlots = [], shoppingList, count, equippedCount = 0, futureCount = 0 } = report;
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
    resistanceGaps.forEach(gap => {
      const targetNote = gap.target !== null && gap.toTarget > 0 ? `needs +${gap.toTarget}% to reach level target (${gap.target}%), ` : (gap.target !== null ? `meets target (${gap.target}%), ` : "");
      lines.push(`- ${gap.name}: ${gap.value}% (${gap.priority}); ${targetNote}+${gap.toCap}% to reach 75% cap.`);
    });
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
  if (buildEnablingNotes.length) {
    lines.push("Build-enabling gear (mechanic, not just stats — don't judge by raw score):");
    buildEnablingNotes.forEach(item => lines.push(`- ${item}`));
    lines.push("");
  }
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
  const userPreferences = String(userPreferencesInput?.value || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const buildKnowledge = window.BuildKnowledge?.create({
    profile,
    pobBuild: window.currentPobbBuild || null,
    stageKey: stageSelect.value,
    playerLevel: playerLevelInput.value,
    playerStr: playerStrInput.value,
    playerDex: playerDexInput.value,
    playerInt: playerIntInput.value,
    userPreferences,
  }) || null;
  return {
    version: 32,
    buildKey: buildSelect.value,
    league: document.getElementById("trade-league")?.value || "poe2/Forbidden Rites",
    startWithWindows: document.getElementById("startupCheckbox")?.checked || false,
    actContext: document.getElementById("actSelect")?.value || "auto",
    slot: slotSelect.value,
    stage: stageSelect.value,
    playerLevel: playerLevelInput.value,
    playerStr: playerStrInput.value,
    playerDex: playerDexInput.value,
    playerInt: playerIntInput.value,
    userPreferences,
    fullGearText: getCleanFullGearTextForSession(),
    currentItem: currentItem.value,
    newItem: newItem.value,
    mobalyticsUrlInput: mobalyticsUrlInput?.value || "",
    mobalyticsGuideText: mobalyticsGuideText.value,
    pobbInput: pobbInput?.value || "",
    pobbBuild: window.currentPobbBuild || null,
    buildKnowledge,
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

function deserializeProfile(raw) {
  if (!raw) return null;
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
  } catch { return null; }
}

function loadSession() {
  const raw = localStorage.getItem("poe2GearCoachSession");
  if (!raw) {
    setExportStatus("No saved session found in this browser.", "warn");
    return;
  }
  const data = JSON.parse(raw);
  if (data.league && document.getElementById("trade-league")) {
    document.getElementById("trade-league").value = data.league;
  }
  if (typeof data.startWithWindows === "boolean" && document.getElementById("startupCheckbox")) {
    document.getElementById("startupCheckbox").checked = data.startWithWindows;
  }
  if (data.mobalyticsUrlInput && mobalyticsUrlInput) {
    mobalyticsUrlInput.value = data.mobalyticsUrlInput;
  }
  if (data.mobalyticsGuideText) {
    mobalyticsGuideText.value = data.mobalyticsGuideText;
  }
  if (data.pobbInput && pobbInput) pobbInput.value = data.pobbInput;
  if (data.pobbBuild) { window.currentPobbBuild = data.pobbBuild; if (pobbSummary) pobbSummary.innerHTML = renderPobbSummary(data.pobbBuild); }
  
  if (data.importedProfile) {
    const profile = deserializeProfile(data.importedProfile);
    if (profile) {
      if (data.buildKey === "importedBuild" || (!data.buildKey && profile.imported)) {
        BUILD_PROFILES.importedBuild = profile;
      } else if (data.buildKey === "mobalyticsBuild") {
        BUILD_PROFILES.mobalyticsBuild = profile;
        if (mobalyticsSummary && profile.mobalytics) {
          mobalyticsSummary.innerHTML = renderMobalyticsSummary(profile, profile.mobalytics);
        }
      }
    }
  } else if (data.mobalyticsGuideText) {
    handleMobalyticsImport({ skipSave: true });
  }

  if (data.buildKey && BUILD_PROFILES[data.buildKey]) buildSelect.value = data.buildKey;
  updateSlotsAndStages();
  if (data.slot) slotSelect.value = data.slot;
  if (data.stage) stageSelect.value = data.stage;
  const actSel = document.getElementById("actSelect");
  if (actSel && data.actContext) actSel.value = data.actContext;
  playerLevelInput.value = data.playerLevel || 1;
  playerStrInput.value = data.playerStr || 0;
  playerDexInput.value = data.playerDex || 0;
  playerIntInput.value = data.playerInt || 0;
  if (userPreferencesInput) userPreferencesInput.value = Array.isArray(data.userPreferences) ? data.userPreferences.join("\n") : (data.userPreferences || "");
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
  // Items with a detected build-enabling mechanic (granted skill, reservation waiver,
  // status immunity, etc.) are excluded here — a low raw score on these is expected
  // and calling them "weak" would be actively wrong advice. They get their own
  // section below instead, with the mechanic explained rather than a bare number.
  const weak = equippedRows
    .filter(row => row.score !== null && !row.entry.scored.buildEnabling?.length)
    .sort((a, b) => (a.score / slotScoreCeiling(profile, a.slot, stageKey)) - (b.score / slotScoreCeiling(profile, b.slot, stageKey)))
    .slice(0, 4)
    .map(row => `${label(row.slot)}: ${row.entry.scored.item.name} scored ${row.score}. ${healthAdviceForSlot(row.slot, row.entry.scored, profile, stageKey)}`);
  if (!weak.length && futureRows.length) weak.push("No currently equippable pasted gear detected. Update player level/attributes or paste your actually equipped low-level items.");
  const buildEnablingNotes = equippedRows
    .filter(row => row.entry.scored.buildEnabling?.length)
    .map(row => {
      const stars = buildUtilityStars(row.entry.scored.buildEnabling);
      const reasons = row.entry.scored.buildEnabling.map(hit => hit.reason).join(" ");
      return `${label(row.slot)}: ${row.entry.scored.item.name} — Build utility ${renderUtilityStars(stars)} (raw affix score ${row.score}). ${reasons} Recommended: keep until you have another way to cover what this solves.`;
    });
  const gearTotals = aggregateGearTotals(equippedRows.map(row => row.entry));
  const neededStats = buildNeededStats({ rows, equippedRows, futureRows, gearTotals, requirementProblems, profile, stageKey, playerLevel, playerAttrs });
  const shoppingList = buildShoppingList(profile, stageKey, rows, playerLevel);
  const resistanceGaps = buildResistanceGapReport(window.currentPobbBuild, playerLevel);
  const fixSlots = buildFixSlotsReport(window.currentPobbBuild, rows, playerLevel, profile);
  const pobbWarnings = pobbWarningsForReport(window.currentPobbBuild, playerLevel);
  const nextSteps = [...pobbWarnings.slice(0, 2), ...buildNextSteps(rows, equippedRows, futureRows, requirementProblems, missing, profile, stageKey, playerLevel, playerAttrs)].slice(0, 6);

  // Authoritative Recommendation Engine 4-Decisions pipeline & 5-dimension evaluation
  const recEngine = typeof RecommendationEngine !== "undefined"
    ? RecommendationEngine
    : (typeof require === "function" ? require("./recommendation-engine.js") : null);

  const decisions = recEngine?.generateNextDecisions?.({
    pobBuild: window.currentPobbBuild,
    profile,
    activeStage: profile?.stages?.[stageKey]?.data,
    playerLevel,
    playerAttrs,
    equippedRows,
  }) || null;

  if (recEngine && decisions) {
    for (const row of rows) {
      if (row.entry?.scored?.item) {
        row.dimensions = recEngine.evaluateItemDimensions(row.entry.scored.item, row.slot, decisions.context);
      }
    }
  }

  window.lastHealthReport = { profile, stage, playerLevel, playerAttrs, rows, equippedRows, futureRows, missing, levelProblems, attributeProblems, requirementProblems, pobbWarnings, weak, buildEnablingNotes, nextSteps, neededStats, gearTotals, resistanceGaps, fixSlots, shoppingList, decisions, count: items.length, equippedCount: equippedRows.length, futureCount: futureRows.length };

  healthResults.classList.remove("hidden");
  healthResults.innerHTML = renderHealthReport(window.lastHealthReport);
}

function healthAdviceForSlot(slot, scored, profile = null) {
  const defScore = scored.scores.defense || 0;
  const resScore = scored.scores.resistance || 0;
  const dmgScore = (scored.scores.damage || 0) + (scored.scores.synergy || 0);
  const mobScore = scored.scores.mobility || 0;
  const totalScore = scored.total ?? scored.totalScore ?? 0;
  const focus = profile?.focus || inferBuildFocus(profile?.name || "");

  // Zero-score slot handling
  if (totalScore <= 0) {
    if (slot === "amulet") return "Zero score amulet — this is an empty/dead slot opportunity! Equip even a basic magic or rare amulet to gain +Life, needed attributes (Dex/Str/Int), or a resistance.";
    if (slot === "belt") return "Zero score belt — an easy defensive upgrade! Equip any basic belt with +Life, Strength, and resistances to immediately pad your survivability.";
    if (slot === "ring") return "Zero score ring — equip a rare or magic ring with flat attack damage, life, or resistances to fix stat gaps.";
    return `Zero-score ${label(slot)} — equip any basic magic or rare item with life, attributes, or resistances to instantly upgrade this slot.`;
  }

  if (slot === "ring") return "Rings can carry 2 resistance mods + flat damage + attributes — the best slot for fixing multiple gaps at once.";
  if (slot === "belt") return "Belts carry life + resistance + strength simultaneously. A strong belt addresses 3 stat gaps in one upgrade.";
  if (slot === "boots") {
    if (mobScore <= 0) return "No movement speed detected — this is a top priority. Boots can hold movement speed + life + resistance all at once.";
    const itemRaw = scored?.item?.raw || scored?.item?.text || scored?.raw || "";
    const msMatch = String(itemRaw).match(/(\d+)%\s+increased\s+Movement\s+Speed/i);
    const ms = msMatch ? parseInt(msMatch[1], 10) : 0;
    if (ms > 0 && ms <= 10) return "10% movement speed is better than before, but upgrading to 15–20%+ will make campaign navigation much faster. Look for boots with higher speed, life, and resists.";
    if (resScore <= 0) return "Good mobility. Look for resistance on boots too — they can carry 2 resistances + movement speed.";
    return "Solid boots. Upgrade when you find one with 15–20%+ movement speed or more life.";
  }
  if (slot === "amulet") return resScore <= 0 ? "Amulets can fix attributes and add resistance — look for attributes + 1–2 resists." : "Good amulet. Upgrade path: higher attributes or capped resistance.";
  if (slot === "body" && defScore <= 0 && resScore <= 0) return "Body armour is a primary defensive slot — should carry life + 2 elemental resistances.";
  if (slot === "helmet" && defScore <= 0 && resScore <= 0) return "Helmet should provide life + at least one resistance. It is also a good attribute-fix slot.";
  if (slot === "weapon") {
    if (focus.quarterstaff && totalScore < 50) {
      return `Quarterstaff score is only +${totalScore} — the weapon is one of the weaker functional parts of your setup. If a better staff drops with meaningful flat physical/elemental damage and attack speed, that could be a huge upgrade.`;
    }
    if (dmgScore < 15) {
      return focus.bow
        ? "Upgrade weapon for flat cold/physical damage, attack speed, or bow scaling."
        : "Upgrade weapon for flat damage, attack speed, or melee scaling.";
    }
  }
  if (slot === "quiver" && dmgScore < 15) return "Upgrade quiver for flat cold/physical damage, attack speed, or projectile scaling. Quiver sets your damage ceiling alongside your bow.";
  if (slot === "gloves" && dmgScore < 15) return "Gloves can carry flat attack damage + attack speed — offense and resistance fixes in one slot.";

  const issues = [];
  if (defScore <= 0 && ["helmet", "body", "gloves", "boots", "belt"].includes(slot)) issues.push("look for life/defense");
  if (resScore <= 0 && !["weapon", "quiver"].includes(slot)) {
    const freeTarget = focus.quarterstaff ? "quarterstaff" : focus.bow ? "weapon and quiver" : "weapon";
    issues.push(`add resistance to free ${freeTarget} for pure damage`);
  }
  return issues.length ? `Improve: ${issues.join("; ")}.` : "Looks usable for now — replace only when a clear upgrade appears.";
}

function buildNextSteps(rows, equippedRows = [], futureRows = [], requirementProblems, missing, profile, stageKey, playerLevel = 1, playerAttrs = { str: 0, dex: 0, int: 0 }) {
  const steps = [];
  const stageData = profile.stages?.[stageKey]?.data;
  const prioritySlots = stageData?.prioritySlots || {};
  const effectiveAct = getEffectiveActContext(playerLevel);
  const isEndgame = effectiveAct === "maps" || playerLevel >= 65;
  const isActEarly = effectiveAct === "act1" || effectiveAct === "act2" || playerLevel <= 25;
  const focus = profile?.focus || inferBuildFocus(profile?.name || "");

  const hitChance = Number(window.currentPobbBuild?.stats?.hitChance);
  if (Number.isFinite(hitChance) && hitChance > 0 && hitChance <= 75) {
    steps.push(`Hit chance at ${hitChance}% is a serious problem (over ${100 - hitChance}% of your attacks miss!). Prioritize Accuracy Rating on gloves, rings, helmet, or passive tree—this hurts your damage more than raw weapon stats.`);
  }

  if (futureRows.length && equippedRows.length === 0 && playerLevel <= 1 && playerAttrs.str === 0 && playerAttrs.dex === 0 && playerAttrs.int === 0) {
    steps.push("Enter your real player level and Str/Dex/Int, then refresh. The current report is treating every pasted item as future gear.");
  }
  if (requirementProblems.length) {
    const hasNearReq = rows.some(r => r.reqProblem && Number(r.entry?.scored.item.requiredLevel || 0) <= playerLevel + 5);
    if (hasNearReq) {
      steps.push("Fix level or attribute requirements on current/near-level items before treating them as usable upgrades.");
    }
  }

  // Monk Level 22 milestone check
  if (playerLevel >= 18 && playerLevel <= 21 && (focus.quarterstaff || /monk/i.test(profile.name))) {
    steps.push(`Level 22 Transition ahead: You are only ${22 - playerLevel} level(s) away from unlocking Storm Wave and Siphoning Strike. Keep current gear stable and avoid major respecs until that milestone.`);
  }

  if (isEndgame) {
    steps.push("Maps / Endgame: Elemental resistance caps (75%) are the top survival priority. Cap resists on rings, belt, and armor before chasing marginal damage.");
  } else if (isActEarly) {
    const weaponName = focus.quarterstaff ? "quarterstaff flat damage" : focus.unarmed ? "unarmed flat damage" : "weapon flat damage";
    steps.push(`Act ${playerLevel <= 15 ? "1" : "2"} leveling: prioritize ${weaponName}, attack/cast speed, movement speed boots, and life. Resistances only need to be modestly positive (~20–25%).`);
  } else {
    steps.push(`Campaign progress (Level ${playerLevel}): begin building elemental resistances towards ~45–60% on jewelry/armor while keeping weapon damage scaling.`);
  }

  const activeRows = equippedRows.length ? equippedRows : rows.filter(row => row.entry && !row.reqProblem);

  // Check for zero-score slots
  const zeroScoreRows = activeRows.filter(row => row.entry && row.score !== null && row.score <= 0);
  if (zeroScoreRows.length) {
    const zeroSlots = zeroScoreRows.map(r => label(r.slot)).join(", ");
    steps.push(`Equip basic upgrades in zero-score slot(s) (${zeroSlots}). Even basic magic/rare items with Life, attributes, or a resist will immediately boost survivability.`);
  }

  // Quarterstaff bottleneck check
  if (focus.quarterstaff) {
    const weaponRow = activeRows.find(r => r.slot === "weapon" && r.entry);
    if (weaponRow && weaponRow.score !== null && weaponRow.score < 50) {
      steps.push(`Your quarterstaff score is only +${weaponRow.score}—it is one of the weaker functional parts of your setup. If a better staff drops with meaningful flat damage / attack speed, that could be a huge upgrade.`);
    }
  }

  const boot = activeRows.find(row => row.slot === "boots" && row.entry && (row.entry.scored.scores.mobility || 0) <= 0);
  if (boot) steps.push(prioritySlots.boots?.[0] || "Find boots with movement speed first; it is one of the biggest leveling quality-of-life upgrades.");
  const hasAttributeRequirementProblem = (requirementProblems || []).some(text => /Strength|Dexterity|Intelligence/i.test(text));
  const attrsLookUnset = playerAttrs.str === 0 && playerAttrs.dex === 0 && playerAttrs.int === 0;
  const attrWeak = activeRows.find(row => row.entry && (row.entry.scored.scores.attributes || 0) <= 0 && ["ring", "amulet", "helmet"].includes(row.slot));
  if (attrWeak && (hasAttributeRequirementProblem || attrsLookUnset)) steps.push("Use jewelry or helmet slots to fix Str/Dex/Int problems before replacing good damage gear.");
  const resistWeak = activeRows.find(row => row.entry && (row.entry.scored.scores.resistance || 0) <= 0 && !["weapon", "quiver"].includes(row.slot));
  if (resistWeak && !isActEarly) {
    const weaponLabel = focus.quarterstaff ? "quarterstaff" : focus.bow ? "weapon and quiver" : "weapon";
    steps.push(`Add resistances on armor/jewelry slots so ${weaponLabel} can stay focused on damage.`);
  }
  const damageWeak = activeRows.find(row => row.entry && ["weapon", "quiver", "gloves"].includes(row.slot) && (row.entry.scored.scores.damage + row.entry.scored.scores.synergy) < 18);
  if (damageWeak && (!focus.quarterstaff || damageWeak.slot !== "weapon")) {
    const guideNote = prioritySlots[damageWeak.slot]?.[0];
    const isBowBuild2 = focus.bow || /frost|bow|ice shot|crossbow|projectile/i.test(profile.name);
    const nonCrit = isNonCritStageContext(profile, stageKey);
    const damageUpgradeHint = isBowBuild2
      ? (nonCrit
        ? `Upgrade ${label(damageWeak.slot)} for flat physical/cold damage to attacks, attack speed, or +Level to Projectile Skills.`
        : `Upgrade ${label(damageWeak.slot)} for +Level to Projectile Skills, cold damage to attacks, or critical stats.`)
      : `Upgrade ${label(damageWeak.slot)} for better flat damage, attack speed, or damage scaling.`;
    steps.push(guideNote ? `${label(damageWeak.slot)}: ${guideNote}` : damageUpgradeHint);
  }
  const guidePriority = Object.entries(prioritySlots).find(([slot, notes]) => notes.length && activeRows.some(row => row.slot === slot && row.entry && row.score !== null && row.score < 18));
  if (guidePriority) steps.push(`${label(guidePriority[0])}: ${guidePriority[1][0]}`);
  if (missing.length) steps.push("Paste the missing slots so the weakest-slot ranking is more accurate.");
  return [...new Set(steps)].slice(0, 6);
}


function buildResistanceGapReport(build, playerLevel = 1) {
  const stats = build?.stats || {};
  const res = stats.resistances || {};
  const targetInfo = getLevelResistTarget(playerLevel);
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
    const isChaos = name === "Chaos";
    const toZero = Math.max(0, 0 - n);
    const toFifty = Math.max(0, 50 - n);
    const toCap = Math.max(0, 75 - n);
    const toTarget = Math.max(0, targetInfo.target - n);
    let priority = "OK";
    let cls = "";

    if (isChaos) {
      if (targetInfo.isEndgame) {
        if (n < -20) { priority = "Low (Endgame)"; cls = "warn"; }
        else if (n < 0) { priority = "Improve later"; cls = ""; }
        else if (n >= 75) { priority = "Capped ✓"; cls = "capped"; }
        else { priority = "Good ✓"; cls = "capped"; }
      } else {
        if (n >= targetInfo.target) { priority = "Great bonus ✓"; cls = "capped"; }
        else if (n >= 0) { priority = "Bonus ✓"; cls = "capped"; }
        else { priority = "Normal for campaign"; cls = ""; }
      }
    } else {
      if (targetInfo.isEndgame) {
        if (n < 0) { priority = "Critical"; cls = "urgent"; }
        else if (n < targetInfo.minAcceptable) { priority = "Urgent"; cls = "urgent"; }
        else if (n < 75) { priority = "Needs cap"; cls = "warn"; }
        else { priority = "Capped ✓"; cls = "capped"; }
      } else {
        if (n < targetInfo.criticalThreshold) {
          priority = "Very Low";
          cls = "urgent";
        } else if (n < targetInfo.minAcceptable) {
          priority = "Low";
          cls = "warn";
        } else if (n < targetInfo.target) {
          priority = `OK for ${targetInfo.stageName}`;
          cls = "";
        } else if (n >= 75) {
          priority = "Capped ✓";
          cls = "capped";
        } else {
          priority = `Good for ${targetInfo.stageName} ✓`;
          cls = "capped";
        }
      }
    }

    rows.push({
      name,
      value: n,
      target: isChaos && !targetInfo.isEndgame ? null : targetInfo.target,
      toZero,
      toFifty,
      toTarget: isChaos && !targetInfo.isEndgame ? 0 : toTarget,
      toCap,
      priority,
      cls,
      isChaos,
    });
  }
  return rows.sort((a, b) => a.value - b.value);
}

function renderResistanceGaps(gaps, playerLevel = 1) {
  if (!gaps || !gaps.length) return `<p class="subtitle small">No final resistance data imported yet. Import a pobb.in build to see resistance gaps.</p>`;
  const targetInfo = getLevelResistTarget(playerLevel);
  const rows = gaps.map(gap => {
    const cls = gap.cls || (gap.value < 0 ? "urgent" : gap.value < 25 ? "warn" : gap.value >= 75 ? "capped" : "");
    const badge = gap.priority;
    const targetCell = gap.isChaos && !targetInfo.isEndgame
      ? `<span class="res-muted">—</span>`
      : (gap.toTarget > 0 ? `+${gap.toTarget}%` : '<span class="res-capped">✓</span>');
    const capCell = gap.toCap > 0 ? `+${gap.toCap}%` : '<span class="res-capped">✓</span>';
    const stageTargetDisplay = gap.isChaos && !targetInfo.isEndgame ? "—" : `${gap.target}%`;
    return `<tr class="res-row-${cls}">
      <td class="res-name">${escapeHtml(gap.name)}</td>
      <td class="res-val ${cls}">${gap.value}%</td>
      <td>${stageTargetDisplay}</td>
      <td>${targetCell}</td>
      <td>${capCell}</td>
      <td><span class="res-priority ${cls}">${escapeHtml(badge)}</span></td>
    </tr>`;
  }).join("");
  return `
    <p class="mini-note" style="margin-bottom: 8px;">
      Level ${playerLevel} (${targetInfo.stageName}) elemental resist target: <strong>${targetInfo.target}%</strong>.
      ${targetInfo.isEndgame ? "In endgame maps, 75% cap is critical for survival." : "75% cap is only required in endgame maps (lvl 65+); during the campaign, meeting the stage target is sufficient."}
    </p>
    <table class="resist-table">
      <thead><tr><th>Resistance</th><th>Current</th><th>Stage Target</th><th>To Target</th><th>To 75% Cap</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function buildFixSlotsReport(build, rows, playerLevel = 1, profile = null) {
  const targetInfo = getLevelResistTarget(playerLevel);
  const gaps = buildResistanceGapReport(build, playerLevel).filter(gap => !gap.isChaos && gap.value < (targetInfo.isEndgame ? 75 : targetInfo.target));
  const hasRingRows = rows.filter(row => row.slot === "ring" && row.entry).length;
  const isEarly = playerLevel <= 25;
  const focus = profile?.focus || inferBuildFocus(profile?.name || "");
  const weaponLabel = focus.quarterstaff ? "Quarterstaff" : focus.unarmed ? "Gloves & Jewelry" : focus.bow ? "Weapon & Quiver" : "Weapon";
  const weaponTarget = focus.quarterstaff ? "quarterstaff" : focus.unarmed ? "unarmed scaling" : focus.bow ? "weapon and quiver" : "weapon";

  if (!gaps.length) {
    if (isEarly) {
      return [
        `Elemental resistances comfortably meet or exceed the ${targetInfo.stageName} target (${targetInfo.target}%).`,
        `${weaponLabel}: keep focus on flat added damage and attack speed.`,
        "Boots: prioritize movement speed (10–20%+) to move through zones much faster.",
        "Armor / Helm / Belt / Gloves: look for maximum life and attributes to equip better gems.",
      ];
    }
    return [
      `Elemental resistances meet your ${targetInfo.stageName} target (${targetInfo.target}%).`,
      "Work on chaos resistance and maximum life on jewelry and armor.",
      `Keep ${weaponTarget} focused on pure damage scaling.`,
    ];
  }

  const urgentGaps = gaps.filter(gap => gap.value < targetInfo.criticalThreshold);
  const lowGaps = gaps.filter(gap => gap.value < targetInfo.minAcceptable);
  const uncapped = gaps.filter(gap => gap.value >= targetInfo.minAcceptable);
  const main = (urgentGaps.length ? urgentGaps : lowGaps.length ? lowGaps : uncapped).slice(0, 3).map(gap => gap.name);
  const secondary = gaps.filter(gap => !main.includes(gap.name)).map(gap => gap.name);
  const resText = main.join(main.length > 1 ? " and " : "");
  const ringResText = gaps.map(gap => gap.name).join("/");

  const suggestions = [];
  if (targetInfo.isEndgame) {
    suggestions.push(
      urgentGaps.length || lowGaps.length
        ? `${resText} resistance ${main.length > 1 ? "are" : "is"} the main survival gap in maps. Fix ${main.length > 1 ? "them" : "it"} before chasing small damage upgrades.`
        : `${resText} resistance ${main.length > 1 ? "are" : "is"} close to cap (${targetInfo.target}%). Add benchcrafts or small upgrades when convenient.`
    );
  } else if (urgentGaps.length) {
    suggestions.push(
      `${resText} resistance is critically low (${urgentGaps.map(g => `${g.name} ${g.value}%`).join(", ")}). Pick up a resistance ring or craft small resist so bosses don't one-shot you.`
    );
  } else {
    suggestions.push(
      `${resText} resistance is slightly below your ${targetInfo.stageName} target (${targetInfo.target}%). Keep an eye out for a ring or craft when convenient, but do not sacrifice ${weaponTarget} damage.`
    );
  }

  if (secondary.length) {
    suggestions.push(`${secondary.join("/")} resistance also needs improvement eventually, but is less urgent than ${resText}.`);
  }

  suggestions.push(`${hasRingRows > 1 ? "Ring 1 / Ring 2" : "Rings"}: best slot to pick up ${ringResText} resistance without touching ${weaponTarget} damage.`);
  if (isEarly) {
    suggestions.push("Boots: top priority is movement speed (10–20%+), with life or resists as a secondary bonus.");
    suggestions.push("Belt: look for life and Strength/attributes.");
    suggestions.push(`${weaponLabel}: keep 100% focused on flat damage and attack speed.`);
  } else {
    suggestions.push(`Belt: look for life plus ${main.join(" or ")} resistance.`);
    suggestions.push("Body Armor / Helmet / Gloves: good defensive slots for life and resistances.");
    suggestions.push(`Keep ${weaponTarget} mostly damage-focused unless a replacement also fixes resists without losing much damage.`);
  }

  return suggestions;
}

function splitUpgradesToBuckets(steps) {
  const survivalPattern = /resist|life|eHP|defense|armor|cap|shield|attribute|str|dex|int|movement speed|boot|fix|require|problem/i;
  const damagePattern = /damage|attack speed|cold|physical|projectile|bow|synergy|dps|crit|weapon|quiver|flat/i;
  const survival = [];
  const damage = [];
  for (const step of steps) {
    const s = survivalPattern.test(step);
    const d = damagePattern.test(step);
    if (s && !d) survival.push(step);
    else if (d && !s) damage.push(step);
    else survival.push(step); // default to survival when ambiguous
  }
  return { survival, damage };
}

function renderFourDecisionsCard(decisions) {
  if (!decisions) return "";
  const q1 = decisions.q1_currentBuildAndStage;
  const q2 = decisions.q2_topProblems || [];
  const q3 = decisions.q3_slotFixes || [];
  const q4 = decisions.q4_ignoreRightNow || [];

  const q2Html = q2.length
    ? q2.map(p => {
        const badgeCls = p.urgency === "critical" ? "urgent" : p.urgency === "high" ? "warn" : "capped";
        return `<li style="margin-bottom: 6px;">
          <span class="res-priority ${badgeCls}" style="margin-right: 6px; font-size: 10px; padding: 2px 6px;">${escapeHtml(p.urgency.toUpperCase())}</span>
          <strong>${escapeHtml(p.title)}:</strong> ${escapeHtml(p.detail)}
        </li>`;
      }).join("")
    : "<li>No urgent problems detected for your current stage.</li>";

  const q3Html = q3.length
    ? q3.map(s => {
        return `<li style="margin-bottom: 6px;">
          <strong>${escapeHtml(s.displayName)}:</strong> ${escapeHtml(s.recommendation)}
        </li>`;
      }).join("")
    : "<li>No specific slot replacement needed right now.</li>";

  const q4Html = q4.length
    ? q4.map(item => `<li style="margin-bottom: 6px; color: #a0a0a0;">${escapeHtml(item)}</li>`).join("")
    : "<li>No special ignores for this stage.</li>";

  return `
    <article class="panel health-card four-decisions-card" style="margin-top: 16px; border: 1px solid var(--accent, #78a6ff); background: rgba(120, 166, 255, 0.05); padding: 14px 16px;">
      <h3 style="color: var(--accent, #78a6ff); margin-bottom: 12px; font-size: 15px;">🧭 Coach's 4 Next Decisions</h3>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="decision-block">
          <div style="font-weight: 700; color: var(--poe-gold, #af8c54); margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">1. What build & stage am I actually on?</div>
          <div style="font-size: 13px; line-height: 1.45;">${escapeHtml(q1.summary)} <span class="tag" style="background: rgba(200,162,97,0.15); border: 1px solid var(--poe-border);">${escapeHtml(q1.weapon)}</span> <span class="tag" style="background: rgba(120,166,255,0.15); border: 1px solid rgba(120,166,255,0.4);">${escapeHtml(q1.stage)}</span></div>
        </div>
        <div class="decision-block">
          <div style="font-weight: 700; color: var(--bad, #ff8b8b); margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">2. What are my 2–3 biggest current problems?</div>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.45;">${q2Html}</ul>
        </div>
        <div class="decision-block">
          <div style="font-weight: 700; color: var(--good, #78d49a); margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">3. Which equipped slots can realistically fix those problems?</div>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.45;">${q3Html}</ul>
        </div>
        <div class="decision-block">
          <div style="font-weight: 700; color: #a0a0a0; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">4. What should I ignore right now?</div>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.45;">${q4Html}</ul>
        </div>
      </div>
    </article>
  `;
}

function renderHealthReport({ profile, stage, playerLevel, playerAttrs, rows, missing, levelProblems, attributeProblems, requirementProblems, pobbWarnings = [], weak, buildEnablingNotes = [], nextSteps, neededStats = [], gearTotals = {}, resistanceGaps = [], fixSlots = [], shoppingList = [], decisions = null, count, equippedCount = 0, futureCount = 0 }) {
  const stageLabel = stage?.label || stageSelect.value;
  const rowHtml = rows.map(row => {
    const name = row.entry?.scored.item.name || "—";
    const score = row.score === null ? "—" : formatScore(row.score);
    const req = summarizeRequirements(row.entry?.scored.item);
    const guide = row.guideTarget?.name || "—";
    const rowClass = row.reqProblem ? " class=\"requirement-warning\"" : "";
    const dim = row.dimensions;
    const urgencyBadge = dim ? `<span class="tag ${dim.replaceUrgency === 'Immediate Fix' ? 'urgent' : dim.replaceUrgency === 'Upgrade Priority' ? 'warn' : 'capped'}" style="margin-left:4px; font-size:10px;">${escapeHtml(dim.replaceUrgency)}</span>` : "";
    const fitBadge = dim && dim.stageFit !== "Acceptable" ? `<span class="tag" style="margin-left:4px; font-size:10px;">${escapeHtml(dim.stageFit)} Fit</span>` : "";
    return `<tr${rowClass}><td>${escapeHtml(row.displaySlot || label(row.slot))}</td><td>${escapeHtml(name)}</td><td>${escapeHtml(score)}${urgencyBadge}${fitBadge}</td><td>${escapeHtml(req)}</td><td>${escapeHtml(guide)}</td></tr>`;
  }).join("");

  return `
    <div class="muted-box"><strong>Build health report</strong><br>${count} item(s) parsed — ${equippedCount} counted as currently equippable, ${futureCount} treated as future/blocked. Build: ${escapeHtml(profile.name)}. Stage: ${escapeHtml(stageLabel)}. Player level: ${playerLevel}. Attributes: ${playerAttrs.str} Str / ${playerAttrs.dex} Dex / ${playerAttrs.int} Int.</div>
    ${renderFourDecisionsCard(decisions)}
    ${window.currentPobbBuild ? `<article class="panel health-card" style="margin-top: 16px;"><h3>pobb.in current build</h3>${renderPobbMiniCard(window.currentPobbBuild)}</article>` : ""}
    ${buildEnablingNotes.length ? `<article class="panel health-card" style="margin-top: 16px;"><h3>Build-enabling gear</h3><p class="mini-note">These items carry a mechanic (granted skill, reservation waiver, status immunity, etc.) instead of a plain stat roll. Don't judge them by raw score alone.</p>${renderList(buildEnablingNotes, "warn", "None detected.")}</article>` : ""}
    ${resistanceGaps.length ? `<article class="panel health-card" style="margin-top: 16px;"><h3>Resistance gap calculator</h3><p class="mini-note">Based on pobb.in final character stats, not just parsed gear affixes.</p>${renderResistanceGaps(resistanceGaps, playerLevel)}</article>` : ""}
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
        <h3>Weakest slots</h3>
        ${renderList(weak, "bad", "Paste more gear to rank weak slots.")}
      </article>
      <article class="panel health-card">
        <h3>Warnings</h3>
        ${renderList([...pobbWarnings, ...levelProblems, ...attributeProblems, ...missing], "warn", "No level, attribute, resistance, or missing-slot warnings from this pass.")}
      </article>
    </div>
    ${(() => {
      const { survival, damage } = splitUpgradesToBuckets(nextSteps);
      const isEarly = playerLevel <= 25;
      const isEndgame = playerLevel >= 65;
      const surviveBadge = isEndgame ? "cap resists first" : isEarly ? "comfort & life" : "vital defense";
      const damageBadge = isEarly ? "top priority for campaign" : isEndgame ? "after resists improve" : "progression balance";
      const damageFallback = isEarly
        ? "Upgrade weapon flat damage and attack speed for faster campaign clearing."
        : isEndgame
          ? "Focus on reaching 75% resists first, then return here for damage advice."
          : "Keep balancing offense and defense as you progress through the acts.";
      return `<div class="upgrade-split-grid" style="margin-top:16px">
        <article class="panel health-card survival-card">
          <h3>Survival upgrades <span class="upgrade-label-badge survive">${escapeHtml(surviveBadge)}</span></h3>
          ${renderList(survival.length ? survival : ["No urgent survival upgrades detected."], "warn", "")}
        </article>
        <article class="panel health-card damage-card">
          <h3>Damage upgrades <span class="upgrade-label-badge damage">${escapeHtml(damageBadge)}</span></h3>
          ${renderList(damage.length ? damage : [damageFallback], "warn", "")}
        </article>
      </div>`;
    })()}
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




function pobbWarningsForReport(build, playerLevel = 1) {
  const stats = build?.stats || {};
  const res = stats.resistances || {};
  const warnings = [];
  const level = Number(playerLevel || stats.level || 1);
  const targetInfo = getLevelResistTarget(level);

  const addResWarning = (name, value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    if (name === "Chaos") {
      if (targetInfo.isEndgame && n < -30) {
        warnings.push(`Chaos resistance is deeply negative (${n}%). In endgame maps, aim for at least 0% to +30% to mitigate sudden chaos hits.`);
      }
      // Never warn about negative chaos during campaign leveling
      return;
    }

    if (targetInfo.isEndgame) {
      if (n < 0) {
        warnings.push(`${name} resistance is negative (${n}%). In maps, this causes lethal incoming damage. Prioritize capping on jewelry or benchcraft.`);
      } else if (n < targetInfo.minAcceptable) {
        warnings.push(`${name} resistance is well below 75% cap (${n}%). Upgrade jewelry or armor to improve elemental defense.`);
      } else if (n < 75) {
        warnings.push(`${name} resistance is close to cap (${n}%). Finish capping to 75% with a benchcraft or small upgrade.`);
      }
    } else {
      // Leveling / Campaign
      if (n < targetInfo.criticalThreshold) {
        warnings.push(`${name} resistance is very low for ${targetInfo.stageName} (${n}%). Pick up a ruby/topaz/sapphire ring or benchcraft to avoid spike damage.`);
      } else if (n < targetInfo.minAcceptable) {
        warnings.push(`${name} resistance is below 0% (${n}%). Aim for around ${targetInfo.target}% for ${targetInfo.stageName} comfort when convenient.`);
      }
    }
  };

  addResWarning("Fire", res.fire);
  addResWarning("Cold", res.cold);
  addResWarning("Lightning", res.lightning);
  addResWarning("Chaos", res.chaos);

  const life = Number(stats.life || 0);
  const ehp = Number(stats.eHP || 0);
  if (level >= 65 && life > 0 && life < 1500) warnings.push(`Life looks low for endgame level ${level} (${life}). Prioritize life on armor, belt, and jewelry.`);
  else if (level >= 40 && level < 65 && life > 0 && life < 850) warnings.push(`Life is a little light for level ${level} (${life}). Keep upgrading life on defensive/jewelry slots.`);
  else if (level >= 25 && level < 40 && life > 0 && life < 400) warnings.push(`Life looks low for level ${level} (${life}). Look for +Life rolls on belt and armor.`);
  else if (level >= 18 && level < 25 && life > 0 && life < 500) warnings.push(`Life at ${life} is okay-ish for level ${level}, but lacks defensive padding for Act 2. Look for +Life on belt, rings, and body armor.`);
  else if (level >= 15 && level < 18 && life > 0 && life < 200) warnings.push(`Life looks low for level ${level} (${life}). Look for +Life on your belt, rings, or body armor.`);

  if (level >= 50 && ehp > 0 && ehp < 1500) warnings.push(`eHP is modest for level ${level} (${ehp}). Improve resistances and add life before focusing only on damage.`);

  const hit = Number(stats.hitChance || 0);
  if (hit > 0 && hit <= 75) {
    warnings.push(`Hit chance is critically low (${hit}%). Over ${100 - hit}% of your attacks miss! Accuracy rating is hurting your damage much more than gear damage rolls.`);
  } else if (hit > 0 && hit < 90) {
    warnings.push(`Hit chance is low (${hit}%). Accuracy or level difference may be hurting damage consistency.`);
  }

  const gemsLower = (build.gems || []).join(" ").toLowerCase();
  const looksMinion = /skeleton|skeletal|zombie|spectre|golem|raging spirit|summon|minion/.test(gemsLower);
  const spirit = Number(stats.spirit);
  if (looksMinion) {
    if (Number.isFinite(spirit) && spirit > 0) {
      warnings.push(`Spirit: ${spirit}. This is your minion/aura budget — every extra Spirit lets you summon another minion or run another aura. Prioritize +Spirit on gear/tree if you're capped out on minions.`);
    } else {
      warnings.push("This looks like a minion/aura build, but Spirit wasn't found on the pobb.in page. Spirit is your minion/aura budget — worth checking manually in-game.");
    }
  }

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
      <div class="total-pill"><span>Spirit</span><strong>${escapeHtml(stats.spirit ?? "—")}</strong></div>
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

if (typeof window !== "undefined" && typeof document !== "undefined" && document.querySelector && document.querySelector("#buildSelect")) {
  init();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BUILD_PROFILES,
    inferBuildFocus,
    getAllowedSlotsForFocus,
    buildImportedRules,
    defaultQuarterstaffRules,
    defaultQuarterstaffSlotRules,
    convertGuideItemToPasteText,
    buildNeededStats,
    buildShoppingList,
    healthAdviceForSlot,
    buildNextSteps,
    buildFixSlotsReport,
    pobbWarningsForReport,
    getLevelResistTarget,
  };
}
