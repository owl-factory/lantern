export const characterData = {
  ruleSet: "5e",

  name: "Waals Brodnen",
  classes: ["wizard", "fighter"],
  classesReadable: ["Wizard", "Fighter"], // Not saved, but here for easy reference
  subclasses: ["bladesinger", "eldritchKnight"],
  subclassesReadable: ["Bladesinger", "Eldritch Knight"], // Not saved, but here for easy reference
  levels: [11, 3],
  totalLevel: 14,
  background: "Thief and Orphan",
  race: "halfwalker",
  subrace: "human",
  raceReadable: "Halfwalker",
  subraceReadable: "Human Halfwalker",
  alignment: "Chaotic Neutral",
  experiencePoints: "60",

  inspiration: 1,
  proficiency: 1,
  strength: 16,
  dexterity: 14,
  constitution: 16,
  intelligence: 20,
  wisdom: 10,
  charisma: 12,

  attributeValues: [
    16,
    14,
    16,
    20,
    10,
    12,
  ],

  attributeMods: [
    3,
    2,
    3,
    5,
    0,
    1,
  ],

  savingThrowModifiers: [
    8,
    2,
    3,
    10,
    5,
    1,
  ],

  savingThrowProficiencies: [
    true,
    false,
    false,
    true,
    true,
    false,
  ],

  // The total modifier of a given skill
  skillModifiers: [
    1, // Acrobatics
    4, // Animal Handling
    3, // Arcana
    0, // Athletics
    5, // Deception
    3, // History
    4, // Insight
    5, // Intimidation
    3, // Investigation
    4, // Medicine
    3, // Nature
    4, // Perception
    5, // Performance
    5, // Pursuasion
    3, // Religion
    1, // Slight
    1, // Stealth
    5, // Survival
  ],

  // Whether or not a skill is proficient or not
  skillProficiencies: [
    false, // Acrobatics
    false, // Animal Handling
    false, // Arcana
    false, // Athletics
    false, // Deception
    false, // History
    false, // Insight
    false, // Intimidation
    false, // Investigation
    false, // Medicine
    false, // Nature
    false, // Perception
    false, // Performance
    false, // Pursuasion
    false, // Religion
    false, // Slight
    false, // Stealth
    false, // Survival
  ],

  proficiencyNames: [
    "Light Armor",
    "Medium Armor",
    "Heavy Armor",
    "Seawalker",
  ],

  proficiencyTypes: [
    1,
    1,
    1,
    3,
  ],

  proficiencyDisplayOrder: [
    0,
    1,
    2,
    3,
  ],

  armorClass: 19,
  armorClassReason: "Base 10. Dex +2. Lemurian Breastplate +4. Etherial Shield +3",

  initiative: 2,

  speed: 30,

  maxHP: 120,
  currentHP: 82,
  temporaryHP: 50,

  maxHitDice: 13,
  currentHitDice: 7,

  deathSaveSuccesses: [0, 0, 0],
  deathSaveFailures: [1, 0, 0],

  currencies: [
    12,
    8,
    0,
    15,
    1,
  ],

  equipment: [
    {
      name: "Teardrop",
      weight: 2,
      quantity: 1,
      description: "A broken hilt of a longsword that forms a glowing, charged blade of water when activated.",
    },
    {
      name: "Waals' Spellbook",
      weight: 1,
      quantity: 1,
      description: "A tome filled with spells, research notes, and journal entries.",
    },
    {
      name: "Krile Revolver",
      weight: 3,
      quantity: 1,
      description: "An enchanted revolver that allows for charged shots of fire or poison.",
    },
    {
      name: "Krile Rounds",
      weight: 0.1,
      quantity: 10,
      description: "Specialized gold rounds for the Krile revolver, meant to deliver an enchantment.",
    },
  ],

  equipmentDisplayOrder: [
    0,
    1,
    2,
    3,
  ],

  traits: [
    "Kind Hearted but untrusting of others except those she considers family.",
    "Freely give second chances. Don't give third chances.",
    "Her sister, Laent, her wife, Tamwen, and her best friend, Lana. ",
    "Willful ignorance of the fault in family.",
  ],

  features: [
    {
      title: "Ozone's Champion",
      description: "Waals is the Champion of Ozone, giving her extra powers.",
      sourceType: 0, // Feat, Class, etc
      sourceText: "Ozone",
      modifiers: "", // Things like +1 defense.
    },
    {
      title: "Shield Master",
      description: "Extra abilities and features for handling shields. Only when holding a shield.",
      sourceType: 1, // Feat, Class, etc
      sourceText: "Level 1",
      modifiers: "", // Things like +1 defense.
    },
  ],

  featureDisplayOrder: [
    0,
    1,
  ],
};

export const ruleData: any = {
  classes: [
    {_key: "artificer", name: "Artificer"},
    {_key: "barbarian", name: "Barbarian"},
    {_key: "bard", name: "Bard"},
    {_key: "cleric", name: "Cleric"},
    {_key: "druid", name: "Druid"},
    {_key: "fighter", name: "Fighter"},
    {_key: "paladin", name: "Paladin"},
    {_key: "sorcerer", name: "Sorcerer"},
    {_key: "warlock", name: "Warlock"},
    {_key: "wizard", name: "Wizard"},
  ],

  subclasses: [
    {_key: "alchemist", name: "Alchemist", parentClasses: ["artificer"]},
    {_key: "archanist", name: "Arcanist", parentClasses: ["artificer"]},
    {_key: "battlerager", name: "Battlerager", parentClasses: ["barbarian"]},
    {_key: "zealot", name: "Zealot", parentClasses: ["barbarian"]},
    {_key: "collegeOfLore", name: "College of Lore", parentClasses: ["bard", "wizard"]},
    {_key: "collegeOfWhispers", name: "College of Whispers", parentClasses: ["bard", "wizard"]},
    {_key: "champion", name: "Champion", parentClasses: ["fighter"]},
    {_key: "eldritchKnight", name: "Eldritch Knight", parentClasses: ["fighter"]},
    {_key: "bladesinger", name: "Bladesinger", parentClasses: ["wizard"]},
  ],

  races: [
    {_key: "elf", name: "Elf"},
    {_key: "human", name: "Human"},
    {_key: "halfwalker", name: "Halfwalker"},
    {_key: "lemurian", name: "Lemurian"},
  ],

  subraces: [
    {_key: "moon", name: "Moon Elf", parentRaces: ["elf"]},
    {_key: "human", name: "Human Halfwalker", parentRaces: ["halfwalker"]},
  ],

  attributeNames: [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ],
  attributeAbbreviations: [
    "str",
    "dex",
    "con",
    "int",
    "wis",
    "chr",
  ],

  // Display Order goes through and renders the attribute with the index of the
  // current value
  attributeDisplayOrder: [
    0,
    1,
    2,
    3,
    4,
    5,
  ],

  savingThrowDisplayOrder: [
    0,
    1,
    2,
    3,
    4,
    5,
  ],

  skillNames: [
    "Acrobatics",
    "Animal Handling",
    "Arcana",
    "Athletics",
    "Deception",
    "History",
    "Insight",
    "Intimidation",
    "Investigation",
    "Medicine",
    "Nature",
    "Perception",
    "Performance",
    "Pursuasion",
    "Religion",
    "Slight of Hand",
    "Stealth",
    "Survival",
  ],

  skillAttributes: [
    1, // Acrobatics
    4, // Animal Handling
    3, // Arcana
    0, // Athletics
    5, // Deception
    3, // History
    4, // Insight
    5, // Intimidation
    3, // Investigation
    4, // Medicine
    3, // Nature
    4, // Perception
    5, // Performance
    5, // Pursuasion
    3, // Religion
    1, // Slight
    1, // Stealth
    5, // Survival
  ],

  skillDisplayOrder: [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
  ],

  passiveWisdomIndex: 11,

  // Types of proficiencies
  proficiencyTypes: [
    "Weapons",
    "Armor",
    "Tools",
    "Languages",
  ],

  // The order that the proficiency types display in
  proficiencyDisplayOrder: [
    0,
    1,
    2,
    3,
  ],

  // Currencies available in this game
  currencies: [
    "CP",
    "SP",
    "EP",
    "GP",
    "PP",
  ],

  // The order in which the currencies display
  currencyDisplayOrder: [
    0,
    1,
    2,
    3,
    4,
  ],

  characterTraits: [
    "Personality Traits",
    "Ideals",
    "Bonds",
    "Flaws",
  ],
  characterTraitDisplayOrder: [
    0,
    1,
    2,
    3,
  ],
};

export const sheetLayoutData = {
  // Layouts for tabs. Contains array of array of modules to render
  modules: [
    {
      tab: 1,
      type: "row",
      displayOrder: 1,
    },
    {
      tab: 1,
      type: "col",
      xs: 12,
    },
    {
      tab: 1,
      type: "Header",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "row",
    },
    {
      tab: 1,
      type: "col",
      xs: 4,
    },
    {
      tab: 1,
      type: "row",
    },
    {
      tab: 1,
      type: "col",
      xs: 4,
    },
    {
      tab: 1,
      type: "Attributes",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "col",
      xs: 8,
    },
    {
      tab: 1,
      type: "Inspiration",
    },
    {
      tab: 1,
      type: "ProficiencyBonus",
    },
    {
      tab: 1,
      type: "SavingThrows",
    },
    {
      tab: 1,
      type: "Skills",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "PassivePerception",
    },
    {
      tab: 1,
      type: "Proficiencies",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "col",
      xs: 4,
    },
    {
      tab: 1,
      type: "row",
    },
    {
      tab: 1,
      type: "col",
      xs: 4,
    },
    {
      tab: 1,
      type: "ArmorClass",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "col",
      xs: 4,
    },
    {
      tab: 1,
      type: "Initiative",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "col",
      xs: 4,
    },
    {
      tab: 1,
      type: "Speed",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "HitPoints",
    },
    {
      tab: 1,
      type: "TemporaryHitPoints",
    },
    {
      tab: 1,
      type: "row",
    },
    {
      tab: 1,
      type: "col",
      xs: 6,
    },
    {
      tab: 1,
      type: "HitDice",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "col",
      xs: 6,
    },
    {
      tab: 1,
      type: "DeathSaves",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "Actions",
    },
    {
      tab: 1,
      type: "Equipment",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "col",
      xs: 4,
    },
    {
      tab: 1,
      type: "Traits",
    },
    {
      tab: 1,
      type: "Features",
    },
    {
      tab: 1,
      type: "end",
    },
    {
      tab: 1,
      type: "end",
    },
  ],

  tabs: [
    "Info",
    "Character",
    "Spells",
    "Background",
  ],

  tabDisplayOrder: [
    0, 1, 2, 3,
  ],
};
