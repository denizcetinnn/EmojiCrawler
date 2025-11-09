import { getRoomEmoji } from '../../data/roomTemplates';

const RoomView = ({ room, enemy, gameState, combatState }) => {
  if (!room) return null;

  // Render a single grid cell
  const renderCell = (x, y) => {
    if (!combatState) return null;

    const { player, enemies, grid } = combatState;
    const tile = grid[y][x];
    const isPlayer = player.position.x === x && player.position.y === y;
    const enemyAtPos = enemies.find(e => e.position.x === x && e.position.y === y);

    let bgColor = 'bg-gray-800';
    let content = null;

    if (isPlayer) {
      bgColor = 'bg-blue-600';
      content = (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-2xl">🧙</div>
          <div className="text-xs text-white font-bold">{player.currentAP} AP</div>
        </div>
      );
    } else if (enemyAtPos) {
      bgColor = 'bg-red-600';
      const inRange = Math.abs(player.position.x - x) + Math.abs(player.position.y - y) <= player.weapon.range;
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

    return (
      <div
        key={`${x}-${y}`}
        className={`${bgColor} border border-gray-700 flex items-center justify-center relative`}
        style={{ aspectRatio: '1' }}
      >
        {content}
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
    return <div className="space-y-[2px]">{rows}</div>;
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