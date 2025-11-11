// Floor 2 Enemies - The Abyssal Depths
// Significantly stronger enemies for players who have cleared Floor 1
// Mix of promoted Floor 1 elites and brand new threats

import { AI_PERSONALITIES } from '../game/combatAI.js';

export const FLOOR_2_ENEMIES = [
  // FLOOR 2 EARLY/MID GAME (promoted Floor 1 late-game enemies)
  {
    name: 'Corrupted Mage',
    type: 'humanoid',
    hp: 30,
    maxHp: 30,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Void Bolt',
      damage: 5,
      range: 3,
      apCost: 2,
    },
    xpReward: 35,
    goldReward: 28,
    emoji: '🧙‍♂️',
    attackEmoji: '🌀',
    description: 'Mage corrupted by dark magic. Casts powerful spells from range.',
    abilities: ['teleport'],
    spawnType: 'defensive',
  },
  {
    name: 'Enraged Berserker',
    type: 'humanoid',
    hp: 40,
    maxHp: 40,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Bloodied Axes',
      damage: 6,
      range: 1,
      apCost: 1,
    },
    xpReward: 42,
    goldReward: 22,
    emoji: '⚔️',
    attackEmoji: '🪓',
    description: 'Battle-crazed warrior consumed by bloodlust.',
    abilities: ['frenzy'],
    defense: 1,
    spawnType: 'aggressive',
  },
  {
    name: 'Void Stalker',
    type: 'demon',
    hp: 32,
    maxHp: 32,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.AMBUSHER,
    weapon: {
      name: 'Void Daggers',
      damage: 4,
      range: 1,
      apCost: 1,
    },
    xpReward: 38,
    goldReward: 26,
    emoji: '👤',
    attackEmoji: '🗡️',
    description: 'Master assassin from the void. Devastating from behind.',
    abilities: ['backstab'],
    backstabMultiplier: 2.5,
    spawnType: 'ambusher',
  },
  {
    name: 'Frost Golem',
    type: 'construct',
    hp: 52,
    maxHp: 52,
    ap: 1,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Glacial Fists',
      damage: 5,
      range: 1,
      apCost: 1,
    },
    xpReward: 28,
    goldReward: 15,
    emoji: '❄️',
    attackEmoji: '🧊',
    description: 'Massive ice construct. Slow but incredibly durable.',
    abilities: ['slow'],
    defense: 4,
    spawnType: 'aggressive',
  },
  {
    name: 'Elder Necromancer',
    type: 'humanoid',
    hp: 25,
    maxHp: 25,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Death Beam',
      damage: 4,
      range: 4,
      apCost: 2,
    },
    xpReward: 34,
    goldReward: 22,
    emoji: '☠️',
    attackEmoji: '💀',
    description: 'Powerful necromancer who commands legions of undead.',
    abilities: ['summon'],
    spawnType: 'defensive',
  },

  // FLOOR 2 MID/LATE GAME (brand new enemies)
  {
    name: 'Death Knight',
    type: 'undead',
    hp: 46,
    maxHp: 46,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Cursed Cleaver',
      damage: 7,
      range: 1,
      apCost: 2,
    },
    xpReward: 45,
    goldReward: 35,
    emoji: '💀⚔️',
    attackEmoji: '⚔️',
    description: 'Elite undead warrior in blackened armor. Cleaving strikes hit multiple foes.',
    abilities: ['cleave'],
    defense: 4,
    spawnType: 'defensive',
  },
  {
    name: 'Void Wraith',
    type: 'demon',
    hp: 34,
    maxHp: 34,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.HIT_AND_RUN,
    weapon: {
      name: 'Life Drain',
      damage: 4,
      range: 2,
      apCost: 2,
    },
    xpReward: 40,
    goldReward: 30,
    emoji: '👻',
    attackEmoji: '🌀',
    description: 'Spectral horror that feeds on life force. Drains your AP.',
    abilities: ['drain', 'teleport'],
    spawnType: 'hit_and_run',
  },
  {
    name: 'Demon Hunter',
    type: 'humanoid',
    hp: 38,
    maxHp: 38,
    ap: 4,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Twin Blades',
      damage: 4,
      range: 1,
      apCost: 1,
    },
    xpReward: 48,
    goldReward: 32,
    emoji: '🗡️',
    attackEmoji: '⚔️',
    description: 'Ironically hunts for demons. Lightning fast dual-wielder.',
    abilities: ['double_attack'],
    spawnType: 'aggressive',
  },
  {
    name: 'Vampire Lord',
    type: 'undead',
    hp: 40,
    maxHp: 40,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Vampiric Claws',
      damage: 5,
      range: 1,
      apCost: 1,
    },
    xpReward: 50,
    goldReward: 40,
    emoji: '🧛',
    attackEmoji: '🦇',
    description: 'Ancient vampire with regenerative powers. Heals when it damages you.',
    abilities: ['lifesteal'],
    spawnType: 'aggressive',
  },
  {
    name: 'Arcane Sentinel',
    type: 'construct',
    hp: 50,
    maxHp: 50,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Arcane Blast',
      damage: 6,
      range: 3,
      apCost: 2,
    },
    xpReward: 42,
    goldReward: 28,
    emoji: '🔮',
    attackEmoji: '✨',
    description: 'Magical construct that reflects spell damage back at casters.',
    abilities: ['reflect_magic'],
    defense: 3,
    spawnType: 'defensive',
  },
  {
    name: 'Hellhound',
    type: 'demon',
    hp: 25,
    maxHp: 25,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.SWARM,
    weapon: {
      name: 'Fiery Bite',
      damage: 4,
      range: 1,
      apCost: 1,
    },
    xpReward: 25,
    goldReward: 18,
    emoji: '🐕‍🦺',
    attackEmoji: '🔥',
    description: 'Demonic hound wreathed in flames. Often hunts in packs.',
    abilities: ['burn'],
    spawnType: 'swarm',
    packSize: 3,
  },
  {
    name: 'Lich',
    type: 'undead',
    hp: 30,
    maxHp: 30,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Necrotic Ray',
      damage: 6,
      range: 4,
      apCost: 2,
    },
    xpReward: 52,
    goldReward: 45,
    emoji: '💀🔮',
    attackEmoji: '☠️',
    description: 'Undead sorcerer of immense power. Summons minions and casts deadly spells.',
    abilities: ['summon', 'curse'],
    defense: 2,
    spawnType: 'defensive',
  },
  {
    name: 'Infernal Executioner',
    type: 'demon',
    hp: 59,
    maxHp: 59,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Hellfire Axe',
      damage: 8,
      range: 1,
      apCost: 2,
    },
    xpReward: 55,
    goldReward: 38,
    emoji: '👹🔥',
    attackEmoji: '🪓',
    description: 'Massive demon wielding a flaming greataxe. Devastating but slow.',
    abilities: ['burn', 'heavy_strike'],
    defense: 2,
    spawnType: 'aggressive',
  },
  {
    name: 'Abyssal Cultist',
    type: 'humanoid',
    hp: 27,
    maxHp: 27,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.DEFENSIVE,
    weapon: {
      name: 'Curse Hex',
      damage: 3,
      range: 3,
      apCost: 1,
    },
    xpReward: 32,
    goldReward: 24,
    emoji: '🧙‍♀️',
    attackEmoji: '🌙',
    description: 'Devoted cultist of the abyss. Weakens enemies with dark curses.',
    abilities: ['curse'],
    spawnType: 'defensive',
  },
  {
    name: 'Bone Dragon',
    type: 'undead',
    hp: 55,
    maxHp: 55,
    ap: 2,
    aiPersonality: AI_PERSONALITIES.AGGRESSIVE,
    weapon: {
      name: 'Necrotic Breath',
      damage: 7,
      range: 3,
      apCost: 2,
    },
    xpReward: 60,
    goldReward: 50,
    emoji: '🐉',
    attackEmoji: '💀',
    description: 'Skeletal dragon reanimated by dark magic. Breath weapon hits hard.',
    abilities: ['fly'],
    defense: 2,
    spawnType: 'aggressive',
  },
];

// Get random Floor 2 enemy based on difficulty tier
export const getRandomFloor2Enemy = (tier = 'early') => {
  let enemies;

  switch (tier) {
    case 'early':
      // Floor 2 early: Promoted Floor 1 elites
      enemies = FLOOR_2_ENEMIES.slice(0, 5); // Corrupted Mage, Berserker, Void Stalker, Frost Golem, Necromancer
      break;
    case 'mid':
      // Floor 2 mid: Mix of promoted and new
      enemies = FLOOR_2_ENEMIES.slice(3, 11); // Frost Golem, Necromancer, Death Knight, Void Wraith, Demon Hunter, Vampire, Sentinel, Hellhound
      break;
    case 'late':
      // Floor 2 late: Most dangerous new enemies
      enemies = FLOOR_2_ENEMIES.slice(8, 15); // Vampire, Sentinel, Hellhound, Lich, Executioner, Cultist, Bone Dragon
      break;
    default:
      enemies = FLOOR_2_ENEMIES;
  }

  const enemy = enemies[Math.floor(Math.random() * enemies.length)];
  return createFloor2EnemyInstance(enemy);
};

// Create Floor 2 enemy instance with unique ID
let floor2EnemyIdCounter = 0;
export const createFloor2EnemyInstance = enemyTemplate => {
  return {
    ...enemyTemplate,
    id: `floor2_enemy_${floor2EnemyIdCounter++}`,
    hp: enemyTemplate.hp,
    maxHp: enemyTemplate.maxHp,
    ap: enemyTemplate.ap,
    currentAP: enemyTemplate.ap,
    position: null,
    facing: null,
    statusEffects: [],
  };
};

// Get Floor 2 enemy pack
export const getFloor2EnemyPack = (enemyName, count = 2) => {
  const template = FLOOR_2_ENEMIES.find(e => e.name === enemyName);
  if (!template) return [];

  const pack = [];
  for (let i = 0; i < count; i++) {
    pack.push(createFloor2EnemyInstance(template));
  }
  return pack;
};

// Get Floor 2 encounter enemies
export const getFloor2EncounterEnemies = (encounterType = 'normal') => {
  const tierRoll = Math.random();
  let tier;
  if (tierRoll < 0.2) {
    tier = 'early'; // 20% easier enemies
  } else if (tierRoll < 0.7) {
    tier = 'mid'; // 50% mid-tier
  } else {
    tier = 'late'; // 30% hardest enemies
  }

  switch (encounterType) {
    case 'swarm':
      // Hellhound pack
      return getFloor2EnemyPack('Hellhound', 3);

    case 'elite':
      // Single very strong enemy
      return [getRandomFloor2Enemy('late')];

    case 'duo':
      // Two enemies
      return [getRandomFloor2Enemy(tier), getRandomFloor2Enemy(tier)];

    case 'tank_caster':
      // Tank + magic support
      const tank = createFloor2EnemyInstance(FLOOR_2_ENEMIES.find(e => e.name === 'Death Knight'));
      const caster = createFloor2EnemyInstance(FLOOR_2_ENEMIES.find(e => e.name === 'Lich'));
      return [tank, caster];

    case 'vampire_cultist':
      // Vampire + Cultist combo
      const vampire = createFloor2EnemyInstance(FLOOR_2_ENEMIES.find(e => e.name === 'Vampire Lord'));
      const cultist = createFloor2EnemyInstance(FLOOR_2_ENEMIES.find(e => e.name === 'Abyssal Cultist'));
      return [vampire, cultist];

    case 'boss_preview':
      // Taste of what's to come
      return [createFloor2EnemyInstance(FLOOR_2_ENEMIES.find(e => e.name === 'Bone Dragon'))];

    case 'normal':
    default:
      // 60% single enemy, 40% duo
      if (Math.random() < 0.6) {
        return [getRandomFloor2Enemy(tier)];
      } else {
        return [getRandomFloor2Enemy(tier), getRandomFloor2Enemy(tier)];
      }
  }
};
