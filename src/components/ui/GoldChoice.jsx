const GoldChoice = ({ goldAmount, onCollect, onLeave }) => {
    return (
      <div className="bg-gray-700 p-4 rounded space-y-4">
        <p className="text-gray-300">You found {goldAmount} gold!</p>
        
        <button
          onClick={onCollect}
          className="w-full bg-gray-800 hover:bg-gray-750 p-4 rounded transition-all hover:scale-105 text-center border-2 border-transparent hover:border-yellow-500"
        >
          <div className="text-4xl mb-2">💰</div>
          <div className="font-bold text-xl text-yellow-400">{goldAmount} Gold</div>
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
  
  export default GoldChoice;