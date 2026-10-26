import React from 'react';
import { HelpCircle, ArrowRight, KeyRound, History } from 'lucide-react';
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
  onNextRound,
  onOpenGuessModal,
  onOpenTutorial,
  onOpenHistory,
}) => {
  return (
    <div className="wc-paper-aged flex flex-wrap items-center justify-between gap-2.5 rounded-xl px-4 py-2.5 border border-[#a89276]">
      {/* Left: Compact Round & Test Counter */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 bg-[#faf6ee] px-3 py-1.5 rounded-lg border border-[#a89276]">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-[#234b7a] text-[#faf6ee] font-typewriter font-bold text-xs">
            R{currentRound}
          </span>
          <div className="text-xs font-bold text-[#261f19]">
            Ronda {currentRound} &bull;{' '}
            <span className="font-typewriter text-[#234b7a]">
              {testsThisRound}/3 proves fetes
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-[#faf6ee] px-3 py-1.5 rounded-lg border border-[#a89276] text-xs text-[#5c4f42]">
          <span>Total proves:</span>
          <strong className="font-typewriter text-[#2f5941]">{totalQueries}</strong>
        </div>

        <button
          type="button"
          onClick={onOpenTutorial}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-[#a89276] bg-[#faf6ee] px-2.5 font-typewriter text-xs font-bold text-[#332920] hover:border-[#234b7a] cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5 text-[#234b7a]" />
          <span>Com jugar</span>
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-[#a89276] bg-[#faf6ee] px-2.5 font-typewriter text-xs font-bold text-[#332920] hover:border-[#234b7a] cursor-pointer"
        >
          <History className="h-3.5 w-3.5 text-[#b87314]" />
          <span className="hidden md:inline">Historial</span>
        </button>
      </div>

      {/* Right: Next Round & Solve Code */}
      <div className="flex items-center gap-2">
        {testsThisRound > 0 && (
          <button
            type="button"
            onClick={() => {
              sound.playPunch();
              onNextRound();
            }}
            className="flex items-center gap-1.5 rounded-lg border-2 border-[#234b7a] bg-[#faf6ee] hover:bg-[#d5e2ef] px-3 py-1.5 font-typewriter text-xs font-bold uppercase text-[#1b3b61] transition-all cursor-pointer shadow-2xs"
          >
            <span>Següent Ronda (Canviar números)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            sound.playPunch();
            onOpenGuessModal();
          }}
          className="flex items-center gap-1.5 rounded-lg bg-[#2f5941] hover:bg-[#234532] px-4 py-1.5 font-typewriter text-xs font-bold uppercase tracking-wider text-[#faf6ee] shadow-sm transition-all cursor-pointer"
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Resoldre Codi Secret</span>
        </button>
      </div>
    </div>
  );
};
