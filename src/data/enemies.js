// Enemies for grid-based tactical combat
// Each enemy has: AI personality, weapon, abilities, and combat behavior

import { AI_PERSONALITIES } from '../game/combatAI.js';

export const ENEMIES = [
  // EARLY GAME ENEMIES
  {
    name: 'Angry Spider',
    type: 'arthropod',
    hp: 6,
    maxHp: 6,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.HIT_AND_RUN,
    weapon: {
      name: 'Venomous Bite',
      damage: 2,
      range: 1,
      apCost: 1,
    },
    xpReward: 5,
    goldReward: 8,
    emoji: '🕷️',
    attackEmoji: '🕸️', // Spider web attack
    description: 'Quick and evasive. Prefers corners and hit-and-run tactics.',
    abilities: [],
    spawnType: 'spider', // For special positioning
  },
  {
    name: 'Giant Rat',
    type: 'beast',
    hp: 8,
    maxHp: 8,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.SWARM,
    weapon: {
      name: 'Gnaw',
      damage: 2,
      range: 1,
      apCost: 1,
    },
    xpReward: 6,
    goldReward: 12,
    emoji: '🐀',
    attackEmoji: '🦷', // Teeth/bite
    description: 'Often travels in packs. Tries to surround prey.',
    abilities: [],
    spawnType: 'swarm',
    packSize: 2, // Can spawn multiple
  },
  {
    name: 'Wild Wolf',
    type: 'beast',
    hp: 10,
    maxHp: 10,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Savage Bite',
      damage: 3,
      range: 1,
      apCost: 1,
    },
    xpReward: 10,
    goldReward: 20,
    emoji: '🐺',
    attackEmoji: '🦷', // Fangs/bite
    description: 'Relentless hunter. Charges without hesitation.',
    abilities: [],
    spawnType: 'aggressive',
  },

  // MID GAME ENEMIES
  {
    name: 'Skeleton Warrior',
    type: 'undead',
    hp: 14,
    maxHp: 14,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Rusty Blade',
      damage: 3,
      range: 1,
      apCost: 1,
    },
    xpReward: 15,
    goldReward: 20,
    emoji: '💀',
    attackEmoji: '⚔️', // Sword slash
    description: 'Guards corners defensively. Can push enemies back.',
    abilities: ['push'],
    defense: 2,
    spawnType: 'defensive',
  },
  {
    name: 'Goblin Assassin',
    type: 'humanoid',
    hp: 12,
    maxHp: 12,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.AMBUSHER,
    weapon: {
      name: 'Poisoned Dagger',
      damage: 2,
      range: 1,
      apCost: 1,
    },
    xpReward: 18,
    goldReward: 30,
    emoji: '👺',
    attackEmoji: '🗡️', // Dagger stab
    description: 'Sneaky and cunning. Circles around to stab from behind.',
    abilities: ['steal'],
    spawnType: 'ambusher',
  },
  {
    name: 'Orc Brute',
    type: 'humanoid',
    hp: 18,
    maxHp: 18,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Heavy Club',
      damage: 4,
      range: 1,
      apCost: 1,
    },
    xpReward: 20,
    goldReward: 30,
    emoji: '👹',
    attackEmoji: '🔨', // Club smash
    description: 'Massive and strong. Smashes anything in its path.',
    abilities: [],
    defense: 1,
    spawnType: 'aggressive',
  },
  {
    name: 'Skeleton Archer',
    type: 'undead',
    hp: 10,
    maxHp: 10,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Bone Bow',
      damage: 3,
      range: 4,
      apCost: 1,
    },
    xpReward: 16,
    goldReward: 32,
    emoji: '💀',
    attackEmoji: '🏹', // Arrow
    description: 'Keeps distance with ranged attacks. Retreats when approached.',
    abilities: [],
    spawnType: 'defensive',
  },

  // LATE GAME ENEMIES
  {
    name: 'Dark Mage',
    type: 'humanoid',
    hp: 15,
    maxHp: 15,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Dark Bolt',
      damage: 4,
      range: 3,
      apCost: 2,
    attackEmoji: '✨', // Dark magic
    },
    xpReward: 25,
    goldReward: 40,
    emoji: '🧙',
    description: 'Casts spells from afar. Teleports when cornered.',
    abilities: ['teleport'],
    spawnType: 'defensive',
  },
  {
    name: 'Berserker',
    type: 'humanoid',
    hp: 22,
    maxHp: 22,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Twin Axes',
      damage: 5,
      range: 1,
      apCost: 1,
    },
    xpReward: 30,
    goldReward: 35,
    emoji: '⚔️',
    description: 'Frenzied warrior with incredible speed and power.',
    abilities: [],
    defense: 1,
    spawnType: 'aggressive',
  },
  {
    name: 'Shadow Stalker',
    type: 'demon',
    hp: 16,
    maxHp: 16,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.AMBUSHER,
    weapon: {
      name: 'Shadow Blade',
      damage: 3,
      range: 1,
      apCost: 1,
    },
    xpReward: 28,
    goldReward: 36,
    emoji: '👤',
    description: 'Master of stealth. Deals massive damage from behind.',
    abilities: ['backstab'],
    backstabMultiplier: 2,
    spawnType: 'ambusher',
  },
  {
    name: 'Toxic Slime',
    type: 'monster',
    hp: 20,
    maxHp: 20,
    ap: 1,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Acid Spray',
      damage: 2,
      range: 2,
      apCost: 1,
    },
    xpReward: 15,
    goldReward: 16,
    emoji: '🟢',
    description: 'Slow but durable. Leaves acid puddles.',
    abilities: ['poison'],
    defense: 2,
    spawnType: 'aggressive',
  },

  // ADDITIONAL VARIETY
  {
    name: 'Cave Bat',
    type: 'beast',
    hp: 5,
    maxHp: 5,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.HIT_AND_RUN,
    weapon: {
      name: 'Swooping Bite',
      damage: 1,
      range: 1,
      apCost: 1,
    },
    xpReward: 4,
    goldReward: 8,
    emoji: '🦇',
    description: 'Fast and evasive. Swoops in to bite then retreats.',
    abilities: [],
    spawnType: 'swarm',
    packSize: 3, // Often spawns in groups of 3
  },
  {
    name: 'Corrupted Knight',
    type: 'undead',
    hp: 25,
    maxHp: 25,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Cursed Sword',
      damage: 5,
      range: 1,
      apCost: 2,
    },
    xpReward: 22,
    goldReward: 36,
    emoji: '⚔️',
    description: 'Heavily armored warrior. Holds defensive positions.',
    abilities: [],
    defense: 3,
    spawnType: 'defensive',
  },
  {
    name: 'Fire Imp',
    type: 'demon',
    hp: 12,
    maxHp: 12,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.HIT_AND_RUN,
    weapon: {
      name: 'Flame Bolt',
      damage: 4,
      range: 3,
      apCost: 2,
    },
    xpReward: 14,
    goldReward: 21,
    emoji: '🔥',
    description: 'Mischievous demon. Throws fireballs then dashes away.',
    abilities: ['burn'],
    spawnType: 'hit_and_run',
  },
  {
    name: 'Venom Spider',
    type: 'arthropod',
    hp: 8,
    maxHp: 8,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.AMBUSHER,
    weapon: {
      name: 'Poison Fangs',
      damage: 2,
      range: 1,
      apCost: 1,
    },
    xpReward: 8,
    goldReward: 16,
    emoji: '🕸️',
    description: 'Lurks in shadows. Attacks from behind with deadly venom.',
    abilities: ['poison'],
    spawnType: 'ambusher',
  },
  {
    name: 'Ice Golem',
    type: 'construct',
    hp: 30,
    maxHp: 30,
    ap: 1,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Frozen Fist',
      damage: 4,
      range: 1,
      apCost: 1,
    },
    xpReward: 20,
    goldReward: 25,
    emoji: '❄️',
    description: 'Slow but unstoppable. Freezes enemies on contact.',
    abilities: ['slow'],
    defense: 3,
    spawnType: 'aggressive',
  },
  {
    name: 'Necromancer',
    type: 'humanoid',
    hp: 12,
    maxHp: 12,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Death Bolt',
      damage: 3,
      range: 4,
      apCost: 2,
    },
    xpReward: 24,
    goldReward: 22,
    emoji: '☠️',
    description: 'Dark mage who raises the dead. Stays far from combat.',
    abilities: ['summon'],
    spawnType: 'defensive',
  },
];

// Get random enemy based on difficulty tier
export const getRandomEnemy = (tier = 'early') => {
  let enemies;

  switch (tier) {
    case 'early':
      // Early game: Spider, Rat, Wolf, Cave Bat, Venom Spider
      enemies = ENEMIES.slice(0, 3).concat(ENEMIES[11], ENEMIES[14]);
      break;
    case 'mid':
      // Mid game: Skeleton Warrior, Goblin, Orc, Skeleton Archer, Corrupted Knight, Fire Imp
      enemies = ENEMIES.slice(3, 7).concat(ENEMIES[12], ENEMIES[13]);
      break;
    case 'late':
      // Late game: Dark Mage, Berserker, Shadow Stalker, Slime, Ice Golem, Necromancer
      enemies = ENEMIES.slice(7, 11).concat(ENEMIES[15], ENEMIES[16]);
      break;
    default:
      enemies = ENEMIES;
  }

  const enemy = enemies[Math.floor(Math.random() * enemies.length)];
  return createEnemyInstance(enemy);
};

// Get spider enemy (for tutorial/first encounter)
export const getSpiderEnemy = () => {
  return createEnemyInstance(ENEMIES[0]);
};

// Get enemy by name
export const getEnemyByName = name => {
  const enemy = ENEMIES.find(e => e.name === name);
  return enemy ? createEnemyInstance(enemy) : null;
};

// Create enemy instance with unique ID
let enemyIdCounter = 0;
export const createEnemyInstance = enemyTemplate => {
  return {
    ...enemyTemplate,
    id: `enemy_${enemyIdCounter++}`,
    hp: enemyTemplate.hp,
    maxHp: enemyTemplate.maxHp,
    ap: enemyTemplate.ap,
    currentAP: enemyTemplate.ap,
    position: null, // Set during combat init
    facing: null, // Set during combat init
    statusEffects: [],
  };
};

// Get multiple enemies for pack encounters
export const getEnemyPack = (enemyName, count = 2) => {
  const template = ENEMIES.find(e => e.name === enemyName);
  if (!template) return [];

  const pack = [];
  for (let i = 0; i < count; i++) {
    pack.push(createEnemyInstance(template));
  }
  return pack;
};

// Calculate enemy tier based on floor/room depth
export const getEnemyTier = (floor = 1, roomDepth = 0) => {
  const difficulty = floor + roomDepth / 5;

  if (difficulty < 2) return 'early';
  if (difficulty < 4) return 'mid';
  return 'late';
};

// Get weighted random enemy for specific encounter
export const getEncounterEnemies = (encounterType = 'normal', floor = 1) => {
  const tier = getEnemyTier(floor);

  switch (encounterType) {
    case 'swarm':
      // Multiple weak enemies (3-4 weak creatures)
      const swarmType = Math.random();
      if (swarmType < 0.33) {
        return getEnemyPack('Giant Rat', 3);
      } else if (swarmType < 0.66) {
        return getEnemyPack('Cave Bat', 4);
      } else {
        return getEnemyPack('Angry Spider', 2);
      }

    case 'elite':
      // Stronger single enemy
      return [getRandomEnemy('late')];

    case 'duo':
      // Two enemies working together
      return [getRandomEnemy(tier), getRandomEnemy(tier)];

    case 'ranged_melee':
      // Ranged enemy + melee enemy combo
      const rangedEnemy = tier === 'early' ? getEnemyByName('Angry Spider') : getEnemyByName('Skeleton Archer');
      const meleeEnemy = getRandomEnemy(tier);
      return [rangedEnemy, meleeEnemy];

    case 'tank_support':
      // Tank + ranged support
      const tank = getEnemyByName('Skeleton Warrior');
      const support = getEnemyByName('Skeleton Archer');
      return [tank, support];

    case 'ambush':
      // Ambusher enemies
      return [getEnemyByName('Goblin Assassin'), getEnemyByName('Venom Spider')];

    case 'normal':
    default:
      // 70% single enemy, 30% duo encounter
      if (Math.random() < 0.7) {
        return [getRandomEnemy(tier)];
      } else {
        return [getRandomEnemy(tier), getRandomEnemy(tier)];
      }
  }
};

// Apply status effect to enemy
export const applyStatusEffect = (enemy, effect) => {
  if (!enemy.statusEffects) {
    enemy.statusEffects = [];
  }

  const existingEffect = enemy.statusEffects.find(e => e.type === effect.type);

  if (existingEffect) {
    // Refresh duration
    existingEffect.duration = effect.duration;
  } else {
    enemy.statusEffects.push(effect);
  }
};

// Process status effects (called each turn)
export const processStatusEffects = enemy => {
  if (!enemy.statusEffects || enemy.statusEffects.length === 0) return;

  const effects = [...enemy.statusEffects];
  const results = [];

  for (const effect of effects) {
    switch (effect.type) {
      case 'poison':
        enemy.hp -= effect.damage;
        results.push({
          type: 'poison',
          damage: effect.damage,
          message: `${enemy.name} takes ${effect.damage} poison damage (${effect.duration} turns left)`,
        });
        break;

      case 'slow':
        enemy.currentAP = Math.max(1, enemy.ap - 1);
        results.push({
          type: 'slow',
          message: `${enemy.name} is slowed (-1 AP, ${effect.duration} turns left)`,
        });
        break;

      case 'burn':
        enemy.hp -= effect.damage;
        results.push({
          type: 'burn',
          damage: effect.damage,
          message: `${enemy.name} burns for ${effect.damage} damage (${effect.duration} turns left)`,
        });
        break;
    }

    // Decrement duration
    effect.duration--;

    // Check if effect expired
    if (effect.duration === 0) {
      results.push({
        type: `${effect.type}_expire`,
        message: `${enemy.name}'s ${effect.type} effect has worn off.`,
      });
    }
  }

  // Remove expired effects
  enemy.statusEffects = enemy.statusEffects.filter(e => e.duration > 0);

  return results;
};

// Reset enemy AP at start of turn
export const resetEnemyAP = enemy => {
  enemy.currentAP = enemy.ap;

  // Restore normal AP if slow effect expired
  const isSlowed = enemy.statusEffects?.some(e => e.type === 'slow');
  if (isSlowed) {
    enemy.currentAP = Math.max(1, enemy.ap - 1);
  }
};

// Check if enemy can act
export const canEnemyAct = enemy => {
  return enemy.hp > 0 && enemy.currentAP > 0;
};
