export enum GameState {
    Start = 'START',
    Playing = 'PLAYING',
}

export enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export interface Riddle {
    riddle: string;
    name: string;
}

export interface Feedback {
    isCorrect: boolean;
    message: string;
}

export interface HighScore {
  score: number;
  difficulty: Difficulty;
}
