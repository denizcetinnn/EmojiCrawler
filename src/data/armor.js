// Armor for grid-based tactical combat
// Each armor has: defense, special abilities, positional bonuses

export const ARMOR = [
  // LIGHT ARMOR (No AP penalty, mobility bonuses)
  {
    name: 'Tattered Cloak',
    defense: 1,
    rarity: 'common',
    value: 10,
    apModifier: 0,
    type: 'armor',
    category: 'light',
    description: 'Worn cloth. Better than nothing.',
    emoji: '🧥',
  },
  {
    name: 'Leather Vest',
    defense: 2,
    rarity: 'common',
    value: 25,
    apModifier: 0,
    type: 'armor',
    category: 'light',
    description: 'Flexible protection that won\'t slow you down.',
    emoji: '🦺',
  },
  {
    name: 'Scout\'s Garb',
    defense: 2,
    rarity: 'rare',
    value: 40,
    apModifier: +1,
    type: 'armor',
    category: 'light',
    description: 'Lightweight armor designed for mobility. +1 AP.',
    emoji: '👕',
    specialAbility: 'mobility',
  },
  {
    name: 'Shadow Cloak',
    defense: 3,
    rarity: 'epic',
    value: 100,
    apModifier: 0,
    type: 'armor',
    category: 'light',
    backstabResist: 0.5, // Reduce backstab damage by 50%
    description: 'Enchanted cloak. Reduces damage from behind.',
    emoji: '🧥',
    specialAbility: 'backstab_resist',
  },
  {
    name: 'Windwalker Robes',
    defense: 2,
    rarity: 'epic',
    value: 120,
    apModifier: +1,
    type: 'armor',
    category: 'light',
    dodgeBonus: 0.15, // +15% dodge chance
    description: 'Flow like the wind. +1 AP and increased dodge.',
    emoji: '👘',
    specialAbility: 'dodge_bonus',
  },

  // MEDIUM ARMOR (Balanced)
  {
    name: 'Chain Mail',
    defense: 4,
    rarity: 'common',
    value: 50,
    apModifier: 0,
    type: 'armor',
    category: 'medium',
    description: 'Interlocking rings provide solid protection.',
    emoji: '⛓️',
  },
  {
    name: 'Scale Armor',
    defense: 5,
    rarity: 'rare',
    value: 70,
    apModifier: 0,
    type: 'armor',
    category: 'medium',
    rangedResist: 1, // -1 damage from ranged attacks
    description: 'Overlapping scales deflect arrows.',
    emoji: '🐉',
    specialAbility: 'ranged_resist',
  },
  {
    name: 'Battle Plate',
    defense: 6,
    rarity: 'rare',
    value: 90,
    apModifier: 0,
    type: 'armor',
    category: 'medium',
    description: 'Well-crafted armor for frontline combat.',
    emoji: '🛡️',
  },

  // HEAVY ARMOR (High defense, AP penalty)
  {
    name: 'Iron Plate',
    defense: 7,
    rarity: 'rare',
    value: 100,
    apModifier: -1,
    type: 'armor',
    category: 'heavy',
    description: 'Heavy plating. Strong but cumbersome. -1 AP.',
    emoji: '🛡️',
  },
  {
    name: 'Knight\'s Armor',
    defense: 8,
    rarity: 'epic',
    value: 150,
    apModifier: -1,
    type: 'armor',
    category: 'heavy',
    pushResist: true, // Cannot be pushed
    description: 'Steadfast armor. Cannot be pushed or knocked back.',
    emoji: '⚔️',
    specialAbility: 'immovable',
  },
  {
    name: 'Dragon Scale Plate',
    defense: 9,
    rarity: 'epic',
    value: 200,
    apModifier: 0, // No penalty despite high defense
    type: 'armor',
    category: 'heavy',
    elementResist: ['fire', 'ice'],
    description: 'Legendary dragon scales. Immune to fire and ice.',
    emoji: '🐲',
    specialAbility: 'element_resist',
  },
  {
    name: 'Blessed Aegis',
    defense: 10,
    rarity: 'legendary',
    value: 300,
    apModifier: -1,
    type: 'armor',
    category: 'heavy',
    healPerTurn: 1, // Regenerate 1 HP per turn
    description: 'Divine protection. Slowly regenerates health.',
    emoji: '✨',
    specialAbility: 'regeneration',
  },

  // SPECIAL ARMOR (Unique effects)
  {
    name: 'Thorned Vest',
    defense: 3,
    rarity: 'rare',
    value: 60,
    apModifier: 0,
    type: 'armor',
    category: 'light',
    reflectDamage: 1, // Reflect 1 damage to melee attackers
    description: 'Sharp thorns punish melee attackers.',
    emoji: '🌹',
    specialAbility: 'thorns',
  },
  {
    name: 'Berserker\'s Hide',
    defense: 4,
    rarity: 'rare',
    value: 80,
    apModifier: 0,
    type: 'armor',
    category: 'medium',
    damageBonus: 2, // +2 damage when below 50% HP
    description: 'Empowers the wearer when wounded. +2 damage at low HP.',
    emoji: '🐻',
    specialAbility: 'bloodlust',
  },

  // ADDITIONAL LIGHT ARMOR
  {
    name: 'Assassin\'s Garb',
    defense: 2,
    rarity: 'epic',
    value: 110,
    apModifier: 0,
    type: 'armor',
    category: 'light',
    backstabBonus: 1.5, // +50% backstab damage
    description: 'Silent and deadly. Amplifies backstab damage.',
    emoji: '🥷',
    specialAbility: 'backstab_boost',
  },
  {
    name: 'Acrobat\'s Suit',
    defense: 1,
    rarity: 'rare',
    value: 55,
    apModifier: 0,
    type: 'armor',
    category: 'light',
    pushPullResist: true,
    description: 'Perfect balance. Cannot be pushed or pulled.',
    emoji: '🤸',
    specialAbility: 'balanced',
  },
  {
    name: 'Mage Robes',
    defense: 2,
    rarity: 'rare',
    value: 65,
    apModifier: 0,
    type: 'armor',
    category: 'light',
    magicBonus: 2, // +2 damage with magic weapons
    description: 'Enchanted fabric amplifies magical attacks.',
    emoji: '🧙',
    specialAbility: 'magic_boost',
  },

  // ADDITIONAL MEDIUM ARMOR
  {
    name: 'Ranger\'s Mail',
    defense: 4,
    rarity: 'rare',
    value: 75,
    apModifier: 0,
    type: 'armor',
    category: 'medium',
    rangeBonus: 1, // +1 range on ranged weapons
    description: 'Flexible armor for archers. +1 range with ranged weapons.',
    emoji: '🏹',
    specialAbility: 'range_boost',
  },
  {
    name: 'Plated Leather',
    defense: 5,
    rarity: 'rare',
    value: 80,
    apModifier: 0,
    type: 'armor',
    category: 'medium',
    meleeResist: 1, // -1 damage from melee attacks
    description: 'Reinforced leather plates deflect blades.',
    emoji: '🦺',
    specialAbility: 'melee_resist',
  },
  {
    name: 'Fire-Resistant Coat',
    defense: 4,
    rarity: 'epic',
    value: 95,
    apModifier: 0,
    type: 'armor',
    category: 'medium',
    elementResist: ['fire'],
    description: 'Treated with alchemical fire resistance.',
    emoji: '🔥',
    specialAbility: 'fire_resist',
  },

  // ADDITIONAL HEAVY ARMOR
  {
    name: 'Crusader Plate',
    defense: 8,
    rarity: 'epic',
    value: 170,
    apModifier: -1,
    type: 'armor',
    category: 'heavy',
    holyBonus: 2, // +2 defense vs undead/demon
    description: 'Blessed armor. Extra protection vs undead and demons.',
    emoji: '✝️',
    specialAbility: 'holy_protection',
  },
  {
    name: 'Juggernaut Armor',
    defense: 10,
    rarity: 'legendary',
    value: 350,
    apModifier: -2,
    type: 'armor',
    category: 'heavy',
    damageReduction: 0.25, // Reduce all damage by 25%
    description: 'Impenetrable fortress. Reduces all damage by 25% but very heavy.',
    emoji: '🛡️',
    specialAbility: 'damage_reduction',
  },
  {
    name: 'Spiked Plate',
    defense: 7,
    rarity: 'epic',
    value: 160,
    apModifier: -1,
    type: 'armor',
    category: 'heavy',
    reflectDamage: 3, // Reflect 3 damage to melee attackers
    description: 'Covered in deadly spikes. Heavily punishes melee attackers.',
    emoji: '⚔️',
    specialAbility: 'thorns_heavy',
  },

  // UNIQUE/CURSED ARMOR
  {
    name: 'Cursed Mail',
    defense: 8,
    rarity: 'epic',
    value: 50, // Cheap but cursed
    apModifier: -1,
    type: 'armor',
    category: 'heavy',
    damageBonus: 3, // +3 damage
    description: 'Powerful but cursed. +3 damage but -1 AP and heavy.',
    emoji: '💀',
    specialAbility: 'cursed_power',
  },
  {
    name: 'Living Armor',
    defense: 6,
    rarity: 'legendary',
    value: 280,
    apModifier: 0,
    type: 'armor',
    category: 'medium',
    healPerTurn: 2, // Regenerate 2 HP per turn
    growthBonus: true, // Gets stronger as combat goes on
    description: 'Sentient armor that grows stronger. Regenerates 2 HP/turn.',
    emoji: '🦠',
    specialAbility: 'adaptive',
  },
];

// Get random armor based on rarity
export const getRandomArmor = (rarityWeights = { common: 0.5, rare: 0.35, epic: 0.15 }) => {
  const roll = Math.random();
  let rarity;

  if (roll < rarityWeights.common) {
    rarity = 'common';
  } else if (roll < rarityWeights.common + rarityWeights.rare) {
    rarity = 'rare';
  } else {
    rarity = 'epic';
  }

  const filteredArmor = ARMOR.filter(a => a.rarity === rarity);

  if (filteredArmor.length === 0) {
    return { ...ARMOR[Math.floor(Math.random() * ARMOR.length)], type: 'armor' };
  }

  return {
    ...filteredArmor[Math.floor(Math.random() * filteredArmor.length)],
    type: 'armor',
  };
};

// Get armor by name
export const getArmorByName = name => {
  const armor = ARMOR.find(a => a.name === name);
  return armor ? { ...armor, type: 'armor' } : null;
};

// Get armor by category
export const getArmorByCategory = category => {
  return ARMOR.filter(a => a.category === category).map(a => ({ ...a, type: 'armor' }));
};

// Calculate effective defense (includes armor + potential bonuses)
export const calculateEffectiveDefense = (armor, playerStats = {}, situation = {}) => {
  let defense = armor.defense;

  // Ranged resist bonus
  if (armor.rangedResist && situation.attackType === 'ranged') {
    defense += armor.rangedResist;
  }

  // Backstab resist
  if (armor.backstabResist && situation.isBackstab) {
    return {
      defense,
      backstabReduction: armor.backstabResist,
    };
  }

  return { defense };
};

// Get total AP modifier from armor
export const getArmorAPModifier = armor => {
  return armor?.apModifier || 0;
};

// Check if armor resists specific element
export const resistsElement = (armor, element) => {
  if (!armor || !armor.elementResist) return false;
  return armor.elementResist.includes(element);
};

// Check if armor prevents push/pull
export const preventsPushPull = armor => {
  return armor?.pushResist === true || armor?.specialAbility === 'immovable';
};

// Get shop armor inventory
export const getShopArmor = (count = 2) => {
  const armors = [];
  const categories = ['light', 'medium', 'heavy'];

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const categoryArmor = ARMOR.filter(
      a => a.category === category && a.rarity !== 'legendary'
    );

    if (categoryArmor.length > 0) {
      const armor = categoryArmor[Math.floor(Math.random() * categoryArmor.length)];
      armors.push({ ...armor, type: 'armor' });
    }
  }

  return armors;
};
