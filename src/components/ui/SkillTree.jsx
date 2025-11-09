const SkillTree = ({ player, onSpendPoint, onClose }) => {
    const statDescriptions = {
      str: 'Increases damage',
      dex: '+1 AP per 3 DEX, increases crit & dodge',
      int: 'Reveals traps & risks',
      cha: 'Better shop prices'
    };
  
    return (
      <div className="bg-gray-700 p-4 rounded space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Skill Tree</h3>
          <span className="text-yellow-400">{player.skillPoints} points</span>
        </div>
        
        {Object.entries(player.stats).map(([stat, value]) => (
          <div key={stat} className="flex items-center justify-between">
            <div>
              <span className="uppercase text-sm font-semibold">
                {stat}: {value}
              </span>
              <div className="text-xs text-gray-400">
                {statDescriptions[stat]}
              </div>
            </div>
            <button
              onClick={() => onSpendPoint(stat)}
              disabled={player.skillPoints === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors"
            >
              +1
            </button>
          </div>
        ))}
        
        <button
          onClick={onClose}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors mt-4"
        >
          Back
        </button>
      </div>
    );
  };
  
  export default SkillTree;