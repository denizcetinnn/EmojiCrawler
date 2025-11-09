import { Heart, Zap, Sparkles, Swords, Shield } from 'lucide-react';
import { getXpProgress } from '../../utils/calculations';

const StatsPanel = ({ player }) => {
  const xpProgress = getXpProgress(player.xp);
  const xpNeeded = 10;
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-3">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="font-bold">Level {player.level}</span>
        </div>
        <div className="text-sm text-gray-400">
          💰 {player.gold}g | 🔑 {player.keys}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" />
          <div className="flex-1 bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all"
              style={{ width: `${Math.max(0, (player.hp / player.maxHp) * 100)}%` }}
            />
          </div>
          <span className="text-sm">{Math.max(0, player.hp)}/{player.maxHp}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400 flex-1">
            XP: {xpProgress} / {xpNeeded}
          </div>
          <div className="text-xs text-gray-500">
            (Total: {player.xp})
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-2">
        <div className="text-xs font-semibold text-gray-400 mb-1">Stats:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>STR: {player.stats.str}</div>
          <div>DEX: {player.stats.dex}</div>
          <div>INT: {player.stats.int}</div>
          <div>CHA: {player.stats.cha}</div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-2">
        <div className="text-xs font-semibold text-gray-400 mb-1">Equipment:</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <Swords className="w-3 h-3" />
            {player.equipment.weapon1?.name || 'Fists'}
          </div>
          {player.equipment.weapon2 && (
            <div className="flex items-center gap-2">
              <Swords className="w-3 h-3 text-blue-400" />
              <span className="text-blue-300">{player.equipment.weapon2.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            {player.equipment.armor?.name || 'None'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;