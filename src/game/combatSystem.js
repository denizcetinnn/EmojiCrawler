// Grid-based tactical combat system
// Manages combat state, actions, damage calculation, and turn flow

import {
  initializeCombatGrid,
  getPlayerStartPosition,
  getEnemyStartPosition,
  isInRange,
  getValidMoves,
  isBackstab,
  isFlank,
  getDistance,
  getDirection,
  DIRECTIONS,
  GRID_SIZE_NORMAL,
  GRID_SIZE_BOSS,
  getPushDestination,
  getAdjacentPositions,
  getCrossPositions,
  getRadiusPositions,
  updateFacing,
} from './gridCombat.js';
import { makeEnemyDecision } from './combatAI.js';
import { FISTS, ATTACK_PATTERNS } from '../data/weapons.js';
import {
  calculateRelicAPBonus,
  hasRelicOfType,
  applyRelicDamageModifiers,
} from '../data/relics.js';
import { getArmorAPModifier, preventsPushPull } from '../data/armor.js';
import { processStatusEffects, applyStatusEffect } from '../data/enemies.js';

// Initialize combat state
export function initializeCombat(player, enemies, isBoss = false) {
  const gridSize = isBoss ? GRID_SIZE_BOSS : GRID_SIZE_NORMAL;
  const { grid } = initializeCombatGrid(isBoss);

  // Ensure enemies is an array
  if (!Array.isArray(enemies)) {
    enemies = [enemies];
  }

  // Filter out any invalid enemies
  enemies = enemies.filter(e => e && e.name && e.hp > 0);

  if (enemies.length === 0) {
    console.error('No valid enemies provided to initializeCombat');
    return null;
  }

  // Determine enemy type for positioning
  const enemyType = enemies[0]?.spawnType || 'aggressive';

  // Position player
  const playerPos = getPlayerStartPosition(gridSize, enemyType);
  grid[playerPos.y][playerPos.x].occupied = 'player';

  // Position enemies
  enemies.forEach((enemy, index) => {
    // Ensure enemy has a valid weapon
    if (!enemy.weapon || !enemy.weapon.damage || !enemy.weapon.range || !enemy.weapon.apCost) {
      console.warn(`Enemy ${enemy.name} has invalid weapon, using default`);
      enemy.weapon = {
        name: 'Attack',
        damage: 3,
        range: 1,
        apCost: 1,
      };
    }

    // Ensure enemy has valid stats
    if (!enemy.ap || enemy.ap < 1) {
      enemy.ap = 2;
    }
    if (!enemy.maxHp || enemy.maxHp < 1) {
      enemy.maxHp = enemy.hp || 10;
    }

    const enemyPos = getEnemyStartPosition(gridSize, enemyType, index);
    enemy.position = enemyPos;
    enemy.facing = DIRECTIONS.west; // Start facing player
    enemy.currentAP = enemy.ap; // Initialize current AP
    grid[enemyPos.y][enemyPos.x].occupied = enemy.id;
  });

  // Calculate player's max AP
  const baseAP = 3;
  const dexBonus = Math.floor(player.stats.dex / 3); // +1 AP per 3 DEX
  const armorMod = getArmorAPModifier(player.equipment.armor);
  const relicBonus = calculateRelicAPBonus(player.relics || []);
  const maxAP = baseAP + dexBonus + armorMod + relicBonus;

  // Get equipped weapons
  const weapon1 = player.equipment.weapon1 || FISTS;
  const weapon2 = player.equipment.weapon2 || null;

  const combatState = {
    grid,
    gridSize,
    player: {
      ...player,
      position: playerPos,
      facing: DIRECTIONS.east, // Start facing right
      currentAP: maxAP,
      maxAP,
      weapon1,
      weapon2,
      // Weapon is weapon1 for backwards compatibility
      weapon: weapon1,
    },
    enemies,
    enemiesDefeated: [], // Track defeated enemies for rewards
    turn: 'player',
    log: [],
    turnCount: 0,
    combatActive: true,
    firstAttackUsed: false, // Track if first attack has been made (for first_strike_immunity relic)
    lastStandUsed: false, // Track if last stand has been used (for last_stand relic)
    secondWindUsed: false, // Track if second wind has been used (for second_wind relic)
    revengeTurnsLeft: 0, // Track revenge buff duration
    blinkDaggerUsed: false, // Track if Blink Dagger has been used this combat
    teleportMode: false, // Track if player is selecting teleport destination
  };

  // Add initial log message
  addLog(combatState, '⚔️ Combat begins!');

  return combatState;
}

// Add message to combat log
function addLog(state, message) {
  state.log.push({
    message,
    timestamp: Date.now(),
  });
}

// Process player movement action
export function processPlayerMove(state, direction) {
  const player = state.player;

  if (player.currentAP < 1) {
    return { success: false, message: 'Not enough AP!' };
  }

  const newPos = {
    x: player.position.x + direction.dx,
    y: player.position.y + direction.dy,
  };

  // Check if position is valid and walkable
  if (
    newPos.x < 0 ||
    newPos.x >= state.gridSize ||
    newPos.y < 0 ||
    newPos.y >= state.gridSize
  ) {
    return { success: false, message: 'Cannot move there!' };
  }

  const tile = state.grid[newPos.y][newPos.x];

  // Check if tile is occupied (unless player has phase cloak)
  if (tile.occupied && !hasRelicOfType(player.relics, 'phasing')) {
    return { success: false, message: 'Tile is occupied!' };
  }

  // Knockback Boots - push adjacent enemies when moving
  const knockbackRelic = player.relics?.find(r => r.type === 'knockback_move');
  if (knockbackRelic) {
    const adjacentToNew = getAdjacentPositions(newPos);
    adjacentToNew.forEach(pos => {
      const enemy = state.enemies.find(e => e.position.x === pos.x && e.position.y === pos.y && e.hp > 0);
      if (enemy) {
        const pushDest = getPushDestination(newPos, enemy.position, 1);
        if (
          pushDest.x >= 0 &&
          pushDest.x < state.gridSize &&
          pushDest.y >= 0 &&
          pushDest.y < state.gridSize &&
          !state.grid[pushDest.y][pushDest.x].occupied
        ) {
          state.grid[enemy.position.y][enemy.position.x].occupied = null;
          state.grid[pushDest.y][pushDest.x].occupied = enemy.id;
          enemy.position = pushDest;
          addLog(state, `You shove ${enemy.name} away!`);
        }
      }
    });
  }

  // Update grid
  state.grid[player.position.y][player.position.x].occupied = null;
  state.grid[newPos.y][newPos.x].occupied = 'player';

  // Update player position and facing
  player.position = newPos;
  player.facing = direction;

  // Check for Coward's Charm - bonus AP when fleeing from adjacent enemy
  const cowardRelic = player.relics?.find(r => r.type === 'retreat');
  if (cowardRelic) {
    const oldAdjacentEnemies = getAdjacentPositions({x: player.position.x - direction.dx, y: player.position.y - direction.dy});
    const hadAdjacentEnemy = oldAdjacentEnemies.some(pos => {
      return state.enemies.some(e => e.position.x === pos.x && e.position.y === pos.y && e.hp > 0);
    });

    const newAdjacentEnemies = getAdjacentPositions(newPos);
    const hasAdjacentEnemy = newAdjacentEnemies.some(pos => {
      return state.enemies.some(e => e.position.x === pos.x && e.position.y === pos.y && e.hp > 0);
    });

    // If we had an adjacent enemy before moving but don't now, we're fleeing
    if (hadAdjacentEnemy && !hasAdjacentEnemy) {
      player.currentAP += (cowardRelic.apBonus || 1);
      addLog(state, 'You flee! Coward\'s Charm grants bonus AP!');
    }
  }

  player.currentAP -= 1;

  addLog(state, `You move ${direction.name}.`);

  return { success: true, state };
}

// Process player attack action
export function processPlayerAttack(state, targetEnemy, selectedWeapon = null) {
  const player = state.player;

  // Use selected weapon, or default to weapon1/weapon
  const weapon = selectedWeapon || player.weapon1 || player.weapon || FISTS;

  if (player.currentAP < weapon.apCost) {
    return { success: false, message: `Not enough AP! Need ${weapon.apCost}.` };
  }

  // Check if target is in range
  const rangeBonus = hasRelicOfType(player.relics, 'range')
    ? player.relics.find(r => r.type === 'range').rangeBonus
    : 0;

  // Giant's Strength - reduces weapon range
  const giantRelic = player.relics?.find(r => r.type === 'stat_penalty');
  const rangePenalty = giantRelic ? (giantRelic.rangeReduction || 0) : 0;

  const effectiveRange = Math.max(1, weapon.range + rangeBonus - rangePenalty);

  if (!isInRange(player.position, targetEnemy.position, effectiveRange)) {
    return { success: false, message: 'Target out of range!' };
  }

  // Update facing toward target
  updateFacing(player, targetEnemy.position);

  // Consume AP
  player.currentAP -= weapon.apCost;

  // Determine affected enemies based on weapon pattern
  const affectedEnemies = getAffectedEnemies(state, weapon, player.position, targetEnemy.position);

  let totalDamage = 0;
  let primaryTarget = targetEnemy;
  let primaryDamage = 0;
  const defeatedEnemies = [];

  // Apply damage to all affected enemies
  affectedEnemies.forEach((enemy, index) => {
    const damageResult = calculateCombatDamage(player, enemy, weapon, state);
    enemy.hp -= damageResult.finalDamage;
    totalDamage += damageResult.finalDamage;

    // Track primary target (the one clicked on)
    if (enemy.id === targetEnemy.id) {
      primaryDamage = damageResult.finalDamage;

      // Add to log for primary target
      let logMessage = `You attack ${enemy.name} with ${weapon.name} for ${damageResult.finalDamage} damage`;
      if (damageResult.isCrit) logMessage += ' (CRIT!)';
      if (damageResult.isBackstab) logMessage += ' (BACKSTAB!)';
      logMessage += '!';
      addLog(state, logMessage);
    } else {
      // Secondary targets
      addLog(state, `${enemy.name} takes ${damageResult.finalDamage} damage!`);
    }

    // Apply weapon special effects
    applyWeaponEffects(state, weapon, player, enemy, damageResult);

    // Apply relic effects (poison_all, cleave, etc.)
    applyRelicCombatEffects(state, player, enemy);

    // Grappling Hook - pull ranged enemies closer
    const grappleRelic = player.relics?.find(r => r.type === 'pull_ranged');
    if (grappleRelic && weapon.range > 1) {
      const distance = getDistance(player.position, enemy.position);
      if (distance > 1 && enemy.hp > 0) {
        const pullDist = Math.min(grappleRelic.pullDistance || 2, distance - 1);
        for (let i = 0; i < pullDist; i++) {
          const direction = {
            dx: Math.sign(player.position.x - enemy.position.x),
            dy: Math.sign(player.position.y - enemy.position.y),
          };
          const pullDest = {
            x: enemy.position.x + direction.dx,
            y: enemy.position.y + direction.dy,
          };
          if (
            pullDest.x >= 0 &&
            pullDest.x < state.gridSize &&
            pullDest.y >= 0 &&
            pullDest.y < state.gridSize &&
            !state.grid[pullDest.y][pullDest.x].occupied
          ) {
            state.grid[enemy.position.y][enemy.position.x].occupied = null;
            state.grid[pullDest.y][pullDest.x].occupied = enemy.id;
            enemy.position = pullDest;
          } else {
            break; // Stop if blocked
          }
        }
        addLog(state, `You pull ${enemy.name} closer!`);
      }
    }

    // Check if enemy died
    if (enemy.hp <= 0) {
      defeatedEnemies.push(enemy);
    }
  });

  // Chain Lightning - chance to hit another enemy
  const chainRelic = player.relics?.find(r => r.type === 'chain');
  if (chainRelic && Math.random() < chainRelic.chainChance) {
    const aliveEnemies = state.enemies.filter(e => e.hp > 0 && !affectedEnemies.includes(e));
    if (aliveEnemies.length > 0) {
      const chainTarget = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      const chainDamage = Math.floor(primaryDamage / 2);
      chainTarget.hp -= chainDamage;
      addLog(state, `Lightning chains to ${chainTarget.name} for ${chainDamage} damage!`);
      if (chainTarget.hp <= 0) {
        defeatedEnemies.push(chainTarget);
      }
    }
  }

  // Handle defeated enemies
  defeatedEnemies.forEach(enemy => {
    addLog(state, `${enemy.name} is defeated!`);
    handleEnemyDefeat(state, enemy);
  });

  return {
    success: true,
    state,
    damage: primaryDamage,
    totalDamage,
    affectedCount: affectedEnemies.length,
    animation: {
      type: 'attack',
      attacker: 'player',
      target: primaryTarget,
      weapon,
      isCrit: false, // Could track this per target
      isBackstab: false,
      enemyDied: defeatedEnemies.some(e => e.id === targetEnemy.id),
      affectedEnemies: affectedEnemies.map(e => e.id),
    },
  };
}

// Get all enemies affected by an attack based on weapon pattern
function getAffectedEnemies(state, weapon, attackerPos, targetPos) {
  const pattern = weapon.pattern || ATTACK_PATTERNS.SINGLE;
  const affected = [];

  // Always include the primary target
  const primaryTarget = state.enemies.find(
    e => e.position.x === targetPos.x && e.position.y === targetPos.y
  );
  if (primaryTarget) {
    affected.push(primaryTarget);
  }

  switch (pattern) {
    case ATTACK_PATTERNS.SINGLE:
      // Only primary target
      break;

    case ATTACK_PATTERNS.CLEAVE:
      // Target + adjacent enemies to attacker (melee sweep)
      const adjacentToAttacker = getAdjacentPositions(attackerPos);
      adjacentToAttacker.forEach(pos => {
        const enemy = state.enemies.find(
          e => e.position.x === pos.x && e.position.y === pos.y && !affected.includes(e)
        );
        if (enemy) affected.push(enemy);
      });
      break;

    case ATTACK_PATTERNS.AOE:
      // All enemies within radius of target
      const radius = weapon.aoeRadius || 1;
      const aoePositions = getRadiusPositions(targetPos, radius);
      aoePositions.forEach(pos => {
        const enemy = state.enemies.find(
          e => e.position.x === pos.x && e.position.y === pos.y && !affected.includes(e)
        );
        if (enemy) affected.push(enemy);
      });
      break;

    case ATTACK_PATTERNS.CROSS:
      // Enemies in cross pattern around target
      const crossPositions = getCrossPositions(targetPos, 1);
      crossPositions.forEach(pos => {
        const enemy = state.enemies.find(
          e => e.position.x === pos.x && e.position.y === pos.y && !affected.includes(e)
        );
        if (enemy) affected.push(enemy);
      });
      break;

    case ATTACK_PATTERNS.LINE:
      // All enemies in straight line from attacker to edge of range
      const direction = getDirection(attackerPos, targetPos);
      if (direction) {
        let currentPos = { ...attackerPos };
        for (let i = 0; i < weapon.range; i++) {
          currentPos = {
            x: currentPos.x + direction.dx,
            y: currentPos.y + direction.dy,
          };

          // Check if position is valid
          if (
            currentPos.x < 0 || currentPos.x >= state.gridSize ||
            currentPos.y < 0 || currentPos.y >= state.gridSize
          ) {
            break;
          }

          const enemy = state.enemies.find(
            e => e.position.x === currentPos.x && e.position.y === currentPos.y && !affected.includes(e)
          );
          if (enemy) affected.push(enemy);
        }
      }
      break;
  }

  return affected;
}

// Calculate damage for combat attacks
function calculateCombatDamage(attacker, defender, weapon, state) {
  let damage = weapon.damage + (attacker.stats.str || 0);

  // Glass Cannon - bonus damage
  const glassCannonRelic = attacker.relics?.find(r => r.type === 'glass_cannon');
  if (glassCannonRelic) {
    damage += glassCannonRelic.damageBonus || 5;
  }

  // Rage - damage per missing HP
  const rageRelic = attacker.relics?.find(r => r.type === 'rage');
  if (rageRelic) {
    const missingHP = attacker.maxHp - attacker.hp;
    const rageBonus = Math.min(missingHP * rageRelic.damagePerMissingHP, rageRelic.maxBonus);
    damage += rageBonus;
  }

  // Revenge Token - bonus damage after taking damage
  if (state.revengeTurnsLeft > 0) {
    const revengeRelic = attacker.relics?.find(r => r.type === 'revenge');
    if (revengeRelic) {
      damage += revengeRelic.damageBonus || 3;
    }
  }

  // Battle Standard - bonus damage for each nearby enemy
  const battleStandardRelic = attacker.relics?.find(r => r.type === 'surrounded_bonus');
  if (battleStandardRelic) {
    const nearbyRange = battleStandardRelic.range || 2;
    const nearbyEnemies = state.enemies.filter(e => {
      const distance = getDistance(attacker.position, e.position);
      return e.hp > 0 && distance <= nearbyRange;
    });
    const bonusDamage = nearbyEnemies.length * (battleStandardRelic.damagePerEnemy || 1);
    damage += bonusDamage;
  }

  // Check for backstab
  const isBack = isBackstab(attacker.position, defender.position, defender.facing);
  const hasBackstabRelic = hasRelicOfType(attacker.relics, 'backstab');

  // Check for crit
  let baseCritChance = (attacker.stats.dex || 0) * 0.05; // 5% per DEX
  if (weapon.critBonus) {
    baseCritChance += weapon.critBonus;
  }
  if (hasRelicOfType(attacker.relics, 'crit')) {
    baseCritChance += attacker.relics.find(r => r.type === 'crit').critBonus;
  }
  const isCrit = Math.random() < baseCritChance;

  // Apply crit multiplier
  if (isCrit) {
    damage *= 2;
  }

  // Apply relic modifiers (includes backstab multiplier)
  const playerHpPercent = attacker.hp / attacker.maxHp;
  damage = applyRelicDamageModifiers(damage, attacker.relics || [], {
    isBackstab: isBack && hasBackstabRelic,
    isCrit,
    playerHpPercent,
  });

  // Apply weapon backstab multiplier if it has one
  if (isBack && weapon.backstabMultiplier) {
    damage *= weapon.backstabMultiplier;
  }

  // Execute - bonus damage to low HP enemies
  const executeRelic = attacker.relics?.find(r => r.type === 'execute');
  if (executeRelic && (defender.hp / defender.maxHp) < executeRelic.hpThreshold) {
    damage *= (1 + executeRelic.damageBonus);
  }

  // Random damage (Gambler's Dice)
  const randomRelic = attacker.relics?.find(r => r.type === 'random_damage');
  if (randomRelic) {
    const multiplier = randomRelic.minMultiplier + Math.random() * (randomRelic.maxMultiplier - randomRelic.minMultiplier);
    damage *= multiplier;
  }

  // Apply defender's defense
  const defense = defender.defense || 0;
  const finalDamage = Math.max(1, Math.floor(damage - defense)); // Minimum 1 damage

  return {
    finalDamage,
    isCrit,
    isBackstab: isBack && (hasBackstabRelic || weapon.backstabMultiplier),
    baseDamage: damage,
  };
}

// Apply weapon special effects (poison, slow, push, etc.)
function applyWeaponEffects(state, weapon, attacker, target, damageResult) {
  if (!weapon.specialAbility) return;

  switch (weapon.specialAbility) {
    case 'poison':
      applyStatusEffect(target, {
        type: 'poison',
        damage: weapon.poisonDamage || 2,
        duration: weapon.poisonDuration || 3,
      });
      addLog(state, `${target.name} is poisoned!`);
      break;

    case 'slow':
      applyStatusEffect(target, {
        type: 'slow',
        duration: 2,
      });
      addLog(state, `${target.name} is slowed!`);
      break;

    case 'push':
      const pushDest = getPushDestination(attacker.position, target.position, 1);
      if (
        pushDest.x >= 0 &&
        pushDest.x < state.gridSize &&
        pushDest.y >= 0 &&
        pushDest.y < state.gridSize &&
        !state.grid[pushDest.y][pushDest.x].occupied
      ) {
        // Update grid
        state.grid[target.position.y][target.position.x].occupied = null;
        state.grid[pushDest.y][pushDest.x].occupied = target.id;
        target.position = pushDest;
        addLog(state, `${target.name} is knocked back!`);
      }
      break;

    case 'pull':
      // Similar to push but toward attacker
      const distance = getDistance(attacker.position, target.position);
      if (distance > 1) {
        const direction = {
          dx: Math.sign(attacker.position.x - target.position.x),
          dy: Math.sign(attacker.position.y - target.position.y),
        };
        const pullDest = {
          x: target.position.x + direction.dx,
          y: target.position.y + direction.dy,
        };
        if (
          pullDest.x >= 0 &&
          pullDest.x < state.gridSize &&
          pullDest.y >= 0 &&
          pullDest.y < state.gridSize &&
          !state.grid[pullDest.y][pullDest.x].occupied
        ) {
          state.grid[target.position.y][target.position.x].occupied = null;
          state.grid[pullDest.y][pullDest.x].occupied = target.id;
          target.position = pullDest;
          addLog(state, `${target.name} is pulled closer!`);
        }
      }
      break;
  }
}

// Handle enemy defeat
function handleEnemyDefeat(state, enemy) {
  const enemyPos = { ...enemy.position };

  // Clear from grid
  state.grid[enemy.position.y][enemy.position.x].occupied = null;

  // Add to defeated enemies list for rewards
  state.enemiesDefeated.push({ ...enemy });

  // Remove from enemies array
  state.enemies = state.enemies.filter(e => e.id !== enemy.id);

  // Apply lifesteal relic
  const lifestealRelic = state.player.relics?.find(r => r.type === 'lifesteal');
  if (lifestealRelic) {
    const healAmount = lifestealRelic.healPerKill;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmount);
    addLog(state, `You heal for ${healAmount} HP!`);
  }

  // Shadow Step - teleport to killed enemy
  const shadowStepRelic = state.player.relics?.find(r => r.type === 'kill_teleport');
  if (shadowStepRelic && !state.grid[enemyPos.y][enemyPos.x].occupied) {
    // Clear player's current position
    state.grid[state.player.position.y][state.player.position.x].occupied = null;
    // Move player to enemy's position
    state.player.position = enemyPos;
    state.grid[enemyPos.y][enemyPos.x].occupied = 'player';
    addLog(state, 'You vanish and reappear at the fallen enemy!');
  }

  // Check if combat is over
  if (state.enemies.length === 0) {
    state.combatActive = false;
    addLog(state, '⭐ Victory!');
  }
}

// End player turn and start enemy turns
export function endPlayerTurn(state) {
  // Second Wind - restore full AP when below threshold (once per combat)
  const secondWindRelic = state.player.relics?.find(r => r.type === 'second_wind');
  if (secondWindRelic && !state.secondWindUsed) {
    const hpPercent = state.player.hp / state.player.maxHp;
    if (hpPercent < secondWindRelic.hpThreshold) {
      state.secondWindUsed = true;
      state.player.currentAP = state.player.maxAP;
      addLog(state, 'Second Wind activates! Full AP restored!');
      return state; // Don't reset AP normally if Second Wind triggered
    }
  }

  // Reset player AP for next turn
  state.player.currentAP = state.player.maxAP;

  // Death Pact - lose HP per turn for bonus AP
  const deathPactRelic = state.player.relics?.find(r => r.type === 'life_drain_ap');
  if (deathPactRelic) {
    const hpCost = deathPactRelic.hpCostPerTurn || 1;
    state.player.hp = Math.max(1, state.player.hp - hpCost); // Never kill player with this
    addLog(state, `Death Pact drains ${hpCost} HP.`);
  }

  // Apply regeneration relics
  const regenRelic = state.player.relics?.find(r => r.type === 'regeneration');
  if (regenRelic) {
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + regenRelic.healPerTurn);
    addLog(state, `You regenerate ${regenRelic.healPerTurn} HP.`);
  }

  // Process armor regeneration
  if (state.player.equipment.armor?.healPerTurn) {
    const heal = state.player.equipment.armor.healPerTurn;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
    addLog(state, `Your armor regenerates ${heal} HP.`);
  }

  // Decrement revenge buff duration
  if (state.revengeTurnsLeft > 0) {
    state.revengeTurnsLeft--;
    if (state.revengeTurnsLeft === 0) {
      addLog(state, 'Your rage subsides.');
    }
  }

  // Switch to enemy turn
  state.turn = 'enemy';
  state.turnCount++;

  addLog(state, '--- Enemy Turn ---');

  return state;
}

// Process all enemy turns
export async function processEnemyTurns(state, onUpdate) {
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;

    // Reset enemy AP for their turn
    enemy.currentAP = enemy.ap;

    // Process status effects
    const statusResults = processStatusEffects(enemy);
    if (statusResults && statusResults.length > 0) {
      statusResults.forEach(result => addLog(state, result.message));
    }

    // Check if enemy died from status
    if (enemy.hp <= 0) {
      addLog(state, `${enemy.name} succumbs to status effects!`);
      handleEnemyDefeat(state, enemy);
      continue;
    }

    // Make AI decision
    const actions = makeEnemyDecision(
      enemy,
      state.player,
      state.enemies,
      state.grid,
      state.gridSize
    );

    // Execute actions
    for (const action of actions) {
      await executeEnemyAction(state, enemy, action);

      // Update callback for UI
      if (onUpdate) {
        onUpdate({ ...state });
      }

      // Small delay between actions
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Start new player turn (only if player is alive)
  if (state.player.hp > 0) {
    state.turn = 'player';
    addLog(state, '--- Your Turn ---');
  } else {
    // Player died during enemy turn
    addLog(state, 'You have been defeated!');
  }

  return state;
}

// Execute single enemy action
async function executeEnemyAction(state, enemy, action) {
  switch (action.type) {
    case 'move':
      // Update grid
      state.grid[enemy.position.y][enemy.position.x].occupied = null;
      state.grid[action.to.y][action.to.x].occupied = enemy.id;
      enemy.position = action.to;
      addLog(state, `${enemy.name} moves.`);
      break;

    case 'attack':
      // Update facing
      updateFacing(enemy, state.player.position);

      // Check for first strike immunity
      const relics = state.player.relics || [];
      const firstStrikeRelic = relics.find(r => r.type === 'first_strike_immunity');
      if (firstStrikeRelic && !state.firstAttackUsed) {
        state.firstAttackUsed = true;
        addLog(state, `${enemy.name}'s attack is blocked by Mirror Shield!`);
        break;
      }

      // Check for dodge chance
      const dodgeRelic = relics.find(r => r.type === 'dodge');
      const dodgeChance = dodgeRelic ? dodgeRelic.dodgeBonus || 0.2 : 0;
      if (Math.random() < dodgeChance) {
        addLog(state, `You dodge ${enemy.name}'s attack!`);
        break;
      }

      // Calculate damage
      let damage = calculateEnemyAttackDamage(
        enemy,
        state.player,
        state
      );

      // Last Stand - survive at 1 HP
      const lastStandRelic = relics.find(r => r.type === 'last_stand');
      if (lastStandRelic && !state.lastStandUsed && state.player.hp - damage <= 0) {
        state.lastStandUsed = true;
        state.player.hp = 1;
        addLog(state, `${enemy.name} attacks! Iron Will prevents your death - you survive with 1 HP!`);
        break;
      }

      // Apply damage (unless god mode is active)
      if (!window._godMode) {
        state.player.hp -= damage;
      }

      addLog(state, `${enemy.name} attacks for ${damage} damage!${window._godMode ? ' (GOD MODE - No damage taken)' : ''}`);

      // Smoke Bomb - chance to teleport when hit
      const smokeBombRelic = relics.find(r => r.type === 'evasive_teleport');
      if (smokeBombRelic && Math.random() < smokeBombRelic.dodgeChance) {
        const teleportRange = smokeBombRelic.teleportRange || 2;
        const validTeleports = [];

        // Find valid teleport positions
        for (let dx = -teleportRange; dx <= teleportRange; dx++) {
          for (let dy = -teleportRange; dy <= teleportRange; dy++) {
            if (dx === 0 && dy === 0) continue;
            const newPos = {
              x: state.player.position.x + dx,
              y: state.player.position.y + dy,
            };
            if (
              newPos.x >= 0 &&
              newPos.x < state.gridSize &&
              newPos.y >= 0 &&
              newPos.y < state.gridSize &&
              !state.grid[newPos.y][newPos.x].occupied
            ) {
              validTeleports.push(newPos);
            }
          }
        }

        if (validTeleports.length > 0) {
          const teleportDest = validTeleports[Math.floor(Math.random() * validTeleports.length)];
          state.grid[state.player.position.y][state.player.position.x].occupied = null;
          state.grid[teleportDest.y][teleportDest.x].occupied = 'player';
          state.player.position = teleportDest;
          addLog(state, 'You vanish in a puff of smoke!');
        }
      }

      // Revenge Token - activate after taking damage
      const revengeRelic = relics.find(r => r.type === 'revenge');
      if (revengeRelic) {
        state.revengeTurnsLeft = revengeRelic.duration || 2;
        addLog(state, 'Rage fills you! Damage increased!');
      }

      // Counter - chance to immediately counter
      const counterRelic = relics.find(r => r.type === 'counter');
      if (counterRelic && Math.random() < counterRelic.counterChance) {
        const counterDamage = Math.floor((state.player.weapon1?.damage || 2) / 2);
        enemy.hp -= counterDamage;
        addLog(state, `You counter for ${counterDamage} damage!`);
        if (enemy.hp <= 0) {
          addLog(state, `${enemy.name} is defeated by counter!`);
          handleEnemyDefeat(state, enemy);
          break;
        }
      }

      // Add enemy attack animation
      const enemyAnimType = getEnemyAttackAnimationType(enemy);
      const enemyAnimEmoji = getEnemyAttackEmoji(enemy);
      const midX = (enemy.position.x + state.player.position.x) / 2;
      const midY = (enemy.position.y + state.player.position.y) / 2;

      state.pendingAnimation = {
        type: enemyAnimType,
        emoji: enemyAnimEmoji,
        gridPosition: { x: midX, y: midY },
        fromGrid: { x: enemy.position.x, y: enemy.position.y },
        toGrid: { x: state.player.position.x, y: state.player.position.y },
        duration: 500,
      };

      // Apply thorns damage
      const thornsRelic = state.player.relics?.find(r => r.type === 'thorns');
      const thornsArmor = state.player.equipment.armor?.reflectDamage;
      const totalThorns = (thornsRelic?.reflectDamage || 0) + (thornsArmor || 0);

      if (totalThorns > 0 && getDistance(enemy.position, state.player.position) <= 1) {
        enemy.hp -= totalThorns;
        addLog(state, `${enemy.name} takes ${totalThorns} thorns damage!`);
        if (enemy.hp <= 0) {
          addLog(state, `${enemy.name} is defeated by thorns!`);
          handleEnemyDefeat(state, enemy);
        }
      }

      // Check if player died
      if (state.player.hp <= 0) {
        state.combatActive = false;
        addLog(state, '💀 You have been defeated!');
      }
      break;

    case 'push':
      // Push player
      const pushDest = getPushDestination(enemy.position, state.player.position, 1);
      if (
        !preventsPushPull(state.player.equipment.armor) &&
        !hasRelicOfType(state.player.relics, 'immovable') &&
        pushDest.x >= 0 &&
        pushDest.x < state.gridSize &&
        pushDest.y >= 0 &&
        pushDest.y < state.gridSize &&
        !state.grid[pushDest.y][pushDest.x].occupied
      ) {
        state.grid[state.player.position.y][state.player.position.x].occupied = null;
        state.grid[pushDest.y][pushDest.x].occupied = 'player';
        state.player.position = pushDest;
        addLog(state, `${enemy.name} pushes you back!`);
      } else {
        addLog(state, `${enemy.name} tries to push you, but you stand firm!`);
      }
      break;

    case 'defend':
      addLog(state, `${enemy.name} defends.`);
      break;

    case 'special':
      addLog(state, `${enemy.name} uses ${action.ability}!`);
      // Handle special abilities here
      break;
  }
}

// Calculate enemy attack damage
function calculateEnemyAttackDamage(enemy, player, state) {
  let damage = enemy.weapon.damage;

  // Check if backstab
  const isBack = isBackstab(enemy.position, player.position, player.facing);
  if (isBack && enemy.backstabMultiplier) {
    damage *= enemy.backstabMultiplier;
    addLog(state, `${enemy.name} backstabs you!`);
  }

  // Apply player's armor
  const armorDefense = player.equipment.armor?.defense || 0;

  // Check for defense bonuses from relics
  const defenseRelic = player.relics?.find(r => r.type === 'defense');
  const totalDefense = armorDefense + (defenseRelic?.defenseBonus || 0);

  // Calculate final damage
  const finalDamage = Math.max(1, Math.floor(damage - totalDefense));

  return finalDamage;
}

// Get available actions for player
export function getAvailableActions(state) {
  const player = state.player;
  const actions = {
    canMove: player.currentAP >= 1,
    canAttack: player.currentAP >= player.weapon.apCost,
    canEndTurn: true,
    validMoves: getValidMoves(state.grid, player.position),
    targetsInRange: getTargetsInRange(state),
  };

  return actions;
}

// Get enemies in range of player's weapon
function getTargetsInRange(state) {
  const player = state.player;
  const weapon = player.weapon;
  const rangeBonus = hasRelicOfType(player.relics, 'range')
    ? player.relics.find(r => r.type === 'range').rangeBonus
    : 0;
  const effectiveRange = weapon.range + rangeBonus;

  return state.enemies.filter(enemy =>
    isInRange(player.position, enemy.position, effectiveRange)
  );
}

// Get enemy attack animation type based on attack name/type
function getEnemyAttackAnimationType(enemy) {
  const attackName = enemy.weapon?.name?.toLowerCase() || '';
  const enemyType = enemy.type?.toLowerCase() || '';

  // Specific attack types
  if (attackName.includes('web')) return 'magic';
  if (attackName.includes('poison') || attackName.includes('venom')) return 'poison';
  if (attackName.includes('fire') || attackName.includes('flame')) return 'explosion';
  if (attackName.includes('claw')) return 'sword';
  if (attackName.includes('bite') || attackName.includes('gnaw')) return 'sword';
  if (attackName.includes('slash') || attackName.includes('blade')) return 'sword';

  // Enemy type defaults
  if (enemyType === 'arthropod') return 'poison';
  if (enemyType === 'magic') return 'magic';
  if (enemyType === 'beast') return 'sword';

  return 'sword';
}

// Get enemy attack emoji based on attack name/type
function getEnemyAttackEmoji(enemy) {
  // Use enemy's custom attack emoji if defined
  if (enemy.attackEmoji) return enemy.attackEmoji;

  // Fallback: use enemy emoji
  return enemy.emoji || '💥';
}

// Apply relic combat effects (poison_all, etc.)
function applyRelicCombatEffects(state, player, enemy) {
  const relics = player.relics || [];

  // Poison all attacks
  const poisonRelic = relics.find(r => r.type === 'poison_all');
  if (poisonRelic) {
    applyStatusEffect(enemy, {
      type: 'poison',
      damage: poisonRelic.poisonDamage || 1,
      duration: poisonRelic.poisonDuration || 2,
    });
    addLog(state, `${enemy.name} is poisoned!`);
  }

  // Cleave - hit adjacent enemies
  const cleaveRelic = relics.find(r => r.type === 'cleave');
  if (cleaveRelic) {
    const adjacent = getAdjacentPositions(player.position);
    state.enemies.forEach(e => {
      if (e.id !== enemy.id && e.hp > 0) {
        const isAdjacent = adjacent.some(pos => pos.x === e.position.x && pos.y === e.position.y);
        if (isAdjacent) {
          const cleaveDamage = Math.floor(player.weapon1?.damage / 2) || 1;
          e.hp -= cleaveDamage;
          addLog(state, `${e.name} takes ${cleaveDamage} cleave damage!`);
          if (e.hp <= 0) {
            addLog(state, `${e.name} is defeated by cleave!`);
            handleEnemyDefeat(state, e);
          }
        }
      }
    });
  }
}

// Export helper to check if it's player's turn
export function isPlayerTurn(state) {
  return state.turn === 'player' && state.combatActive;
}

// Export helper to check if combat is over
export function isCombatOver(state) {
  return !state.combatActive;
}

// Teleport player (for Blink Dagger relic)
export function processTeleport(state, targetPos) {
  const player = state.player;

  // Check if player has Blink Dagger
  const blinkRelic = player.relics?.find(r => r.type === 'teleport');
  if (!blinkRelic) {
    return { success: false, message: 'No teleport ability!' };
  }

  // Check if already used this combat
  if (state.blinkDaggerUsed) {
    return { success: false, message: 'Blink Dagger already used this combat!' };
  }

  // Check if target position is valid
  if (
    targetPos.x < 0 ||
    targetPos.x >= state.gridSize ||
    targetPos.y < 0 ||
    targetPos.y >= state.gridSize
  ) {
    return { success: false, message: 'Invalid teleport location!' };
  }

  // Check if tile is occupied
  if (state.grid[targetPos.y][targetPos.x].occupied) {
    return { success: false, message: 'Tile is occupied!' };
  }

  // Check if within range
  const distance = getDistance(player.position, targetPos);
  const maxRange = blinkRelic.teleportRange || 3;
  if (distance > maxRange) {
    return { success: false, message: `Too far! Max range: ${maxRange}` };
  }

  // Perform teleport
  state.grid[player.position.y][player.position.x].occupied = null;
  state.grid[targetPos.y][targetPos.x].occupied = 'player';
  player.position = targetPos;
  state.blinkDaggerUsed = true;
  state.teleportMode = false;

  addLog(state, `You blink to a new position!`);

  return { success: true, state };
}
