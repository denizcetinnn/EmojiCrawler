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

  // Determine enemy type for positioning
  const enemyType = enemies[0]?.spawnType || 'aggressive';

  // Position player
  const playerPos = getPlayerStartPosition(gridSize, enemyType);
  grid[playerPos.y][playerPos.x].occupied = 'player';

  // Position enemies
  enemies.forEach((enemy, index) => {
    const enemyPos = getEnemyStartPosition(gridSize, enemyType, index);
    enemy.position = enemyPos;
    enemy.facing = DIRECTIONS.west; // Start facing player
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

  // Update grid
  state.grid[player.position.y][player.position.x].occupied = null;
  state.grid[newPos.y][newPos.x].occupied = 'player';

  // Update player position and facing
  player.position = newPos;
  player.facing = direction;
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
  const effectiveRange = weapon.range + rangeBonus;

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

    // Check if enemy died
    if (enemy.hp <= 0) {
      defeatedEnemies.push(enemy);
    }
  });

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

  // Check if combat is over
  if (state.enemies.length === 0) {
    state.combatActive = false;
    addLog(state, '⭐ Victory!');
  }
}

// End player turn and start enemy turns
export function endPlayerTurn(state) {
  // Reset player AP for next turn
  state.player.currentAP = state.player.maxAP;

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

      // Calculate damage
      const damage = calculateEnemyAttackDamage(
        enemy,
        state.player,
        state
      );

      // Apply damage
      state.player.hp -= damage;

      addLog(state, `${enemy.name} attacks for ${damage} damage!`);

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

// Export helper to check if it's player's turn
export function isPlayerTurn(state) {
  return state.turn === 'player' && state.combatActive;
}

// Export helper to check if combat is over
export function isCombatOver(state) {
  return !state.combatActive;
}
