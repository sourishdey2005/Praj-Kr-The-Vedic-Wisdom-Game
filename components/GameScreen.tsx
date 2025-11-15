import React, { useState, useEffect, useCallback } from 'react';
import { fetchRiddle } from '../services/geminiService';
import { Riddle, Feedback } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Timer from './Timer';
import ScorePopup from './ScorePopup';

const TIMER_DURATION = 20; // 20 seconds per riddle

const GameScreen: React.FC = () => {
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [playerGuess, setPlayerGuess] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [lastPointsWon, setLastPointsWon] = useState<{ points: number; key: number } | null>(null);


  const getNewRiddle = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    setPlayerGuess('');
    setTimeLeft(TIMER_DURATION);
    setLastPointsWon(null);
    const riddle = await fetchRiddle();
    setCurrentRiddle(riddle);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getNewRiddle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading || feedback) {
      return;
    }

    if (timeLeft <= 0) {
      if (currentRiddle) { 
         setFeedback({ isCorrect: false, message: `Time's up! The correct answer was ${currentRiddle.name}.` });
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isLoading, feedback, timeLeft, currentRiddle]);


  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerGuess.trim() || !currentRiddle) return;

    const isCorrect = playerGuess.trim().toLowerCase() === currentRiddle.name.toLowerCase();
    
    if (isCorrect) {
      const pointsAwarded = 10 + (timeLeft * 5); // Base 10 points + 5 points per second left
      setScore(prevScore => prevScore + pointsAwarded);
      setLastPointsWon({ points: pointsAwarded, key: Date.now() });
      setFeedback({ isCorrect: true, message: `Correct! +${pointsAwarded} points. The answer is ${currentRiddle.name}.` });
    } else {
      setFeedback({ isCorrect: false, message: `Not quite. The correct answer was ${currentRiddle.name}.` });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <LoadingSpinner />
          <p className="mt-4 text-indigo-300">Summoning a new riddle from the cosmos...</p>
        </div>
      );
    }

    if (!currentRiddle) {
        return <p className="text-center text-red-400">Could not fetch a riddle. Please try again later.</p>
    }

    return (
      <div className="transition-opacity duration-500 ease-in-out animate-[fadeIn_1s]">
        <div className="mb-4 text-center">
            <h2 className="font-vedic text-3xl text-amber-300">The Riddle</h2>
        </div>
        <p className="text-xl md:text-2xl text-center text-indigo-100 leading-relaxed min-h-[100px]">
          {currentRiddle.riddle}
        </p>
        
        {feedback && (
          <div className={`my-6 p-4 rounded-lg text-center text-lg font-semibold ${feedback.isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {feedback.message}
          </div>
        )}

        {feedback ? (
          <div className="text-center mt-8">
            <button onClick={getNewRiddle} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
              Next Riddle
            </button>
          </div>
        ) : (
          <form onSubmit={handleGuessSubmit} className="mt-8">
            <input
              type="text"
              value={playerGuess}
              onChange={(e) => setPlayerGuess(e.target.value)}
              placeholder="Who am I?"
              className="w-full px-4 py-3 bg-gray-900/50 border-2 border-indigo-400 rounded-lg text-white placeholder-indigo-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-center text-lg"
              disabled={!!feedback}
              aria-label="Your guess for the riddle"
            />
            <button type="submit" disabled={!playerGuess.trim() || !!feedback} className="w-full mt-4 px-8 py-3 bg-amber-500 text-gray-900 font-bold text-lg rounded-lg shadow-md hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300">
              Submit Answer
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 bg-black bg-opacity-30 rounded-2xl shadow-2xl backdrop-blur-md border border-indigo-500/30 w-full">
        <div className="flex justify-between items-center mb-6">
            <h1 className="font-vedic text-3xl font-bold text-amber-300">Prajñā Krīḍā</h1>
            <div className="flex items-center space-x-2 md:space-x-4">
                <div className="relative text-lg font-bold bg-indigo-500/30 px-4 py-2 rounded-lg">
                    Score: <span className="text-amber-300">{score}</span>
                    {lastPointsWon && <ScorePopup key={lastPointsWon.key} points={lastPointsWon.points} />}
                </div>
                {!isLoading && !feedback && <Timer timeLeft={timeLeft} totalTime={TIMER_DURATION} />}
            </div>
        </div>
        {renderContent()}
    </div>
  );
};

export default GameScreen;