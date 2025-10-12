export const RELICS = [
  { name: 'Lucky Coin', effect: 'Gold drops increased by 50%', type: 'gold', value: 30, rarity: 'rare' },
  { name: 'Warrior Ring', effect: '+2 STR', type: 'stat', stat: 'str', statValue: 2, value: 40, rarity: 'rare' },
  { name: 'Nimble Boots', effect: '+2 DEX', type: 'stat', stat: 'dex', statValue: 2, value: 40, rarity: 'rare' },
  { name: 'Scholar Glasses', effect: '+2 INT', type: 'stat', stat: 'int', statValue: 2, value: 40, rarity: 'rare' },
  { name: 'Silver Tongue Amulet', effect: '+2 CHA', type: 'stat', stat: 'cha', statValue: 2, value: 40, rarity: 'rare' },
  { name: 'Vampire Fang', effect: 'Heal 1 HP per kill', type: 'lifesteal', value: 50, rarity: 'epic' },
  { name: 'Energy Crystal', effect: '+5 Max Energy', type: 'maxenergy', value: 35, rarity: 'rare' }
];

export const getRandomRelic = () => {
  return { ...RELICS[Math.floor(Math.random() * RELICS.length)] };
};