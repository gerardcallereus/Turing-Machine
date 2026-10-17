import React from 'react';
import { Volume2, VolumeX, HelpCircle, ArrowRight, KeyRound, History } from 'lucide-react';
import { sound } from '../lib/sound';

interface RoundControlProps {
  currentRound: number;
  testsThisRound: number;
  totalQueries: number;
  parQueries: number;
  parRounds: number;
  onNextRound: () => void;
  onOpenGuessModal: () => void;
  onOpenTutorial: () => void;
  onOpenHistory: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const RoundControl: React.FC<RoundControlProps> = ({
  currentRound,
  testsThisRound,
  totalQueries,
  parQueries,
  parRounds,
  onNextRound,
  onOpenGuessModal,
  onOpenTutorial,
  onOpenHistory,
  isMuted,
  onToggleSound,
}) => {
  return (
    <div className="wc-paper-aged flex flex-wrap items-center justify-between gap-4 rounded-xl p-4">
      {/* Left: Round & Benchmark Stats */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 bg-[#faf6ee] px-4 py-2 rounded-lg border border-[#a89276]">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#234b7a] text-[#faf6ee] font-typewriter font-bold text-sm">
            R{currentRound}
          </div>
          <div>
            <div className="text-[10px] font-typewriter uppercase tracking-wider text-[#5c4f42]">
              Ronda {currentRound} (Sense límit de rondes)
            </div>
            <div className="text-xs font-bold text-[#261f19]">
              Proves d'aquesta ronda:{' '}
              <span className="font-typewriter text-[#234b7a]">
                {testsThisRound} / 3
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#faf6ee] px-4 py-2 rounded-lg border border-[#a89276]">
          <div>
            <div className="text-[10px] font-typewriter uppercase tracking-wider text-[#5c4f42]">
              Proves Totals Acumulades
            </div>
            <div className="text-xs font-bold text-[#261f19] flex items-center gap-2">
              <span className="font-typewriter text-[#2f5941]">{totalQueries}</span>
              <span className="text-[#7b6855] text-[11px] font-normal">
                (Rècord màquina: {parQueries} proves en {parRounds} rondes)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleSound}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#a89276] bg-[#faf6ee] text-[#5c4f42] hover:text-[#261f19] transition-all cursor-pointer"
            title={isMuted ? 'Activar so mecànic' : 'Silenciar so'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#234b7a]" />}
          </button>

          <button
            type="button"
            onClick={onOpenTutorial}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#a89276] bg-[#faf6ee] px-3 font-typewriter text-xs font-bold text-[#332920] hover:border-[#234b7a] transition-all cursor-pointer"
          >
            <HelpCircle className="h-4 w-4 text-[#234b7a]" />
            <span className="hidden sm:inline">Manual</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#a89276] bg-[#faf6ee] px-3 font-typewriter text-xs font-bold text-[#332920] hover:border-[#234b7a] transition-all cursor-pointer"
          >
            <History className="h-4 w-4 text-[#b87314]" />
            <span className="hidden sm:inline">Arxiu Rondes</span>
          </button>
        </div>
      </div>

      {/* Right: Next Round & Solve Code */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            sound.playPunch();
            onNextRound();
          }}
          className="flex items-center gap-2 rounded-lg border-2 border-[#7b6855] bg-[#faf6ee] hover:bg-[#efe5d2] px-4 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider text-[#261f19] transition-all cursor-pointer shadow-xs"
        >
          <span>Següent Ronda</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playPunch();
            onOpenGuessModal();
          }}
          className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] px-5 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider text-[#faf6ee] shadow-md transition-all cursor-pointer"
        >
          <KeyRound className="h-4 w-4" />
          <span>Desxifrar Codi Secret</span>
        </button>
      </div>
    </div>
  );
};
