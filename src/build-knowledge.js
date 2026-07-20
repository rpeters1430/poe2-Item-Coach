/*
 * Shared build knowledge compiler.
 *
 * Mobalytics describes the creator's intent. PoB/poe.ninja describes the
 * character as it exists now. This module keeps those sources separate and
 * produces a compact, provenance-aware context for scoring and AI coaching.
 */
(function initBuildKnowledge(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.BuildKnowledge = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function buildKnowledgeFactory() {
  "use strict";

  function uniqueStrings(values, limit = 100) {
    const seen = new Set();
    const result = [];
    for (const value of values || []) {
      const text = String(value || "").replace(/\s+/g, " ").trim();
      const key = text.toLowerCase();
      if (!text || seen.has(key)) continue;
      seen.add(key);
      result.push(text);
      if (result.length >= limit) break;
    }
    return result;
  }

  function sourceRecord(type, url, available, detail) {
    return { type, url: url || "", available: Boolean(available), detail: detail || "" };
  }

  function compactStage(stage, key) {
    const data = stage?.data || stage || {};
    return {
      id: key || data.id || "stage",
      label: stage?.label || data.label || data.name || "Build stage",
      minLevel: Number(data.minLevel || 1),
      maxLevel: Number(data.maxLevel || 100),
      skills: uniqueStrings((data.skills || []).map(skill => skill?.name || skill?.id || skill), 40),
      passiveCount: Number(data.passiveCount || 0),
      passiveNodes: uniqueStrings(data.passiveNodes || [], 300),
      equipmentTargets: (data.inventory || []).slice(0, 30).map(item => ({
        slot: item.slot || "other",
        name: item.name || item.id || "Target item",
        text: String(item.text || "").slice(0, 600),
      })),
      creatorInstructions: uniqueStrings(data.creatorInstructions || [], 40),
    };
  }

  function findActiveStage(stages, stageKey, playerLevel) {
    if (!stages.length) return null;
    const selected = stages.find(stage => stage.id === stageKey);
    if (selected) return selected;
    const level = Number(playerLevel || 1);
    return stages.find(stage => level >= stage.minLevel && level <= stage.maxLevel)
      || stages.slice().sort((a, b) => Math.abs(a.minLevel - level) - Math.abs(b.minLevel - level))[0];
  }

  function create(options = {}) {
    const profile = options.profile || {};
    const pob = options.pobBuild || {};
    const mobalytics = profile.mobalytics || options.mobalytics || {};
    const stages = Object.entries(profile.stages || {}).map(([key, stage]) => compactStage(stage, key));
    const activeStage = findActiveStage(stages, options.stageKey, options.playerLevel || pob?.stats?.level);
    const activeIndex = activeStage ? stages.findIndex(stage => stage.id === activeStage.id) : -1;
    const nextStage = activeIndex >= 0 ? stages[activeIndex + 1] || null : null;
    const currentPassiveNodes = pob.passiveNodes?.length ? pob.passiveNodes : (activeStage?.passiveNodes || []);
    const currentPassiveSet = new Set(uniqueStrings(currentPassiveNodes, 500).map(node => node.toLowerCase()));
    const nextPassiveTargets = (nextStage?.passiveNodes || []).filter(node => !currentPassiveSet.has(node.toLowerCase()));
    const priorities = mobalytics.priorities || {};
    const creatorInstructions = uniqueStrings([
      ...(mobalytics.creatorInstructions || []),
      ...(activeStage?.creatorInstructions || []),
      ...(priorities.notes || []),
    ], 60);

    return {
      schemaVersion: 1,
      identity: {
        name: mobalytics.name || profile.name || pob.name || "Imported PoE2 build",
        creator: mobalytics.author || profile.importedStages?.[0]?.author || "",
        className: pob.stats?.className || "",
        ascendancy: pob.stats?.ascendancy || profile.importedStages?.[0]?.ascendancy || "",
      },
      sources: [
        sourceRecord("mobalytics", mobalytics.url, Boolean(mobalytics.url || creatorInstructions.length), "Creator intent and progression"),
        sourceRecord(pob.source || "pob", pob.url, Boolean(pob.exportCode || pob.gear?.length || pob.gems?.length), "Current character snapshot"),
        sourceRecord("user", "", Boolean(options.userPreferences?.length), "Personal priorities and corrections"),
      ],
      progression: {
        activeStage,
        nextStage,
        nextPassiveTargets,
        stages,
        creatorInstructions,
        slotPriorities: priorities.bySlot || {},
      },
      currentCharacter: {
        name: pob.name || "",
        level: Number(options.playerLevel || pob.stats?.level || 0),
        attributes: {
          str: Number(options.playerStr || pob.stats?.str || 0),
          dex: Number(options.playerDex || pob.stats?.dex || 0),
          int: Number(options.playerInt || pob.stats?.int || 0),
        },
        stats: pob.stats || {},
        skills: (pob.skillGroups || []).length
          ? (pob.skillGroups || []).map(group => ({ name: group.name, level: group.level || null, supports: uniqueStrings(group.supports || [], 12) }))
          : uniqueStrings(pob.gems || [], 80),
        keystones: uniqueStrings(pob.keystones || [], 40),
        passiveNodes: uniqueStrings(pob.passiveNodes || [], 200),
        gear: (pob.gear || []).slice(0, 30),
      },
      userPreferences: uniqueStrings(options.userPreferences || [], 30),
    };
  }

  function compactForCoach(knowledge) {
    if (!knowledge) return null;
    const current = knowledge.currentCharacter || {};
    const progression = knowledge.progression || {};
    return {
      identity: knowledge.identity,
      sources: (knowledge.sources || []).filter(source => source.available),
      activeStage: progression.activeStage,
      nextStage: progression.nextStage,
      nextPassiveTargets: progression.nextPassiveTargets || [],
      creatorInstructions: progression.creatorInstructions || [],
      slotPriorities: progression.slotPriorities || {},
      currentCharacter: {
        name: current.name,
        level: current.level,
        attributes: current.attributes,
        stats: current.stats,
        skills: current.skills,
        keystones: current.keystones,
        gear: current.gear,
      },
      userPreferences: knowledge.userPreferences || [],
    };
  }

  return { create, compactForCoach, uniqueStrings };
}));
