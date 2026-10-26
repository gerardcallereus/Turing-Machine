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
 * Enigmes oficials preparats amb progressió gradual (començant per 4 verificadors clars)
 */
export const PRESET_PUZZLES: Puzzle[] = [
  {
    id: 'enigma-01',
    title: 'Enigma #01 - Primer Contacte',
    difficulty: 'Fàcil',
    secretCode: { blue: 1, yellow: 4, purple: 3 },
    verifiers: [
      { letter: 'A', cardId: 1, activeRuleIndex: 0 }, // ▲ = 1
      { letter: 'B', cardId: 3, activeRuleIndex: 2 }, // ■ > 3 (4 o 5)
      { letter: 'C', cardId: 6, activeRuleIndex: 0 }, // ■ és Parell (2 o 4) -> ■ = 4!
      { letter: 'D', cardId: 4, activeRuleIndex: 1 }, // ● = 3
    ],
    parRounds: 2,
    parQueries: 4,
    description: '4 verificadors molt directes per descobrir cada figura pas a pas.',
  },
  {
    id: 'enigma-02',
    title: 'Enigma #02 - Tot Senars',
    difficulty: 'Fàcil',
    secretCode: { blue: 3, yellow: 1, purple: 5 },
    verifiers: [
      { letter: 'A', cardId: 2, activeRuleIndex: 1 }, // ▲ = 3
      { letter: 'B', cardId: 3, activeRuleIndex: 0 }, // ■ < 3 (1 o 2)
      { letter: 'C', cardId: 4, activeRuleIndex: 2 }, // ● > 3 (4 o 5)
      { letter: 'D', cardId: 16, activeRuleIndex: 0 }, // 0 parells (tots senars) -> ■=1 i ●=5!
    ],
    parRounds: 2,
    parQueries: 4,
    description: 'Combina les pistes de cada figura amb una pista final sobre números parells i senars.',
  },
  {
    id: 'enigma-03',
    title: 'Enigma #03 - Escala de Figures',
    difficulty: 'Fàcil',
    secretCode: { blue: 2, yellow: 4, purple: 5 },
    verifiers: [
      { letter: 'A', cardId: 5, activeRuleIndex: 0 }, // ▲ és Parell (2 o 4)
      { letter: 'B', cardId: 6, activeRuleIndex: 0 }, // ■ és Parell (2 o 4)
      { letter: 'C', cardId: 11, activeRuleIndex: 0 }, // ▲ < ■ -> ▲=2 i ■=4!
      { letter: 'D', cardId: 13, activeRuleIndex: 0 }, // ■ < ● -> ●=5!
    ],
    parRounds: 2,
    parQueries: 4,
    description: 'Compara quina figura és més gran que l’altra per ordenar el codi.',
  },
  {
    id: 'enigma-04',
    title: 'Enigma #04 - Suma Exacta',
    difficulty: 'Mitjà',
    secretCode: { blue: 1, yellow: 5, purple: 2 },
    verifiers: [
      { letter: 'A', cardId: 1, activeRuleIndex: 0 }, // ▲ = 1
      { letter: 'B', cardId: 19, activeRuleIndex: 1 }, // ▲ + ■ = 6 -> ■ = 5
      { letter: 'C', cardId: 4, activeRuleIndex: 0 }, // ● < 3 (1 o 2)
      { letter: 'D', cardId: 20, activeRuleIndex: 0 }, // Tots 3 diferents -> ● = 2!
    ],
    parRounds: 2,
    parQueries: 4,
    description: 'Fes servir la suma de les dues primeres figures per deduir el codi.',
  },
  {
    id: 'enigma-05',
    title: 'Enigma #05 - Balança de Figures',
    difficulty: 'Mitjà',
    secretCode: { blue: 4, yellow: 2, purple: 5 },
    verifiers: [
      { letter: 'A', cardId: 5, activeRuleIndex: 0 }, // ▲ és parell (2 o 4)
      { letter: 'B', cardId: 6, activeRuleIndex: 0 }, // ■ és parell (2 o 4)
      { letter: 'C', cardId: 14, activeRuleIndex: 1 }, // ■ és el més petit -> ■=2, ▲=4
      { letter: 'D', cardId: 15, activeRuleIndex: 2 }, // ● és el més gran -> ●=5
    ],
    parRounds: 2,
    parQueries: 4,
    description: 'Descobreix quina figura és la més petita i quina és la més gran.',
  },
  {
    id: 'enigma-06',
    title: 'Enigma #06 - La Parella Oculta',
    difficulty: 'Difícil',
    secretCode: { blue: 3, yellow: 3, purple: 4 },
    verifiers: [
      { letter: 'A', cardId: 11, activeRuleIndex: 1 }, // ▲ = ■
      { letter: 'B', cardId: 2, activeRuleIndex: 1 }, // ▲ = 3 -> ▲=3 i ■=3
      { letter: 'C', cardId: 4, activeRuleIndex: 2 }, // ● > 3 (4 o 5)
      { letter: 'D', cardId: 16, activeRuleIndex: 1 }, // 1 parell -> ●=4!
    ],
    parRounds: 2,
    parQueries: 4,
    description: 'Atenció: en aquest codi hi ha dues figures amb el mateix número!',
  },
  {
    id: 'enigma-07',
    title: 'Enigma #07 - Repte de Criptògraf',
    difficulty: 'Expert',
    secretCode: { blue: 5, yellow: 4, purple: 2 },
    verifiers: [
      { letter: 'A', cardId: 11, activeRuleIndex: 2 }, // ▲ > ■
      { letter: 'B', cardId: 13, activeRuleIndex: 2 }, // ■ > ●
      { letter: 'C', cardId: 7, activeRuleIndex: 0 }, // ● és parell (2 o 4) -> ●=2
      { letter: 'D', cardId: 9, activeRuleIndex: 0 }, // Cap número 3 -> ▲=5, ■=4, ●=2!
    ],
    parRounds: 2,
    parQueries: 4,
    description: 'Quatre verificadors entrellaçats per posar a prova tota la teva lògica.',
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
  return generateRandomPuzzle('Fàcil', prng, `Enigma Diari (${dateStr})`, true);
}

/**
 * Generador procedural d'enigmes amb solució matemàtica única
 */
export function generateRandomPuzzle(
  difficulty: Difficulty = 'Fàcil',
  rng: () => number = Math.random,
  customTitle?: string,
  isDaily = false
): Puzzle {
  const letters: ('A' | 'B' | 'C' | 'D' | 'E' | 'F')[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  const targetVerifierCount = difficulty === 'Fàcil' ? 4 : difficulty === 'Mitjà' ? 4 : difficulty === 'Difícil' ? 5 : 6;

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
          parRounds: targetVerifierCount <= 4 ? 2 : 3,
          parQueries: targetVerifierCount + 1,
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
