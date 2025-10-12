export const ARMOR = [
    { name: 'Tattered Cloak', defense: 1, rarity: 'common', value: 5 },
    { name: 'Leather Vest', defense: 2, rarity: 'common', value: 15 },
    { name: 'Chain Mail', defense: 3, rarity: 'rare', value: 30 },
    { name: 'Iron Plate', defense: 5, rarity: 'rare', value: 50 },
    { name: 'Dragon Scale Armor', defense: 7, rarity: 'epic', value: 120 },
    { name: 'Blessed Aegis', defense: 10, rarity: 'epic', value: 250 }
  ];
  
  export const getRandomArmor = (maxRarityIndex = 3) => {
    const availableArmor = ARMOR.slice(0, maxRarityIndex + 1);
    return { ...availableArmor[Math.floor(Math.random() * availableArmor.length)], type: 'armor' };
  };