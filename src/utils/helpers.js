export const getNextPosition = (x, y, direction) => {
    const deltas = {
      north: [0, 1],
      south: [0, -1],
      east: [1, 0],
      west: [-1, 0]
    };
    const delta = deltas[direction];
    return { x: x + delta[0], y: y + delta[1] };
  };
  
  export const getOppositeDirection = (direction) => {
    const opposites = {
      north: 'south',
      south: 'north',
      east: 'west',
      west: 'east'
    };
    return opposites[direction];
  };
  
  export const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-300',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400'
    };
    return colors[rarity] || 'text-gray-300';
  };
  
  export const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  export const randomChoice = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };