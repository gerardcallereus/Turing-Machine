import { Code, DigitValue, Puzzle, Verifier, Difficulty } from '../types/game';
import { CRITERIA_CARDS } from './criteriaCards';

// Genera tots els 125 codis possibles (1..5 per cada forma)
export const ALL_POSSIBLE_CODES: Code[] = [];
for (let b = 1; b <= 5; b++) {
  for (let y = 1; y <= 5; y++) {
    for (let p = 1; p <= 5; p++) {
      ALL_POSSIBLE_CODES.push({
        blue: b as DigitValue,
        yellow: y as DigitValue,
        purple: p as DigitValue,
      });
    }
  }
}

export function codesEqual(a: Code, b: Code): boolean {
  return a.blue === b.blue && a.yellow === b.yellow && a.purple === b.purple;
}

export function formatCode(code: Code): string {
  return `${code.blue} ${code.yellow} ${code.purple}`;
}

/**
 * Avalua si una proposta satisfà la regla activa d'un verificador donat
 */
export function evaluateVerifier(verifier: Verifier, proposal: Code): boolean {
  const card = CRITERIA_CARDS[verifier.cardId];
  if (!card) return false;
  const activeOption = card.options[verifier.activeRuleIndex];
  if (!activeOption) return false;
  return activeOption.evaluate(proposal);
}

/**
 * Troba tots els codis candidats entre els 125 que compleixen totes les regles actives
 */
export function findMatchingCodes(verifiers: Verifier[], pool = ALL_POSSIBLE_CODES): Code[] {
  return pool.filter((code) => {
    return verifiers.every((v) => evaluateVerifier(v, code));
  });
}

/**
 * Comprova si un conjunt de verificadors té exactament una solució única
 * i si tots els verificadors són imprescindibles (no redundants)
 */
export function validatePuzzle(verifiers: Verifier[]): {
  isUnique: boolean;
  uniqueCode: Code | null;
  hasRedundantVerifier: boolean;
} {
  const matches = findMatchingCodes(verifiers);
  if (matches.length !== 1) {
    return { isUnique: false, uniqueCode: null, hasRedundantVerifier: false };
  }

  let hasRedundant = false;
  for (let i = 0; i < verifiers.length; i++) {
    const subset = verifiers.filter((_, idx) => idx !== i);
    const subMatches = findMatchingCodes(subset);
    if (subMatches.length === 1) {
      hasRedundant = true;
      break;
    }
  }

  return {
    isUnique: true,
    uniqueCode: matches[0],
    hasRedundantVerifier: hasRedundant,
  };
}

/**
 * Enigmes oficials acuradament preparats per a tots els nivells didàctics
 */
export const PRESET_PUZZLES: Puzzle[] = [
  {
    id: 'enigma-01',
    title: 'Enigma #01 - Primer Contacte',
    difficulty: 'Fàcil',
    secretCode: { blue: 2, yellow: 4, purple: 1 },
    verifiers: [
      { letter: 'A', cardId: 2, activeRuleIndex: 0 }, // ▲ < 3
      { letter: 'B', cardId: 5, activeRuleIndex: 0 }, // ▲ és parell -> ▲ = 2!
      { letter: 'C', cardId: 3, activeRuleIndex: 2 }, // ■ > 3
      { letter: 'D', cardId: 6, activeRuleIndex: 0 }, // ■ és parell -> ■ = 4!
      { letter: 'E', cardId: 4, activeRuleIndex: 0 }, // ● < 3
      { letter: 'F', cardId: 7, activeRuleIndex: 1 }, // ● és senar -> ● = 1!
    ],
    parRounds: 3,
    parQueries: 6,
    description: 'Aprèn els fonaments deduint el valor de cada figura geomètrica pas a pas.',
  },
  {
    id: 'enigma-02',
    title: 'Enigma #02 - La Llei dels Senars',
    difficulty: 'Fàcil',
    secretCode: { blue: 3, yellow: 1, purple: 5 },
    verifiers: [
      { letter: 'A', cardId: 2, activeRuleIndex: 1 }, // ▲ = 3
      { letter: 'B', cardId: 16, activeRuleIndex: 0 }, // 0 parells (tots senars)
      { letter: 'C', cardId: 11, activeRuleIndex: 2 }, // ▲ > ■ -> 3 > ■ -> ■ = 1
      { letter: 'D', cardId: 13, activeRuleIndex: 0 }, // ■ < ● -> 1 < ●
      { letter: 'E', cardId: 20, activeRuleIndex: 0 }, // Tots diferents -> ● != 3, per tant ● = 5!
    ],
    parRounds: 3,
    parQueries: 7,
    description: 'Totes les figures amaguen números senars. Pots deduir el trio exacte?',
  },
  {
    id: 'enigma-03',
    title: 'Enigma #03 - Balança de Figures',
    difficulty: 'Mitjà',
    secretCode: { blue: 4, yellow: 2, purple: 5 },
    verifiers: [
      { letter: 'A', cardId: 5, activeRuleIndex: 0 }, // ▲ és parell
      { letter: 'B', cardId: 6, activeRuleIndex: 0 }, // ■ és parell -> ■ in {2, 4}
      { letter: 'C', cardId: 14, activeRuleIndex: 1 }, // ■ és estrictament el menor
      { letter: 'D', cardId: 15, activeRuleIndex: 2 }, // ● és estrictament el major
      { letter: 'E', cardId: 10, activeRuleIndex: 1 }, // Exactament 1 quatre
    ],
    parRounds: 3,
    parQueries: 8,
    description: 'Compara mides relatives i dedueix la posició i valor de cada peça.',
  },
  {
    id: 'enigma-04',
    title: 'Enigma #04 - Sumes Creuades',
    difficulty: 'Mitjà',
    secretCode: { blue: 1, yellow: 5, purple: 2 },
    verifiers: [
      { letter: 'A', cardId: 1, activeRuleIndex: 0 }, // ▲ = 1
      { letter: 'B', cardId: 19, activeRuleIndex: 1 }, // ▲ + ■ = 6 -> ■ = 5
      { letter: 'C', cardId: 4, activeRuleIndex: 0 }, // ● < 3 -> ● in {1, 2}
      { letter: 'D', cardId: 17, activeRuleIndex: 0 }, // Suma total és parell (1 + 5 + ● és parell -> ● és parell -> ● = 2!)
      { letter: 'E', cardId: 20, activeRuleIndex: 0 }, // Tots diferents
    ],
    parRounds: 4,
    parQueries: 9,
    description: 'Les relacions aritmètiques redueixen dràsticament les possibilitats.',
  },
  {
    id: 'enigma-05',
    title: 'Enigma #05 - La Paradoja de Repetició',
    difficulty: 'Difícil',
    secretCode: { blue: 3, yellow: 3, purple: 4 },
    verifiers: [
      { letter: 'A', cardId: 21, activeRuleIndex: 0 }, // Sí parella
      { letter: 'B', cardId: 11, activeRuleIndex: 1 }, // ▲ = ■
      { letter: 'C', cardId: 2, activeRuleIndex: 1 }, // ▲ = 3
      { letter: 'D', cardId: 4, activeRuleIndex: 2 }, // ● > 3
      { letter: 'E', cardId: 16, activeRuleIndex: 1 }, // 1 parell (el 4)
    ],
    parRounds: 4,
    parQueries: 10,
    description: 'Una parella oculta entre les figures posarà a prova la teva precisió.',
  },
  {
    id: 'enigma-06',
    title: 'Enigma #06 - Seqüència Estricta',
    difficulty: 'Difícil',
    secretCode: { blue: 1, yellow: 2, purple: 3 },
    verifiers: [
      { letter: 'A', cardId: 22, activeRuleIndex: 0 }, // Estricte creixent
      { letter: 'B', cardId: 18, activeRuleIndex: 1 }, // Suma = 6
      { letter: 'C', cardId: 8, activeRuleIndex: 1 }, // 1 u
      { letter: 'D', cardId: 9, activeRuleIndex: 1 }, // 1 tres
      { letter: 'E', cardId: 16, activeRuleIndex: 1 }, // 1 parell
    ],
    parRounds: 3,
    parQueries: 8,
    description: 'Un ordre matemàtic creixent amb una suma total rigorosa.',
  },
  {
    id: 'enigma-07',
    title: 'Enigma #07 - Cervell de Silici',
    difficulty: 'Expert',
    secretCode: { blue: 5, yellow: 4, purple: 2 },
    verifiers: [
      { letter: 'A', cardId: 22, activeRuleIndex: 1 }, // Estricte decreixent
      { letter: 'B', cardId: 16, activeRuleIndex: 2 }, // 2 parells
      { letter: 'C', cardId: 10, activeRuleIndex: 1 }, // 1 quatre
      { letter: 'D', cardId: 17, activeRuleIndex: 1 }, // Suma és senar
      { letter: 'E', cardId: 9, activeRuleIndex: 0 }, // 0 tresos
      { letter: 'F', cardId: 7, activeRuleIndex: 0 }, // ● és parell -> ● = 2!
    ],
    parRounds: 4,
    parQueries: 11,
    description: 'Sis verificadors interconnectats per al màxim repte computacional.',
  },
];

function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Genera l'enigma diari basat en la data (YYYY-MM-DD)
 */
export function getDailyPuzzle(dateString?: string): Puzzle {
  const dateStr = dateString || new Date().toISOString().split('T')[0];
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  const prng = createPRNG(seed);
  return generateRandomPuzzle('Mitjà', prng, `Enigma Diari (${dateStr})`, true);
}

/**
 * Generador procedural d'enigmes amb solució matemàtica única
 */
export function generateRandomPuzzle(
  difficulty: Difficulty = 'Mitjà',
  rng: () => number = Math.random,
  customTitle?: string,
  isDaily = false
): Puzzle {
  const letters: ('A' | 'B' | 'C' | 'D' | 'E' | 'F')[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  const targetVerifierCount = difficulty === 'Fàcil' ? 4 : difficulty === 'Mitjà' ? 5 : difficulty === 'Difícil' ? 5 : 6;

  const easyCards = [1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 16];
  const mediumCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const hardCards = [2, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  const allowedCardIds = difficulty === 'Fàcil' ? easyCards : difficulty === 'Mitjà' ? mediumCards : hardCards;

  for (let attempt = 0; attempt < 120; attempt++) {
    const secretCode: Code = {
      blue: (Math.floor(rng() * 5) + 1) as DigitValue,
      yellow: (Math.floor(rng() * 5) + 1) as DigitValue,
      purple: (Math.floor(rng() * 5) + 1) as DigitValue,
    };

    const shuffledCards = [...allowedCardIds].sort(() => rng() - 0.5);
    const chosenVerifiers: Verifier[] = [];

    for (const cardId of shuffledCards) {
      if (chosenVerifiers.length >= targetVerifierCount) break;

      const card = CRITERIA_CARDS[cardId];
      if (!card) continue;

      const matchingOptionIndex = card.options.findIndex((opt) => opt.evaluate(secretCode));
      if (matchingOptionIndex === -1) continue;

      chosenVerifiers.push({
        letter: letters[chosenVerifiers.length],
        cardId,
        activeRuleIndex: matchingOptionIndex,
      });
    }

    if (chosenVerifiers.length < targetVerifierCount) continue;

    const validation = validatePuzzle(chosenVerifiers);
    if (validation.isUnique && codesEqual(validation.uniqueCode!, secretCode)) {
      if (!validation.hasRedundantVerifier) {
        return {
          id: `custom-${Date.now()}-${Math.floor(rng() * 1000)}`,
          title: customTitle || `Enigma Aleatori #${Math.floor(rng() * 900 + 100)}`,
          difficulty,
          secretCode,
          verifiers: chosenVerifiers,
          parRounds: targetVerifierCount <= 4 ? 3 : 4,
          parQueries: targetVerifierCount * 2,
          isDaily,
        };
      }
    }
  }

  const fallbackPresets = PRESET_PUZZLES.filter((p) => p.difficulty === difficulty);
  const picked = fallbackPresets[Math.floor(rng() * fallbackPresets.length)] || PRESET_PUZZLES[0];
  return {
    ...picked,
    id: `custom-${Date.now()}`,
    title: customTitle || `${picked.title} (Generat)`,
    isDaily,
  };
}
