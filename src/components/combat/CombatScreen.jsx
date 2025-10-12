import { Heart } from 'lucide-react';
import CombatLog from './CombatLog';

const CombatScreen = ({ enemy, player, combatLog, onPlayerMove }) => {
  const getMoveInfo = (move) => {
    const info = {
      Punch: { cost: '2 energy', desc: 'Basic attack' },
      'Take a Breather': { cost: '0 energy', desc: 'Restore 3 energy' },
      Dodge: { 
        cost: '3 energy', 
        desc: `${Math.round((0.4 + player.stats.dex * 0.1) * 100)}% dodge chance` 
      },
      Block: { cost: '2 energy', desc: 'Reduce damage by 2' }
    };
    return info[move] || { cost: '3 energy', desc: 'Unknown' };
  };
  
  // Get all available moves including granted ones from equipped weapon
  const allMoves = [...player.moves];
  const equippedWeapon = player.equipment.weapon;
  if (equippedWeapon?.grantedMove && player.grantedMoves?.[equippedWeapon.name]) {
    const grantedMove = player.grantedMoves[equippedWeapon.name];
    allMoves.push(grantedMove.name);
  }
  
  const displayHp = Math.max(0, enemy.hp);
  const hpPercentage = Math.max(0, (displayHp / enemy.maxHp) * 100);

  return (
    <div className="space-y-4">
      <div className={`bg-gray-700 p-4 rounded ${enemy.isBoss ? 'border-2 border-red-500' : ''}`}>
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          {enemy.isBoss && <span>💀</span>}
          {enemy.name}
          {enemy.isBoss && <span>💀</span>}
        </h3>
        <div className="text-xs text-gray-400 mb-2">
          Type: {enemy.type} | Pattern: {enemy.pattern}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-red-400" />
          <div className="flex-1 bg-gray-600 rounded-full h-4">
            <div
              className={`${enemy.isBoss ? 'bg-red-600' : 'bg-red-500'} h-4 rounded-full transition-all`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          <span className="text-sm">{displayHp}/{enemy.maxHp}</span>
        </div>
      </div>

      <CombatLog logs={combatLog} />

      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-400">Your Moves:</h4>
        {allMoves.map((move, idx) => {
          // Check if it's a granted move
          const isGrantedMove = equippedWeapon?.grantedMove?.name === move;
          let moveInfo;
          
          if (isGrantedMove) {
            const grantedMove = player.grantedMoves[equippedWeapon.name];
            moveInfo = {
              cost: `${grantedMove.energyCost} energy`,
              desc: grantedMove.description
            };
          } else {
            moveInfo = getMoveInfo(move);
          }
          
          return (
            <button
              key={idx}
              onClick={() => onPlayerMove(move)}
              className={`w-full ${
                isGrantedMove 
                  ? 'bg-purple-600 hover:bg-purple-700 border-2 border-yellow-400' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-4 py-2 rounded transition-colors text-left`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{move}</span>
                <span className="text-xs">{moveInfo.cost}</span>
              </div>
              <div className="text-xs text-blue-200">{moveInfo.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CombatScreen;