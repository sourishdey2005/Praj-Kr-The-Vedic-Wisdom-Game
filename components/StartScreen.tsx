
import React, { useState } from 'react';
import { Difficulty } from '../types';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.Medium);

  const difficultyClasses = (level: Difficulty) => 
    `px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
      selectedDifficulty === level 
        ? 'bg-amber-500 text-gray-900 scale-105 shadow-lg' 
        : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'
    }`;

  return (
    <div className="text-center p-8 bg-black bg-opacity-30 rounded-2xl shadow-2xl backdrop-blur-md border border-indigo-500/30">
      <h1 className="font-vedic text-5xl md:text-7xl font-bold text-amber-300 drop-shadow-lg">
        Prajñā Krīḍā
      </h1>
      <p className="mt-4 text-lg md:text-xl text-indigo-200">The Vedic Wisdom Game</p>
      <p className="mt-6 max-w-xl mx-auto text-gray-300">
        Test your knowledge of the ancient sages and deities. An AI will craft a riddle about a figure from Vedic lore. Can you guess who it is?
      </p>
      
      <div className="mt-8">
        <p className="text-lg text-indigo-200 mb-3">Choose your challenge:</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setSelectedDifficulty(Difficulty.Easy)} className={difficultyClasses(Difficulty.Easy)}>
            Easy
          </button>
          <button onClick={() => setSelectedDifficulty(Difficulty.Medium)} className={difficultyClasses(Difficulty.Medium)}>
            Medium
          </button>
          <button onClick={() => setSelectedDifficulty(Difficulty.Hard)} className={difficultyClasses(Difficulty.Hard)}>
            Hard
          </button>
        </div>
      </div>

      <button
        onClick={() => onStart(selectedDifficulty)}
        className="mt-10 px-12 py-4 bg-amber-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300"
      >
        Begin the Challenge
      </button>
    </div>
  );
};

export default StartScreen;