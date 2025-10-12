import { getRarityColor } from '../../utils/helpers';

const ItemChoice = ({ itemChoice, onTakeItem, onLeave }) => {
  const { item, message } = itemChoice;
  
  return (
    <div className="bg-gray-700 p-4 rounded space-y-4">
      <p className="text-gray-300">{message}</p>
      <p className="text-sm text-gray-400 italic">Click the item to take it.</p>
      
      <button
        onClick={() => onTakeItem(item)}
        className="w-full bg-gray-800 hover:bg-gray-750 p-4 rounded transition-all hover:scale-105 text-left border-2 border-transparent hover:border-green-500"
      >
        <div className={`font-bold text-xl ${getRarityColor(item.rarity)}`}>
          {item.name}
        </div>
        <div className="text-sm text-gray-400 mt-2">
          {item.type === 'weapon' && `Damage: +${item.damage}`}
          {item.type === 'armor' && `Defense: +${item.defense}`}
          {item.effect && item.effect}
        </div>
        {item.rarity && (
          <div className="text-xs text-gray-500 mt-2">
            Rarity: {item.rarity}
          </div>
        )}
      </button>
      
      <button
        onClick={onLeave}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
      >
        Leave It
      </button>
    </div>
  );
};

export default ItemChoice;