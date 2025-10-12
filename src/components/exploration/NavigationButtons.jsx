const NavigationButtons = ({ room, floorLayout, onMove }) => {
    if (!room) return null;
    
    const canAdvance = !room.actions.some(a => a.mandatory && !a.completed);
    if (!canAdvance) return null;
    
    const getNextPos = (x, y, dir) => {
      const deltas = { north: [0, 1], south: [0, -1], east: [1, 0], west: [-1, 0] };
      const delta = deltas[dir];
      return { x: x + delta[0], y: y + delta[1] };
    };
    
    const canMove = (direction) => {
      if (!room.exits[direction]) return false;
      const next = getNextPos(room.x, room.y, direction);
      return floorLayout.some(r => r.x === next.x && r.y === next.y);
    };
    
    return (
      <div className="fixed bottom-6 left-6 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold text-gray-400 mb-3 text-center">Movement</h4>
        <div className="grid grid-cols-3 gap-2 w-48">
          <div></div>
          <button
            onClick={() => onMove('north')}
            disabled={!canMove('north')}
            className={`${
              canMove('north') 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            } px-4 py-2 rounded transition-colors font-bold`}
          >
            ↑
          </button>
          <div></div>
          
          <button
            onClick={() => onMove('west')}
            disabled={!canMove('west')}
            className={`${
              canMove('west') 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            } px-4 py-2 rounded transition-colors font-bold`}
          >
            ←
          </button>
          <div className="bg-gray-700 rounded flex items-center justify-center text-gray-600">
            ⊕
          </div>
          <button
            onClick={() => onMove('east')}
            disabled={!canMove('east')}
            className={`${
              canMove('east') 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            } px-4 py-2 rounded transition-colors font-bold`}
          >
            →
          </button>
          
          <div></div>
          <button
            onClick={() => onMove('south')}
            disabled={!canMove('south')}
            className={`${
              canMove('south') 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            } px-4 py-2 rounded transition-colors font-bold`}
          >
            ↓
          </button>
          <div></div>
        </div>
      </div>
    );
  };
  
  export default NavigationButtons;