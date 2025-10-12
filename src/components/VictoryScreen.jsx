const VictoryScreen = ({ onDescend, onRestart }) => {
    return (
      <div className="space-y-4 text-center">
        <div className="text-6xl mb-4">👑</div>
        <h2 className="text-3xl font-bold text-yellow-400">Floor Cleared!</h2>
        <p className="text-gray-300">
          You have defeated the boss and conquered this floor of the dungeon!
        </p>
        <p className="text-gray-400 text-sm">
          Descend deeper to face greater challenges...
        </p>
        <div className="space-y-2 mt-6">
          <button
            onClick={onDescend}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded transition-colors font-bold"
          >
            Descend to Floor 2
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded transition-colors"
          >
            Return to Surface
          </button>
        </div>
      </div>
    );
  };
  
  export default VictoryScreen;