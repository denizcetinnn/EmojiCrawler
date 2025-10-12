import { Swords, Shield, Trash2 } from 'lucide-react';
import { getRarityColor } from '../../utils/helpers';

const Inventory = ({ player, onEquipItem, onTrashItem, onClose }) => {
  const handleEquip = (item) => {
    onEquipItem(item);
  };
  
  return (
    <div className="bg-gray-700 p-4 rounded space-y-3 max-h-[80vh] overflow-y-auto">
      <h3 className="font-bold">Inventory</h3>
      
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Equipped:</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4" />
            Weapon: {player.equipment.weapon 
              ? `${player.equipment.weapon.name} (+${player.equipment.weapon.damage} dmg)` 
              : 'None'}
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Armor: {player.equipment.armor 
              ? `${player.equipment.armor.name} (+${player.equipment.armor.defense} def)` 
              : 'None'}
          </div>
        </div>
      </div>
      
      {player.inventory.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Items:</h4>
          <div className="space-y-1">
            {player.inventory.map((item, idx) => {
              const isEquipped = (item.type === 'weapon' && player.equipment.weapon?.name === item.name) ||
                                 (item.type === 'armor' && player.equipment.armor?.name === item.name);
              
              return (
                <div key={idx} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                  <div className="text-sm flex-1">
                    <div className={`font-semibold ${getRarityColor(item.rarity)}`}>
                      {item.name} {isEquipped && '(Equipped)'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.type === 'weapon' 
                        ? `+${item.damage} damage` 
                        : `+${item.defense} defense`}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!isEquipped && (
                      <button
                        onClick={() => handleEquip(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                      >
                        Equip
                      </button>
                    )}
                    <button
                      onClick={() => onTrashItem(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs"
                      title="Trash item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {player.relics.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Relics:</h4>
          <div className="space-y-1">
            {player.relics.map((relic, idx) => (
              <div key={idx} className="bg-gray-800 p-2 rounded text-sm">
                <div className="font-semibold text-yellow-400">{relic.name}</div>
                <div className="text-xs text-gray-400">{relic.effect}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={onClose}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
      >
        Back
      </button>
    </div>
  );
};

export default Inventory;