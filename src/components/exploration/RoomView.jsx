import { getRoomEmoji } from '../../data/roomTemplates';
import CombatAnimation from '../combat/CombatAnimation';

const RoomView = ({ room, enemy, gameState, combatState, animations = [], onTeleport }) => {
  if (!room) return null;

  // Render a single grid cell
  const renderCell = (x, y) => {
    if (!combatState) return null;

    const { player, enemies, grid, teleportMode } = combatState;
    const tile = grid[y][x];
    const isPlayer = player.position.x === x && player.position.y === y;
    const enemyAtPos = enemies.find(e => e.position.x === x && e.position.y === y);

    // Calculate if this tile is a valid teleport target
    const isValidTeleport = teleportMode && !tile.occupied && !tile.obstacle;
    const distance = Math.abs(player.position.x - x) + Math.abs(player.position.y - y);
    const blinkRelic = player.relics?.find(r => r.type === 'teleport');
    const maxRange = blinkRelic?.teleportRange || 3;
    const inTeleportRange = distance <= maxRange && distance > 0;

    let bgColor = 'bg-gray-800';
    let content = null;

    // Highlight valid teleport tiles
    if (isValidTeleport && inTeleportRange) {
      bgColor = 'bg-purple-500/30';
    }

    if (isPlayer) {
      bgColor = 'bg-blue-600';
      // Show weapon emoji next to player
      const weaponEmoji = player.weapon?.emoji || player.weapon1?.emoji || '';
      content = (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center gap-1">
            <div className="text-2xl">🧙</div>
            {weaponEmoji && <div className="text-sm">{weaponEmoji}</div>}
          </div>
          <div className="text-xs text-white font-bold">{player.currentAP} AP</div>
        </div>
      );
    } else if (enemyAtPos) {
      bgColor = 'bg-red-600';
      // Apply range bonus from relics
      const rangeBonus = player.relics?.some(r => r.type === 'range')
        ? player.relics.find(r => r.type === 'range').rangeBonus
        : 0;
      const effectiveRange = player.weapon.range + rangeBonus;
      const inRange = Math.abs(player.position.x - x) + Math.abs(player.position.y - y) <= effectiveRange;
      content = (
        <div className={`flex flex-col items-center justify-center h-full ${inRange ? 'ring-2 ring-yellow-400' : ''}`}>
          <div className="text-2xl">{enemyAtPos.emoji}</div>
          <div className="text-xs text-white font-bold">{enemyAtPos.hp}/{enemyAtPos.maxHp}</div>
        </div>
      );
    } else if (tile.obstacle) {
      bgColor = 'bg-gray-600';
      content = <div className="text-2xl">🪨</div>;
    }

    // Handle tile click for teleport
    const handleClick = () => {
      if (teleportMode && isValidTeleport && inTeleportRange && onTeleport) {
        onTeleport({ x, y });
      }
    };

    return (
      <div
        key={`${x}-${y}`}
        className={`${bgColor} border border-gray-700 flex items-center justify-center relative ${teleportMode && isValidTeleport && inTeleportRange ? 'cursor-pointer hover:bg-purple-400/50' : ''}`}
        style={{ aspectRatio: '1' }}
        onClick={handleClick}
      >
        {content}
        {isValidTeleport && inTeleportRange && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-purple-300 text-2xl">✨</div>
          </div>
        )}
      </div>
    );
  };

  // Render the combat grid
  const renderGrid = () => {
    if (!combatState) return null;

    const { gridSize } = combatState;
    const rows = [];
    for (let y = 0; y < gridSize; y++) {
      const cells = [];
      for (let x = 0; x < gridSize; x++) {
        cells.push(renderCell(x, y));
      }
      rows.push(
        <div key={y} className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '2px' }}>
          {cells}
        </div>
      );
    }
    return (
      <div className="relative">
        <div className="space-y-[2px]">{rows}</div>
        {/* Animation overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {animations.map(anim => {
            if (!anim.gridPosition) return null;

            // Convert grid position to pixels
            const cellSize = 100 / gridSize; // Percentage
            // Add half a cell size to center on the cell
            const pixelX = (anim.gridPosition.x * cellSize) + (cellSize / 2);
            const pixelY = (anim.gridPosition.y * cellSize) + (cellSize / 2);

            return (
              <div
                key={anim.id}
                style={{
                  position: 'absolute',
                  left: `${pixelX}%`,
                  top: `${pixelY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CombatAnimation animation={anim} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-800 rounded-lg border-2 border-gray-700 p-6 flex flex-col items-center justify-center">
      {gameState === 'combat' && combatState ? (
        // Combat grid view
        <div className="w-full h-full flex items-center justify-center">
          <div className="max-w-md w-full">
            {renderGrid()}
          </div>
        </div>
      ) : (
        // Exploration view
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">
            {getRoomEmoji(room.type)}
          </div>
          <h2 className="text-2xl font-bold">{room.name}</h2>
          <p className="text-gray-400">{room.description}</p>

          {gameState === 'combat' && enemy && (
            <div className="mt-6 p-4 bg-gray-700 rounded">
              <div className="text-4xl mb-2">
                {enemy.emoji}
              </div>
              <div className="font-bold text-xl">{enemy.name}</div>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-8">
            [Pixel art visualization would go here]
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomView;