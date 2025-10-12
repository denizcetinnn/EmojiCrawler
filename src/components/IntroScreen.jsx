import { Skull } from 'lucide-react';

const IntroScreen = ({ dialogue, playthroughCount, onStart }) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 leading-relaxed">{dialogue}</p>
      
      {playthroughCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gray-700 rounded">
          <Skull className="w-6 h-6 text-red-400" />
          <p className="text-red-400 italic">
            The old man points to a pile of {playthroughCount} skeleton{playthroughCount > 1 ? 's' : ''}.
            "Others have tried... and failed."
          </p>
        </div>
      )}
      
      <div className="space-y-2 mt-6">
        <button
          onClick={onStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded transition-colors"
        >
          "Where am I? What is this place?"
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;