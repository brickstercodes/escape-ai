export type PuzzleType = 'text' | 'image' | 'voice' | 'pattern' | 'timing' | 'creative';

export interface AIConfig {
  provider: 'gemini' | 'fal';
  model?: string;
  temperature?: number;
}

export interface CreativeEncounterConfig {
  availableItems: string[];
  scenario: string;
  creatureWeaknesses?: string[];
  healthPoints?: number;
}

export interface Puzzle {
  id: string;
  type: PuzzleType;
  question: string;
  answer: string;
  hints: string[];
  aiConfig?: AIConfig;
  validateWith?: 'exact' | 'ai';
  creativeConfig?: CreativeEncounterConfig; // New field for creative encounters
}

export interface Level {
  id: string;
  name: string;
  description: string;
  puzzles: Puzzle[];
  storyIntro?: string;  // Story introduction for this level
  storyOutro?: string;  // Story conclusion after completing this level
}

export interface GameState {
  currentLevelId: string;
  currentPuzzleIndex: number;
  completedPuzzles: string[];
  hintsUsed: Record<string, number>;
  isLoading: boolean;
  error?: string;
}
