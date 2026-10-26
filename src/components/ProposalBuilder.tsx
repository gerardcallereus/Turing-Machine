import React, { useState } from 'react';
import { Code, DigitValue } from '../types/game';
import {
  PUNCH_MATRIX,
  MATRIX_COLS,
  getStackedCellState,
  getActiveHoleCell,
} from '../lib/punchMatrix';
import {
  Layers,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { sound } from '../lib/sound';

export type RoundPhase = 'select' | 'verify';

interface ProposalBuilderProps {
  proposal: Code;
  onChange: (newProposal: Code) => void;
  roundPhase?: RoundPhase;
  onChangeRoundPhase?: (phase: RoundPhase) => void;
  currentRound: number;
  testsLeftInRound: number;
  totalRoundTests: number;
  lastTestedVerifier?: { letter: string; passed: boolean } | null;
  onNextRound: () => void;
}

export const ProposalBuilder: React.FC<ProposalBuilderProps> = ({
  proposal,
  onChange,
  currentRound,
  testsLeftInRound,
  totalRoundTests,
  onNextRound,
}) => {
  const [showPunchPreview, setShowPunchPreview] = useState(false);

  // Numbers are editable before the 1st test of the round; once a verifier is tested, they stay fixed for this round
  const isLocked = totalRoundTests > 0;

  const handleDigitChange = (shape: 'blue' | 'yellow' | 'purple', val: DigitValue) => {
    if (isLocked) return;
    sound.playPunch();
    onChange({
      ...proposal,
      [shape]: val,
    });
  };

  const activeHole = getActiveHoleCell(proposal);

  const rows: {
    shape: 'blue' | 'yellow' | 'purple';
    symbol: string;
    name: string;
    badgeCls: string;
    rowCls: string;
    activeBtnCls: string;
    idleBtnCls: string;
  }[] = [
    {
      shape: 'blue',
      symbol: '▲',
      name: 'Blau',
      badgeCls: 'bg-[#234b7a] text-[#faf6ee]',
      rowCls: 'wc-wash-blue border-[#234b7a]/50',
      activeBtnCls: 'bg-[#234b7a] text-[#faf6ee] border-[#153152] shadow-sm scale-105 ring-2 ring-[#234b7a]/40',
      idleBtnCls: 'bg-[#faf6ee] text-[#261f19] border-[#a89276] hover:border-[#234b7a]',
    },
    {
      shape: 'yellow',
      symbol: '■',
      name: 'Groc',
      badgeCls: 'bg-[#c8831b] text-[#faf6ee]',
      rowCls: 'wc-wash-ochre border-[#b87314]/50',
      activeBtnCls: 'bg-[#c8831b] text-[#faf6ee] border-[#805008] shadow-sm scale-105 ring-2 ring-[#c8831b]/40',
      idleBtnCls: 'bg-[#faf6ee] text-[#261f19] border-[#a89276] hover:border-[#b87314]',
    },
    {
      shape: 'purple',
      symbol: '●',
      name: 'Morat',
      badgeCls: 'bg-[#6d325b] text-[#faf6ee]',
      rowCls: 'wc-wash-plum border-[#6d325b]/50',
      activeBtnCls: 'bg-[#6d325b] text-[#faf6ee] border-[#451c38] shadow-sm scale-105 ring-2 ring-[#6d325b]/40',
      idleBtnCls: 'bg-[#faf6ee] text-[#261f19] border-[#a89276] hover:border-[#6d325b]',
    },
  ];

  return (
    <div className="wc-paper rounded-xl p-3.5 sm:p-4 border-2 border-[#8c765c] space-y-3 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#d5c7b2]">
        <div>
          <span className="font-typewriter text-[10px] uppercase tracking-wider text-[#234b7a] font-bold block">
            PAS 1 &bull; RONDA {currentRound}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#261f19] leading-tight">
            {isLocked ? 'Codi fixat en aquesta ronda' : 'Tria 3 números per provar'}
          </h2>
        </div>

        {/* Current Code Pill */}
        <div className="flex items-center gap-1 bg-[#efe5d2] px-2.5 py-1 rounded-lg border border-[#a89276] font-typewriter text-sm font-bold">
          <span className="text-[#234b7a]">▲{proposal.blue}</span>
          <span className="text-[#8c765c]">·</span>
          <span className="text-[#b87314]">■{proposal.yellow}</span>
          <span className="text-[#8c765c]">·</span>
          <span className="text-[#6d325b]">●{proposal.purple}</span>
        </div>
      </div>

      {/* 3 Compact Shape Selector Rows */}
      <div className="space-y-2">
        {rows.map((r) => {
          const currentVal = proposal[r.shape];
          return (
            <div
              key={r.shape}
              className={`flex items-center justify-between gap-2 rounded-lg border p-2 ${r.rowCls}`}
            >
              <div className="flex items-center gap-2 min-w-[78px]">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-md font-typewriter text-sm font-bold shrink-0 ${r.badgeCls}`}
                >
                  {r.symbol}
                </span>
                <span className="font-display text-sm font-bold text-[#261f19]">
                  {r.name}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 flex-1 max-w-[230px]">
                {([1, 2, 3, 4, 5] as DigitValue[]).map((num) => {
                  const isSelected = currentVal === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleDigitChange(r.shape, num)}
                      className={`h-8 rounded-md border font-typewriter text-sm font-bold transition-all ${
                        isSelected ? r.activeBtnCls : r.idleBtnCls
                      } ${
                        isLocked
                          ? isSelected
                            ? 'cursor-default'
                            : 'opacity-40 cursor-not-allowed'
                          : 'cursor-pointer active:scale-95'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status / Next Round Action */}
      {isLocked ? (
        <div className="wc-wash-olive rounded-lg p-2.5 border border-[#2f5941] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#1e402f]">
            <span className="flex items-center gap-1 font-bold">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>Provant [{proposal.blue}-{proposal.yellow}-{proposal.purple}]</span>
            </span>
            <span className="font-typewriter text-[11px] font-bold">
              {testsLeftInRound > 0
                ? `Et queden ${testsLeftInRound} proves`
                : '3/3 proves fetes!'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playPunch();
              onNextRound();
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] py-2 px-3 font-typewriter text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer transition-all"
          >
            <span>Canviar Números (Passar a Ronda {currentRound + 1})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-[#efe5d2] border border-[#cbbba2] px-3 py-2 text-xs text-[#463a2e] flex items-center justify-between gap-2">
          <span>
            👉 Ara fes clic a <strong>«Provar»</strong> en qualsevol <strong>Verificador (A, B, C...)</strong> de la dreta!
          </span>
        </div>
      )}

      {/* Optional Collapsible Punch-Card Superposition Viewer */}
      <div className="pt-1 border-t border-[#d5c7b2]">
        <button
          type="button"
          onClick={() => setShowPunchPreview((prev) => !prev)}
          className="w-full flex items-center justify-between text-[11px] font-typewriter text-[#5c4f42] hover:text-[#261f19] py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-bold">
            <Layers className="h-3.5 w-3.5 text-[#234b7a]" />
            <span>Targetes perforades apilades (1 forat obert)</span>
          </span>
          <span className="flex items-center gap-1 text-[#234b7a] font-bold">
            {showPunchPreview ? (
              <>
                <EyeOff className="h-3 w-3" /> Amagar
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" /> Veure forat
              </>
            )}
          </span>
        </button>

        {showPunchPreview && (
          <div className="mt-2 rounded-lg border border-[#8c765c] bg-[#faf5e8] p-2.5 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[10px] font-typewriter text-[#5c4f42]">
              <span>
                Sandvitx: <strong>▲{proposal.blue} + ■{proposal.yellow} + ●{proposal.purple}</strong>
              </span>
              <span className="text-[#1e402f] font-bold">
                Forat obert: Fila {activeHole.row + 1}, Col {activeHole.col + 1}
              </span>
            </div>

            <div
              className="grid gap-[2px] bg-[#e6decb] p-1.5 rounded border border-[#cbbba2]"
              style={{
                gridTemplateColumns: `repeat(${MATRIX_COLS}, minmax(0, 1fr))`,
              }}
            >
              {PUNCH_MATRIX.map((cell) => {
                const st = getStackedCellState(cell, proposal);
                if (!cell.code) {
                  return (
                    <div
                      key={cell.index}
                      className="aspect-square rounded-full bg-[#332920] scale-75"
                    />
                  );
                }
                if (st.allOpen) {
                  return (
                    <div
                      key={cell.index}
                      className="aspect-square rounded-full bg-[#2f5941] ring-2 ring-[#261f19] scale-150 z-10"
                      title={`Únic forat obert (Fila ${cell.row + 1}, Col ${cell.col + 1})`}
                    />
                  );
                }
                return (
                  <div
                    key={cell.index}
                    className="aspect-square rounded-[1px] bg-[#fbf8f1] border border-[#dfd5c2]"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
