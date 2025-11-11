// Weapons for grid-based combat system
// Each weapon has: range, damage, AP cost, attack pattern, and special abilities

export const ATTACK_PATTERNS = {
  SINGLE: 'single', // Single target
  LINE: 'line', // Straight line (piercing)
  CROSS: 'cross', // Cross pattern around target
  AOE: 'aoe', // Area of effect (radius)
  CLEAVE: 'cleave', // Hits target + adjacent
};

// Base fists (starting weapon)
export const FISTS = {
  name: 'Fists',
  damage: 1,
  range: 1,
  apCost: 1,
  pattern: ATTACK_PATTERNS.SINGLE,
  rarity: 'common',
  value: 0,
  type: 'weapon',
  category: 'melee',
  description: 'Your bare hands. Better than nothing.',
  emoji: '👊',
};

export const WEAPONS = [
  // MELEE WEAPONS
  {
    name: 'Rusty Dagger',
    damage: 2,
    range: 1,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'common',
    value: 10,
    category: 'melee',
    description: 'A simple blade. Fast and reliable.',
    emoji: '🗡️',
  },
  {
    name: 'Iron Sword',
    damage: 4,
    range: 1,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'common',
    value: 25,
    category: 'melee',
    description: 'A sturdy weapon for close combat.',
    emoji: '⚔️',
  },
  {
    name: 'War Spear',
    damage: 3,
    range: 2,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 40,
    category: 'melee',
    description: 'Extended reach allows you to strike from safety.',
    emoji: '🔱',
  },
  {
    name: 'Greataxe',
    damage: 14,
    range: 1,
    apCost: 2,
    pattern: ATTACK_PATTERNS.CLEAVE,
    rarity: 'rare',
    value: 60,
    category: 'melee',
    description: 'Massive blade that cleaves through foes. Hits adjacent enemies.',
    emoji: '🪓',
  },
  {
    name: 'Kusarigama',
    damage: 3,
    range: 2,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 50,
    category: 'melee',
    specialAbility: 'pull',
    description: 'Chain weapon that can pull enemies closer after hitting.',
    emoji: '⛓️',
  },
  {
    name: 'Rapier',
    damage: 5,
    range: 1,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 55,
    category: 'melee',
    critBonus: 0.15, // +15% crit chance
    description: 'Precise blade. Increased critical hit chance.',
    emoji: '🤺',
  },

  // RANGED WEAPONS
  {
    name: 'Short Bow',
    damage: 3,
    range: 2,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'common',
    value: 30,
    category: 'ranged',
    description: 'Simple bow for ranged combat.',
    emoji: '🏹',
  },
  {
    name: 'Crossbow',
    damage: 7,
    range: 3,
    apCost: 2,
    pattern: ATTACK_PATTERNS.LINE,
    rarity: 'rare',
    value: 70,
    category: 'ranged',
    description: 'Powerful crossbow with piercing bolts. Hits all enemies in line.',
    emoji: '🎯',
  },
  {
    name: 'Throwing Knives',
    damage: 2,
    range: 2,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'common',
    value: 20,
    category: 'ranged',
    multiHit: 3, // Can attack up to 3 times per turn
    description: 'Quick throwing knives. Can attack multiple times.',
    emoji: '🔪',
  },
  {
    name: 'Longbow',
    damage: 8,
    range: 3,
    apCost: 2,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'epic',
    value: 100,
    category: 'ranged',
    description: 'Precise long-range weapon.',
    emoji: '🏹',
  },

  // MAGIC WEAPONS
  {
    name: 'Fire Staff',
    damage: 7,
    range: 2,
    apCost: 2,
    pattern: ATTACK_PATTERNS.CROSS,
    rarity: 'rare',
    value: 80,
    category: 'magic',
    element: 'fire',
    description: 'Unleashes flames in a cross pattern around target.',
    emoji: '🔥',
  },
  {
    name: 'Ice Wand',
    damage: 6,
    range: 2,
    apCost: 2,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 70,
    category: 'magic',
    element: 'ice',
    specialAbility: 'slow',
    description: 'Freezes enemies, reducing their AP by 1 for one turn.',
    emoji: '❄️',
  },
  {
    name: 'Lightning Rod',
    damage: 9,
    range: 3,
    apCost: 2,
    pattern: ATTACK_PATTERNS.LINE,
    rarity: 'epic',
    value: 120,
    category: 'magic',
    element: 'lightning',
    description: 'Chain lightning strikes all enemies in a line.',
    emoji: '⚡',
  },
  {
    name: 'Meteor Staff',
    damage: 15,
    range: 2,
    apCost: 3,
    pattern: ATTACK_PATTERNS.AOE,
    aoeRadius: 1,
    rarity: 'epic',
    value: 150,
    category: 'magic',
    element: 'fire',
    description: 'Summons a meteor. Hits target and all adjacent tiles.',
    emoji: '☄️',
  },

  // UTILITY/HYBRID WEAPONS
  {
    name: 'Whip',
    damage: 2,
    range: 2,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 45,
    category: 'melee',
    specialAbility: 'pull',
    description: 'Lash out and pull enemies toward you.',
    emoji: '🪢',
  },
  {
    name: 'War Hammer',
    damage: 12,
    range: 1,
    apCost: 2,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 65,
    category: 'melee',
    specialAbility: 'push',
    description: 'Crushes foes and knocks them back.',
    emoji: '🔨',
  },

  // ADDITIONAL MELEE WEAPONS
  {
    name: 'Scythe',
    damage: 6,
    range: 1,
    apCost: 1,
    pattern: ATTACK_PATTERNS.CLEAVE,
    rarity: 'rare',
    value: 55,
    category: 'melee',
    description: 'Reaps multiple enemies at once.',
    emoji: '🪓',
  },
  {
    name: 'Dual Blades',
    damage: 3,
    range: 1,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 50,
    category: 'melee',
    multiHit: 2, // Attacks twice
    description: 'Twin blades strike with lightning speed. Attacks twice.',
    emoji: '⚔️',
  },
  {
    name: 'Flail',
    damage: 10,
    range: 1,
    apCost: 2,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 60,
    category: 'melee',
    specialAbility: 'armor_break',
    description: 'Heavy chain weapon. Ignores 2 points of armor.',
    emoji: '⛓️',
  },
  {
    name: 'Katana',
    damage: 6,
    range: 1,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'epic',
    value: 90,
    category: 'melee',
    critBonus: 0.2,
    critMultiplier: 2.5, // Better crits than normal
    description: 'Masterwork blade. High crit chance and damage.',
    emoji: '🗡️',
  },

  // ADDITIONAL RANGED WEAPONS
  {
    name: 'Sling',
    damage: 2,
    range: 2,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'common',
    value: 15,
    category: 'ranged',
    description: 'Simple ranged weapon. Cheap and effective.',
    emoji: '🪨',
  },
  {
    name: 'Boomerang',
    damage: 3,
    range: 2,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 45,
    category: 'ranged',
    specialAbility: 'return', // Can attack twice: going and coming back
    multiHit: 2,
    description: 'Returns to sender. Hits target twice.',
    emoji: '🪃',
  },
  {
    name: 'Blunderbuss',
    damage: 11,
    range: 1,
    apCost: 2,
    pattern: ATTACK_PATTERNS.CLEAVE,
    rarity: 'epic',
    value: 110,
    category: 'ranged',
    description: 'Devastating at close range. Hits multiple enemies.',
    emoji: '💥',
  },
  {
    name: 'Net Thrower',
    damage: 1,
    range: 2,
    apCost: 1,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 40,
    category: 'ranged',
    specialAbility: 'slow',
    description: 'Ensnares enemies, reducing their AP by 1.',
    emoji: '🕸️',
  },

  // ADDITIONAL MAGIC WEAPONS
  {
    name: 'Poison Orb',
    damage: 5,
    range: 2,
    apCost: 2,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 65,
    category: 'magic',
    element: 'poison',
    specialAbility: 'poison',
    poisonDamage: 2,
    poisonDuration: 3,
    description: 'Toxic orb that poisons enemies over time.',
    emoji: '☠️',
  },
  {
    name: 'Arcane Tome',
    damage: 13,
    range: 3,
    apCost: 3,
    pattern: ATTACK_PATTERNS.AOE,
    aoeRadius: 2,
    rarity: 'epic',
    value: 140,
    category: 'magic',
    element: 'arcane',
    description: 'Ancient spellbook. Massive area of effect.',
    emoji: '📖',
  },
  {
    name: 'Void Staff',
    damage: 11,
    range: 2,
    apCost: 2,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'epic',
    value: 130,
    category: 'magic',
    element: 'void',
    specialAbility: 'armor_ignore',
    description: 'Dark magic pierces all defenses. Ignores armor.',
    emoji: '🌑',
  },
  {
    name: 'Healing Staff',
    damage: 4,
    range: 2,
    apCost: 2,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'rare',
    value: 70,
    category: 'magic',
    element: 'holy',
    specialAbility: 'heal_on_kill',
    healAmount: 3,
    description: 'Holy weapon that heals you when you defeat enemies.',
    emoji: '✨',
  },
];

// Legendary weapons (dropped by bosses)
export const LEGENDARY_WEAPONS = [
  {
    name: 'Shadow Blade',
    damage: 13,
    range: 1,
    apCost: 2,
    pattern: ATTACK_PATTERNS.SINGLE,
    rarity: 'legendary',
    value: 500,
    category: 'melee',
    specialAbility: 'backstab_master',
    backstabMultiplier: 3, // 3x damage from behind
    description: 'Forged in darkness. Devastating when striking from behind.',
    emoji: '🗡️',
    bossSource: 'Corrupted Knight',
  },
  {
    name: 'Plague Bow',
    damage: 8,
    range: 3,
    apCost: 2,
    pattern: ATTACK_PATTERNS.AOE,
    aoeRadius: 1,
    rarity: 'legendary',
    value: 500,
    category: 'ranged',
    specialAbility: 'poison',
    poisonDamage: 2,
    poisonDuration: 3,
    description: 'Arrows spread disease. Poisons all enemies in area.',
    emoji: '🏹',
    bossSource: 'Plague Doctor',
  },
  {
    name: 'Meteor Hammer',
    damage: 17,
    range: 2,
    apCost: 3,
    pattern: ATTACK_PATTERNS.AOE,
    aoeRadius: 1,
    rarity: 'legendary',
    value: 500,
    category: 'melee',
    specialAbility: 'earthquake',
    pushDistance: 2,
    description: 'Devastating impact sends enemies flying backwards.',
    emoji: '🔨',
    bossSource: 'Infernal Warden',
  },
];

// Get random weapon based on rarity
export const getRandomWeapon = (rarityWeights = { common: 0.5, rare: 0.35, epic: 0.15 }) => {
  const roll = Math.random();
  let rarity;
  let threshold = 0;

  // Check for legendary first if specified
  if (rarityWeights.legendary) {
    threshold += rarityWeights.legendary;
    if (roll < threshold) {
      rarity = 'legendary';
    }
  }

  // Then check other rarities
  if (!rarity) {
    if (rarityWeights.common) {
      threshold += rarityWeights.common;
      if (roll < threshold) {
        rarity = 'common';
      }
    }
  }

  if (!rarity) {
    if (rarityWeights.rare) {
      threshold += rarityWeights.rare;
      if (roll < threshold) {
        rarity = 'rare';
      }
    }
  }

  if (!rarity) {
    if (rarityWeights.epic) {
      threshold += rarityWeights.epic;
      if (roll < threshold) {
        rarity = 'epic';
      }
    }
  }

  // Default to epic if no rarity was selected
  if (!rarity) {
    rarity = 'epic';
  }

  // Use appropriate weapon pool
  const weaponPool = rarity === 'legendary' ? LEGENDARY_WEAPONS : WEAPONS;
  const filteredWeapons = weaponPool.filter(w => w.rarity === rarity);

  if (filteredWeapons.length === 0) {
    // Fallback: try legendary weapons if filtering failed
    if (rarity === 'legendary' && LEGENDARY_WEAPONS.length > 0) {
      return { ...LEGENDARY_WEAPONS[Math.floor(Math.random() * LEGENDARY_WEAPONS.length)], type: 'weapon' };
    }
    // Fallback to any weapon
    return { ...WEAPONS[Math.floor(Math.random() * WEAPONS.length)], type: 'weapon' };
  }

  return {
    ...filteredWeapons[Math.floor(Math.random() * filteredWeapons.length)],
    type: 'weapon',
  };
};

// Get weapon by name
export const getWeaponByName = name => {
  const allWeapons = [...WEAPONS, ...LEGENDARY_WEAPONS];
  const weapon = allWeapons.find(w => w.name === name);
  return weapon ? { ...weapon, type: 'weapon' } : null;
};

// Get weapons by category
export const getWeaponsByCategory = category => {
  return WEAPONS.filter(w => w.category === category).map(w => ({ ...w, type: 'weapon' }));
};

// Get shop inventory (mix of categories)
export const getShopWeapons = (count = 3) => {
  const weapons = [];
  const categories = ['melee', 'ranged', 'magic'];

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const categoryWeapons = WEAPONS.filter(w => w.category === category);

    if (categoryWeapons.length > 0) {
      const weapon = categoryWeapons[Math.floor(Math.random() * categoryWeapons.length)];
      weapons.push({ ...weapon, type: 'weapon' });
    }
  }

  return weapons;
};

// Calculate actual damage based on weapon and player stats
export const calculateWeaponDamage = (weapon, playerStats, isBackstab = false, isCrit = false) => {
  let damage = weapon.damage + (playerStats.str || 0);

  // Apply backstab multiplier
  if (isBackstab && weapon.backstabMultiplier) {
    damage *= weapon.backstabMultiplier;
  }

  // Apply crit multiplier
  if (isCrit) {
    damage *= 2;

    // Bonus crit damage if weapon has crit bonus
    if (weapon.critBonus) {
      damage += weapon.damage * weapon.critBonus;
    }
  }

  return Math.floor(damage);
};

// Get weapon range (with potential bonuses)
export const getWeaponRange = (weapon, bonuses = 0) => {
  return weapon.range + bonuses;
};

// Check if weapon can hit target based on pattern
export const canWeaponHit = (weapon, attackerPos, targetPos, gridSize) => {
  const distance = Math.abs(attackerPos.x - targetPos.x) + Math.abs(attackerPos.y - targetPos.y);

  if (distance > weapon.range) return false;

  // Line pattern requires straight line
  if (weapon.pattern === ATTACK_PATTERNS.LINE) {
    return (
      attackerPos.x === targetPos.x || attackerPos.y === targetPos.y
    );
  }

  return true;
};
