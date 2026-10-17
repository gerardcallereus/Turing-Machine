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
  FileSpreadsheet,
  Sparkles,
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
  showAutoHelper,
  onToggleAutoHelper,
  history,
  currentRound,
  currentProposal,
  currentRoundTests,
  onSelectProposal,
  onOpenGuessModal,
}) => {
  const cycleStatus = (current: MarkStatus): MarkStatus => {
    switch (current) {
      case 'none':
        return 'eliminated';
      case 'eliminated':
        return 'confirmed';
      case 'confirmed':
        return 'unsure';
      case 'unsure':
        return 'none';
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

  const handleOptionClick = (letter: string, optionIndex: number) => {
    sound.playPencilMark();
    const verifierOpts = state.verifierOptions[letter] || {};
    const current = verifierOpts[optionIndex] || 'none';
    const next = cycleStatus(current);

    onChange({
      ...state,
      verifierOptions: {
        ...state.verifierOptions,
        [letter]: {
          ...verifierOpts,
          [optionIndex]: next,
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
    {
      roundNumber: currentRound,
      proposal: currentProposal,
      tests: currentRoundTests,
      isCurrent: true,
    },
  ];

  return (
    <div className="wc-paper rounded-xl p-5 sm:p-6">
      {/* Official Sheet Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#d5c7b2]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#efe5d2] text-[#261f19] border border-[#8c765c]">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#261f19]">
                3. Quadern d'Anotació Oficial (Hut 8)
              </h2>
              <span className="rounded bg-[#d5e2ef] border border-[#234b7a] px-2.5 py-0.5 text-[11px] font-typewriter font-bold text-[#1b3b61]">
                Candidats compatibles: {remainingCandidates.length} / 125
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5c4f42]">
              Registra els teus descarts com al bloc de notes físic del joc (Clic: Descartar ✖ &rarr; Confirmar ✔ &rarr; Dubte ?).
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAutoDeduceFromTests}
            className="flex items-center gap-1.5 rounded-lg wc-wash-blue border border-[#234b7a] px-3 py-1.5 font-typewriter text-xs font-bold text-[#1b3b61] transition-all cursor-pointer"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Auto-Descartar per Proves</span>
          </button>

          <button
            type="button"
            onClick={onToggleAutoHelper}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-typewriter text-xs font-bold transition-all border cursor-pointer ${
              showAutoHelper
                ? 'wc-wash-olive text-[#1e402f] border-[#2f5941]'
                : 'bg-[#efe5d2] text-[#5c4f42] border-[#a89276]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ajuda Lògica: {showAutoHelper ? 'Sí' : 'No'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-[#a89276] bg-[#efe5d2] hover:bg-[#e3d5bc] px-3 py-1.5 font-typewriter text-xs font-bold text-[#261f19] transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Esborrar Notes</span>
          </button>
        </div>
      </div>

      {/* Main Sheet Layout: 3 Columns matching real board game deduction sheet */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* 1. Official Round & Verifier Query Table (4 cols) */}
        <div className="md:col-span-4 wc-paper-aged rounded-xl p-4 border border-[#a89276] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#cbbba2]">
              <h3 className="text-xs font-typewriter uppercase tracking-wider text-[#261f19] font-bold">
                1. Historial de Rondes
              </h3>
              <span className="text-[11px] font-typewriter font-bold text-[#234b7a]">
                Ronda {currentRound}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-typewriter text-xs">
                <thead>
                  <tr className="border-b-2 border-[#a89276] text-[11px] text-[#5c4f42]">
                    <th className="py-1.5 px-1 text-left font-bold">Ronda</th>
                    <th className="py-1.5 px-1 text-center text-[#234b7a] font-bold">▲</th>
                    <th className="py-1.5 px-1 text-center text-[#b87314] font-bold">■</th>
                    <th className="py-1.5 px-1 text-center text-[#6d325b] font-bold border-r border-[#bfa98c]">
                      ●
                    </th>
                    {puzzle.verifiers.map((v) => (
                      <th
                        key={v.letter}
                        className="py-1.5 px-1 text-center text-[#2f5941] font-bold"
                      >
                        {v.letter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5c7b2]">
                  {allDisplayRounds.map((r) => {
                    const isCurrent = 'isCurrent' in r && r.isCurrent;
                    return (
                      <tr
                        key={r.roundNumber}
                        onClick={() => onSelectProposal && onSelectProposal(r.proposal)}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-[#d5e2ef]/50 font-bold'
                            : 'hover:bg-[#faf6ee] cursor-pointer'
                        }`}
                      >
                        <td className="py-2 px-1 text-[10px] text-[#5c4f42]">
                          R{r.roundNumber}
                        </td>
                        <td className="py-2 px-1 text-center text-[#234b7a] font-bold">
                          {r.proposal.blue}
                        </td>
                        <td className="py-2 px-1 text-center text-[#b87314] font-bold">
                          {r.proposal.yellow}
                        </td>
                        <td className="py-2 px-1 text-center text-[#6d325b] font-bold border-r border-[#bfa98c]">
                          {r.proposal.purple}
                        </td>
                        {puzzle.verifiers.map((v) => {
                          const test = r.tests.find((t) => t.letter === v.letter);
                          return (
                            <td key={v.letter} className="py-2 px-1 text-center">
                              {test ? (
                                test.passed ? (
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#d8e8de] text-[#2f5941] border border-[#2f5941]">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </span>
                                ) : (
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#f2d8d5] text-[#992d25] border border-[#992d25]">
                                    <XCircle className="h-3.5 w-3.5" />
                                  </span>
                                )
                              ) : (
                                <span className="text-[#a89276]">·</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[10px] font-typewriter text-[#7b6855] mt-3 italic">
            Fes clic a una fila per recuperar la proposta.
          </p>
        </div>

        {/* 2. Classic 3-Column Number Grid (▲ 1-5, ■ 1-5, ● 1-5) (4 cols) */}
        <div className="md:col-span-4 wc-paper-aged rounded-xl p-4 border border-[#a89276] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#cbbba2] mb-3">
              <h3 className="text-xs font-typewriter uppercase tracking-wider text-[#261f19] font-bold">
                2. Matriu de Xifres (1–5)
              </h3>
              <span className="text-[11px] text-[#5c4f42]">Ratlla les impossibles</span>
            </div>

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
                    {col.symbol}
                  </div>

                  <div className="w-full space-y-1 mt-1">
                    {([1, 2, 3, 4, 5] as DigitValue[]).map((num) => {
                      const status = state.digits[col.shape][num] || 'none';
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleDigitClick(col.shape, num)}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded border font-typewriter text-xs transition-all cursor-pointer ${
                            status === 'eliminated'
                              ? 'border-[#bd6e68] bg-[#f2d8d5]/60 text-[#7b6855] line-through opacity-60'
                              : status === 'confirmed'
                              ? 'border-2 border-[#2f5941] bg-[#d8e8de] text-[#1e402f] font-bold'
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
          </div>

          {/* Bottom Deduced Digits & Guess Modal Trigger */}
          <div className="pt-2 border-t border-[#cbbba2] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-typewriter uppercase text-[#5c4f42] font-bold">
                Codi:
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
                className="flex items-center gap-1.5 rounded-lg bg-[#2f5941] hover:bg-[#234532] px-3 py-1.5 font-typewriter text-xs font-bold uppercase text-[#faf6ee] shadow-xs cursor-pointer"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Resoldre</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Candidate Codes Remaining (4 cols) */}
        <div className="md:col-span-4 wc-paper-aged rounded-xl p-4 border border-[#a89276] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#cbbba2] mb-2.5">
              <h3 className="text-xs font-typewriter uppercase tracking-wider text-[#234b7a] font-bold">
                3. Codis Possibles
              </h3>
              <span className="rounded bg-[#d5e2ef] border border-[#234b7a] px-2 py-0.5 text-[10px] font-typewriter font-bold text-[#1b3b61]">
                {remainingCandidates.length} / 125
              </span>
            </div>

            <p className="text-[11px] text-[#5c4f42] mb-3">
              Combinacions que compleixen totes les regles i números que no has descartat:
            </p>

            {remainingCandidates.length === 0 ? (
              <div className="rounded-lg border border-[#992d25] bg-[#f2d8d5] p-3 text-xs text-[#781f19]">
                Has descartat totes les combinacions possibles! Revisa si has ratllat per error alguna regla o xifra correcta.
              </div>
            ) : remainingCandidates.length <= 30 ? (
              <div className="flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto p-1">
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
                      className={`px-2 py-1 rounded font-typewriter text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#261f19] text-[#faf6ee] border-[#261f19] shadow'
                          : 'bg-[#faf6ee] text-[#261f19] border-[#a89276] hover:border-[#234b7a]'
                      }`}
                      title="Muntar aquest codi"
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
              <div className="p-3 bg-[#faf6ee] rounded-lg border border-[#cbbba2] text-xs text-[#5c4f42] space-y-1">
                <p>
                  Queden <strong>{remainingCandidates.length}</strong> combinacions compatibles.
                </p>
                <p className="text-[11px] text-[#7b6855]">
                  A mesura que descartis regles als verificadors o xifres a la matriu, la llista es reduirà fins a mostrar-te els candidats directament aquí.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#cbbba2] text-[10px] font-typewriter text-[#5c4f42]">
            Prem <em>«Auto-Descartar per Proves»</em> a dalt per actualitzar els descarts automàticament.
          </div>
        </div>
      </div>
    </div>
  );
};
