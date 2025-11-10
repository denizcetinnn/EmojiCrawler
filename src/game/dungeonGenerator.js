import { getRandomEnemy, getEncounterEnemies, getEnemyTier } from '../data/enemies';
import { getFloor2EncounterEnemies } from '../data/floor2Enemies';
import { getRandomWeapon } from '../data/weapons';
import { getRandomArmor } from '../data/armor';
import { getRandomRelic } from '../data/relics';
import { getRandomBoss } from '../data/bosses';
import { getRandomFloor2Boss } from '../data/floor2Bosses';
import { createFloor2EventRoom } from '../data/floor2Events';
import { POTIONS } from '../data/roomTemplates';
import { getNextPosition, getOppositeDirection } from '../utils/helpers';
import {
  createStartRoom,
  createCombatRoom,
  createTreasureRoom,
  createShopRoom,
  createRestRoom,
  createEventRoom,
  createBossRoom
} from '../data/roomTemplates';

export const generateFloor = (floor = 1) => {
  const layout = [];
  // Floor 2+ starts in a "Descending Chamber" instead of the old man's room
  const startRoom = floor === 1
    ? createStartRoom(0, 0, 'south')
    : {
        x: 0,
        y: 0,
        type: 'start',
        name: 'Descending Chamber',
        description: 'Stone stairs lead down into oppressive darkness. The air is thick with malice.',
        visited: false,
        cleared: false,
        exits: { north: true, east: false, south: false, west: false, south: true },
        actions: [],
        floor
      };
  layout.push(startRoom);
  
  const queue = [{ x: 0, y: 1, from: 'south', depth: 1 }];
  const positions = new Set(['0,0']);
  let roomCount = 1;
  const minRooms = 12;
  const maxRooms = 18;
  const targetRooms = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;
  
  // Track special rooms
  let shopCount = 0;
  let treasureCount = 0;
  let restCount = 0;
  const minShops = 1;  // At least 1 shop
  const maxShops = Math.random() < 0.5 ? 1 : 2;
  const minTreasures = 1;  // At least 1 treasure
  const maxTreasures = Math.random() < 0.5 ? 1 : 2;
  
  let furthestRoom = { x: 0, y: 0, depth: 0 };
  const generatedRooms = [];  // Store rooms to ensure minimums
  
  while (roomCount < targetRooms) {
    // If queue is empty but we haven't met minimum, add more branches
    if (queue.length === 0 && roomCount < minRooms) {
      // Find rooms that can have additional exits
      const expandableRooms = layout.filter(r => {
        const exitCount = Object.values(r.exits).filter(e => e).length;
        return exitCount < 3; // Can add more exits
      });

      if (expandableRooms.length > 0) {
        // Pick a random room to expand from
        const roomToExpand = expandableRooms[Math.floor(Math.random() * expandableRooms.length)];
        const availableDirections = ['north', 'east', 'west'].filter(dir => !roomToExpand.exits[dir]);

        if (availableDirections.length > 0) {
          const dir = availableDirections[Math.floor(Math.random() * availableDirections.length)];
          const next = getNextPosition(roomToExpand.x, roomToExpand.y, dir);
          const nextKey = `${next.x},${next.y}`;

          if (!positions.has(nextKey)) {
            roomToExpand.exits[dir] = true;
            queue.push({ x: next.x, y: next.y, from: getOppositeDirection(dir), depth: 1 });
          }
        }
      } else {
        // Can't expand anymore, break out
        break;
      }
    }

    if (queue.length === 0) break; // No more positions to process

    const current = queue.shift();
    const posKey = `${current.x},${current.y}`;

    if (positions.has(posKey)) continue;

    positions.add(posKey);

    // Track furthest room for boss placement
    if (current.depth > furthestRoom.depth) {
      furthestRoom = { x: current.x, y: current.y, depth: current.depth };
    }

    // Determine room type with constraints
    let roomType = 'combat';
    const rand = Math.random();

    // Prioritize shops if we haven't met minimum
    if (shopCount < minShops && current.depth > 3) {
      roomType = 'shop';
      shopCount++;
    } else if (treasureCount < minTreasures && current.depth > 4) {
      roomType = 'treasure';
      treasureCount++;
    } else if (rand < 0.1 && shopCount < maxShops && current.depth > 3) {
      roomType = 'shop';
      shopCount++;
    } else if (rand < 0.2 && treasureCount < maxTreasures && current.depth > 4) {
      roomType = 'treasure';
      treasureCount++;
    } else if (rand < 0.3 && restCount < 2) {
      roomType = 'rest';
      restCount++;
    } else if (rand < 0.4) {
      roomType = 'event';
    } else {
      roomType = 'combat';
    }

    const room = createRoomByType(roomType, current.x, current.y, current.from, current.depth, floor);
    layout.push(room);
    generatedRooms.push({ room, depth: current.depth });
    roomCount++;

    // Add exits - increase chance of more exits to ensure we reach minRooms
    const directions = ['north', 'east', 'west'];
    const numExits = roomCount < minRooms ? (Math.random() < 0.7 ? 2 : 1) : (Math.random() < 0.6 ? 1 : 2);

    for (let i = 0; i < numExits && directions.length > 0; i++) {
      const dirIdx = Math.floor(Math.random() * directions.length);
      const dir = directions.splice(dirIdx, 1)[0];
      room.exits[dir] = true;

      const next = getNextPosition(current.x, current.y, dir);
      if (!positions.has(`${next.x},${next.y}`)) {
        queue.push({ x: next.x, y: next.y, from: getOppositeDirection(dir), depth: current.depth + 1 });
      }
    }
  }
  
  // Ensure minimums are met by converting combat rooms if needed
  if (shopCount < minShops) {
    // Find combat rooms at reasonable depth and convert to shops
    const combatRooms = generatedRooms.filter(r => r.room.type === 'combat' && r.depth > 3);
    while (shopCount < minShops && combatRooms.length > 0) {
      const toConvert = combatRooms.pop();
      const shopRoom = createShopRoom(toConvert.room.x, toConvert.room.y, 'south', generateShopInventory());
      // Copy exits from old room
      shopRoom.exits = { ...toConvert.room.exits };
      shopRoom.visited = toConvert.room.visited;
      // Replace in layout
      const index = layout.findIndex(r => r.x === toConvert.room.x && r.y === toConvert.room.y);
      if (index !== -1) {
        layout[index] = shopRoom;
        shopCount++;
      }
    }
  }
  
  if (treasureCount < minTreasures) {
    // Find combat rooms at reasonable depth and convert to treasure
    const combatRooms = generatedRooms.filter(r => r.room.type === 'combat' && r.depth > 4);
    while (treasureCount < minTreasures && combatRooms.length > 0) {
      const toConvert = combatRooms.pop();
      const treasureRoom = createTreasureRoom(toConvert.room.x, toConvert.room.y, 'south', true);
      // Copy exits from old room
      treasureRoom.exits = { ...toConvert.room.exits };
      treasureRoom.visited = toConvert.room.visited;
      // Replace in layout
      const index = layout.findIndex(r => r.x === toConvert.room.x && r.y === toConvert.room.y);
      if (index !== -1) {
        layout[index] = treasureRoom;
        treasureCount++;
      }
    }
  }
  
  // Add boss room at furthest point
  const boss = floor === 1 ? getRandomBoss() : getRandomFloor2Boss();
  const bossRoom = createBossRoom(furthestRoom.x, furthestRoom.y + 1, 'south', boss);
  bossRoom.floor = floor;

  // Connect boss room to furthest room
  const furthestRoomObj = layout.find(r => r.x === furthestRoom.x && r.y === furthestRoom.y);
  if (furthestRoomObj) {
    furthestRoomObj.exits.north = true;
    bossRoom.exits.south = true;
  }

  layout.push(bossRoom);

  return layout;
};

const createRoomByType = (type, x, y, from, roomDepth = 0, floor = 1) => {
  switch (type) {
    case 'combat':
      // Varied encounter types based on depth and chance
      const encounterRoll = Math.random();
      let encounterType = 'normal'; // 40% normal (single or duo)

      if (roomDepth >= 5) {
        // Deeper rooms have more variety
        if (encounterRoll < 0.15) encounterType = 'swarm'; // 15% swarm
        else if (encounterRoll < 0.3) encounterType = 'duo'; // 15% duo
        else if (encounterRoll < 0.4) encounterType = 'ranged_melee'; // 10% mixed
        else if (encounterRoll < 0.5) encounterType = 'elite'; // 10% elite
        // 50% normal
      } else if (roomDepth >= 3) {
        // Mid-depth rooms
        if (encounterRoll < 0.1) encounterType = 'swarm'; // 10% swarm
        else if (encounterRoll < 0.25) encounterType = 'duo'; // 15% duo
        // 75% normal
      }
      // Early rooms (depth < 3) are always 'normal'

      // Use Floor 2 enemies if on floor 2
      const enemies = floor === 1
        ? getEncounterEnemies(encounterType, floor)
        : getFloor2EncounterEnemies(encounterType);
      return createCombatRoom(x, y, from, enemies.length === 1 ? enemies[0] : enemies);

    case 'treasure':
      return createTreasureRoom(x, y, from, true); // Locked by default
    case 'shop':
      return createShopRoom(x, y, from, generateShopInventory(floor));
    case 'rest':
      return createRestRoom(x, y, from);
    case 'event':
      // Use Floor 2 events if on floor 2
      return floor === 1 ? createEventRoom(x, y, from) : createFloor2EventRoom(x, y, from);
    default:
      return createCombatRoom(x, y, from, getRandomEnemy());
  }
};

const generateShopInventory = (floor = 1) => {
  const items = [];

  // Floor-based rarity distributions
  const floor1Weights = {
    common: { common: 0.5, rare: 0.4, epic: 0.1 },
    rare: { common: 0.3, rare: 0.5, epic: 0.2 },
    epic: { common: 0.1, rare: 0.3, epic: 0.6 }
  };

  // Floor 2 shops prioritize high-quality gear for endgame players
  const floor2Weights = {
    common: { common: 0.1, rare: 0.4, epic: 0.5 }, // Even "common" slot has good stuff
    rare: { common: 0, rare: 0.3, epic: 0.7 }, // Mostly epic
    epic: { common: 0, rare: 0.1, epic: 0.9 }, // Almost guaranteed epic
    legendary: { common: 0, rare: 0, epic: 0.6, legendary: 0.4 } // Chance for legendary
  };

  const rarityWeights = floor === 1 ? floor1Weights : floor2Weights;

  // Weapons - mix of rarities
  if (floor === 1) {
    // Floor 1: 1 common-weighted, 1 rare-weighted, 1 epic-weighted
    items.push(getRandomWeapon(rarityWeights.common));
    items.push(getRandomWeapon(rarityWeights.rare));
    items.push(getRandomWeapon(rarityWeights.epic));
  } else {
    // Floor 2: Higher quality, include legendary chance
    items.push(getRandomWeapon(rarityWeights.rare));
    items.push(getRandomWeapon(rarityWeights.epic));
    items.push(getRandomWeapon(rarityWeights.legendary)); // Potential legendary
  }

  // Armor - mix of rarities
  if (floor === 1) {
    // Floor 1: 1 common/rare-weighted, 1 rare/epic-weighted
    items.push(getRandomArmor(rarityWeights.common));
    items.push(getRandomArmor(rarityWeights.rare));
  } else {
    // Floor 2: Higher quality options
    items.push(getRandomArmor(rarityWeights.epic));
    items.push(getRandomArmor(rarityWeights.legendary)); // Potential legendary
  }

  // Relic - use appropriate rarity for floor
  const relicWeights = floor === 1 ? { rare: 0.6, epic: 0.4 } : { rare: 0.4, epic: 0.6 };
  items.push(getRandomRelic(relicWeights));

  // Floor-appropriate potions
  // Floor 1: Only basic Health Potion (max HP is 10)
  // Later floors: Both potions available
  items.push({ ...POTIONS[0] }); // Health Potion (10 HP)
  if (floor > 1) {
    items.push({ ...POTIONS[1] }); // Greater Health Potion (25 HP)
  } else {
    // Add extra Health Potion on floor 1 instead
    items.push({ ...POTIONS[0] });
  }

  // Keys (1-2 keys available, priced based on floor)
  const numKeys = Math.random() < 0.5 ? 1 : 2;
  for (let i = 0; i < numKeys; i++) {
    items.push({
      name: 'Key',
      type: 'key',
      effect: 'Unlocks a locked door',
      value: 30 + (floor - 1) * 10,
      emoji: '🔑'
    });
  }

  return items;
};