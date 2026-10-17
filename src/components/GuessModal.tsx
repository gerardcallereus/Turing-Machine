import React, { useState, useEffect } from 'react';
import { Code, DigitValue, Puzzle } from '../types/game';
import { codesEqual } from '../lib/solver';
import { CRITERIA_CARDS } from '../lib/criteriaCards';
import { sound } from '../lib/sound';
import confetti from 'canvas-confetti';
import { Trophy, X, AlertTriangle, RotateCcw, Award } from 'lucide-react';

interface GuessModalProps {
  puzzle: Puzzle;
  currentProposal: Code;
  totalQueries: number;
  currentRound: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailPenalty: () => void;
  onNextPuzzle: () => void;
}

export const GuessModal: React.FC<GuessModalProps> = ({
  puzzle,
  currentProposal,
  totalQueries,
  currentRound,
  isOpen,
  onClose,
  onSuccess,
  onFailPenalty,
  onNextPuzzle,
}) => {
  const [guess, setGuess] = useState<Code>({
    blue: currentProposal.blue,
    yellow: currentProposal.yellow,
    purple: currentProposal.purple,
  });
  const [resultState, setResultState] = useState<'prompt' | 'correct' | 'wrong'>('prompt');

  useEffect(() => {
    if (isOpen) {
      setGuess({
        blue: currentProposal.blue,
        yellow: currentProposal.yellow,
        purple: currentProposal.purple,
      });
      setResultState('prompt');
    }
  }, [isOpen, puzzle.id, currentProposal.blue, currentProposal.yellow, currentProposal.purple]);

  if (!isOpen) return null;

  const handleDigitChange = (shape: 'blue' | 'yellow' | 'purple', val: DigitValue) => {
    sound.playPunch();
    setGuess({
      ...guess,
      [shape]: val,
    });
  };

  const handleVerifyGuess = () => {
    const isCorrect = codesEqual(guess, puzzle.secretCode);

    if (isCorrect) {
      sound.playWin();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#234b7a', '#b87314', '#6d325b', '#2f5941'],
      });
      setResultState('correct');
      onSuccess();
    } else {
      sound.playResult(false);
      setResultState('wrong');
    }
  };

  const handleRetryRound = () => {
    setResultState('prompt');
    onFailPenalty();
    onClose();
  };

  const getPerformanceRating = () => {
    if (totalQueries <= puzzle.parQueries && currentRound <= puzzle.parRounds) {
      return {
        badge: '⭐ MEDALLA D\'OR DE BLETCHLEY PARK',
        color: 'wc-wash-ochre border-[#b87314] text-[#784908]',
        desc: "Has igualat o superat l'eficiència òptima de la màquina d'Alan Turing.",
      };
    } else if (totalQueries <= puzzle.parQueries + 2) {
      return {
        badge: '🥈 MESTRE CRIPTOANALISTA (CASETA 8)',
        color: 'wc-wash-blue border-[#234b7a] text-[#1b3b61]',
        desc: 'Excel·lent deducció analítica, molt a prop del càlcul òptim.',
      };
    } else {
      return {
        badge: '🥉 MISSATGE ENIGMA DESXIFRAT',
        color: 'wc-wash-olive border-[#2f5941] text-[#1e402f]',
        desc: 'Has descobert el codi secret únic mitjançant la perseverança lògica!',
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261f19]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="wc-paper relative w-full max-w-xl rounded-xl border-2 border-[#7b6855] p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {resultState !== 'correct' && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-[#5c4f42] hover:bg-[#efe5d2] hover:text-[#261f19] transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {resultState === 'prompt' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <span className="ww2-stamp text-[10px] font-bold text-[#2f5941] mb-2">
                TRANSMISSIÓ FINAL &bull; HUT 8
              </span>
              <h3 className="text-2xl font-bold text-[#261f19]">
                Has Desxifrat el Codi Secret?
              </h3>
              <p className="mt-1 text-xs text-[#5c4f42]">
                Selecciona la combinació exacta de les 3 targetes perforades
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Blue */}
              <div className="wc-wash-blue rounded-xl border-2 border-[#234b7a] p-3 flex flex-col items-center">
                <span className="text-2xl font-bold text-[#234b7a]">▲</span>
                <span className="text-xs font-bold text-[#1b3b61] mt-1">Blau</span>
                <span className="text-3xl font-typewriter font-bold text-[#261f19] my-2">{guess.blue}</span>
                <div className="grid grid-cols-5 gap-1 w-full">
                  {([1, 2, 3, 4, 5] as DigitValue[]).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleDigitChange('blue', num)}
                      className={`h-8 rounded font-typewriter text-xs font-bold border transition-all cursor-pointer ${
                        guess.blue === num
                          ? 'bg-[#234b7a] text-[#faf6ee] border-[#153152]'
                          : 'bg-[#faf6ee] text-[#261f19] border-[#a89276]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Yellow */}
              <div className="wc-wash-ochre rounded-xl border-2 border-[#b87314] p-3 flex flex-col items-center">
                <span className="text-2xl font-bold text-[#b87314]">■</span>
                <span className="text-xs font-bold text-[#784908] mt-1">Ocre</span>
                <span className="text-3xl font-typewriter font-bold text-[#261f19] my-2">{guess.yellow}</span>
                <div className="grid grid-cols-5 gap-1 w-full">
                  {([1, 2, 3, 4, 5] as DigitValue[]).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleDigitChange('yellow', num)}
                      className={`h-8 rounded font-typewriter text-xs font-bold border transition-all cursor-pointer ${
                        guess.yellow === num
                          ? 'bg-[#c8831b] text-[#faf6ee] border-[#805008]'
                          : 'bg-[#faf6ee] text-[#261f19] border-[#a89276]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purple */}
              <div className="wc-wash-plum rounded-xl border-2 border-[#6d325b] p-3 flex flex-col items-center">
                <span className="text-2xl font-bold text-[#6d325b]">●</span>
                <span className="text-xs font-bold text-[#4f2140] mt-1">Pruna</span>
                <span className="text-3xl font-typewriter font-bold text-[#261f19] my-2">{guess.purple}</span>
                <div className="grid grid-cols-5 gap-1 w-full">
                  {([1, 2, 3, 4, 5] as DigitValue[]).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleDigitChange('purple', num)}
                      className={`h-8 rounded font-typewriter text-xs font-bold border transition-all cursor-pointer ${
                        guess.purple === num
                          ? 'bg-[#6d325b] text-[#faf6ee] border-[#451c38]'
                          : 'bg-[#faf6ee] text-[#261f19] border-[#a89276]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#efe5d2] p-3 border border-[#bda98e] text-xs text-[#463a2e]">
              <AlertTriangle className="h-4 w-4 text-[#b87314] shrink-0" />
              <span>
                Si el codi és incorrecte, s'afegirà una ronda de penalització al registre.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-[#8c765c] bg-[#efe5d2] py-3 font-typewriter text-xs font-bold uppercase text-[#261f19] cursor-pointer"
              >
                Tornar al Tauler
              </button>
              <button
                type="button"
                onClick={handleVerifyGuess}
                className="flex-1 rounded-lg bg-[#2f5941] hover:bg-[#234532] py-3 font-typewriter text-xs font-bold uppercase text-[#faf6ee] shadow-md cursor-pointer"
              >
                Confirmar Solució
              </button>
            </div>
          </div>
        )}

        {resultState === 'correct' && (
          <div className="flex flex-col gap-5 overflow-y-auto pr-1">
            <div className="text-center pt-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full wc-wash-ochre text-[#784908] border-2 border-[#b87314] mb-3">
                <Trophy className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-[#261f19]">¡ENIGMA DESXIFRAT!</h2>
              <p className="text-xs text-[#5c4f42] mt-1">
                Transmissió verificada amb èxit per la Caseta 8 de Bletchley Park
              </p>
            </div>

            <div className="flex items-center justify-center gap-5 py-3 bg-[#efe5d2] rounded-xl border-2 border-[#8c765c]">
              <div className="flex items-center gap-2">
                <span className="text-[#234b7a] font-bold text-xl">▲</span>
                <span className="font-typewriter text-3xl font-bold text-[#261f19]">{puzzle.secretCode.blue}</span>
              </div>
              <span className="text-[#8c765c] text-xl font-bold">&bull;</span>
              <div className="flex items-center gap-2">
                <span className="text-[#b87314] font-bold text-xl">■</span>
                <span className="font-typewriter text-3xl font-bold text-[#261f19]">{puzzle.secretCode.yellow}</span>
              </div>
              <span className="text-[#8c765c] text-xl font-bold">&bull;</span>
              <div className="flex items-center gap-2">
                <span className="text-[#6d325b] font-bold text-xl">●</span>
                <span className="font-typewriter text-3xl font-bold text-[#261f19]">{puzzle.secretCode.purple}</span>
              </div>
            </div>

            {(() => {
              const rating = getPerformanceRating();
              return (
                <div className={`rounded-xl p-3 border-2 text-center ${rating.color}`}>
                  <div className="font-typewriter text-xs font-bold tracking-wide flex items-center justify-center gap-1.5">
                    <Award className="h-4 w-4" />
                    <span>{rating.badge}</span>
                  </div>
                  <div className="text-xs mt-1">{rating.desc}</div>
                </div>
              );
            })()}

            <div className="rounded-xl border border-[#bda98e] bg-[#efe5d2] p-3 text-left">
              <div className="text-[11px] font-typewriter uppercase tracking-wider text-[#5c4f42] font-bold mb-2">
                Regles Secretes de la Màquina:
              </div>
              <div className="space-y-1.5 text-xs">
                {puzzle.verifiers.map((v) => {
                  const card = CRITERIA_CARDS[v.cardId];
                  const activeRule = card?.options[v.activeRuleIndex];
                  return (
                    <div key={v.letter} className="flex items-center gap-2 text-[#261f19]">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-[#2f5941] text-[#faf6ee] font-typewriter text-[10px] font-bold">
                        {v.letter}
                      </span>
                      <span className="text-[#5c4f42] font-medium">{card?.title}:</span>
                      <span className="font-bold text-[#1e402f]">{activeRule?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-[#8c765c] bg-[#efe5d2] py-3 font-typewriter text-xs font-bold uppercase text-[#261f19] cursor-pointer"
              >
                Tancar i Revisar
              </button>
              <button
                type="button"
                onClick={() => {
                  onNextPuzzle();
                  onClose();
                }}
                className="flex-1 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] py-3 font-typewriter text-xs font-bold uppercase text-[#faf6ee] shadow-md cursor-pointer"
              >
                Següent Enigma
              </button>
            </div>
          </div>
        )}

        {resultState === 'wrong' && (
          <div className="flex flex-col gap-5 text-center">
            <div className="pt-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full wc-wash-crimson text-[#992d25] border-2 border-[#992d25] mb-3">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#261f19]">CODI INCORRECTE</h2>
              <p className="text-xs text-[#5c4f42] mt-2">
                El codi <strong className="font-typewriter text-[#992d25]">{guess.blue} - {guess.yellow} - {guess.purple}</strong> no compleix totes les regles secretes dels verificadors.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRetryRound}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#261f19] text-[#faf6ee] py-3 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Continuar Deduint (+1 Ronda)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
