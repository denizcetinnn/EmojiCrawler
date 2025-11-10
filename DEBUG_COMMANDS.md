# Debug Mode Commands

Debug mode is automatically enabled when running in development mode (`npm run dev`).

## How to Use

1. Open your browser's developer console (F12 or Cmd+Option+I)
2. Type `debug.help()` to see all available commands
3. Use any command listed below

## Quick Examples

```javascript
// Give yourself resources
debug.gold(1000)
debug.xp(500)
debug.skillPoints(10)
debug.keys(5)

// Get powerful items
debug.weapon("Shadowfang Dagger")
debug.armor("Demon Plate")
debug.relic("Energy Crystal")

// Test combat
debug.enemy("Arcane Sentinel")
debug.enemy("Goblin", 3)  // Spawn 3 goblins
debug.boss("Infernal Dragon")

// Instant power-up
debug.maxStats()
debug.levelUp(10)
debug.allRelics()

// Testing specific scenarios
debug.floor(2)
debug.teleport(3, 5)
debug.god()  // Toggle invincibility
```

## Command Reference

### Resource Commands

- `debug.gold(amount)` - Add gold (default: 100)
- `debug.xp(amount)` - Add XP (default: 100)
- `debug.skillPoints(amount)` - Add skill points (default: 5)
- `debug.keys(amount)` - Add keys (default: 5)
- `debug.heal()` - Restore HP to full

### Item Commands

- `debug.weapon(name)` - Add weapon by name (partial match works)
- `debug.armor(name)` - Add armor by name (partial match works)
- `debug.relic(name)` - Add relic by name (partial match works)
- `debug.listWeapons()` - Show all available weapons
- `debug.listArmor()` - Show all available armor
- `debug.listRelics()` - Show all available relics
- `debug.allWeapons()` - Add ALL weapons to inventory
- `debug.allArmor()` - Add ALL armor to inventory
- `debug.allRelics()` - Get ALL relics

### Combat Commands

- `debug.enemy(name, count)` - Spawn enemy by name (default count: 1)
- `debug.boss(name)` - Start boss fight with specific boss
- `debug.listEnemies()` - Show all Floor 1 enemies in a table
- `debug.listFloor2Enemies()` - Show all Floor 2 enemies in a table
- `debug.listBosses()` - Show all bosses from both floors

### Character Progression

- `debug.levelUp(times)` - Level up X times (default: 1)
- `debug.maxStats()` - Set all stats to 10
- `debug.stat(stat, value)` - Set specific stat (str/dex/int/cha)

### World Navigation

- `debug.floor(number)` - Jump to specific floor
- `debug.revealMap()` - Reveal entire map and mark all rooms visited
- `debug.teleport(x, y)` - Teleport to room coordinates
- `debug.clearRoom()` - Mark current room as cleared
- `debug.god()` - Toggle invincibility mode

### State Inspection

- `debug.player()` - Log current player state to console
- `debug.room()` - Log current room to console
- `debug.enemies()` - Log enemies in combat (if in combat)
- `debug.save()` - Save current state to localStorage
- `debug.export()` - Export save data (for copying/sharing)

## Common Testing Scenarios

### Test Floor 2 Boss Fight
```javascript
debug.floor(2)
debug.maxStats()
debug.allRelics()
debug.weapon("Shadowfang Dagger")
debug.armor("Demon Plate")
// Now navigate to boss room
```

### Test Shop System
```javascript
debug.gold(10000)
debug.stat('cha', 10)
// Visit a shop and test negotiation
```

### Test Combat Mechanics
```javascript
debug.god()  // Make yourself invincible
debug.allRelics()  // Test all relic effects
debug.maxStats()  // Test max stat combat
debug.enemy("Vampire Lord")  // Fight specific enemy
debug.enemy("Hellhound", 3)  // Test multiple enemies
```

### Test Specific Enemies
```javascript
// Test Arcane Sentinel
debug.enemy("Arcane Sentinel")
debug.god()  // Turn on invincibility for testing

// Test boss fights
debug.boss("Ancient Lich King")
debug.boss("Void Emperor")

// See all available enemies
debug.listEnemies()
debug.listFloor2Enemies()
debug.listBosses()
```

### Test Progression
```javascript
debug.levelUp(20)
debug.skillPoints(50)
// Test skill tree and stat allocation
```

### Quick Recovery During Testing
```javascript
debug.heal()
debug.gold(500)
debug.keys(3)
```

## Notes

- Debug mode is only available in development (`npm run dev`)
- God mode makes you invincible but still shows damage numbers
- All commands are logged to console for confirmation
- Partial name matching works for weapons/armor/relics/enemies/bosses
- You can only spawn enemies when in exploration mode (not during combat)
- Enemy spawning works with both Floor 1 and Floor 2 enemies
- Use count parameter to spawn multiple of the same enemy: `debug.enemy("rat", 5)`
- Use `debug.help()` anytime to see the command list
