import React, { useState, useEffect, useCallback } from 'react';
import { fetchRiddle, fetchHint } from '../services/geminiService';
import { Riddle, Feedback, Difficulty } from '../types';
import { saveHighScore } from '../utils/highscore';
import LoadingSpinner from './LoadingSpinner';
import Timer from './Timer';
import ScorePopup from './ScorePopup';

interface GameScreenProps {
  difficulty: Difficulty;
}

const difficultySettings = {
  [Difficulty.Easy]: {
    timer: 30,
    basePoints: 15,
    timeBonus: 3,
    hintCost: 15,
  },
  [Difficulty.Medium]: {
    timer: 20,
    basePoints: 10,
    timeBonus: 5,
    hintCost: 25,
  },
  [Difficulty.Hard]: {
    timer: 15,
    basePoints: 5,
    timeBonus: 7,
    hintCost: 40,
  },
};

const GameScreen: React.FC<GameScreenProps> = ({ difficulty }) => {
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [playerGuess, setPlayerGuess] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);

  const settings = difficultySettings[difficulty];
  const [timeLeft, setTimeLeft] = useState(settings.timer);

  const [lastPointsWon, setLastPointsWon] = useState<{ points: number; key: number } | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);


  const getNewRiddle = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    setPlayerGuess('');
    setTimeLeft(settings.timer);
    setLastPointsWon(null);
    setHint(null);
    setHintUsed(false);
    const riddle = await fetchRiddle(difficulty);
    setCurrentRiddle(riddle);
    setIsLoading(false);
  }, [difficulty, settings.timer]);

  useEffect(() => {
    // Start the first game
    setScore(0);
    getNewRiddle();
  }, [getNewRiddle]);

  const handleNext = () => {
    // If the last answer was wrong (game over), reset the score for a new game.
    if (feedback && !feedback.isCorrect) {
        setScore(0);
    }
    getNewRiddle();
  };

  useEffect(() => {
    if (isLoading || feedback) {
      return;
    }

    if (timeLeft <= 0) {
      if (currentRiddle) { 
         saveHighScore(score, difficulty);
         setFeedback({ isCorrect: false, message: `Time's up! Final Score: ${score}. The answer was ${currentRiddle.name}.` });
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isLoading, feedback, timeLeft, currentRiddle, score, difficulty]);


  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerGuess.trim() || !currentRiddle) return;

    const isCorrect = playerGuess.trim().toLowerCase() === currentRiddle.name.toLowerCase();
    
    if (isCorrect) {
      const pointsAwarded = settings.basePoints + (timeLeft * settings.timeBonus);
      setScore(prevScore => prevScore + pointsAwarded);
      setLastPointsWon({ points: pointsAwarded, key: Date.now() });
      setFeedback({ isCorrect: true, message: `Correct! +${pointsAwarded} points. The answer is ${currentRiddle.name}.` });
    } else {
      saveHighScore(score, difficulty);
      setFeedback({ isCorrect: false, message: `Game Over! Your final score: ${score}. The correct answer was ${currentRiddle.name}.` });
    }
  };

  const handleHintClick = async () => {
    if (!currentRiddle || hintUsed) return;

    setIsHintLoading(true);
    setHintUsed(true);
    setScore(prev => prev - settings.hintCost);
    
    const fetchedHint = await fetchHint(currentRiddle.name);
    setHint(fetchedHint);
    setIsHintLoading(false);
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

        {hint && (
          <div className="my-4 p-3 bg-indigo-900/50 rounded-lg text-center text-base text-indigo-200 border border-indigo-700">
            <strong>Hint:</strong> {hint}
          </div>
        )}

        {feedback ? (
          <div className="text-center mt-8">
            <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
              {feedback.isCorrect ? 'Next Riddle' : 'Play Again'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleGuessSubmit} className="mt-8">
            <div className="flex gap-2 mb-4">
               <button type="submit" disabled={!playerGuess.trim() || !!feedback} className="w-full px-8 py-3 bg-amber-500 text-gray-900 font-bold text-lg rounded-lg shadow-md hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300">
                Submit Answer
              </button>
              <button
                type="button"
                onClick={handleHintClick}
                disabled={hintUsed || isHintLoading || score < settings.hintCost}
                className="w-1/3 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                aria-label={`Get a hint for ${settings.hintCost} points`}
              >
                {isHintLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Hint (-{settings.hintCost})</span>
                )}
              </button>
            </div>
            <input
              type="text"
              value={playerGuess}
              onChange={(e) => setPlayerGuess(e.target.value)}
              placeholder="Who am I?"
              className="w-full px-4 py-3 bg-gray-900/50 border-2 border-indigo-400 rounded-lg text-white placeholder-indigo-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-center text-lg"
              disabled={!!feedback}
              aria-label="Your guess for the riddle"
            />
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
                {!isLoading && !feedback && <Timer timeLeft={timeLeft} totalTime={settings.timer} />}
            </div>
        </div>
        {renderContent()}
    </div>
  );
};

export default GameScreen;
