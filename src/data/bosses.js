export const BOSSES = [
    {
      name: 'The Corrupted Knight',
      type: 'undead',
      hp: 30,
      maxHp: 30,
      damage: 4,
      xpReward: 50,
      goldReward: 100,
      moves: ['Heavy Slash', 'Shield Wall', 'Riposte'],
      pattern: 'defensive',
      emoji: '⚔️',
      legendaryWeapon: {
        name: 'Oath Keeper',
        type: 'weapon',
        damage: 12,
        rarity: 'legendary',
        value: 500,
        grantedMove: {
          name: 'Riposte',
          energyCost: 4,
          description: 'Block next attack and counter for double damage',
          effect: 'riposte'
        }
      }
    },
    {
      name: 'The Plague Doctor',
      type: 'humanoid',
      hp: 25,
      maxHp: 25,
      damage: 3,
      xpReward: 50,
      goldReward: 100,
      moves: ['Poison Dart', 'Miasma Cloud', 'Medical Precision'],
      pattern: 'evasive',
      emoji: '🩺',
      legendaryWeapon: {
        name: 'Pestilence Staff',
        type: 'weapon',
        damage: 10,
        rarity: 'legendary',
        value: 500,
        grantedMove: {
          name: 'Poison Strike',
          energyCost: 3,
          description: 'Deal 3 damage + poison (2 damage for 2 turns)',
          effect: 'poison'
        }
      }
    },
    {
      name: 'The Infernal Warden',
      type: 'demon',
      hp: 35,
      maxHp: 35,
      damage: 5,
      xpReward: 50,
      goldReward: 100,
      moves: ['Flame Burst', 'Burning Chains', 'Immolate'],
      pattern: 'aggressive',
      emoji: '🔥',
      legendaryWeapon: {
        name: 'Hellfire Axe',
        type: 'weapon',
        damage: 14,
        rarity: 'legendary',
        value: 500,
        grantedMove: {
          name: 'Flame Strike',
          energyCost: 5,
          description: 'Deal 6 damage + burn (1 damage per turn)',
          effect: 'burn'
        }
      }
    }
  ];
  
  export const getRandomBoss = () => {
    const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
    return { ...boss };
  };