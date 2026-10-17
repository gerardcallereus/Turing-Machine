import React, { useState } from 'react';
import { Difficulty, Puzzle } from '../types/game';
import { PRESET_PUZZLES, generateRandomPuzzle, getDailyPuzzle } from '../lib/solver';
import { X, Calendar, Dices, Award, Check } from 'lucide-react';
import { sound } from '../lib/sound';

interface PuzzleSelectorModalProps {
  currentPuzzleId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectPuzzle: (puzzle: Puzzle) => void;
}

export const PuzzleSelectorModal: React.FC<PuzzleSelectorModalProps> = ({
  currentPuzzleId,
  isOpen,
  onClose,
  onSelectPuzzle,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Mitjà');

  if (!isOpen) return null;

  const handleSelectDaily = () => {
    sound.playPunch();
    const daily = getDailyPuzzle();
    onSelectPuzzle(daily);
    onClose();
  };

  const handleSelectRandom = () => {
    sound.playPunch();
    const puzzle = generateRandomPuzzle(selectedDifficulty);
    onSelectPuzzle(puzzle);
    onClose();
  };

  const handleSelectPreset = (p: Puzzle) => {
    sound.playPunch();
    onSelectPuzzle(p);
    onClose();
  };

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'Fàcil':
        return 'wc-wash-olive text-[#1e402f] border-[#2f5941]';
      case 'Mitjà':
        return 'wc-wash-blue text-[#1b3b61] border-[#234b7a]';
      case 'Difícil':
        return 'wc-wash-ochre text-[#784908] border-[#b87314]';
      case 'Expert':
        return 'wc-wash-crimson text-[#781f19] border-[#992d25]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261f19]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="wc-paper relative w-full max-w-2xl rounded-xl border-2 border-[#7b6855] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b-2 border-[#cbbba2] bg-[#efe5d2] px-6 py-4">
          <div>
            <span className="font-typewriter text-[10px] uppercase tracking-widest text-[#5c4f42] font-bold">
              ARXIU D'INTERCEPCIONS &bull; BLETCHLEY PARK
            </span>
            <h2 className="text-2xl font-bold text-[#261f19]">Selecció d'Enigmes</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#5c4f42] hover:bg-[#e2d5be] hover:text-[#261f19] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Daily Puzzle */}
            <div
              onClick={handleSelectDaily}
              className="wc-wash-blue flex flex-col justify-between rounded-xl border-2 border-[#234b7a] p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#234b7a]" />
                    <span className="font-display text-lg font-bold text-[#1b3b61]">
                      Intercepció Diària
                    </span>
                  </div>
                  <span className="font-typewriter text-[10px] uppercase bg-[#234b7a] text-[#faf6ee] px-2 py-0.5 rounded">
                    Avui
                  </span>
                </div>
                <p className="text-xs text-[#332920]">
                  Un codi nou interceptat cada 24 hores amb llavor determinista.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#234b7a]/30 font-typewriter text-xs font-bold text-[#1b3b61]">
                <span>Obrir Dossier d'Avui</span>
                <span>&rarr;</span>
              </div>
            </div>

            {/* Random Generator */}
            <div className="wc-wash-ochre flex flex-col justify-between rounded-xl border-2 border-[#b87314] p-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Dices className="h-5 w-5 text-[#b87314]" />
                  <span className="font-display text-lg font-bold text-[#784908]">
                    Generador Procedural
                  </span>
                </div>
                <p className="text-xs text-[#332920] mb-2">
                  Genera a l'instant un enigma inèdit amb solució única garantida.
                </p>

                <div className="grid grid-cols-4 gap-1 mt-2">
                  {(['Fàcil', 'Mitjà', 'Difícil', 'Expert'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDifficulty(d)}
                      className={`py-1 rounded font-typewriter text-[10px] font-bold transition-all cursor-pointer ${
                        selectedDifficulty === d
                          ? 'bg-[#b87314] text-[#faf6ee]'
                          : 'bg-[#faf6ee] text-[#5c4f42] border border-[#c9964c]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSelectRandom}
                className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-[#261f19] hover:bg-[#3d3228] py-2 font-typewriter text-xs font-bold text-[#faf6ee] cursor-pointer"
              >
                <Dices className="h-3.5 w-3.5" />
                <span>Generar en {selectedDifficulty}</span>
              </button>
            </div>
          </div>

          {/* Preset List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-typewriter uppercase tracking-wider text-[#5c4f42] font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-[#b87314]" />
                <span>Enigmes Oficials del Quadern ({PRESET_PUZZLES.length})</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {PRESET_PUZZLES.map((puzzle) => {
                const isCurrent = puzzle.id === currentPuzzleId;
                return (
                  <div
                    key={puzzle.id}
                    onClick={() => handleSelectPreset(puzzle)}
                    className={`flex items-center justify-between gap-3 rounded-xl border-2 p-3.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'wc-wash-olive border-[#2f5941]'
                        : 'bg-[#faf6ee] border-[#bda98e] hover:border-[#234b7a]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display text-base font-bold text-[#261f19]">
                          {puzzle.title}
                        </span>
                        <span
                          className={`text-[10px] font-typewriter font-bold px-2 py-0.5 rounded border ${getDifficultyBadge(
                            puzzle.difficulty
                          )}`}
                        >
                          {puzzle.difficulty}
                        </span>
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[10px] font-typewriter font-bold text-[#2f5941]">
                            <Check className="h-3 w-3" /> Actiu
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5c4f42] line-clamp-1">
                        {puzzle.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right font-typewriter text-[11px] text-[#5c4f42]">
                      <div>{puzzle.verifiers.length} verificadors</div>
                      <div>Par: {puzzle.parQueries} proves</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
