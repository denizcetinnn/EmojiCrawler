# Dungeon Crawler - Game Balance Analysis

## 1. CURRENT FLOOR SYSTEM

### Single Floor Architecture
- **Current State**: Game has only ONE floor (Floor 1)
- **Generation**: Procedurally generated using `generateFloor()` from `dungeonGenerator.js`
- **Room Count**: 12-18 rooms per floor
- **Room Connectivity**: Branch-based layout starting from position (0,0)

### Room Types (7 types)
1. **START** - Mandatory first room with initial gear
2. **COMBAT** - Enemy encounters (main content)
3. **TREASURE** - Locked/unlocked loot rooms
4. **SHOP** - Merchant for buying items
5. **REST** - Restore 75% max HP
6. **EVENT** - Non-combat challenges
7. **BOSS** - Final encounter (always at deepest point)

### Room Distribution
- **Combat Rooms**: ~60-70% of floor
- **Shop Rooms**: 1-2 guaranteed
- **Treasure Rooms**: 1-2 guaranteed (locked by default)
- **Rest Rooms**: ~2 rooms
- **Event Rooms**: ~1 room
- **Boss Room**: 1 mandatory

---

## 2. ENEMY STAT PROGRESSION

### Early Game Enemies (Depth 0-3)
| Enemy Name | HP | AP | Weapon | Damage | XP | Gold |
|---|---|---|---|---|---|---|
| Angry Spider | 6 | 2 | Venomous Bite | 2 | 5 | 2 |
| Giant Rat | 8 | 2 | Gnaw | 2 | 6 | 3 |
| Wild Wolf | 10 | 3 | Savage Bite | 3 | 10 | 5 |
| Cave Bat | 5 | 3 | Swooping Bite | 1 | 4 | 1 |
| **Average** | **7.25** | **2.5** | - | **2** | **6.25** | **2.75** |

### Mid Game Enemies (Depth 3-6)
| Enemy Name | HP | AP | Weapon | Damage | XP | Gold |
|---|---|---|---|---|---|---|
| Skeleton Warrior | 14 | 2 | Rusty Blade | 3 | 15 | 8 |
| Goblin Assassin | 12 | 3 | Poisoned Dagger | 2 | 18 | 15 |
| Orc Brute | 18 | 2 | Heavy Club | 4 | 20 | 10 |
| Skeleton Archer | 10 | 2 | Bone Bow (range 4) | 3 | 16 | 8 |
| Corrupted Knight | 25 | 2 | Cursed Sword | 5 | 22 | 12 |
| Fire Imp | 12 | 2 | Flame Bolt (range 3) | 4 | 14 | 7 |
| **Average** | **15.17** | **2.17** | - | **3.5** | **17.5** | **10** |

### Late Game Enemies (Depth 6+)
| Enemy Name | HP | AP | Weapon | Damage | XP | Gold |
|---|---|---|---|---|---|---|
| Dark Mage | 15 | 2 | Dark Bolt (range 3) | 4 | 25 | 20 |
| Berserker | 22 | 3 | Twin Axes | 5 | 30 | 15 |
| Shadow Stalker | 16 | 3 | Shadow Blade | 3 | 28 | 18 |
| Toxic Slime | 20 | 1 | Acid Spray (range 2) | 2 | 15 | 8 |
| Ice Golem | 30 | 1 | Frozen Fist | 4 | 20 | 10 |
| Necromancer | 12 | 2 | Death Bolt (range 4) | 3 | 24 | 15 |
| Venom Spider | 8 | 2 | Poison Fangs | 2 | 8 | 4 |
| **Average** | **17.57** | **2.0** | - | **3.29** | **21.43** | **12.86** |

### Encounter Types
- **Normal** (70%): Single enemy OR duo
- **Swarm** (10-15%): 2-4 weak creatures (Giant Rats, Cave Bats, Spiders)
- **Elite** (10%): Single late-game enemy
- **Duo** (15%): Two enemies working together
- **Ranged/Melee Mix** (10%): Combination of ranged and melee
- **Tank/Support** (special): Defensive + ranged combo

---

## 3. BOSS STATS AND ABILITIES

### Three Bosses (Randomly Selected)

#### The Corrupted Knight
- **HP**: 30 | **AP**: 3 | **Defense**: 3
- **Weapon**: Cursed Greatsword (6 damage, range 2, 2 AP cost)
- **AI**: BOSS personality (defensive precision)
- **Abilities**: heavy_strike
- **Rewards**: 50 XP, 100 Gold
- **Legendary Drop**: Shadow Blade (10 damage, backstab 3x multiplier)

#### The Plague Doctor
- **HP**: 25 | **AP**: 3 | **Defense**: 1
- **Weapon**: Plague Censer (4 damage, range 3, 2 AP cost)
- **AI**: BOSS personality (keeps distance)
- **Abilities**: poison
- **Rewards**: 50 XP, 100 Gold
- **Legendary Drop**: Plague Bow (8 damage, range 5, poisons on hit)

#### The Infernal Warden
- **HP**: 35 | **AP**: 3 | **Defense**: 2
- **Weapon**: Chains of Hell (5 damage, range 2, 2 AP cost)
- **AI**: BOSS personality (relentless)
- **Abilities**: burn
- **Rewards**: 50 XP, 100 Gold
- **Legendary Drop**: Meteor Hammer (9 damage, range 2, AOE radius 1)

### Boss Combat Arena
- **Grid Size**: 10x10 (vs 8x8 for normal)
- **Positioning**: More space for tactical maneuvering
- **Boss HP Range**: 25-35 (vs enemy average of 7-18)

---

## 4. EVENT TYPES AND REWARDS

### Room-Based Events

#### Treasure Rooms
- **Type**: Active loot rooms (can be locked)
- **Actions**:
  - Treasure Chest: Random weapon/armor
  - Gold Pile: 5-15 gold (non-treasure room), varies
  - Relic Pedestal: Random relic (rare/epic)
- **Special**: Requires key to unlock (costs 1 key)

#### Shop Events
- **Inventory**: 3 weapons + 2 armor + 1 relic + potions + keys
- **Rarity Distribution**: Common 50%, Rare 35%, Epic 15%
- **Key Cost**: 30 + (floor - 1) * 10 (currently 30 gold for floor 1)
- **Potion Availability**: Health Potion (10 HP), Greater Health Potion (25 HP on later floors)

#### Rest Events
- **Healing**: 75% of max HP
- **No Cost**: Free action

#### Event Rooms (Abandoned Camp)
- **Skeleton**: Find tattered journal (XP reward)
- **Journal**: 3-8 XP gained
- **Trap**: INT check (DC 3)
  - Success: 15-30 gold
  - Failure: 2 HP damage

#### Combat Events
- **Encounter Variety**:
  - 40% normal single/duo
  - 15% swarm (shallow), 10-15% (deep)
  - 15% duo (shallow), 15% (deep)
  - 10% ranged/melee mix (deep)
  - 10% elite (deep only)

---

## 5. LOOT AND GOLD SCALING

### Gold Rewards
- **Early Enemies**: 1-5 gold (average 2.75)
- **Mid Enemies**: 7-15 gold (average 10)
- **Late Enemies**: 4-20 gold (average 12.86)
- **Bosses**: 100 gold flat
- **Events**: 5-30 gold (trap event, event rooms)

### Item Drops
- **Combat**: Drop rate determined by encounter type
  - Normal combats don't guarantee drops
  - Treasure rooms have guaranteed loot

### Relic Distribution
- **Rarity**: 60% Rare, 40% Epic
- **Sources**: Treasure room pedestals, shop inventory
- **Value Range**: 30-100+ gold (uneconomical to sell)

### Weapon/Armor Progression
- **Common Tier**: 0-30 gold (damage 1-4, defense 1-2)
- **Rare Tier**: 40-100 gold (damage 3-10, defense 2-9, special abilities)
- **Epic Tier**: 90-150 gold (damage 6-9, defense 8-10, advanced abilities)
- **Legendary Tier**: 500 gold (boss-only drops, 9-12 damage)

---

## 6. PLAYER PROGRESSION (Late Game)

### Starting Stats
- **HP**: 10 max (at level 1)
- **AP**: 3 base
- **Stats**: STR 0, DEX 0, INT 0, CHA 0
- **Level**: 1 (no progression system implemented yet)

### Progression Mechanics
- **XP System**: 10 XP per level
  - Enemies drop 4-30 XP
  - Events drop 3-8 XP
  - Boss defeats: 50 XP
- **Leveling**: `level = floor(xp / 10) + 1`
  - Provides +2 skill points per level (not fully implemented)
  - No automatic stat increases

### AP Calculation
```javascript
maxAP = 3 (base)
      + floor(dex / 3)          // +1 AP per 3 DEX
      + armor.apModifier        // -2 to +1 depending on armor
      + relicBonus             // +1 to +2 from relics
      
// Typical: 3-5 AP per turn
```

### Defense Calculation
```javascript
defense = armor.defense + situational_bonuses
// Light armor: 1-3
// Medium armor: 4-6
// Heavy armor: 7-10 (with AP penalty)
```

### Combat Damage Calculation
```javascript
baseDamage = weapon.damage + str + (dex * 0.05 crit_chance)
isCrit = random() < (dex * 0.05)
if isCrit: damage *= 2
```

### Late Game Player Estimates (defeating boss)
- **XP Earned**: ~250-350 XP (level 25-35)
- **Gold Accumulated**: ~400-600 gold
- **Equipment**: Rare/Epic weapons and armor
- **Relics**: 2-4 relics
- **Potions**: 2-4 health potions
- **Stats**: STR +2-4, DEX +2-6, INT +0-2 from relics

---

## 7. WEAPON TIERS AND DAMAGE SCALING

### Weapon Categories

#### Melee Weapons
| Tier | Name | Damage | Range | AP Cost | Notes |
|---|---|---|---|---|---|
| Common | Rusty Dagger | 2 | 1 | 1 | Starting weapon |
| Common | Fists | 1 | 1 | 1 | Fallback weapon |
| Common | Iron Sword | 4 | 1 | 1 | - |
| Rare | War Spear | 3 | 2 | 1 | Extended reach |
| Rare | Rapier | 5 | 1 | 1 | +15% crit |
| Rare | Greataxe | 10 | 1 | 2 | CLEAVE pattern |
| Rare | Scythe | 6 | 1 | 1 | CLEAVE pattern |
| Rare | Dual Blades | 3 | 1 | 1 | Multi-hit 2x |
| Rare | Flail | 7 | 1 | 2 | Armor break |
| Rare | War Hammer | 9 | 1 | 2 | PUSH ability |
| Rare | Kusarigama | 3 | 2 | 1 | PULL ability |
| Rare | Whip | 2 | 2 | 1 | PULL ability |
| Epic | Katana | 6 | 1 | 1 | +20% crit, 2.5x crit mult |
| Legendary | Shadow Blade | 10 | 1 | 2 | 3x backstab mult |

#### Ranged Weapons
| Tier | Name | Damage | Range | AP Cost | Notes |
|---|---|---|---|---|---|
| Common | Short Bow | 3 | 2 | 1 | - |
| Common | Throwing Knives | 2 | 2 | 1 | Multi-hit 3x |
| Common | Sling | 2 | 2 | 1 | - |
| Rare | Crossbow | 5 | 3 | 2 | LINE pattern |
| Rare | Boomerang | 3 | 2 | 1 | Multi-hit 2x |
| Rare | Net Thrower | 1 | 2 | 1 | SLOW ability |
| Epic | Longbow | 6 | 3 | 2 | - |
| Epic | Blunderbuss | 8 | 1 | 2 | CLEAVE at close range |
| Legendary | Plague Bow | 6 | 3 | 2 | Poisons (2 dmg/turn, 3 turns) |

#### Magic Weapons
| Tier | Name | Damage | Range | AP Cost | Pattern | Notes |
|---|---|---|---|---|---|---|
| Rare | Ice Wand | 4 | 2 | 2 | SINGLE | SLOW ability |
| Rare | Fire Staff | 5 | 2 | 2 | CROSS | Fire damage |
| Rare | Poison Orb | 3 | 2 | 2 | SINGLE | Poison 2 dmg/3 turns |
| Rare | Healing Staff | 2 | 2 | 2 | SINGLE | Heal 3 on kill |
| Epic | Lightning Rod | 6 | 3 | 2 | LINE | Chain lightning |
| Epic | Void Staff | 8 | 2 | 2 | SINGLE | Armor ignore |
| Epic | Arcane Tome | 7 | 3 | 3 | AOE | radius 2 |
| Epic | Meteor Staff | 9 | 2 | 3 | AOE | radius 1 |

### Damage Scaling Formula
```javascript
weaponDamage = base_damage + player.str

// With bonuses:
if backstab: weaponDamage *= weapon.backstabMultiplier (1x to 3x)
if crit: weaponDamage *= 2 (+ weapon.critMultiplier bonus)

// Typical late game:
// Base weapon damage: 5-10
// Player STR: 2-4
// Backstab multiplier: 3x (legendary weapon)
// Crit chance: 5-20% (from DEX + relics)
// Max single hit: 60-90 damage (backstab crit with legendary weapon)
```

---

## 8. ARMOR TIERS AND DEFENSE

### Light Armor (No AP penalty or +1 AP)
| Name | Defense | Special | Value |
|---|---|---|---|
| Tattered Cloak | 1 | - | 10 |
| Leather Vest | 2 | - | 25 |
| Scout's Garb | 2 | +1 AP | 40 |
| Shadow Cloak | 3 | Backstab resist -50% | 100 |
| Windwalker Robes | 2 | +1 AP, +15% dodge | 120 |
| Assassin's Garb | 2 | Backstab bonus 1.5x | 110 |
| Acrobat's Suit | 1 | Can't be pushed/pulled | 55 |
| Mage Robes | 2 | +2 magic damage | 65 |

### Medium Armor (Balanced)
| Name | Defense | Special | Value |
|---|---|---|---|
| Chain Mail | 4 | - | 50 |
| Scale Armor | 5 | -1 ranged damage | 70 |
| Battle Plate | 6 | - | 90 |
| Ranger's Mail | 4 | +1 range | 75 |
| Plated Leather | 5 | -1 melee damage | 80 |
| Fire-Resistant Coat | 4 | Fire immune | 95 |

### Heavy Armor (-1 to 0 AP, High Defense)
| Name | Defense | Special | Value |
|---|---|---|---|
| Iron Plate | 7 | -1 AP | 100 |
| Knight's Armor | 8 | Can't be pushed, -1 AP | 150 |
| Crusader Plate | 8 | +2 def vs undead/demon, -1 AP | 170 |
| Dragon Scale Plate | 9 | Fire/Ice immune, 0 AP | 200 |
| Spiked Plate | 7 | Reflect 3 damage, -1 AP | 160 |
| Juggernaut Armor | 10 | Reduce damage 25%, -2 AP | 350 |
| Blessed Aegis | 10 | Regenerate 1 HP/turn, -1 AP | 300 |

---

## 9. RELICS SYSTEM

### Stat Relics
| Name | Effect | Value |
|---|---|---|
| Warrior Ring | +2 STR | 40 |
| Nimble Boots | +2 DEX, +1 AP | 60 |
| Scholar Glasses | +2 INT | 40 |
| Silver Tongue Amulet | +2 CHA | 40 |

### Economic Relics
| Name | Effect | Value |
|---|---|---|
| Lucky Coin | Gold drops +50% | 30 |
| Scholar's Journal | XP +50% | 50 |
| Treasure Map | Reveal locked rooms | 40 |
| Key Ring | +1 key per floor | 45 |

### Combat Relics (Offensive)
| Name | Effect | Value |
|---|---|---|
| Assassin's Mark | Backstab 2x | 80 |
| Critical Ring | +15% crit | 75 |
| Cleaving Pendant | Melee hits adjacent | 85 |
| Executioner's Hood | +50% vs <30% HP | 75 |
| Chain Lightning Pearl | 20% chain to another enemy | 90 |
| Giant's Strength | +3 STR, -1 range | 60 |
| Poison Fang Necklace | Poison all attacks | 85 |
| Berserker Totem | +1 dmg per missing HP (max +10) | 95 |

### Combat Relics (Defensive)
| Name | Effect | Value |
|---|---|---|
| Guardian Amulet | +2 defense | 50 |
| Evasion Charm | +20% dodge | 70 |
| Mirror Shield | Auto-dodge first attack | 90 |
| Thorns Amulet | Reflect 2 damage | 60 |
| Iron Will | Survive one fatal blow at 1 HP | 100 |
| Frozen Heart | Immune to poison/burn | 70 |
| Counterattack Ring | 25% counter on hit | 85 |

### Utility/Positioning Relics
| Name | Effect | Value |
|---|---|---|
| Hawk's Eye | +1 range on weapons | 70 |
| Anchor Boots | Can't be pushed/pulled | 50 |
| Phase Cloak | Move through enemies | 90 |
| Blink Dagger | Teleport 3 tiles (1x/combat) | 100 |
| Vampire Fang | Heal 2 HP per kill | 70 |
| Troll Blood Vial | Regen 1 HP/turn | 60 |
| Second Wind Charm | Restore AP at <30% HP (1x) | 80 |
| Grappling Hook | Pull 2 tiles (ranged only) | 65 |
| Knockback Boots | Push on adjacent move | 55 |
| Shadow Step | Teleport to killed enemy | 90 |
| Battle Standard | +1 dmg per adjacent enemy | 70 |

### High Risk/Reward Relics
| Name | Effect | Value |
|---|---|---|
| Berserker's Rage | +3 dmg at <50% HP | 70 |
| Glass Cannon | +5 dmg, -3 max HP | 80 |
| Gambler's Dice | 50%-150% damage variance | 60 |
| Death Pact | +2 AP, -1 HP/turn | 90 |
| Revenge Token | +3 dmg for 2 turns after hit | 75 |

**Total Relics**: 50+ different relics

---

## 10. SHOP INVENTORY (Floor 1)

### Standard Shop Contents
- 3 random weapons (rarity weighted: 50% common, 35% rare, 15% epic)
- 2 random armor pieces (same rarity weights)
- 1 random relic (60% rare, 40% epic)
- Health Potion (10 HP) - price varies
- Greater Health Potion (25 HP) - floor 2+ only
- 1-2 Keys (30 gold each on floor 1)

### Typical Floor 1 Shop Gold Costs
- Common Weapon: 10-30 gold
- Rare Weapon: 40-100 gold
- Epic Weapon: 90-150 gold
- Health Potion: 20 gold
- Key: 30 gold
- Relic: 40-100 gold

---

## BALANCE SUMMARY FOR SECOND FLOOR DESIGN

### Current Game Statistics (Floor 1)
| Metric | Value |
|---|---|
| Average Enemy HP | 10.5 |
| Average Enemy Damage | 2.8 |
| Average Enemy Gold | 8.5 |
| Boss HP | 25-35 |
| Boss Damage | 4-6 |
| Boss Gold Reward | 100 |
| Player Starting HP | 10 |
| Player Starting AP | 3 |
| Typical Rooms | 12-18 |
| Typical Encounters | 8-12 combat rooms |

### Scaling Factors to Consider for Floor 2
1. **Enemy Scaling**: 1.3x-1.5x HP, 1.2x-1.4x damage
2. **Reward Scaling**: 1.4x-1.6x gold, 1.3x-1.5x XP
3. **Player Progression**: Expect level 15-25, 300-500 gold, rare+ equipment
4. **Difficulty Curve**: Should be challenging but not impossible for geared players
5. **Grid Size**: Consider 8x8 (standard) or 10x10 (larger) for variety
6. **Boss Scaling**: 40-50 HP, 6-7 damage, more complex AI/abilities

