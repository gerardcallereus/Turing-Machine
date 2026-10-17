import { Code, DigitValue, Verifier } from '../types/game';
import { evaluateVerifier } from './solver';

export interface MatrixCell {
  row: number;
  col: number;
  index: number;
  code: Code | null; // null for the 19 structural solid cells in the 12x12 grid
  holeShape: 'triangle' | 'square' | 'circle';
}

export const MATRIX_ROWS = 10;
export const MATRIX_COLS = 13; // 10 x 13 = 130 cells (125 codes + 5 registration/structural cells)

function buildDeterministicMatrix(): MatrixCell[] {
  const allCodes: Code[] = [];
  for (let b = 1; b <= 5; b++) {
    for (let y = 1; y <= 5; y++) {
      for (let p = 1; p <= 5; p++) {
        allCodes.push({
          blue: b as DigitValue,
          yellow: y as DigitValue,
          purple: p as DigitValue,
        });
      }
    }
  }

  // Deterministic LCG shuffle so holes are organically distributed like real punch cards
  let seed = 19361954; // Alan Turing tribute seed
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = allCodes.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    const tmp = allCodes[i];
    allCodes[i] = allCodes[j];
    allCodes[j] = tmp;
  }

  // Reserve 5 symmetric registration/structural cells (corners + center) as solid/pin cells
  const reservedIndices = new Set([0, 12, 64, 117, 129]);
  const shapes: ('triangle' | 'square' | 'circle')[] = ['triangle', 'square', 'circle'];

  const cells: MatrixCell[] = [];
  let codeCursor = 0;

  for (let r = 0; r < MATRIX_ROWS; r++) {
    for (let c = 0; c < MATRIX_COLS; c++) {
      const idx = r * MATRIX_COLS + c;
      if (reservedIndices.has(idx) || codeCursor >= allCodes.length) {
        cells.push({
          row: r,
          col: c,
          index: idx,
          code: null,
          holeShape: shapes[(r + c) % 3],
        });
      } else {
        cells.push({
          row: r,
          col: c,
          index: idx,
          code: allCodes[codeCursor++],
          holeShape: shapes[(r * 3 + c) % 3],
        });
      }
    }
  }

  return cells;
}

export const PUNCH_MATRIX: MatrixCell[] = buildDeterministicMatrix();

/**
 * Returns whether a specific single punch card (e.g. Blue 3) has a punched hole at cell.
 */
export function hasHoleInSingleCard(
  cell: MatrixCell,
  shape: 'blue' | 'yellow' | 'purple',
  value: DigitValue
): boolean {
  if (!cell.code) return false;
  return cell.code[shape] === value;
}

/**
 * Returns the state of a cell when all 3 punch cards (Blue, Yellow, Purple) are stacked.
 * Exactly 1 cell out of 130 will have `allOpen: true`!
 */
export function getStackedCellState(cell: MatrixCell, proposal: Code): {
  blueOpen: boolean;
  yellowOpen: boolean;
  purpleOpen: boolean;
  allOpen: boolean;
  openCount: number;
  firstBlockingLayer: 'blue' | 'yellow' | 'purple' | 'structural' | null;
} {
  if (!cell.code) {
    return {
      blueOpen: false,
      yellowOpen: false,
      purpleOpen: false,
      allOpen: false,
      openCount: 0,
      firstBlockingLayer: 'structural',
    };
  }

  const blueOpen = cell.code.blue === proposal.blue;
  const yellowOpen = cell.code.yellow === proposal.yellow;
  const purpleOpen = cell.code.purple === proposal.purple;
  const allOpen = blueOpen && yellowOpen && purpleOpen;
  const openCount = (blueOpen ? 1 : 0) + (yellowOpen ? 1 : 0) + (purpleOpen ? 1 : 0);

  // Stack order from top to bottom: Blue (top), Yellow (middle), Purple (bottom)
  const firstBlockingLayer = !blueOpen
    ? 'blue'
    : !yellowOpen
    ? 'yellow'
    : !purpleOpen
    ? 'purple'
    : null;

  return {
    blueOpen,
    yellowOpen,
    purpleOpen,
    allOpen,
    openCount,
    firstBlockingLayer,
  };
}

/**
 * Finds the single active MatrixCell where all 3 punch cards align for a given proposal.
 */
export function getActiveHoleCell(proposal: Code): MatrixCell {
  const found = PUNCH_MATRIX.find(
    (c) =>
      c.code &&
      c.code.blue === proposal.blue &&
      c.code.yellow === proposal.yellow &&
      c.code.purple === proposal.purple
  );
  return found || PUNCH_MATRIX[1];
}

/**
 * Generates an authentic 3-digit Verification Card Serial Number (e.g. "308", "642")
 * just like the green Verification Cards in the physical Turing Machine board game.
 */
export function getVerificationCardSerial(verifier: Verifier): string {
  const raw = ((verifier.cardId * 73 + (verifier.activeRuleIndex + 1) * 197 + 211) % 780) + 110;
  return String(raw).padStart(3, '0');
}

/**
 * Evaluates what is printed on the green Verification Card at a given cell.
 */
export function getVerificationCardCellValue(cell: MatrixCell, verifier: Verifier): boolean {
  if (!cell.code) {
    return (cell.row + cell.col + verifier.cardId) % 2 === 0;
  }
  return evaluateVerifier(verifier, cell.code);
}
