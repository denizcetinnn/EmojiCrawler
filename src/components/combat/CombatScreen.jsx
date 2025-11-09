import { useState } from 'react';
import { Heart, Zap, Swords, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Target } from 'lucide-react';
import CombatLog from './CombatLog';
import { DIRECTIONS } from '../../game/gridCombat';
import CombatAnimation, { getWeaponAnimationType, getWeaponEmoji } from './CombatAnimation';
import '../../styles/combat-animations.css';

const CombatScreen = ({ combatState, onMove, onAttack, onEndTurn }) => {
  const [animations, setAnimations] = useState([]);
  const [flashingCells, setFlashingCells] = useState(new Set());

  if (!combatState) return null;

  const { player, enemies, grid, gridSize, turn, log } = combatState;

  // Helper to add animation
  const addAnimation = (animData) => {
    const id = Date.now() + Math.random();
    setAnimations(prev => [...prev, { ...animData, id }]);

    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== id));
    }, animData.duration || 800);
  };

  // Helper to flash cell
  const flashCell = (x, y, type = 'damage') => {
    const key = `${x},${y}`;
    setFlashingCells(prev => new Set([...prev, key]));

    setTimeout(() => {
      setFlashingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 400);
  };

  // Wrapped attack handler to show animations
  const handleAttackWithAnimation = (enemy, weapon) => {
    // Calculate position between player and enemy
    const playerGridX = player.position.x;
    const playerGridY = player.position.y;
    const enemyGridX = enemy.position.x;
    const enemyGridY = enemy.position.y;

    // Position animation between player and enemy
    const midX = (playerGridX + enemyGridX) / 2;
    const midY = (playerGridY + enemyGridY) / 2;

    // Show attack animation
    const animType = getWeaponAnimationType(weapon);
    const emoji = getWeaponEmoji(weapon);

    addAnimation({
      type: animType,
      emoji,
      gridPosition: { x: midX, y: midY }, // Use grid coordinates
      fromGrid: { x: playerGridX, y: playerGridY },
      toGrid: { x: enemyGridX, y: enemyGridY },
      duration: 500,
    });

    // Flash the target cell
    flashCell(enemy.position.x, enemy.position.y, 'damage');

    // Call original attack handler
    onAttack(enemy, weapon);
  };

  // Get available actions
  const canMove = player.currentAP >= 1 && turn === 'player';
  const weapon1 = player.weapon1 || player.weapon;
  const weapon2 = player.weapon2;
  const canAttackWeapon1 = weapon1 && player.currentAP >= weapon1.apCost && turn === 'player';
  const canAttackWeapon2 = weapon2 && player.currentAP >= weapon2.apCost && turn === 'player';

  // Render a single grid cell
  const renderCell = (x, y) => {
    const tile = grid[y][x];
    const isPlayer = player.position.x === x && player.position.y === y;
    const enemy = enemies.find(e => e.position.x === x && e.position.y === y);
    const cellKey = `${x},${y}`;
    const isFlashing = flashingCells.has(cellKey);

    let bgColor = 'bg-gray-800';
    let content = null;
    let statusEffectClass = '';

    if (isPlayer) {
      bgColor = 'bg-blue-600';
      content = (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-2xl">🧙</div>
          <div className="text-xs text-white font-bold">{player.currentAP} AP</div>
        </div>
      );
    } else if (enemy) {
      bgColor = 'bg-red-600';
      const inRange = Math.abs(player.position.x - x) + Math.abs(player.position.y - y) <= player.weapon.range;

      // Status effects
      if (enemy.statusEffects?.some(e => e.type === 'poison')) {
        statusEffectClass = 'status-poison';
      } else if (enemy.statusEffects?.some(e => e.type === 'burn')) {
        statusEffectClass = 'status-burn';
      } else if (enemy.statusEffects?.some(e => e.type === 'slow')) {
        statusEffectClass = 'status-slow';
      }

      content = (
        <div className={`flex flex-col items-center justify-center h-full ${inRange ? 'ring-2 ring-yellow-400' : ''} ${statusEffectClass}`}>
          <div className="text-2xl">{enemy.emoji}</div>
          <div className="text-xs text-white font-bold">{enemy.hp}/{enemy.maxHp}</div>
        </div>
      );
    } else if (tile.obstacle) {
      bgColor = 'bg-gray-600';
      content = <div className="text-2xl">🪨</div>;
    }

    return (
      <div
        key={`${x}-${y}`}
        className={`${bgColor} border border-gray-700 flex items-center justify-center relative grid-cell ${isFlashing ? 'damage-flash' : ''}`}
        style={{ aspectRatio: '1' }}
      >
        {content}
        {/* Grid coordinates for debugging */}
        {/* <div className="absolute top-0 left-0 text-[8px] text-gray-500">{x},{y}</div> */}
      </div>
    );
  };

  // Render the combat grid
  const renderGrid = () => {
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
            // Each cell is roughly equal size, calculate based on grid
            const cellSize = 100 / gridSize; // Percentage
            const pixelX = anim.gridPosition.x * cellSize;
            const pixelY = anim.gridPosition.y * cellSize;

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

  // Get targets in range for each weapon
  const weapon1Targets = enemies.filter(enemy => {
    const distance = Math.abs(player.position.x - enemy.position.x) +
                     Math.abs(player.position.y - enemy.position.y);
    return distance <= weapon1.range;
  });

  const weapon2Targets = weapon2 ? enemies.filter(enemy => {
    const distance = Math.abs(player.position.x - enemy.position.x) +
                     Math.abs(player.position.y - enemy.position.y);
    return distance <= weapon2.range;
  }) : [];

  // Check if player can see enemy intents
  const hasTacticalManual = player.relics?.some(r => r.type === 'insight');
  const hasHighInt = player.stats?.int >= 5;
  const canSeeIntents = hasTacticalManual || hasHighInt;

  return (
    <div className="space-y-4">
      {/* Combat Status Bar */}
      <div className="bg-gray-700 p-3 rounded">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              {turn === 'player' ? '⚔️ Your Turn' : '⏳ Enemy Turn...'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-400">{player.currentAP}/{player.maxAP} AP</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="font-bold">{Math.max(0, player.hp)}/{player.maxHp} HP</span>
            </div>
          </div>
        </div>

        {/* Weapon Info */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span>{weapon1.emoji || '👊'}</span>
            <span>{weapon1.name}</span>
          </div>
          {weapon2 && (
            <>
              <span>+</span>
              <div className="flex items-center gap-1 text-blue-400">
                <span>{weapon2.emoji || '⚔️'}</span>
                <span>{weapon2.name}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enemy List */}
      <div className="bg-gray-700 p-3 rounded">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Enemies</h4>
        <div className="space-y-2">
          {enemies.map(enemy => {
            const inWeapon1Range = weapon1Targets.some(t => t.id === enemy.id);
            const inWeapon2Range = weapon2Targets.some(t => t.id === enemy.id);
            const hpPercent = (enemy.hp / enemy.maxHp) * 100;

            return (
              <div
                key={enemy.id}
                className={`bg-gray-800 p-2 rounded text-sm ${(inWeapon1Range || inWeapon2Range) ? 'ring-2 ring-yellow-400' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{enemy.emoji}</span>
                    <span className="font-semibold">{enemy.name}</span>
                  </div>
                  {(inWeapon1Range || inWeapon2Range) && <Target className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{enemy.hp}/{enemy.maxHp}</span>
                </div>
                {canSeeIntents && (
                  <div className="text-xs text-blue-300 mt-1">
                    <Zap className="w-3 h-3 inline mr-1" />
                    AP: {enemy.currentAP}/{enemy.ap}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Attack Actions */}
      <div className="bg-gray-700 p-3 rounded space-y-3">
        {/* Weapon 1 Attacks */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2">
            {weapon1.name} ({weapon1.apCost} AP)
          </h4>
          <div className="space-y-1">
            {weapon1Targets.length > 0 ? (
              weapon1Targets.map(enemy => (
                <button
                  key={`weapon1-${enemy.id}`}
                  onClick={() => handleAttackWithAnimation(enemy, weapon1)}
                  disabled={!canAttackWeapon1 || turn !== 'player'}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-600 text-white px-2 py-1.5 rounded transition-colors text-left text-sm flex items-center gap-2"
                >
                  <Swords className="w-3 h-3" />
                  <span>Attack {enemy.name}</span>
                </button>
              ))
            ) : (
              <div className="text-xs text-gray-500 text-center py-1">
                No enemies in range
              </div>
            )}
          </div>
        </div>

        {/* Weapon 2 Attacks */}
        {weapon2 && (
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-2">
              {weapon2.name} ({weapon2.apCost} AP)
            </h4>
            <div className="space-y-1">
              {weapon2Targets.length > 0 ? (
                weapon2Targets.map(enemy => (
                  <button
                    key={`weapon2-${enemy.id}`}
                    onClick={() => handleAttackWithAnimation(enemy, weapon2)}
                    disabled={!canAttackWeapon2 || turn !== 'player'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white px-2 py-1.5 rounded transition-colors text-left text-sm flex items-center gap-2"
                  >
                    <Swords className="w-3 h-3" />
                    <span>Attack {enemy.name}</span>
                  </button>
                ))
              ) : (
                <div className="text-xs text-gray-500 text-center py-1">
                  No enemies in range
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Movement Controls */}
      <div className="bg-gray-700 p-3 rounded">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Movement (1 AP)</h4>
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <button
            onClick={() => onMove(DIRECTIONS.north)}
            disabled={!canMove || turn !== 'player'}
            className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 p-2 rounded transition-colors"
          >
            <ArrowUp className="w-5 h-5 mx-auto" />
          </button>
          <div></div>

          <button
            onClick={() => onMove(DIRECTIONS.west)}
            disabled={!canMove || turn !== 'player'}
            className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 p-2 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mx-auto" />
          </button>
          <button
            onClick={onEndTurn}
            disabled={turn !== 'player'}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-600 px-3 py-2 rounded text-sm font-semibold transition-colors"
          >
            End Turn
          </button>
          <button
            onClick={() => onMove(DIRECTIONS.east)}
            disabled={!canMove || turn !== 'player'}
            className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 p-2 rounded transition-colors"
          >
            <ArrowRight className="w-5 h-5 mx-auto" />
          </button>

          <div></div>
          <button
            onClick={() => onMove(DIRECTIONS.south)}
            disabled={!canMove || turn !== 'player'}
            className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 p-2 rounded transition-colors"
          >
            <ArrowDown className="w-5 h-5 mx-auto" />
          </button>
          <div></div>
        </div>
      </div>

      {/* Combat Log */}
      <div className="bg-gray-700 p-3 rounded">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Combat Log</h4>
        <CombatLog logs={log.map(l => l.message)} maxLogs={6} />
      </div>

      {/* Weapon Special Ability */}
      {player.weapon.specialAbility && (
        <div className="bg-purple-900 p-2 rounded text-sm">
          <div className="flex items-center gap-2 text-purple-300">
            <span className="font-semibold">✨ {player.weapon.name}</span>
          </div>
          <div className="text-xs text-purple-400 mt-1">
            {player.weapon.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatScreen;
