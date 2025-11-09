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
            Weapon 1: {player.equipment.weapon1
              ? `${player.equipment.weapon1.name} (+${player.equipment.weapon1.damage} dmg, Range ${player.equipment.weapon1.range})`
              : 'None'}
          </div>
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-blue-400" />
            Weapon 2: {player.equipment.weapon2
              ? `${player.equipment.weapon2.name} (+${player.equipment.weapon2.damage} dmg, Range ${player.equipment.weapon2.range})`
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
              const isEquippedWeapon1 = (item.type === 'weapon' && player.equipment.weapon1?.name === item.name);
              const isEquippedWeapon2 = (item.type === 'weapon' && player.equipment.weapon2?.name === item.name);
              const isEquippedArmor = (item.type === 'armor' && player.equipment.armor?.name === item.name);
              const isEquipped = isEquippedWeapon1 || isEquippedWeapon2 || isEquippedArmor;

              return (
                <div key={idx} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                  <div className="text-sm flex-1">
                    <div className={`font-semibold ${getRarityColor(item.rarity)}`}>
                      {item.name} {isEquippedWeapon1 && '(Slot 1)'} {isEquippedWeapon2 && '(Slot 2)'} {isEquippedArmor && '(Equipped)'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.type === 'weapon'
                        ? `+${item.damage} damage | Range ${item.range} | ${item.apCost} AP`
                        : `+${item.defense} defense`}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {item.type === 'weapon' && (
                      <>
                        {!isEquippedWeapon1 && (
                          <button
                            onClick={() => onEquipItem(item, 'weapon1')}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                          >
                            Slot 1
                          </button>
                        )}
                        {!isEquippedWeapon2 && (
                          <button
                            onClick={() => onEquipItem(item, 'weapon2')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                          >
                            Slot 2
                          </button>
                        )}
                      </>
                    )}
                    {item.type === 'armor' && !isEquipped && (
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