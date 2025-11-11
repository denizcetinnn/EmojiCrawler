// Floor 2 Bosses - The Abyssal Lords
// Much stronger than Floor 1 bosses, with unique mechanics and amazing rewards

import { AI_PERSONALITIES } from '../game/combatAI.js';

export const FLOOR_2_BOSSES = [
  {
    name: 'The Forgotten King',
    type: 'undead',
    hp: 75,
    maxHp: 75,
    ap: 4,
    aiPersonality: AI_PERSONALITIES.BOSS,
    weapon: {
      name: 'Royal Executioner',
      damage: 7,
      range: 2,
      apCost: 2,
    },
    xpReward: 100,
    goldReward: 200,
    emoji: '👑💀',
    attackEmoji: '⚔️',
    description: 'Once a great king, now a lich of terrible power. Commands legions of undead.',
    abilities: ['summon', 'heavy_strike', 'curse'],
    defense: 3,
    isBoss: true,
    spawnType: 'boss',
    legendaryWeapon: {
      name: 'Crown of Dominion',
      type: 'relic',
      rarity: 'legendary',
      value: 1000,
      emoji: '👑',
      description: 'The ancient crown of a fallen kingdom. Grants +2 AP per turn.',
      effect: 'Grants +2 maximum AP',
      apBonus: 2,
      bossSource: 'The Forgotten King'
    }
  },
  {
    name: 'Abyssal Demon',
    type: 'demon',
    hp: 78,
    maxHp: 78,
    ap: 4,
    aiPersonality: AI_PERSONALITIES.BOSS,
    weapon: {
      name: 'Abyssal Claws',
      damage: 6,
      range: 2,
      apCost: 2,
    },
    xpReward: 100,
    goldReward: 200,
    emoji: '😈',
    attackEmoji: '🔥',
    description: 'A demon lord from the deepest pits. Teleports rapidly and strikes with hellfire.',
    abilities: ['teleport', 'burn', 'aoe_attack'],
    defense: 2,
    isBoss: true,
    spawnType: 'boss',
    legendaryWeapon: {
      name: 'Demon\'s Claw',
      type: 'weapon',
      damage: 11,
      range: 1,
      apCost: 2,
      pattern: 'cleave',
      rarity: 'legendary',
      category: 'melee',
      value: 1000,
      emoji: '👹',
      description: 'Cursed weapon forged in hellfire. Cleave attacks hit all adjacent enemies.',
      specialAbility: 'cleave_all_adjacent',
      statusEffect: 'burn',
      bossSource: 'Abyssal Demon'
    }
  },
  {
    name: 'Ancient Lich King',
    type: 'undead',
    hp: 70,
    maxHp: 70,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.BOSS,
    weapon: {
      name: 'Staff of Undeath',
      damage: 8,
      range: 4,
      apCost: 3,
    },
    xpReward: 100,
    goldReward: 200,
    emoji: '💀👑',
    attackEmoji: '💀',
    description: 'The most powerful necromancer to ever exist. Raises the dead endlessly.',
    abilities: ['summon', 'curse', 'teleport', 'drain'],
    defense: 2,
    isBoss: true,
    spawnType: 'boss',
    legendaryWeapon: {
      name: 'Phylactery Amulet',
      type: 'relic',
      rarity: 'legendary',
      value: 1000,
      emoji: '📿',
      description: 'Contains a fragment of the Lich King\'s soul. Grants immunity to death once per floor.',
      effect: 'If you would die, survive with 1 HP instead (once per floor)',
      specialAbility: 'death_immunity',
      bossSource: 'Ancient Lich King'
    }
  },
  {
    name: 'Infernal Dragon',
    type: 'demon',
    hp: 86,
    maxHp: 86,
    ap: 3,
    aiPersonality: AI_PERSONALITIES.BOSS,
    weapon: {
      name: 'Hellfire Breath',
      damage: 9,
      range: 4,
      apCost: 3,
    },
    xpReward: 100,
    goldReward: 200,
    emoji: '🐉🔥',
    attackEmoji: '🔥',
    description: 'A massive dragon wreathed in eternal flames. Its breath melts armor and flesh.',
    abilities: ['burn', 'fly', 'aoe_attack'],
    defense: 4,
    isBoss: true,
    spawnType: 'boss',
    legendaryWeapon: {
      name: 'Dragonscale Aegis',
      type: 'armor',
      rarity: 'legendary',
      category: 'armor',
      value: 1000,
      emoji: '🛡️',
      description: 'Shield forged from dragon scales. Grants +3 defense and immunity to fire.',
      defense: 3,
      apModifier: 0,
      specialAbility: 'fire_immunity',
      effect: '+3 Defense, Immune to burn effects',
      bossSource: 'Infernal Dragon'
    }
  },
  {
    name: 'Void Emperor',
    type: 'demon',
    hp: 81,
    maxHp: 81,
    ap: 4,
    aiPersonality: AI_PERSONALITIES.BOSS,
    weapon: {
      name: 'Void Fissure',
      damage: 7,
      range: 5,
      apCost: 2,
    },
    xpReward: 100,
    goldReward: 200,
    emoji: '👁️',
    attackEmoji: '🌀',
    description: 'Entity from beyond reality. Warps space and drains the life force of all nearby.',
    abilities: ['teleport', 'drain', 'aoe_attack', 'curse'],
    defense: 1,
    isBoss: true,
    spawnType: 'boss',
    legendaryWeapon: {
      name: 'Void Scepter',
      type: 'weapon',
      damage: 10,
      range: 5,
      apCost: 3,
      pattern: 'single',
      rarity: 'legendary',
      category: 'magic',
      value: 1000,
      emoji: '🔮',
      description: 'Staff that tears open rifts in reality. Attacks drain 1 AP from enemies.',
      specialAbility: 'ap_drain',
      effect: 'Attacks drain 1 AP from target',
      element: 'void',
      bossSource: 'Void Emperor'
    }
  }
];

// Get random Floor 2 boss
export const getRandomFloor2Boss = () => {
  const boss = FLOOR_2_BOSSES[Math.floor(Math.random() * FLOOR_2_BOSSES.length)];
  return {
    ...boss,
    id: `floor2_boss_${Date.now()}`,
    currentAP: boss.ap,
    position: null,
    facing: null,
    statusEffects: []
  };
};

// Get specific Floor 2 boss by name
export const getFloor2BossByName = (name) => {
  const boss = FLOOR_2_BOSSES.find(b => b.name === name);
  if (!boss) return null;

  return {
    ...boss,
    id: `floor2_boss_${Date.now()}`,
    currentAP: boss.ap,
    position: null,
    facing: null,
    statusEffects: []
  };
};
