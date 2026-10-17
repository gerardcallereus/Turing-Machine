export type DigitValue = 1 | 2 | 3 | 4 | 5;

export type Shape = 'blue' | 'yellow' | 'purple';

export interface Code {
  blue: DigitValue;
  yellow: DigitValue;
  purple: DigitValue;
}

export interface CriterionOption {
  id: string;
  label: string;
  shortLabel: string;
  evaluate: (code: Code) => boolean;
}

export type CriterionCategory = 
  | 'value'
  | 'comparison'
  | 'count'
  | 'parity'
  | 'sum'
  | 'pattern';

export interface CriterionCard {
  id: number;
  title: string;
  category: CriterionCategory;
  description: string;
  options: CriterionOption[];
}

export interface Verifier {
  letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  cardId: number;
  activeRuleIndex: number; // 0-indexed option inside CriterionCard
}

export type Difficulty = 'Fàcil' | 'Mitjà' | 'Difícil' | 'Expert';

export interface Puzzle {
  id: string;
  title: string;
  difficulty: Difficulty;
  secretCode: Code;
  verifiers: Verifier[];
  parRounds: number;
  parQueries: number;
  description?: string;
  isDaily?: boolean;
}

export interface TestResult {
  round: number;
  verifierLetter: string;
  proposal: Code;
  passed: boolean;
  timestamp: number;
}

export interface RoundRecord {
  roundNumber: number;
  proposal: Code;
  tests: {
    letter: string;
    passed: boolean;
  }[];
  submittedGuess?: Code;
  isCorrect?: boolean;
}

export type MarkStatus = 'none' | 'eliminated' | 'confirmed' | 'unsure';

export interface DeductionSheetState {
  digits: {
    blue: Record<DigitValue, MarkStatus>;
    yellow: Record<DigitValue, MarkStatus>;
    purple: Record<DigitValue, MarkStatus>;
  };
  verifierOptions: Record<string, Record<number, MarkStatus>>; // verifierLetter -> optionIndex -> status
  customNotes: string;
}
