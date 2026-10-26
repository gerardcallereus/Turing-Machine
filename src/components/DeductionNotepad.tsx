import React, { useMemo } from 'react';
import {
  Code,
  DeductionSheetState,
  DigitValue,
  MarkStatus,
  Puzzle,
  RoundRecord,
} from '../types/game';
import { CRITERIA_CARDS } from '../lib/criteriaCards';
import { ALL_POSSIBLE_CODES } from '../lib/solver';
import { sound } from '../lib/sound';
import {
  RotateCcw,
  Check,
  X,
  HelpCircle,
  Wand2,
  KeyRound,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface DeductionNotepadProps {
  puzzle: Puzzle;
  state: DeductionSheetState;
  onChange: (newState: DeductionSheetState) => void;
  onReset: () => void;
  showAutoHelper: boolean;
  onToggleAutoHelper: () => void;
  history: RoundRecord[];
  currentRound: number;
  currentProposal: Code;
  currentRoundTests: { letter: string; passed: boolean }[];
  onSelectProposal?: (code: Code) => void;
  onOpenGuessModal?: () => void;
}

export const DeductionNotepad: React.FC<DeductionNotepadProps> = ({
  puzzle,
  state,
  onChange,
  onReset,
  history,
  currentRound,
  currentProposal,
  currentRoundTests,
  onSelectProposal,
  onOpenGuessModal,
}) => {
  // Simple 3-state cycle: Cap marca -> Ratllat (✖) -> Confirmat (✔) -> Cap marca
  const cycleStatus = (current: MarkStatus): MarkStatus => {
    switch (current) {
      case 'none':
        return 'eliminated';
      case 'eliminated':
        return 'confirmed';
      case 'confirmed':
      case 'unsure':
      default:
        return 'none';
    }
  };

  const handleDigitClick = (shape: 'blue' | 'yellow' | 'purple', digit: DigitValue) => {
    sound.playPencilMark();
    const current = state.digits[shape][digit] || 'none';
    const next = cycleStatus(current);

    onChange({
      ...state,
      digits: {
        ...state.digits,
        [shape]: {
          ...state.digits[shape],
          [digit]: next,
        },
      },
    });
  };

  const handleAutoDeduceFromTests = () => {
    sound.playPunch();
    const allRounds: { proposal: Code; tests: { letter: string; passed: boolean }[] }[] = [
      ...history.map((r) => ({ proposal: r.proposal, tests: r.tests })),
      { proposal: currentProposal, tests: currentRoundTests },
    ];

    const updatedVerifierOptions: Record<string, Record<number, MarkStatus>> = {
      ...state.verifierOptions,
    };

    for (const v of puzzle.verifiers) {
      const card = CRITERIA_CARDS[v.cardId];
      if (!card) continue;
      const marks = { ...(updatedVerifierOptions[v.letter] || {}) };

      card.options.forEach((opt, idx) => {
        for (const r of allRounds) {
          const t = r.tests.find((test) => test.letter === v.letter);
          if (!t) continue;
          const optPassed = opt.evaluate(r.proposal);
          if ((t.passed && !optPassed) || (!t.passed && optPassed)) {
            marks[idx] = 'eliminated';
          }
        }
      });

      const nonEliminatedIndices = card.options
        .map((_, idx) => idx)
        .filter((idx) => marks[idx] !== 'eliminated');
      if (nonEliminatedIndices.length === 1) {
        marks[nonEliminatedIndices[0]] = 'confirmed';
      }

      updatedVerifierOptions[v.letter] = marks;
    }

    onChange({
      ...state,
      verifierOptions: updatedVerifierOptions,
    });
  };

  const remainingCandidates = useMemo(() => {
    return ALL_POSSIBLE_CODES.filter((code) => {
      if (state.digits.blue[code.blue] === 'eliminated') return false;
      if (state.digits.yellow[code.yellow] === 'eliminated') return false;
      if (state.digits.purple[code.purple] === 'eliminated') return false;

      for (const shape of ['blue', 'yellow', 'purple'] as const) {
        const confirmedDigit = ([1, 2, 3, 4, 5] as DigitValue[]).find(
          (d) => state.digits[shape][d] === 'confirmed'
        );
        if (confirmedDigit && code[shape] !== confirmedDigit) return false;
      }

      for (const v of puzzle.verifiers) {
        const card = CRITERIA_CARDS[v.cardId];
        if (!card) continue;
        const marks = state.verifierOptions[v.letter] || {};

        const confirmedIdx = card.options.findIndex((_, idx) => marks[idx] === 'confirmed');
        if (confirmedIdx !== -1 && !card.options[confirmedIdx].evaluate(code)) {
          return false;
        }

        const allowedOptions = card.options.filter((_, idx) => marks[idx] !== 'eliminated');
        if (allowedOptions.length > 0 && !allowedOptions.some((opt) => opt.evaluate(code))) {
          return false;
        }
      }

      return true;
    });
  }, [state, puzzle]);

  const getDeducedDigit = (shape: 'blue' | 'yellow' | 'purple'): DigitValue | '?' => {
    const confirmed = ([1, 2, 3, 4, 5] as DigitValue[]).find(
      (d) => state.digits[shape][d] === 'confirmed'
    );
    if (confirmed) return confirmed;
    const remaining = ([1, 2, 3, 4, 5] as DigitValue[]).filter(
      (d) => state.digits[shape][d] !== 'eliminated'
    );
    if (remaining.length === 1) return remaining[0];
    return '?';
  };

  const renderMarkIcon = (status: MarkStatus) => {
    switch (status) {
      case 'eliminated':
        return <X className="h-3.5 w-3.5 text-[#992d25] stroke-[3]" />;
      case 'confirmed':
        return <Check className="h-3.5 w-3.5 text-[#2f5941] stroke-[3]" />;
      case 'unsure':
        return <HelpCircle className="h-3.5 w-3.5 text-[#b87314] stroke-[2.5]" />;
      default:
        return null;
    }
  };

  const allDisplayRounds = [
    ...history,
    ...(currentRoundTests.length > 0
      ? [
          {
            roundNumber: currentRound,
            proposal: currentProposal,
            tests: currentRoundTests,
            isCurrent: true,
          },
        ]
      : []),
  ];

  return (
    <div className="wc-paper rounded-xl p-3.5 sm:p-4 border-2 border-[#8c765c] space-y-3 shadow-xs">
      {/* Compact Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#d5c7b2]">
        <div>
          <span className="font-typewriter text-[10px] uppercase tracking-wider text-[#2f5941] font-bold block">
            PAS 3 &bull; QUADERN DE L&apos;OPERADOR
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#261f19] leading-tight">
            Ratlla els números impossibles
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAutoDeduceFromTests}
            title="Marcar automàticament les regles descartades a partir de les teves proves"
            className="flex items-center gap-1 rounded-lg wc-wash-blue border border-[#234b7a] px-2.5 py-1 font-typewriter text-[11px] font-bold text-[#1b3b61] cursor-pointer"
          >
            <Wand2 className="h-3 w-3" />
            <span>Auto-Pistes</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Esborrar les marques del quadern"
            className="flex items-center gap-1 rounded-lg border border-[#a89276] bg-[#efe5d2] hover:bg-[#e3d5bc] px-2 py-1 font-typewriter text-[11px] font-bold text-[#261f19] cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Helper subtitle */}
      <p className="text-xs text-[#5c4f42] leading-snug">
        1 clic = <strong>✖ Descartar</strong> &bull; 2 clics = <strong>✔ Confirmar</strong> &bull; 3 clics = Esborrar
      </p>

      {/* 3-Column Number Grid (▲ 1-5, ■ 1-5, ● 1-5) */}
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            {
              shape: 'blue',
              symbol: '▲',
              name: 'Blau',
              headerCls: 'bg-[#234b7a] text-[#faf6ee]',
            },
            {
              shape: 'yellow',
              symbol: '■',
              name: 'Groc',
              headerCls: 'bg-[#c8831b] text-[#faf6ee]',
            },
            {
              shape: 'purple',
              symbol: '●',
              name: 'Morat',
              headerCls: 'bg-[#6d325b] text-[#faf6ee]',
            },
          ] as const
        ).map((col) => (
          <div
            key={col.shape}
            className="rounded-lg border border-[#bda98e] bg-[#faf6ee] p-2 flex flex-col items-center gap-1"
          >
            <div
              className={`w-full text-center py-1 rounded font-typewriter text-xs font-bold ${col.headerCls}`}
            >
              {col.symbol} {col.name}
            </div>

            <div className="w-full space-y-1 mt-0.5">
              {([1, 2, 3, 4, 5] as DigitValue[]).map((num) => {
                const status = state.digits[col.shape][num] || 'none';
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleDigitClick(col.shape, num)}
                    className={`w-full flex items-center justify-between px-2.5 py-1 rounded border font-typewriter text-xs transition-all cursor-pointer ${
                      status === 'eliminated'
                        ? 'border-[#bd6e68] bg-[#f2d8d5]/70 text-[#7b6855] line-through opacity-60'
                        : status === 'confirmed'
                        ? 'border-2 border-[#2f5941] bg-[#d8e8de] text-[#1e402f] font-bold shadow-2xs'
                        : status === 'unsure'
                        ? 'border-[#b87314] bg-[#f5e4be] text-[#784908] font-bold'
                        : 'border-[#cbbba2] bg-[#faf6ee] hover:border-[#234b7a] text-[#261f19] font-bold'
                    }`}
                  >
                    <span>{num}</span>
                    <span>{renderMarkIcon(status)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Deduced Code + Solve Trigger */}
      <div className="rounded-lg bg-[#efe5d2] border border-[#a89276] p-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-typewriter uppercase text-[#261f19] font-bold">
            Codi deduït:
          </span>
          <div className="flex items-center gap-1 font-typewriter text-sm font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded border-2 border-[#234b7a] bg-[#faf6ee] text-[#234b7a]">
              {getDeducedDigit('blue')}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded border-2 border-[#b87314] bg-[#faf6ee] text-[#b87314]">
              {getDeducedDigit('yellow')}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded border-2 border-[#6d325b] bg-[#faf6ee] text-[#6d325b]">
              {getDeducedDigit('purple')}
            </span>
          </div>
        </div>

        {onOpenGuessModal && (
          <button
            type="button"
            onClick={onOpenGuessModal}
            className="flex items-center gap-1.5 rounded-lg bg-[#2f5941] hover:bg-[#234532] px-3 py-1.5 font-typewriter text-xs font-bold uppercase text-[#faf6ee] shadow-xs cursor-pointer transition-all"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Resoldre!</span>
          </button>
        )}
      </div>

      {/* Candidate Codes Remaining */}
      <div className="rounded-lg border border-[#cbbba2] bg-[#faf6ee] p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-typewriter uppercase font-bold text-[#234b7a]">
            Combinacions possibles:
          </span>
          <span className="rounded bg-[#d5e2ef] border border-[#234b7a] px-2 py-0.5 text-[10px] font-typewriter font-bold text-[#1b3b61]">
            {remainingCandidates.length} de 125
          </span>
        </div>

        {remainingCandidates.length === 0 ? (
          <p className="text-[11px] text-[#992d25] font-medium">
            Has ratllat totes les opcions! Revisa si has marcat alguna pista o número per error.
          </p>
        ) : remainingCandidates.length <= 20 ? (
          <div className="flex flex-wrap gap-1 max-h-[110px] overflow-y-auto pt-1">
            {remainingCandidates.map((c) => {
              const key = `${c.blue}${c.yellow}${c.purple}`;
              const isSelected =
                c.blue === currentProposal.blue &&
                c.yellow === currentProposal.yellow &&
                c.purple === currentProposal.purple;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    sound.playPunch();
                    onSelectProposal && onSelectProposal(c);
                  }}
                  className={`px-2 py-0.5 rounded font-typewriter text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#261f19] text-[#faf6ee] border-[#261f19]'
                      : 'bg-[#efe5d2] text-[#261f19] border-[#a89276] hover:border-[#234b7a]'
                  }`}
                  title="Provar aquesta combinació"
                >
                  <span className={isSelected ? 'text-[#9ec5ff]' : 'text-[#234b7a]'}>{c.blue}</span>
                  <span className={isSelected ? 'text-[#ffd27d] mx-0.5' : 'text-[#b87314] mx-0.5'}>
                    {c.yellow}
                  </span>
                  <span className={isSelected ? 'text-[#f0b3df]' : 'text-[#6d325b]'}>
                    {c.purple}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[11px] text-[#5c4f42]">
            Quan ratllis més números o pistes, veuràs aquí les combinacions finals que queden.
          </p>
        )}
      </div>

      {/* Compact Round History Table */}
      {allDisplayRounds.length > 0 && (
        <div className="rounded-lg border border-[#cbbba2] bg-[#faf6ee] p-2.5 space-y-1.5">
          <div className="text-[10px] font-typewriter uppercase font-bold text-[#5c4f42]">
            Resum de les teves proves
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-typewriter text-xs">
              <thead>
                <tr className="border-b border-[#cbbba2] text-[10px] text-[#5c4f42]">
                  <th className="py-1 px-1 text-left">Ronda</th>
                  <th className="py-1 px-1 text-center">Codi</th>
                  {puzzle.verifiers.map((v) => (
                    <th key={v.letter} className="py-1 px-1 text-center text-[#2f5941]">
                      {v.letter}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6decb]">
                {allDisplayRounds.map((r) => (
                  <tr key={r.roundNumber} className="text-[11px]">
                    <td className="py-1 px-1 text-[#5c4f42] font-bold">R{r.roundNumber}</td>
                    <td className="py-1 px-1 text-center font-bold">
                      <span className="text-[#234b7a]">{r.proposal.blue}</span>-
                      <span className="text-[#b87314]">{r.proposal.yellow}</span>-
                      <span className="text-[#6d325b]">{r.proposal.purple}</span>
                    </td>
                    {puzzle.verifiers.map((v) => {
                      const test = r.tests.find((t) => t.letter === v.letter);
                      return (
                        <td key={v.letter} className="py-1 px-1 text-center">
                          {test ? (
                            test.passed ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#2f5941] inline" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-[#992d25] inline" />
                            )
                          ) : (
                            <span className="text-[#cbbba2]">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
