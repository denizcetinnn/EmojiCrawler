export const ENEMIES = [
    {
      name: 'Angry Spider',
      type: 'arthropod',
      hp: 5,
      damage: 1,
      xpReward: 5,
      goldReward: 2,
      moves: ['Bite', 'Web Shot'],
      pattern: 'aggressive',
      emoji: '🕷️'
    },
    {
      name: 'Giant Rat',
      type: 'beast',
      hp: 8,
      damage: 2,
      xpReward: 8,
      goldReward: 3,
      moves: ['Bite', 'Scratch', 'Dodge'],
      pattern: 'mixed',
      emoji: '🐀'
    },
    {
      name: 'Skeleton Warrior',
      type: 'undead',
      hp: 12,
      damage: 3,
      xpReward: 15,
      goldReward: 8,
      moves: ['Slash', 'Shield Bash', 'Block'],
      pattern: 'defensive',
      emoji: '💀'
    },
    {
      name: 'Goblin Thief',
      type: 'humanoid',
      hp: 10,
      damage: 2,
      xpReward: 12,
      goldReward: 15,
      moves: ['Stab', 'Dodge', 'Steal'],
      pattern: 'evasive',
      emoji: '👹'
    },
    {
      name: 'Slime',
      type: 'monster',
      hp: 15,
      damage: 1,
      xpReward: 10,
      goldReward: 5,
      moves: ['Absorb', 'Acid Spit'],
      pattern: 'tank',
      emoji: '👾'
    }
  ];
  
  export const getRandomEnemy = () => {
    const enemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
    return { ...enemy, maxHp: enemy.hp };
  };
  
  export const getSpiderEnemy = () => {
    return { ...ENEMIES[0], maxHp: ENEMIES[0].hp };
  };