import { CriterionCard, Code } from '../types/game';

export const CRITERIA_CARDS: Record<number, CriterionCard> = {
  1: {
    id: 1,
    title: 'Comparar ▲ amb 1',
    category: 'value',
    description: 'Compara el valor del Triangle Blau (▲) amb 1.',
    options: [
      {
        id: '1-0',
        label: '▲ és igual a 1',
        shortLabel: '▲ = 1',
        evaluate: (c: Code) => c.blue === 1,
      },
      {
        id: '1-1',
        label: '▲ és més gran que 1',
        shortLabel: '▲ > 1',
        evaluate: (c: Code) => c.blue > 1,
      },
    ],
  },
  2: {
    id: 2,
    title: 'Comparar ▲ amb 3',
    category: 'value',
    description: 'Compara el valor del Triangle Blau (▲) amb 3.',
    options: [
      {
        id: '2-0',
        label: '▲ és menor que 3',
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
        label: '▲ és més gran que 3',
        shortLabel: '▲ > 3',
        evaluate: (c: Code) => c.blue > 3,
      },
    ],
  },
  3: {
    id: 3,
    title: 'Comparar ■ amb 3',
    category: 'value',
    description: 'Compara el valor del Quadrat Groc (■) amb 3.',
    options: [
      {
        id: '3-0',
        label: '■ és menor que 3',
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
        label: '■ és més gran que 3',
        shortLabel: '■ > 3',
        evaluate: (c: Code) => c.yellow > 3,
      },
    ],
  },
  4: {
    id: 4,
    title: 'Comparar ● amb 3',
    category: 'value',
    description: 'Compara el valor del Cercle Morat (●) amb 3.',
    options: [
      {
        id: '4-0',
        label: '● és menor que 3',
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
        label: '● és més gran que 3',
        shortLabel: '● > 3',
        evaluate: (c: Code) => c.purple > 3,
      },
    ],
  },
  5: {
    id: 5,
    title: 'Paritat de ▲',
    category: 'parity',
    description: 'Determina si el Triangle Blau (▲) és parell o senar.',
    options: [
      {
        id: '5-0',
        label: '▲ és un número parell (2, 4)',
        shortLabel: '▲ és Parell',
        evaluate: (c: Code) => c.blue % 2 === 0,
      },
      {
        id: '5-1',
        label: '▲ és un número senar (1, 3, 5)',
        shortLabel: '▲ és Senar',
        evaluate: (c: Code) => c.blue % 2 !== 0,
      },
    ],
  },
  6: {
    id: 6,
    title: 'Paritat de ■',
    category: 'parity',
    description: 'Determina si el Quadrat Groc (■) és parell o senar.',
    options: [
      {
        id: '6-0',
        label: '■ és un número parell (2, 4)',
        shortLabel: '■ és Parell',
        evaluate: (c: Code) => c.yellow % 2 === 0,
      },
      {
        id: '6-1',
        label: '■ és un número senar (1, 3, 5)',
        shortLabel: '■ és Senar',
        evaluate: (c: Code) => c.yellow % 2 !== 0,
      },
    ],
  },
  7: {
    id: 7,
    title: 'Paritat de ●',
    category: 'parity',
    description: 'Determina si el Cercle Morat (●) és parell o senar.',
    options: [
      {
        id: '7-0',
        label: '● és un número parell (2, 4)',
        shortLabel: '● és Parell',
        evaluate: (c: Code) => c.purple % 2 === 0,
      },
      {
        id: '7-1',
        label: '● és un número senar (1, 3, 5)',
        shortLabel: '● és Senar',
        evaluate: (c: Code) => c.purple % 2 !== 0,
      },
    ],
  },
  8: {
    id: 8,
    title: 'Quantitat de números 1',
    category: 'count',
    description: 'Compta quantes vegades apareix el número 1 al codi.',
    options: [
      {
        id: '8-0',
        label: 'Cap número 1 (zero uns)',
        shortLabel: '0 uns (cap)',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 1).length === 0,
      },
      {
        id: '8-1',
        label: 'Exactament un número 1',
        shortLabel: '1 u',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 1).length === 1,
      },
      {
        id: '8-2',
        label: 'Exactament dos números 1',
        shortLabel: '2 uns',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 1).length === 2,
      },
      {
        id: '8-3',
        label: 'Tots tres números són 1 (1-1-1)',
        shortLabel: '3 uns',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 1).length === 3,
      },
    ],
  },
  9: {
    id: 9,
    title: 'Quantitat de números 3',
    category: 'count',
    description: 'Compta quantes vegades apareix el número 3 al codi.',
    options: [
      {
        id: '9-0',
        label: 'Cap número 3',
        shortLabel: '0 tresos',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 3).length === 0,
      },
      {
        id: '9-1',
        label: 'Exactament un número 3',
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
    title: 'Quantitat de números 4',
    category: 'count',
    description: 'Compta quantes vegades apareix el número 4 al codi.',
    options: [
      {
        id: '10-0',
        label: 'Cap número 4',
        shortLabel: '0 quatre',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v === 4).length === 0,
      },
      {
        id: '10-1',
        label: 'Exactament un número 4',
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
    title: 'Comparar ▲ amb ■',
    category: 'comparison',
    description: 'Compara el Triangle Blau (▲) amb el Quadrat Groc (■).',
    options: [
      {
        id: '11-0',
        label: '▲ és menor que ■ (▲ < ■)',
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
    title: 'Comparar ▲ amb ●',
    category: 'comparison',
    description: 'Compara el Triangle Blau (▲) amb el Cercle Morat (●).',
    options: [
      {
        id: '12-0',
        label: '▲ és menor que ● (▲ < ●)',
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
    title: 'Comparar ■ amb ●',
    category: 'comparison',
    description: 'Compara el Quadrat Groc (■) amb el Cercle Morat (●).',
    options: [
      {
        id: '13-0',
        label: '■ és menor que ● (■ < ●)',
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
    title: 'Quin és estrictament el Menor',
    category: 'comparison',
    description: 'Determina quin dels tres números és estrictament el més petit.',
    options: [
      {
        id: '14-0',
        label: '▲ és estrictament el menor de tots tres',
        shortLabel: '▲ és el menor',
        evaluate: (c: Code) => c.blue < c.yellow && c.blue < c.purple,
      },
      {
        id: '14-1',
        label: '■ és estrictament el menor de tots tres',
        shortLabel: '■ és el menor',
        evaluate: (c: Code) => c.yellow < c.blue && c.yellow < c.purple,
      },
      {
        id: '14-2',
        label: '● és estrictament el menor de tots tres',
        shortLabel: '● és el menor',
        evaluate: (c: Code) => c.purple < c.blue && c.purple < c.yellow,
      },
      {
        id: '14-3',
        label: 'Hi ha empat en el valor mínim',
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
    title: 'Quin és estrictament el Major',
    category: 'comparison',
    description: 'Determina quin dels tres números és estrictament el més gran.',
    options: [
      {
        id: '15-0',
        label: '▲ és estrictament el major de tots tres',
        shortLabel: '▲ és el major',
        evaluate: (c: Code) => c.blue > c.yellow && c.blue > c.purple,
      },
      {
        id: '15-1',
        label: '■ és estrictament el major de tots tres',
        shortLabel: '■ és el major',
        evaluate: (c: Code) => c.yellow > c.blue && c.yellow > c.purple,
      },
      {
        id: '15-2',
        label: '● és estrictament el major de tots tres',
        shortLabel: '● és el major',
        evaluate: (c: Code) => c.purple > c.blue && c.purple > c.yellow,
      },
      {
        id: '15-3',
        label: 'Hi ha empat en el valor màxim',
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
    title: 'Quantitat de números Parells',
    category: 'parity',
    description: 'Compta quants números parells (2, 4) conté el codi.',
    options: [
      {
        id: '16-0',
        label: 'Cap número parell (tots senars)',
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
        label: 'Tots tres números són parells',
        shortLabel: '3 parells',
        evaluate: (c: Code) => [c.blue, c.yellow, c.purple].filter((v) => v % 2 === 0).length === 3,
      },
    ],
  },
  17: {
    id: 17,
    title: 'Paritat de la Suma (▲ + ■ + ●)',
    category: 'parity',
    description: 'Determina si la suma total dels tres valors és parell o senar.',
    options: [
      {
        id: '17-0',
        label: 'La suma total és parell',
        shortLabel: 'Suma és Parell',
        evaluate: (c: Code) => (c.blue + c.yellow + c.purple) % 2 === 0,
      },
      {
        id: '17-1',
        label: 'La suma total és senar',
        shortLabel: 'Suma és Senar',
        evaluate: (c: Code) => (c.blue + c.yellow + c.purple) % 2 !== 0,
      },
    ],
  },
  18: {
    id: 18,
    title: 'Suma Total comparada amb 6',
    category: 'sum',
    description: 'Compara la suma total (▲ + ■ + ●) amb 6.',
    options: [
      {
        id: '18-0',
        label: 'La suma és menor que 6 (Suma < 6)',
        shortLabel: 'Suma < 6',
        evaluate: (c: Code) => c.blue + c.yellow + c.purple < 6,
      },
      {
        id: '18-1',
        label: 'La suma és exactament igual a 6',
        shortLabel: 'Suma = 6',
        evaluate: (c: Code) => c.blue + c.yellow + c.purple === 6,
      },
      {
        id: '18-2',
        label: 'La suma és més gran que 6 (Suma > 6)',
        shortLabel: 'Suma > 6',
        evaluate: (c: Code) => c.blue + c.yellow + c.purple > 6,
      },
    ],
  },
  19: {
    id: 19,
    title: 'Suma de (▲ + ■) comparada amb 6',
    category: 'sum',
    description: 'Compara la suma del Triangle Blau i el Quadrat Groc amb 6.',
    options: [
      {
        id: '19-0',
        label: '▲ + ■ és menor que 6',
        shortLabel: '▲+■ < 6',
        evaluate: (c: Code) => c.blue + c.yellow < 6,
      },
      {
        id: '19-1',
        label: '▲ + ■ és igual a 6',
        shortLabel: '▲+■ = 6',
        evaluate: (c: Code) => c.blue + c.yellow === 6,
      },
      {
        id: '19-2',
        label: '▲ + ■ és més gran que 6',
        shortLabel: '▲+■ > 6',
        evaluate: (c: Code) => c.blue + c.yellow > 6,
      },
    ],
  },
  20: {
    id: 20,
    title: 'Repeticions al Codi',
    category: 'pattern',
    description: 'Determina si hi ha números repetits al codi secret.',
    options: [
      {
        id: '20-0',
        label: 'Cap número repetit (tots 3 diferents)',
        shortLabel: 'Tots 3 diferents',
        evaluate: (c: Code) => c.blue !== c.yellow && c.blue !== c.purple && c.yellow !== c.purple,
      },
      {
        id: '20-1',
        label: 'Exactament dos números iguals (una parella)',
        shortLabel: 'Una parella',
        evaluate: (c: Code) => {
          const set = new Set([c.blue, c.yellow, c.purple]);
          return set.size === 2;
        },
      },
      {
        id: '20-2',
        label: 'Els tres números són idèntics (un trio)',
        shortLabel: 'Un trio (3 iguals)',
        evaluate: (c: Code) => c.blue === c.yellow && c.yellow === c.purple,
      },
    ],
  },
  21: {
    id: 21,
    title: 'Hi ha exactament una Parella?',
    category: 'pattern',
    description: 'Comprova si al codi hi ha exactament 2 números repetits.',
    options: [
      {
        id: '21-0',
        label: 'Sí, hi ha exactament una parella',
        shortLabel: 'Sí, parella',
        evaluate: (c: Code) => new Set([c.blue, c.yellow, c.purple]).size === 2,
      },
      {
        id: '21-1',
        label: 'No hi ha parella (o tots diferents o trio)',
        shortLabel: 'No hi ha parella',
        evaluate: (c: Code) => new Set([c.blue, c.yellow, c.purple]).size !== 2,
      },
    ],
  },
  22: {
    id: 22,
    title: 'Ordre dels Dígits (▲, ■, ●)',
    category: 'pattern',
    description: 'Determina si els valors formen una seqüència estricta d’esquerra a dreta.',
    options: [
      {
        id: '22-0',
        label: 'Estrictament Creixent (▲ < ■ < ●)',
        shortLabel: 'Creixent (▲<■<●)',
        evaluate: (c: Code) => c.blue < c.yellow && c.yellow < c.purple,
      },
      {
        id: '22-1',
        label: 'Estrictament Decreixent (▲ > ■ > ●)',
        shortLabel: 'Decreixent (▲>■>●)',
        evaluate: (c: Code) => c.blue > c.yellow && c.yellow > c.purple,
      },
      {
        id: '22-2',
        label: 'Sense ordre estricte (ni creixent ni decreixent)',
        shortLabel: 'Sense ordre estricte',
        evaluate: (c: Code) =>
          !(c.blue < c.yellow && c.yellow < c.purple) &&
          !(c.blue > c.yellow && c.yellow > c.purple),
      },
    ],
  },
};
