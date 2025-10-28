export const ROOM_TYPES = {
  START: 'start',
  COMBAT: 'combat',
  TREASURE: 'treasure',
  SHOP: 'shop',
  REST: 'rest',
  EVENT: 'event',
  BOSS: 'boss'
};

export const getRoomEmoji = (type, locked = false) => {
  if (locked) return '🔒';
  const emojis = {
    start: '🏠',
    combat: '⚔️',
    treasure: '💎',
    shop: '🏪',
    rest: '🔥',
    event: '📖',
    boss: '👑'
  };
  return emojis[type] || '❓';
};

export const POTIONS = [
  { name: 'Health Potion', type: 'potion', effect: 'Restore 5 HP', healAmount: 5, value: 15 },
  { name: 'Energy Potion', type: 'potion', effect: 'Restore 5 Energy', energyAmount: 5, value: 12 }
];

export const createStartRoom = (x, y, from) => ({
  x,
  y,
  type: ROOM_TYPES.START,
  name: "Old Man's Dressing Room",
  description: 'A musty room filled with old belongings.',
  visited: false,
  cleared: false,
  exits: { north: true, east: false, south: false, west: false, [from]: true },
  actions: [
    { id: 'wardrobe', name: 'The Wardrobe', description: 'Look for clothing', completed: false },
    { id: 'chest', name: 'The Chest', description: 'Search for weapons', completed: false },
    { id: 'book', name: 'Book and Quill', description: 'Take the map', completed: false },
    { id: 'spider', name: 'Angry Spider', description: 'Fight!', completed: false, mandatory: true, icon: '!' }
  ]
});

export const createCombatRoom = (x, y, from, enemy) => ({
  x,
  y,
  type: ROOM_TYPES.COMBAT,
  name: 'Dark Corridor',
  description: 'Shadows move in the darkness.',
  visited: false,
  cleared: false,
  exits: { north: false, east: false, south: false, west: false, [from]: true },
  enemy,
  actions: [
    { id: 'enemy', name: enemy.name, description: 'Engage in combat!', completed: false, mandatory: true, icon: '!' }
  ]
});

export const createTreasureRoom = (x, y, from, locked = true) => ({
  x,
  y,
  type: ROOM_TYPES.TREASURE,
  name: locked ? 'Locked Treasure Room' : 'Treasure Room',
  description: locked ? 'A heavy door blocks your path. You need a key.' : 'Glittering items catch your eye.',
  visited: false,
  cleared: false,
  locked,
  exits: { north: false, east: false, south: false, west: false, [from]: true },
  actions: locked ? [
    { id: 'locked_door', name: 'Locked Door', description: 'Requires a key', completed: false, mandatory: false, icon: '🔒' }
  ] : [
    { id: 'chest', name: 'Treasure Chest', description: 'Open it', completed: false },
    { id: 'coins', name: 'Gold Pile', description: 'Take the gold', completed: false },
    { id: 'pedestal', name: 'Relic Pedestal', description: 'A mysterious artifact', completed: false }
  ]
});

export const createShopRoom = (x, y, from, shopInventory) => ({
  x,
  y,
  type: ROOM_TYPES.SHOP,
  name: 'Mysterious Shop',
  description: 'A hooded figure tends a small shop.',
  visited: false,
  cleared: false,
  exits: { north: false, east: false, south: false, west: false, [from]: true },
  shopInventory,
  shopActive: true,
  purchasedItems: [],
  actions: [
    { id: 'shop', name: 'Browse Wares', description: 'See what is for sale', completed: false }
  ]
});

export const createRestRoom = (x, y, from) => ({
  x,
  y,
  type: ROOM_TYPES.REST,
  name: 'Safe Haven',
  description: 'A peaceful room with a warm fire.',
  visited: false,
  cleared: false,
  exits: { north: false, east: false, south: false, west: false, [from]: true },
  actions: [
    { id: 'rest', name: 'Rest by Fire', description: 'Recover health and energy', completed: false },
    { id: 'meditate', name: 'Meditate', description: 'Restore energy', completed: false }
  ]
});

export const createEventRoom = (x, y, from) => ({
  x,
  y,
  type: ROOM_TYPES.EVENT,
  name: 'Abandoned Camp',
  description: 'Signs of previous adventurers.',
  visited: false,
  cleared: false,
  exits: { north: false, east: false, south: false, west: false, [from]: true },
  actions: [
    { id: 'skeleton', name: 'Skeleton', description: 'Search the remains', completed: false },
    { id: 'trap', name: 'Strange Mechanism', description: 'Investigate (INT)', completed: false }
  ]
});

export const createBossRoom = (x, y, from, boss) => ({
  x,
  y,
  type: ROOM_TYPES.BOSS,
  name: 'Ominous Chamber',
  description: 'The air feels heavy here. Something powerful lurks within.',
  visited: false,
  cleared: false,
  exits: { north: false, east: false, south: false, west: false, [from]: true },
  boss,
  actions: [
    { id: 'boss', name: boss.name, description: 'Challenge the boss!', completed: false, mandatory: false, icon: '💀' }
  ]
});