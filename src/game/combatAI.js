// Combat AI system for grid-based tactical combat
// Handles enemy decision-making, positioning, and attack patterns

import {
  getDistance,
  getValidMoves,
  findPath,
  isInRange,
  getDirection,
  isCorner,
  isEdge,
  getCorners,
  getBestAttackPosition,
  getAdjacentPositions,
  isBackstab,
  countAdjacentEnemies,
} from './gridCombat.js';

// AI Personality types
export const AI_PERSONALITIES = {
  AGGRESSIVE: 'aggressive',
  DEFENSIVE: 'defensive',
  HIT_AND_RUN: 'hit_and_run',
  AMBUSHER: 'ambusher',
  SWARM: 'swarm',
  BOSS: 'boss',
};

// Evaluate position quality for defensive enemies (prefer corners/edges)
function evaluateDefensivePosition(pos, gridSize) {
  let score = 0;

  if (isCorner(pos, gridSize)) {
    score += 10; // Corners are best
  } else if (isEdge(pos, gridSize)) {
    score += 5; // Edges are good
  }

  return score;
}

// Evaluate position quality for ambushers (prefer being behind target)
function evaluateAmbushPosition(pos, targetPos, targetFacing, gridSize) {
  let score = 0;

  // Check if this position would be a backstab
  if (isBackstab(pos, targetPos, targetFacing)) {
    score += 15;
  }

  // Prefer positions on edges for escape routes
  if (isEdge(pos, gridSize)) {
    score += 3;
  }

  return score;
}

// Make decision for aggressive enemy (charge and attack)
export function makeAggressiveDecision(enemy, player, grid, gridSize) {
  const actions = [];
  let remainingAP = enemy.currentAP || enemy.ap || 2;
  let currentPos = { ...enemy.position }; // Track simulated position during planning

  // Goal: Move toward player and attack
  while (remainingAP > 0) {
    const distance = getDistance(currentPos, player.position);
    const weaponRange = enemy.weapon?.range || 1;
    const weaponAPCost = enemy.weapon?.apCost || 1;

    // If in range, attack
    if (distance <= weaponRange && remainingAP >= weaponAPCost) {
      actions.push({
        type: 'attack',
        target: 'player',
        cost: weaponAPCost,
      });
      remainingAP -= weaponAPCost;
    } else if (remainingAP >= 1) {
      // Find best adjacent position to player
      const adjacentPositions = getAdjacentPositions(player.position);
      let bestMove = null;
      let shortestPath = null;

      // Try to path to each adjacent position
      for (const adjPos of adjacentPositions) {
        if (adjPos.x < 0 || adjPos.x >= gridSize || adjPos.y < 0 || adjPos.y >= gridSize) continue;
        if (grid[adjPos.y][adjPos.x].occupied && grid[adjPos.y][adjPos.x].occupied !== enemy.id) continue;

        const path = findPath(grid, currentPos, adjPos);
        if (path && (!shortestPath || path.length < shortestPath.length)) {
          shortestPath = path;
          bestMove = path[0];
        }
      }

      if (bestMove) {
        actions.push({
          type: 'move',
          from: currentPos,
          to: bestMove,
          cost: 1,
        });
        currentPos = bestMove; // Update simulated position
        remainingAP -= 1;
      } else {
        // Can't find path, end turn
        break;
      }
    } else {
      break;
    }
  }

  return actions;
}

// Make decision for defensive enemy (stay in corner, push back attackers)
export function makeDefensiveDecision(enemy, player, grid, gridSize) {
  const actions = [];
  let remainingAP = enemy.ap || 2;

  const distance = getDistance(enemy.position, player.position);
  const weaponRange = enemy.weapon?.range || 1;
  const currentPosScore = evaluateDefensivePosition(enemy.position, gridSize);

  // If player is adjacent and we have push ability, use it
  if (distance === 1 && enemy.abilities?.includes('push') && remainingAP >= 1) {
    actions.push({
      type: 'push',
      target: 'player',
      cost: 1,
    });
    remainingAP -= 1;
  }

  // If player in range and we have AP, attack
  const weaponAPCost = enemy.weapon?.apCost || 1;
  if (distance <= weaponRange && remainingAP >= weaponAPCost) {
    actions.push({
      type: 'attack',
      target: 'player',
      cost: weaponAPCost,
    });
    remainingAP -= weaponAPCost;
  }

  // If not in a good defensive position, move to corner/edge
  if (currentPosScore < 8 && remainingAP >= 1) {
    const corners = getCorners(gridSize);
    let bestCorner = null;
    let bestScore = -1;

    corners.forEach(corner => {
      const path = findPath(grid, enemy.position, corner);
      if (path && path.length > 0) {
        const score = evaluateDefensivePosition(corner, gridSize);
        if (score > bestScore) {
          bestScore = score;
          bestCorner = path[0]; // Move toward best corner
        }
      }
    });

    if (bestCorner) {
      actions.push({
        type: 'move',
        from: enemy.position,
        to: bestCorner,
        cost: 1,
      });
      remainingAP -= 1;
    }
  }

  // If we still have AP and player is far, just wait/defend
  if (remainingAP > 0) {
    actions.push({
      type: 'defend',
      cost: 0,
    });
  }

  return actions;
}

// Make decision for hit-and-run enemy (attack and retreat)
export function makeHitAndRunDecision(enemy, player, grid, gridSize) {
  const actions = [];
  let remainingAP = enemy.currentAP || enemy.ap || 2;
  let currentPos = { ...enemy.position };

  const distance = getDistance(currentPos, player.position);
  const weaponRange = enemy.weapon?.range || 1;
  const weaponAPCost = enemy.weapon?.apCost || 1;

  // If in range, attack first
  if (distance <= weaponRange && remainingAP >= weaponAPCost) {
    actions.push({
      type: 'attack',
      target: 'player',
      cost: weaponAPCost,
    });
    remainingAP -= weaponAPCost;

    // Then retreat (move away from player)
    if (remainingAP >= 1) {
      const validMoves = getValidMoves(grid, currentPos);
      let bestRetreat = null;
      let maxDistance = distance;

      validMoves.forEach(move => {
        const moveDistance = getDistance(move, player.position);
        if (moveDistance > maxDistance) {
          maxDistance = moveDistance;
          bestRetreat = move;
        }
      });

      if (bestRetreat) {
        actions.push({
          type: 'move',
          from: currentPos,
          to: bestRetreat,
          cost: 1,
        });
        currentPos = bestRetreat;
        remainingAP -= 1;
      }
    }
  } else if (remainingAP >= 1) {
    // Not in range, move toward player
    const adjacentPositions = getAdjacentPositions(player.position);
    let bestMove = null;
    let shortestPath = null;

    for (const adjPos of adjacentPositions) {
      if (adjPos.x < 0 || adjPos.x >= gridSize || adjPos.y < 0 || adjPos.y >= gridSize) continue;
      if (grid[adjPos.y][adjPos.x].occupied && grid[adjPos.y][adjPos.x].occupied !== enemy.id) continue;

      const path = findPath(grid, currentPos, adjPos);
      if (path && (!shortestPath || path.length < shortestPath.length)) {
        shortestPath = path;
        bestMove = path[0];
      }
    }

    if (bestMove) {
      actions.push({
        type: 'move',
        from: currentPos,
        to: bestMove,
        cost: 1,
      });
      currentPos = bestMove;
      remainingAP -= 1;
    }
  }

  return actions;
}

// Make decision for ambusher enemy (try to get behind player)
export function makeAmbusherDecision(enemy, player, grid, gridSize) {
  const actions = [];
  let remainingAP = enemy.ap || 2;

  const distance = getDistance(enemy.position, player.position);
  const weaponRange = enemy.weapon?.range || 1;
  const isInBackstabPosition = isBackstab(enemy.position, player.position, player.facing);

  // If we're behind player and in range, attack!
  if (isInBackstabPosition && distance <= weaponRange && remainingAP >= 1) {
    actions.push({
      type: 'attack',
      target: 'player',
      cost: 1,
    });
    remainingAP -= 1;
  } else {
    // Try to circle around to get behind player
    const playerFacing = player.facing;
    const validMoves = getValidMoves(grid, enemy.position);
    let bestMove = null;
    let bestScore = -1;

    validMoves.forEach(move => {
      const score = evaluateAmbushPosition(move, player.position, playerFacing, gridSize);
      const newDistance = getDistance(move, player.position);

      // Prefer getting closer while positioning for backstab
      const finalScore = score - newDistance * 2;

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMove = move;
      }
    });

    if (bestMove && remainingAP >= 1) {
      actions.push({
        type: 'move',
        from: enemy.position,
        to: bestMove,
        cost: 1,
      });
      remainingAP -= 1;
    }

    // If we have AP left and are in range (even if not backstab), attack
    if (remainingAP >= 1 && getDistance(enemy.position, player.position) <= weaponRange) {
      actions.push({
        type: 'attack',
        target: 'player',
        cost: 1,
      });
      remainingAP -= 1;
    }
  }

  return actions;
}

// Make decision for swarm enemy (try to surround player)
export function makeSwarmDecision(enemy, player, allEnemies, grid, gridSize) {
  const actions = [];
  let remainingAP = enemy.currentAP || enemy.ap || 2;
  let currentPos = { ...enemy.position };

  while (remainingAP > 0) {
    const distance = getDistance(currentPos, player.position);
    const weaponRange = enemy.weapon?.range || 1;
    const weaponAPCost = enemy.weapon?.apCost || 1;

    // If in range, attack!
    if (distance <= weaponRange && remainingAP >= weaponAPCost) {
      actions.push({
        type: 'attack',
        target: 'player',
        cost: weaponAPCost,
      });
      remainingAP -= weaponAPCost;
    } else if (remainingAP >= 1) {
      // Try to move toward player (to adjacent position)
      const adjacentPositions = getAdjacentPositions(player.position);
      let bestMove = null;
      let shortestPath = null;

      for (const adjPos of adjacentPositions) {
        if (adjPos.x < 0 || adjPos.x >= gridSize || adjPos.y < 0 || adjPos.y >= gridSize) continue;
        if (grid[adjPos.y][adjPos.x].occupied && grid[adjPos.y][adjPos.x].occupied !== enemy.id) continue;

        const path = findPath(grid, currentPos, adjPos);
        if (path && (!shortestPath || path.length < shortestPath.length)) {
          shortestPath = path;
          bestMove = path[0];
        }
      }

      if (bestMove) {
        actions.push({
          type: 'move',
          from: currentPos,
          to: bestMove,
          cost: 1,
        });
        currentPos = bestMove;
        remainingAP -= 1;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return actions;
}

// Make decision for boss enemy (more complex, adaptive)
export function makeBossDecision(enemy, player, grid, gridSize) {
  const healthPercent = enemy.hp / enemy.maxHp;

  // Boss behavior changes based on health - just use aggressive AI for now
  // This prevents softlocks and ensures boss always acts
  return makeAggressiveDecision(enemy, player, grid, gridSize);
}

// Main AI decision function
export function makeEnemyDecision(enemy, player, allEnemies, grid, gridSize) {
  const personality = enemy.aiPersonality || AI_PERSONALITIES.AGGRESSIVE;

  switch (personality) {
    case AI_PERSONALITIES.AGGRESSIVE:
      return makeAggressiveDecision(enemy, player, grid, gridSize);

    case AI_PERSONALITIES.DEFENSIVE:
      return makeDefensiveDecision(enemy, player, grid, gridSize);

    case AI_PERSONALITIES.HIT_AND_RUN:
      return makeHitAndRunDecision(enemy, player, grid, gridSize);

    case AI_PERSONALITIES.AMBUSHER:
      return makeAmbusherDecision(enemy, player, grid, gridSize);

    case AI_PERSONALITIES.SWARM:
      return makeSwarmDecision(enemy, player, allEnemies, grid, gridSize);

    case AI_PERSONALITIES.BOSS:
      return makeBossDecision(enemy, player, grid, gridSize);

    default:
      return makeAggressiveDecision(enemy, player, grid, gridSize);
  }
}

// Execute enemy actions with visual feedback
export async function executeEnemyActions(enemy, actions, gameState, onUpdate) {
  for (const action of actions) {
    // Wait between actions for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500));

    if (onUpdate) {
      onUpdate({
        enemy,
        action,
        gameState,
      });
    }
  }
}
