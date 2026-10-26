import { CriterionCard, Code } from '../types/game';

export const CRITERIA_CARDS: Record<number, CriterionCard> = {
  1: {
    id: 1,
    title: 'Comparar ▲ amb el número 1',
    category: 'value',
    description: 'Mira si el Triangle Blau (▲) és 1 o és més gran que 1.',
    options: [
      {
        id: '1-0',
        label: '▲ és igual a 1',
        shortLabel: '▲ = 1',
        evaluate: (c: Code) => c.blue === 1,
      },
      {
        id: '1-1',
        label: '▲ és més gran que 1 (2, 3, 4 o 5)',
        shortLabel: '▲ > 1',
        evaluate: (c: Code) => c.blue > 1,
      },
    ],
  },
  2: {
    id: 2,
    title: 'Comparar ▲ amb el número 3',
    category: 'value',
    description: 'Compara el Triangle Blau (▲) amb el 3.',
    options: [
      {
        id: '2-0',
        label: '▲ és més petit que 3 (1 o 2)',
        shortLabel: '▲ < 3',
        evaluate: (c: Code) => c.blue < 3,
      },
      {
        id: '2-1',
        label: '▲ és igual a 3',
        shortLabel: '▲ = 3',
        evaluate: (c: Code) => c.blue === 3,
      },
      {
        id: '2-2',
        label: '▲ és més gran que 3 (4 o 5)',
        shortLabel: '▲ > 3',
        evaluate: (c: Code) => c.blue > 3,
      },
    ],
  },
  3: {
    id: 3,
    title: 'Comparar ■ amb el número 3',
    category: 'value',
    description: 'Compara el Quadrat Groc (■) amb el 3.',
    options: [
      {
        id: '3-0',
        label: '■ és més petit que 3 (1 o 2)',
        shortLabel: '■ < 3',
        evaluate: (c: Code) => c.yellow < 3,
      },
      {
        id: '3-1',
        label: '■ és igual a 3',
        shortLabel: '■ = 3',
        evaluate: (c: Code) => c.yellow === 3,
      },
      {
        id: '3-2',
        label: '■ és més gran que 3 (4 o 5)',
        shortLabel: '■ > 3',
        evaluate: (c: Code) => c.yellow > 3,
      },
    ],
  },
  4: {
    id: 4,
    title: 'Comparar ● amb el número 3',
    category: 'value',
    description: 'Compara el Cercle Morat (●) amb el 3.',
    options: [
      {
        id: '4-0',
        label: '● és més petit que 3 (1 o 2)',
        shortLabel: '● < 3',
        evaluate: (c: Code) => c.purple < 3,
      },
      {
        id: '4-1',
        label: '● és igual a 3',
        shortLabel: '● = 3',
        evaluate: (c: Code) => c.purple === 3,
      },
      {
        id: '4-2',
        label: '● és més gran que 3 (4 o 5)',
        shortLabel: '● > 3',
        evaluate: (c: Code) => c.purple > 3,
      },
    ],
  },
  5: {
    id: 5,
    title: '▲ és Parell o Senar?',
    category: 'parity',
    description: 'Mira si el Triangle Blau (▲) és parell o senar.',
    options: [
      {
        id: '5-0',
        label: '▲ és Parell (2 o 4)',
        shortLabel: '▲ és Parell',
        evaluate: (c: Code) => c.blue % 2 === 0,
      },
      {
        id: '5-1',
        label: '▲ és Senar (1, 3 o 5)',
        shortLabel: '▲ és Senar',
        evaluate: (c: Code) => c.blue % 2 !== 0,
      },
    ],
  },
  6: {
    id: 6,
    title: '■ és Parell o Senar?',
    category: 'parity',
    description: 'Mira si el Quadrat Groc (■) és parell o senar.',
    options: [
      {
        id: '6-0',
        label: '■ és Parell (2 o 4)',
        shortLabel: '■ és Parell',
        evaluate: (c: Code) => c.yellow % 2 === 0,
      },
      {
        id: '6-1',
        label: '■ és Senar (1, 3 o 5)',
        shortLabel: '■ és Senar',
        evaluate: (c: Code) => c.yellow % 2 !== 0,
      },
    ],
  },
  7: {
    id: 7,
    title: '● és Parell o Senar?',
    category: 'parity',
    description: 'Mira si el Cercle Morat (●) és parell o senar.',
    options: [
      {
        id: '7-0',
        label: '● és Parell (2 o 4)',
        shortLabel: '● és Parell',
        evaluate: (c: Code) => c.purple % 2 === 0,
      },
      {
        id: '7-1',
        label: '● és Senar (1, 3 o 5)',
        shortLabel: '● és Senar',
        evaluate: (c: Code) => c.purple % 2 !== 0,
      },
    ],
  },
  8: {
    id: 8,
    title: 'Quants números 1 hi ha?',
    category: 'count',
    description: 'Compta quantes vegades surt el número 1 al codi.',
    options: [
      {
        id: '8-0',
        label: 'Cap número 1 (0 uns)',
        shortLabel: '0 uns (cap)',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 1).length === 0,
      },
      {
        id: '8-1',
        label: 'Exactament un 1',
        shortLabel: '1 u',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 1).length === 1,
      },
      {
        id: '8-2',
        label: 'Exactament dos 1',
        shortLabel: '2 uns',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 1).length === 2,
      },
      {
        id: '8-3',
        label: 'Tots tres són 1 (1-1-1)',
        shortLabel: '3 uns',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 1).length === 3,
      },
    ],
  },
  9: {
    id: 9,
    title: 'Quants números 3 hi ha?',
    category: 'count',
    description: 'Compta quantes vegades surt el número 3 al codi.',
    options: [
      {
        id: '9-0',
        label: 'Cap número 3 (0 tresos)',
        shortLabel: '0 tresos',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 3).length === 0,
      },
      {
        id: '9-1',
        label: 'Exactament un 3',
        shortLabel: '1 tres',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 3).length === 1,
      },
      {
        id: '9-2',
        label: 'Dos o tres números 3',
        shortLabel: '≥ 2 tresos',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 3).length >= 2,
      },
    ],
  },
  10: {
    id: 10,
    title: 'Quants números 4 hi ha?',
    category: 'count',
    description: 'Compta quantes vegades surt el número 4 al codi.',
    options: [
      {
        id: '10-0',
        label: 'Cap número 4 (0 quatres)',
        shortLabel: '0 quatre',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 4).length === 0,
      },
      {
        id: '10-1',
        label: 'Exactament un 4',
        shortLabel: '1 quatre',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 4).length === 1,
      },
      {
        id: '10-2',
        label: 'Dos o tres números 4',
        shortLabel: '≥ 2 quatre',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 4).length >= 2,
      },
    ],
  },
  11: {
    id: 11,
    title: 'Qui és més gran: ▲ o ■?',
    category: 'comparison',
    description: 'Compara el Triangle Blau (▲) amb el Quadrat Groc (■).',
    options: [
      {
        id: '11-0',
        label: '▲ és més petit que ■ (▲ < ■)',
        shortLabel: '▲ < ■',
        evaluate: (c: Code) => c.blue < c.yellow,
      },
      {
        id: '11-1',
        label: '▲ és igual a ■ (▲ = ■)',
        shortLabel: '▲ = ■',
        evaluate: (c: Code) => c.blue === c.yellow,
      },
      {
        id: '11-2',
        label: '▲ és més gran que ■ (▲ > ■)',
        shortLabel: '▲ > ■',
        evaluate: (c: Code) => c.blue > c.yellow,
      },
    ],
  },
  12: {
    id: 12,
    title: 'Qui és més gran: ▲ o ●?',
    category: 'comparison',
    description: 'Compara el Triangle Blau (▲) amb el Cercle Morat (●).',
    options: [
      {
        id: '12-0',
        label: '▲ és més petit que ● (▲ < ●)',
        shortLabel: '▲ < ●',
        evaluate: (c: Code) => c.blue < c.purple,
      },
      {
        id: '12-1',
        label: '▲ és igual a ● (▲ = ●)',
        shortLabel: '▲ = ●',
        evaluate: (c: Code) => c.blue === c.purple,
      },
      {
        id: '12-2',
        label: '▲ és més gran que ● (▲ > ●)',
        shortLabel: '▲ > ●',
        evaluate: (c: Code) => c.blue > c.purple,
      },
    ],
  },
  13: {
    id: 13,
    title: 'Qui és més gran: ■ o ●?',
    category: 'comparison',
    description: 'Compara el Quadrat Groc (■) amb el Cercle Morat (●).',
    options: [
      {
        id: '13-0',
        label: '■ és més petit que ● (■ < ●)',
        shortLabel: '■ < ●',
        evaluate: (c: Code) => c.yellow < c.purple,
      },
      {
        id: '13-1',
        label: '■ és igual a ● (■ = ●)',
        shortLabel: '■ = ●',
        evaluate: (c: Code) => c.yellow === c.purple,
      },
      {
        id: '13-2',
        label: '■ és més gran que ● (■ > ●)',
        shortLabel: '■ > ●',
        evaluate: (c: Code) => c.yellow > c.purple,
      },
    ],
  },
  14: {
    id: 14,
    title: 'Quina figura té el número més petit?',
    category: 'comparison',
    description: 'Mira quin dels tres números és el més petit de tots.',
    options: [
      {
        id: '14-0',
        label: '▲ és el més petit de tots tres',
        shortLabel: '▲ és el menor',
        evaluate: (c: Code) => c.blue < c.yellow && c.blue < c.purple,
      },
      {
        id: '14-1',
        label: '■ és el més petit de tots tres',
        shortLabel: '■ és el menor',
        evaluate: (c: Code) => c.yellow < c.blue && c.yellow < c.purple,
      },
      {
        id: '14-2',
        label: '● és el més petit de tots tres',
        shortLabel: '● és el menor',
        evaluate: (c: Code) => c.purple < c.blue && c.purple < c.yellow,
      },
      {
        id: '14-3',
        label: 'Empat en el més petit',
        shortLabel: 'Empat en el menor',
        evaluate: (c: Code) => {
          const min = Math.min(c.blue, c.yellow, c.purple);
          const count = [c.blue, c.yellow, c.purple].filter((v) => v === min).length;
          return count > 1;
        },
      },
    ],
  },
  15: {
    id: 15,
    title: 'Quina figura té el número més gran?',
    category: 'comparison',
    description: 'Mira quin dels tres números és el més gran de tots.',
    options: [
      {
        id: '15-0',
        label: '▲ és el més gran de tots tres',
        shortLabel: '▲ és el major',
        evaluate: (c: Code) => c.blue > c.yellow && c.blue > c.purple,
      },
      {
        id: '15-1',
        label: '■ és el més gran de tots tres',
        shortLabel: '■ és el major',
        evaluate: (c: Code) => c.yellow > c.blue && c.yellow > c.purple,
      },
      {
        id: '15-2',
        label: '● és el més gran de tots tres',
        shortLabel: '● és el major',
        evaluate: (c: Code) => c.purple > c.blue && c.purple > c.yellow,
      },
      {
        id: '15-3',
        label: 'Empat en el més gran',
        shortLabel: 'Empat en el major',
        evaluate: (c: Code) => {
          const max = Math.max(c.blue, c.yellow, c.purple);
          const count = [c.blue, c.yellow, c.purple].filter((v) => v === max).length;
          return count > 1;
        },
      },
    ],
  },
  16: {
    id: 16,
    title: 'Quants números Parells (2 o 4) hi ha?',
    category: 'parity',
    description: 'Compta quants números parells (2 o 4) hi ha en total al codi.',
    options: [
      {
        id: '16-0',
        label: '0 parells (tots tres són senars: 1, 3, 5)',
        shortLabel: '0 parells (tots senars)',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v % 2 === 0).length === 0,
      },
      {
        id: '16-1',
        label: 'Exactament 1 número parell',
        shortLabel: '1 parell',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v % 2 === 0).length === 1,
      },
      {
        id: '16-2',
        label: 'Exactament 2 números parells',
        shortLabel: '2 parells',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v % 2 === 0).length === 2,
      },
      {
        id: '16-3',
        label: 'Tots 3 números són parells',
        shortLabel: '3 parells',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v % 2 === 0).length === 3,
      },
    ],
  },
  17: {
    id: 17,
    title: 'La suma (▲ + ■ + ●) és Parell o Senar?',
    category: 'parity',
    description: 'Suma els 3 números i mira si el resultat és parell o senar.',
    options: [
      {
        id: '17-0',
        label: 'La suma dels 3 números és Parell',
        shortLabel: 'Suma és Parell',
        evaluate: (c: Code) => (c.blue + c.yellow + c.purple) % 2 === 0,
      },
      {
        id: '17-1',
        label: 'La suma dels 3 números és Senar',
        shortLabel: 'Suma és Senar',
        evaluate: (c: Code) => (c.blue + c.yellow + c.purple) % 2 !== 0,
      },
    ],
  },
  18: {
    id: 18,
    title: 'Com és la suma total (▲ + ■ + ●) respecte a 6?',
    category: 'sum',
    description: 'Suma els 3 números i compara el total amb 6.',
    options: [
      {
        id: '18-0',
        label: 'La suma total és més petita que 6 (< 6)',
        shortLabel: 'Suma < 6',
        evaluate: (c: Code) => c.blue + c.yellow + c.purple < 6,
      },
      {
        id: '18-1',
        label: 'La suma total és igual a 6 (= 6)',
        shortLabel: 'Suma = 6',
        evaluate: (c: Code) => c.blue + c.yellow + c.purple === 6,
      },
      {
        id: '18-2',
        label: 'La suma total és més gran que 6 (> 6)',
        shortLabel: 'Suma > 6',
        evaluate: (c: Code) => c.blue + c.yellow + c.purple > 6,
      },
    ],
  },
  19: {
    id: 19,
    title: 'Com és la suma (▲ + ■) respecte a 6?',
    category: 'sum',
    description: 'Suma el Triangle (▲) i el Quadrat (■) i compara amb 6.',
    options: [
      {
        id: '19-0',
        label: '▲ + ■ suma menys de 6 (< 6)',
        shortLabel: '▲+■ < 6',
        evaluate: (c: Code) => c.blue + c.yellow < 6,
      },
      {
        id: '19-1',
        label: '▲ + ■ suma exactament 6 (= 6)',
        shortLabel: '▲+■ = 6',
        evaluate: (c: Code) => c.blue + c.yellow === 6,
      },
      {
        id: '19-2',
        label: '▲ + ■ suma més de 6 (> 6)',
        shortLabel: '▲+■ > 6',
        evaluate: (c: Code) => c.blue + c.yellow > 6,
      },
    ],
  },
  20: {
    id: 20,
    title: 'Hi ha números repetits al codi?',
    category: 'pattern',
    description: 'Mira si hi ha números iguals o si tots tres són diferents.',
    options: [
      {
        id: '20-0',
        label: 'Cap repetit (tots 3 números són diferents)',
        shortLabel: 'Tots 3 diferents',
        evaluate: (c: Code) => c.blue !== c.yellow && c.blue !== c.purple && c.yellow !== c.purple,
      },
      {
        id: '20-1',
        label: 'Una parella (2 números iguals)',
        shortLabel: 'Una parella',
        evaluate: (c: Code) => {
          const set = new Set([c.blue, c.yellow, c.purple]);
          return set.size === 2;
        },
      },
      {
        id: '20-2',
        label: 'Un trio (els 3 números iguals)',
        shortLabel: 'Un trio (3 iguals)',
        evaluate: (c: Code) => c.blue === c.yellow && c.yellow === c.purple,
      },
    ],
  },
  21: {
    id: 21,
    title: 'Hi ha una parella de números iguals?',
    category: 'pattern',
    description: 'Mira si hi ha exactament 2 números repetits.',
    options: [
      {
        id: '21-0',
        label: 'Sí, hi ha exactament 2 números iguals',
        shortLabel: 'Sí, parella',
        evaluate: (c: Code) => new Set([c.blue, c.yellow, c.purple]).size === 2,
      },
      {
        id: '21-1',
        label: 'No hi ha parella (tots diferents o 3 iguals)',
        shortLabel: 'No hi ha parella',
        evaluate: (c: Code) => new Set([c.blue, c.yellow, c.purple]).size !== 2,
      },
    ],
  },
  22: {
    id: 22,
    title: 'Estan ordenats els 3 números (▲, ■, ●)?',
    category: 'pattern',
    description: 'Mira si van de menor a major o de major a menor.',
    options: [
      {
        id: '22-0',
        label: 'Ordre creixent (▲ < ■ < ●)',
        shortLabel: 'Creixent (▲<■<●)',
        evaluate: (c: Code) => c.blue < c.yellow && c.yellow < c.purple,
      },
      {
        id: '22-1',
        label: 'Ordre decreixent (▲ > ■ > ●)',
        shortLabel: 'Decreixent (▲>■>●)',
        evaluate: (c: Code) => c.blue > c.yellow && c.yellow > c.purple,
      },
      {
        id: '22-2',
        label: 'Desordenats (ni creixent ni decreixent)',
        shortLabel: 'Desordenats',
        evaluate: (c: Code) =>
          !(c.blue < c.yellow && c.yellow < c.purple) &&
          !(c.blue > c.yellow && c.yellow > c.purple),
      },
    ],
  },
};
