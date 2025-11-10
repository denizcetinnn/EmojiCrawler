// Debug utilities for testing
// Access via window.debug in browser console

export const initializeDebugMode = (state, actions) => {
  // Only enable in development
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  window.debug = {
    // Display help
    help() {
      console.log(`
🎮 DEBUG COMMANDS:
=================

RESOURCES:
  debug.gold(amount)           - Add gold
  debug.xp(amount)             - Add XP
  debug.skillPoints(amount)    - Add skill points
  debug.keys(amount)           - Add keys
  debug.heal()                 - Full heal

ITEMS:
  debug.weapon(name)           - Give weapon by name
  debug.armor(name)            - Give armor by name
  debug.relic(name)            - Give relic by name
  debug.allWeapons()           - Get all weapons
  debug.allArmor()             - Get all armor
  debug.allRelics()            - Get all relics

COMBAT:
  debug.enemy(name, count)     - Spawn enemy by name
  debug.boss(name)             - Fight specific boss
  debug.listEnemies()          - Show all Floor 1 enemies
  debug.listFloor2Enemies()    - Show all Floor 2 enemies
  debug.listBosses()           - Show all bosses

STATS:
  debug.levelUp(times)         - Level up X times
  debug.maxStats()             - Max all stats
  debug.stat(stat, value)      - Set stat (str/dex/int/cha)

WORLD:
  debug.floor(number)          - Jump to floor
  debug.revealMap()            - Reveal entire map
  debug.teleport(x, y)         - Teleport to room coords
  debug.clearRoom()            - Mark current room as cleared
  debug.god()                  - Toggle invincibility

STATE:
  debug.player()               - Log player state
  debug.room()                 - Log current room
  debug.enemies()              - Log enemies in combat
  debug.save()                 - Save current state
  debug.export()               - Export save data

Examples:
  debug.gold(1000)
  debug.weapon("Shadowfang Dagger")
  debug.enemy("Arcane Sentinel")
  debug.boss("Infernal Dragon")
  debug.floor(2)
  debug.god()
      `);
    },

    // Resource commands
    gold(amount = 100) {
      state.setPlayer(p => ({ ...p, gold: p.gold + amount }));
      console.log(`✅ Added ${amount} gold`);
    },

    xp(amount = 100) {
      state.setPlayer(p => ({ ...p, xp: p.xp + amount }));
      console.log(`✅ Added ${amount} XP`);
    },

    skillPoints(amount = 5) {
      state.setPlayer(p => ({ ...p, skillPoints: p.skillPoints + amount }));
      console.log(`✅ Added ${amount} skill points`);
    },

    keys(amount = 5) {
      state.setPlayer(p => ({ ...p, keys: p.keys + amount }));
      console.log(`✅ Added ${amount} keys`);
    },

    heal() {
      state.setPlayer(p => ({ ...p, hp: p.maxHp }));
      console.log(`✅ Healed to full HP`);
    },

    // Item commands
    weapon(name) {
      const { WEAPONS } = require('../data/weapons');
      const weapon = WEAPONS.find(w => w.name.toLowerCase().includes(name.toLowerCase()));
      if (weapon) {
        state.setPlayer(p => ({
          ...p,
          inventory: [...p.inventory, { ...weapon, type: 'weapon' }]
        }));
        console.log(`✅ Added ${weapon.name}`);
      } else {
        console.log(`❌ Weapon not found. Try: debug.listWeapons()`);
      }
    },

    armor(name) {
      const { ARMOR } = require('../data/armor');
      const armor = ARMOR.find(a => a.name.toLowerCase().includes(name.toLowerCase()));
      if (armor) {
        state.setPlayer(p => ({
          ...p,
          inventory: [...p.inventory, { ...armor, type: 'armor' }]
        }));
        console.log(`✅ Added ${armor.name}`);
      } else {
        console.log(`❌ Armor not found. Try: debug.listArmor()`);
      }
    },

    relic(name) {
      const { RELICS } = require('../data/relics');
      const relic = RELICS.find(r => r.name.toLowerCase().includes(name.toLowerCase()));
      if (relic) {
        state.setPlayer(p => ({
          ...p,
          relics: [...p.relics, { ...relic }]
        }));
        console.log(`✅ Added ${relic.name}`);
      } else {
        console.log(`❌ Relic not found. Try: debug.listRelics()`);
      }
    },

    listWeapons() {
      const { WEAPONS } = require('../data/weapons');
      console.table(WEAPONS.map(w => ({ name: w.name, rarity: w.rarity, damage: w.damage })));
    },

    listArmor() {
      const { ARMOR } = require('../data/armor');
      console.table(ARMOR.map(a => ({ name: a.name, rarity: a.rarity, defense: a.defense })));
    },

    listRelics() {
      const { RELICS } = require('../data/relics');
      console.table(RELICS.map(r => ({ name: r.name, rarity: r.rarity, effect: r.effect })));
    },

    allWeapons() {
      const { WEAPONS } = require('../data/weapons');
      state.setPlayer(p => ({
        ...p,
        inventory: [...p.inventory, ...WEAPONS.map(w => ({ ...w, type: 'weapon' }))]
      }));
      console.log(`✅ Added all ${WEAPONS.length} weapons`);
    },

    allArmor() {
      const { ARMOR } = require('../data/armor');
      state.setPlayer(p => ({
        ...p,
        inventory: [...p.inventory, ...ARMOR.map(a => ({ ...a, type: 'armor' }))]
      }));
      console.log(`✅ Added all ${ARMOR.length} armor pieces`);
    },

    allRelics() {
      const { RELICS } = require('../data/relics');
      state.setPlayer(p => ({
        ...p,
        relics: [...RELICS.map(r => ({ ...r }))]
      }));
      console.log(`✅ Added all ${RELICS.length} relics`);
    },

    // Combat commands
    enemy(name, count = 1) {
      if (state.gameState !== 'playing') {
        console.log('❌ Must be in exploration mode (not combat or game over)');
        return;
      }

      // Try Floor 1 enemies first
      const { ENEMIES } = require('../data/enemies');
      const { createEnemyInstance } = require('../data/enemies');
      let enemy = ENEMIES.find(e => e.name.toLowerCase().includes(name.toLowerCase()));
      let createInstance = createEnemyInstance;

      // If not found, try Floor 2 enemies
      if (!enemy) {
        const { FLOOR_2_ENEMIES, createFloor2EnemyInstance } = require('../data/floor2Enemies');
        enemy = FLOOR_2_ENEMIES.find(e => e.name.toLowerCase().includes(name.toLowerCase()));
        createInstance = createFloor2EnemyInstance;
      }

      if (enemy) {
        const enemies = [];
        for (let i = 0; i < count; i++) {
          enemies.push(createInstance(enemy));
        }
        actions.startCombat(enemies.length === 1 ? enemies[0] : enemies, false);
        console.log(`✅ Starting combat with ${count}x ${enemy.name}`);
      } else {
        console.log(`❌ Enemy not found. Try: debug.listEnemies() or debug.listFloor2Enemies()`);
      }
    },

    boss(name) {
      if (state.gameState !== 'playing') {
        console.log('❌ Must be in exploration mode (not combat or game over)');
        return;
      }

      // Try Floor 1 bosses first
      const { BOSSES } = require('../data/bosses');
      let boss = BOSSES.find(b => b.name.toLowerCase().includes(name.toLowerCase()));

      // If not found, try Floor 2 bosses
      if (!boss) {
        const { FLOOR_2_BOSSES } = require('../data/floor2Bosses');
        boss = FLOOR_2_BOSSES.find(b => b.name.toLowerCase().includes(name.toLowerCase()));
      }

      if (boss) {
        const bossInstance = { ...boss, hp: boss.maxHp };
        actions.startCombat(bossInstance, true);
        console.log(`✅ Starting boss fight: ${boss.name}`);
      } else {
        console.log(`❌ Boss not found. Try: debug.listBosses()`);
      }
    },

    listEnemies() {
      const { ENEMIES } = require('../data/enemies');
      console.table(ENEMIES.map(e => ({
        name: e.name,
        hp: e.hp,
        damage: e.weapon.damage,
        type: e.type
      })));
    },

    listFloor2Enemies() {
      const { FLOOR_2_ENEMIES } = require('../data/floor2Enemies');
      console.table(FLOOR_2_ENEMIES.map(e => ({
        name: e.name,
        hp: e.hp,
        damage: e.weapon.damage,
        type: e.type
      })));
    },

    listBosses() {
      const { BOSSES } = require('../data/bosses');
      const { FLOOR_2_BOSSES } = require('../data/floor2Bosses');
      const allBosses = [...BOSSES, ...FLOOR_2_BOSSES];
      console.table(allBosses.map(b => ({
        name: b.name,
        floor: BOSSES.includes(b) ? 1 : 2,
        hp: b.hp,
        damage: b.weapon.damage
      })));
    },

    // Stat commands
    levelUp(times = 1) {
      state.setPlayer(p => ({
        ...p,
        level: p.level + times,
        skillPoints: p.skillPoints + (times * 2),
        maxHp: p.maxHp + (times * 2),
        hp: p.maxHp + (times * 2)
      }));
      console.log(`✅ Leveled up ${times} times`);
    },

    maxStats() {
      state.setPlayer(p => ({
        ...p,
        stats: { str: 10, dex: 10, int: 10, cha: 10 }
      }));
      console.log(`✅ Maxed all stats to 10`);
    },

    stat(stat, value) {
      if (!['str', 'dex', 'int', 'cha'].includes(stat)) {
        console.log(`❌ Invalid stat. Use: str, dex, int, or cha`);
        return;
      }
      state.setPlayer(p => ({
        ...p,
        stats: { ...p.stats, [stat]: value }
      }));
      console.log(`✅ Set ${stat.toUpperCase()} to ${value}`);
    },

    // World commands
    floor(number) {
      const { generateFloor } = require('../game/dungeonGenerator');
      const layout = generateFloor(number);
      state.setFloorLayout(layout);
      state.setCurrentFloor(number);
      state.setCurrentRoomPos({ x: 0, y: 0 });
      const startRoom = layout[0];
      startRoom.visited = true;
      console.log(`✅ Jumped to Floor ${number}`);
    },

    revealMap() {
      state.setPlayer(p => ({ ...p, hasMap: true }));
      state.setFloorLayout(layout =>
        layout.map(room => ({ ...room, visited: true }))
      );
      console.log(`✅ Revealed entire map`);
    },

    teleport(x, y) {
      state.setCurrentRoomPos({ x, y });
      const room = state.floorLayout.find(r => r.x === x && r.y === y);
      if (room) {
        room.visited = true;
        console.log(`✅ Teleported to (${x}, ${y})`);
      } else {
        console.log(`❌ No room at (${x}, ${y})`);
      }
    },

    clearRoom() {
      const room = actions.getCurrentRoom();
      if (room) {
        room.cleared = true;
        room.actions = room.actions.map(a => ({ ...a, completed: true }));
        console.log(`✅ Cleared current room`);
      }
    },

    god() {
      if (!window._godMode) {
        window._godMode = true;
        state.setPlayer(p => ({ ...p, maxHp: 99999, hp: 99999 }));
        console.log(`✅ God mode ENABLED - You are invincible!`);
      } else {
        window._godMode = false;
        state.setPlayer(p => ({ ...p, maxHp: 20, hp: 20 }));
        console.log(`❌ God mode DISABLED`);
      }
    },

    // State inspection
    player() {
      console.log('Current Player State:', state.player);
      return state.player;
    },

    room() {
      const room = actions.getCurrentRoom();
      console.log('Current Room:', room);
      return room;
    },

    enemies() {
      if (state.combatState) {
        console.log('Enemies in Combat:', state.combatState.enemies);
        return state.combatState.enemies;
      } else {
        console.log('❌ Not in combat');
      }
    },

    save() {
      const saveData = {
        player: state.player,
        floorLayout: state.floorLayout,
        currentFloor: state.currentFloor,
        currentRoomPos: state.currentRoomPos,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('dungeon_debug_save', JSON.stringify(saveData));
      console.log('✅ Saved current state');
    },

    export() {
      const saveData = {
        player: state.player,
        floorLayout: state.floorLayout,
        currentFloor: state.currentFloor,
        currentRoomPos: state.currentRoomPos,
        timestamp: new Date().toISOString()
      };
      console.log('Save Data:', saveData);
      console.log('Copy this to restore later with debug.import()');
      return saveData;
    }
  };

  console.log(`
🎮 DEBUG MODE ENABLED
Type debug.help() for available commands
  `);
};
