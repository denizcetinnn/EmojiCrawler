import { Map as MapIcon, X } from 'lucide-react';
import { getRoomEmoji } from '../../data/roomTemplates';

const Map = ({ floorLayout, currentRoomPos, onClose, hasMap }) => {
  if (!hasMap) {
    return (
      <div className="bg-gray-700 p-4 rounded">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold flex items-center gap-2">
            <MapIcon className="w-5 h-5" />
            Dungeon Map
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-400 text-sm">You need to find the book and quill first!</p>
      </div>
    );
  }
  
  const visitedRooms = floorLayout.filter(r => r.visited);
  
  if (visitedRooms.length === 0) return null;
  
  const minX = Math.min(...visitedRooms.map(r => r.x));
  const maxX = Math.max(...visitedRooms.map(r => r.x));
  const minY = Math.min(...visitedRooms.map(r => r.y));
  const maxY = Math.max(...visitedRooms.map(r => r.y));
  
  const grid = [];
  for (let y = maxY; y >= minY; y--) {
    const row = [];
    for (let x = minX; x <= maxX; x++) {
      const room = visitedRooms.find(r => r.x === x && r.y === y);
      row.push(room);
    }
    grid.push(row);
  }
  
  const hasConnection = (room, direction) => {
    if (!room || !room.exits[direction]) return false;
    const deltas = { north: [0, 1], south: [0, -1], east: [1, 0], west: [-1, 0] };
    const [dx, dy] = deltas[direction];
    const neighborRoom = visitedRooms.find(r => r.x === room.x + dx && r.y === room.y + dy);
    return !!neighborRoom;
  };
  
  return (
    <div className="bg-gray-700 p-4 rounded">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold flex items-center gap-2">
          <MapIcon className="w-5 h-5" />
          Dungeon Map
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-0">
        {grid.map((row, y) => (
          <div key={y}>
            <div className="flex gap-0">
              {row.map((room, x) => {
                if (!room) {
                  return <div key={x} className="w-16 h-16" />;
                }
                
                const isCurrent = room.x === currentRoomPos?.x && room.y === currentRoomPos?.y;
                const isLocked = room.locked;
                
                return (
                  <div key={x} className="relative w-16 h-16">
                    {hasConnection(room, 'north') && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gray-500" />
                    )}
                    
                    {hasConnection(room, 'south') && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gray-500" />
                    )}
                    
                    {hasConnection(room, 'east') && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-0.5 w-2 bg-gray-500" />
                    )}
                    
                    {hasConnection(room, 'west') && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-0.5 w-2 bg-gray-500" />
                    )}
                    
                    <div
                      className={`absolute top-2 left-2 w-12 h-12 rounded flex items-center justify-center text-xl ${
                        isCurrent ? 'bg-blue-500' : 
                        room.type === 'boss' ? 'bg-red-600' :
                        'bg-gray-600'
                      }`}
                    >
                      {getRoomEmoji(room.type, isLocked)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-400 space-y-1">
        <div>🏠 Start | ⚔️ Combat | 💎 Treasure | 🔒 Locked</div>
        <div>🏪 Shop | 🔥 Rest | 📖 Event | 👑 Boss</div>
      </div>
    </div>
  );
};

export default Map;