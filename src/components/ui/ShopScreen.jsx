import { useState, useEffect } from 'react';
import { getRarityColor } from '../../utils/helpers';

const ShopScreen = ({ shopInventory, player, onBuy, onNegotiate, onClose, room }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [negotiationBid, setNegotiationBid] = useState(0);
  const [shopkeeperAngry, setShopkeeperAngry] = useState(false);
  
  const hasIntellect = player.stats.int >= 1;
  const canSeeMinPrice = player.stats.int >= 3;
  
  // Use room's purchased items
  const purchasedItems = room?.purchasedItems || [];
  
  // Filter out purchased items and duplicates
  const availableItems = shopInventory.filter((item, index) => {
    if (purchasedItems.includes(index)) return false;
    const firstIndex = shopInventory.findIndex(i => i.name === item.name);
    return firstIndex === index;
  });
  
  const handleSelectItem = (item, itemIndex) => {
    setSelectedItem({ ...item, originalIndex: itemIndex });
    setNegotiationBid(Math.floor((item.value || 10) * 0.7));
  };
  
  const handleBuy = () => {
    if (player.gold >= selectedItem.value) {
      const success = onBuy(selectedItem, selectedItem.value);
      if (success) {
        // Mark item as purchased in room
        if (room && !room.purchasedItems.includes(selectedItem.originalIndex)) {
          room.purchasedItems.push(selectedItem.originalIndex);
        }
        setSelectedItem(null);
      }
    }
  };
  
  const handleNegotiateAttempt = () => {
    const success = onNegotiate(selectedItem, negotiationBid);
    if (success) {
      // Mark item as purchased in room
      if (room && !room.purchasedItems.includes(selectedItem.originalIndex)) {
        room.purchasedItems.push(selectedItem.originalIndex);
      }
      setSelectedItem(null);
    } else {
      setShopkeeperAngry(true);
    }
  };
  
  if (shopkeeperAngry) {
    return (
      <div className="bg-gray-700 p-4 rounded space-y-4">
        <h3 className="font-bold text-xl text-red-400">Shopkeeper is Angry!</h3>
        <p className="text-gray-300">
          "How dare you insult me with such a low offer! Get out of my shop!"
        </p>
        <button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          Leave Shop
        </button>
      </div>
    );
  }
  
  if (selectedItem) {
    const itemValue = selectedItem.value || 10;
    const minPrice = Math.floor(itemValue * Math.max(0.5, 1 - (player.stats.cha * 0.05)));
    const canAffordAskingPrice = player.gold >= itemValue;
    const canAffordBid = player.gold >= negotiationBid;
    
    return (
      <div className="bg-gray-700 p-4 rounded space-y-4">
        <h3 className="font-bold text-lg">Purchase Item</h3>
        
        <div className="bg-gray-800 p-3 rounded">
          <div className={`font-bold text-xl ${getRarityColor(selectedItem.rarity)}`}>
            {selectedItem.name}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            {selectedItem.type === 'weapon' && (
              <div>
                <div>Damage: +{selectedItem.damage} | Range: {selectedItem.range} | AP Cost: {selectedItem.apCost}</div>
                {selectedItem.description && <div className="text-xs mt-1">{selectedItem.description}</div>}
              </div>
            )}
            {selectedItem.type === 'armor' && `Defense: +${selectedItem.defense}`}
            {selectedItem.type === 'potion' && selectedItem.effect}
            {selectedItem.type === 'key' && selectedItem.effect}
            {selectedItem.effect && selectedItem.type !== 'potion' && selectedItem.type !== 'weapon' && selectedItem.type !== 'armor' && selectedItem.type !== 'key' && selectedItem.effect}
          </div>
          <div className="text-lg text-yellow-400 mt-3">
            Asking Price: {itemValue}g
          </div>
          {canSeeMinPrice && (
            <div className="text-sm text-blue-400 mt-1">
              Minimum Price: {minPrice}g (Your INT reveals this)
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleBuy}
            disabled={!canAffordAskingPrice}
            className={`w-full ${
              canAffordAskingPrice
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 cursor-not-allowed'
            } text-white px-4 py-2 rounded transition-colors`}
          >
            Buy for {itemValue}g
          </button>
          
          {hasIntellect && (
            <div className="space-y-2">
              <div className="bg-gray-800 p-3 rounded">
                <label className="text-sm text-gray-400 block mb-2">
                  Your Offer: {negotiationBid}g
                </label>
                <input
                  type="range"
                  min={Math.floor(itemValue * 0.3)}
                  max={itemValue}
                  value={negotiationBid}
                  onChange={(e) => setNegotiationBid(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{Math.floor(itemValue * 0.3)}g</span>
                  <span>{itemValue}g</span>
                </div>
              </div>
              
              <button
                onClick={handleNegotiateAttempt}
                disabled={!canAffordBid}
                className={`w-full ${
                  canAffordBid
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white px-4 py-2 rounded transition-colors`}
              >
                Offer {negotiationBid}g
              </button>
            </div>
          )}
          
          <button
            onClick={() => setSelectedItem(null)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }
  
  if (availableItems.length === 0) {
    return (
      <div className="bg-gray-700 p-4 rounded space-y-4">
        <h3 className="font-bold text-xl">Shop</h3>
        <p className="text-gray-400">The shop is sold out!</p>
        <button
          onClick={onClose}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          Leave Shop
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-700 p-4 rounded space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Shop</h3>
        <div className="text-yellow-400">{player.gold}g</div>
      </div>
      
      <p className="text-gray-400 text-sm">
        "Welcome back, traveler. What can I get for you?"
      </p>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {availableItems.map((item, idx) => {
          const originalIndex = shopInventory.indexOf(item);
          const itemValue = item.value || 10;
          
          return (
            <button
              key={originalIndex}
              onClick={() => handleSelectItem(item, originalIndex)}
              className="w-full bg-gray-800 hover:bg-gray-750 p-3 rounded transition-colors text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className={`font-semibold ${getRarityColor(item.rarity)}`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.type === 'weapon' && `+${item.damage} damage`}
                    {item.type === 'armor' && `+${item.defense} defense`}
                    {item.type === 'potion' && item.effect}
                    {item.type === 'key' && item.effect}
                    {item.effect && item.type !== 'potion' && item.type !== 'weapon' && item.type !== 'armor' && item.type !== 'key' && item.effect}
                  </div>
                </div>
                <div className="text-yellow-400 font-semibold">
                  {itemValue}g
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <button
        onClick={onClose}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
      >
        Leave Shop
      </button>
    </div>
  );
};

export default ShopScreen;