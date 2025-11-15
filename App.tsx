
import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import { GameState, Difficulty } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState(GameState.Playing);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.Start:
        return <StartScreen onStart={startGame} />;
      case GameState.Playing:
        return <GameScreen difficulty={difficulty} />;
      default:
        return <StartScreen onStart={startGame} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;