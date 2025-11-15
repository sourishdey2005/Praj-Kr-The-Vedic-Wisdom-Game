
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center p-8 bg-black bg-opacity-30 rounded-2xl shadow-2xl backdrop-blur-md border border-indigo-500/30">
      <h1 className="font-vedic text-5xl md:text-7xl font-bold text-amber-300 drop-shadow-lg">
        Prajñā Krīḍā
      </h1>
      <p className="mt-4 text-lg md:text-xl text-indigo-200">The Vedic Wisdom Game</p>
      <p className="mt-6 max-w-xl mx-auto text-gray-300">
        Test your knowledge of the ancient sages and deities. An AI will craft a riddle about a figure from Vedic lore. Can you guess who it is?
      </p>
      <button
        onClick={onStart}
        className="mt-10 px-12 py-4 bg-amber-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300"
      >
        Begin the Challenge
      </button>
    </div>
  );
};

export default StartScreen;
   