
export enum GameState {
    Start = 'START',
    Playing = 'PLAYING',
}

export interface Riddle {
    riddle: string;
    name: string;
}

export interface Feedback {
    isCorrect: boolean;
    message: string;
}
   