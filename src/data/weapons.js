export const WEAPONS = [
    { name: 'Rusty Dagger', damage: 2, rarity: 'common', value: 5 },
    { name: 'Iron Sword', damage: 4, rarity: 'common', value: 15 },
    { name: 'Sharp Blade', damage: 6, rarity: 'rare', value: 30 },
    { name: 'Steel Longsword', damage: 8, rarity: 'rare', value: 50 },
    { name: 'Enchanted Rapier', damage: 10, rarity: 'epic', value: 100 },
    { name: 'Shadowfang', damage: 15, rarity: 'epic', value: 200 }
  ];
  
  export const getRandomWeapon = (maxRarityIndex = 3) => {
    const availableWeapons = WEAPONS.slice(0, maxRarityIndex + 1);
    return { ...availableWeapons[Math.floor(Math.random() * availableWeapons.length)], type: 'weapon' };
  };