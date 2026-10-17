import React, { useState } from 'react';
import { Verifier, Code, MarkStatus, RoundRecord } from '../types/game';
import { CRITERIA_CARDS } from '../lib/criteriaCards';
import {
  getActiveHoleCell,
  getVerificationCardSerial,
  PUNCH_MATRIX,
  MATRIX_COLS,
} from '../lib/punchMatrix';
import { CriterionGraphic } from './CriterionGraphic';
import { sound } from '../lib/sound';
import {
  CheckCircle2,
  XCircle,
  Play,
  Check,
  X,
  HelpCircle,
  Sparkles,
  Crosshair,
  Layers,
} from 'lucide-react';

interface VerifierCardProps {
  verifier: Verifier;
  proposal: Code;
  isTestedThisRound: boolean;
  roundTestResult: boolean | null;
  testsRemaining: number;
  isRoundReadyForVerify?: boolean;
  onRunTest: (letter: string) => void;
  optionMarks: Record<number, MarkStatus>;
  onToggleOptionMark: (optionIndex: number) => void;
  showAutoHelper?: boolean;
  pastHistory?: RoundRecord[];
}

export const VerifierCard: React.FC<VerifierCardProps> = ({
  verifier,
  proposal,
  isTestedThisRound,
  roundTestResult,
  testsRemaining,
  isRoundReadyForVerify = true,
  onRunTest,
  optionMarks,
  onToggleOptionMark,
  showAutoHelper = false,
  pastHistory = [],
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showMatrixPeek, setShowMatrixPeek] = useState(false);
  const card = CRITERIA_CARDS[verifier.cardId];

  if (!card) return null;

  const serialNumber = getVerificationCardSerial(verifier);
  const activeHole = getActiveHoleCell(proposal);

  const previousTestsOnThisVerifier = pastHistory
    .map((r) => {
      const found = r.tests.find((t) => t.letter === verifier.letter);
      if (!found) return null;
      return {
        round: r.roundNumber,
        proposal: r.proposal,
        passed: found.passed,
      };
    })
    .filter(Boolean) as { round: number; proposal: Code; passed: boolean }[];

  const handleTestClick = () => {
    if (!isRoundReadyForVerify || isTestedThisRound || testsRemaining <= 0 || isVerifying) return;
    setIsVerifying(true);
    sound.playCardInsert();

    setTimeout(() => {
      setIsVerifying(false);
      onRunTest(verifier.letter);
    }, 480);
  };

  const getMarkBadge = (status: MarkStatus) => {
    switch (status) {
      case 'eliminated':
        return (
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#f2d8d5] text-[#992d25] border border-[#992d25]">
            <X className="h-3.5 w-3.5 stroke-[3]" />
          </span>
        );
      case 'confirmed':
        return (
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#d8e8de] text-[#2f5941] border border-[#2f5941]">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </span>
        );
      case 'unsure':
        return (
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#f5e4be] text-[#8a560b] border border-[#b87314]">
            <HelpCircle className="h-3.5 w-3.5 stroke-[2.5]" />
          </span>
        );
      default:
        return (
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#efe5d2] text-[#7b6855] border border-[#bda98e]">
            <span className="text-[10px] font-typewriter">·</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl border-2 transition-all duration-200 overflow-hidden ${
        isTestedThisRound
          ? roundTestResult
            ? 'wc-wash-olive border-[#2f5941] shadow-md'
            : 'wc-wash-crimson border-[#992d25] shadow-md'
          : 'wc-paper border-[#a89276] hover:border-[#234b7a]'
      }`}
    >
      {/* Top Header: Slot Letter + Criterion ID + Verification Serial */}
      <div className="flex items-center justify-between border-b border-[#cbbba2] bg-[#efe5d2] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2f5941] font-typewriter text-xl font-bold text-[#faf6ee] shadow-xs border border-[#1e402f]">
            {verifier.letter}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-[#faf6ee] px-1.5 py-0.5 text-[10px] font-typewriter uppercase tracking-wider text-[#261f19] font-bold border border-[#a89276]">
                Carta #{String(card.id).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setShowMatrixPeek((prev) => !prev)}
                className="rounded bg-[#d8e8de] hover:bg-[#c5ddce] px-1.5 py-0.5 text-[10px] font-typewriter uppercase tracking-wider text-[#1e402f] font-bold border border-[#6e9980] cursor-pointer transition-colors"
                title="Inspeccionar targeta de verificació mecànica"
              >
                Verif. #{serialNumber}
              </button>
            </div>
            <h3 className="font-display text-base font-bold text-[#261f19] mt-0.5 line-clamp-1">
              {card.title}
            </h3>
          </div>
        </div>

        {/* Status Stamp */}
        <div className="flex items-center gap-1.5">
          {isTestedThisRound ? (
            roundTestResult ? (
              <span className="ww2-stamp text-[10px] font-bold text-[#2f5941] bg-[#d8e8de]">
                ✔ APROVAT
              </span>
            ) : (
              <span className="ww2-stamp text-[10px] font-bold text-[#992d25] bg-[#f2d8d5]">
                ✖ REBUTJAT
              </span>
            )
          ) : (
            <span className="rounded bg-[#faf6ee] border border-[#bda98e] px-2 py-0.5 text-[10px] font-typewriter text-[#5c4f42] uppercase">
              Ranura {verifier.letter}
            </span>
          )}
        </div>
      </div>

      {/* Body: Visual Diagram + Sub-rules */}
      <div className="flex-1 p-4 space-y-3">
        <CriterionGraphic card={card} />

        {(showMatrixPeek || isVerifying || isTestedThisRound) && (
          <div className="rounded-lg border border-[#6e9980] bg-[#d8e8de]/70 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-typewriter text-[#1e402f]">
              <span className="font-bold flex items-center gap-1">
                <Crosshair className="h-3 w-3" />
                <span>MATRIU VERIFICADORA #{serialNumber}</span>
              </span>
              <span>
                Forat [{proposal.blue}{proposal.yellow}{proposal.purple}]: R{activeHole.row + 1}·C{activeHole.col + 1}
              </span>
            </div>

            <div
              className="relative grid gap-[2px] bg-[#2f5941]/20 p-1.5 rounded border border-[#6e9980]"
              style={{
                gridTemplateColumns: `repeat(${MATRIX_COLS}, minmax(0, 1fr))`,
              }}
            >
              {PUNCH_MATRIX.map((cell) => {
                const isTargetHole = cell.index === activeHole.index;
                if (!cell.code) {
                  return (
                    <div
                      key={cell.index}
                      className="h-2 rounded-full bg-[#261f19]"
                    />
                  );
                }

                if (isTargetHole) {
                  if (isTestedThisRound && roundTestResult !== null) {
                    return (
                      <div
                        key={cell.index}
                        className={`h-2 rounded-full ring-2 ring-[#261f19] scale-[1.9] z-20 ${
                          roundTestResult ? 'bg-[#2f5941]' : 'bg-[#992d25]'
                        }`}
                      />
                    );
                  }
                  return (
                    <div
                      key={cell.index}
                      className="h-2 rounded-full bg-[#234b7a] ring-2 ring-[#faf6ee] scale-[1.75] z-20 animate-ping"
                    />
                  );
                }

                return (
                  <div
                    key={cell.index}
                    className="h-2 rounded-[1px] bg-[#faf5e8]/80"
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Mutually Exclusive Sub-rules */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-typewriter uppercase tracking-wider text-[#5c4f42] font-bold flex items-center justify-between">
            <span>Hipòtesis ({card.options.length}) — 1 és secreta</span>
            <span className="text-[9px] text-[#234b7a]">Clic per anotar a llapis</span>
          </div>

          {card.options.map((opt, idx) => {
            const mark = optionMarks[idx] || 'none';
            const proposalSatisfiesThisOpt = opt.evaluate(proposal);

            const isEliminatedByCurrentTest =
              showAutoHelper &&
              isTestedThisRound &&
              roundTestResult !== null &&
              ((roundTestResult === true && !proposalSatisfiesThisOpt) ||
                (roundTestResult === false && proposalSatisfiesThisOpt));

            return (
              <div
                key={opt.id}
                onClick={() => {
                  sound.playPencilMark();
                  onToggleOptionMark(idx);
                }}
                className={`group flex items-center justify-between gap-2 rounded-lg p-2.5 text-xs transition-all duration-150 cursor-pointer border ${
                  mark === 'eliminated' || isEliminatedByCurrentTest
                    ? 'border-[#cbbba2] bg-[#efe5d2]/60 opacity-55 line-through text-[#7b6855]'
                    : mark === 'confirmed'
                    ? 'wc-wash-olive border-[#2f5941] text-[#1e402f] font-bold'
                    : mark === 'unsure'
                    ? 'wc-wash-ochre border-[#b87314] text-[#784908]'
                    : 'border-[#bda98e] bg-[#faf6ee] hover:border-[#234b7a] text-[#261f19]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="shrink-0">{getMarkBadge(mark)}</div>
                  <span className="truncate">{opt.label}</span>
                </div>

                <span
                  className={`shrink-0 text-[10px] font-typewriter px-1.5 py-0.5 rounded border ${
                    proposalSatisfiesThisOpt
                      ? 'border-[#234b7a]/50 bg-[#d5e2ef] text-[#1b3b61] font-bold'
                      : 'border-[#cbbba2] bg-[#efe5d2] text-[#7b6855]'
                  }`}
                >
                  {proposal.blue}
                  {proposal.yellow}
                  {proposal.purple}: {proposalSatisfiesThisOpt ? 'Sí' : 'No'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Past Rounds History Badges */}
        {previousTestsOnThisVerifier.length > 0 && (
          <div className="pt-1.5 border-t border-[#d5c7b2] flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-typewriter uppercase text-[#5c4f42]">
              Rondes anteriors:
            </span>
            {previousTestsOnThisVerifier.map((item) => (
              <span
                key={item.round}
                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-typewriter text-[10px] font-bold border ${
                  item.passed
                    ? 'bg-[#d8e8de] border-[#2f5941] text-[#1e402f]'
                    : 'bg-[#f2d8d5] border-[#992d25] text-[#781f19]'
                }`}
              >
                <span>R{item.round}:</span>
                <span>
                  {item.proposal.blue}
                  {item.proposal.yellow}
                  {item.proposal.purple}
                </span>
                <span>{item.passed ? '✔' : '✖'}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Mechanical Punch Slot Action Footer */}
      <div className="border-t border-[#cbbba2] bg-[#efe5d2] p-3">
        {isTestedThisRound ? (
          <div
            className={`flex items-center justify-between rounded-lg p-2.5 border text-xs font-typewriter font-bold ${
              roundTestResult
                ? 'bg-[#d8e8de] border-[#2f5941] text-[#1e402f]'
                : 'bg-[#f2d8d5] border-[#992d25] text-[#781f19]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>
                Forat R{activeHole.row + 1}·C{activeHole.col + 1} [{proposal.blue}
                {proposal.yellow}
                {proposal.purple}]
              </span>
            </span>
            <span className="flex items-center gap-1">
              {roundTestResult ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#2f5941]" />
                  <span>VÀLID (✔)</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-[#992d25]" />
                  <span>FALLA (✖)</span>
                </>
              )}
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={!isRoundReadyForVerify || testsRemaining <= 0 || isVerifying}
            onClick={handleTestClick}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 font-typewriter text-xs uppercase tracking-wider font-bold transition-all duration-200 ${
              isRoundReadyForVerify && testsRemaining > 0 && !isVerifying
                ? 'bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] shadow-sm cursor-pointer active:scale-[0.98]'
                : 'bg-[#d8cbb8] text-[#8c7b68] cursor-not-allowed border border-[#c4b49b]'
            }`}
          >
            {!isRoundReadyForVerify ? (
              <span>Completa els Passos 1 i 2 de dalt per provar</span>
            ) : isVerifying ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Sparkles className="h-4 w-4 animate-spin" /> Alineant targetes amb Verif. #{serialNumber}...
              </span>
            ) : testsRemaining <= 0 ? (
              <span>Límit de 3 proves assolit aquesta ronda</span>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>
                  Inserir [{proposal.blue}-{proposal.yellow}-{proposal.purple}] a Verificador {verifier.letter}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
