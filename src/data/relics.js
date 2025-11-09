// Relics for grid-based tactical combat
// Each relic provides unique passive bonuses or abilities

export const RELICS = [
  // STAT BONUSES (Keep these)
  {
    name: 'Warrior Ring',
    effect: '+2 STR',
    type: 'stat',
    stat: 'str',
    statValue: 2,
    value: 40,
    rarity: 'rare',
    emoji: '💍',
    description: 'Increases strength, boosting attack damage.',
  },
  {
    name: 'Nimble Boots',
    effect: '+2 DEX, +1 AP',
    type: 'stat_and_ap',
    stat: 'dex',
    statValue: 2,
    apBonus: 1,
    value: 60,
    rarity: 'epic',
    emoji: '👢',
    description: 'Swift boots grant dexterity and extra action point.',
  },
  {
    name: 'Scholar Glasses',
    effect: '+2 INT',
    type: 'stat',
    stat: 'int',
    statValue: 2,
    value: 40,
    rarity: 'rare',
    emoji: '👓',
    description: 'Sharpens the mind, revealing enemy weaknesses.',
  },
  {
    name: 'Silver Tongue Amulet',
    effect: '+2 CHA',
    type: 'stat',
    stat: 'cha',
    statValue: 2,
    value: 40,
    rarity: 'rare',
    emoji: '📿',
    description: 'Charm your way to better shop prices.',
  },

  // ECONOMY
  {
    name: 'Lucky Coin',
    effect: 'Gold drops increased by 50%',
    type: 'gold',
    goldMultiplier: 1.5,
    value: 30,
    rarity: 'rare',
    emoji: '🪙',
    description: 'Fortune favors the bold. More gold from enemies.',
  },

  // COMBAT - POSITIONING
  {
    name: 'Assassin\'s Mark',
    effect: 'Backstabs deal double damage',
    type: 'backstab',
    backstabMultiplier: 2,
    value: 80,
    rarity: 'epic',
    emoji: '🎯',
    description: 'Strike from the shadows for devastating damage.',
  },
  {
    name: 'Hawk\'s Eye',
    effect: '+1 range on all weapons',
    type: 'range',
    rangeBonus: 1,
    value: 70,
    rarity: 'epic',
    emoji: '🦅',
    description: 'Enhanced vision extends your attack range.',
  },
  {
    name: 'Anchor Boots',
    effect: 'Cannot be pushed or pulled',
    type: 'immovable',
    value: 50,
    rarity: 'rare',
    emoji: '⚓',
    description: 'Stand your ground. Immune to forced movement.',
  },
  {
    name: 'Phase Cloak',
    effect: 'Move through enemies',
    type: 'phasing',
    value: 90,
    rarity: 'epic',
    emoji: '👻',
    description: 'Walk through enemies as if they weren\'t there.',
  },
  {
    name: 'Blink Dagger',
    effect: 'Once per combat: teleport up to 3 tiles',
    type: 'teleport',
    teleportRange: 3,
    usesPerCombat: 1,
    value: 100,
    rarity: 'epic',
    emoji: '✨',
    description: 'Instantly relocate to a better position.',
  },

  // COMBAT - SUSTAIN
  {
    name: 'Vampire Fang',
    effect: 'Heal 2 HP per kill',
    type: 'lifesteal',
    healPerKill: 2,
    value: 70,
    rarity: 'epic',
    emoji: '🦷',
    description: 'Drain life essence from defeated foes.',
  },
  {
    name: 'Troll Blood Vial',
    effect: 'Regenerate 1 HP at start of each turn',
    type: 'regeneration',
    healPerTurn: 1,
    value: 60,
    rarity: 'rare',
    emoji: '🧪',
    description: 'Slowly recover health during combat.',
  },
  {
    name: 'Second Wind Charm',
    effect: 'Once per combat: restore full AP when below 30% HP',
    type: 'second_wind',
    hpThreshold: 0.3,
    usesPerCombat: 1,
    value: 80,
    rarity: 'epic',
    emoji: '💨',
    description: 'Desperate times call for desperate measures.',
  },

  // COMBAT - OFFENSIVE
  {
    name: 'Berserker\'s Rage',
    effect: '+3 damage when below 50% HP',
    type: 'bloodlust',
    damageBonus: 3,
    hpThreshold: 0.5,
    value: 70,
    rarity: 'epic',
    emoji: '😡',
    description: 'Pain fuels your fury.',
  },
  {
    name: 'Thorns Amulet',
    effect: 'Reflect 2 damage to melee attackers',
    type: 'thorns',
    reflectDamage: 2,
    value: 60,
    rarity: 'rare',
    emoji: '🌹',
    description: 'Punish those who strike you.',
  },
  {
    name: 'Critical Ring',
    effect: '+15% critical hit chance',
    type: 'crit',
    critBonus: 0.15,
    value: 75,
    rarity: 'epic',
    emoji: '💥',
    description: 'Strike with deadly precision.',
  },
  {
    name: 'Cleaving Pendant',
    effect: 'Melee attacks hit adjacent enemies',
    type: 'cleave',
    value: 85,
    rarity: 'epic',
    emoji: '💫',
    description: 'Your strikes sweep through multiple foes.',
  },

  // COMBAT - DEFENSIVE
  {
    name: 'Guardian Amulet',
    effect: '+2 defense',
    type: 'defense',
    defenseBonus: 2,
    value: 50,
    rarity: 'rare',
    emoji: '🛡️',
    description: 'Magical protection shields you from harm.',
  },
  {
    name: 'Evasion Charm',
    effect: '+20% dodge chance',
    type: 'dodge',
    dodgeBonus: 0.2,
    value: 70,
    rarity: 'epic',
    emoji: '💨',
    description: 'Slip past attacks with supernatural agility.',
  },
  {
    name: 'Mirror Shield',
    effect: 'First attack each combat is automatically dodged',
    type: 'first_strike_immunity',
    usesPerCombat: 1,
    value: 90,
    rarity: 'epic',
    emoji: '🪞',
    description: 'Perfect foresight lets you avoid the first blow.',
  },

  // UTILITY
  {
    name: 'Energy Crystal',
    effect: '+1 Max AP',
    type: 'maxap',
    apBonus: 1,
    value: 100,
    rarity: 'epic',
    emoji: '💎',
    description: 'Pure crystallized energy. Extra action each turn.',
  },
  {
    name: 'Tactical Manual',
    effect: 'See enemy AI patterns',
    type: 'insight',
    value: 40,
    rarity: 'rare',
    emoji: '📖',
    description: 'Know your enemy. Reveals their intended actions.',
  },
  {
    name: 'Coward\'s Charm',
    effect: '+1 AP when fleeing from adjacent enemy',
    type: 'retreat',
    apBonus: 1,
    value: 45,
    rarity: 'rare',
    emoji: '🏃',
    description: 'Run faster when danger is near.',
  },

  // ADDITIONAL OFFENSIVE RELICS
  {
    name: 'Executioner\'s Hood',
    effect: '+50% damage to enemies below 30% HP',
    type: 'execute',
    damageBonus: 0.5,
    hpThreshold: 0.3,
    value: 75,
    rarity: 'epic',
    emoji: '🪓',
    description: 'Finish them! Massive damage to wounded enemies.',
  },
  {
    name: 'Chain Lightning Pearl',
    effect: 'Attacks have 20% chance to chain to another enemy',
    type: 'chain',
    chainChance: 0.2,
    value: 90,
    rarity: 'epic',
    emoji: '⚡',
    description: 'Lightning arcs between foes.',
  },
  {
    name: 'Giant\'s Strength',
    effect: '+3 STR, weapon range -1',
    type: 'stat_penalty',
    stat: 'str',
    statValue: 3,
    rangeReduction: 1,
    value: 60,
    rarity: 'rare',
    emoji: '💪',
    description: 'Overwhelming power at the cost of reach.',
  },
  {
    name: 'Poison Fang Necklace',
    effect: 'All attacks poison enemies (1 damage/turn for 2 turns)',
    type: 'poison_all',
    poisonDamage: 1,
    poisonDuration: 2,
    value: 85,
    rarity: 'epic',
    emoji: '🐍',
    description: 'Venom coats every strike.',
  },
  {
    name: 'Berserker Totem',
    effect: '+1 damage per missing HP (max +10)',
    type: 'rage',
    damagePerMissingHP: 1,
    maxBonus: 10,
    value: 95,
    rarity: 'epic',
    emoji: '🗿',
    description: 'Pain transforms into raw power.',
  },

  // ADDITIONAL DEFENSIVE RELICS
  {
    name: 'Iron Will',
    effect: 'Survive one fatal blow per combat at 1 HP',
    type: 'last_stand',
    usesPerCombat: 1,
    value: 100,
    rarity: 'epic',
    emoji: '🛡️',
    description: 'Refuse to die. Once per fight, survive with 1 HP.',
  },
  {
    name: 'Smoke Bomb',
    effect: 'When hit, 30% chance to teleport 2 tiles away',
    type: 'evasive_teleport',
    dodgeChance: 0.3,
    teleportRange: 2,
    value: 80,
    rarity: 'epic',
    emoji: '💨',
    description: 'Vanish when struck.',
  },
  {
    name: 'Frozen Heart',
    effect: 'Immune to poison and burn',
    type: 'status_immunity',
    immunities: ['poison', 'burn'],
    value: 70,
    rarity: 'rare',
    emoji: '❄️',
    description: 'Cold and unyielding.',
  },
  {
    name: 'Counterattack Ring',
    effect: '25% chance to immediately counter when hit',
    type: 'counter',
    counterChance: 0.25,
    value: 85,
    rarity: 'epic',
    emoji: '⚔️',
    description: 'Strike back when enemies attack.',
  },

  // ADDITIONAL UTILITY/POSITIONING RELICS
  {
    name: 'Grappling Hook',
    effect: 'Pull enemies 2 tiles closer after hitting (ranged only)',
    type: 'pull_ranged',
    pullDistance: 2,
    value: 65,
    rarity: 'rare',
    emoji: '🪝',
    description: 'Reel them in with ranged attacks.',
  },
  {
    name: 'Knockback Boots',
    effect: 'Push enemies 1 tile away when you move adjacent',
    type: 'knockback_move',
    pushDistance: 1,
    value: 55,
    rarity: 'rare',
    emoji: '👢',
    description: 'Shove enemies aside as you move.',
  },
  {
    name: 'Shadow Step',
    effect: 'Teleport to enemy after killing them',
    type: 'kill_teleport',
    value: 90,
    rarity: 'epic',
    emoji: '👤',
    description: 'Become the shadows. Teleport to killed enemies.',
  },
  {
    name: 'Battle Standard',
    effect: '+1 damage for each enemy within 2 tiles',
    type: 'surrounded_bonus',
    damagePerEnemy: 1,
    range: 2,
    value: 70,
    rarity: 'rare',
    emoji: '🚩',
    description: 'Fight harder when surrounded.',
  },

  // RISKY/HIGH-REWARD RELICS
  {
    name: 'Glass Cannon Amulet',
    effect: '+5 damage, -3 max HP',
    type: 'glass_cannon',
    damageBonus: 5,
    hpReduction: 3,
    value: 80,
    rarity: 'epic',
    emoji: '💎',
    description: 'Devastating power at the cost of durability.',
  },
  {
    name: 'Gambler\'s Dice',
    effect: 'Attacks deal random damage (50% to 150%)',
    type: 'random_damage',
    minMultiplier: 0.5,
    maxMultiplier: 1.5,
    value: 60,
    rarity: 'rare',
    emoji: '🎲',
    description: 'Risk it all. Damage varies wildly.',
  },
  {
    name: 'Death Pact',
    effect: '+2 AP, lose 1 HP at start of each turn',
    type: 'life_drain_ap',
    apBonus: 2,
    hpCostPerTurn: 1,
    value: 90,
    rarity: 'epic',
    emoji: '☠️',
    description: 'Power at a terrible price.',
  },
  {
    name: 'Revenge Token',
    effect: '+3 damage for 2 turns after taking damage',
    type: 'revenge',
    damageBonus: 3,
    duration: 2,
    value: 75,
    rarity: 'epic',
    emoji: '😠',
    description: 'Anger fuels your retaliation.',
  },

  // ECONOMIC/XP RELICS
  {
    name: 'Scholar\'s Journal',
    effect: '+50% XP from combat',
    type: 'xp',
    xpMultiplier: 1.5,
    value: 50,
    rarity: 'rare',
    emoji: '📚',
    description: 'Learn from every battle.',
  },
  {
    name: 'Treasure Map',
    effect: 'Reveal all locked rooms on map',
    type: 'map_reveal',
    value: 40,
    rarity: 'rare',
    emoji: '🗺️',
    description: 'Know where the riches lie.',
  },
  {
    name: 'Key Ring',
    effect: 'Start each floor with +1 key',
    type: 'starting_key',
    keyBonus: 1,
    value: 45,
    rarity: 'rare',
    emoji: '🔑',
    description: 'Never run out of keys.',
  },
];

// Get random relic
export const getRandomRelic = (rarityWeights = { rare: 0.6, epic: 0.4 }) => {
  const roll = Math.random();
  let rarity;

  if (roll < rarityWeights.rare) {
    rarity = 'rare';
  } else {
    rarity = 'epic';
  }

  const filteredRelics = RELICS.filter(r => r.rarity === rarity);

  if (filteredRelics.length === 0) {
    return { ...RELICS[Math.floor(Math.random() * RELICS.length)] };
  }

  return {
    ...filteredRelics[Math.floor(Math.random() * filteredRelics.length)],
  };
};

// Get relic by name
export const getRelicByName = name => {
  return RELICS.find(r => r.name === name);
};

// Get relics by type
export const getRelicsByType = type => {
  return RELICS.filter(r => r.type === type);
};

// Calculate total stat bonuses from relics
export const calculateRelicStatBonuses = relics => {
  const bonuses = { str: 0, dex: 0, int: 0, cha: 0 };

  relics.forEach(relic => {
    if (relic.type === 'stat' || relic.type === 'stat_and_ap') {
      bonuses[relic.stat] = (bonuses[relic.stat] || 0) + relic.statValue;
    }
  });

  return bonuses;
};

// Calculate total AP bonus from relics
export const calculateRelicAPBonus = relics => {
  let apBonus = 0;

  relics.forEach(relic => {
    if (relic.type === 'stat_and_ap' || relic.type === 'maxap') {
      apBonus += relic.apBonus || 0;
    }
  });

  return apBonus;
};

// Check if player has specific relic
export const hasRelic = (relics, relicName) => {
  return relics.some(r => r.name === relicName);
};

// Check if player has relic of specific type
export const hasRelicOfType = (relics, type) => {
  return relics.some(r => r.type === type);
};

// Get relic ability value
export const getRelicValue = (relics, type, property) => {
  const relic = relics.find(r => r.type === type);
  return relic ? relic[property] : 0;
};

// Calculate damage with relic modifiers
export const applyRelicDamageModifiers = (baseDamage, relics, situation = {}) => {
  let damage = baseDamage;

  // Backstab multiplier
  if (situation.isBackstab) {
    const backstabRelic = relics.find(r => r.type === 'backstab');
    if (backstabRelic) {
      damage *= backstabRelic.backstabMultiplier;
    }
  }

  // Berserker rage (low HP bonus)
  if (situation.playerHpPercent && situation.playerHpPercent < 0.5) {
    const berserkerRelic = relics.find(r => r.type === 'bloodlust');
    if (berserkerRelic) {
      damage += berserkerRelic.damageBonus;
    }
  }

  // Crit bonus
  if (situation.isCrit) {
    const critRelic = relics.find(r => r.type === 'crit');
    if (critRelic) {
      // Crit bonus already applied in base crit calc
      // This relic just increases crit chance
    }
  }

  return Math.floor(damage);
};

// Get shop relic inventory
export const getShopRelics = (count = 1) => {
  const relics = [];

  for (let i = 0; i < count; i++) {
    relics.push(getRandomRelic());
  }

  return relics;
};
