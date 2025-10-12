import { Skull } from 'lucide-react';

const GameOverScreen = ({ onRestart }) => {
  return (
    <div className="space-y-4 text-center">
      <Skull className="w-16 h-16 mx-auto text-red-500" />
      <h2 className="text-2xl font-bold text-red-400">You Died</h2>
      <p className="text-gray-400">The dungeon claims another victim...</p>
      <button
        onClick={onRestart}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default GameOverScreen;