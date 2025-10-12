const ActionsList = ({ choices, onAction, onShowSkillTree, onShowInventory, onShowMap, player, onDescend }) => {
    const actionChoices = choices.filter(c => c.type !== 'move');
    
    return (
      <div className="space-y-2">
        {actionChoices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => onAction(choice)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded transition-colors text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold flex items-center gap-2">
                  {choice.name}
                  {choice.icon && <span className="text-red-400">{choice.icon}</span>}
                </div>
                <div className="text-sm text-gray-400">{choice.description}</div>
              </div>
            </div>
          </button>
        ))}
        
        {player.defeatedBoss && (
          <button
            onClick={onDescend}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-4 py-3 rounded transition-colors font-bold border-2 border-yellow-400"
          >
            ⬇️ Descend to Floor 2 ⬇️
          </button>
        )}
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={onShowSkillTree}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            Skills {player.skillPoints > 0 && `(${player.skillPoints})`}
          </button>
          <button
            onClick={onShowInventory}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors"
          >
            Inventory
          </button>
          <button
            onClick={onShowMap}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Map
          </button>
        </div>
      </div>
    );
  };
  
  export default ActionsList;