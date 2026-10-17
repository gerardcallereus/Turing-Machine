import React from 'react';
import { RoundRecord } from '../types/game';
import { X, CheckCircle2, XCircle, History } from 'lucide-react';

interface HistoryDrawerProps {
  history: RoundRecord[];
  currentRound: number;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  currentRound,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261f19]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="wc-paper relative w-full max-w-xl rounded-xl border-2 border-[#7b6855] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b-2 border-[#cbbba2] bg-[#efe5d2] px-6 py-4">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-[#234b7a]" />
            <div>
              <h2 className="text-xl font-bold text-[#261f19]">Registre Històric de Rondes</h2>
              <p className="text-xs font-typewriter text-[#5c4f42]">Ronda en curs: {currentRound}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#5c4f42] hover:bg-[#e2d5be] hover:text-[#261f19] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-10 text-[#5c4f42]">
              <p className="text-base font-bold">Encara no has tancat cap ronda.</p>
              <p className="text-xs mt-1">
                També pots consultar totes les proves en viu a la Taula de Rondes del Quadern d'Anotació.
              </p>
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.roundNumber}
                className="wc-paper-aged rounded-xl border border-[#a89276] p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#cbbba2] pb-2">
                  <span className="font-typewriter text-xs font-bold text-[#261f19]">
                    RONDA {record.roundNumber}
                  </span>
                  <div className="flex items-center gap-1.5 font-typewriter text-xs font-bold">
                    <span className="bg-[#234b7a] text-[#faf6ee] px-2 py-0.5 rounded">
                      ▲{record.proposal.blue}
                    </span>
                    <span className="bg-[#c8831b] text-[#faf6ee] px-2 py-0.5 rounded">
                      ■{record.proposal.yellow}
                    </span>
                    <span className="bg-[#6d325b] text-[#faf6ee] px-2 py-0.5 rounded">
                      ●{record.proposal.purple}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {record.tests.map((t) => (
                    <div
                      key={t.letter}
                      className={`flex items-center justify-between p-2 rounded border font-typewriter text-xs font-bold ${
                        t.passed
                          ? 'bg-[#d8e8de] border-[#2f5941] text-[#1e402f]'
                          : 'bg-[#f2d8d5] border-[#992d25] text-[#781f19]'
                      }`}
                    >
                      <span>Verif. {t.letter}</span>
                      {t.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-[#2f5941]" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#992d25]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
