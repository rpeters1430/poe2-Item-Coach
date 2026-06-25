/**
 * parser.js — Pure PoE2 item text parsing (DOM-independent)
 *
 * Safe to import in both Node.js (tests) and Electron renderer context.
 */
"use strict";

function parseItem(text) {
  const raw = String(text || "");
  const allLines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const itemClass = extractMeta(allLines, /^Item Class:\s*(.+)$/i);
  const rarity    = extractMeta(allLines, /^Rarity:\s*(.+)$/i);
  const ilvl      = extractMeta(allLines, /^Item Level:\s*(\d+)$/i);
  const quality   = extractMeta(allLines, /^Quality:\s*([^(]+)/i);

  // Name(s): lines right after Rarity: line, not matching meta patterns
  const rarityIdx = allLines.findIndex(l => /^Rarity:/i.test(l));
  const names = [];
  if (rarityIdx !== -1) {
    for (let i = rarityIdx + 1; i < allLines.length && names.length < 2; i++) {
      if (/^(Item Class|Requires|Item Level|Quality|Unidentified|Corrupted|Mirrored):/i.test(allLines[i])) break;
      if (allLines[i] === "--------") break;
      names.push(allLines[i]);
    }
  } else {
    // If no Rarity header (e.g. some manual copies or simple lines), name is the first line
    if (allLines.length && !allLines[0].startsWith("Item Class:")) {
      names.push(allLines[0]);
    }
  }

  // Requirements section
  const reqLine = allLines.find(l => /^Requires:/i.test(l)) || "";
  const reqLevel  = Number((reqLine.match(/Level\s+(\d+)/i)||[])[1]||0) || Number((allLines.join(" ").match(/Requires.*?Level\s+(\d+)/i)||[])[1]||0);
  const reqStr    = Number((reqLine.match(/(\d+)\s*Str/i)||[])[1]||0);
  const reqDex    = Number((reqLine.match(/(\d+)\s*Dex/i)||[])[1]||0);
  const reqInt    = Number((reqLine.match(/(\d+)\s*Int/i)||[])[1]||0);

  // Properties (armour, evasion, energy shield, damage, etc)
  const propLines = [];
  const modLines  = [];
  let inMods = false;
  for (const line of allLines) {
    if (/^(Item Class|Rarity|Requires|Item Level|Quality|Unidentified|Corrupted|Mirrored):/i.test(line)) continue;
    if (/^--------$/.test(line)) { inMods = true; continue; }
    if (!inMods && /^(Armour|Evasion Rating|Energy Shield|Physical Damage|Elemental Damage|Critical Hit Chance|Attacks per Second|Weapon Range):/i.test(line)) {
      propLines.push(line);
    } else if (inMods) {
      modLines.push(line);
    }
  }

  // Separate implicits from explicits
  const sections2 = raw.split(/\r?\n--------\r?\n/);
  let implicits = [];
  let explicits = [];
  const modSections = sections2.filter(sec => {
    const lines = sec.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return lines.some(isModLike) && !lines.every(l => /^(Item Class|Rarity|Requires|Item Level|Quality|Armour|Evasion|Energy Shield|Physical Damage|Critical|Attacks|Weapon Range):/i.test(l));
  });
  if (modSections.length === 1) {
    explicits = modSections[0].trim().split(/\r?\n/).map(l=>l.trim()).filter(Boolean).filter(isModLike);
  } else if (modSections.length >= 2) {
    implicits = modSections[0].trim().split(/\r?\n/).map(l=>l.trim()).filter(Boolean).filter(isModLike);
    explicits = modSections.slice(1).flatMap(s => s.trim().split(/\r?\n/).map(l=>l.trim()).filter(Boolean).filter(isModLike));
  }

  const parsed = {
    raw, itemClass, rarity, ilvl, quality, names,
    reqLevel, reqStr, reqDex, reqInt, reqLine,
    propLines, implicits, explicits,
    mods: [...implicits, ...explicits],
  };

  parsed.slot = inferSlot(parsed);
  return parsed;
}

function extractMeta(lines, regex) {
  const l = lines.find(x => regex.test(x));
  return l ? (l.match(regex)||[])[1]?.trim() || "" : "";
}

function isModLike(line) {
  if (!line) return false;
  if (/^(Item Class|Rarity|Requires|Item Level|Quality|Armour|Evasion Rating|Energy Shield|Physical Damage|Critical Hit Chance|Attacks per Second|Weapon Range|Elemental Damage|Unidentified|Corrupted|Mirrored):/i.test(line)) return false;
  if (/^(Normal|Magic|Rare|Unique|Currency|Gem|Superior)$/i.test(line)) return false;
  if (/^--------$/.test(line)) return false;
  return /[+\-%\d]|adds|increased|reduced|maximum|speed|damage|life|strength|dexterity|intelligence|armour|evasion|energy shield|projectile|bow|crossbow|resistance|reload|chance|bonus|more|less/i.test(line);
}

function inferSlot(item) {
  if (!item || (!item.rarity && !item.names?.length)) return null;

  const cls  = String(item.itemClass || "").toLowerCase();
  const name = String((item.names[1] || item.names[0] || "")).toLowerCase();
  
  if (/flasks?/.test(cls))    return "flask";
  if (/charms?/.test(cls))    return "charm";
  if (/belts?/.test(cls))     return "belt";
  if (/rings?/.test(cls))     return "ring";
  if (/amulets?/.test(cls))   return "amulet";
  if (/quivers?/.test(cls))   return "quiver";
  if (/gloves?/.test(cls))    return "gloves";
  if (/boots?/.test(cls))     return "boots";
  if (/helmets?/.test(cls))   return "helmet";
  if (/body\s+armou?rs?/.test(cls)) return "body";
  if (/bows?|crossbows?|staves|staff|wands?|sceptres?|maces?|swords?|axes|daggers?|quarterstaves/.test(cls)) return "weapon";

  // fallback: base name
  if (/quiver/.test(name))    return "quiver";
  if (/bow|crossbow|staff|wand|sceptre|mace|sword|axe|dagger|quarterstaff/.test(name)) return "weapon";
  if (/helmet|helm|cap|hood|mask|crown/.test(name)) return "helmet";
  if (/body armour|body armor|vestments|vest|robe|coat|plate|garb|jacket|mail/.test(name)) return "body";
  if (/glove|bracer|gauntlet|mitt/.test(name)) return "gloves";
  if (/boot|greave|shoe|sandal|slipper/.test(name)) return "boots";
  if (/amulet|talisman/.test(name)) return "amulet";
  if (/ring/.test(name)) return "ring";
  if (/belt|sash/.test(name)) return "belt";

  return "unknown";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { parseItem, extractMeta, isModLike, inferSlot };
}
