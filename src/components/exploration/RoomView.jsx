import { getRoomEmoji } from '../../data/roomTemplates';

const RoomView = ({ room, enemy, gameState }) => {
  if (!room) return null;
  
  return (
    <div className="flex-1 bg-gray-800 rounded-lg border-2 border-gray-700 p-6 flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">
          {getRoomEmoji(room.type)}
        </div>
        <h2 className="text-2xl font-bold">{room.name}</h2>
        <p className="text-gray-400">{room.description}</p>
        
        {gameState === 'combat' && enemy && (
          <div className="mt-6 p-4 bg-gray-700 rounded">
            <div className="text-4xl mb-2">
              {enemy.emoji}
            </div>
            <div className="font-bold text-xl">{enemy.name}</div>
          </div>
        )}
        
        <div className="text-sm text-gray-500 mt-8">
          [Pixel art visualization would go here]
        </div>
      </div>
    </div>
  );
};

export default RoomView;