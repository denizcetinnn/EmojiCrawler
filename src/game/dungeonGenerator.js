import { getRandomEnemy } from '../data/enemies';
import { getRandomWeapon } from '../data/weapons';
import { getRandomArmor } from '../data/armor';
import { getRandomRelic } from '../data/relics';
import { getRandomBoss } from '../data/bosses';
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

export const generateFloor = () => {
  const layout = [];
  const startRoom = createStartRoom(0, 0, 'south');
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
  
  while (queue.length > 0 && roomCount < targetRooms) {
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
    
    const room = createRoomByType(roomType, current.x, current.y, current.from);
    layout.push(room);
    generatedRooms.push({ room, depth: current.depth });
    roomCount++;
    
    // Add exits
    const directions = ['north', 'east', 'west'];
    const numExits = Math.random() < 0.6 ? 1 : 2;
    
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
  const boss = getRandomBoss();
  const bossRoom = createBossRoom(furthestRoom.x, furthestRoom.y + 1, 'south', boss);
  
  // Connect boss room to furthest room
  const furthestRoomObj = layout.find(r => r.x === furthestRoom.x && r.y === furthestRoom.y);
  if (furthestRoomObj) {
    furthestRoomObj.exits.north = true;
    bossRoom.exits.south = true;
  }
  
  layout.push(bossRoom);
  
  return layout;
};

const createRoomByType = (type, x, y, from) => {
  switch (type) {
    case 'combat':
      return createCombatRoom(x, y, from, getRandomEnemy());
    case 'treasure':
      return createTreasureRoom(x, y, from, true); // Locked by default
    case 'shop':
      return createShopRoom(x, y, from, generateShopInventory());
    case 'rest':
      return createRestRoom(x, y, from);
    case 'event':
      return createEventRoom(x, y, from);
    default:
      return createCombatRoom(x, y, from, getRandomEnemy());
  }
};

const generateShopInventory = () => {
  const items = [];
  
  const maxRarity = Math.random() < 0.2 ? 5 : 3;
  
  for (let i = 0; i < 3; i++) {
    items.push(getRandomWeapon(maxRarity));
  }
  
  for (let i = 0; i < 2; i++) {
    items.push(getRandomArmor(maxRarity));
  }
  
  items.push(getRandomRelic());
  items.push({ ...POTIONS[0] });
  items.push({ ...POTIONS[1] });
  
  return items;
};