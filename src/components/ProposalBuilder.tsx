import React from 'react';
import { Code, DigitValue } from '../types/game';
import { PunchCard } from './PunchCard';
import {
  PUNCH_MATRIX,
  MATRIX_COLS,
  getStackedCellState,
  getActiveHoleCell,
} from '../lib/punchMatrix';
import {
  Layers,
  ShieldAlert,
  Crosshair,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../lib/sound';

export type RoundPhase = 'select' | 'verify';

interface ProposalBuilderProps {
  proposal: Code;
  onChange: (newProposal: Code) => void;
  roundPhase: RoundPhase;
  onChangeRoundPhase: (phase: RoundPhase) => void;
  currentRound: number;
  testsLeftInRound: number;
  totalRoundTests: number;
  lastTestedVerifier?: { letter: string; passed: boolean } | null;
  onNextRound: () => void;
}

export const ProposalBuilder: React.FC<ProposalBuilderProps> = ({
  proposal,
  onChange,
  roundPhase,
  onChangeRoundPhase,
  currentRound,
  testsLeftInRound,
  totalRoundTests,
  lastTestedVerifier,
  onNextRound,
}) => {
  const isLocked = roundPhase === 'verify';

  const handleDigitChange = (shape: 'blue' | 'yellow' | 'purple', val: DigitValue) => {
    if (isLocked) return;
    onChange({
      ...proposal,
      [shape]: val,
    });
  };

  const activeHole = getActiveHoleCell(proposal);

  const handleLockAndVerify = () => {
    sound.playCardInsert();
    onChangeRoundPhase('verify');
    setTimeout(() => {
      document.getElementById('verifiers-station')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);
  };

  return (
    <div className="wc-paper rounded-xl p-4 sm:p-6 space-y-5">
      {/* 2-Step Sequential Round Stepper Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#d5c7b2]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#234b7a] text-[#faf6ee] border border-[#153152] font-typewriter font-bold text-sm shadow-xs">
            R{currentRound}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#261f19]">
                Ronda {currentRound} &bull; {roundPhase === 'select' ? 'Preparar Targeta' : 'Verificació'}
              </h2>
              {isLocked ? (
                <span className="inline-flex items-center gap-1 rounded bg-[#d8e8de] border border-[#2f5941] px-2.5 py-0.5 text-[11px] font-typewriter font-bold text-[#1e402f]">
                  <Lock className="h-3 w-3" /> Combinació fixada [{proposal.blue}-{proposal.yellow}-{proposal.purple}]
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded bg-[#d5e2ef] border border-[#234b7a] px-2.5 py-0.5 text-[11px] font-typewriter font-bold text-[#1b3b61]">
                  <Crosshair className="h-3 w-3" /> Forat obert: Fila {activeHole.row + 1} · Col {activeHole.col + 1}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#5c4f42]">
              {roundPhase === 'select'
                ? 'Tria els 3 números i observa en temps real com queda apilat el sandvitx de targetes amb el seu únic forat.'
                : 'Targetes bloquejades a la màquina: interroga fins a 3 verificadors per comprovar les teves hipòtesis.'}
            </p>
          </div>
        </div>

        {/* 2-Step Visual Flow Indicator */}
        <div className="flex items-center gap-2 bg-[#efe5d2] p-1.5 rounded-xl border border-[#bda98e]">
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-typewriter text-xs font-bold transition-all ${
              roundPhase === 'select'
                ? 'bg-[#234b7a] text-[#faf6ee] shadow-xs'
                : 'wc-wash-olive text-[#1e402f] border border-[#2f5941]'
            }`}
          >
            <span>{roundPhase === 'select' ? '1' : '✓'}</span>
            <span>1. Triar Números i Veure Forat</span>
          </div>

          <ArrowRight className="h-3.5 w-3.5 text-[#8c765c]" />

          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-typewriter text-xs font-bold transition-all ${
              roundPhase === 'verify'
                ? 'bg-[#2f5941] text-[#faf6ee] shadow-xs'
                : 'text-[#7b6855]'
            }`}
          >
            <span>2. Provar Verificadors ({totalRoundTests}/3)</span>
          </div>
        </div>
      </div>

      {/* PHASE 1: Combined Number Selection + Live Superposition */}
      {roundPhase === 'select' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Action Callout Banner */}
          <div className="wc-wash-blue rounded-xl p-4 border border-[#234b7a]/50 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-typewriter text-xs uppercase tracking-widest text-[#1b3b61] font-bold">
                PAS 1: TRIA LA COMBINACIÓ I FIXA-LA PER PROVAR
              </div>
              <p className="text-sm text-[#261f19]">
                Canvia els valors de cada figura. A la dreta veus directament com s'apilen les tres targetes i quin forat queda obert. Quan estiguis llest, prem el botó per anar a interrogar els verificadors!
              </p>
            </div>

            <button
              type="button"
              onClick={handleLockAndVerify}
              className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-6 py-3 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all shrink-0"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Fixar Targeta [{proposal.blue} - {proposal.yellow} - {proposal.purple}] i Provar Verificadors</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Side-by-side: 3 Card Selectors on Left + Live Stacked Matrix on Right */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
            {/* Left 8 cols: 3 Individual Card Selectors */}
            <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <PunchCard
                shape="blue"
                value={proposal.blue}
                onChange={(v) => handleDigitChange('blue', v)}
                disabled={false}
                activeHoleIndex={activeHole.index}
              />
              <PunchCard
                shape="yellow"
                value={proposal.yellow}
                onChange={(v) => handleDigitChange('yellow', v)}
                disabled={false}
                activeHoleIndex={activeHole.index}
              />
              <PunchCard
                shape="purple"
                value={proposal.purple}
                onChange={(v) => handleDigitChange('purple', v)}
                disabled={false}
                activeHoleIndex={activeHole.index}
              />
            </div>

            {/* Right 4 cols: Live 3-Card Superposition Sandwich */}
            <div className="xl:col-span-4 flex flex-col justify-between rounded-xl border-2 border-[#8c765c] bg-[#efe5d2] p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-[10px] font-typewriter uppercase tracking-widest text-[#2f5941] font-bold">
                      SUPERPOSICIÓ EN TEMPS REAL
                    </div>
                    <div className="font-display text-base font-bold text-[#261f19]">
                      Sandvitx [▲{proposal.blue} - ■{proposal.yellow} - ●{proposal.purple}]
                    </div>
                  </div>
                  <span className="rounded bg-[#d8e8de] border border-[#2f5941] px-2 py-0.5 font-typewriter text-[10px] font-bold text-[#1e402f]">
                    1 / 125 Obert
                  </span>
                </div>

                {/* 3 Staggered Tabs */}
                <div className="grid grid-cols-3 gap-2 px-3 pt-1">
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-1 rounded-t-lg border-t-2 border-x-2 border-[#153152] bg-[#234b7a] px-2.5 py-0.5 font-typewriter text-xs font-bold text-[#faf6ee]">
                      <span>▲</span>
                      <span>{proposal.blue}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-1 rounded-t-lg border-t-2 border-x-2 border-[#805008] bg-[#c8831b] px-2.5 py-0.5 font-typewriter text-xs font-bold text-[#faf6ee]">
                      <span>■</span>
                      <span>{proposal.yellow}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="inline-flex items-center gap-1 rounded-t-lg border-t-2 border-x-2 border-[#451c38] bg-[#6d325b] px-2.5 py-0.5 font-typewriter text-xs font-bold text-[#faf6ee]">
                      <span>●</span>
                      <span>{proposal.purple}</span>
                    </div>
                  </div>
                </div>

                {/* Physical Perforated Card Matrix */}
                <div
                  className="rounded-lg border-2 border-[#8c765c] bg-[#faf5e8] p-2.5 text-[#261f19] shadow-md"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#dfd3be] pb-1 mb-1.5 text-[9px] font-typewriter font-bold text-[#5c4f42]">
                    <span>COMBINACIÓ: {proposal.blue}-{proposal.yellow}-{proposal.purple}</span>
                    <span className="text-[#1e402f] font-bold">
                      FORAT: R{activeHole.row + 1} · C{activeHole.col + 1}
                    </span>
                  </div>

                  <div
                    className="grid gap-[3px] bg-[#e6decb] p-1.5 rounded border border-[#cbbba2] shadow-inner"
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
                            className="relative aspect-square rounded-full bg-[#2f5941] ring-2 ring-[#261f19] scale-150 z-20 flex items-center justify-center shadow"
                            title={`ÚNIC FORAT OBERT (Fila ${cell.row + 1}, Columna ${cell.col + 1})`}
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-[#faf6ee]" />
                          </div>
                        );
                      }

                      if (st.blueOpen && st.yellowOpen && !st.purpleOpen) {
                        return (
                          <div
                            key={cell.index}
                            className="aspect-square rounded-[2px] bg-[#6d325b]/75"
                            title="Obert a ▲ i ■, tapat per la targeta ●"
                          />
                        );
                      }

                      if (st.blueOpen && !st.yellowOpen) {
                        return (
                          <div
                            key={cell.index}
                            className="aspect-square rounded-[2px] bg-[#c8831b]/75"
                            title="Obert a ▲, tapat per la targeta ■"
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

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[9px] font-typewriter text-[#5c4f42]">
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#2f5941]" />
                      <strong className="text-[#1e402f]">1 Obert</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-xs bg-[#c8831b]" />
                      <span>Tapat per ■ (20)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-xs bg-[#6d325b]" />
                      <span>Tapat per ● (4)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Ready to Verify CTA at bottom */}
              <div className="mt-3 pt-2 border-t border-[#cbbba2] flex justify-end">
                <button
                  type="button"
                  onClick={handleLockAndVerify}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] py-2.5 px-3 font-typewriter text-xs font-bold uppercase shadow-sm cursor-pointer transition-all"
                >
                  <span>Fixar Targeta i Provar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Locked Sandwich Summary Bar while testing Verifiers below */}
      {roundPhase === 'verify' && (
        <div className="wc-wash-olive rounded-xl p-4 border-2 border-[#2f5941] flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-[#faf6ee] px-4 py-2 rounded-xl border-2 border-[#2f5941] shadow-xs">
              <Lock className="h-4 w-4 text-[#2f5941]" />
              <span className="font-typewriter text-xs uppercase text-[#5c4f42] font-bold">
                Targeta de la Ronda {currentRound}:
              </span>
              <div className="flex items-center gap-1.5 font-typewriter text-base font-bold">
                <span className="text-[#faf6ee] bg-[#234b7a] px-2.5 py-0.5 rounded">
                  ▲{proposal.blue}
                </span>
                <span className="text-[#faf6ee] bg-[#c8831b] px-2.5 py-0.5 rounded">
                  ■{proposal.yellow}
                </span>
                <span className="text-[#faf6ee] bg-[#6d325b] px-2.5 py-0.5 rounded">
                  ●{proposal.purple}
                </span>
              </div>
              <span className="font-typewriter text-xs text-[#1e402f] font-bold ml-1">
                (Forat Fila {activeHole.row + 1} · Col {activeHole.col + 1})
              </span>
            </div>

            <div className="text-xs sm:text-sm text-[#1e402f]">
              <div>
                <strong>Fase de Verificació:</strong> Tens <strong>{testsLeftInRound} de 3 proves</strong> restants per a aquesta ronda ({totalRoundTests}/3 fetes).
              </div>
              <div className="text-xs text-[#2f5941]">
                Fes clic a qualsevol verificador de sota per inserir-hi la targeta i anotar el resultat.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalRoundTests === 0 && (
              <button
                type="button"
                onClick={() => {
                  sound.playPunch();
                  onChangeRoundPhase('select');
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[#8c765c] bg-[#faf6ee] hover:bg-[#efe5d2] px-3.5 py-2 font-typewriter text-xs font-bold text-[#261f19] cursor-pointer transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Canviar Números</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playPunch();
                onNextRound();
              }}
              className="flex items-center gap-2 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-5 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all"
            >
              <span>Acabar Ronda {currentRound} i Triar Nova Combinació (Ronda {currentRound + 1})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
