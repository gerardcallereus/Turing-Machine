import React, { useState } from 'react';
import { Verifier, Code, MarkStatus, RoundRecord } from '../types/game';
import { CRITERIA_CARDS } from '../lib/criteriaCards';
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
  showAutoHelper = true,
  pastHistory = [],
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const card = CRITERIA_CARDS[verifier.cardId];

  if (!card) return null;

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
    }, 320);
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
      {/* Compact Header: Letter + Title + Quick Test Button or Result Stamp */}
      <div className="flex items-center justify-between gap-2.5 border-b border-[#cbbba2] bg-[#efe5d2] px-3.5 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2f5941] font-typewriter text-base font-bold text-[#faf6ee] shadow-xs border border-[#1e402f]">
            {verifier.letter}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-typewriter uppercase tracking-wider text-[#5c4f42] font-bold">
              Verificador {verifier.letter}
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-[#261f19] leading-snug break-words">
              {card.title}
            </h3>
          </div>
        </div>

        {/* Right: Either Result Stamp or Direct Test Button */}
        <div className="shrink-0">
          {isTestedThisRound ? (
            roundTestResult ? (
              <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#2f5941] bg-[#d8e8de] px-2.5 py-1 font-typewriter text-xs font-bold text-[#1e402f]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2f5941]" />
                <span>✔ SÍ</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#992d25] bg-[#f2d8d5] px-2.5 py-1 font-typewriter text-xs font-bold text-[#781f19]">
                <XCircle className="h-3.5 w-3.5 text-[#992d25]" />
                <span>✖ NO</span>
              </span>
            )
          ) : (
            <button
              type="button"
              disabled={!isRoundReadyForVerify || testsRemaining <= 0 || isVerifying}
              onClick={handleTestClick}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-typewriter text-xs font-bold uppercase transition-all ${
                isRoundReadyForVerify && testsRemaining > 0 && !isVerifying
                  ? 'bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] shadow-xs cursor-pointer active:scale-95'
                  : 'bg-[#d8cbb8] text-[#8c7b68] cursor-not-allowed border border-[#c4b49b]'
              }`}
            >
              {isVerifying ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Provant...</span>
                </>
              ) : testsRemaining <= 0 ? (
                <span>3/3 fetes</span>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  <span>Provar [{proposal.blue}-{proposal.yellow}-{proposal.purple}]</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Body: Graphic + Possible Secret Rules */}
      <div className="flex-1 p-3 space-y-2.5">
        <CriterionGraphic card={card} />

        {/* Mutually Exclusive Rules */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-typewriter text-[#5c4f42] font-bold flex items-center justify-between">
            <span> NOMÉS 1 REGLA ÉS CERTA:</span>
            <span className="text-[10px] text-[#234b7a]">Clic per ratllar (✖) o confirmar (✔)</span>
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
                className={`group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs transition-all duration-150 cursor-pointer border ${
                  mark === 'eliminated' || isEliminatedByCurrentTest
                    ? 'border-[#cbbba2] bg-[#efe5d2]/60 opacity-55 line-through text-[#7b6855]'
                    : mark === 'confirmed'
                    ? 'wc-wash-olive border-2 border-[#2f5941] text-[#1e402f] font-bold shadow-2xs'
                    : mark === 'unsure'
                    ? 'wc-wash-ochre border-[#b87314] text-[#784908]'
                    : 'border-[#bda98e] bg-[#faf6ee] hover:border-[#234b7a] text-[#261f19]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="shrink-0">{getMarkBadge(mark)}</div>
                  <span className="leading-snug">{opt.label}</span>
                </div>

                <span
                  className={`shrink-0 text-[10px] font-typewriter px-1.5 py-0.5 rounded border ${
                    proposalSatisfiesThisOpt
                      ? 'border-[#234b7a]/50 bg-[#d5e2ef] text-[#1b3b61] font-bold'
                      : 'border-[#cbbba2] bg-[#efe5d2] text-[#7b6855]'
                  }`}
                  title={`El teu codi actual [${proposal.blue}-${proposal.yellow}-${proposal.purple}] ${
                    proposalSatisfiesThisOpt ? 'SÍ que compleix' : 'NO compleix'
                  } aquesta regla`}
                >
                  {proposal.blue}-{proposal.yellow}-{proposal.purple}:{' '}
                  {proposalSatisfiesThisOpt ? 'Sí' : 'No'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Immediate Plain-Language Explanation when tested this round */}
        {isTestedThisRound && roundTestResult !== null && (
          <div
            className={`rounded-lg p-2 border text-[11px] leading-snug ${
              roundTestResult
                ? 'bg-[#d8e8de] border-[#2f5941] text-[#1e402f]'
                : 'bg-[#f2d8d5] border-[#992d25] text-[#781f19]'
            }`}
          >
            {roundTestResult ? (
              <span>
                <strong>✔ SÍ!</strong> El codi <strong>{proposal.blue}-{proposal.yellow}-{proposal.purple}</strong> compleix la pista secreta d&apos;{verifier.letter}. Descartem les opcions que tenien un «No»!
              </span>
            ) : (
              <span>
                <strong>✖ NO!</strong> El codi <strong>{proposal.blue}-{proposal.yellow}-{proposal.purple}</strong> falla en {verifier.letter}. Descartem l&apos;opció que tenia un «Sí»!
              </span>
            )}
          </div>
        )}

        {/* Past Rounds History Badges */}
        {previousTestsOnThisVerifier.length > 0 && (
          <div className="pt-1.5 border-t border-[#d5c7b2] flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-typewriter uppercase text-[#5c4f42]">
              Abans:
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
                <span>R{item.round}</span>
                <span>
                  ({item.proposal.blue}-{item.proposal.yellow}-{item.proposal.purple}):
                </span>
                <span>{item.passed ? '✔ Sí' : '✖ No'}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
