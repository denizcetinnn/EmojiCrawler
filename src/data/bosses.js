import { AI_PERSONALITIES } from '../game/combatAI.js';

export const BOSSES = [
    {
      name: 'The Corrupted Knight',
      type: 'undead',
      hp: 30,
      maxHp: 30,
      ap: 3,
      aiPersonality: AI_PERSONALITIES.BOSS,
      weapon: {
        name: 'Cursed Greatsword',
        damage: 6,
        range: 2,
        apCost: 2,
      },
      xpReward: 50,
      goldReward: 100,
      emoji: '⚔️',
      description: 'A fallen knight consumed by darkness. Fights with defensive precision.',
      abilities: ['heavy_strike'],
      defense: 3,
      isBoss: true,
      spawnType: 'boss',
      legendaryWeapon: {
        name: 'Shadow Blade',
        type: 'weapon',
        damage: 10,
        range: 1,
        apCost: 2,
        pattern: 'single',
        rarity: 'legendary',
        category: 'melee',
        value: 500,
        emoji: '🗡️',
        description: 'A blade forged in shadow. Deals triple damage from behind.',
        backstabMultiplier: 3,
        specialAbility: 'backstab',
        bossSource: 'Corrupted Knight'
      }
    },
    {
      name: 'The Plague Doctor',
      type: 'humanoid',
      hp: 25,
      maxHp: 25,
      ap: 3,
      aiPersonality: AI_PERSONALITIES.BOSS,
      weapon: {
        name: 'Plague Censer',
        damage: 4,
        range: 3,
        apCost: 2,
      },
      xpReward: 50,
      goldReward: 100,
      emoji: '🩺',
      description: 'A mad doctor spreading pestilence. Keeps distance and poisons foes.',
      abilities: ['poison'],
      defense: 1,
      isBoss: true,
      spawnType: 'boss',
      legendaryWeapon: {
        name: 'Plague Bow',
        type: 'weapon',
        damage: 8,
        range: 5,
        apCost: 2,
        pattern: 'single',
        rarity: 'legendary',
        category: 'ranged',
        value: 500,
        emoji: '🏹',
        description: 'Every arrow carries disease. Attacks inflict poison (2 dmg/turn for 3 turns).',
        statusEffect: 'poison',
        specialAbility: 'poison',
        bossSource: 'Plague Doctor'
      }
    },
    {
      name: 'The Infernal Warden',
      type: 'demon',
      hp: 35,
      maxHp: 35,
      ap: 3,
      aiPersonality: AI_PERSONALITIES.BOSS,
      weapon: {
        name: 'Chains of Hell',
        damage: 5,
        range: 2,
        apCost: 2,
      },
      xpReward: 50,
      goldReward: 100,
      emoji: '🔥',
      description: 'Guardian of the infernal depths. Relentless and powerful.',
      abilities: ['burn'],
      defense: 2,
      isBoss: true,
      spawnType: 'boss',
      legendaryWeapon: {
        name: 'Meteor Hammer',
        type: 'weapon',
        damage: 9,
        range: 2,
        apCost: 2,
        pattern: 'aoe',
        rarity: 'legendary',
        category: 'melee',
        value: 500,
        emoji: '🔨',
        description: 'A massive flaming hammer. Attacks hit all enemies within range 2.',
        aoeRange: 2,
        specialAbility: 'aoe_damage',
        bossSource: 'Infernal Warden'
      }
    }
  ];

  export const getRandomBoss = () => {
    const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
    return {
      ...boss,
      id: `boss_${Date.now()}`,
      currentAP: boss.ap,
      position: null,
      facing: null,
      statusEffects: []
    };
  };