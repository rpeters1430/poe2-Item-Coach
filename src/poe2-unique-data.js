/**
 * poe2-unique-data.js — PoE2 unique item database
 *
 * Loaded as <script> in overlay.html / settings.html (declares POE2_UNIQUE_DATA),
 * and require()'d in Node.js for tests / the fetch script.
 *
 * Fully generated from poe2db.tw — do not hand-edit. Run `npm run fetch-uniques`
 * to refresh after a league update adds/removes/rebalances uniques.
 */
"use strict";

/* eslint-disable no-unused-vars */
const POE2_UNIQUE_DATA = {
  version: "1.0.0",
  fetched: "2026-09-07T20:41:57.955Z",
  source: "poe2db.tw/us/Unique_item",
  items: [
  {
    "id": "brynhands_mark",
    "name": "Brynhand's Mark",
    "baseType": "Wooden Club",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (10–14) to (16–20) Physical Damage",
        "ranges": [
          [
            10,
            14
          ],
          [
            16,
            20
          ]
        ]
      },
      {
        "text": "+(30–50) to Accuracy Rating",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "20% reduced Attack Speed",
        "ranges": []
      },
      {
        "text": "+(10–20) to Strength",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Causes Double Stun Buildup",
        "ranges": []
      }
    ]
  },
  {
    "id": "frostbreath",
    "name": "Frostbreath",
    "baseType": "Slim Mace",
    "slot": "weapon",
    "levelReq": 10,
    "attrReqs": {
      "str": 21,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (8–12) to (16–20) Physical Damage",
        "ranges": [
          [
            8,
            12
          ],
          [
            16,
            20
          ]
        ]
      },
      {
        "text": "Adds (8–12) to (16–20) Cold Damage",
        "ranges": [
          [
            8,
            12
          ],
          [
            16,
            20
          ]
        ]
      },
      {
        "text": "+5% to Critical Hit Chance",
        "ranges": []
      },
      {
        "text": "All Damage from Hits with this Weapon Contributes to Freeze Buildup",
        "ranges": []
      },
      {
        "text": "Culling Strike against Frozen Enemies",
        "ranges": []
      }
    ]
  },
  {
    "id": "trenchtimbre",
    "name": "Trenchtimbre",
    "baseType": "Spiked Club",
    "slot": "weapon",
    "levelReq": 16,
    "attrReqs": {
      "str": 31,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (13–15) to (22–25) Physical Damage",
        "ranges": [
          [
            13,
            15
          ],
          [
            22,
            25
          ]
        ]
      },
      {
        "text": "(20–30)% increased Attack Speed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(1–2) to Level of all Minion Skills",
        "ranges": [
          [
            1,
            2
          ]
        ]
      },
      {
        "text": "Increases and Reductions to Minion Attack Speed also affect you",
        "ranges": []
      }
    ]
  },
  {
    "id": "sculpted_suffering",
    "name": "Sculpted Suffering",
    "baseType": "Warpick",
    "slot": "weapon",
    "levelReq": 22,
    "attrReqs": {
      "str": 41,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(5–10)% to Critical Damage Bonus",
        "ranges": [
          [
            5,
            10
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Adds (21–26) to (25–31) Physical Damage",
        "ranges": [
          [
            21,
            26
          ],
          [
            25,
            31
          ]
        ]
      },
      {
        "text": "(10–15)% increased Attack Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Breaks Armour equal to 40% of damage from Hits with this weapon",
        "ranges": []
      },
      {
        "text": "Fully Armour Broken enemies you kill with Hits Shatter",
        "ranges": []
      }
    ]
  },
  {
    "id": "brutus_lead_sprinkler",
    "name": "Brutus' Lead Sprinkler",
    "baseType": "Morning Star",
    "slot": "weapon",
    "levelReq": 45,
    "attrReqs": {
      "str": 80,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 11 Molten Shower",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Hits with this Weapon have 5% chance to Trigger Molten Shower per 25 Strength",
        "ranges": []
      },
      {
        "text": "(80–120)% increased Physical Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(5–10)% increased Attack Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+(15–25) to Strength",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "5 to 10 Added Attack Fire Damage per 25 Strength",
        "ranges": []
      },
      {
        "text": "local display grants level X molten shower [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "nebuloch",
    "name": "Nebuloch",
    "baseType": "Execratus Hammer",
    "slot": "weapon",
    "levelReq": 55,
    "attrReqs": {
      "str": 97,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (39–48) to (69–79) Physical Damage",
        "ranges": [
          [
            39,
            48
          ],
          [
            69,
            79
          ]
        ]
      },
      {
        "text": "+(20–30)% to Critical Damage Bonus",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Adds (25–36) to (44–55) Chaos damage",
        "ranges": [
          [
            25,
            36
          ],
          [
            44,
            55
          ]
        ]
      },
      {
        "text": "Attacks consume an Endurance Charge to Critically Hit",
        "ranges": []
      },
      {
        "text": "Take 100 Chaos damage per second per Endurance Charge",
        "ranges": []
      }
    ]
  },
  {
    "id": "mj%c3%b6lner",
    "name": "Mjölner",
    "baseType": "Torment Club",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 214,
      "dex": 0,
      "int": 200
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 15 Thundergod's Wrath",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+200 Intelligence Requirement",
        "ranges": []
      },
      {
        "text": "+100 Strength Requirement",
        "ranges": []
      },
      {
        "text": "(250–350)% increased Physical Damage",
        "ranges": [
          [
            250,
            350
          ]
        ]
      },
      {
        "text": "(10–20)% increased Attack Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(2–4) to Level of all Lightning Skills",
        "ranges": [
          [
            2,
            4
          ]
        ]
      }
    ]
  },
  {
    "id": "olrovasara",
    "name": "Olrovasara",
    "baseType": "Torment Club",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 114,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds 1 to (60–80) Lightning Damage",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(300–400) to Accuracy Rating",
        "ranges": [
          [
            300,
            400
          ]
        ]
      },
      {
        "text": "(5–30)% increased Attack Speed",
        "ranges": [
          [
            5,
            30
          ]
        ]
      },
      {
        "text": "On Hitting an enemy, gains maximum added Lightning damage equal to the enemy's Power for 20 seconds, up to a total of 500",
        "ranges": []
      }
    ]
  },
  {
    "id": "serles_grit",
    "name": "Serle's Grit",
    "baseType": "Kalguuran Forgehammer",
    "slot": "weapon",
    "levelReq": 47,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 12 Runic Tempering",
        "ranges": []
      },
      {
        "text": "Has 3 Sockets",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Maximum Quality is 40%",
        "ranges": []
      },
      {
        "text": "Adds (23–30) to (35–55) Physical Damage",
        "ranges": [
          [
            23,
            30
          ],
          [
            35,
            55
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Skills which Empower an Attack have (10–20)% chance to not count that Attack",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(40–50) to (80–100) added Physical Thorns damage per Runic Plate",
        "ranges": [
          [
            40,
            50
          ],
          [
            80,
            100
          ]
        ]
      }
    ]
  },
  {
    "id": "hoghunt",
    "name": "Hoghunt",
    "baseType": "Felled Greatclub",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (16–20) to (23–27) Physical Damage",
        "ranges": [
          [
            16,
            20
          ],
          [
            23,
            27
          ]
        ]
      },
      {
        "text": "+15% to Critical Hit Chance",
        "ranges": []
      },
      {
        "text": "10% reduced Attack Speed",
        "ranges": []
      },
      {
        "text": "+10 to Strength",
        "ranges": []
      },
      {
        "text": "Maim on Critical Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "hrimnors_hymn",
    "name": "Hrimnor's Hymn",
    "baseType": "Oak Greathammer",
    "slot": "weapon",
    "levelReq": 4,
    "attrReqs": {
      "str": 11,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Causes (20–40)% increased Stun Buildup",
        "ranges": [
          [
            20,
            40
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(80–120)% increased Physical Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(10–15) to Strength",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Gain (10–20) Life per enemy killed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Slam Skills you use yourself cause an additional Aftershock",
        "ranges": []
      }
    ]
  },
  {
    "id": "trephina",
    "name": "Trephina",
    "baseType": "Forge Maul",
    "slot": "weapon",
    "levelReq": 11,
    "attrReqs": {
      "str": 23,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Crushes Enemies on Hit",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (12–15) to (22–25) Physical Damage",
        "ranges": [
          [
            12,
            15
          ],
          [
            22,
            25
          ]
        ]
      },
      {
        "text": "(10–15)% increased Attack Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Causes (30–50)% increased Stun Buildup",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Always deals Critical Hits against Heavy Stunned Enemies",
        "ranges": []
      }
    ]
  },
  {
    "id": "brain_rattler",
    "name": "Brain Rattler",
    "baseType": "Studded Greatclub",
    "slot": "weapon",
    "levelReq": 16,
    "attrReqs": {
      "str": 31,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds 1 to (110–115) Lightning Damage",
        "ranges": [
          [
            110,
            115
          ]
        ]
      },
      {
        "text": "(10–15)% increased Attack Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "All damage with this Weapon causes Electrocution buildup",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_empty_roar",
    "name": "The Empty Roar",
    "baseType": "Cultist Greathammer",
    "slot": "weapon",
    "levelReq": 22,
    "attrReqs": {
      "str": 41,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Strikes deal Splash Damage",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (25–35) to (40–50) Physical Damage",
        "ranges": [
          [
            25,
            35
          ],
          [
            40,
            50
          ]
        ]
      },
      {
        "text": "Leeches 10% of Physical Damage as Life",
        "ranges": []
      },
      {
        "text": "(10–20)% chance to cause Bleeding on Hit",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "All Attacks count as Empowered Attacks",
        "ranges": []
      },
      {
        "text": "Cannot use Warcries",
        "ranges": []
      }
    ]
  },
  {
    "id": "shyaba",
    "name": "Shyaba",
    "baseType": "Temple Maul",
    "slot": "weapon",
    "levelReq": 28,
    "attrReqs": {
      "str": 37,
      "dex": 50,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+50 Dexterity Requirement",
        "ranges": []
      },
      {
        "text": "-15 Strength Requirement",
        "ranges": []
      },
      {
        "text": "(80–120)% increased Physical Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "50% increased Attack Speed",
        "ranges": []
      },
      {
        "text": "(15–25)% increased Light Radius",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Always Hits",
        "ranges": []
      }
    ]
  },
  {
    "id": "chober_chaber",
    "name": "Chober Chaber",
    "baseType": "Leaden Greathammer",
    "slot": "weapon",
    "levelReq": 33,
    "attrReqs": {
      "str": 60,
      "dex": 0,
      "int": 100
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+100 Intelligence Requirement",
        "ranges": []
      },
      {
        "text": "Adds (58–65) to (102–110) Physical Damage",
        "ranges": [
          [
            58,
            65
          ],
          [
            102,
            110
          ]
        ]
      },
      {
        "text": "+(80–100) to maximum Mana",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "+50 to Spirit",
        "ranges": []
      },
      {
        "text": "+1 to Level of all Minion Skills",
        "ranges": []
      },
      {
        "text": "Increases and Reductions to Minion Damage also affect you",
        "ranges": []
      }
    ]
  },
  {
    "id": "quecholli",
    "name": "Quecholli",
    "baseType": "Crumbling Maul",
    "slot": "weapon",
    "levelReq": 38,
    "attrReqs": {
      "str": 68,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Causes Enemies to Explode on Critical kill, for 10% of their Life as Physical Damage",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(100–150)% increased Physical Damage",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(10–15) to all Attributes",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Gain 30 Life per enemy killed",
        "ranges": []
      },
      {
        "text": "Hits with this Weapon have no Critical Damage Bonus",
        "ranges": []
      },
      {
        "text": "This Weapon's Critical Hit Chance is 100%",
        "ranges": []
      }
    ]
  },
  {
    "id": "tidebreaker",
    "name": "Tidebreaker",
    "baseType": "Pointed Maul",
    "slot": "weapon",
    "levelReq": 45,
    "attrReqs": {
      "str": 80,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(120–150)% increased Physical Damage",
        "ranges": [
          [
            120,
            150
          ]
        ]
      },
      {
        "text": "+(2–3) to Level of all Melee Skills",
        "ranges": [
          [
            2,
            3
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Causes (150–200)% increased Stun Buildup",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "All Damage from Hits with this Weapon Contributes to Chill Magnitude",
        "ranges": []
      }
    ]
  },
  {
    "id": "marohi_erqi",
    "name": "Marohi Erqi",
    "baseType": "Totemic Greatclub",
    "slot": "weapon",
    "levelReq": 60,
    "attrReqs": {
      "str": 239,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Warcries Empower 1 additional Attacks",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+150 Strength Requirement",
        "ranges": []
      },
      {
        "text": "(600–700)% increased Physical Damage",
        "ranges": [
          [
            600,
            700
          ]
        ]
      },
      {
        "text": "(-300–-200) to Accuracy Rating",
        "ranges": [
          [
            -300,
            -200
          ]
        ]
      },
      {
        "text": "35% reduced Attack Speed",
        "ranges": []
      },
      {
        "text": "Causes (40–60)% increased Stun Buildup",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "Heavy Stuns Enemies that are on Full Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_hammer_of_faith",
    "name": "The Hammer of Faith",
    "baseType": "Giant Maul",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 114,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(300–350)% increased Physical Damage",
        "ranges": [
          [
            300,
            350
          ]
        ]
      },
      {
        "text": "10% reduced Attack Speed",
        "ranges": []
      },
      {
        "text": "+10% to all Elemental Resistances",
        "ranges": []
      },
      {
        "text": "50% increased Mana Regeneration Rate",
        "ranges": []
      },
      {
        "text": "Every 10 seconds, gain a random non-damaging Shrine buff for 20 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "splinter_of_lorrata",
    "name": "Splinter of Lorrata",
    "baseType": "Hardwood Spear",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (2–3) to (6–8) Physical Damage",
        "ranges": [
          [
            2,
            3
          ],
          [
            6,
            8
          ]
        ]
      },
      {
        "text": "Deal no Elemental Damage",
        "ranges": []
      },
      {
        "text": "20% increased Melee Strike Range with this weapon",
        "ranges": []
      },
      {
        "text": "Any number of Poisons from this Weapon can affect a target at the same time",
        "ranges": []
      },
      {
        "text": "Always Poison on Hit with this weapon",
        "ranges": []
      }
    ]
  },
  {
    "id": "tyrannys_grip",
    "name": "Tyranny's Grip",
    "baseType": "Ironhead Spear",
    "slot": "weapon",
    "levelReq": 5,
    "attrReqs": {
      "str": 0,
      "dex": 10,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(150–200)% increased Physical Damage",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "(10–15)% reduced Attack Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(15–30) to Strength",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "Strikes deal Splash Damage",
        "ranges": []
      },
      {
        "text": "Knocks Back Enemies on Hit",
        "ranges": []
      },
      {
        "text": "Cannot use Projectile Attacks",
        "ranges": []
      }
    ]
  },
  {
    "id": "chainsting",
    "name": "Chainsting",
    "baseType": "Hunting Spear",
    "slot": "weapon",
    "levelReq": 10,
    "attrReqs": {
      "str": 9,
      "dex": 17,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      },
      {
        "text": "(15–25)% chance to Maim on Hit",
        "ranges": [
          [
            15,
            25
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Adds (13–17) to (22–28) Physical Damage",
        "ranges": [
          [
            13,
            17
          ],
          [
            22,
            28
          ]
        ]
      },
      {
        "text": "+(100–150) to Accuracy Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "10% increased Attack Speed",
        "ranges": []
      },
      {
        "text": "All Damage from Hits with this Weapon Contributes to Pin Buildup",
        "ranges": []
      },
      {
        "text": "(20–30)% increased Projectile Speed with this Weapon",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "skysliver",
    "name": "Skysliver",
    "baseType": "Winged Spear",
    "slot": "weapon",
    "levelReq": 16,
    "attrReqs": {
      "str": 12,
      "dex": 25,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "No Physical Damage",
        "ranges": []
      },
      {
        "text": "Adds 1 to (80–120) Lightning Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(15–30)% increased Attack Speed",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "(50–100)% increased chance to Shock",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "Rolls only the minimum or maximum Damage value for each Damage Type",
        "ranges": []
      }
    ]
  },
  {
    "id": "daevatas_wind",
    "name": "Daevata's Wind",
    "baseType": "War Spear",
    "slot": "weapon",
    "levelReq": 21,
    "attrReqs": {
      "str": 14,
      "dex": 31,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      },
      {
        "text": "(25–35)% increased Projectile Speed with this Weapon",
        "ranges": [
          [
            25,
            35
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Adds (10–15) to (21–26) Physical Damage",
        "ranges": [
          [
            10,
            15
          ],
          [
            21,
            26
          ]
        ]
      },
      {
        "text": "+100 to Evasion Rating",
        "ranges": []
      },
      {
        "text": "(10–20)% increased Attack Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(30–60)% increased Melee Damage if you've dealt a Projectile Attack Hit in the past eight seconds",
        "ranges": [
          [
            30,
            60
          ]
        ]
      },
      {
        "text": "(30–60)% increased Projectile Damage if you've dealt a Melee Hit in the past eight seconds",
        "ranges": [
          [
            30,
            60
          ]
        ]
      }
    ]
  },
  {
    "id": "tangletongue",
    "name": "Tangletongue",
    "baseType": "Forked Spear",
    "slot": "weapon",
    "levelReq": 26,
    "attrReqs": {
      "str": 17,
      "dex": 38,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (14–18) to (30–36) Physical Damage",
        "ranges": [
          [
            14,
            18
          ],
          [
            30,
            36
          ]
        ]
      },
      {
        "text": "+(5–8)% to Critical Hit Chance",
        "ranges": [
          [
            5,
            8
          ]
        ]
      },
      {
        "text": "+(15–25) to Intelligence",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Bifurcates Critical Hits",
        "ranges": []
      },
      {
        "text": "10% of Skill Mana Costs Converted to Life Costs",
        "ranges": []
      }
    ]
  },
  {
    "id": "saithas_spear",
    "name": "Saitha's Spear",
    "baseType": "Barbed Spear",
    "slot": "weapon",
    "levelReq": 33,
    "attrReqs": {
      "str": 20,
      "dex": 47,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      },
      {
        "text": "Bleeding you inflict deals Damage (10–20)% faster",
        "ranges": [
          [
            10,
            20
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Adds (14–26) to (27–32) Physical Damage",
        "ranges": [
          [
            14,
            26
          ],
          [
            27,
            32
          ]
        ]
      },
      {
        "text": "Adds (33–41) to (47–53) Fire Damage",
        "ranges": [
          [
            33,
            41
          ],
          [
            47,
            53
          ]
        ]
      },
      {
        "text": "(15–25)% chance to cause Bleeding on Hit",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Aggravating any Bleeding with this Weapon also Aggravates all Ignites on the target",
        "ranges": []
      },
      {
        "text": "(25–40)% chance to Aggravate Bleeding on Hit",
        "ranges": [
          [
            25,
            40
          ]
        ]
      }
    ]
  },
  {
    "id": "spire_of_ire",
    "name": "Spire of Ire",
    "baseType": "Helix Spear",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 36,
      "dex": 89,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 15 Chaotic Surge",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(15–20)% increased Attack Speed",
        "ranges": [
          [
            15,
            20
          ]
        ]
      },
      {
        "text": "Leeches (10–20)% of Physical Damage as Life",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Adds (167–201) to (267–333) Chaos damage",
        "ranges": [
          [
            167,
            201
          ],
          [
            267,
            333
          ]
        ]
      },
      {
        "text": "When you Consume a Charge Trigger Chaotic Surge to gain 2 Chaos Surges",
        "ranges": []
      },
      {
        "text": "Life Leech recovers based on your Chaos damage instead of Physical damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_blood_thorn",
    "name": "The Blood Thorn",
    "baseType": "Wrapped Quarterstaff",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (8–12) to (16–18) Physical Damage",
        "ranges": [
          [
            8,
            12
          ],
          [
            16,
            18
          ]
        ]
      },
      {
        "text": "+(10–15) to Strength",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Causes Bleeding on Hit",
        "ranges": []
      },
      {
        "text": "(4–5) to (8–10) Physical Thorns damage",
        "ranges": [
          [
            4,
            5
          ],
          [
            8,
            10
          ]
        ]
      }
    ]
  },
  {
    "id": "pillar_of_the_caged_god",
    "name": "Pillar of the Caged God",
    "baseType": "Long Quarterstaff",
    "slot": "weapon",
    "levelReq": 4,
    "attrReqs": {
      "str": 0,
      "dex": 9,
      "int": 0
    },
    "implicits": [
      {
        "text": "16% increased Melee Strike Range with this weapon",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "1% increased Area of Effect for Attacks per 10 Intelligence",
        "ranges": []
      },
      {
        "text": "1% increased Attack Speed per 10 Dexterity",
        "ranges": []
      },
      {
        "text": "10% increased Weapon Damage per 10 Strength",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_sentry",
    "name": "The Sentry",
    "baseType": "Gothic Quarterstaff",
    "slot": "weapon",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 18,
      "int": 9
    },
    "implicits": [],
    "explicits": [
      {
        "text": "No Physical Damage",
        "ranges": []
      },
      {
        "text": "Adds (25–32) to (40–50) Fire Damage",
        "ranges": [
          [
            25,
            32
          ],
          [
            40,
            50
          ]
        ]
      },
      {
        "text": "+(30–50) to Accuracy Rating",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+20% to Fire Resistance",
        "ranges": []
      },
      {
        "text": "100% increased Flammability Magnitude",
        "ranges": []
      },
      {
        "text": "30% increased Light Radius",
        "ranges": []
      }
    ]
  },
  {
    "id": "matsya",
    "name": "Matsya",
    "baseType": "Crescent Quarterstaff",
    "slot": "weapon",
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 30,
      "int": 14
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (6–9) to (10–15) Cold Damage",
        "ranges": [
          [
            6,
            9
          ],
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Adds 1 to (19–29) Lightning Damage",
        "ranges": [
          [
            19,
            29
          ]
        ]
      },
      {
        "text": "+(3–5)% to Critical Hit Chance",
        "ranges": [
          [
            3,
            5
          ]
        ]
      },
      {
        "text": "(15–20)% increased Attack Speed",
        "ranges": [
          [
            15,
            20
          ]
        ]
      },
      {
        "text": "(25–40)% increased Mana Regeneration Rate",
        "ranges": [
          [
            25,
            40
          ]
        ]
      },
      {
        "text": "Skills reserve 50% less Spirit",
        "ranges": []
      }
    ]
  },
  {
    "id": "nazirs_judgement",
    "name": "Nazir's Judgement",
    "baseType": "Steelpoint Quarterstaff",
    "slot": "weapon",
    "levelReq": 28,
    "attrReqs": {
      "str": 0,
      "dex": 41,
      "int": 18
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (30–36) to (75–81) Physical Damage",
        "ranges": [
          [
            30,
            36
          ],
          [
            75,
            81
          ]
        ]
      },
      {
        "text": "+(50–100) to Accuracy Rating",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "(10–20)% increased Stun Duration",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Dazes on Hit",
        "ranges": []
      },
      {
        "text": "(35–50)% increased Melee Damage against Heavy Stunned enemies",
        "ranges": [
          [
            35,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "collapsing_horizon",
    "name": "Collapsing Horizon",
    "baseType": "Wyrm Quarterstaff",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 89,
      "int": 36
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(5–10)% to Critical Hit Chance",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+(2–4) to Level of all Elemental Skills",
        "ranges": [
          [
            2,
            4
          ]
        ]
      },
      {
        "text": "100% increased Elemental Damage",
        "ranges": []
      },
      {
        "text": "Trigger skills refund half of Energy spent",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_wicked_quill",
    "name": "The Wicked Quill",
    "baseType": "Withered Wand",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Chaos Bolt",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–100)% increased Spell Damage",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(7–13)% to Chaos Resistance",
        "ranges": [
          [
            7,
            13
          ]
        ]
      },
      {
        "text": "Spells have a 25% chance to inflict Withered for 4 seconds on Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "sanguine_diviner",
    "name": "Sanguine Diviner",
    "baseType": "Bone Wand",
    "slot": "weapon",
    "levelReq": 2,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Bone Blast",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–100)% increased Spell Damage",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "Gain (10–15) Life per enemy killed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "25% chance to inflict Bleeding on Hit",
        "ranges": []
      },
      {
        "text": "25% of Spell Mana Cost Converted to Life Cost",
        "ranges": []
      }
    ]
  },
  {
    "id": "lifesprig",
    "name": "Lifesprig",
    "baseType": "Attuned Wand",
    "slot": "weapon",
    "levelReq": 2,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Mana Drain",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(10–20) to maximum Mana",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(1–3) to Level of all Spell Skills",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(5–10)% increased Cast Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Leeches 1% of maximum Life when you Cast a Spell",
        "ranges": []
      }
    ]
  },
  {
    "id": "adonias_ego",
    "name": "Adonia's Ego",
    "baseType": "Siphoning Wand",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 23
    },
    "implicits": [
      {
        "text": "Grants Skill: Power Siphon",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 15 Pinnacle of Power",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(100–150) to maximum Mana",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+3 to Level of all Spell Skills",
        "ranges": []
      },
      {
        "text": "(15–30)% increased Cast Speed",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "-10% to all Elemental Resistances per Power Charge",
        "ranges": []
      },
      {
        "text": "(-1–1) to Maximum Power Charges",
        "ranges": [
          [
            -1,
            1
          ]
        ]
      },
      {
        "text": "power siphon unique elemental art variation [1]",
        "ranges": []
      },
      {
        "text": "visual use power charges elemental epk [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "enezuns_charge",
    "name": "Enezun's Charge",
    "baseType": "Volatile Wand",
    "slot": "weapon",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 31
    },
    "implicits": [
      {
        "text": "Grants Skill: Volatile Dead",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–100)% increased Spell Damage",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "(30–50)% increased Critical Hit Chance for Spells",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Gain (10–15) Mana per enemy killed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "25% chance to not destroy Corpses when Consuming Corpses",
        "ranges": []
      }
    ]
  },
  {
    "id": "cursecarver",
    "name": "Cursecarver",
    "baseType": "Acrid Wand",
    "slot": "weapon",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 60
    },
    "implicits": [
      {
        "text": "Grants Skill: Decompose",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–100)% increased Spell Damage",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "(10–20)% increased Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Lose 10 Life per enemy killed",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Mana Regeneration Rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+4 to Level of [Random Curse] Skills",
        "ranges": []
      }
    ]
  },
  {
    "id": "liminal_coil",
    "name": "Liminal Coil",
    "baseType": "Twisted Wand",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 114
    },
    "implicits": [
      {
        "text": "Grants Skill: Coiling Bolts",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(71–113)% increased Spell Damage",
        "ranges": [
          [
            71,
            113
          ]
        ]
      },
      {
        "text": "(7–13)% increased Cast Speed",
        "ranges": [
          [
            7,
            13
          ]
        ]
      },
      {
        "text": "Magnitudes of Curses you inflict are zero",
        "ranges": []
      },
      {
        "text": "Curses you inflict ignore Curse limit",
        "ranges": []
      },
      {
        "text": "Spell Hits Gain (23–31)% of Damage as Extra Chaos Damage per Curse on target",
        "ranges": [
          [
            23,
            31
          ]
        ]
      },
      {
        "text": "Spell Hits Gain (23–31)% of Damage as Extra Physical Damage per Curse on target",
        "ranges": [
          [
            23,
            31
          ]
        ]
      }
    ]
  },
  {
    "id": "runeseekers_call",
    "name": "Runeseeker's Call",
    "baseType": "Runic Fork",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 114
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 15 The Stars Answer",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Only Runes can be Socketed in this item",
        "ranges": []
      },
      {
        "text": "200% increased effect of Socketed Runes",
        "ranges": []
      },
      {
        "text": "Has 5 Augment Sockets (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "dusk_vigil",
    "name": "Dusk Vigil",
    "baseType": "Ashen Staff",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Firebolt",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 1 Ember Fusillade",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Gain (30–50)% of Damage as Extra Fire Damage",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(80–120)% increased Spell Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "Gain (5–10) Life per enemy killed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "25% increased Mana Regeneration Rate",
        "ranges": []
      },
      {
        "text": "Trigger Ember Fusillade Skill on casting a Spell",
        "ranges": []
      }
    ]
  },
  {
    "id": "taryns_shiver",
    "name": "Taryn's Shiver",
    "baseType": "Gelid Staff",
    "slot": "weapon",
    "levelReq": 2,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Freezing Shards",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–120)% increased Spell Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(10–20)% increased Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "30% increased Freeze Buildup",
        "ranges": []
      },
      {
        "text": "Enemies Frozen by you take 100% increased Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "earthbound",
    "name": "Earthbound",
    "baseType": "Voltaic Staff",
    "slot": "weapon",
    "levelReq": 2,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Lightning Bolt",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 1 Spark",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–120)% increased Spell Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(10–20)% increased Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(20–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(20–40)% increased chance to Shock",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "Trigger Spark Skill on killing a Shocked Enemy",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_searing_touch",
    "name": "The Searing Touch",
    "baseType": "Pyrophyte Staff",
    "slot": "weapon",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 31
    },
    "implicits": [
      {
        "text": "Grants Skill: Solar Orb",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–120)% increased Fire Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(10–20)% increased Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "100% increased Flammability Magnitude",
        "ranges": []
      },
      {
        "text": "100% increased Ignite Magnitude",
        "ranges": []
      },
      {
        "text": "Ignites you inflict spread to other Enemies that stay within 1.5 metres for 1 second",
        "ranges": []
      }
    ]
  },
  {
    "id": "sire_of_shards",
    "name": "Sire of Shards",
    "baseType": "Chiming Staff",
    "slot": "weapon",
    "levelReq": 25,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 46
    },
    "implicits": [
      {
        "text": "Grants Skill: Sigil of Power",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–120)% increased Spell Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(10–20)% increased Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(5–10)% to all Elemental Resistances",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "20% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Spells fire 4 additional Projectiles Spells fire Projectiles in a circle",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_burden_of_shadows",
    "name": "The Burden of Shadows",
    "baseType": "Chiming Staff",
    "slot": "weapon",
    "levelReq": 78,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 46
    },
    "implicits": [
      {
        "text": "Grants Skill: Sigil of Power",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% increased Cast Speed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Skill Mana Costs Converted to Life Costs",
        "ranges": []
      },
      {
        "text": "Skills gain 1% of Damage as Chaos Damage per 3 Life Cost",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_unborn_lich",
    "name": "The Unborn Lich",
    "baseType": "Ravenous Staff",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 114
    },
    "implicits": [
      {
        "text": "Grants Skill: Feast of Flesh",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–80)% increased Desecrated Modifier magnitudes",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "[Custom Desecrated prefix]",
        "ranges": []
      },
      {
        "text": "[Lich's Desecrated prefix]",
        "ranges": []
      },
      {
        "text": "[Lich's Desecrated suffix]",
        "ranges": []
      },
      {
        "text": "[Lich's Desecrated suffix]",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_whispering_ice",
    "name": "The Whispering Ice",
    "baseType": "Permafrost Staff",
    "slot": "weapon",
    "levelReq": 75,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 114
    },
    "implicits": [
      {
        "text": "Grants Skill: Heart of Ice",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 17 Icestorm",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(5–7) to Level of all Cold Spell Skills",
        "ranges": [
          [
            5,
            7
          ]
        ]
      },
      {
        "text": "(10–20)% reduced Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(5–10)% increased Intelligence",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "2% increased Spell Damage per 10 Intelligence",
        "ranges": []
      },
      {
        "text": "Inflict Elemental Exposure on Hit, lowering Total Elemental Resistances by (50–60)%",
        "ranges": [
          [
            50,
            60
          ]
        ]
      }
    ]
  },
  {
    "id": "atziris_rule",
    "name": "Atziri's Rule",
    "baseType": "Reflecting Staff",
    "slot": "weapon",
    "levelReq": 70,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 114
    },
    "implicits": [
      {
        "text": "Grants Skill: Mirror of Refraction",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(10–20)% increased maximum Life",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(3–5) to Level of all Corrupted Spell Skill Gems",
        "ranges": [
          [
            3,
            5
          ]
        ]
      },
      {
        "text": "(10–20)% increased Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Spells which cost Life Gain (80–120)% of Damage as Extra Physical Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      }
    ]
  },
  {
    "id": "the_ravens_flock",
    "name": "The Raven's Flock",
    "baseType": "Perching Staff",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 114
    },
    "implicits": [
      {
        "text": "Grants Skill: Spiraling Conspiracy",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(8–16)% increased Cast Speed",
        "ranges": [
          [
            8,
            16
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Minions deal (80–120)% increased Damage",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "Minions have (10–20)% chance to inflict Gruelling Madness on Hit",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(30–50)% increased Spirit Reservation Efficiency of Skills",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "widowhail",
    "name": "Widowhail",
    "baseType": "Crude Bow",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–250)% increased bonuses gained from Equipped Quiver",
        "ranges": [
          [
            150,
            250
          ]
        ]
      }
    ]
  },
  {
    "id": "quill_rain",
    "name": "Quill Rain",
    "baseType": "Shortbow",
    "slot": "weapon",
    "levelReq": 5,
    "attrReqs": {
      "str": 0,
      "dex": 12,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "100% increased Attack Speed",
        "ranges": []
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(50–100)% increased Arrow Speed",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "40% less Attack Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "ironbound",
    "name": "Ironbound",
    "baseType": "Warden Bow",
    "slot": "weapon",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 23,
      "int": 0
    },
    "implicits": [
      {
        "text": "(25–35)% chance to Chain an additional time",
        "ranges": [
          [
            25,
            35
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(100–150) to Armour",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(5–10)% increased Attack Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+12% to Block chance",
        "ranges": []
      },
      {
        "text": "(3–5)% increased Block chance per 100 total Item Armour on Equipped Armour Items",
        "ranges": [
          [
            3,
            5
          ]
        ]
      },
      {
        "text": "Hits with this weapon have (1–2) to (4–5) Added Physical Damage per 1% Block Chance",
        "ranges": [
          [
            1,
            2
          ],
          [
            4,
            5
          ]
        ]
      },
      {
        "text": "Arrows Return if they have Pierced a target which had Fully Broken Armour",
        "ranges": []
      }
    ]
  },
  {
    "id": "splinterheart",
    "name": "Splinterheart",
    "baseType": "Recurve Bow",
    "slot": "weapon",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 31,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(120–160)% increased Physical Damage",
        "ranges": [
          [
            120,
            160
          ]
        ]
      },
      {
        "text": "+(50–70) to Accuracy Rating",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "(20–30)% increased Projectile Speed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Projectiles Split towards +2 targets",
        "ranges": []
      }
    ]
  },
  {
    "id": "doomfletch",
    "name": "Doomfletch",
    "baseType": "Composite Bow",
    "slot": "weapon",
    "levelReq": 22,
    "attrReqs": {
      "str": 0,
      "dex": 41,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (5–7) to (10–12) Physical Damage",
        "ranges": [
          [
            5,
            7
          ],
          [
            10,
            12
          ]
        ]
      },
      {
        "text": "+10 to Dexterity",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Mana Regeneration Rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Attacks with this Weapon gain 100% of Physical damage as Extra damage of each Element",
        "ranges": []
      }
    ]
  },
  {
    "id": "deaths_harp",
    "name": "Death's Harp",
    "baseType": "Dualstring Bow",
    "slot": "weapon",
    "levelReq": 28,
    "attrReqs": {
      "str": 0,
      "dex": 52,
      "int": 0
    },
    "implicits": [
      {
        "text": "+50% Surpassing chance to fire an additional Arrow",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(20–25)% to Critical Damage Bonus",
        "ranges": [
          [
            20,
            25
          ]
        ]
      },
      {
        "text": "Gain (20–30) Life per enemy killed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Gain (12–18) Mana per enemy killed",
        "ranges": [
          [
            12,
            18
          ]
        ]
      },
      {
        "text": "+(250–330)% Surpassing chance to fire an additional Arrow",
        "ranges": [
          [
            250,
            330
          ]
        ]
      }
    ]
  },
  {
    "id": "slivertongue",
    "name": "Slivertongue",
    "baseType": "Zealot Bow",
    "slot": "weapon",
    "levelReq": 39,
    "attrReqs": {
      "str": 0,
      "dex": 70,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (40–48) to (65–72) Physical Damage",
        "ranges": [
          [
            40,
            48
          ],
          [
            65,
            72
          ]
        ]
      },
      {
        "text": "+(4–6)% to Critical Hit Chance",
        "ranges": [
          [
            4,
            6
          ]
        ]
      },
      {
        "text": "Leeches (5–8)% of Physical Damage as Life",
        "ranges": [
          [
            5,
            8
          ]
        ]
      },
      {
        "text": "Leeches (4–7)% of Physical Damage as Mana",
        "ranges": [
          [
            4,
            7
          ]
        ]
      },
      {
        "text": "Arrows Fork",
        "ranges": []
      },
      {
        "text": "Arrows Pierce all targets after Forking",
        "ranges": []
      }
    ]
  },
  {
    "id": "fairgraves_curse",
    "name": "Fairgraves' Curse",
    "baseType": "Artillery Bow",
    "slot": "weapon",
    "levelReq": 45,
    "attrReqs": {
      "str": 0,
      "dex": 80,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 11 Phantasmal Arrow",
        "ranges": []
      },
      {
        "text": "50% reduced Projectile Range",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (76–98) to (126–193) Fire Damage",
        "ranges": [
          [
            76,
            98
          ],
          [
            126,
            193
          ]
        ]
      },
      {
        "text": "(30–50)% increased Flammability Magnitude",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(10–20)% increased Ignite Magnitude",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "30% reduced Life Recovery rate",
        "ranges": []
      },
      {
        "text": "-30 Physical Damage taken from Hits",
        "ranges": []
      },
      {
        "text": "Attack Hits inflict Spectral Fire for 8 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "lioneyes_glare",
    "name": "Lioneye's Glare",
    "baseType": "Heavy Bow",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 114,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–240)% increased Physical Damage",
        "ranges": [
          [
            150,
            240
          ]
        ]
      },
      {
        "text": "+(300–500) to Accuracy Rating",
        "ranges": [
          [
            300,
            500
          ]
        ]
      },
      {
        "text": "10% increased Attack Speed",
        "ranges": []
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+2 metres to Dodge Roll distance if you haven't Dodge Rolled Recently",
        "ranges": []
      },
      {
        "text": "-1 metre to Dodge Roll distance if you've Dodge Rolled Recently",
        "ranges": []
      },
      {
        "text": "Repeatable Attacks with this Bow Repeat +2 times if no enemies are in your Presence",
        "ranges": []
      },
      {
        "text": "enable lioneyes glow task [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "mist_whisper",
    "name": "Mist Whisper",
    "baseType": "Makeshift Crossbow",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (8–10) to (13–15) Cold Damage",
        "ranges": [
          [
            8,
            10
          ],
          [
            13,
            15
          ]
        ]
      },
      {
        "text": "Gain 5 Mana per enemy killed",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Freeze Buildup",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "30% increased Chill Duration on Enemies",
        "ranges": []
      },
      {
        "text": "Attacks Chain 2 additional times",
        "ranges": []
      }
    ]
  },
  {
    "id": "rampart_raptor",
    "name": "Rampart Raptor",
    "baseType": "Tense Crossbow",
    "slot": "weapon",
    "levelReq": 4,
    "attrReqs": {
      "str": 8,
      "dex": 8,
      "int": 0
    },
    "implicits": [
      {
        "text": "(20–30)% increased Bolt Speed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(40–60)% increased Physical Damage",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(30–40)% increased Attack Speed",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "30% reduced Reload Speed",
        "ranges": []
      },
      {
        "text": "Bolts fired by Crossbow Attacks have 100% chance to not expend Ammunition if you've Reloaded Recently",
        "ranges": []
      }
    ]
  },
  {
    "id": "double_vision",
    "name": "Double Vision",
    "baseType": "Dyad Crossbow",
    "slot": "weapon",
    "levelReq": 20,
    "attrReqs": {
      "str": 22,
      "dex": 22,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 6 Gemini Surge",
        "ranges": []
      },
      {
        "text": "Loads an additional bolt",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (14–21) to (25–37) Physical Damage",
        "ranges": [
          [
            14,
            21
          ],
          [
            25,
            37
          ]
        ]
      },
      {
        "text": "+5% to Critical Hit Chance",
        "ranges": []
      },
      {
        "text": "(15–25)% increased Reload Speed",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "When you reload, triggers Gemini Surge to alternately gain (2–6) Cold Surges or (2–6) Fire Surges",
        "ranges": [
          [
            2,
            6
          ],
          [
            2,
            6
          ]
        ]
      },
      {
        "text": "trigger reload infusion on reload [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_dark_defiler",
    "name": "The Dark Defiler",
    "baseType": "Rattling Sceptre",
    "slot": "weapon",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Skeletal Warrior",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(20–30) to maximum Mana",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(5–10) to Intelligence",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "(10–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "Gain 5% of Damage as Chaos Damage per Undead Minion",
        "ranges": []
      }
    ]
  },
  {
    "id": "sylvans_effigy",
    "name": "Sylvan's Effigy",
    "baseType": "Stoic Sceptre",
    "slot": "weapon",
    "levelReq": 62,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 12
    },
    "implicits": [
      {
        "text": "Grants Skill: Discipline",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 14 Azmerian Wolf",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(50–75)% increased Spirit",
        "ranges": [
          [
            50,
            75
          ]
        ]
      },
      {
        "text": "Allies in your Presence Regenerate (50–100) Life per second",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(6–12) to all Attributes",
        "ranges": [
          [
            6,
            12
          ]
        ]
      },
      {
        "text": "Companions deal (50–100)% increased damage to your Marked targets",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "You can have any number of Companions of different types",
        "ranges": []
      },
      {
        "text": "discipline art variation [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "font_of_power",
    "name": "Font of Power",
    "baseType": "Omen Sceptre",
    "slot": "weapon",
    "levelReq": 16,
    "attrReqs": {
      "str": 12,
      "dex": 0,
      "int": 25
    },
    "implicits": [
      {
        "text": "Grants Skill: Malice",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(30–50)% increased Spirit",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(20–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "When a Party Member in your Presence Casts a Spell , you Sacrifice 20% of Mana and they Leech that Mana",
        "ranges": []
      }
    ]
  },
  {
    "id": "sacred_flame",
    "name": "Sacred Flame",
    "baseType": "Shrine Sceptre",
    "slot": "weapon",
    "levelReq": 55,
    "attrReqs": {
      "str": 17,
      "dex": 0,
      "int": 38
    },
    "implicits": [
      {
        "text": "Grants Skill: Purity of Fire",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Gain (40–60)% of Damage as Extra Fire Damage",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "Allies in your Presence Regenerate (2–3)% of their Maximum Life per second",
        "ranges": [
          [
            2,
            3
          ]
        ]
      },
      {
        "text": "Allies in your Presence Gain (20–30)% of Damage as Extra Fire Damage",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Enemies in your Presence Resist Elemental Damage based on their Lowest Resistance",
        "ranges": []
      }
    ]
  },
  {
    "id": "guiding_palm_of_the_heart",
    "name": "Guiding Palm of the Heart",
    "baseType": "Shrine Sceptre",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 17,
      "dex": 0,
      "int": 38
    },
    "implicits": [
      {
        "text": "Grants Skill: Purity of Fire",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Gain 25% of Damage as Extra Fire Damage",
        "ranges": []
      },
      {
        "text": "Allies in your Presence deal (15–23) to (28–35) added Attack Fire Damage",
        "ranges": [
          [
            15,
            23
          ],
          [
            28,
            35
          ]
        ]
      },
      {
        "text": "50% of your Base Life Regeneration is granted to Allies in your Presence",
        "ranges": []
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "25% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Grants effect of Guided Meteoric Shrine",
        "ranges": []
      }
    ]
  },
  {
    "id": "guiding_palm_of_the_eye",
    "name": "Guiding Palm of the Eye",
    "baseType": "Shrine Sceptre",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 17,
      "dex": 0,
      "int": 38
    },
    "implicits": [
      {
        "text": "Grants Skill: Purity of Ice",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Gain 25% of Damage as Extra Cold Damage",
        "ranges": []
      },
      {
        "text": "Allies in your Presence deal (15–23) to (28–35) added Attack Cold Damage",
        "ranges": [
          [
            15,
            23
          ],
          [
            28,
            35
          ]
        ]
      },
      {
        "text": "50% of your Base Life Regeneration is granted to Allies in your Presence",
        "ranges": []
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "25% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Grants effect of Guided Freezing Shrine",
        "ranges": []
      }
    ]
  },
  {
    "id": "guiding_palm_of_the_mind",
    "name": "Guiding Palm of the Mind",
    "baseType": "Shrine Sceptre",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 17,
      "dex": 0,
      "int": 38
    },
    "implicits": [
      {
        "text": "Grants Skill: Purity of Lightning",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Gain 25% of Damage as Extra Lightning Damage",
        "ranges": []
      },
      {
        "text": "Allies in your Presence deal 1 to (56–70) added Attack Lightning Damage",
        "ranges": [
          [
            56,
            70
          ]
        ]
      },
      {
        "text": "50% of your Base Life Regeneration is granted to Allies in your Presence",
        "ranges": []
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "25% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Grants effect of Guided Tempest Shrine",
        "ranges": []
      }
    ]
  },
  {
    "id": "palm_of_the_dreamer",
    "name": "Palm of the Dreamer",
    "baseType": "Shrine Sceptre",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 17,
      "dex": 0,
      "int": 38
    },
    "implicits": [
      {
        "text": "Grants Skill: Impurity",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Allies in your Presence deal (13–17) to (25–37) added Attack Chaos Damage",
        "ranges": [
          [
            13,
            17
          ],
          [
            25,
            37
          ]
        ]
      },
      {
        "text": "+(7–13) to all Attributes",
        "ranges": [
          [
            7,
            13
          ]
        ]
      },
      {
        "text": "23% reduced Light Radius",
        "ranges": []
      },
      {
        "text": "(-13–13)% reduced Skill Effect Duration",
        "ranges": [
          [
            -13,
            13
          ]
        ]
      },
      {
        "text": "Gain 27% of Damage as Extra Chaos Damage",
        "ranges": []
      },
      {
        "text": "Grants effect of Dreaming Gloom Shrine",
        "ranges": []
      }
    ]
  },
  {
    "id": "amor_mandragora",
    "name": "Amor Mandragora",
    "baseType": "Changeling Talisman",
    "slot": "amulet",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (16–20) to (23–27) Physical Damage",
        "ranges": [
          [
            16,
            20
          ],
          [
            23,
            27
          ]
        ]
      },
      {
        "text": "+(8–15) to Intelligence",
        "ranges": [
          [
            8,
            15
          ]
        ]
      },
      {
        "text": "(10–15)% increased Skill Effect Duration",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Enemies in your Presence are Hindered",
        "ranges": []
      },
      {
        "text": "Gain 1 Druidic Prowess for every 20 total Rage spent",
        "ranges": []
      }
    ]
  },
  {
    "id": "spiteful_floret",
    "name": "Spiteful Floret",
    "baseType": "Nettle Talisman",
    "slot": "amulet",
    "levelReq": 5,
    "attrReqs": {
      "str": 9,
      "dex": 0,
      "int": 8
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 2 Sanguine Revelry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–90)% increased Physical Damage",
        "ranges": [
          [
            60,
            90
          ]
        ]
      },
      {
        "text": "(6–10)% increased Attack Speed",
        "ranges": [
          [
            6,
            10
          ]
        ]
      },
      {
        "text": "+(7–14) to Strength",
        "ranges": [
          [
            7,
            14
          ]
        ]
      },
      {
        "text": "(20–30)% chance to cause Bleeding on Hit",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Every 5 Rage also grants 5% of Damage taken Recouped as Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "hyssegs_claw",
    "name": "Hysseg's Claw",
    "baseType": "Familial Talisman",
    "slot": "amulet",
    "levelReq": 16,
    "attrReqs": {
      "str": 21,
      "dex": 0,
      "int": 16
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 5 Cackling Companions",
        "ranges": []
      },
      {
        "text": "Minions deal (30–50)% increased Damage",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(70–100)% increased Physical Damage",
        "ranges": [
          [
            70,
            100
          ]
        ]
      },
      {
        "text": "5% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "+(8–15) to Strength",
        "ranges": [
          [
            8,
            15
          ]
        ]
      },
      {
        "text": "+(8–15) to Intelligence",
        "ranges": [
          [
            8,
            15
          ]
        ]
      },
      {
        "text": "(5–8)% increased Damage per Minion",
        "ranges": [
          [
            5,
            8
          ]
        ]
      }
    ]
  },
  {
    "id": "the_flesh_poppet",
    "name": "The Flesh Poppet",
    "baseType": "Vicious Talisman",
    "slot": "amulet",
    "levelReq": 40,
    "attrReqs": {
      "str": 47,
      "dex": 0,
      "int": 34
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(90–120)% increased Physical Damage",
        "ranges": [
          [
            90,
            120
          ]
        ]
      },
      {
        "text": "(7–13)% increased Attack Speed",
        "ranges": [
          [
            7,
            13
          ]
        ]
      },
      {
        "text": "+(7–13) to all Attributes",
        "ranges": [
          [
            7,
            13
          ]
        ]
      },
      {
        "text": "(30–40)% reduced Presence Area of Effect",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Copy a random Modifier from each enemy in your Presence when you Shapeshift to an Animal form Modifiers gained this way are lost after 30 seconds or when you next Shapeshift",
        "ranges": []
      }
    ]
  },
  {
    "id": "surge_of_the_tide",
    "name": "Surge of the Tide",
    "baseType": "Lumbering Talisman",
    "slot": "amulet",
    "levelReq": 52,
    "attrReqs": {
      "str": 60,
      "dex": 0,
      "int": 43
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(250–300)% increased Physical Damage",
        "ranges": [
          [
            250,
            300
          ]
        ]
      },
      {
        "text": "(30–50)% increased Armour",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(10–15)% reduced Attack Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Every second Slam Skill you use while Shapeshifted is Ancestrally Boosted Every second Strike Skill you use while Shapeshifted is Ancestrally Boosted",
        "ranges": []
      }
    ]
  },
  {
    "id": "seeing_stars",
    "name": "Seeing Stars",
    "baseType": "Marching Mace",
    "slot": "weapon",
    "levelReq": 54,
    "attrReqs": {
      "str": 96,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (24–31) to (36–46) Cold Damage",
        "ranges": [
          [
            24,
            31
          ],
          [
            36,
            46
          ]
        ]
      },
      {
        "text": "Adds (1–5) to (66–90) Lightning Damage",
        "ranges": [
          [
            1,
            5
          ],
          [
            66,
            90
          ]
        ]
      },
      {
        "text": "(10–20)% increased Attack Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Energy Generation is doubled",
        "ranges": []
      }
    ]
  },
  {
    "id": "sadists_mercy",
    "name": "Sadist's Mercy",
    "baseType": "Flanged Mace",
    "slot": "weapon",
    "levelReq": 67,
    "attrReqs": {
      "str": 134,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 16 Harbinger of Madness",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(240–300)% increased Physical Damage",
        "ranges": [
          [
            240,
            300
          ]
        ]
      },
      {
        "text": "+(5–8)% to Critical Hit Chance",
        "ranges": [
          [
            5,
            8
          ]
        ]
      },
      {
        "text": "(14–22)% increased Attack Speed",
        "ranges": [
          [
            14,
            22
          ]
        ]
      },
      {
        "text": "Hits with this Weapon inflict (2–5) Gruelling Madness",
        "ranges": [
          [
            2,
            5
          ]
        ]
      },
      {
        "text": "Enemies in your Presence have additional Power equal to their Gruelling Madness",
        "ranges": []
      }
    ]
  },
  {
    "id": "twisted_empyrean",
    "name": "Twisted Empyrean",
    "baseType": "Aberrant Sledge",
    "slot": "weapon",
    "levelReq": 70,
    "attrReqs": {
      "str": 163,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 16 Starborn Onslaught",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–100)% increased Physical Damage",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "Adds (150–200) to (350–400) Cold Damage",
        "ranges": [
          [
            150,
            200
          ],
          [
            350,
            400
          ]
        ]
      },
      {
        "text": "+(300–400) to maximum Mana",
        "ranges": [
          [
            300,
            400
          ]
        ]
      },
      {
        "text": "+(4–6)% to Critical Hit Chance",
        "ranges": [
          [
            4,
            6
          ]
        ]
      },
      {
        "text": "(10–20)% of Damage is taken from Mana before Life",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Attacks with this Weapon have Added Cold Damage equal to (6–8)% to (10–12)% of maximum Mana",
        "ranges": [
          [
            6,
            8
          ],
          [
            10,
            12
          ]
        ]
      },
      {
        "text": "Convert 100% of Fire Damage with Mace Skills to Cold Damage",
        "ranges": []
      },
      {
        "text": "mace fire skills are blue [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "duality",
    "name": "Duality",
    "baseType": "Warding Quarterstaff",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 127,
      "int": 50
    },
    "implicits": [
      {
        "text": "+(30–50) to maximum Runic Ward",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(200–300)% increased Physical Damage",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+(20–30)% to Critical Damage Bonus",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(12–22)% increased Attack Speed",
        "ranges": [
          [
            12,
            22
          ]
        ]
      },
      {
        "text": "Gain Finality for 0.5 seconds per Combo expended when using Skills",
        "ranges": []
      },
      {
        "text": "Gain (500–1000) Guard for 0.5 seconds per Combo expended when using Skills",
        "ranges": [
          [
            500,
            1000
          ]
        ]
      }
    ]
  },
  {
    "id": "voltaxic_rift",
    "name": "Voltaxic Rift",
    "baseType": "Fanatic Bow",
    "slot": "weapon",
    "levelReq": 79,
    "attrReqs": {
      "str": 0,
      "dex": 163,
      "int": 0
    },
    "implicits": [
      {
        "text": "local weapon implicit hidden added maximum chaos damage [64] local weapon implicit hidden added minimum chaos damage [28]",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds 1 to (300–500) Lightning Damage",
        "ranges": [
          [
            300,
            500
          ]
        ]
      },
      {
        "text": "(10–15)% increased Attack Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "100% of Lightning Damage Converted to Chaos Damage",
        "ranges": []
      },
      {
        "text": "Chaos Damage from Hits also Contributes to Shock Chance",
        "ranges": []
      }
    ]
  },
  {
    "id": "periphery",
    "name": "Periphery",
    "baseType": "Heartwood Shortbow",
    "slot": "weapon",
    "levelReq": 67,
    "attrReqs": {
      "str": 0,
      "dex": 134,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 16 Azmerian Swarms",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (48–59) to (75–97) Fire Damage",
        "ranges": [
          [
            48,
            59
          ],
          [
            75,
            97
          ]
        ]
      },
      {
        "text": "Adds (35–53) to (65–80) Cold Damage",
        "ranges": [
          [
            35,
            53
          ],
          [
            65,
            80
          ]
        ]
      },
      {
        "text": "Adds (1–8) to (123–152) Lightning Damage",
        "ranges": [
          [
            1,
            8
          ],
          [
            123,
            152
          ]
        ]
      },
      {
        "text": "(8–14)% increased Attack Speed",
        "ranges": [
          [
            8,
            14
          ]
        ]
      },
      {
        "text": "Elemental Damage from Hits Contributes to Flammability , Ignite , and Chill Magnitudes , Freeze Buildup, and Shock Chance",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_last_lament",
    "name": "The Last Lament",
    "baseType": "Desolate Crossbow",
    "slot": "weapon",
    "levelReq": 77,
    "attrReqs": {
      "str": 89,
      "dex": 89,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 17 Requiem",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(250–300)% increased Physical Damage",
        "ranges": [
          [
            250,
            300
          ]
        ]
      },
      {
        "text": "(10–20)% increased Attack Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(40–60)% reduced Reload Speed",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "Leeches (5–10)% of Physical Damage as Life",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "(10–20)% chance to load a bolt into all Crossbow skills on Kill",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Sacrifice 300 Life to not consume the last bolt when firing",
        "ranges": []
      },
      {
        "text": "enable grand design clip handling [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "redemption",
    "name": "Redemption",
    "baseType": "Trarthan Cannon",
    "slot": "weapon",
    "levelReq": 65,
    "attrReqs": {
      "str": 114,
      "dex": 63,
      "int": 0
    },
    "implicits": [
      {
        "text": "Cannot load or fire Ammunition",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(300–400)% increased Physical Damage",
        "ranges": [
          [
            300,
            400
          ]
        ]
      },
      {
        "text": "Hits with this Weapon have no Critical Damage Bonus",
        "ranges": []
      },
      {
        "text": "(20–40)% reduced Cooldown Recovery Rate",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "Gain 1 Explosive Rhythm every (2–3) times you use a Grenade Skill Remove all Explosive Rhythm on reaching 10 to gain Explosive Fervour for 10 Seconds",
        "ranges": [
          [
            2,
            3
          ]
        ]
      }
    ]
  },
  {
    "id": "atziris_contempt",
    "name": "Atziri's Contempt",
    "baseType": "Pronged Spear",
    "slot": "weapon",
    "levelReq": 72,
    "attrReqs": {
      "str": 46,
      "dex": 115,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 17 Shattering Spite",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(100–120)% increased Physical Damage",
        "ranges": [
          [
            100,
            120
          ]
        ]
      },
      {
        "text": "Adds (83–97) to (123–153) Fire Damage",
        "ranges": [
          [
            83,
            97
          ],
          [
            123,
            153
          ]
        ]
      },
      {
        "text": "Adds 1 to (193–207) Lightning Damage",
        "ranges": [
          [
            193,
            207
          ]
        ]
      },
      {
        "text": "(10–16)% increased Attack Speed",
        "ranges": [
          [
            10,
            16
          ]
        ]
      },
      {
        "text": "(60–80)% increased Presence Area of Effect",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "Spear Skills inflict a Bloodstone Lance on Hit , up to a maximum of 30 on each target",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_ordained",
    "name": "The Ordained",
    "baseType": "Grand Spear",
    "slot": "weapon",
    "levelReq": 79,
    "attrReqs": {
      "str": 68,
      "dex": 109,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Spear Throw",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 18 Righteous Descent",
        "ranges": []
      },
      {
        "text": "25% increased Melee Strike Range with this weapon",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(150–250)% increased Physical Damage",
        "ranges": [
          [
            150,
            250
          ]
        ]
      },
      {
        "text": "Adds 1 to (200–300) Lightning Damage",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+(5–8)% to Critical Hit Chance",
        "ranges": [
          [
            5,
            8
          ]
        ]
      },
      {
        "text": "Life Leech recovers based on your Lightning damage as well as Physical damage",
        "ranges": []
      },
      {
        "text": "Create a Fragment of Divinity in your Presence every 4 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "fury_of_the_king",
    "name": "Fury of the King",
    "baseType": "Ashbark Talisman",
    "slot": "amulet",
    "levelReq": 72,
    "attrReqs": {
      "str": 94,
      "dex": 0,
      "int": 67
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 17 Molten Crash",
        "ranges": []
      },
      {
        "text": "(50–80)% increased Flammability Magnitude local weapon implicit hidden% base damage is fire [30]",
        "ranges": [
          [
            50,
            80
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Adds (503–589) to (647–713) Fire Damage",
        "ranges": [
          [
            503,
            589
          ],
          [
            647,
            713
          ]
        ]
      },
      {
        "text": "(15–20)% reduced Attack Speed",
        "ranges": [
          [
            15,
            20
          ]
        ]
      },
      {
        "text": "+(30–40) to Strength",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Bear Skills Convert 80% of Physical Damage to Fire Damage",
        "ranges": []
      },
      {
        "text": "Skills which require Glory generate (2–5) Glory every 2 seconds",
        "ranges": [
          [
            2,
            5
          ]
        ]
      },
      {
        "text": "Enemies in your Presence have Exposure",
        "ranges": []
      },
      {
        "text": "exposure art variation [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "bramblejack",
    "name": "Bramblejack",
    "baseType": "Rusted Cuirass",
    "slot": "body",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(60–100) to maximum Life",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(60–100) to Stun Threshold",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "Cannot Evade Enemy Attacks",
        "ranges": []
      },
      {
        "text": "250% of Melee Physical Damage taken reflected to Attacker",
        "ranges": []
      },
      {
        "text": "Regenerate 5% of maximum Life per second while Surrounded",
        "ranges": []
      }
    ]
  },
  {
    "id": "blackbraid",
    "name": "Blackbraid",
    "baseType": "Fur Plate",
    "slot": "body",
    "levelReq": 4,
    "attrReqs": {
      "str": 10,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(40–60) to Armour",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(5–15) to Strength",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "+(5–15) to Intelligence",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "+10% to all Elemental Resistances",
        "ranges": []
      },
      {
        "text": "+(100–150)% of Armour also applies to Elemental Damage",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(40–60) to Stun Threshold",
        "ranges": [
          [
            40,
            60
          ]
        ]
      }
    ]
  },
  {
    "id": "edyrns_tusks",
    "name": "Edyrn's Tusks",
    "baseType": "Iron Cuirass",
    "slot": "body",
    "levelReq": 11,
    "attrReqs": {
      "str": 21,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(120–160)% increased Armour",
        "ranges": [
          [
            120,
            160
          ]
        ]
      },
      {
        "text": "50% chance to inflict Bleeding on Hit",
        "ranges": []
      },
      {
        "text": "50% reduced Slowing Potency of Debuffs on You",
        "ranges": []
      },
      {
        "text": "(15–20) to (25–30) Physical Thorns damage",
        "ranges": [
          [
            15,
            20
          ],
          [
            25,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "titanrot_cataphract",
    "name": "Titanrot Cataphract",
    "baseType": "Maraketh Cuirass",
    "slot": "body",
    "levelReq": 20,
    "attrReqs": {
      "str": 34,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(400–500)% increased Armour",
        "ranges": [
          [
            400,
            500
          ]
        ]
      },
      {
        "text": "(15–30)% increased Strength",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "10% reduced Dexterity",
        "ranges": []
      },
      {
        "text": "10% reduced Intelligence",
        "ranges": []
      },
      {
        "text": "You have no Life Regeneration",
        "ranges": []
      }
    ]
  },
  {
    "id": "wandering_reliquary",
    "name": "Wandering Reliquary",
    "baseType": "Steel Plate",
    "slot": "body",
    "levelReq": 27,
    "attrReqs": {
      "str": 45,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Armour",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(10–20) to Strength",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(60–80) to Stun Threshold",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "50% of Physical Damage prevented Recouped as Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "kingsguard",
    "name": "Kingsguard",
    "baseType": "Full Plate",
    "slot": "body",
    "levelReq": 33,
    "attrReqs": {
      "str": 54,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(60–80) to maximum Life",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(5–10)% to all Elemental Resistances",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "25% reduced Endurance Charge Duration",
        "ranges": []
      },
      {
        "text": "Recover 5% of maximum Life for each Endurance Charge consumed",
        "ranges": []
      }
    ]
  },
  {
    "id": "greeds_embrace",
    "name": "Greed's Embrace",
    "baseType": "Vaal Cuirass",
    "slot": "body",
    "levelReq": 37,
    "attrReqs": {
      "str": 90,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "50% increased Strength Requirement",
        "ranges": []
      },
      {
        "text": "20% reduced Movement Speed",
        "ranges": []
      },
      {
        "text": "(100–150)% increased Armour",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(30–50)% increased Rarity of Items found",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(20–30)% to Fire Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "the_brass_dome",
    "name": "The Brass Dome",
    "baseType": "Champion Cuirass",
    "slot": "body",
    "levelReq": 58,
    "attrReqs": {
      "str": 92,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(500–600)% increased Armour",
        "ranges": [
          [
            500,
            600
          ]
        ]
      },
      {
        "text": "(-5–-1)% to all Maximum Elemental Resistances",
        "ranges": [
          [
            -5,
            -1
          ]
        ]
      },
      {
        "text": "+(200–300) to Stun Threshold",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "Take no Extra Damage from Critical Hits",
        "ranges": []
      }
    ]
  },
  {
    "id": "kaoms_heart",
    "name": "Kaom's Heart",
    "baseType": "Conqueror Plate",
    "slot": "body",
    "levelReq": 68,
    "attrReqs": {
      "str": 121,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(30–40)% increased Stun Threshold",
        "ranges": [
          [
            30,
            40
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+1500 to maximum Life",
        "ranges": []
      },
      {
        "text": "You have no Spirit",
        "ranges": []
      }
    ]
  },
  {
    "id": "bristleboar",
    "name": "Bristleboar",
    "baseType": "Leather Vest",
    "slot": "body",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "50% reduced Evasion Rating",
        "ranges": []
      },
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(3–5) Life Regeneration per second",
        "ranges": [
          [
            3,
            5
          ]
        ]
      },
      {
        "text": "Gain 10 Rage when Critically Hit by an Enemy",
        "ranges": []
      },
      {
        "text": "Gain 5 Rage when Hit by an Enemy",
        "ranges": []
      }
    ]
  },
  {
    "id": "foxshade",
    "name": "Foxshade",
    "baseType": "Quilted Vest",
    "slot": "body",
    "levelReq": 4,
    "attrReqs": {
      "str": 0,
      "dex": 10,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(50–70) to Evasion Rating",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "10% increased Movement Speed when on Full Life",
        "ranges": []
      },
      {
        "text": "100% increased Evasion Rating when on Full Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "ashrend",
    "name": "Ashrend",
    "baseType": "Pathfinder Coat",
    "slot": "body",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 21,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(10–20) to Strength",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(30–40)% to Fire Resistance",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Cannot be Ignited",
        "ranges": []
      },
      {
        "text": "-10 Physical Damage taken from Attack Hits",
        "ranges": []
      }
    ]
  },
  {
    "id": "sands_of_silk",
    "name": "Sands of Silk",
    "baseType": "Shrouded Vest",
    "slot": "body",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 28,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 5 Blink",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(50–100)% increased Evasion Rating",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(50–80) to maximum Mana",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–15)% to Fire Resistance",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(15–30)% increased Cooldown Recovery Rate",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "unique blink sand [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "briskwrap",
    "name": "Briskwrap",
    "baseType": "Rhoahide Coat",
    "slot": "body",
    "levelReq": 22,
    "attrReqs": {
      "str": 0,
      "dex": 37,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Evasion Rating",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "(40–60)% increased Flask Life Recovery rate",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(40–60)% increased Flask Mana Recovery rate",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Gain Deflection Rating equal to (20–30)% of Evasion Rating",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "dustbloom",
    "name": "Dustbloom",
    "baseType": "Studded Vest",
    "slot": "body",
    "levelReq": 26,
    "attrReqs": {
      "str": 0,
      "dex": 43,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Evasion Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Maximum 10 Fragile Regrowth",
        "ranges": []
      },
      {
        "text": "0.5% of maximum Life Regenerated per second per Fragile Regrowth",
        "ranges": []
      },
      {
        "text": "10% increased Mana Regeneration Rate per Fragile Regrowth",
        "ranges": []
      },
      {
        "text": "Lose all Fragile Regrowth when Hit",
        "ranges": []
      },
      {
        "text": "Gain 1 Fragile Regrowth each second",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_rat_cage",
    "name": "The Rat Cage",
    "baseType": "Scout's Vest",
    "slot": "body",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 40.5,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Evasion Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+300 to maximum Life",
        "ranges": []
      },
      {
        "text": "25% reduced Attribute Requirements",
        "ranges": []
      },
      {
        "text": "100% of Fire Damage from Hits taken as Physical Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "quatls_molt",
    "name": "Quatl's Molt",
    "baseType": "Serpentscale Coat",
    "slot": "body",
    "levelReq": 36,
    "attrReqs": {
      "str": 0,
      "dex": 59,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–80)% increased Evasion Rating",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(60–80) to maximum Life",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Gain Deflection Rating equal to (40–60)% of Evasion Rating",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(10–20) Life Regeneration per second",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Cannot be Poisoned",
        "ranges": []
      }
    ]
  },
  {
    "id": "queen_of_the_forest",
    "name": "Queen of the Forest",
    "baseType": "Smuggler Coat",
    "slot": "body",
    "levelReq": 51,
    "attrReqs": {
      "str": 0,
      "dex": 82,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(250–300)% increased Evasion Rating",
        "ranges": [
          [
            250,
            300
          ]
        ]
      },
      {
        "text": "(-15–-10)% to Fire Resistance",
        "ranges": [
          [
            -15,
            -10
          ]
        ]
      },
      {
        "text": "+(25–30)% to Cold Resistance",
        "ranges": [
          [
            25,
            30
          ]
        ]
      },
      {
        "text": "+(10–15)% to Lightning Resistance",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Increases Movement Speed by 25%, plus 1% per 600 Evasion Rating, up to a maximum of 75% Other Modifiers to Movement Speed except for Sprinting do not apply",
        "ranges": []
      }
    ]
  },
  {
    "id": "yriels_fostering",
    "name": "Yriel's Fostering",
    "baseType": "Strider Vest",
    "slot": "boots",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 83,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Evasion Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(80–120) to maximum Life",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(10–30) to Spirit",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "(40–60)% reduced Poison Duration on you",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(40–60)% reduced Duration of Bleeding on You",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "You can have two Companions of different types",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_auspex",
    "name": "The Auspex",
    "baseType": "Exquisite Vest",
    "slot": "body",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 242,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 15 Mist Raven",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(210–240)% increased Evasion Rating",
        "ranges": [
          [
            210,
            240
          ]
        ]
      },
      {
        "text": "+(70–120) to maximum Life",
        "ranges": [
          [
            70,
            120
          ]
        ]
      },
      {
        "text": "100% increased Attribute Requirements",
        "ranges": []
      },
      {
        "text": "Chance to Deflect is Lucky while on Low Life",
        "ranges": []
      },
      {
        "text": "Enemies in your Presence gain 1 Gruelling Madness each second",
        "ranges": []
      }
    ]
  },
  {
    "id": "hyrris_ire",
    "name": "Hyrri's Ire",
    "baseType": "Armoured Vest",
    "slot": "body",
    "levelReq": 73,
    "attrReqs": {
      "str": 0,
      "dex": 121,
      "int": 0
    },
    "implicits": [
      {
        "text": "(30–40)% increased Elemental Ailment Threshold",
        "ranges": [
          [
            30,
            40
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(100–150)% increased Evasion Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "Gain (10–20)% of Damage as Extra Cold Damage",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(30–40) to Dexterity",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "25% increased Freeze Duration on Enemies",
        "ranges": []
      },
      {
        "text": "Evasion Rating is doubled if you have not been Hit Recently",
        "ranges": []
      }
    ]
  },
  {
    "id": "ghostwrithe",
    "name": "Ghostwrithe",
    "baseType": "Tattered Robe",
    "slot": "body",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+100 to maximum Energy Shield",
        "ranges": []
      },
      {
        "text": "+(29–37)% to Chaos Resistance",
        "ranges": [
          [
            29,
            37
          ]
        ]
      },
      {
        "text": "35% of Maximum Life Converted to Energy Shield",
        "ranges": []
      }
    ]
  },
  {
    "id": "bitterbloom",
    "name": "Bitterbloom",
    "baseType": "Feathered Robe",
    "slot": "body",
    "levelReq": 5,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 11
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Energy Shield",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(50–100) to maximum Mana",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "50% increased Energy Shield Recharge Rate",
        "ranges": []
      },
      {
        "text": "Energy Shield Recharge starts when you use a Mana Flask",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_black_doubt",
    "name": "The Black Doubt",
    "baseType": "Hexer's Robe",
    "slot": "body",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 21
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Energy Shield",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(10–30) to Intelligence",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "+(10–20)% to Cold Resistance",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Damage over Time bypasses your Energy Shield While not on Full Life, Sacrifice 10% of maximum Mana per Second to Recover that much Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "necromantle",
    "name": "Necromantle",
    "baseType": "Bone Raiment",
    "slot": "body",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 28
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Mana",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Minions gain (20–30)% of their maximum Life as Extra maximum Energy Shield",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Minions have +(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Minions Revive 50% faster",
        "ranges": []
      }
    ]
  },
  {
    "id": "cloak_of_flame",
    "name": "Cloak of Flame",
    "baseType": "Silk Robe",
    "slot": "body",
    "levelReq": 22,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 37
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(30–50) to maximum Energy Shield",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(30–50)% to Fire Resistance",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(30–50)% reduced Ignite Duration on you",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "50% of Physical Damage taken as Fire Damage",
        "ranges": []
      },
      {
        "text": "25 to 35 Fire Thorns damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "temporalis",
    "name": "Temporalis",
    "baseType": "Silk Robe",
    "slot": "body",
    "levelReq": 64,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 37
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(100–150) to maximum Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(10–20)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(5–30)% of Damage taken Recouped as Life",
        "ranges": [
          [
            5,
            30
          ]
        ]
      },
      {
        "text": "(5–30)% of Damage taken Recouped as Mana",
        "ranges": [
          [
            5,
            30
          ]
        ]
      },
      {
        "text": "Skills have (-2–-1) seconds to Cooldown",
        "ranges": [
          [
            -2,
            -1
          ]
        ]
      }
    ]
  },
  {
    "id": "prayers_for_rain",
    "name": "Prayers for Rain",
    "baseType": "Keth Raiment",
    "slot": "body",
    "levelReq": 28,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 47
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Energy Shield",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(10–15) to Intelligence",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(10–20)% to Lightning Resistance",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "30% slower start of Energy Shield Recharge",
        "ranges": []
      },
      {
        "text": "Energy Shield Recharge is not interrupted by Damage if Recharge began Recently",
        "ranges": []
      }
    ]
  },
  {
    "id": "tetzlapokals_desire",
    "name": "Tetzlapokal's Desire",
    "baseType": "Votive Raiment",
    "slot": "body",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 54
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Life Recharges",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_covenant",
    "name": "The Covenant",
    "baseType": "Altar Robe",
    "slot": "body",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 65
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 10 Life Remnants",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(100–150)% increased Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(100–150) to maximum Life",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "10% of Spell Damage Leeched as Life",
        "ranges": []
      },
      {
        "text": "Skills Gain 100% of Mana Cost as Extra Life Cost",
        "ranges": []
      }
    ]
  },
  {
    "id": "gloamgown",
    "name": "Gloamgown",
    "baseType": "Elementalist Robe",
    "slot": "body",
    "levelReq": 45,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 72
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–140)% increased Energy Shield",
        "ranges": [
          [
            100,
            140
          ]
        ]
      },
      {
        "text": "+(30–40) to Spirit",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "+(25–35)% to Cold Resistance",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "1000% increased Energy Shield Recharge Rate",
        "ranges": []
      },
      {
        "text": "Your base Energy Shield Recharge Delay is 10 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "vis_mortis",
    "name": "Vis Mortis",
    "baseType": "Plated Raiment",
    "slot": "body",
    "levelReq": 58,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 92
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(70–100)% increased Energy Shield",
        "ranges": [
          [
            70,
            100
          ]
        ]
      },
      {
        "text": "+(70–100) to maximum Mana",
        "ranges": [
          [
            70,
            100
          ]
        ]
      },
      {
        "text": "Minions have 50% reduced maximum Life",
        "ranges": []
      },
      {
        "text": "Minions have Unholy Might",
        "ranges": []
      }
    ]
  },
  {
    "id": "cloak_of_defiance",
    "name": "Cloak of Defiance",
    "baseType": "Havoc Raiment",
    "slot": "body",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 121
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Energy Shield",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(100–150) to maximum Mana",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(50–100)% increased Mana Regeneration Rate",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "50% of Damage is taken from Mana before Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "silks_of_veneration",
    "name": "Silks of Veneration",
    "baseType": "Enlightened Robe",
    "slot": "body",
    "levelReq": 68,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 121
    },
    "implicits": [
      {
        "text": "(40–50)% increased Mana Regeneration Rate",
        "ranges": [
          [
            40,
            50
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(150–200)% increased Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(30–50) to Spirit",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(30–50)% increased Energy Shield Recharge Rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Current Energy Shield also grants Elemental Damage reduction",
        "ranges": []
      }
    ]
  },
  {
    "id": "coat_of_red",
    "name": "Coat of Red",
    "baseType": "Chain Mail",
    "slot": "body",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(80–100)% increased Armour and Evasion",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "+(80–100) to maximum Life",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "+(75–150) to Stun Threshold",
        "ranges": [
          [
            75,
            150
          ]
        ]
      },
      {
        "text": "25% chance to be inflicted with Bleeding when Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_barrow_dweller",
    "name": "The Barrow Dweller",
    "baseType": "Rogue Armour",
    "slot": "body",
    "levelReq": 11,
    "attrReqs": {
      "str": 13,
      "dex": 13,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Armour and Evasion",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "(-20–-10)% to Fire Resistance",
        "ranges": [
          [
            -20,
            -10
          ]
        ]
      },
      {
        "text": "+50% to Cold Resistance",
        "ranges": []
      },
      {
        "text": "Damage of Enemies Hitting you is Unlucky while you are on Low Life",
        "ranges": []
      },
      {
        "text": "50% chance to Avoid Death from Hits",
        "ranges": []
      }
    ]
  },
  {
    "id": "irongrasp",
    "name": "Irongrasp",
    "baseType": "Vagabond Armour",
    "slot": "body",
    "levelReq": 16,
    "attrReqs": {
      "str": 17,
      "dex": 17,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Armour and Evasion",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(100–150) to Stun Threshold",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "Iron Grip",
        "ranges": []
      },
      {
        "text": "Iron Will",
        "ranges": []
      }
    ]
  },
  {
    "id": "pariahs_embrace",
    "name": "Pariah's Embrace",
    "baseType": "Cloaked Mail",
    "slot": "body",
    "levelReq": 26,
    "attrReqs": {
      "str": 25,
      "dex": 25,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–80)% increased Armour and Evasion",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "+50 to Spirit",
        "ranges": []
      },
      {
        "text": "+(10–15) to all Attributes",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(10–15) Life Regeneration per second",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(20–40)% increased Mana Cost Efficiency",
        "ranges": [
          [
            20,
            40
          ]
        ]
      }
    ]
  },
  {
    "id": "belly_of_the_beast",
    "name": "Belly of the Beast",
    "baseType": "Explorer Armour",
    "slot": "body",
    "levelReq": 33,
    "attrReqs": {
      "str": 31,
      "dex": 31,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Armour and Evasion",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(100–150) to maximum Life",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(100–150) to Stun Threshold",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "Life Recovery from Flasks is instant",
        "ranges": []
      },
      {
        "text": "(25–30) to (35–40) Physical Thorns damage",
        "ranges": [
          [
            25,
            30
          ],
          [
            35,
            40
          ]
        ]
      }
    ]
  },
  {
    "id": "pragmatism",
    "name": "Pragmatism",
    "baseType": "Explorer Armour",
    "slot": "body",
    "levelReq": 52,
    "attrReqs": {
      "str": 31,
      "dex": 31,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(200–300)% increased Armour and Evasion",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+(10–20)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "-17% to Chaos Resistance",
        "ranges": []
      },
      {
        "text": "Charms use no Charges",
        "ranges": []
      }
    ]
  },
  {
    "id": "doryanis_prototype",
    "name": "Doryani's Prototype",
    "baseType": "Scale Mail",
    "slot": "body",
    "levelReq": 37,
    "attrReqs": {
      "str": 34,
      "dex": 34,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Armour and Evasion",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(60–80) to maximum Life",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+100% of Armour also applies to Lightning Damage",
        "ranges": []
      },
      {
        "text": "Enemies in your Presence have Lightning Resistance equal to yours",
        "ranges": []
      },
      {
        "text": "Lightning Resistance does not affect Lightning damage taken",
        "ranges": []
      }
    ]
  },
  {
    "id": "widows_reign",
    "name": "Widow's Reign",
    "baseType": "Knight Armour",
    "slot": "body",
    "levelReq": 45,
    "attrReqs": {
      "str": 41,
      "dex": 41,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Armour and Evasion",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(100–150) to maximum Life",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "+(200–300) to Ailment Threshold",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "Life that would be lost by taking Damage is instead Reserved until you take no Damage to Life for 3 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "perfidy",
    "name": "Perfidy",
    "baseType": "Knight Armour",
    "slot": "body",
    "levelReq": 45,
    "attrReqs": {
      "str": 41,
      "dex": 41,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(300–450)% increased Armour and Evasion",
        "ranges": [
          [
            300,
            450
          ]
        ]
      },
      {
        "text": "(10–30)% chance to Avoid Physical Damage from Hits",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "(10–30)% chance to Avoid Fire Damage from Hits",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "(10–30)% chance to Avoid Cold Damage from Hits",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "(10–30)% chance to Avoid Lightning Damage from Hits",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "(10–30)% chance to Avoid Chaos Damage from Hits",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "Enemies in your Presence are Intimidated",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_sunken_vessel",
    "name": "The Sunken Vessel",
    "baseType": "Knight Armour",
    "slot": "body",
    "levelReq": 45,
    "attrReqs": {
      "str": 41,
      "dex": 41,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(120–180)% increased Armour and Evasion",
        "ranges": [
          [
            120,
            180
          ]
        ]
      },
      {
        "text": "+(80–120) to maximum Life",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "30% reduced Life Recovery rate",
        "ranges": []
      },
      {
        "text": "33% chance to avoid Projectiles",
        "ranges": []
      },
      {
        "text": "Physical Damage of Enemies Hitting you is Unlucky",
        "ranges": []
      },
      {
        "text": "Convert All Armour to Evasion Rating",
        "ranges": []
      }
    ]
  },
  {
    "id": "lightning_coil",
    "name": "Lightning Coil",
    "baseType": "Ancestral Mail",
    "slot": "body",
    "levelReq": 50,
    "attrReqs": {
      "str": 44,
      "dex": 44,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 12 Valako's Charge",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–120)% increased Armour and Evasion",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(80–100) to maximum Life",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(-40–-30)% to Lightning Resistance",
        "ranges": [
          [
            -40,
            -30
          ]
        ]
      },
      {
        "text": "(30–50)% of Physical damage from Hits taken as Lightning damage",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "lightning coil replace damage hit effect index [110]",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_coming_calamity",
    "name": "The Coming Calamity",
    "baseType": "Heroic Armour",
    "slot": "body",
    "levelReq": 65,
    "attrReqs": {
      "str": 67,
      "dex": 67,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 15 Herald of Ash",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 15 Herald of Ice",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 15 Herald of Thunder",
        "ranges": []
      },
      {
        "text": "+(60–80) to maximum Life",
        "ranges": [
          [
            60,
            80
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(30–40)% to all Elemental Resistances",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Herald Skills deal (50–100)% increased Damage",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "Enemies in your Presence have no Elemental Resistances",
        "ranges": []
      }
    ]
  },
  {
    "id": "enfolding_dawn",
    "name": "Enfolding Dawn",
    "baseType": "Pilgrim Vestments",
    "slot": "body",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Armour and Energy Shield",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+100 to Spirit",
        "ranges": []
      },
      {
        "text": "+(5–15)% to all Elemental Resistances",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "Gain no inherent bonus from Intelligence",
        "ranges": []
      }
    ]
  },
  {
    "id": "icetomb",
    "name": "Icetomb",
    "baseType": "Mail Vestments",
    "slot": "body",
    "levelReq": 16,
    "attrReqs": {
      "str": 17,
      "dex": 0,
      "int": 17
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(30–40)% to Cold Resistance",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Gain Cold Thorns Damage equal to (10–18)% of your maximum Mana",
        "ranges": [
          [
            10,
            18
          ]
        ]
      }
    ]
  },
  {
    "id": "reverie",
    "name": "Reverie",
    "baseType": "Shaman Mantle",
    "slot": "body",
    "levelReq": 28,
    "attrReqs": {
      "str": 26,
      "dex": 0,
      "int": 26
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 8 Rite of Restoration",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(100–150)% increased Armour and Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "-10% to Fire Resistance",
        "ranges": []
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Cannot use Life Flasks Non-Unique Life Flasks apply their Effects constantly Recovery from Life Flasks cannot be Instant Recovery from your Life Flasks cannot be applied to anything other than you",
        "ranges": []
      },
      {
        "text": "(40–60)% less Life Flask Recovery",
        "ranges": [
          [
            40,
            60
          ]
        ]
      }
    ]
  },
  {
    "id": "soul_mantle",
    "name": "Soul Mantle",
    "baseType": "Sacrificial Mantle",
    "slot": "body",
    "levelReq": 36,
    "attrReqs": {
      "str": 33,
      "dex": 0,
      "int": 33
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(80–120)% increased Armour and Energy Shield",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+75 to Spirit",
        "ranges": []
      },
      {
        "text": "+10 to Strength",
        "ranges": []
      },
      {
        "text": "+15 to Intelligence",
        "ranges": []
      },
      {
        "text": "+1 to maximum number of Summoned Totems",
        "ranges": []
      },
      {
        "text": "Inflicts a random Curse on you when your Totems die, ignoring Curse limit",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_mutable_star",
    "name": "The Mutable Star",
    "baseType": "Cleric Vestments",
    "slot": "body",
    "levelReq": 45,
    "attrReqs": {
      "str": 41,
      "dex": 0,
      "int": 41
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Armour and Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(50–100)% increased Energy Shield Recharge Rate",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "(25–35) Life Regeneration per second",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "(30–50)% reduced Ignite Duration on you",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Defend against Hits as though you had 1% more Armour per 1% current Energy Shield",
        "ranges": []
      },
      {
        "text": "(30–50)% reduced Duration of Bleeding on You",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "waveshaper",
    "name": "Waveshaper",
    "baseType": "Tideseer Mantle",
    "slot": "body",
    "levelReq": 51,
    "attrReqs": {
      "str": 45,
      "dex": 0,
      "int": 45
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(100–200) to maximum Energy Shield",
        "ranges": [
          [
            100,
            200
          ]
        ]
      },
      {
        "text": "+(20–40) to Spirit",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "+(25–35)% to Fire Resistance",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "+(25–35)% to Cold Resistance",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "Increases and Reductions to Mana Regeneration Rate also apply to Energy Shield Recharge Rate",
        "ranges": []
      },
      {
        "text": "Gain (30–50)% of Maximum Mana as Armour",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "couture_of_crimson",
    "name": "Couture of Crimson",
    "baseType": "Gilded Vestments",
    "slot": "body",
    "levelReq": 52,
    "attrReqs": {
      "str": 46,
      "dex": 0,
      "int": 46
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Armour and Energy Shield",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "(10–15)% increased maximum Life",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Life Leech can Overflow Maximum Life",
        "ranges": []
      },
      {
        "text": "(40–60)% reduced Duration of Bleeding on You",
        "ranges": [
          [
            40,
            60
          ]
        ]
      }
    ]
  },
  {
    "id": "geofris_sanctuary",
    "name": "Geofri's Sanctuary",
    "baseType": "Revered Vestments",
    "slot": "body",
    "levelReq": 65,
    "attrReqs": {
      "str": 67,
      "dex": 0,
      "int": 67
    },
    "implicits": [
      {
        "text": "+1% to all Maximum Elemental Resistances",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(150–200)% increased Armour",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(10–20)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Your maximum Energy Shield is equal to (200–300)% of your Strength",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "Maximum Energy Shield cannot be Converted",
        "ranges": []
      },
      {
        "text": "Regenerate 2 Life per second for every 10 Intelligence",
        "ranges": []
      },
      {
        "text": "Zealot's Oath",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_unleashed",
    "name": "The Unleashed",
    "baseType": "Revered Vestments",
    "slot": "body",
    "levelReq": 65,
    "attrReqs": {
      "str": 67,
      "dex": 0,
      "int": 67
    },
    "implicits": [
      {
        "text": "+1% to all Maximum Elemental Resistances",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(150–250)% increased Armour and Energy Shield",
        "ranges": [
          [
            150,
            250
          ]
        ]
      },
      {
        "text": "+(10–20) to Strength and Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(15–25)% of Damage taken from Hits bypasses Energy Shield if Energy Shield is below half",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Gain 1 Runic Binding on Hit with Spells, no more than once every 0.5 seconds Lose all Runic Bindings when you Shapeshift to gain that much Unbound Potential",
        "ranges": []
      }
    ]
  },
  {
    "id": "sacrosanctum",
    "name": "Sacrosanctum",
    "baseType": "Corvus Mantle",
    "slot": "body",
    "levelReq": 68,
    "attrReqs": {
      "str": 67,
      "dex": 0,
      "int": 67
    },
    "implicits": [
      {
        "text": "+(20–30) to Spirit",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(80–120)% increased Armour and Energy Shield",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "(10–20)% of Damage taken Recouped as Life",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Damage taken Recouped as Life is also Recouped as Energy Shield",
        "ranges": []
      }
    ]
  },
  {
    "id": "loreweave",
    "name": "Loreweave",
    "baseType": "Ornate Ringmail",
    "slot": "body",
    "levelReq": 43,
    "attrReqs": {
      "str": 45,
      "dex": 0,
      "int": 45
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Adds (1–4) to (8–12) Physical Damage to Attacks",
        "ranges": [
          [
            1,
            4
          ],
          [
            8,
            12
          ]
        ]
      },
      {
        "text": "+(200–300) to Accuracy Rating",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+(20–30) to maximum Mana",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(6–15)% increased Rarity of Items found",
        "ranges": [
          [
            6,
            15
          ]
        ]
      },
      {
        "text": "+(2–5)% to Quality of all Skills",
        "ranges": [
          [
            2,
            5
          ]
        ]
      },
      {
        "text": "(7–10)% increased Cast Speed",
        "ranges": [
          [
            7,
            10
          ]
        ]
      },
      {
        "text": "Your Maximum Resistances are (75–80)%",
        "ranges": [
          [
            75,
            80
          ]
        ]
      },
      {
        "text": "Random 3 Unique Ring Modifiers",
        "ranges": []
      }
    ]
  },
  {
    "id": "decree_of_loyalty",
    "name": "Decree of Loyalty",
    "baseType": "Ancient Mail",
    "slot": "body",
    "levelReq": 70,
    "attrReqs": {
      "str": 67,
      "dex": 0,
      "int": 67
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(200–300)% increased Armour and Energy Shield",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+(15–25) to Strength and Intelligence",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(1–5)% to Maximum Chaos Resistance",
        "ranges": [
          [
            1,
            5
          ]
        ]
      },
      {
        "text": "Convert 1% of maximum Life to twice as much Armour per 1% Chaos Resistance above 0%",
        "ranges": []
      },
      {
        "text": "Defend with (150–200)% of Armour while you have Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "Damage over Time cannot bypass your Energy Shield",
        "ranges": []
      }
    ]
  },
  {
    "id": "apron_of_emiran",
    "name": "Apron of Emiran",
    "baseType": "Hermit Garb",
    "slot": "body",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(30–50)% increased Evasion and Energy Shield",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Bleeding you inflict is Aggravated",
        "ranges": []
      },
      {
        "text": "(40–60)% reduced Duration of Bleeding on You",
        "ranges": [
          [
            40,
            60
          ]
        ]
      }
    ]
  },
  {
    "id": "gloomform",
    "name": "Gloomform",
    "baseType": "Waxed Jacket",
    "slot": "body",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 13,
      "int": 13
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Evasion Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20)% to Fire Resistance",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "20% reduced Light Radius",
        "ranges": []
      },
      {
        "text": "You have a Smoke Cloud around you while stationary",
        "ranges": []
      }
    ]
  },
  {
    "id": "sierran_inheritance",
    "name": "Sierran Inheritance",
    "baseType": "Marabout Garb",
    "slot": "body",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 17,
      "int": 17
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–80)% increased Evasion and Energy Shield",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "-15% to Cold Resistance",
        "ranges": []
      },
      {
        "text": "+(30–40)% to Lightning Resistance",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "(15–30)% increased Energy Shield Recharge Rate",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "All Damage taken from Hits Contributes to Magnitude of Chill inflicted on you",
        "ranges": []
      },
      {
        "text": "The Effect of Chill on you is reversed",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_dancing_mirage",
    "name": "The Dancing Mirage",
    "baseType": "Wayfarer Jacket",
    "slot": "body",
    "levelReq": 28,
    "attrReqs": {
      "str": 0,
      "dex": 26,
      "int": 26
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–200)% increased Evasion and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(10–20)% to Lightning Resistance",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "20% less Damage taken if you have not been Hit Recently",
        "ranges": []
      },
      {
        "text": "100% increased Evasion Rating if you have been Hit Recently",
        "ranges": []
      }
    ]
  },
  {
    "id": "redflare_conduit",
    "name": "Redflare Conduit",
    "baseType": "Anchorite Garb",
    "slot": "body",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 31,
      "int": 31
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(50–70) to maximum Mana",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "+(20–30)% to Lightning Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "20% chance to gain a Power Charge on Hit",
        "ranges": []
      },
      {
        "text": "Lose all Power Charges on reaching maximum Power Charges",
        "ranges": []
      },
      {
        "text": "Shocks you when you reach maximum Power Charges",
        "ranges": []
      }
    ]
  },
  {
    "id": "zerphis_serape",
    "name": "Zerphi's Serape",
    "baseType": "Scalper's Jacket",
    "slot": "body",
    "levelReq": 39,
    "attrReqs": {
      "str": 0,
      "dex": 52.5,
      "int": 52.5
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–80)% increased Evasion and Energy Shield",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "50% increased Attribute Requirements",
        "ranges": []
      },
      {
        "text": "(-30–30)% reduced Life Regeneration rate",
        "ranges": [
          [
            -30,
            30
          ]
        ]
      },
      {
        "text": "(-30–30)% reduced Mana Regeneration Rate",
        "ranges": [
          [
            -30,
            30
          ]
        ]
      },
      {
        "text": "Soul Eater",
        "ranges": []
      }
    ]
  },
  {
    "id": "cospris_will",
    "name": "Cospri's Will",
    "baseType": "Assassin Garb",
    "slot": "body",
    "levelReq": 73,
    "attrReqs": {
      "str": 0,
      "dex": 67,
      "int": 67
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 17 Withering Presence",
        "ranges": []
      },
      {
        "text": "5% increased Movement Speed",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(150–200)% increased Evasion and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(23–29)% to Chaos Resistance",
        "ranges": [
          [
            23,
            29
          ]
        ]
      },
      {
        "text": "Curses you inflict have infinite Duration",
        "ranges": []
      },
      {
        "text": "Curses you inflict can affect Hexproof Enemies",
        "ranges": []
      },
      {
        "text": "Withered you inflict has infinite Duration",
        "ranges": []
      }
    ]
  },
  {
    "id": "wings_of_caelyn",
    "name": "Wings of Caelyn",
    "baseType": "Rusted Greathelm",
    "slot": "helmet",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+20 to Armour",
        "ranges": []
      },
      {
        "text": "(5–15)% increased Rarity of Items found",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Gain 1 Rage on Melee Hit",
        "ranges": []
      },
      {
        "text": "Every Rage also grants 1% increased Stun Threshold",
        "ranges": []
      }
    ]
  },
  {
    "id": "horns_of_bynden",
    "name": "Horns of Bynden",
    "baseType": "Rusted Greathelm",
    "slot": "helmet",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+20 to Armour",
        "ranges": []
      },
      {
        "text": "(5–15)% increased Rarity of Items found",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Every Rage also grants 1% increased Armour",
        "ranges": []
      },
      {
        "text": "Gain 1 Rage on Melee Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "ezomyte_peak",
    "name": "Ezomyte Peak",
    "baseType": "Soldier Greathelm",
    "slot": "helmet",
    "levelReq": 12,
    "attrReqs": {
      "str": 19,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Armour",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(50–80) to maximum Life",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "(3–6) Life Regeneration per second",
        "ranges": [
          [
            3,
            6
          ]
        ]
      },
      {
        "text": "(10–20)% increased Area of Effect",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Unwavering Stance",
        "ranges": []
      }
    ]
  },
  {
    "id": "black_sun_crest",
    "name": "Black Sun Crest",
    "baseType": "Wrapped Greathelm",
    "slot": "helmet",
    "levelReq": 16,
    "attrReqs": {
      "str": 25,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–80)% increased Armour",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "(5–15)% increased Strength",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "(5–15)% increased Dexterity",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "(5–15)% increased Intelligence",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "20% reduced Light Radius",
        "ranges": []
      }
    ]
  },
  {
    "id": "thrillsteel",
    "name": "Thrillsteel",
    "baseType": "Spired Greathelm",
    "slot": "helmet",
    "levelReq": 27,
    "attrReqs": {
      "str": 40,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Onslaught",
        "ranges": []
      }
    ]
  },
  {
    "id": "deidbell",
    "name": "Deidbell",
    "baseType": "Elite Greathelm",
    "slot": "helmet",
    "levelReq": 33,
    "attrReqs": {
      "str": 48,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Armour",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(10–20) to Strength",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(20–30)% increased Warcry Speed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Warcries Explode Corpses dealing 10% of their Life as Physical Damage",
        "ranges": []
      },
      {
        "text": "Warcry Skills have (20–30)% increased Area of Effect",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "corona_of_the_red_sun",
    "name": "Corona of the Red Sun",
    "baseType": "Warrior Greathelm",
    "slot": "helmet",
    "levelReq": 36,
    "attrReqs": {
      "str": 52,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(100–150) to Accuracy Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(60–80) to maximum Life",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(20–25)% to Fire Resistance",
        "ranges": [
          [
            20,
            25
          ]
        ]
      },
      {
        "text": "25% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Leeching Life from your Hits causes Allies in your Presence to also Leech the same amount of Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "blood_price",
    "name": "Blood Price",
    "baseType": "Fierce Greathelm",
    "slot": "helmet",
    "levelReq": 51,
    "attrReqs": {
      "str": 73,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(80–120)% increased Armour",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(10–15) Life Regeneration per second",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(100–150) to Stun Threshold",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(30–60)% increased Presence Area of Effect",
        "ranges": [
          [
            30,
            60
          ]
        ]
      },
      {
        "text": "Enemies in your Presence have at least 10% of Life Reserved",
        "ranges": []
      }
    ]
  },
  {
    "id": "innsmouth",
    "name": "Innsmouth",
    "baseType": "Shabby Hood",
    "slot": "helmet",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(20–30) to Evasion Rating",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "25% reduced maximum Mana",
        "ranges": []
      },
      {
        "text": "+(10–20)% to Cold Resistance",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(13–19)% to Chaos Resistance",
        "ranges": [
          [
            13,
            19
          ]
        ]
      },
      {
        "text": "100% increased Mana Regeneration Rate",
        "ranges": []
      }
    ]
  },
  {
    "id": "goldrim",
    "name": "Goldrim",
    "baseType": "Felt Cap",
    "slot": "helmet",
    "levelReq": 10,
    "attrReqs": {
      "str": 0,
      "dex": 17,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(30–50) to Evasion Rating",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "10% increased Rarity of Items found",
        "ranges": []
      },
      {
        "text": "+(25–35)% to all Elemental Resistances",
        "ranges": [
          [
            25,
            35
          ]
        ]
      }
    ]
  },
  {
    "id": "radiant_grief",
    "name": "Radiant Grief",
    "baseType": "Lace Hood",
    "slot": "helmet",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 25,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(80–100)% increased Evasion Rating",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "+(15–25)% to Fire Resistance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "30% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Enemies in your Presence are Ignited as though dealt 200 Base Fire Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "elevore",
    "name": "Elevore",
    "baseType": "Hunter Hood",
    "slot": "helmet",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 48,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–80)% increased Evasion Rating",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Charms gain 1 charge per Second",
        "ranges": []
      },
      {
        "text": "+(1–2) Charm Slots",
        "ranges": [
          [
            1,
            2
          ]
        ]
      }
    ]
  },
  {
    "id": "constricting_command",
    "name": "Constricting Command",
    "baseType": "Viper Cap",
    "slot": "helmet",
    "levelReq": 38,
    "attrReqs": {
      "str": 0,
      "dex": 54,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(80–120) to maximum Life",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(10–15) to all Attributes",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(8–12) Life Regeneration per second",
        "ranges": [
          [
            8,
            12
          ]
        ]
      },
      {
        "text": "Require (2–4) fewer enemies to be Surrounded",
        "ranges": [
          [
            2,
            4
          ]
        ]
      }
    ]
  },
  {
    "id": "the_black_insignia",
    "name": "The Black Insignia",
    "baseType": "Corsair Cap",
    "slot": "helmet",
    "levelReq": 45,
    "attrReqs": {
      "str": 0,
      "dex": 64,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(70–100)% increased Evasion Rating",
        "ranges": [
          [
            70,
            100
          ]
        ]
      },
      {
        "text": "(10–20)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(15–25)% to Lightning Resistance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Gain Tailwind on Critical Hit , no more than once per second",
        "ranges": []
      },
      {
        "text": "Lose all Tailwind when Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "starkonjas_head",
    "name": "Starkonja's Head",
    "baseType": "Leatherbound Hood",
    "slot": "helmet",
    "levelReq": 50,
    "attrReqs": {
      "str": 0,
      "dex": 71,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–200)% increased Evasion Rating",
        "ranges": [
          [
            100,
            200
          ]
        ]
      },
      {
        "text": "(15–25)% increased Critical Hit Chance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(30–40) to Dexterity",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "150% increased Global Evasion Rating when on Low Life",
        "ranges": []
      },
      {
        "text": "15% of Damage from Hits is taken from your Damageable Companion 's Life before you",
        "ranges": []
      }
    ]
  },
  {
    "id": "heatshiver",
    "name": "Heatshiver",
    "baseType": "Velvet Cap",
    "slot": "helmet",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 74,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–70)% increased Evasion Rating",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(20–30)% to Fire Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Gain 1% of Cold damage as Extra Fire damage per 1% Chill Magnitude on enemy",
        "ranges": []
      }
    ]
  },
  {
    "id": "myris_uxor",
    "name": "Myris Uxor",
    "baseType": "Covert Hood",
    "slot": "helmet",
    "levelReq": 56,
    "attrReqs": {
      "str": 0,
      "dex": 79,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(40–60)% increased Evasion Rating",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(100–150) to Accuracy Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "100% increased Culling Strike Threshold",
        "ranges": []
      }
    ]
  },
  {
    "id": "alphas_howl",
    "name": "Alpha's Howl",
    "baseType": "Armoured Cap",
    "slot": "helmet",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 91,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(80–100)% increased Evasion Rating",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "+100 to Spirit",
        "ranges": []
      },
      {
        "text": "+(50–75)% to Cold Resistance",
        "ranges": [
          [
            50,
            75
          ]
        ]
      },
      {
        "text": "Presence Radius is doubled",
        "ranges": []
      }
    ]
  },
  {
    "id": "crown_of_thorns",
    "name": "Crown of Thorns",
    "baseType": "Twig Circlet",
    "slot": "helmet",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(100–150) to maximum Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "Lose 5 Life when you use a Skill",
        "ranges": []
      },
      {
        "text": "(3–5) to (6–10) Physical Thorns damage",
        "ranges": [
          [
            3,
            5
          ],
          [
            6,
            10
          ]
        ]
      },
      {
        "text": "Pain Attunement",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_devouring_diadem",
    "name": "The Devouring Diadem",
    "baseType": "Wicker Tiara",
    "slot": "helmet",
    "levelReq": 10,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 17
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Energy Shield",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(13–19)% to Chaos Resistance",
        "ranges": [
          [
            13,
            19
          ]
        ]
      },
      {
        "text": "Every 3 seconds, Consume a nearby Corpse to Recover 20% of maximum Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "visage_of_ayah",
    "name": "Visage of Ayah",
    "baseType": "Beaded Circlet",
    "slot": "helmet",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 25
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–80)% increased Energy Shield",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "(10–15)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(20–30)% increased Critical Hit Chance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(10–20)% to Lightning Resistance",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Eldritch Battery",
        "ranges": []
      }
    ]
  },
  {
    "id": "sandstorm_visage",
    "name": "Sandstorm Visage",
    "baseType": "Chain Tiara",
    "slot": "helmet",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 38
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(80–120) to maximum Energy Shield",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Enemies in your Presence are Blinded",
        "ranges": []
      },
      {
        "text": "Every second, inflicts Critical Weakness on enemies in your Presence for (15–20) seconds",
        "ranges": [
          [
            15,
            20
          ]
        ]
      }
    ]
  },
  {
    "id": "mask_of_the_stitched_demon",
    "name": "Mask of the Stitched Demon",
    "baseType": "Feathered Tiara",
    "slot": "helmet",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 48
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(120–160)% increased Energy Shield",
        "ranges": [
          [
            120,
            160
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Cannot have Energy Shield",
        "ranges": []
      },
      {
        "text": "Regenerate 0.05 Life per second per Maximum Energy Shield",
        "ranges": []
      }
    ]
  },
  {
    "id": "atziris_disdain",
    "name": "Atziri's Disdain",
    "baseType": "Gold Circlet",
    "slot": "helmet",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 58
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "(10–20)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Gain (10–15)% of maximum Life as Extra maximum Energy Shield",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "10% of Damage taken bypasses Energy Shield",
        "ranges": []
      }
    ]
  },
  {
    "id": "crown_of_eyes",
    "name": "Crown of Eyes",
    "baseType": "Vermeil Circlet",
    "slot": "helmet",
    "levelReq": 45,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 64
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–140)% increased Energy Shield",
        "ranges": [
          [
            100,
            140
          ]
        ]
      },
      {
        "text": "+(150–200) to Accuracy Rating",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(10–15) to all Attributes",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "-10% to Fire Resistance",
        "ranges": []
      },
      {
        "text": "Increases and Reductions to Spell damage also apply to Attacks",
        "ranges": []
      }
    ]
  },
  {
    "id": "scolds_bridle",
    "name": "Scold's Bridle",
    "baseType": "Jade Tiara",
    "slot": "helmet",
    "levelReq": 50,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 71
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(75–150) to maximum Energy Shield",
        "ranges": [
          [
            75,
            150
          ]
        ]
      },
      {
        "text": "(60–100)% increased Spell Damage",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(80–100) to maximum Mana",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "15% reduced Cast Speed",
        "ranges": []
      },
      {
        "text": "Take (25–100)% of Mana Costs you pay for Skills as Physical Damage",
        "ranges": [
          [
            25,
            100
          ]
        ]
      }
    ]
  },
  {
    "id": "indigon",
    "name": "Indigon",
    "baseType": "Magus Tiara",
    "slot": "helmet",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 91
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–140)% increased Energy Shield",
        "ranges": [
          [
            100,
            140
          ]
        ]
      },
      {
        "text": "+(80–120) to maximum Mana",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(5–10)% increased Cost of Skills for each 200 total Mana Spent Recently",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "(10–15)% increased Spell damage for each 200 total Mana you have Spent Recently",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Mana Recovery other than Regeneration cannot Recover Mana",
        "ranges": []
      }
    ]
  },
  {
    "id": "greymake",
    "name": "Greymake",
    "baseType": "Brimmed Helm",
    "slot": "helmet",
    "levelReq": 5,
    "attrReqs": {
      "str": 7,
      "dex": 7,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(30–50) to Strength",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(30–50) to Dexterity",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(30–50) to Intelligence",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "-1 to all Attributes per Level",
        "ranges": []
      },
      {
        "text": "Has 4 Augment Sockets (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "erians_cobble",
    "name": "Erian's Cobble",
    "baseType": "Guarded Helm",
    "slot": "helmet",
    "levelReq": 11,
    "attrReqs": {
      "str": 11,
      "dex": 11,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(0–40) to Armour",
        "ranges": [
          [
            0,
            40
          ]
        ]
      },
      {
        "text": "+(0–30) to Evasion Rating",
        "ranges": [
          [
            0,
            30
          ]
        ]
      },
      {
        "text": "+(0–20) to maximum Energy Shield",
        "ranges": [
          [
            0,
            20
          ]
        ]
      },
      {
        "text": "+(0–60) to Accuracy Rating",
        "ranges": [
          [
            0,
            60
          ]
        ]
      },
      {
        "text": "+(0–30) to maximum Life",
        "ranges": [
          [
            0,
            30
          ]
        ]
      },
      {
        "text": "+(0–20) to maximum Mana",
        "ranges": [
          [
            0,
            20
          ]
        ]
      },
      {
        "text": "(0–20)% increased Rarity of Items found",
        "ranges": [
          [
            0,
            20
          ]
        ]
      },
      {
        "text": "(0–30)% increased Critical Hit Chance",
        "ranges": [
          [
            0,
            30
          ]
        ]
      },
      {
        "text": "+(0–10) to Strength",
        "ranges": [
          [
            0,
            10
          ]
        ]
      },
      {
        "text": "+(0–10) to Dexterity",
        "ranges": [
          [
            0,
            10
          ]
        ]
      },
      {
        "text": "+(0–10) to Intelligence",
        "ranges": [
          [
            0,
            10
          ]
        ]
      },
      {
        "text": "+(0–10)% to Fire Resistance",
        "ranges": [
          [
            0,
            10
          ]
        ]
      },
      {
        "text": "+(0–10)% to Cold Resistance",
        "ranges": [
          [
            0,
            10
          ]
        ]
      },
      {
        "text": "+(0–10)% to Lightning Resistance",
        "ranges": [
          [
            0,
            10
          ]
        ]
      },
      {
        "text": "(0–6) Life Regeneration per second",
        "ranges": [
          [
            0,
            6
          ]
        ]
      }
    ]
  },
  {
    "id": "ironride",
    "name": "Ironride",
    "baseType": "Visored Helm",
    "slot": "helmet",
    "levelReq": 16,
    "attrReqs": {
      "str": 15,
      "dex": 15,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–80)% increased Armour and Evasion",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Life",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Mana",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(10–15)% to Lightning Resistance",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "You have no Accuracy Penalty at Distance",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_smiling_knight",
    "name": "The Smiling Knight",
    "baseType": "Cowled Helm",
    "slot": "helmet",
    "levelReq": 26,
    "attrReqs": {
      "str": 22,
      "dex": 22,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(50–100) to Accuracy Rating",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "(150–200)% increased Armour and Evasion",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "(15–25)% increased Critical Hit Chance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Aggravate Bleeding on targets you Critically Hit with Attacks",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_vile_knight",
    "name": "The Vile Knight",
    "baseType": "Shielded Helm",
    "slot": "helmet",
    "levelReq": 33,
    "attrReqs": {
      "str": 27,
      "dex": 27,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Armour and Evasion",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(75–125) to Accuracy Rating",
        "ranges": [
          [
            75,
            125
          ]
        ]
      },
      {
        "text": "(10–15) Life Regeneration per second",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Deal 4% increased Damage with Hits to Rare or Unique Enemies for each second they've ever been in your Presence , up to a maximum of 200%",
        "ranges": []
      }
    ]
  },
  {
    "id": "assailum",
    "name": "Assailum",
    "baseType": "Closed Helm",
    "slot": "helmet",
    "levelReq": 45,
    "attrReqs": {
      "str": 36,
      "dex": 36,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(200–300)% increased Armour and Evasion",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+(200–400) to Accuracy Rating",
        "ranges": [
          [
            200,
            400
          ]
        ]
      },
      {
        "text": "(30–50)% increased Critical Hit Chance",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Skills have a (100–150)% longer Perfect Timing window",
        "ranges": [
          [
            100,
            150
          ]
        ]
      }
    ]
  },
  {
    "id": "the_bringer_of_rain",
    "name": "The Bringer of Rain",
    "baseType": "Decorated Helm",
    "slot": "helmet",
    "levelReq": 52,
    "attrReqs": {
      "str": 41,
      "dex": 41,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(600–800)% increased Armour and Evasion",
        "ranges": [
          [
            600,
            800
          ]
        ]
      },
      {
        "text": "+(200–300) to Accuracy Rating",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "100% increased Critical Hit Chance",
        "ranges": []
      },
      {
        "text": "(30–60) Life Regeneration per second",
        "ranges": [
          [
            30,
            60
          ]
        ]
      },
      {
        "text": "Can't use Body Armour",
        "ranges": []
      },
      {
        "text": "You can wield Two-Handed Axes , Maces and Swords in one hand",
        "ranges": []
      },
      {
        "text": "This item gains bonuses from Socketed Items as though it was a Body Armour",
        "ranges": []
      },
      {
        "text": "Has 4 Augment Sockets (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "decree_of_acuity",
    "name": "Decree of Acuity",
    "baseType": "Ancient Visor",
    "slot": "helmet",
    "levelReq": 65,
    "attrReqs": {
      "str": 59,
      "dex": 59,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–250)% increased Armour and Evasion",
        "ranges": [
          [
            150,
            250
          ]
        ]
      },
      {
        "text": "+(25–35) to Dexterity",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "Gain (15–30)% of Evasion Rating as extra Armour",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "You are Blind",
        "ranges": []
      },
      {
        "text": "The Effect of Blind on you is reversed",
        "ranges": []
      }
    ]
  },
  {
    "id": "crown_of_the_victor",
    "name": "Crown of the Victor",
    "baseType": "Iron Crown",
    "slot": "helmet",
    "levelReq": 5,
    "attrReqs": {
      "str": 7,
      "dex": 0,
      "int": 7
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(10–15)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+1 to Level of all Skills",
        "ranges": []
      },
      {
        "text": "Gain 10 Life per enemy killed",
        "ranges": []
      },
      {
        "text": "Gain 10 Mana per enemy killed",
        "ranges": []
      }
    ]
  },
  {
    "id": "bronzebeard",
    "name": "Bronzebeard",
    "baseType": "Horned Crown",
    "slot": "helmet",
    "levelReq": 10,
    "attrReqs": {
      "str": 10,
      "dex": 0,
      "int": 10
    },
    "implicits": [],
    "explicits": [
      {
        "text": "10% reduced Movement Speed",
        "ranges": []
      },
      {
        "text": "(50–100)% increased Armour and Energy Shield",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+100 to maximum Life",
        "ranges": []
      },
      {
        "text": "(35–50)% reduced Effect of Chill on you",
        "ranges": [
          [
            35,
            50
          ]
        ]
      },
      {
        "text": "(35–50)% reduced Magnitude of Ignite on you",
        "ranges": [
          [
            35,
            50
          ]
        ]
      },
      {
        "text": "(35–50)% reduced effect of Shock on you",
        "ranges": [
          [
            35,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "crown_of_the_pale_king",
    "name": "Crown of the Pale King",
    "baseType": "Cultist Crown",
    "slot": "helmet",
    "levelReq": 16,
    "attrReqs": {
      "str": 15,
      "dex": 0,
      "int": 15
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Armour and Energy Shield",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(40–80) to maximum Life",
        "ranges": [
          [
            40,
            80
          ]
        ]
      },
      {
        "text": "10% increased Rarity of Items found",
        "ranges": []
      },
      {
        "text": "(10–15) to (20–25) Physical Thorns damage",
        "ranges": [
          [
            10,
            15
          ],
          [
            20,
            25
          ]
        ]
      },
      {
        "text": "Thorns can Retaliate against all Hits",
        "ranges": []
      }
    ]
  },
  {
    "id": "veil_of_the_night",
    "name": "Veil of the Night",
    "baseType": "Martyr Crown",
    "slot": "helmet",
    "levelReq": 28,
    "attrReqs": {
      "str": 23,
      "dex": 0,
      "int": 23
    },
    "implicits": [],
    "explicits": [
      {
        "text": "50% increased maximum Life",
        "ranges": []
      },
      {
        "text": "+(10–20) to all Attributes",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "40% reduced Light Radius",
        "ranges": []
      },
      {
        "text": "You have no Elemental Resistances",
        "ranges": []
      }
    ]
  },
  {
    "id": "cornathaum",
    "name": "Cornathaum",
    "baseType": "Heavy Crown",
    "slot": "helmet",
    "levelReq": 33,
    "attrReqs": {
      "str": 27,
      "dex": 0,
      "int": 27
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(10–20)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(40–50) to Intelligence",
        "ranges": [
          [
            40,
            50
          ]
        ]
      },
      {
        "text": "30% increased Light Radius",
        "ranges": []
      },
      {
        "text": "5% increased Experience gain",
        "ranges": []
      }
    ]
  },
  {
    "id": "keeper_of_the_arc",
    "name": "Keeper of the Arc",
    "baseType": "Spiritbone Crown",
    "slot": "helmet",
    "levelReq": 62,
    "attrReqs": {
      "str": 36,
      "dex": 0,
      "int": 36
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(240–340)% increased Armour and Energy Shield",
        "ranges": [
          [
            240,
            340
          ]
        ]
      },
      {
        "text": "(15–25) Life Regeneration per second",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "(15–25)% increased Mana Regeneration Rate",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Alternating every 5 seconds: Take 40% less Damage from Hits Take 40% less Damage over time",
        "ranges": []
      }
    ]
  },
  {
    "id": "vestige_of_darkness",
    "name": "Vestige of Darkness",
    "baseType": "Tenebrous Crown",
    "slot": "helmet",
    "levelReq": 65,
    "attrReqs": {
      "str": 59,
      "dex": 0,
      "int": 59
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–200)% increased Armour and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength and Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Physical damage from Hits Contributes to Chill Magnitude and Freeze Buildup",
        "ranges": []
      },
      {
        "text": "Enemies in your Presence are Blinded",
        "ranges": []
      },
      {
        "text": "The Bodach haunts your Presence",
        "ranges": []
      },
      {
        "text": "the wendigo manifestation delay randomisation ms [500]",
        "ranges": []
      },
      {
        "text": "the wendigo manifests +% faster per enemy power in your presence [5]",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_hollow_mask",
    "name": "The Hollow Mask",
    "baseType": "Hewn Mask",
    "slot": "helmet",
    "levelReq": 5,
    "attrReqs": {
      "str": 0,
      "dex": 7,
      "int": 7
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 2 Wildwood's Gifts",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(60–80) to maximum Life",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "15% additional Physical Damage Reduction",
        "ranges": []
      },
      {
        "text": "-10% to all Elemental Resistances",
        "ranges": []
      },
      {
        "text": "+13% to Chaos Resistance",
        "ranges": []
      },
      {
        "text": "Remnants you create affect Allies in your Presence as well as you when collected",
        "ranges": []
      },
      {
        "text": "(80–100)% increased Reservation Efficiency of Remnant Skills",
        "ranges": [
          [
            80,
            100
          ]
        ]
      }
    ]
  },
  {
    "id": "mask_of_the_sanguimancer",
    "name": "Mask of the Sanguimancer",
    "baseType": "Face Mask",
    "slot": "helmet",
    "levelReq": 10,
    "attrReqs": {
      "str": 0,
      "dex": 10,
      "int": 10
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(20–25) to Evasion Rating",
        "ranges": [
          [
            20,
            25
          ]
        ]
      },
      {
        "text": "+(10–15) to maximum Energy Shield",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(20–40)% increased Critical Hit Chance for Spells",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "+(10–20) to Strength",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Blood Magic",
        "ranges": []
      }
    ]
  },
  {
    "id": "leer_cast",
    "name": "Leer Cast",
    "baseType": "Hooded Mask",
    "slot": "helmet",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 15,
      "int": 15
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(30–50) to maximum Life",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Mana",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Allies in your Presence deal 50% increased Damage",
        "ranges": []
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "25% reduced Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "atsaks_sight",
    "name": "Atsak's Sight",
    "baseType": "Veiled Mask",
    "slot": "helmet",
    "levelReq": 28,
    "attrReqs": {
      "str": 0,
      "dex": 23,
      "int": 23
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Evasion and Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(30–40)% increased Critical Hit Chance",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Critical Hits Poison the enemy",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_vertex",
    "name": "The Vertex",
    "baseType": "Tribal Mask",
    "slot": "helmet",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Has no Attribute Requirements",
        "ranges": []
      },
      {
        "text": "(100–150)% increased Evasion and Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(20–30)% increased Critical Hit Chance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(13–17)% to Chaos Resistance",
        "ranges": [
          [
            13,
            17
          ]
        ]
      },
      {
        "text": "Skill Gems have no Attribute Requirements",
        "ranges": []
      }
    ]
  },
  {
    "id": "glimpse_of_chaos",
    "name": "Glimpse of Chaos",
    "baseType": "Tribal Mask",
    "slot": "helmet",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 27,
      "int": 27
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Can be modified while Corrupted",
        "ranges": []
      },
      {
        "text": "+(50–150) to maximum Life",
        "ranges": [
          [
            50,
            150
          ]
        ]
      },
      {
        "text": "+(50–150) to maximum Mana",
        "ranges": [
          [
            50,
            150
          ]
        ]
      },
      {
        "text": "(-30–30)% to Fire Resistance",
        "ranges": [
          [
            -30,
            30
          ]
        ]
      },
      {
        "text": "(-30–30)% to Cold Resistance",
        "ranges": [
          [
            -30,
            30
          ]
        ]
      },
      {
        "text": "(-30–30)% to Lightning Resistance",
        "ranges": [
          [
            -30,
            30
          ]
        ]
      },
      {
        "text": "Chaos Resistance is zero",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_three_dragons",
    "name": "The Three Dragons",
    "baseType": "Solid Mask",
    "slot": "helmet",
    "levelReq": 45,
    "attrReqs": {
      "str": 0,
      "dex": 36,
      "int": 36
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(40–60)% increased Evasion and Energy Shield",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(10–20)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Fire Damage from Hits Contributes to Shock Chance instead of Flammability and Ignite Magnitudes",
        "ranges": []
      },
      {
        "text": "Cold Damage from Hits Contributes to Flammability and Ignite Magnitudes instead of Chill Magnitude or Freeze Buildup",
        "ranges": []
      },
      {
        "text": "Lightning Damage from Hits Contributes to Freeze Buildup instead of Shock Chance",
        "ranges": []
      }
    ]
  },
  {
    "id": "mind_of_the_council",
    "name": "Mind of the Council",
    "baseType": "Death Mask",
    "slot": "helmet",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 50,
      "int": 50
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–200)% increased Evasion and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(60–90) to maximum Mana",
        "ranges": [
          [
            60,
            90
          ]
        ]
      },
      {
        "text": "+(20–30)% to Lightning Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Attacks cost an additional 6% of your maximum Mana",
        "ranges": []
      },
      {
        "text": "Attacks have Added maximum Lightning Damage equal to (6–9)% of maximum Mana",
        "ranges": [
          [
            6,
            9
          ]
        ]
      }
    ]
  },
  {
    "id": "facebreaker",
    "name": "Facebreaker",
    "baseType": "Stocky Mitts",
    "slot": "gloves",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Has 8 to 12 Physical damage, +3 to +4 per Boss's Face Broken",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Stun Buildup",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "1% more Unarmed Damage per 5 Strength",
        "ranges": []
      },
      {
        "text": "+0.3 metres to Melee Strike Range while Unarmed",
        "ranges": []
      },
      {
        "text": "+1 to Armour per Strength",
        "ranges": []
      },
      {
        "text": "Can Attack as though using a One Handed Mace while both of your hand slots are empty Unarmed Attacks that would use an Equipped One Hand Mace 's damage use this Item's damage",
        "ranges": []
      },
      {
        "text": "local display facebreaker damage imitation weapon [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "treefingers",
    "name": "Treefingers",
    "baseType": "Riveted Mitts",
    "slot": "gloves",
    "levelReq": 11,
    "attrReqs": {
      "str": 16,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(30–60)% increased Armour",
        "ranges": [
          [
            30,
            60
          ]
        ]
      },
      {
        "text": "Adds (6–10) to (12–16) Physical Damage to Attacks",
        "ranges": [
          [
            6,
            10
          ],
          [
            12,
            16
          ]
        ]
      },
      {
        "text": "5% reduced Attack Speed",
        "ranges": []
      },
      {
        "text": "+(15–20) to Strength",
        "ranges": [
          [
            15,
            20
          ]
        ]
      },
      {
        "text": "(20–30)% increased Stun Buildup",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Giant's Blood",
        "ranges": []
      }
    ]
  },
  {
    "id": "lochtonial_caress",
    "name": "Lochtonial Caress",
    "baseType": "Tempered Mitts",
    "slot": "gloves",
    "levelReq": 16,
    "attrReqs": {
      "str": 22,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(10–15)% increased Skill Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(15–25) to Armour",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(10–15)% reduced maximum Mana",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Share Charges with Allies in your Presence",
        "ranges": []
      }
    ]
  },
  {
    "id": "dreadfist",
    "name": "Dreadfist",
    "baseType": "Bolstered Mitts",
    "slot": "gloves",
    "levelReq": 27,
    "attrReqs": {
      "str": 35,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Armour",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "(20–30)% increased Critical Damage Bonus",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Critical Hits inflict Impale",
        "ranges": []
      },
      {
        "text": "Critical Hits cannot Extract Impale",
        "ranges": []
      },
      {
        "text": "(20–31) to (32–49) Physical Thorns damage",
        "ranges": [
          [
            20,
            31
          ],
          [
            32,
            49
          ]
        ]
      }
    ]
  },
  {
    "id": "atziris_acuity",
    "name": "Atziri's Acuity",
    "baseType": "Moulded Mitts",
    "slot": "gloves",
    "levelReq": 33,
    "attrReqs": {
      "str": 42,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 9 Herald of the Royal Queen",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(150–200)% increased Armour",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(100–150) to maximum Life",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "Leech 10% of Physical Attack Damage as Life",
        "ranges": []
      },
      {
        "text": "10% of Physical damage dealt by your Hits causes Blood Loss",
        "ranges": []
      },
      {
        "text": "Vaal Pact",
        "ranges": []
      }
    ]
  },
  {
    "id": "hateforge",
    "name": "Hateforge",
    "baseType": "Moulded Mitts",
    "slot": "gloves",
    "levelReq": 60,
    "attrReqs": {
      "str": 42,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(300–400)% increased Armour",
        "ranges": [
          [
            300,
            400
          ]
        ]
      },
      {
        "text": "Gain (3–6) Rage on Hit",
        "ranges": [
          [
            3,
            6
          ]
        ]
      },
      {
        "text": "Gain a random Charge on reaching Maximum Rage , no more than once every (3–6) seconds",
        "ranges": [
          [
            3,
            6
          ]
        ]
      },
      {
        "text": "Lose all Rage on reaching Maximum Rage",
        "ranges": []
      },
      {
        "text": "(-10–10) to Maximum Rage",
        "ranges": [
          [
            -10,
            10
          ]
        ]
      }
    ]
  },
  {
    "id": "empires_grasp",
    "name": "Empire's Grasp",
    "baseType": "Titan Mitts",
    "slot": "gloves",
    "levelReq": 52,
    "attrReqs": {
      "str": 64,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–200)% increased Armour",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Gain (30–50) Life per enemy killed",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(10–20)% increased Global Physical Damage",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Knockback direction is reversed",
        "ranges": []
      }
    ]
  },
  {
    "id": "northpaw",
    "name": "Northpaw",
    "baseType": "Suede Bracers",
    "slot": "gloves",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(15–25) to Evasion Rating",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Adds (3–5) to (8–10) Physical Damage to Attacks",
        "ranges": [
          [
            3,
            5
          ],
          [
            8,
            10
          ]
        ]
      },
      {
        "text": "(10–15)% increased Critical Damage Bonus",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Base Critical Hit Chance for Attacks with Weapons is 7%",
        "ranges": []
      }
    ]
  },
  {
    "id": "grip_of_winter",
    "name": "Grip of Winter",
    "baseType": "Firm Bracers",
    "slot": "gloves",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 16,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(30–50)% increased Evasion Rating",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Adds (3–5) to (6–8) Cold damage to Attacks",
        "ranges": [
          [
            3,
            5
          ],
          [
            6,
            8
          ]
        ]
      },
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(40–50)% increased Freeze Buildup",
        "ranges": [
          [
            40,
            50
          ]
        ]
      },
      {
        "text": "(20–30)% increased Magnitude of Chill you inflict",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "idle_hands",
    "name": "Idle Hands",
    "baseType": "Sectioned Bracers",
    "slot": "gloves",
    "levelReq": 28,
    "attrReqs": {
      "str": 0,
      "dex": 36,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(40–60)% increased Evasion Rating",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(60–100) to Accuracy Rating",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(5–10) to Intelligence",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "25% increased Attack Speed while on Full Mana",
        "ranges": []
      },
      {
        "text": "You count as on Full Mana while at 90% of maximum Mana or above",
        "ranges": []
      }
    ]
  },
  {
    "id": "snakebite",
    "name": "Snakebite",
    "baseType": "Spined Bracers",
    "slot": "gloves",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 42,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(40–60)% increased Evasion Rating",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(7–17)% to Chaos Resistance",
        "ranges": [
          [
            7,
            17
          ]
        ]
      },
      {
        "text": "(6–10) Life Regeneration per second",
        "ranges": [
          [
            6,
            10
          ]
        ]
      },
      {
        "text": "(20–30)% chance to Poison on Hit",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Targets can be affected by +1 of your Poisons at the same time",
        "ranges": []
      }
    ]
  },
  {
    "id": "maligaros_virtuosity",
    "name": "Maligaro's Virtuosity",
    "baseType": "Fine Bracers",
    "slot": "gloves",
    "levelReq": 45,
    "attrReqs": {
      "str": 0,
      "dex": 56,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–80)% increased Evasion Rating",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "(20–30)% increased Critical Hit Chance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "5% increased Attack Speed",
        "ranges": []
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Your Critical Hit Chance cannot be Rerolled",
        "ranges": []
      },
      {
        "text": "Your Critical Damage Bonus is 250%",
        "ranges": []
      }
    ]
  },
  {
    "id": "horrors_flight",
    "name": "Horror's Flight",
    "baseType": "Engraved Bracers",
    "slot": "gloves",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 80,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 15 Crushing Fear",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(200–300)% increased Evasion Rating",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "(7–17)% increased Attack Speed",
        "ranges": [
          [
            7,
            17
          ]
        ]
      },
      {
        "text": "+(13–23) to Dexterity",
        "ranges": [
          [
            13,
            23
          ]
        ]
      },
      {
        "text": "Adds (19–23) to (31–37) Chaos Damage to Attacks",
        "ranges": [
          [
            19,
            23
          ],
          [
            31,
            37
          ]
        ]
      },
      {
        "text": "Gain 1 Fear Incarnate when you Cull a target",
        "ranges": []
      }
    ]
  },
  {
    "id": "painters_servant",
    "name": "Painter's Servant",
    "baseType": "Torn Gloves",
    "slot": "gloves",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Gain (5–10)% of Elemental Damage as Extra Cold Damage",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Gain (5–10)% of Elemental Damage as Extra Fire Damage",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Gain (5–10)% of Elemental Damage as Extra Lightning Damage",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "33% of Elemental Damage Converted to Cold Damage",
        "ranges": []
      },
      {
        "text": "33% of Elemental Damage Converted to Fire Damage",
        "ranges": []
      },
      {
        "text": "33% of Elemental Damage Converted to Lightning Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "candlemaker",
    "name": "Candlemaker",
    "baseType": "Sombre Gloves",
    "slot": "gloves",
    "levelReq": 12,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 17
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–80)% increased Energy Shield",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "(20–40)% increased Fire Damage",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "(10–20)% reduced Cold Damage",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(20–40)% to Fire Resistance",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "(-20–-10)% to Cold Resistance",
        "ranges": [
          [
            -20,
            -10
          ]
        ]
      },
      {
        "text": "Flammability Magnitude is doubled",
        "ranges": []
      }
    ]
  },
  {
    "id": "doedres_tenure",
    "name": "Doedre's Tenure",
    "baseType": "Stitched Gloves",
    "slot": "gloves",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 22
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(20–30) to maximum Energy Shield",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "100% increased Spell Damage",
        "ranges": []
      },
      {
        "text": "(15–25)% reduced Cast Speed",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(10–15) to Intelligence",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ]
  },
  {
    "id": "kitokos_current",
    "name": "Kitoko's Current",
    "baseType": "Jewelled Gloves",
    "slot": "gloves",
    "levelReq": 26,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 34
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(30–50)% increased Energy Shield",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(10–15)% reduced Attack and Cast Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Lightning damage from Hits Contributes to Electrocution Buildup",
        "ranges": []
      }
    ]
  },
  {
    "id": "demon_stitcher",
    "name": "Demon Stitcher",
    "baseType": "Intricate Gloves",
    "slot": "gloves",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 42
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(40–60) to maximum Energy Shield",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(80–120) to maximum Life",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(6–12)% increased Cast Speed",
        "ranges": [
          [
            6,
            12
          ]
        ]
      },
      {
        "text": "Sacrifice (5–15)% of maximum Life to gain that much Energy Shield when you Cast a Spell",
        "ranges": [
          [
            5,
            15
          ]
        ]
      }
    ]
  },
  {
    "id": "nightscale",
    "name": "Nightscale",
    "baseType": "Pauascale Gloves",
    "slot": "gloves",
    "levelReq": 45,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 56
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Energy Shield",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "(30–50)% increased Critical Hit Chance",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "150% increased Mana Regeneration Rate if you've dealt a Critical Hit Recently",
        "ranges": []
      },
      {
        "text": "Cannot Regenerate Mana if you haven't dealt a Critical Hit Recently",
        "ranges": []
      }
    ]
  },
  {
    "id": "leopolds_applause",
    "name": "Leopold's Applause",
    "baseType": "Embroidered Gloves",
    "slot": "gloves",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 64
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Energy Shield",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "(10–15)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Damage Penetrates 10% Elemental Resistances",
        "ranges": []
      },
      {
        "text": "Your Hits can Penetrate Elemental Resistances down to a minimum of -50%",
        "ranges": []
      }
    ]
  },
  {
    "id": "jarngreipr",
    "name": "Jarngreipr",
    "baseType": "Ringmail Gauntlets",
    "slot": "gloves",
    "levelReq": 6,
    "attrReqs": {
      "str": 6,
      "dex": 6,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "50% increased Armour and Evasion",
        "ranges": []
      },
      {
        "text": "Adds (2–3) to (5–6) Physical Damage to Attacks",
        "ranges": [
          [
            2,
            3
          ],
          [
            5,
            6
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Life",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(4–8)% increased Attack Speed",
        "ranges": [
          [
            4,
            8
          ]
        ]
      },
      {
        "text": "Strength can satisfy other Attribute Requirements of Melee Weapons and Melee Skills",
        "ranges": []
      }
    ]
  },
  {
    "id": "aurseize",
    "name": "Aurseize",
    "baseType": "Layered Gauntlets",
    "slot": "gloves",
    "levelReq": 16,
    "attrReqs": {
      "str": 13,
      "dex": 13,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(40–60)% increased Armour and Evasion",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(40–50)% increased Rarity of Items found",
        "ranges": [
          [
            40,
            50
          ]
        ]
      },
      {
        "text": "Lose 2% of maximum Life on Kill",
        "ranges": []
      }
    ]
  },
  {
    "id": "deathblow",
    "name": "Deathblow",
    "baseType": "Doubled Gauntlets",
    "slot": "gloves",
    "levelReq": 33,
    "attrReqs": {
      "str": 24,
      "dex": 24,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Armour and Evasion",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(5–10)% increased Attack Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Gain (20–30) Life per enemy killed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Gain (20–30) Mana per enemy killed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Culling Strike",
        "ranges": []
      }
    ]
  },
  {
    "id": "valakos_vice",
    "name": "Valako's Vice",
    "baseType": "Plate Gauntlets",
    "slot": "gloves",
    "levelReq": 45,
    "attrReqs": {
      "str": 32,
      "dex": 32,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Armour and Evasion",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "(5–10)% increased Attack Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(30–50)% to Lightning Resistance",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "100% of Fire damage Converted to Lightning damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "aerisvanes_wings",
    "name": "Aerisvane's Wings",
    "baseType": "Burnished Gauntlets",
    "slot": "gloves",
    "levelReq": 52,
    "attrReqs": {
      "str": 36,
      "dex": 36,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–70)% increased Armour and Evasion",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "(5–10)% increased Attack Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Decimating Strike",
        "ranges": []
      }
    ]
  },
  {
    "id": "death_articulated",
    "name": "Death Articulated",
    "baseType": "Ornate Gauntlets",
    "slot": "gloves",
    "levelReq": 65,
    "attrReqs": {
      "str": 44,
      "dex": 44,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Armour and Evasion",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(5–10)% increased Attack Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Lose 5% of maximum Life per second",
        "ranges": []
      },
      {
        "text": "Regenerate 5 Rage per second",
        "ranges": []
      },
      {
        "text": "No Inherent loss of Rage",
        "ranges": []
      }
    ]
  },
  {
    "id": "gravebind",
    "name": "Gravebind",
    "baseType": "Rope Cuffs",
    "slot": "gloves",
    "levelReq": 5,
    "attrReqs": {
      "str": 6,
      "dex": 0,
      "int": 6
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(40–60)% increased Armour and Energy Shield",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "20% increased Rarity of Items found Your other Modifiers to Rarity of Items found do not apply",
        "ranges": []
      },
      {
        "text": "+(10–15)% to Cold Resistance",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Gain (7–10) Life per enemy killed",
        "ranges": [
          [
            7,
            10
          ]
        ]
      },
      {
        "text": "Gain (4–6) Mana per enemy killed",
        "ranges": [
          [
            4,
            6
          ]
        ]
      },
      {
        "text": "Enemies in your Presence killed by anyone count as being killed by you instead",
        "ranges": []
      }
    ]
  },
  {
    "id": "shackles_of_the_wretched",
    "name": "Shackles of the Wretched",
    "baseType": "Aged Cuffs",
    "slot": "gloves",
    "levelReq": 16,
    "attrReqs": {
      "str": 13,
      "dex": 0,
      "int": 13
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(30–50)% increased Armour and Energy Shield",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "You cannot be Chilled for 6 seconds after being Chilled",
        "ranges": []
      },
      {
        "text": "You cannot be Frozen for 6 seconds after being Frozen",
        "ranges": []
      },
      {
        "text": "You cannot be Ignited for 6 seconds after being Ignited",
        "ranges": []
      },
      {
        "text": "You cannot be Shocked for 6 seconds after being Shocked",
        "ranges": []
      },
      {
        "text": "Curses you inflict are reflected back to you",
        "ranges": []
      }
    ]
  },
  {
    "id": "blueflame_bracers",
    "name": "Blueflame Bracers",
    "baseType": "Goldcast Cuffs",
    "slot": "gloves",
    "levelReq": 33,
    "attrReqs": {
      "str": 24,
      "dex": 0,
      "int": 24
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+20 to maximum Energy Shield",
        "ranges": []
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(5–15)% to Fire Resistance",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "+(5–15)% to Cold Resistance",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "100% of Fire Damage Converted to Cold Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_prisoners_manacles",
    "name": "The Prisoner's Manacles",
    "baseType": "Kalguuran Cuffs",
    "slot": "gloves",
    "levelReq": 45,
    "attrReqs": {
      "str": 64,
      "dex": 0,
      "int": 64
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(200–300)% increased Armour and Energy Shield",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+100 to maximum Life",
        "ranges": []
      },
      {
        "text": "100% increased Attribute Requirements",
        "ranges": []
      },
      {
        "text": "+(20–40)% to Lightning Resistance",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "(15–30) Life Regeneration per second",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "Debuffs you inflict have (20–30)% increased Slow Magnitude",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Cannot Immobilise enemies",
        "ranges": []
      }
    ]
  },
  {
    "id": "plaguefinger",
    "name": "Plaguefinger",
    "baseType": "Gauze Wraps",
    "slot": "gloves",
    "levelReq": 4,
    "attrReqs": {
      "str": 0,
      "dex": 6,
      "int": 6
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(30–50)% increased Evasion and Energy Shield",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(4–6)% increased Attack Speed",
        "ranges": [
          [
            4,
            6
          ]
        ]
      },
      {
        "text": "Cannot inflict Elemental Ailments",
        "ranges": []
      },
      {
        "text": "(20–30)% chance to Poison on Hit",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "All Damage from Hits Contributes to Poison Magnitude",
        "ranges": []
      }
    ]
  },
  {
    "id": "killjoy",
    "name": "Killjoy",
    "baseType": "Linen Wraps",
    "slot": "gloves",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 13,
      "int": 13
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(30–60)% increased Evasion and Energy Shield",
        "ranges": [
          [
            30,
            60
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Life",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(20–30)% increased Critical Damage Bonus",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Flasks do not recover Life",
        "ranges": []
      },
      {
        "text": "On-Kill Effects happen twice",
        "ranges": []
      }
    ]
  },
  {
    "id": "hand_of_wisdom_and_action",
    "name": "Hand of Wisdom and Action",
    "baseType": "Spiral Wraps",
    "slot": "gloves",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 24,
      "int": 24
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(15–25) to Dexterity",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(15–25) to Intelligence",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "1% increased Attack Speed per 20 Dexterity",
        "ranges": []
      },
      {
        "text": "Adds 1 to 10 Lightning Damage to Attacks per 20 Intelligence",
        "ranges": []
      }
    ]
  },
  {
    "id": "essentia_sanguis",
    "name": "Essentia Sanguis",
    "baseType": "Furtive Wraps",
    "slot": "gloves",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 36,
      "int": 36
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–70)% increased Evasion and Energy Shield",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "Adds 1 to (30–50) Lightning damage to Attacks",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(15–25) to Intelligence",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(25–35)% to Lightning Resistance",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "Life Leech is Converted to Energy Shield Leech",
        "ranges": []
      }
    ]
  },
  {
    "id": "thunderfist",
    "name": "Thunderfist",
    "baseType": "Utility Wraps",
    "slot": "gloves",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 44,
      "int": 44
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 15 Crackling Palm",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(1–111)% increased Evasion and Energy Shield",
        "ranges": [
          [
            1,
            111
          ]
        ]
      },
      {
        "text": "(1–11)% increased Attack Speed",
        "ranges": [
          [
            1,
            11
          ]
        ]
      },
      {
        "text": "+(1–33)% to Lightning Resistance",
        "ranges": [
          [
            1,
            33
          ]
        ]
      },
      {
        "text": "Adds 1 to (77–111) Lightning Damage to Unarmed Melee Hits",
        "ranges": [
          [
            77,
            111
          ]
        ]
      },
      {
        "text": "+(0.1–1.1)% to Unarmed Melee Attack Critical Hit Chance",
        "ranges": [
          [
            0.1,
            1.1
          ]
        ]
      },
      {
        "text": "use thunderfist art variation [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "legionstride",
    "name": "Legionstride",
    "baseType": "Rough Greaves",
    "slot": "boots",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(50–70) to Armour",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "+(50–70) to Stun Threshold",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "+10% to Block chance",
        "ranges": []
      },
      {
        "text": "-10 Physical damage taken from Projectile Attacks",
        "ranges": []
      }
    ]
  },
  {
    "id": "corpsewade",
    "name": "Corpsewade",
    "baseType": "Iron Greaves",
    "slot": "boots",
    "levelReq": 11,
    "attrReqs": {
      "str": 17,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 4 Decompose",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "10% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Armour",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(5–10) to Strength",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Trigger Decompose every 1.2 metres travelled",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_infinite_pursuit",
    "name": "The Infinite Pursuit",
    "baseType": "Bronze Greaves",
    "slot": "boots",
    "levelReq": 16,
    "attrReqs": {
      "str": 23,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "10% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "(100–150)% increased Armour",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(80–100) to maximum Life",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "(80–100)% increased Chance to be afflicted by Ailments when Hit",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "25% increased Movement Speed while affected by an Ailment",
        "ranges": []
      }
    ]
  },
  {
    "id": "trampletoe",
    "name": "Trampletoe",
    "baseType": "Trimmed Greaves",
    "slot": "boots",
    "levelReq": 27,
    "attrReqs": {
      "str": 57,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "15% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "(50–100)% increased Armour",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "50% increased Attribute Requirements",
        "ranges": []
      },
      {
        "text": "Deal 30% of Overkill damage to enemies within 2 metres of the enemy killed",
        "ranges": []
      }
    ]
  },
  {
    "id": "birth_of_fury",
    "name": "Birth of Fury",
    "baseType": "Stone Greaves",
    "slot": "boots",
    "levelReq": 33,
    "attrReqs": {
      "str": 45,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "20% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(20–30)% to Fire Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Drop Ignited Ground while moving, which lasts 8 seconds and Ignites as though dealing Fire Damage equal to 10% of your maximum Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "briarpatch",
    "name": "Briarpatch",
    "baseType": "Laced Boots",
    "slot": "boots",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 17,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(10–20)% increased Movement Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(60–80) to Stun Threshold",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+25% to Thorns Critical Hit Chance",
        "ranges": []
      },
      {
        "text": "(10–15) to (20–25) Physical Thorns damage",
        "ranges": [
          [
            10,
            15
          ],
          [
            20,
            25
          ]
        ]
      }
    ]
  },
  {
    "id": "gamblesprint",
    "name": "Gamblesprint",
    "baseType": "Embossed Boots",
    "slot": "boots",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 23,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–140)% increased Evasion Rating",
        "ranges": [
          [
            100,
            140
          ]
        ]
      },
      {
        "text": "(10–15)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(10–15) to Dexterity",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(15–25)% to Lightning Resistance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Gain 0% to 40% increased Movement Speed at random when Hit , until Hit again",
        "ranges": []
      }
    ]
  },
  {
    "id": "bushwhack",
    "name": "Bushwhack",
    "baseType": "Lizardscale Boots",
    "slot": "boots",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 45,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(15–25)% increased Movement Speed",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "(50–80)% increased Evasion Rating",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Physical Damage is Pinning",
        "ranges": []
      }
    ]
  },
  {
    "id": "luminous_pace",
    "name": "Luminous Pace",
    "baseType": "Straw Sandals",
    "slot": "boots",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "10% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "+(20–30) to maximum Energy Shield",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(5–10) to Intelligence",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "(20–30)% reduced Energy Shield Recharge Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "100% faster start of Energy Shield Recharge",
        "ranges": []
      }
    ]
  },
  {
    "id": "wanderlust",
    "name": "Wanderlust",
    "baseType": "Wrapped Sandals",
    "slot": "boots",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 17
    },
    "implicits": [],
    "explicits": [
      {
        "text": "20% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "+(10–20) to maximum Energy Shield",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+5 to Dexterity",
        "ranges": []
      },
      {
        "text": "Your speed is unaffected by Slows",
        "ranges": []
      }
    ]
  },
  {
    "id": "bones_of_ullr",
    "name": "Bones of Ullr",
    "baseType": "Lattice Sandals",
    "slot": "boots",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 23
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(5–15)% increased Movement Speed",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "(40–60)% increased Energy Shield",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(20–40) to maximum Life",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "+(20–40) to maximum Mana",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "(20–30)% increased Reservation Efficiency of Skills which create Undead Minions",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "wondertrap",
    "name": "Wondertrap",
    "baseType": "Silk Slippers",
    "slot": "boots",
    "levelReq": 27,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 38
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(10–20)% increased Movement Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Energy Shield",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(10–20) to Strength",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "50% increased Rarity of Items found when on Low Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "windscream",
    "name": "Windscream",
    "baseType": "Feathered Sandals",
    "slot": "boots",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 45
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(10–20)% increased Movement Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(50–100)% increased Energy Shield",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Curse Skills have (10–20)% increased Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Curses have no Activation Delay",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_knight-errant",
    "name": "The Knight-errant",
    "baseType": "Mail Sabatons",
    "slot": "boots",
    "levelReq": 6,
    "attrReqs": {
      "str": 7,
      "dex": 7,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "10% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Armour and Evasion",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(30–50) to Stun Threshold",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(30–50) to Ailment Threshold",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Iron Reflexes",
        "ranges": []
      }
    ]
  },
  {
    "id": "darkray_vectors",
    "name": "Darkray Vectors",
    "baseType": "Braced Sabatons",
    "slot": "boots",
    "levelReq": 16,
    "attrReqs": {
      "str": 14,
      "dex": 14,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–100)% increased Armour and Evasion",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "+(20–30)% to Lightning Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "25% reduced Light Radius",
        "ranges": []
      },
      {
        "text": "5% increased Movement Speed per Frenzy Charge",
        "ranges": []
      },
      {
        "text": "+1 to Maximum Frenzy Charges",
        "ranges": []
      }
    ]
  },
  {
    "id": "oberns_bastion",
    "name": "Obern's Bastion",
    "baseType": "Stacked Sabatons",
    "slot": "boots",
    "levelReq": 33,
    "attrReqs": {
      "str": 26,
      "dex": 26,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–200)% increased Armour and Evasion",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "(20–25) Life Regeneration per second",
        "ranges": [
          [
            20,
            25
          ]
        ]
      },
      {
        "text": "200% increased Stun Recovery",
        "ranges": []
      },
      {
        "text": "(30–50)% reduced Chill Duration on you",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(30–50)% reduced Freeze Duration on you",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(30–50)% reduced Shock duration on you",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "shankgonne",
    "name": "Shankgonne",
    "baseType": "Covered Sabatons",
    "slot": "boots",
    "levelReq": 45,
    "attrReqs": {
      "str": 34,
      "dex": 34,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 11 Black Powder Blitz",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–100)% increased Armour and Evasion",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "(10–20)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(15–25)% to Fire Resistance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Gain Deflection Rating equal to 20% of Armour",
        "ranges": []
      },
      {
        "text": "+(200–300) to Stun Threshold",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "You cannot Sprint",
        "ranges": []
      },
      {
        "text": "cannon ball footsteps [1]",
        "ranges": []
      },
      {
        "text": "footstep effect variation [119]",
        "ranges": []
      }
    ]
  },
  {
    "id": "wake_of_destruction",
    "name": "Wake of Destruction",
    "baseType": "Secured Leggings",
    "slot": "boots",
    "levelReq": 16,
    "attrReqs": {
      "str": 14,
      "dex": 0,
      "int": 14
    },
    "implicits": [],
    "explicits": [
      {
        "text": "10% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "(30–60)% increased Armour and Energy Shield",
        "ranges": [
          [
            30,
            60
          ]
        ]
      },
      {
        "text": "Adds 1 to (30–50) Lightning damage to Attacks",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Drop Shocked Ground while moving, lasting 8 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "decree_of_flight",
    "name": "Decree of Flight",
    "baseType": "Ancient Leggings",
    "slot": "boots",
    "levelReq": 65,
    "attrReqs": {
      "str": 56,
      "dex": 0,
      "int": 56
    },
    "implicits": [],
    "explicits": [
      {
        "text": "30% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "(150–200)% increased Armour and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "(20–30)% faster Dodge Roll",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Gain Guard equal to (10–20)% of missing Energy Shield for 4 seconds when you Dodge Roll",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Maximum amount of Guard is based on maximum Energy Shield instead",
        "ranges": []
      },
      {
        "text": "Divine Flight",
        "ranges": []
      },
      {
        "text": "base is floating [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "ghostmarch",
    "name": "Ghostmarch",
    "baseType": "Threaded Shoes",
    "slot": "boots",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 14,
      "int": 14
    },
    "implicits": [],
    "explicits": [
      {
        "text": "15% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "(100–150)% increased Evasion and Energy Shield",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Mana",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Dodge Roll passes through Enemies",
        "ranges": []
      }
    ]
  },
  {
    "id": "powertread",
    "name": "Powertread",
    "baseType": "Hunting Shoes",
    "slot": "boots",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 26,
      "int": 26
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(15–20)% increased Movement Speed",
        "ranges": [
          [
            15,
            20
          ]
        ]
      },
      {
        "text": "(60–80)% increased Evasion and Energy Shield",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+1 to Maximum Power Charges",
        "ranges": []
      },
      {
        "text": "12% increased Critical Damage Bonus per Power Charge",
        "ranges": []
      }
    ]
  },
  {
    "id": "beetlebite",
    "name": "Beetlebite",
    "baseType": "Velour Shoes",
    "slot": "boots",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 38,
      "int": 38
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(20–30)% increased Movement Speed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(60–120)% increased Evasion and Energy Shield",
        "ranges": [
          [
            60,
            120
          ]
        ]
      },
      {
        "text": "Aggravate Bleeding on Enemies when they Enter your Presence",
        "ranges": []
      },
      {
        "text": "100% increased Thorns damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "dionadair",
    "name": "Dionadair",
    "baseType": "Splintered Tower Shield",
    "slot": "offhand",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–80)% increased Armour",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(10–15) to Strength",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(3–5) Life Regeneration per second",
        "ranges": [
          [
            3,
            5
          ]
        ]
      },
      {
        "text": "20% reduced Stun Threshold",
        "ranges": []
      },
      {
        "text": "Double Stun Threshold while Shield is Raised",
        "ranges": []
      }
    ]
  },
  {
    "id": "wulfsbane",
    "name": "Wulfsbane",
    "baseType": "Painted Tower Shield",
    "slot": "offhand",
    "levelReq": 6,
    "attrReqs": {
      "str": 11,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(10–15) to Strength",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(60–80) to Stun Threshold",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "Intimidate Enemies on Block for 8 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "doomgate",
    "name": "Doomgate",
    "baseType": "Braced Tower Shield",
    "slot": "offhand",
    "levelReq": 12,
    "attrReqs": {
      "str": 19,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–100)% increased Block chance",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "(100–150)% increased Armour",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(13–17)% to Chaos Resistance",
        "ranges": [
          [
            13,
            17
          ]
        ]
      },
      {
        "text": "You take (25–40)% of damage from Blocked Hits",
        "ranges": [
          [
            25,
            40
          ]
        ]
      },
      {
        "text": "Enemies are Culled on Block",
        "ranges": []
      }
    ]
  },
  {
    "id": "window_to_paradise",
    "name": "Window to Paradise",
    "baseType": "Barricade Tower Shield",
    "slot": "offhand",
    "levelReq": 16,
    "attrReqs": {
      "str": 25,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–120)% increased Armour",
        "ranges": [
          [
            60,
            120
          ]
        ]
      },
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(10–15)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Inflict Elemental Exposure to Enemies 3 metres in front of you for 4 seconds, every 0.25 seconds while raised",
        "ranges": []
      }
    ]
  },
  {
    "id": "lycosidae",
    "name": "Lycosidae",
    "baseType": "Rampart Tower Shield",
    "slot": "offhand",
    "levelReq": 28,
    "attrReqs": {
      "str": 42,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(10–15)% increased Block chance",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(60–100)% increased Armour",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "Accuracy Rating is Doubled",
        "ranges": []
      },
      {
        "text": "Blocking Damage Poisons the Enemy as though dealing 200 Base Chaos Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "redblade_banner",
    "name": "Redblade Banner",
    "baseType": "Heraldric Tower Shield",
    "slot": "offhand",
    "levelReq": 33,
    "attrReqs": {
      "str": 48,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(10–15)% increased Block chance",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(60–100)% increased Armour",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(100–150) to Stun Threshold",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "Enemies in your Presence count as having double Power",
        "ranges": []
      }
    ]
  },
  {
    "id": "svalinn",
    "name": "Svalinn",
    "baseType": "Crucible Tower Shield",
    "slot": "offhand",
    "levelReq": 60,
    "attrReqs": {
      "str": 64,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 14 Cast on Block",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(50–100) to maximum Runic Ward",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "(200–300)% increased Armour",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "Chance to Block Damage is Lucky",
        "ranges": []
      },
      {
        "text": "You take (0–20)% of damage from Blocked Hits",
        "ranges": [
          [
            0,
            20
          ]
        ]
      }
    ]
  },
  {
    "id": "chernobogs_pillar",
    "name": "Chernobog's Pillar",
    "baseType": "Blacksteel Tower Shield",
    "slot": "offhand",
    "levelReq": 65,
    "attrReqs": {
      "str": 91,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(100–150)% increased Armour",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(30–40)% to Fire Resistance",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "+(23–29)% to Chaos Resistance",
        "ranges": [
          [
            23,
            29
          ]
        ]
      },
      {
        "text": "+(150–200) to Stun Threshold",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "Gain 1% of damage as Fire damage per 1% Chance to Block",
        "ranges": []
      }
    ]
  },
  {
    "id": "arvils_wheel",
    "name": "Arvil's Wheel",
    "baseType": "Hardwood Targe",
    "slot": "offhand",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–100)% increased Armour and Evasion",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "Lose 1% of maximum Life on Kill",
        "ranges": []
      },
      {
        "text": "Lose 1% of maximum Mana on Kill",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Skill Effect Duration",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "feathered_fortress",
    "name": "Feathered Fortress",
    "baseType": "Crescent Targe",
    "slot": "offhand",
    "levelReq": 26,
    "attrReqs": {
      "str": 22,
      "dex": 22,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30)% to Fire Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "No Movement Speed Penalty while Shield is Raised",
        "ranges": []
      }
    ]
  },
  {
    "id": "alkem_eira",
    "name": "Alkem Eira",
    "baseType": "Blazon Crest Shield",
    "slot": "offhand",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(15–20)% increased Block chance",
        "ranges": [
          [
            15,
            20
          ]
        ]
      },
      {
        "text": "(30–50)% increased Armour and Energy Shield",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(50–70) to maximum Mana",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "Damage Blocked is Recouped as Mana",
        "ranges": []
      }
    ]
  },
  {
    "id": "oaksworn",
    "name": "Oaksworn",
    "baseType": "Sigil Crest Shield",
    "slot": "offhand",
    "levelReq": 7,
    "attrReqs": {
      "str": 8,
      "dex": 0,
      "int": 8
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% increased Block chance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(80–120)% increased Armour and Energy Shield",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "50% increased Life Regeneration rate",
        "ranges": []
      }
    ]
  },
  {
    "id": "saffells_frame",
    "name": "Saffell's Frame",
    "baseType": "Emblem Crest Shield",
    "slot": "offhand",
    "levelReq": 16,
    "attrReqs": {
      "str": 15,
      "dex": 0,
      "int": 15
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(15–25)% to Fire Resistance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(15–25)% to Cold Resistance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(15–25)% to Lightning Resistance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Cannot Block",
        "ranges": []
      },
      {
        "text": "Modifiers to Maximum Block Chance instead apply to Maximum Resistances",
        "ranges": []
      }
    ]
  },
  {
    "id": "crest_of_ardura",
    "name": "Crest of Ardura",
    "baseType": "Jingling Crest Shield",
    "slot": "offhand",
    "levelReq": 28,
    "attrReqs": {
      "str": 23,
      "dex": 0,
      "int": 23
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–100)% increased Armour and Energy Shield",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(30–50)% increased Mana Regeneration Rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(30–50)% increased Cooldown Recovery Rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "mahuxotls_machination",
    "name": "Mahuxotl's Machination",
    "baseType": "Omen Crest Shield",
    "slot": "offhand",
    "levelReq": 48,
    "attrReqs": {
      "str": 30,
      "dex": 0,
      "int": 30
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(66–333)% increased effect of Socketed Soul Cores",
        "ranges": [
          [
            66,
            333
          ]
        ]
      },
      {
        "text": "(333–666)% increased Armour and Energy Shield",
        "ranges": [
          [
            333,
            666
          ]
        ]
      },
      {
        "text": "Everlasting Sacrifice",
        "ranges": []
      }
    ]
  },
  {
    "id": "rise_of_the_phoenix",
    "name": "Rise of the Phoenix",
    "baseType": "Omen Crest Shield",
    "slot": "offhand",
    "levelReq": 36,
    "attrReqs": {
      "str": 30,
      "dex": 0,
      "int": 30
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+5% to Maximum Fire Resistance",
        "ranges": []
      },
      {
        "text": "+(20–25)% to Fire Resistance",
        "ranges": [
          [
            20,
            25
          ]
        ]
      },
      {
        "text": "+25% to Fire Resistance while on Low Life",
        "ranges": []
      },
      {
        "text": "Regenerate 3% of maximum Life per second",
        "ranges": []
      },
      {
        "text": "Regenerate 3% of maximum Life per second while on Low Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "dunkelhalt",
    "name": "Dunkelhalt",
    "baseType": "Leather Buckler",
    "slot": "offhand",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Parry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% increased Block chance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30) to Evasion Rating",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "You take 50% of damage from Blocked Hits",
        "ranges": []
      },
      {
        "text": "50% increased Parried Debuff Magnitude",
        "ranges": []
      }
    ]
  },
  {
    "id": "nocturne",
    "name": "Nocturne",
    "baseType": "Wooden Buckler",
    "slot": "offhand",
    "levelReq": 5,
    "attrReqs": {
      "str": 0,
      "dex": 10,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Parry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(60–80) to maximum Mana",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(10–15)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "20% increased Accuracy Rating",
        "ranges": []
      },
      {
        "text": "Parried enemies take more Spell Damage instead of more Attack Damage",
        "ranges": []
      },
      {
        "text": "100% increased Parried Debuff Duration",
        "ranges": []
      },
      {
        "text": "parry skill art variation from item [2]",
        "ranges": []
      }
    ]
  },
  {
    "id": "rondel_de_ezo",
    "name": "Rondel de Ezo",
    "baseType": "Plated Buckler",
    "slot": "offhand",
    "levelReq": 11,
    "attrReqs": {
      "str": 0,
      "dex": 18,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Parry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(50–150)% increased Evasion Rating",
        "ranges": [
          [
            50,
            150
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "5 Life Regeneration per second",
        "ranges": []
      },
      {
        "text": "100% increased Block chance against Projectiles",
        "ranges": []
      },
      {
        "text": "Curse Enemies with Enfeeble on Block",
        "ranges": []
      }
    ]
  },
  {
    "id": "bloodbarrier",
    "name": "Bloodbarrier",
    "baseType": "Iron Buckler",
    "slot": "offhand",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 25,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Parry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(10–15)% increased Block chance",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(13–17)% to Chaos Resistance",
        "ranges": [
          [
            13,
            17
          ]
        ]
      },
      {
        "text": "(5–10) Life Regeneration per second",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Inflict Corrupted Blood for 5 seconds on Block , dealing 50% of your maximum Life as Physical damage per second",
        "ranges": []
      }
    ]
  },
  {
    "id": "kaltenhalt",
    "name": "Kaltenhalt",
    "baseType": "Ridged Buckler",
    "slot": "offhand",
    "levelReq": 22,
    "attrReqs": {
      "str": 0,
      "dex": 33,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Parry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(80–120)% increased Evasion Rating",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+5% to Maximum Cold Resistance",
        "ranges": []
      },
      {
        "text": "+40% to Cold Resistance",
        "ranges": []
      },
      {
        "text": "Modifiers to Stun Buildup apply to Freeze Buildup instead for Parry",
        "ranges": []
      },
      {
        "text": "100% of Parry Physical Damage Converted to Cold Damage",
        "ranges": []
      },
      {
        "text": "25 to 35 Cold Thorns damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "silverthorne",
    "name": "Silverthorne",
    "baseType": "Spiked Buckler",
    "slot": "offhand",
    "levelReq": 26,
    "attrReqs": {
      "str": 0,
      "dex": 38,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Parry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–100)% increased Evasion Rating",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(10–15)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Parrying applies 10 Stacks of Critical Weakness",
        "ranges": []
      },
      {
        "text": "100% increased Parry Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "calgyras_arc",
    "name": "Calgyra's Arc",
    "baseType": "Ornate Buckler",
    "slot": "offhand",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 74,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Parry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(60–100)% increased Evasion Rating",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Infinite Parry Range",
        "ranges": []
      },
      {
        "text": "50% increased Parried Debuff Duration",
        "ranges": []
      },
      {
        "text": "parry skill art variation from item [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "sunsplinter",
    "name": "Sunsplinter",
    "baseType": "Array Buckler",
    "slot": "offhand",
    "levelReq": 55,
    "attrReqs": {
      "str": 0,
      "dex": 78,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Parry",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(100–300)% increased Evasion Rating",
        "ranges": [
          [
            100,
            300
          ]
        ]
      },
      {
        "text": "+1 to Level of all Fire Skills",
        "ranges": []
      },
      {
        "text": "+2 to Level of all Cold Skills",
        "ranges": []
      },
      {
        "text": "+3 to Level of all Lightning Skills",
        "ranges": []
      },
      {
        "text": "+1% to Maximum Fire Resistance",
        "ranges": []
      },
      {
        "text": "+2% to Maximum Cold Resistance",
        "ranges": []
      },
      {
        "text": "+3% to Maximum Lightning Resistance",
        "ranges": []
      }
    ]
  },
  {
    "id": "deathrattle",
    "name": "Deathrattle",
    "baseType": "Twig Focus",
    "slot": "offhand",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(10–20) to maximum Energy Shield",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(20–40)% increased Spell Damage",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "+(5–10) to Intelligence",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "20% chance for Energy Shield Recharge to start when you Kill an Enemy",
        "ranges": []
      }
    ]
  },
  {
    "id": "threaded_light",
    "name": "Threaded Light",
    "baseType": "Woven Focus",
    "slot": "offhand",
    "levelReq": 6,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 11
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–70)% increased Energy Shield",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "(30–40)% increased Mana Regeneration Rate",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "20% increased Light Radius",
        "ranges": []
      },
      {
        "text": "(8–12)% increased Spell Damage per 10 Spirit",
        "ranges": [
          [
            8,
            12
          ]
        ]
      }
    ]
  },
  {
    "id": "effigy_of_cruelty",
    "name": "Effigy of Cruelty",
    "baseType": "Antler Focus",
    "slot": "offhand",
    "levelReq": 10,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 17
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(20–30) to maximum Energy Shield",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(40–50)% increased Spell Damage",
        "ranges": [
          [
            40,
            50
          ]
        ]
      },
      {
        "text": "+10 to Intelligence",
        "ranges": []
      },
      {
        "text": "+(7–13)% to Chaos Resistance",
        "ranges": [
          [
            7,
            13
          ]
        ]
      },
      {
        "text": "Critical Hits with Spells apply (1–3) Stacks of Critical Weakness",
        "ranges": [
          [
            1,
            3
          ]
        ]
      }
    ]
  },
  {
    "id": "carrion_call",
    "name": "Carrion Call",
    "baseType": "Engraved Focus",
    "slot": "offhand",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 25
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(30–40) to maximum Energy Shield",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Minions have (20–30)% increased maximum Life",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(20–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Minions deal (20–30)% increased Damage",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Minions' Resistances are equal to yours",
        "ranges": []
      }
    ]
  },
  {
    "id": "serpents_lesson",
    "name": "Serpent's Lesson",
    "baseType": "Tonal Focus",
    "slot": "offhand",
    "levelReq": 22,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 33
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(60–100) to maximum Life",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "You count as on Low Life while at 35% of maximum Mana or below",
        "ranges": []
      },
      {
        "text": "You count as on Low Mana while at 35% of maximum Life or below",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_eternal_spark",
    "name": "The Eternal Spark",
    "baseType": "Crystal Focus",
    "slot": "offhand",
    "levelReq": 26,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 38
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(50–70)% increased Energy Shield",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "+5% to Maximum Lightning Resistance",
        "ranges": []
      },
      {
        "text": "+(20–30)% to Lightning Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "40% increased Mana Regeneration Rate",
        "ranges": []
      },
      {
        "text": "40% increased Mana Regeneration Rate while stationary",
        "ranges": []
      }
    ]
  },
  {
    "id": "apeps_supremacy",
    "name": "Apep's Supremacy",
    "baseType": "Voodoo Focus",
    "slot": "offhand",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 48
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–200)% increased Energy Shield",
        "ranges": [
          [
            100,
            200
          ]
        ]
      },
      {
        "text": "(30–50)% increased Energy Shield Recharge Rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "20% of Elemental damage from Hits taken as Chaos damage",
        "ranges": []
      },
      {
        "text": "+25% chance to be Poisoned",
        "ranges": []
      },
      {
        "text": "100% chance to Poison on Hit with Spell Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "tabula_rasa",
    "name": "Tabula Rasa",
    "baseType": "Garment",
    "slot": "body",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Has 6 Jewel Sockets (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "skin_of_the_loyal",
    "name": "Skin of the Loyal",
    "baseType": "Garment",
    "slot": "body",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+(5–40)% to all Elemental Resistances",
        "ranges": [
          [
            5,
            40
          ]
        ]
      },
      {
        "text": "Elemental Ailment Threshold is increased by Uncapped Chaos Resistance",
        "ranges": []
      },
      {
        "text": "Armour is increased by Uncapped Fire Resistance",
        "ranges": []
      },
      {
        "text": "Energy Shield is increased by Uncapped Cold Resistance",
        "ranges": []
      },
      {
        "text": "Evasion Rating is increased by Uncapped Lightning Resistance",
        "ranges": []
      }
    ]
  },
  {
    "id": "morior_invictus",
    "name": "Morior Invictus",
    "baseType": "Grand Regalia",
    "slot": "body",
    "levelReq": 65,
    "attrReqs": {
      "str": 41,
      "dex": 41,
      "int": 41
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(300–400)% increased Armour , Evasion and Energy Shield",
        "ranges": [
          [
            300,
            400
          ]
        ]
      },
      {
        "text": "[3 Random Socket Modifiers]",
        "ranges": []
      },
      {
        "text": "Has 4 Augment Sockets (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "atziris_splendour",
    "name": "Atziri's Splendour",
    "baseType": "Sacrificial Regalia",
    "slot": "body",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+1 to Level of all Corrupted Skill Gems",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Only Soul Cores can be Socketed in this item",
        "ranges": []
      },
      {
        "text": "Has no Attribute Requirements",
        "ranges": []
      },
      {
        "text": "(80–120)% increased Armour , Evasion and Energy Shield",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(10–20)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Skills from Corrupted Gems have 50% of Mana Costs Converted to Life Costs",
        "ranges": []
      },
      {
        "text": "This item gains bonuses from Socketed Soul Cores as though it was also a [Random socketable equipment type]",
        "ranges": []
      },
      {
        "text": "Has 6 Augment Sockets (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "solus_ipse",
    "name": "Solus Ipse",
    "baseType": "Grand Visage",
    "slot": "helmet",
    "levelReq": 65,
    "attrReqs": {
      "str": 36,
      "dex": 36,
      "int": 36
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–200)% increased Armour , Evasion and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "25% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Equipment and Skill Gems have 25% increased Attribute Requirements",
        "ranges": []
      },
      {
        "text": "You can Socket 2 additional copies of each Lineage Support Gem , in different Skills",
        "ranges": []
      }
    ]
  },
  {
    "id": "sine_aequo",
    "name": "Sine Aequo",
    "baseType": "Grand Manchettes",
    "slot": "gloves",
    "levelReq": 65,
    "attrReqs": {
      "str": 32,
      "dex": 32,
      "int": 32
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(10–15)% increased Skill Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(150–200)% increased Armour , Evasion and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "Immobilise enemies at 50% buildup instead of 100%",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Damage against Immobilised Enemies",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "ab_aeterno",
    "name": "Ab Aeterno",
    "baseType": "Grand Cuisses",
    "slot": "boots",
    "levelReq": 65,
    "attrReqs": {
      "str": 34,
      "dex": 34,
      "int": 34
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(15–30)% increased Movement Speed",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "(200–250)% increased Armour , Evasion and Energy Shield",
        "ranges": [
          [
            200,
            250
          ]
        ]
      },
      {
        "text": "Dodge Roll avoids all Hits",
        "ranges": []
      },
      {
        "text": "Gain Overencumbrance for 4 seconds when you Dodge Roll",
        "ranges": []
      },
      {
        "text": "Your speed is Unaffected by Slows while Sprinting",
        "ranges": []
      }
    ]
  },
  {
    "id": "volls_protector",
    "name": "Voll's Protector",
    "baseType": "Plated Vestments",
    "slot": "body",
    "levelReq": 59,
    "attrReqs": {
      "str": 52,
      "dex": 0,
      "int": 52
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(150–200)% increased Armour and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "25% reduced maximum Mana",
        "ranges": []
      },
      {
        "text": "+(13–17)% to Chaos Resistance",
        "ranges": [
          [
            13,
            17
          ]
        ]
      },
      {
        "text": "25% chance to gain a Power Charge on Critical Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "forgotten_warden",
    "name": "Forgotten Warden",
    "baseType": "Primal Markings",
    "slot": "body",
    "levelReq": 70,
    "attrReqs": {
      "str": 0,
      "dex": 67,
      "int": 67
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 16 Spirit Vessel",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(70–100) to Deflection Rating per 50 missing Energy Shield",
        "ranges": [
          [
            70,
            100
          ]
        ]
      },
      {
        "text": "(200–300)% increased Evasion and Energy Shield",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Companions have (30–50)% increased maximum Life",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(10–15)% of Damage from Deflected Hits is taken from Damageable Companion 's Life before you",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "enable ancient order task [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_masters_reach",
    "name": "The Master's Reach",
    "baseType": "Tethering Bands",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 55,
      "dex": 0,
      "int": 55
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 15 Untether",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(200–300)% increased Armour and Energy Shield",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "+(75–125) to maximum Life",
        "ranges": [
          [
            75,
            125
          ]
        ]
      },
      {
        "text": "+(15–25) to Intelligence",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Reveal Weaknesses against Rare and Unique enemies",
        "ranges": []
      },
      {
        "text": "Eat a Soul when you Hit an enemy with an Open Weakness",
        "ranges": []
      },
      {
        "text": "(80–100)% of damage taken from enemies with an Open Weakness Recouped as Life",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "unique reveal weakness art variation [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "atziris_step",
    "name": "Atziri's Step",
    "baseType": "Cinched Boots",
    "slot": "boots",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 86,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "30% increased Movement Speed",
        "ranges": []
      },
      {
        "text": "(80–120)% increased Evasion Rating",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "+(70–100) to maximum Life",
        "ranges": [
          [
            70,
            100
          ]
        ]
      },
      {
        "text": "Gain Deflection Rating equal to (40–60)% of Evasion Rating",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(-12–-6)% to amount of Damage Prevented by Deflection",
        "ranges": [
          [
            -12,
            -6
          ]
        ]
      },
      {
        "text": "Cannot be Light Stunned by Deflected Hits",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_surrender",
    "name": "The Surrender",
    "baseType": "Vaal Tower Shield",
    "slot": "offhand",
    "levelReq": 75,
    "attrReqs": {
      "str": 107,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(40–60)% increased Block chance",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(150–200)% increased Armour",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+(150–200) to Stun Threshold",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "Recover 4% of maximum Life when you Block",
        "ranges": []
      }
    ]
  },
  {
    "id": "nightfall",
    "name": "Nightfall",
    "baseType": "Glacial Fortress",
    "slot": "offhand",
    "levelReq": 70,
    "attrReqs": {
      "str": 249,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      },
      {
        "text": "Grants Skill: Level 16 Soaring Midnight",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+150 Strength Requirement",
        "ranges": []
      },
      {
        "text": "(10–20)% increased Block chance",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(350–450)% increased Armour",
        "ranges": [
          [
            350,
            450
          ]
        ]
      },
      {
        "text": "+(30–40)% to Cold Resistance",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "(10–20)% of Fire damage taken as Cold damage",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(10–20)% of Lightning damage taken as Cold damage",
        "ranges": [
          [
            10,
            20
          ]
        ]
      }
    ]
  },
  {
    "id": "eyes_of_the_runefather",
    "name": "Eyes of the Runefather",
    "baseType": "Venerable Defender",
    "slot": "offhand",
    "levelReq": 62,
    "attrReqs": {
      "str": 64,
      "dex": 64,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(300–400)% increased Armour and Evasion",
        "ranges": [
          [
            300,
            400
          ]
        ]
      },
      {
        "text": "+(40–50)% to Cold Resistance",
        "ranges": [
          [
            40,
            50
          ]
        ]
      },
      {
        "text": "Inflicts Runefather's Challenge on enemies 6 metres in front of you when raised, no more than once every 2 seconds",
        "ranges": []
      },
      {
        "text": "Gain 1 Runefather's Boast per Power of targets affected by Runefather's Challenge you kill",
        "ranges": []
      },
      {
        "text": "Off-hand Hits inflict Runefather's Challenge",
        "ranges": []
      }
    ]
  },
  {
    "id": "prism_guardian",
    "name": "Prism Guardian",
    "baseType": "Intricate Crest Shield",
    "slot": "offhand",
    "levelReq": 65,
    "attrReqs": {
      "str": 50,
      "dex": 0,
      "int": 50
    },
    "implicits": [
      {
        "text": "Grants Skill: Raise Shield",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(150–200)% increased Armour and Energy Shield",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "+50 to Spirit",
        "ranges": []
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(10–20)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "1% increased Spirit Reservation Efficiency of Buff Skills per 100 Maximum Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "rathpith_globe",
    "name": "Rathpith Globe",
    "baseType": "Sacred Focus",
    "slot": "offhand",
    "levelReq": 75,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 107
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(60–100)% increased Energy Shield",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(60–100) to maximum Life",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "Non- Channelling Spells cost an additional 6% of your maximum Life",
        "ranges": []
      },
      {
        "text": "Non- Channelling Spells have 3% increased Critical Hit Chance per 100 maximum Life",
        "ranges": []
      },
      {
        "text": "Non- Channelling Spells deal 6% increased Damage per 100 maximum Life",
        "ranges": []
      },
      {
        "text": "rathpith surge [3]",
        "ranges": []
      }
    ]
  },
  {
    "id": "heroic_tragedy",
    "name": "Heroic Tragedy",
    "baseType": "Timeless Jewel",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Remembrancing (100–8000) songworthy deeds by the line of Vorana Passives in radius are Conquered by the Kalguur",
        "ranges": [
          [
            100,
            8000
          ]
        ]
      },
      {
        "text": "Historic",
        "ranges": []
      },
      {
        "text": "local unique jewel break timeless jewel calculators [0]",
        "ranges": []
      }
    ]
  },
  {
    "id": "undying_hate",
    "name": "Undying Hate",
    "baseType": "Timeless Jewel",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Glorifying the defilement of (79–30977) souls in tribute to Amanamu Passives in radius are Conquered by the Abyssals Desecration makes this item unstable",
        "ranges": [
          [
            79,
            30977
          ]
        ]
      },
      {
        "text": "Historic",
        "ranges": []
      },
      {
        "text": "local unique jewel break timeless jewel calculators [0]",
        "ranges": []
      }
    ]
  },
  {
    "id": "grand_spectrum",
    "name": "Grand Spectrum",
    "baseType": "Ruby",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "2% increased Maximum Life per socketed Grand Spectrum",
        "ranges": []
      },
      {
        "text": "number of stackable unique jewels [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "split_personality",
    "name": "Split Personality",
    "baseType": "Ruby",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Can Allocate Passive Skills from the Sorceress's starting point",
        "ranges": []
      }
    ]
  },
  {
    "id": "voices",
    "name": "Voices",
    "baseType": "Sapphire",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Allocates 2 Sinister Jewel sockets",
        "ranges": []
      }
    ]
  },
  {
    "id": "megalomaniac",
    "name": "Megalomaniac",
    "baseType": "Diamond",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Allocates Passive Skill",
        "ranges": []
      },
      {
        "text": "Allocates Passive Skill",
        "ranges": []
      },
      {
        "text": "Allocates Passive Skill",
        "ranges": []
      }
    ]
  },
  {
    "id": "from_nothing",
    "name": "From Nothing",
    "baseType": "Diamond",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Passives in Radius of Passive Skill can be Allocated without being connected to your tree",
        "ranges": []
      }
    ]
  },
  {
    "id": "controlled_metamorphosis",
    "name": "Controlled Metamorphosis",
    "baseType": "Diamond",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Only affects Passives in Medium-Large Ring",
        "ranges": []
      },
      {
        "text": "Passives in Radius can be Allocated without being connected to your tree",
        "ranges": []
      },
      {
        "text": "(-20–-5)% to all Elemental Resistances",
        "ranges": [
          [
            -20,
            -5
          ]
        ]
      }
    ]
  },
  {
    "id": "prism_of_belief",
    "name": "Prism of Belief",
    "baseType": "Diamond",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "+ (1–3) to Level of all Specific Skill Skills",
        "ranges": [
          [
            1,
            3
          ]
        ]
      }
    ]
  },
  {
    "id": "the_adorned",
    "name": "The Adorned",
    "baseType": "Diamond",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(0–150)% increased Effect of Jewel Socket Passive Skills containing Corrupted Magic Jewels",
        "ranges": [
          [
            0,
            150
          ]
        ]
      }
    ]
  },
  {
    "id": "heart_of_the_well",
    "name": "Heart of the Well",
    "baseType": "Diamond",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "[Custom Desecrated prefix]",
        "ranges": []
      },
      {
        "text": "[Custom Desecrated prefix]",
        "ranges": []
      },
      {
        "text": "[Custom Desecrated suffix]",
        "ranges": []
      },
      {
        "text": "[Custom Desecrated suffix]",
        "ranges": []
      }
    ]
  },
  {
    "id": "flesh_crucible",
    "name": "Flesh Crucible",
    "baseType": "Diamond",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Random 1 Keystone Passive Skill [1,33]",
        "ranges": []
      },
      {
        "text": "(20-10)% less [random stat]",
        "ranges": []
      }
    ]
  },
  {
    "id": "against_the_darkness",
    "name": "Against the Darkness",
    "baseType": "Time-Lost Diamond",
    "slot": null,
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "local jewel effect base radius [1000]",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "[2 Random Jewel Modifiers]",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_peacemakers_draught",
    "name": "The Peacemaker's Draught",
    "baseType": "Amphora Relic",
    "slot": null,
    "levelReq": 64,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Zarokh, the Temporal drops 1 additional Baryas",
        "ranges": []
      },
      {
        "text": "Your Armour , Evasion and Energy Shield are zero",
        "ranges": []
      },
      {
        "text": "This item is destroyed when applied to a Trial",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_desperate_alliance",
    "name": "The Desperate Alliance",
    "baseType": "Vase Relic",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Zarokh, the Temporal drops Against the Darkness",
        "ranges": []
      },
      {
        "text": "Zarokh, the Temporal deals 100% more Damage",
        "ranges": []
      },
      {
        "text": "Zarokh, the Temporal takes 75% less Damage",
        "ranges": []
      },
      {
        "text": "This item is destroyed when applied to a Trial",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_changing_seasons",
    "name": "The Changing Seasons",
    "baseType": "Seal Relic",
    "slot": null,
    "levelReq": 64,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Zarokh, the Temporal drops Sandstorm Visage",
        "ranges": []
      },
      {
        "text": "Cannot restore Honour",
        "ranges": []
      },
      {
        "text": "This item is destroyed when applied to a Trial",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_burden_of_leadership",
    "name": "The Burden of Leadership",
    "baseType": "Tapestry Relic",
    "slot": null,
    "levelReq": 64,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Zarokh, the Temporal drops Sekhema's Resolve",
        "ranges": []
      },
      {
        "text": "Rooms are unknown on the Trial Map",
        "ranges": []
      },
      {
        "text": "This item is destroyed when applied to a Trial",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_last_flame",
    "name": "The Last Flame",
    "baseType": "Incense Relic",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Zarokh, the Temporal drops Temporalis",
        "ranges": []
      },
      {
        "text": "Damage taken cannot be Absorbed",
        "ranges": []
      },
      {
        "text": "Maximum Honour is 1",
        "ranges": []
      },
      {
        "text": "Cannot be used with Trials below level 80",
        "ranges": []
      },
      {
        "text": "This item is destroyed when applied to a Trial",
        "ranges": []
      }
    ]
  },
  {
    "id": "asphyxias_wrath",
    "name": "Asphyxia's Wrath",
    "baseType": "Broadhead Quiver",
    "slot": "quiver",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds 1 to 3 Physical Damage to Attacks",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (3–4) to (5–8) Cold damage to Attacks",
        "ranges": [
          [
            3,
            4
          ],
          [
            5,
            8
          ]
        ]
      },
      {
        "text": "Attacks Gain (5–10)% of Damage as Extra Cold Damage",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "(5–10)% increased Attack Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+(5–10)% to Cold Resistance",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Enemies Chilled by your Hits increase damage taken by Chill Magnitude",
        "ranges": []
      }
    ]
  },
  {
    "id": "blackgleam",
    "name": "Blackgleam",
    "baseType": "Fire Quiver",
    "slot": "quiver",
    "levelReq": 8,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds 3 to 5 Fire damage to Attacks",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (3–5) to (6–9) Fire damage to Attacks",
        "ranges": [
          [
            3,
            5
          ],
          [
            6,
            9
          ]
        ]
      },
      {
        "text": "Attacks Gain (5–10)% of Damage as Extra Fire Damage",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Mana",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "50% increased Flammability Magnitude",
        "ranges": []
      },
      {
        "text": "Projectiles Pierce all Ignited enemies",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_lethal_draw",
    "name": "The Lethal Draw",
    "baseType": "Sacral Quiver",
    "slot": "quiver",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Gain (2–3) Life per Enemy Hit with Attacks",
        "ranges": [
          [
            2,
            3
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(5–10)% increased Attack Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Gain 5 Life per Enemy Hit with Attacks",
        "ranges": []
      },
      {
        "text": "(15–25)% chance to Pierce an Enemy",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Bow Attacks consume 10% of your maximum Life Flask Charges if possible to deal added Physical damage equal to (5–10)% of Flask 's Life Recovery amount",
        "ranges": [
          [
            5,
            10
          ]
        ]
      }
    ]
  },
  {
    "id": "rearguard",
    "name": "Rearguard",
    "baseType": "Blunt Quiver",
    "slot": "quiver",
    "levelReq": 33,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(25–40)% increased Stun Buildup",
        "ranges": [
          [
            25,
            40
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Adds (7–11) to (14–20) Physical Damage to Attacks",
        "ranges": [
          [
            7,
            11
          ],
          [
            14,
            20
          ]
        ]
      },
      {
        "text": "+(150–200) to Armour",
        "ranges": [
          [
            150,
            200
          ]
        ]
      },
      {
        "text": "(20–30)% increased Projectile Speed",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(15–25)% to Block chance",
        "ranges": [
          [
            15,
            25
          ]
        ]
      }
    ]
  },
  {
    "id": "murkshaft",
    "name": "Murkshaft",
    "baseType": "Toxic Quiver",
    "slot": "quiver",
    "levelReq": 39,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 10 Bursting Fen Toad",
        "ranges": []
      },
      {
        "text": "(20–30)% chance to Poison on Hit with Attacks",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Adds (6–10) to (13–17) Physical Damage to Attacks",
        "ranges": [
          [
            6,
            10
          ],
          [
            13,
            17
          ]
        ]
      },
      {
        "text": "Gain (10–15) Mana per enemy killed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(10–20)% increased Poison Duration",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(20–30)% chance to Poison on Hit with Attacks",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Blind Targets when you Poison them",
        "ranges": []
      },
      {
        "text": "local display triggers level x toad on kill [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "cadiros_gambit",
    "name": "Cadiro's Gambit",
    "baseType": "Primed Quiver",
    "slot": "quiver",
    "levelReq": 66,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(7–10)% increased Attack Speed",
        "ranges": [
          [
            7,
            10
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Each Arrow fired is a Crescendo , Splinter , Reversing , Diamond , Covetous , or Blunt Arrow",
        "ranges": []
      }
    ]
  },
  {
    "id": "drillneck",
    "name": "Drillneck",
    "baseType": "Penetrating Quiver",
    "slot": "quiver",
    "levelReq": 55,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "100% chance to Pierce an Enemy",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(60–90) to maximum Life",
        "ranges": [
          [
            60,
            90
          ]
        ]
      },
      {
        "text": "(8–12)% increased Attack Speed",
        "ranges": [
          [
            8,
            12
          ]
        ]
      },
      {
        "text": "Gain Deflection Rating equal to (24–32)% of Evasion Rating",
        "ranges": [
          [
            24,
            32
          ]
        ]
      },
      {
        "text": "Attack Projectiles Return if they Pierced at least (2–4) times",
        "ranges": [
          [
            2,
            4
          ]
        ]
      },
      {
        "text": "Projectiles have (42–64)% increased Critical Hit chance for each time they have Pierced",
        "ranges": [
          [
            42,
            64
          ]
        ]
      },
      {
        "text": "Projectiles deal (42–64)% increased Damage with Hits for each time they have Pierced",
        "ranges": [
          [
            42,
            64
          ]
        ]
      }
    ]
  },
  {
    "id": "beyond_reach",
    "name": "Beyond Reach",
    "baseType": "Visceral Quiver",
    "slot": "quiver",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(20–30)% increased Critical Hit Chance for Attacks",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(10–15)% reduced Attack Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Attacks Gain (10–20)% of Physical Damage as extra Chaos Damage",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Chaos Damage from Hits also Contributes to Freeze Buildup",
        "ranges": []
      },
      {
        "text": "Chaos Damage from Hits also Contributes to Electrocute Buildup",
        "ranges": []
      }
    ]
  },
  {
    "id": "igniferis",
    "name": "Igniferis",
    "baseType": "Crimson Amulet",
    "slot": "amulet",
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(2–4) Life Regeneration per second",
        "ranges": [
          [
            2,
            4
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(10–20)% to Fire Resistance",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(20–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "25% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Life Recovery from Regeneration is not applied",
        "ranges": []
      },
      {
        "text": "Every 4 seconds, Recover 1 Life for every 0.2 Life Recovery per second from Regeneration",
        "ranges": []
      }
    ]
  },
  {
    "id": "idol_of_uldurn",
    "name": "Idol of Uldurn",
    "baseType": "Crimson Amulet",
    "slot": "amulet",
    "levelReq": 24,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(2–4) Life Regeneration per second",
        "ranges": [
          [
            2,
            4
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(60–80) to maximum Life",
        "ranges": [
          [
            60,
            80
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(20–40)% reduced Presence Area of Effect",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "(10–15)% increased Spirit",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Skills have + 1 to Limit",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_everlasting_gaze",
    "name": "The Everlasting Gaze",
    "baseType": "Azure Amulet",
    "slot": "amulet",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(20–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(40–60)% increased Mana Regeneration Rate",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "Gain (4–6)% of maximum Mana as Extra maximum Energy Shield",
        "ranges": [
          [
            4,
            6
          ]
        ]
      }
    ]
  },
  {
    "id": "ungils_harmony",
    "name": "Ungil's Harmony",
    "baseType": "Azure Amulet",
    "slot": "amulet",
    "levelReq": 25,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(20–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(30–50) to maximum Life",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(30–50) to maximum Mana",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(100–200)% increased Critical Hit Chance",
        "ranges": [
          [
            100,
            200
          ]
        ]
      },
      {
        "text": "+(60–100) to Stun Threshold",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "You have no Critical Damage Bonus",
        "ranges": []
      }
    ]
  },
  {
    "id": "revered_resin",
    "name": "Revered Resin",
    "baseType": "Amber Amulet",
    "slot": "amulet",
    "levelReq": 8,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Strength",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Life Recovery rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Life Flasks gain (0.17–0.25) charges per Second",
        "ranges": [
          [
            0.17,
            0.25
          ]
        ]
      }
    ]
  },
  {
    "id": "carnage_heart",
    "name": "Carnage Heart",
    "baseType": "Amber Amulet",
    "slot": "amulet",
    "levelReq": 8,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Strength",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "20% reduced maximum Life",
        "ranges": []
      },
      {
        "text": "+(10–20) to all Attributes",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(100–200)% increased amount of Life Leeched",
        "ranges": [
          [
            100,
            200
          ]
        ]
      },
      {
        "text": "(25–50)% increased Damage while Leeching",
        "ranges": [
          [
            25,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "xophs_blood",
    "name": "Xoph's Blood",
    "baseType": "Amber Amulet",
    "slot": "amulet",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Strength",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(10–20)% increased maximum Life",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(50–100)% to Fire Resistance",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "Enemies in your Presence have -25% to Fire Resistance",
        "ranges": []
      }
    ]
  },
  {
    "id": "surefooted_sigil",
    "name": "Surefooted Sigil",
    "baseType": "Jade Amulet",
    "slot": "amulet",
    "levelReq": 8,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Dexterity",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(5–15) to Dexterity",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "+1 metre to Dodge Roll distance",
        "ranges": []
      },
      {
        "text": "50% increased Evasion Rating if you've Dodge Rolled Recently",
        "ranges": []
      }
    ]
  },
  {
    "id": "choir_of_the_storm",
    "name": "Choir of the Storm",
    "baseType": "Jade Amulet",
    "slot": "amulet",
    "levelReq": 55,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 13 Lightning Bolt",
        "ranges": []
      },
      {
        "text": "+(10–15) to Dexterity",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(50–100)% to Lightning Resistance",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "Critical Hits Ignore Enemy Monster Lightning Resistance",
        "ranges": []
      },
      {
        "text": "Trigger Lightning Bolt Skill on Critical Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "defiance_of_destiny",
    "name": "Defiance of Destiny",
    "baseType": "Jade Amulet",
    "slot": "amulet",
    "levelReq": 56,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Dexterity",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(6–10)% increased maximum Life",
        "ranges": [
          [
            6,
            10
          ]
        ]
      },
      {
        "text": "+(10–20) to Strength",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(25–40)% increased Mana Regeneration Rate",
        "ranges": [
          [
            25,
            40
          ]
        ]
      },
      {
        "text": "Recover (20–30)% of Missing Life before being Hit by an Enemy",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "ligurium_talisman",
    "name": "Ligurium Talisman",
    "baseType": "Lapis Amulet",
    "slot": "amulet",
    "levelReq": 35,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Intelligence",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(30–40) to maximum Energy Shield",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "+(25–35) to Spirit",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Life Regeneration is applied to Energy Shield instead",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_pandemonius",
    "name": "The Pandemonius",
    "baseType": "Lapis Amulet",
    "slot": "amulet",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Intelligence",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(50–100)% to Cold Resistance",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "Damage Penetrates 75% Cold Resistance",
        "ranges": []
      },
      {
        "text": "Blind Chilled enemies on Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "stone_of_lazhwar",
    "name": "Stone of Lazhwar",
    "baseType": "Lapis Amulet",
    "slot": "amulet",
    "levelReq": 8,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Intelligence",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(50–100) to maximum Mana",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "(15–25)% increased Cast Speed",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(15–25)% to Block Chance while holding a Focus",
        "ranges": [
          [
            15,
            25
          ]
        ]
      }
    ]
  },
  {
    "id": "rondel_of_fragility",
    "name": "Rondel of Fragility",
    "baseType": "Lunar Amulet",
    "slot": "amulet",
    "levelReq": 14,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30) to maximum Energy Shield",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(15–30)% increased Skill Speed",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "(20–30)% increased Critical Hit Chance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "-30% to all Elemental Resistances",
        "ranges": []
      },
      {
        "text": "(30–50)% increased Damage",
        "ranges": [
          [
            30,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "the_anvil",
    "name": "The Anvil",
    "baseType": "Bloodstone Amulet",
    "slot": "amulet",
    "levelReq": 18,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(30–40) to maximum Life",
        "ranges": [
          [
            30,
            40
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "10% reduced Movement Speed",
        "ranges": []
      },
      {
        "text": "10% reduced Skill Speed",
        "ranges": []
      },
      {
        "text": "(25–50)% increased Armour",
        "ranges": [
          [
            25,
            50
          ]
        ]
      },
      {
        "text": "25% increased Block chance",
        "ranges": []
      },
      {
        "text": "+(5–10)% to maximum Block chance",
        "ranges": [
          [
            5,
            10
          ]
        ]
      }
    ]
  },
  {
    "id": "yoke_of_suffering",
    "name": "Yoke of Suffering",
    "baseType": "Bloodstone Amulet",
    "slot": "amulet",
    "levelReq": 18,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(30–40) to maximum Life",
        "ranges": [
          [
            30,
            40
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(10–15)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(15–30)% increased Elemental Damage",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "Enemies take (15–20)% increased Damage for each Elemental Ailment type among your Ailments on them",
        "ranges": [
          [
            15,
            20
          ]
        ]
      },
      {
        "text": "(30–40)% reduced Duration of Ignite , Shock and Chill on Enemies",
        "ranges": [
          [
            30,
            40
          ]
        ]
      }
    ]
  },
  {
    "id": "astramentis",
    "name": "Astramentis",
    "baseType": "Stellar Amulet",
    "slot": "amulet",
    "levelReq": 24,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(5–7) to all Attributes",
        "ranges": [
          [
            5,
            7
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(50–100) to all Attributes",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "-4 Physical Damage taken from Attack Hits",
        "ranges": []
      }
    ]
  },
  {
    "id": "fixation_of_yix",
    "name": "Fixation of Yix",
    "baseType": "Stellar Amulet",
    "slot": "amulet",
    "levelReq": 24,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(5–7) to all Attributes",
        "ranges": [
          [
            5,
            7
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+100 to maximum Life",
        "ranges": []
      },
      {
        "text": "Allies in your Presence have (30–50)% increased Critical Hit Chance",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Allies in your Presence have (30–50)% increased Critical Damage Bonus",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Allies in your Presence have (10–20)% increased Attack Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Allies in your Presence have (10–20)% increased Cast Speed",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "50% reduced Presence Area of Effect",
        "ranges": []
      }
    ]
  },
  {
    "id": "strugglescream",
    "name": "Strugglescream",
    "baseType": "Stellar Amulet",
    "slot": "amulet",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(5–7) to all Attributes",
        "ranges": [
          [
            5,
            7
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Can have 3 additional Instilled Modifiers",
        "ranges": []
      }
    ]
  },
  {
    "id": "hinekoras_sight",
    "name": "Hinekora's Sight",
    "baseType": "Stellar Amulet",
    "slot": "amulet",
    "levelReq": 44,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 11 Future-Past",
        "ranges": []
      },
      {
        "text": "+(5–7) to all Attributes",
        "ranges": [
          [
            5,
            7
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(300–600) to Accuracy Rating",
        "ranges": [
          [
            300,
            600
          ]
        ]
      },
      {
        "text": "+(300–600) to Evasion Rating",
        "ranges": [
          [
            300,
            600
          ]
        ]
      },
      {
        "text": "Cannot be Blinded",
        "ranges": []
      }
    ]
  },
  {
    "id": "beacon_of_azis",
    "name": "Beacon of Azis",
    "baseType": "Solar Amulet",
    "slot": "amulet",
    "levelReq": 30,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Spirit",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+30 to Spirit",
        "ranges": []
      },
      {
        "text": "30% increased Light Radius",
        "ranges": []
      },
      {
        "text": "Critical Hits ignore Enemy Monster Elemental Resistances",
        "ranges": []
      }
    ]
  },
  {
    "id": "fireflower",
    "name": "Fireflower",
    "baseType": "Solar Amulet",
    "slot": "amulet",
    "levelReq": 52,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Spirit",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(10–15)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "+(1–4) to Level of all Fire Skills",
        "ranges": [
          [
            1,
            4
          ]
        ]
      },
      {
        "text": "(30–40)% increased Mana Regeneration Rate",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Take 100 Fire Damage when you Ignite an Enemy",
        "ranges": []
      }
    ]
  },
  {
    "id": "immaculate_adherence",
    "name": "Immaculate Adherence",
    "baseType": "Solar Amulet",
    "slot": "amulet",
    "levelReq": 30,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(10–15) to Spirit",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "100% of Damage is taken from Mana before Life",
        "ranges": []
      },
      {
        "text": "Cannot have Energy Shield",
        "ranges": []
      },
      {
        "text": "Convert 100% of maximum Energy Shield to maximum Divinity",
        "ranges": []
      },
      {
        "text": "(0–100)% increased maximum Divinity",
        "ranges": [
          [
            0,
            100
          ]
        ]
      },
      {
        "text": "20% reduced maximum Divinity per Corrupted Item Equipped",
        "ranges": []
      },
      {
        "text": "Skills Cost Divinity instead of Mana or Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "eye_of_chayula",
    "name": "Eye of Chayula",
    "baseType": "Gold Amulet",
    "slot": "amulet",
    "levelReq": 35,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(12–20)% increased Rarity of Items found",
        "ranges": [
          [
            12,
            20
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% reduced maximum Life",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(10–15) to all Attributes",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Cannot be Light Stunned",
        "ranges": []
      }
    ]
  },
  {
    "id": "serpents_egg",
    "name": "Serpent's Egg",
    "baseType": "Gold Amulet",
    "slot": "amulet",
    "levelReq": 35,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(12–20)% increased Rarity of Items found",
        "ranges": [
          [
            12,
            20
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(10–20) to all Attributes",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "(20–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Gain an additional Charge when you gain a Charge",
        "ranges": []
      }
    ]
  },
  {
    "id": "eventide_petals",
    "name": "Eventide Petals",
    "baseType": "Veridical Chain",
    "slot": "amulet",
    "levelReq": 55,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 13 Midnight Zenith",
        "ranges": []
      },
      {
        "text": "+(30–40) to maximum Runic Ward",
        "ranges": [
          [
            30,
            40
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(30–50)% increased Critical Hit Chance",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(25–35) to Intelligence",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "(30–50)% increased Light Radius",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Ice Crystals have (-3–3)% reduced maximum Life per 5% Cold Resistance you have",
        "ranges": [
          [
            -3,
            3
          ]
        ]
      }
    ]
  },
  {
    "id": "blackheart",
    "name": "Blackheart",
    "baseType": "Iron Ring",
    "slot": "ring",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds 1 to 4 Physical Damage to Attacks",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(3–6) Life Regeneration per second",
        "ranges": [
          [
            3,
            6
          ]
        ]
      },
      {
        "text": "Adds (4–6) to (8–10) Chaos Damage to Attacks",
        "ranges": [
          [
            4,
            6
          ],
          [
            8,
            10
          ]
        ]
      },
      {
        "text": "+(10–20)% of Armour also applies to Chaos Damage",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "25% chance to Intimidate Enemies for 4 seconds on Hit",
        "ranges": []
      }
    ]
  },
  {
    "id": "icefang_orbit",
    "name": "Icefang Orbit",
    "baseType": "Iron Ring",
    "slot": "ring",
    "levelReq": 36,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds 1 to 4 Physical Damage to Attacks",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (5–7) to (9–13) Physical Damage to Attacks",
        "ranges": [
          [
            5,
            7
          ],
          [
            9,
            13
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(10–20)% chance to Poison on Hit",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "All Damage taken from Hits while Poisoned Contributes to Magnitude of Chill on you",
        "ranges": []
      },
      {
        "text": "All Damage from Hits against Poisoned targets Contributes to Chill Magnitude",
        "ranges": []
      },
      {
        "text": "(15–25)% increased Magnitude of Poison you inflict",
        "ranges": [
          [
            15,
            25
          ]
        ]
      }
    ]
  },
  {
    "id": "prized_pain",
    "name": "Prized Pain",
    "baseType": "Iron Ring",
    "slot": "ring",
    "levelReq": 48,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds 1 to 4 Physical Damage to Attacks",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Skills Gain 10% of Mana Cost as Extra Life Cost",
        "ranges": []
      },
      {
        "text": "(24–35) to (36–53) Physical Thorns damage",
        "ranges": [
          [
            24,
            35
          ],
          [
            36,
            53
          ]
        ]
      },
      {
        "text": "(15–25)% chance to deal your Thorns Damage to Enemies you Hit with Melee Attacks",
        "ranges": [
          [
            15,
            25
          ]
        ]
      }
    ]
  },
  {
    "id": "venopuncture",
    "name": "Venopuncture",
    "baseType": "Iron Ring",
    "slot": "ring",
    "levelReq": 36,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds 1 to 4 Physical Damage to Attacks",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Adds (5–7) to (9–13) Physical Damage to Attacks",
        "ranges": [
          [
            5,
            7
          ],
          [
            9,
            13
          ]
        ]
      },
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "All Damage taken from Hits while Bleeding Contributes to Magnitude of Chill on you",
        "ranges": []
      },
      {
        "text": "All Damage from Hits against Bleeding targets Contributes to Chill Magnitude",
        "ranges": []
      },
      {
        "text": "(10–20)% chance to inflict Bleeding on Hit",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(15–25)% increased Magnitude of Bleeding you inflict",
        "ranges": [
          [
            15,
            25
          ]
        ]
      }
    ]
  },
  {
    "id": "doedres_damning",
    "name": "Doedre's Damning",
    "baseType": "Lazuli Ring",
    "slot": "ring",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30) to maximum Mana",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(5–15)% to all Elemental Resistances",
        "ranges": [
          [
            5,
            15
          ]
        ]
      },
      {
        "text": "Gain (1–10) Mana per enemy killed",
        "ranges": [
          [
            1,
            10
          ]
        ]
      },
      {
        "text": "You can apply an additional Curse",
        "ranges": []
      }
    ]
  },
  {
    "id": "glowswarm",
    "name": "Glowswarm",
    "baseType": "Lazuli Ring",
    "slot": "ring",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30) to maximum Mana",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Mana Recovery rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Mana Flasks gain (0.17–0.25) charges per Second",
        "ranges": [
          [
            0.17,
            0.25
          ]
        ]
      },
      {
        "text": "Using a Mana Flask grants Guard equal to 100% of Flask's recovery amount for 4 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "seed_of_cataclysm",
    "name": "Seed of Cataclysm",
    "baseType": "Lazuli Ring",
    "slot": "ring",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30) to maximum Mana",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(30–50)% increased Critical Hit Chance for Spells",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "5% reduced Critical Spell Damage Bonus per Critical Hit you've dealt with Spells Recently",
        "ranges": []
      },
      {
        "text": "+(13–17)% to Chaos Resistance",
        "ranges": [
          [
            13,
            17
          ]
        ]
      },
      {
        "text": "10% increased Mana Cost of Skills",
        "ranges": []
      },
      {
        "text": "(15–30)% chance for Spell Damage with Critical Hits to be Lucky",
        "ranges": [
          [
            15,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "cracklecreep",
    "name": "Cracklecreep",
    "baseType": "Ruby Ring",
    "slot": "ring",
    "levelReq": 8,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30)% to Fire Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% increased Fire Damage",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(3.1–6) Life Regeneration per second",
        "ranges": [
          [
            3.1,
            6
          ]
        ]
      },
      {
        "text": "(20–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Ignites you inflict spread to other Enemies that stay within 1.5 metres for 1 second",
        "ranges": []
      }
    ]
  },
  {
    "id": "blistering_bond",
    "name": "Blistering Bond",
    "baseType": "Ruby Ring",
    "slot": "ring",
    "levelReq": 8,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30)% to Fire Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(20–30)% to Fire Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(-15–-10)% to Cold Resistance",
        "ranges": [
          [
            -15,
            -10
          ]
        ]
      },
      {
        "text": "You take Fire Damage instead of Physical Damage from Bleeding",
        "ranges": []
      },
      {
        "text": "Fire Damage also Contributes to Bleeding Magnitude",
        "ranges": []
      },
      {
        "text": "Bleeding you inflict deals Fire Damage instead of Physical Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "polcirkeln",
    "name": "Polcirkeln",
    "baseType": "Sapphire Ring",
    "slot": "ring",
    "levelReq": 12,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% increased Cold Damage",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(10–15) to Strength",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Enemies Chilled by your Hits can be Shattered as though Frozen",
        "ranges": []
      }
    ]
  },
  {
    "id": "dream_fragments",
    "name": "Dream Fragments",
    "baseType": "Sapphire Ring",
    "slot": "ring",
    "levelReq": 12,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(10–15)% increased maximum Mana",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(30–50)% increased Mana Regeneration Rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "You cannot be Chilled or Frozen",
        "ranges": []
      }
    ]
  },
  {
    "id": "whisper_of_the_brotherhood",
    "name": "Whisper of the Brotherhood",
    "baseType": "Sapphire Ring",
    "slot": "ring",
    "levelReq": 32,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30)% to Cold Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(5–10)% increased Skill Speed",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "+(10–20) to Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(25–35)% increased Mana Regeneration Rate",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "100% of Cold Damage Converted to Lightning Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_burrower",
    "name": "The Burrower",
    "baseType": "Topaz Ring",
    "slot": "ring",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30)% to Lightning Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "-10% to Cold Resistance",
        "ranges": []
      },
      {
        "text": "+(20–30)% to Lightning Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(30–50)% increased Mana Regeneration Rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "Lightning Damage of Enemies Hitting you is Unlucky",
        "ranges": []
      }
    ]
  },
  {
    "id": "call_of_the_brotherhood",
    "name": "Call of the Brotherhood",
    "baseType": "Topaz Ring",
    "slot": "ring",
    "levelReq": 32,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30)% to Lightning Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(10–20) to Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(25–35)% increased Mana Regeneration Rate",
        "ranges": [
          [
            25,
            35
          ]
        ]
      },
      {
        "text": "(20–30)% increased Freeze Buildup",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "100% of Lightning Damage Converted to Cold Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "levinstone",
    "name": "Levinstone",
    "baseType": "Topaz Ring",
    "slot": "ring",
    "levelReq": 16,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(20–30)% to Lightning Resistance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "(10–20)% increased chance to Shock",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Lightning Skills Chain +1 times",
        "ranges": []
      },
      {
        "text": "(10–20)% increased Magnitude of Shock you inflict",
        "ranges": [
          [
            10,
            20
          ]
        ]
      }
    ]
  },
  {
    "id": "mings_heart",
    "name": "Ming's Heart",
    "baseType": "Amethyst Ring",
    "slot": "ring",
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(7–13)% to Chaos Resistance",
        "ranges": [
          [
            7,
            13
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "20% reduced maximum Life",
        "ranges": []
      },
      {
        "text": "Gain (30–40)% of Damage as Extra Chaos Damage",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "30% reduced Global Armour , Evasion and Energy Shield",
        "ranges": []
      }
    ]
  },
  {
    "id": "original_sin",
    "name": "Original Sin",
    "baseType": "Amethyst Ring",
    "slot": "ring",
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(7–13)% to Chaos Resistance",
        "ranges": [
          [
            7,
            13
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "100% of Elemental Damage Converted to Chaos Damage",
        "ranges": []
      }
    ]
  },
  {
    "id": "blackflame",
    "name": "Blackflame",
    "baseType": "Amethyst Ring",
    "slot": "ring",
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(7–13)% to Chaos Resistance",
        "ranges": [
          [
            7,
            13
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(15–30)% increased Mana Regeneration Rate",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "Ignite you inflict deals Chaos Damage instead of Fire Damage",
        "ranges": []
      },
      {
        "text": "(80–100)% increased Ignite Magnitude",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "(60–75)% reduced Ignite Duration on Enemies",
        "ranges": [
          [
            60,
            75
          ]
        ]
      },
      {
        "text": "Withered you inflict also increases Fire Damage taken",
        "ranges": []
      },
      {
        "text": "Withered does not expire on Enemies Ignited by you",
        "ranges": []
      },
      {
        "text": "use unique blackflame ignite effect [1]",
        "ranges": []
      }
    ]
  },
  {
    "id": "veilpiercer",
    "name": "Veilpiercer",
    "baseType": "Amethyst Ring",
    "slot": "ring",
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(7–13)% to Chaos Resistance",
        "ranges": [
          [
            7,
            13
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "+(15–25) to Intelligence",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Curses you inflict can affect Hexproof Enemies",
        "ranges": []
      },
      {
        "text": "Curses you inflict spread to enemies within 3 metres when Cursed enemy dies",
        "ranges": []
      },
      {
        "text": "Gain 1 Dark Whisper every second there is a Cursed Enemy in your Presence",
        "ranges": []
      },
      {
        "text": "(20–40)% increased Damage with Hits against targets in your Presence",
        "ranges": [
          [
            20,
            40
          ]
        ]
      }
    ]
  },
  {
    "id": "vigilant_view",
    "name": "Vigilant View",
    "baseType": "Emerald Ring",
    "slot": "ring",
    "levelReq": 26,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(120–160) to Accuracy Rating",
        "ranges": [
          [
            120,
            160
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(100–150) to Accuracy Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "+(100–150) to Evasion Rating",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(10–20)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Enemies have an Accuracy Penalty against you based on Distance",
        "ranges": []
      },
      {
        "text": "Maximum Chance to Evade is 50%",
        "ranges": []
      }
    ]
  },
  {
    "id": "death_rush",
    "name": "Death Rush",
    "baseType": "Emerald Ring",
    "slot": "ring",
    "levelReq": 26,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(120–160) to Accuracy Rating",
        "ranges": [
          [
            120,
            160
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(75–125) to Accuracy Rating",
        "ranges": [
          [
            75,
            125
          ]
        ]
      },
      {
        "text": "+(75–125) to Evasion Rating",
        "ranges": [
          [
            75,
            125
          ]
        ]
      },
      {
        "text": "Leech 5% of Physical Attack Damage as Life",
        "ranges": []
      },
      {
        "text": "You gain Onslaught for 4 seconds on Kill",
        "ranges": []
      }
    ]
  },
  {
    "id": "thiefs_torment",
    "name": "Thief's Torment",
    "baseType": "Emerald Ring",
    "slot": "ring",
    "levelReq": 26,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(120–160) to Accuracy Rating",
        "ranges": [
          [
            120,
            160
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(30–40)% increased Rarity of Items found",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "+(10–15)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Gain 25 Life per Enemy Hit with Attacks",
        "ranges": []
      },
      {
        "text": "Can't use other Rings",
        "ranges": []
      },
      {
        "text": "Gain 15 Mana per Enemy Hit with Attacks",
        "ranges": []
      },
      {
        "text": "50% reduced Duration of Curses on you",
        "ranges": []
      }
    ]
  },
  {
    "id": "evergrasping_ring",
    "name": "Evergrasping Ring",
    "baseType": "Pearl Ring",
    "slot": "ring",
    "levelReq": 32,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(7–10)% increased Cast Speed",
        "ranges": [
          [
            7,
            10
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(60–100) to maximum Mana",
        "ranges": [
          [
            60,
            100
          ]
        ]
      },
      {
        "text": "Allies in your Presence Gain (15–25)% of Damage as Extra Chaos Damage",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Enemies in your Presence Gain (6–12)% of Damage as Extra Chaos Damage",
        "ranges": [
          [
            6,
            12
          ]
        ]
      }
    ]
  },
  {
    "id": "snakepit",
    "name": "Snakepit",
    "baseType": "Pearl Ring",
    "slot": "ring",
    "levelReq": 32,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(7–10)% increased Cast Speed",
        "ranges": [
          [
            7,
            10
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% increased Spell Damage",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(10–15)% increased Cast Speed",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Left ring slot: Projectiles from Spells cannot Chain",
        "ranges": []
      },
      {
        "text": "Left ring slot: Projectiles from Spells Fork",
        "ranges": []
      },
      {
        "text": "Right ring slot: Projectiles from Spells Chain + 1 times",
        "ranges": []
      },
      {
        "text": "Right ring slot: Projectiles from Spells cannot Fork",
        "ranges": []
      },
      {
        "text": "Projectiles from Spells cannot Pierce",
        "ranges": []
      }
    ]
  },
  {
    "id": "heartbound_loop",
    "name": "Heartbound Loop",
    "baseType": "Pearl Ring",
    "slot": "ring",
    "levelReq": 32,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(7–10)% increased Cast Speed",
        "ranges": [
          [
            7,
            10
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "Minions have (10–15)% increased maximum Life",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(10–15) Life Regeneration per second",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(20–40)% increased Mana Regeneration Rate",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "300 Physical Damage taken on Minion Death",
        "ranges": []
      },
      {
        "text": "Minions Revive (10–15)% faster",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ]
  },
  {
    "id": "gifts_from_above",
    "name": "Gifts from Above",
    "baseType": "Prismatic Ring",
    "slot": "ring",
    "levelReq": 35,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(7–10)% to all Elemental Resistances",
        "ranges": [
          [
            7,
            10
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% increased Critical Hit Chance",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(20–30)% increased Light Radius",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(20–30)% increased Rarity of Items Dropped by Enemies killed with a Critical Hit",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "You have Consecrated Ground around you while stationary",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_taming",
    "name": "The Taming",
    "baseType": "Prismatic Ring",
    "slot": "ring",
    "levelReq": 42,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(7–10)% to all Elemental Resistances",
        "ranges": [
          [
            7,
            10
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(10–20)% to all Elemental Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(10–20)% increased Damage for each type of Elemental Ailment on Enemy",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Wind Skills which can be boosted by Elemental Ground Surfaces can be boosted by multiple Elemental Ground Surfaces",
        "ranges": []
      },
      {
        "text": "Wind Skills which can be boosted by Elemental Ground Surfaces count as being boosted by Ignited , Shocked , and Chilled Ground",
        "ranges": []
      }
    ]
  },
  {
    "id": "perandus_seal",
    "name": "Perandus Seal",
    "baseType": "Gold Ring",
    "slot": "ring",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(6–15)% increased Rarity of Items found",
        "ranges": [
          [
            6,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(30–50) to maximum Mana",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(5–10) to all Attributes",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "(10–15)% increased Quantity of Gold Dropped by Slain Enemies",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ]
  },
  {
    "id": "andvarius",
    "name": "Andvarius",
    "baseType": "Gold Ring",
    "slot": "ring",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(6–15)% increased Rarity of Items found",
        "ranges": [
          [
            6,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(50–70)% increased Rarity of Items found",
        "ranges": [
          [
            50,
            70
          ]
        ]
      },
      {
        "text": "+10 to Dexterity",
        "ranges": []
      },
      {
        "text": "-20% to all Elemental Resistances",
        "ranges": []
      }
    ]
  },
  {
    "id": "ventors_gamble",
    "name": "Ventor's Gamble",
    "baseType": "Gold Ring",
    "slot": "ring",
    "levelReq": 64,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "(6–15)% increased Rarity of Items found",
        "ranges": [
          [
            6,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(0–80) to maximum Life",
        "ranges": [
          [
            0,
            80
          ]
        ]
      },
      {
        "text": "+(0–20) to Spirit",
        "ranges": [
          [
            0,
            20
          ]
        ]
      },
      {
        "text": "(-25–25)% reduced Rarity of Items found",
        "ranges": [
          [
            -25,
            25
          ]
        ]
      },
      {
        "text": "(-40–40)% to Fire Resistance",
        "ranges": [
          [
            -40,
            40
          ]
        ]
      },
      {
        "text": "(-40–40)% to Cold Resistance",
        "ranges": [
          [
            -40,
            40
          ]
        ]
      },
      {
        "text": "(-40–40)% to Lightning Resistance",
        "ranges": [
          [
            -40,
            40
          ]
        ]
      }
    ]
  },
  {
    "id": "bursting_decay",
    "name": "Bursting Decay",
    "baseType": "Unset Ring",
    "slot": "ring",
    "levelReq": 60,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants 1 additional Skill Slots",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(15–25)% increased Rarity of Items found",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Lose 5% of maximum Life per second",
        "ranges": []
      },
      {
        "text": "Attacks have added Physical damage equal to 3% of maximum Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "grip_of_kulemak",
    "name": "Grip of Kulemak",
    "baseType": "Abyssal Signet",
    "slot": "ring",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Inflict Abyssal Wasting on Hit",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% reduced Presence Area of Effect",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(20–30)% reduced Light Radius",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "bereks_pass",
    "name": "Berek's Pass",
    "baseType": "Two-Stone Ring",
    "slot": "ring",
    "levelReq": 42,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(12–16)% to Fire and Cold Resistances",
        "ranges": [
          [
            12,
            16
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(10–20) to Strength and Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20)% to Fire and Cold Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Regenerate (1–2)% of maximum Life per second while Ignited",
        "ranges": [
          [
            1,
            2
          ]
        ]
      },
      {
        "text": "Wind Skills which can be boosted by Elemental Ground Surfaces count as being boosted by Chilled Ground",
        "ranges": []
      }
    ]
  },
  {
    "id": "bereks_respite",
    "name": "Berek's Respite",
    "baseType": "Two-Stone Ring",
    "slot": "ring",
    "levelReq": 42,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(12–16)% to Fire and Lightning Resistances",
        "ranges": [
          [
            12,
            16
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(10–20) to Strength and Dexterity",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20)% to Fire and Lightning Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "(15–25)% increased Critical Damage Bonus while Shocked",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Wind Skills which can be boosted by Elemental Ground Surfaces count as being boosted by Ignited Ground",
        "ranges": []
      }
    ]
  },
  {
    "id": "bereks_grip",
    "name": "Berek's Grip",
    "baseType": "Two-Stone Ring",
    "slot": "ring",
    "levelReq": 42,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "+(12–16)% to Cold and Lightning Resistances",
        "ranges": [
          [
            12,
            16
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(10–20) to Dexterity and Intelligence",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20)% to Cold and Lightning Resistances",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Hits against you have (35–50)% reduced Critical Hit Chance while you are Chilled",
        "ranges": [
          [
            35,
            50
          ]
        ]
      },
      {
        "text": "Wind Skills which can be boosted by Elemental Ground Surfaces count as being boosted by Shocked Ground",
        "ranges": []
      }
    ]
  },
  {
    "id": "meginords_girdle",
    "name": "Meginord's Girdle",
    "baseType": "Rawhide Belt",
    "slot": "belt",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Life Recovery from Flasks",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–50) to Strength",
        "ranges": [
          [
            40,
            50
          ]
        ]
      },
      {
        "text": "+(10–15)% to Cold Resistance",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "50% increased Flask Charges used",
        "ranges": []
      },
      {
        "text": "100% increased Flask Charges gained",
        "ranges": []
      }
    ]
  },
  {
    "id": "midnight_braid",
    "name": "Midnight Braid",
    "baseType": "Rawhide Belt",
    "slot": "belt",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Life Recovery from Flasks",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(30–50) to maximum Mana",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "+(5–10)% to all Elemental Resistances",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "50% of Damage taken Recouped as Mana",
        "ranges": []
      }
    ]
  },
  {
    "id": "keelhaul",
    "name": "Keelhaul",
    "baseType": "Linen Belt",
    "slot": "belt",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Mana Recovery from Flasks",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(-25–25)% reduced Flask Life Recovery rate",
        "ranges": [
          [
            -25,
            25
          ]
        ]
      },
      {
        "text": "(-25–25)% reduced Flask Mana Recovery rate",
        "ranges": [
          [
            -25,
            25
          ]
        ]
      },
      {
        "text": "Life Flasks gain 0.25 charges per Second",
        "ranges": []
      },
      {
        "text": "Mana Flasks gain 0.25 charges per Second",
        "ranges": []
      }
    ]
  },
  {
    "id": "umbilicus_immortalis",
    "name": "Umbilicus Immortalis",
    "baseType": "Linen Belt",
    "slot": "belt",
    "levelReq": 24,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Mana Recovery from Flasks",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(30–40)% reduced Flask Effect Duration",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Minions have (20–30)% increased maximum Life",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Your Life Flask also applies to your Minions",
        "ranges": []
      },
      {
        "text": "Minions cannot Die while affected by a Life Flask",
        "ranges": []
      },
      {
        "text": "(20–30)% increased Flask Charges gained",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "birthright_buckle",
    "name": "Birthright Buckle",
    "baseType": "Wide Belt",
    "slot": "belt",
    "levelReq": 14,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Charges gained",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(100–150) to Armour",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(10–15)% reduced Flask Charges used",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Charges gained",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Life Flasks used while on Low Life apply Recovery Instantly",
        "ranges": []
      },
      {
        "text": "Mana Flasks used while on Low Mana apply Recovery Instantly",
        "ranges": []
      }
    ]
  },
  {
    "id": "byrnabas",
    "name": "Byrnabas",
    "baseType": "Wide Belt",
    "slot": "belt",
    "levelReq": 14,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Charges gained",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Mana",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(30–40)% to Lightning Resistance",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "(7–12) Life Regeneration per second",
        "ranges": [
          [
            7,
            12
          ]
        ]
      },
      {
        "text": "Cannot be Shocked",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_gnashing_sash",
    "name": "The Gnashing Sash",
    "baseType": "Wide Belt",
    "slot": "belt",
    "levelReq": 60,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Charges gained",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(15–35)% increased Flask Life Recovery rate",
        "ranges": [
          [
            15,
            35
          ]
        ]
      },
      {
        "text": "+(17–23)% to Chaos Resistance",
        "ranges": [
          [
            17,
            23
          ]
        ]
      },
      {
        "text": "Lose 5% of maximum Life per second",
        "ranges": []
      },
      {
        "text": "Life Recovery from Flasks can Overflow Maximum Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "soul_tether",
    "name": "Soul Tether",
    "baseType": "Long Belt",
    "slot": "belt",
    "levelReq": 20,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(15–20)% increased Charm Effect Duration",
        "ranges": [
          [
            15,
            20
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Energy Shield",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "You lose 5% of maximum Energy Shield per second",
        "ranges": []
      },
      {
        "text": "Excess Life Recovery from Leech is applied to Energy Shield",
        "ranges": []
      }
    ]
  },
  {
    "id": "goregirdle",
    "name": "Goregirdle",
    "baseType": "Plate Belt",
    "slot": "belt",
    "levelReq": 24,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "+(140–180) to Armour",
        "ranges": [
          [
            140,
            180
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(20–30) to Strength",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(10–20) Life Regeneration per second",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Defend with 200% of Armour",
        "ranges": []
      },
      {
        "text": "Maximum Physical Damage Reduction is 50%",
        "ranges": []
      }
    ]
  },
  {
    "id": "ryslathas_coil",
    "name": "Ryslatha's Coil",
    "baseType": "Ornate Belt",
    "slot": "belt",
    "levelReq": 31,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(10–15)% reduced Charm Charges used",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(80–100) to maximum Life",
        "ranges": [
          [
            80,
            100
          ]
        ]
      },
      {
        "text": "(30–50)% increased Flask Life Recovery rate",
        "ranges": [
          [
            30,
            50
          ]
        ]
      },
      {
        "text": "(30–40)% more maximum Physical Attack Damage",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "(30–40)% less minimum Physical Attack Damage",
        "ranges": [
          [
            30,
            40
          ]
        ]
      }
    ]
  },
  {
    "id": "cowards_legacy",
    "name": "Coward's Legacy",
    "baseType": "Mail Belt",
    "slot": "belt",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(10–15)% reduced Flask Charges used",
        "ranges": [
          [
            10,
            15
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(-20–-10) to Strength",
        "ranges": [
          [
            -20,
            -10
          ]
        ]
      },
      {
        "text": "+(20–30) to Dexterity",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(30–40)% increased Life and Mana Recovery from Flasks",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "You are considered on Low Life while at 75% of maximum Life or below instead",
        "ranges": []
      }
    ]
  },
  {
    "id": "bijouborne",
    "name": "Bijouborne",
    "baseType": "Double Belt",
    "slot": "belt",
    "levelReq": 44,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Grants Skill: Level 11 Cast on Charm Use",
        "ranges": []
      },
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Charm Charges gained",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(50–100) to maximum Mana",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "(10–50)% reduced Charm Effect Duration",
        "ranges": [
          [
            10,
            50
          ]
        ]
      },
      {
        "text": "+2 Charm Slots",
        "ranges": []
      },
      {
        "text": "+(15–25) to Dexterity",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "(20–30)% increased Charm Charges gained",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "waistgate",
    "name": "Waistgate",
    "baseType": "Heavy Belt",
    "slot": "belt",
    "levelReq": 50,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Stun Threshold",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(50–80) to maximum Life",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "+(50–80) to maximum Mana",
        "ranges": [
          [
            50,
            80
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Life Recovery rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Mana Recovery rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Life and Mana Flasks can be equipped in either slot",
        "ranges": []
      }
    ]
  },
  {
    "id": "headhunter",
    "name": "Headhunter",
    "baseType": "Heavy Belt",
    "slot": "belt",
    "levelReq": 50,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Stun Threshold",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "+(40–60) to maximum Life",
        "ranges": [
          [
            40,
            60
          ]
        ]
      },
      {
        "text": "+(20–40) to Strength",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "+(20–40) to Dexterity",
        "ranges": [
          [
            20,
            40
          ]
        ]
      },
      {
        "text": "When you kill a Rare monster, you gain its Modifiers for 60 seconds",
        "ranges": []
      }
    ]
  },
  {
    "id": "zerphis_genesis",
    "name": "Zerphi's Genesis",
    "baseType": "Heavy Belt",
    "slot": "belt",
    "levelReq": 56,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "(20–30)% increased Stun Threshold",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ],
    "explicits": [
      {
        "text": "(25–50)% increased Corrupted Charms effect duration",
        "ranges": [
          [
            25,
            50
          ]
        ]
      },
      {
        "text": "50% of Charges consumed by used Charms are granted to your Life Flasks",
        "ranges": []
      },
      {
        "text": "50% of Charges consumed by used Life Flasks are granted to your Charms",
        "ranges": []
      },
      {
        "text": "+(10–30) to Strength",
        "ranges": [
          [
            10,
            30
          ]
        ]
      },
      {
        "text": "Skills from Corrupted Gems have (15–25)% increased Cost Efficiency during any Flask Effect",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "Corrupted Blood cannot be inflicted on you",
        "ranges": []
      }
    ]
  },
  {
    "id": "cat_o_nine_tails",
    "name": "Cat O' Nine Tails",
    "baseType": "Utility Belt",
    "slot": "belt",
    "levelReq": 55,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "20% of Flask Recovery applied Instantly",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "+(120–200) to maximum Life",
        "ranges": [
          [
            120,
            200
          ]
        ]
      },
      {
        "text": "Regenerate 5% of maximum Life per second if you have been Hit Recently",
        "ranges": []
      },
      {
        "text": "(25–50)% increased Life Recovery rate",
        "ranges": [
          [
            25,
            50
          ]
        ]
      },
      {
        "text": "Life Recovery other than Flasks cannot Recover Life to above Low Life",
        "ranges": []
      },
      {
        "text": "Gain Physical Thorns damage equal to 8% - 12% of maximum Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "ingenuity",
    "name": "Ingenuity",
    "baseType": "Utility Belt",
    "slot": "belt",
    "levelReq": 55,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "20% of Flask Recovery applied Instantly",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(-20–20)% reduced Charm Charges gained",
        "ranges": [
          [
            -20,
            20
          ]
        ]
      },
      {
        "text": "(-10–10)% reduced Charm Charges used",
        "ranges": [
          [
            -10,
            10
          ]
        ]
      },
      {
        "text": "(20–30)% increased bonuses gained from left Equipped Ring",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(20–30)% increased bonuses gained from right Equipped Ring",
        "ranges": [
          [
            20,
            30
          ]
        ]
      }
    ]
  },
  {
    "id": "mageblood",
    "name": "Mageblood",
    "baseType": "Utility Belt",
    "slot": "belt",
    "levelReq": 55,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "20% of Flask Recovery applied Instantly",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "All Mage's Legacies have (25–50)% increased effect per duplicate Mage's Legacy you have",
        "ranges": [
          [
            25,
            50
          ]
        ]
      },
      {
        "text": "Legacy of Mages Legacy",
        "ranges": []
      },
      {
        "text": "Legacy of Mages Legacy",
        "ranges": []
      },
      {
        "text": "Legacy of Mages Legacy",
        "ranges": []
      },
      {
        "text": "Legacy of Mages Legacy",
        "ranges": []
      }
    ]
  },
  {
    "id": "shavronnes_satchel",
    "name": "Shavronne's Satchel",
    "baseType": "Fine Belt",
    "slot": "belt",
    "levelReq": 62,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "Flasks gain 0.17 charges per Second",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(20–30)% reduced Flask Life Recovery rate",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "+(20–30) to Intelligence",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "(20–30)% increased Flask Charges gained",
        "ranges": [
          [
            20,
            30
          ]
        ]
      },
      {
        "text": "Life Recovery from Flasks also applies to Energy Shield",
        "ranges": []
      }
    ]
  },
  {
    "id": "darkness_enthroned",
    "name": "Darkness Enthroned",
    "baseType": "Fine Belt",
    "slot": "belt",
    "levelReq": 62,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Has (1–3) Charm Slots",
        "ranges": [
          [
            1,
            3
          ]
        ]
      },
      {
        "text": "Flasks gain 0.17 charges per Second",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(50–100)% increased effect of Socketed Augment Items",
        "ranges": [
          [
            50,
            100
          ]
        ]
      },
      {
        "text": "This item gains bonuses from Socketed Items as though it was a Body Armour",
        "ranges": []
      },
      {
        "text": "Has 2 Augment Sockets (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "blood_of_the_warrior",
    "name": "Blood of the Warrior",
    "baseType": "Gargantuan Life Flask",
    "slot": "flask",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "90% less Life Recovered",
        "ranges": []
      },
      {
        "text": "Effect is not removed when Unreserved Life is Filled",
        "ranges": []
      },
      {
        "text": "(15–30)% of Damage taken during effect Recouped as Life",
        "ranges": [
          [
            15,
            30
          ]
        ]
      },
      {
        "text": "Gain (3–5) Rage when Hit by an Enemy during effect",
        "ranges": [
          [
            3,
            5
          ]
        ]
      },
      {
        "text": "No Inherent loss of Rage during effect",
        "ranges": []
      },
      {
        "text": "(25–50)% increased Duration",
        "ranges": [
          [
            25,
            50
          ]
        ]
      }
    ]
  },
  {
    "id": "olroths_resolve",
    "name": "Olroth's Resolve",
    "baseType": "Ultimate Life Flask",
    "slot": "flask",
    "levelReq": 60,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(100–150)% increased Charges per use",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "Regenerate (2.5–5)% of maximum Runic Ward per second during Effect",
        "ranges": [
          [
            2.5,
            5
          ]
        ]
      },
      {
        "text": "Gain Guard equal to Current Runic Ward for 10 seconds when Effect ends",
        "ranges": []
      }
    ]
  },
  {
    "id": "opportunity",
    "name": "Opportunity",
    "baseType": "Ultimate Life Flask",
    "slot": "flask",
    "levelReq": 60,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Effect is not removed when Unreserved Life is Filled",
        "ranges": []
      },
      {
        "text": "Cannot be Used manually",
        "ranges": []
      },
      {
        "text": "Used when you release a skill with Perfect Timing",
        "ranges": []
      },
      {
        "text": "Skills have (80–120)% longer Perfect Timing window during effect",
        "ranges": [
          [
            80,
            120
          ]
        ]
      },
      {
        "text": "(100–150)% increased Amount Recovered",
        "ranges": [
          [
            100,
            150
          ]
        ]
      },
      {
        "text": "(25–50)% reduced Recovery rate",
        "ranges": [
          [
            25,
            50
          ]
        ]
      },
      {
        "text": "(50–75)% reduced Charges per use",
        "ranges": [
          [
            50,
            75
          ]
        ]
      }
    ]
  },
  {
    "id": "laviangas_spirits",
    "name": "Lavianga's Spirits",
    "baseType": "Gargantuan Mana Flask",
    "slot": "flask",
    "levelReq": 49,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "This Flask cannot be Used but applies its Effect constantly",
        "ranges": []
      },
      {
        "text": "(70–80)% reduced Amount Recovered",
        "ranges": [
          [
            70,
            80
          ]
        ]
      }
    ]
  },
  {
    "id": "uhtreds_chalice",
    "name": "Uhtred's Chalice",
    "baseType": "Transcendent Mana Flask",
    "slot": "flask",
    "levelReq": 50,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "(200–300)% increased Amount Recovered",
        "ranges": [
          [
            200,
            300
          ]
        ]
      },
      {
        "text": "70% reduced Recovery rate",
        "ranges": []
      },
      {
        "text": "(50–60)% reduced Charges",
        "ranges": [
          [
            50,
            60
          ]
        ]
      },
      {
        "text": "Mana Recovery from Flasks can Overflow maximum Mana during Effect",
        "ranges": []
      },
      {
        "text": "Lose 5% Life per second while you have no Runic Ward during Effect",
        "ranges": []
      }
    ]
  },
  {
    "id": "melting_maelstrom",
    "name": "Melting Maelstrom",
    "baseType": "Ultimate Mana Flask",
    "slot": "flask",
    "levelReq": 60,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Effect is not removed when Unreserved Mana is Filled",
        "ranges": []
      },
      {
        "text": "(200–250)% increased Duration",
        "ranges": [
          [
            200,
            250
          ]
        ]
      },
      {
        "text": "Deals 25% of current Mana as Chaos Damage to you when Effect ends",
        "ranges": []
      },
      {
        "text": "Every 3 seconds during Effect, deal 100% of Mana spent in those seconds as Chaos Damage to Enemies within 3 metres",
        "ranges": []
      }
    ]
  },
  {
    "id": "nascent_hope",
    "name": "Nascent Hope",
    "baseType": "Thawing Charm",
    "slot": "charm",
    "levelReq": 12,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you become Frozen",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(20–25)% Chance to gain a Charge when you kill an enemy",
        "ranges": [
          [
            20,
            25
          ]
        ]
      },
      {
        "text": "Energy Shield Recharge starts on use",
        "ranges": []
      }
    ]
  },
  {
    "id": "sanguis_heroum",
    "name": "Sanguis Heroum",
    "baseType": "Staunching Charm",
    "slot": "charm",
    "levelReq": 18,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you start Bleeding",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Gains (0.15–0.2) Charges per Second",
        "ranges": [
          [
            0.15,
            0.2
          ]
        ]
      },
      {
        "text": "Creates Consecrated Ground on use",
        "ranges": []
      },
      {
        "text": "charm create consecrated ground when used duration ms [4000]",
        "ranges": []
      },
      {
        "text": "charm create consecrated ground when used radius [14]",
        "ranges": []
      }
    ]
  },
  {
    "id": "arakaalis_gift",
    "name": "Arakaali's Gift",
    "baseType": "Antidote Charm",
    "slot": "charm",
    "levelReq": 24,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you become Poisoned",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Recover Life equal to (15–20)% of Mana Flask's Recovery Amount when used",
        "ranges": [
          [
            15,
            20
          ]
        ]
      },
      {
        "text": "Recover Mana equal to (15–20)% of Life Flask's Recovery Amount when used",
        "ranges": [
          [
            15,
            20
          ]
        ]
      }
    ]
  },
  {
    "id": "beiras_anguish",
    "name": "Beira's Anguish",
    "baseType": "Dousing Charm",
    "slot": "charm",
    "levelReq": 32,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you become Ignited",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(20–25)% Chance to gain a Charge when you kill an enemy",
        "ranges": [
          [
            20,
            25
          ]
        ]
      },
      {
        "text": "Creates Ignited Ground for 4 seconds when used, Igniting enemies as though dealing Fire damage equal to 500% of your maximum Life",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_black_cat",
    "name": "The Black Cat",
    "baseType": "Grounding Charm",
    "slot": "charm",
    "levelReq": 32,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you become Shocked",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(10–20)% increased Duration",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "Lightning Damage of Enemies Hitting you is Unlucky during effect",
        "ranges": []
      }
    ]
  },
  {
    "id": "for_utopia",
    "name": "For Utopia",
    "baseType": "Stone Charm",
    "slot": "charm",
    "levelReq": 8,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you become Stunned",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Defend with 200% of Armour during effect",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_fall_of_the_axe",
    "name": "The Fall of the Axe",
    "baseType": "Silver Charm",
    "slot": "charm",
    "levelReq": 10,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you are affected by a Slow",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Grants Onslaught during effect",
        "ranges": []
      }
    ]
  },
  {
    "id": "ngamahus_chosen",
    "name": "Ngamahu's Chosen",
    "baseType": "Ruby Charm",
    "slot": "charm",
    "levelReq": 5,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you take Fire damage from a Hit",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(30–40)% increased Charges",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Grants up to your maximum Rage on use",
        "ranges": []
      }
    ]
  },
  {
    "id": "breath_of_the_mountains",
    "name": "Breath of the Mountains",
    "baseType": "Sapphire Charm",
    "slot": "charm",
    "levelReq": 5,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you take Cold damage from a Hit",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(10–15)% reduced Charges per use",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Grants a Power Charge on use",
        "ranges": []
      }
    ]
  },
  {
    "id": "valakos_roar",
    "name": "Valako's Roar",
    "baseType": "Topaz Charm",
    "slot": "charm",
    "levelReq": 5,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you take Lightning damage from a Hit",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(30–40)% increased Charges gained",
        "ranges": [
          [
            30,
            40
          ]
        ]
      },
      {
        "text": "Grants a Frenzy Charge on use",
        "ranges": []
      }
    ]
  },
  {
    "id": "forsaken_bangle",
    "name": "Forsaken Bangle",
    "baseType": "Amethyst Charm",
    "slot": "charm",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you take Chaos damage from a Hit",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "(15–25)% increased Duration",
        "ranges": [
          [
            15,
            25
          ]
        ]
      },
      {
        "text": "50% of Chaos damage you prevent when Hit Recouped as Life and Mana during effect",
        "ranges": []
      }
    ]
  },
  {
    "id": "rite_of_passage",
    "name": "Rite of Passage",
    "baseType": "Golden Charm",
    "slot": "charm",
    "levelReq": 50,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Used when you kill a Rare or Unique enemy",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Possessed by Spirit Of The [Azmeri Spirit] for (10–20) seconds on use",
        "ranges": [
          [
            10,
            20
          ]
        ]
      }
    ]
  },
  {
    "id": "kalandras_touch",
    "name": "Kalandra's Touch",
    "baseType": "Ring",
    "slot": "ring",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "Reflects opposite Ring",
        "ranges": []
      }
    ]
  },
  {
    "id": "safrins_resolve",
    "name": "Safrin's Resolve",
    "baseType": "Ring",
    "slot": "ring",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "You can only Socket Ruby Jewels in this item",
        "ranges": []
      },
      {
        "text": "(10–20)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20) to all Attributes",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(5–10)% to Cold and Lightning Resistances per Equipped Item with a Fire Resistance Modifier",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Has 1 Jewel Socket (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "eshteras_path",
    "name": "Eshtera's Path",
    "baseType": "Ring",
    "slot": "ring",
    "levelReq": 1,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "You can only Socket Sapphire Jewels in this item",
        "ranges": []
      },
      {
        "text": "(10–20)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20) to all Attributes",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(5–10)% to Fire and Cold Resistances per Equipped Item with a Lightning Resistance Modifier",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Has 1 Jewel Socket (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "zaidas_longevity",
    "name": "Zaida's Longevity",
    "baseType": "Ring",
    "slot": "ring",
    "levelReq": 40,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [],
    "explicits": [
      {
        "text": "You can only Socket Emerald Jewels in this item",
        "ranges": []
      },
      {
        "text": "(10–20)% increased Rarity of Items found",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(10–20) to all Attributes",
        "ranges": [
          [
            10,
            20
          ]
        ]
      },
      {
        "text": "+(5–10)% to Fire and Lightning Resistances per Equipped Item with a Cold Resistance Modifier",
        "ranges": [
          [
            5,
            10
          ]
        ]
      },
      {
        "text": "Has 1 Jewel Socket (Hidden)",
        "ranges": []
      }
    ]
  },
  {
    "id": "wraeclast_besieged",
    "name": "Wraeclast Besieged",
    "baseType": "Breach Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds an Otherworldy Breach to a Map 10 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Breach Hives in Map have (2–5) additional waves of Hiveborn Monsters",
        "ranges": [
          [
            2,
            5
          ]
        ]
      },
      {
        "text": "Breaches in Map have (-10–20)% reduced Pack Size",
        "ranges": [
          [
            -10,
            20
          ]
        ]
      },
      {
        "text": "Unstable Breaches in Map take 120 additional seconds to collapse after timer is filled",
        "ranges": []
      },
      {
        "text": "Unstable Breaches in Map spawn (2–5) additional Rare Monsters when Stabilised",
        "ranges": [
          [
            2,
            5
          ]
        ]
      }
    ]
  },
  {
    "id": "clear_skies",
    "name": "Clear Skies",
    "baseType": "Delirium Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds a Mirror of Delirium to a Map 10 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Delirium Fog in your Maps never dissipates",
        "ranges": []
      },
      {
        "text": "Delirium Fog in Map applies (-10–10)% reduced Deliriousness to Players",
        "ranges": [
          [
            -10,
            10
          ]
        ]
      }
    ]
  },
  {
    "id": "freedom_of_faith",
    "name": "Freedom of Faith",
    "baseType": "Ritual Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds Ritual Altars to a Map 10 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Favours at Ritual Altars in Area costs (10–15)% increased Tribute",
        "ranges": [
          [
            10,
            15
          ]
        ]
      },
      {
        "text": "Can Reroll Favours at Ritual Altars in your Maps twice as many times",
        "ranges": []
      }
    ]
  },
  {
    "id": "the_grand_project",
    "name": "The Grand Project",
    "baseType": "Irradiated Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds Irradiated to a Map 1 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Can only be applied to Precursor Tower Maps Completing the Tower makes all nearby Maps accessible",
        "ranges": []
      }
    ]
  },
  {
    "id": "visions_of_paradise",
    "name": "Visions of Paradise",
    "baseType": "Irradiated Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds Irradiated to a Map 1 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "If Map was not previously Irradiated , completing Map adds Irradiation instead",
        "ranges": []
      }
    ]
  },
  {
    "id": "mastered_domain",
    "name": "Mastered Domain",
    "baseType": "Irradiated Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds Irradiated to a Map 1 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Map also counts as a Water Map",
        "ranges": []
      }
    ]
  },
  {
    "id": "season_of_the_hunt",
    "name": "Season of the Hunt",
    "baseType": "Overseer Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Empowers the Map Boss of a Map 10 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Map Bosses are Hunted by Azmeri Spirits",
        "ranges": []
      }
    ]
  },
  {
    "id": "cruel_hegemony",
    "name": "Cruel Hegemony",
    "baseType": "Overseer Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Empowers the Map Boss of a Map 10 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "Map Bosses have 1 additional Modifiers",
        "ranges": []
      }
    ]
  },
  {
    "id": "unforeseen_consequences",
    "name": "Unforeseen Consequences",
    "baseType": "Abyss Tablet",
    "slot": null,
    "levelReq": 65,
    "attrReqs": {
      "str": 0,
      "dex": 0,
      "int": 0
    },
    "implicits": [
      {
        "text": "Adds Abysses to a Map 1 uses remaining",
        "ranges": []
      }
    ],
    "explicits": [
      {
        "text": "% more Waystones found in Area",
        "ranges": []
      },
      {
        "text": "additional Rare Monsters are spawned from Abysses in Map",
        "ranges": []
      },
      {
        "text": "Map contains (14–18) additional Abysses",
        "ranges": [
          [
            14,
            18
          ]
        ]
      },
      {
        "text": "Map is overrun by the Abyssal",
        "ranges": []
      },
      {
        "text": "map abyss tower augment quantity +% final from overrun unique tablet [-75]",
        "ranges": []
      }
    ]
  }
]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { POE2_UNIQUE_DATA };
}
