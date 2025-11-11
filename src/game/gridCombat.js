// Grid-based combat system
// Handles positioning, movement, range checking, and tactical positioning

export const GRID_SIZE_NORMAL = 5;
export const GRID_SIZE_BOSS = 7;

// Direction vectors
export const DIRECTIONS = {
  north: { dx: 0, dy: -1, name: 'north' },
  south: { dx: 0, dy: 1, name: 'south' },
  east: { dx: 1, dy: 0, name: 'east' },
  west: { dx: -1, dy: 0, name: 'west' },
};

// Initialize combat grid
export function initializeCombatGrid(isBoss = false) {
  const size = isBoss ? GRID_SIZE_BOSS : GRID_SIZE_NORMAL;
  const grid = [];

  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      row.push({
        x,
        y,
        occupied: null, // null, 'player', or enemy id
        obstacle: false,
        terrain: 'normal', // future: different terrain types
      });
    }
    grid.push(row);
  }

  return { grid, size };
}

// Get starting position for player (middle of left side for normal, center for boss)
export function getPlayerStartPosition(gridSize, enemyType = null) {
  if (enemyType === 'spider') {
    // Spider encounter: player starts middle-left
    return { x: 0, y: Math.floor(gridSize / 2) };
  }
  // Default: center left
  return { x: 1, y: Math.floor(gridSize / 2) };
}

// Get starting position for enemy based on type
export function getEnemyStartPosition(gridSize, enemyType, enemyIndex = 0) {
  const center = Math.floor(gridSize / 2);

  // Define spawn positions for multiple enemies (4th rank for backstab opportunities)
  const multiEnemyPositions = [
    { x: gridSize - 2, y: center },     // 4th rank center
    { x: gridSize - 2, y: center - 1 }, // 4th rank top
    { x: gridSize - 2, y: center + 1 }, // 4th rank bottom
    { x: gridSize - 2, y: 0 },          // 4th rank far top
    { x: gridSize - 2, y: gridSize - 1 }, // 4th rank far bottom
  ];

  switch (enemyType) {
    case 'spider':
      // Spiders stay on back rank (hit-and-run personality)
      // For multiple spiders, spread them along the back
      if (enemyIndex === 0) return { x: gridSize - 1, y: 0 };
      if (enemyIndex === 1) return { x: gridSize - 1, y: gridSize - 1 };
      return { x: gridSize - 1, y: center };

    case 'defensive':
      // Defensive enemies start 4th rank
      if (enemyIndex === 0) return { x: gridSize - 2, y: center };
      if (enemyIndex === 1) return { x: gridSize - 2, y: center - 1 };
      return { x: gridSize - 2, y: center + 1 };

    case 'aggressive':
      // Aggressive start 4th rank
      return multiEnemyPositions[enemyIndex % multiEnemyPositions.length];

    case 'ambusher':
      // Ambushers start 4th rank, spread out
      if (enemyIndex === 0) return { x: gridSize - 2, y: 1 };
      if (enemyIndex === 1) return { x: gridSize - 2, y: gridSize - 2 };
      return { x: gridSize - 2, y: center };

    case 'swarm':
      // Multiple enemies spawn on 4th rank
      return multiEnemyPositions[enemyIndex % multiEnemyPositions.length];

    case 'boss':
      // Bosses start 4th rank center (dominant but accessible)
      if (enemyIndex === 0) return { x: gridSize - 2, y: center };
      return multiEnemyPositions[enemyIndex % multiEnemyPositions.length];

    default:
      // Default: 4th rank positions for backstab opportunities
      return multiEnemyPositions[enemyIndex % multiEnemyPositions.length];
  }
}

// Check if position is valid on grid
export function isValidPosition(x, y, gridSize) {
  return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
}

// Check if tile is occupied
export function isOccupied(grid, x, y) {
  if (!isValidPosition(x, y, grid.length)) return true;
  const tile = grid[y][x];
  return tile.occupied !== null || tile.obstacle;
}

// Check if tile is walkable (not occupied, not obstacle)
export function isWalkable(grid, x, y) {
  if (!isValidPosition(x, y, grid.length)) return false;
  return !isOccupied(grid, x, y);
}

// Get distance between two positions (Manhattan distance)
export function getDistance(pos1, pos2) {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

// Get Euclidean distance (for circular range)
export function getEuclideanDistance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

// Check if target is in range for attack
export function isInRange(attackerPos, targetPos, range, rangeType = 'manhattan') {
  if (rangeType === 'euclidean') {
    return getEuclideanDistance(attackerPos, targetPos) <= range;
  }
  // Manhattan distance (default)
  return getDistance(attackerPos, targetPos) <= range;
}

// Get all valid moves from a position (4-directional)
export function getValidMoves(grid, position) {
  const moves = [];

  Object.values(DIRECTIONS).forEach(dir => {
    const newX = position.x + dir.dx;
    const newY = position.y + dir.dy;

    if (isWalkable(grid, newX, newY)) {
      moves.push({
        x: newX,
        y: newY,
        direction: dir.name,
      });
    }
  });

  return moves;
}

// Get direction from one position to another
export function getDirection(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Prioritize cardinal directions
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? DIRECTIONS.east : DIRECTIONS.west;
  } else if (dy !== 0) {
    return dy > 0 ? DIRECTIONS.south : DIRECTIONS.north;
  }

  return null; // Same position
}

// Get facing direction (which way an entity is looking)
export function getFacingDirection(entity) {
  return entity.facing || DIRECTIONS.south; // Default facing south
}

// Update facing direction based on movement or target
export function updateFacing(entity, targetPos) {
  const direction = getDirection(entity.position, targetPos);
  if (direction) {
    entity.facing = direction;
  }
}

// Check if attacker is behind target (backstab)
export function isBackstab(attackerPos, targetPos, targetFacing) {
  const attackDirection = getDirection(targetPos, attackerPos);
  if (!attackDirection) return false;

  // Backstab if attacking from opposite direction of facing
  return (
    (targetFacing.name === 'north' && attackDirection.name === 'south') ||
    (targetFacing.name === 'south' && attackDirection.name === 'north') ||
    (targetFacing.name === 'east' && attackDirection.name === 'west') ||
    (targetFacing.name === 'west' && attackDirection.name === 'east')
  );
}

// Check if attacker is flanking target (from side)
export function isFlank(attackerPos, targetPos, targetFacing) {
  const attackDirection = getDirection(targetPos, attackerPos);
  if (!attackDirection) return false;

  // Flank if attacking from perpendicular direction
  return (
    ((targetFacing.name === 'north' || targetFacing.name === 'south') &&
      (attackDirection.name === 'east' || attackDirection.name === 'west')) ||
    ((targetFacing.name === 'east' || targetFacing.name === 'west') &&
      (attackDirection.name === 'north' || attackDirection.name === 'south'))
  );
}

// Get all positions in a straight line (for ranged attacks)
export function getLinePositions(from, to, maxRange = 10) {
  const positions = [];
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);

  // Only allow straight lines (cardinal directions)
  if (dx !== 0 && dy !== 0) return positions;

  let currentX = from.x + dx;
  let currentY = from.y + dy;
  let distance = 0;

  while (distance < maxRange) {
    positions.push({ x: currentX, y: currentY });

    if (currentX === to.x && currentY === to.y) break;

    currentX += dx;
    currentY += dy;
    distance++;
  }

  return positions;
}

// Get all positions in a cross pattern (for area attacks)
export function getCrossPositions(center, range = 1) {
  const positions = [];

  Object.values(DIRECTIONS).forEach(dir => {
    for (let i = 1; i <= range; i++) {
      positions.push({
        x: center.x + dir.dx * i,
        y: center.y + dir.dy * i,
      });
    }
  });

  return positions;
}

// Get all positions in a radius (for AoE attacks)
export function getRadiusPositions(center, radius, useEuclidean = true) {
  const positions = [];

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip center

      const pos = { x: center.x + dx, y: center.y + dy };

      if (useEuclidean) {
        if (getEuclideanDistance(center, pos) <= radius) {
          positions.push(pos);
        }
      } else {
        if (Math.abs(dx) + Math.abs(dy) <= radius) {
          positions.push(pos);
        }
      }
    }
  }

  return positions;
}

// Get adjacent positions (for melee range)
export function getAdjacentPositions(position) {
  return Object.values(DIRECTIONS).map(dir => ({
    x: position.x + dir.dx,
    y: position.y + dir.dy,
  }));
}

// Find shortest path using BFS (for AI pathfinding)
export function findPath(grid, start, goal, canMoveThrough = false) {
  if (start.x === goal.x && start.y === goal.y) return [];

  const queue = [{ pos: start, path: [] }];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { pos, path } = queue.shift();

    // Check all adjacent positions
    const moves = getValidMoves(grid, pos);

    for (const move of moves) {
      const key = `${move.x},${move.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      const newPath = [...path, move];

      // If we reached the goal
      if (move.x === goal.x && move.y === goal.y) {
        return newPath;
      }

      queue.push({ pos: move, path: newPath });
    }
  }

  return null; // No path found
}

// Get best position to attack from (for AI)
export function getBestAttackPosition(grid, attackerPos, targetPos, weaponRange) {
  // If already in range, stay put
  if (getDistance(attackerPos, targetPos) <= weaponRange) {
    return attackerPos;
  }

  // Get all positions within weapon range of target
  const potentialPositions = [];

  for (let dx = -weaponRange; dx <= weaponRange; dx++) {
    for (let dy = -weaponRange; dy <= weaponRange; dy++) {
      const pos = { x: targetPos.x + dx, y: targetPos.y + dy };

      if (getDistance(targetPos, pos) <= weaponRange &&
          isWalkable(grid, pos.x, pos.y)) {
        potentialPositions.push(pos);
      }
    }
  }

  // Find closest reachable position
  let bestPos = attackerPos;
  let shortestDist = Infinity;

  for (const pos of potentialPositions) {
    const dist = getDistance(attackerPos, pos);
    if (dist < shortestDist) {
      shortestDist = dist;
      bestPos = pos;
    }
  }

  return bestPos;
}

// Check if position is in a corner
export function isCorner(pos, gridSize) {
  return (
    (pos.x === 0 || pos.x === gridSize - 1) &&
    (pos.y === 0 || pos.y === gridSize - 1)
  );
}

// Check if position is on edge
export function isEdge(pos, gridSize) {
  return pos.x === 0 || pos.x === gridSize - 1 || pos.y === 0 || pos.y === gridSize - 1;
}

// Get all corner positions
export function getCorners(gridSize) {
  return [
    { x: 0, y: 0 },
    { x: gridSize - 1, y: 0 },
    { x: 0, y: gridSize - 1 },
    { x: gridSize - 1, y: gridSize - 1 },
  ];
}

// Get push destination (for knockback)
export function getPushDestination(pusherPos, targetPos, pushDistance = 1) {
  const direction = getDirection(pusherPos, targetPos);
  if (!direction) return targetPos;

  return {
    x: targetPos.x + direction.dx * pushDistance,
    y: targetPos.y + direction.dy * pushDistance,
  };
}

// Count enemies adjacent to position (for surrounded checks)
export function countAdjacentEnemies(grid, position, enemyIds) {
  const adjacent = getAdjacentPositions(position);
  let count = 0;

  adjacent.forEach(pos => {
    if (isValidPosition(pos.x, pos.y, grid.length)) {
      const tile = grid[pos.y][pos.x];
      if (tile.occupied && enemyIds.includes(tile.occupied)) {
        count++;
      }
    }
  });

  return count;
}

// Check if player is surrounded (3+ enemies adjacent)
export function isSurrounded(grid, position, enemyIds) {
  return countAdjacentEnemies(grid, position, enemyIds) >= 3;
}
