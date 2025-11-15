import { Difficulty, HighScore } from '../types';

const HIGH_SCORES_KEY = 'prajnaKridaHighScores';
const MAX_HIGH_SCORES_PER_DIFFICULTY = 5;

type HighScores = Record<Difficulty, HighScore[]>;

const initializeHighScores = (): HighScores => ({
    [Difficulty.Easy]: [],
    [Difficulty.Medium]: [],
    [Difficulty.Hard]: [],
});

export const getHighScores = (): HighScores => {
    try {
        const scoresJson = localStorage.getItem(HIGH_SCORES_KEY);
        if (scoresJson) {
            const scores = JSON.parse(scoresJson);
            return { ...initializeHighScores(), ...scores };
        }
    } catch (error) {
        console.error("Failed to parse high scores from localStorage", error);
    }
    return initializeHighScores();
};

export const saveHighScore = (score: number, difficulty: Difficulty): void => {
    if (score <= 0) return;

    try {
        const allScores = getHighScores();
        const difficultyScores = allScores[difficulty] || [];

        const newScore: HighScore = { score, difficulty };
        
        const updatedScores = [...difficultyScores, newScore]
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_HIGH_SCORES_PER_DIFFICULTY);
        
        if (updatedScores.some(s => s === newScore || s.score === score)) {
             allScores[difficulty] = updatedScores;
             localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(allScores));
        }

    } catch (error) {
        console.error("Failed to save high score to localStorage", error);
    }
};
