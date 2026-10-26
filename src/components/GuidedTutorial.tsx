import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  DeductionSheetState,
  Puzzle,
  RoundRecord,
} from '../types/game';
import { sound } from '../lib/sound';
import { ProposalBuilder, RoundPhase } from './ProposalBuilder';
import { VerifierCard } from './VerifierCard';
import { DeductionNotepad } from './DeductionNotepad';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Crosshair,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedTutorialProps {
  onFinishAndPlay: () => void;
  onBackToTheory: () => void;
}

const TUTORIAL_PUZZLE: Puzzle = {
  id: 'tutorial-mission',
  title: 'Exemple Guiat • Codi 1-2-3',
  difficulty: 'Fàcil',
  secretCode: { blue: 1, yellow: 2, purple: 3 },
  verifiers: [
    { letter: 'A', cardId: 1, activeRuleIndex: 0 }, // ▲ = 1
    { letter: 'B', cardId: 3, activeRuleIndex: 0 }, // ■ < 3
    { letter: 'C', cardId: 6, activeRuleIndex: 0 }, // ■ és parell -> ■ = 2!
    { letter: 'D', cardId: 4, activeRuleIndex: 1 }, // ● = 3
  ],
  parRounds: 2,
  parQueries: 4,
  description: 'Exemple pas a pas per aprendre a jugar en 2 minuts.',
};

interface DemoStep {
  stepNumber: number;
  title: string;
  action: string;
  deduction: string;
  proposal: Code;
  roundPhase: RoundPhase;
  currentRound: number;
  roundTests: { letter: string; passed: boolean }[];
  history: RoundRecord[];
  totalQueries: number;
  deductionSheet: DeductionSheetState;
  targetHighlight: 'verifiers' | 'verA' | 'verB' | 'verC' | 'verD' | 'solve';
}

const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Pas 1 de 6 • Com funciona el tauler?',
    action:
      'Volem descobrir el Codi Secret de 3 números (▲ Blau, ■ Groc i ● Morat, de l’1 al 5). A l’esquerra tries els números i tens el teu Quadern; a la dreta tens 4 Verificadors de pistes (A, B, C i D).',
    deduction:
      'Cada Verificador té 2 o 3 regles escrites, però NOMÉS UNA és la regla secreta de veritat!',
    proposal: { blue: 3, yellow: 2, purple: 5 },
    roundPhase: 'select',
    currentRound: 1,
    roundTests: [],
    history: [],
    totalQueries: 0,
    deductionSheet: {
      digits: {
        blue: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
        yellow: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
        purple: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
      },
      verifierOptions: {},
      customNotes: '',
    },
    targetHighlight: 'verifiers',
  },
  {
    stepNumber: 2,
    title: 'Pas 2 de 6 • Ronda 1 (Prova 1): Provem el Verificador A',
    action:
      'Triem el codi de prova [▲3 - ■2 - ●5] a l’esquerra i premem «Provar» al Verificador A. Surt ✖ NO (Vermell)!',
    deduction:
      'Hem provat ▲=3 i ha dit que NO! Per tant, la regla «▲ és més gran que 1» és falsa. La regla secreta d’A és obligatòriament «▲ és igual a 1»! Ja sabem que ▲ = 1!',
    proposal: { blue: 3, yellow: 2, purple: 5 },
    roundPhase: 'verify',
    currentRound: 1,
    roundTests: [{ letter: 'A', passed: false }],
    history: [],
    totalQueries: 1,
    deductionSheet: {
      digits: {
        blue: { 1: 'confirmed', 2: 'eliminated', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        yellow: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
        purple: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
      },
      verifierOptions: {
        A: { 0: 'confirmed', 1: 'eliminated' },
      },
      customNotes: '',
    },
    targetHighlight: 'verA',
  },
  {
    stepNumber: 3,
    title: 'Pas 3 de 6 • Ronda 1 (Prova 2): Provem el Verificador B',
    action:
      'Amb el mateix codi [3-2-5] (on ■ = 2), premem «Provar» al Verificador B. Surt ✔ SÍ (Verd)!',
    deduction:
      'Com que ■=2 ha donat Sí, la regla secreta de B és «■ és més petit que 3 (1 o 2)». Per tant, al quadern ratllem el 3, el 4 i el 5 del Quadrat Groc!',
    proposal: { blue: 3, yellow: 2, purple: 5 },
    roundPhase: 'verify',
    currentRound: 1,
    roundTests: [
      { letter: 'A', passed: false },
      { letter: 'B', passed: true },
    ],
    history: [],
    totalQueries: 2,
    deductionSheet: {
      digits: {
        blue: { 1: 'confirmed', 2: 'eliminated', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        yellow: { 1: 'none', 2: 'none', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        purple: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
      },
      verifierOptions: {
        A: { 0: 'confirmed', 1: 'eliminated' },
        B: { 0: 'confirmed', 1: 'eliminated', 2: 'eliminated' },
      },
      customNotes: '',
    },
    targetHighlight: 'verB',
  },
  {
    stepNumber: 4,
    title: 'Pas 4 de 6 • Ronda 1 (Prova 3): Provem el Verificador C',
    action:
      'Fem la 3a prova d’aquesta ronda al Verificador C (amb ■ = 2). Surt ✔ SÍ (Verd)!',
    deduction:
      'El Verificador C confirma que «■ és Parell (2 o 4)». Com que pel Verificador B sabíem que era 1 o 2, i ara sabem que és parell... el Quadrat és segur el 2!',
    proposal: { blue: 3, yellow: 2, purple: 5 },
    roundPhase: 'verify',
    currentRound: 1,
    roundTests: [
      { letter: 'A', passed: false },
      { letter: 'B', passed: true },
      { letter: 'C', passed: true },
    ],
    history: [],
    totalQueries: 3,
    deductionSheet: {
      digits: {
        blue: { 1: 'confirmed', 2: 'eliminated', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        yellow: { 1: 'eliminated', 2: 'confirmed', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        purple: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
      },
      verifierOptions: {
        A: { 0: 'confirmed', 1: 'eliminated' },
        B: { 0: 'confirmed', 1: 'eliminated', 2: 'eliminated' },
        C: { 0: 'confirmed', 1: 'eliminated' },
      },
      customNotes: '',
    },
    targetHighlight: 'verC',
  },
  {
    stepNumber: 5,
    title: 'Pas 5 de 6 • Ronda 2: Provem [1-2-3] al Verificador D',
    action:
      'Com que ja hem fet 3 proves, passem a la Ronda 2, triem els números [▲1 - ■2 - ●3] i provem el Verificador D. Surt ✔ SÍ (Verd)!',
    deduction:
      'Com que hem provat ●=3 i ha donat Sí, la regla secreta del Verificador D és «● és igual a 3»! Ja sabem que el Cercle Morat val 3!',
    proposal: { blue: 1, yellow: 2, purple: 3 },
    roundPhase: 'verify',
    currentRound: 2,
    roundTests: [{ letter: 'D', passed: true }],
    history: [
      {
        roundNumber: 1,
        proposal: { blue: 3, yellow: 2, purple: 5 },
        tests: [
          { letter: 'A', passed: false },
          { letter: 'B', passed: true },
          { letter: 'C', passed: true },
        ],
      },
    ],
    totalQueries: 4,
    deductionSheet: {
      digits: {
        blue: { 1: 'confirmed', 2: 'eliminated', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        yellow: { 1: 'eliminated', 2: 'confirmed', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        purple: { 1: 'eliminated', 2: 'eliminated', 3: 'confirmed', 4: 'eliminated', 5: 'eliminated' },
      },
      verifierOptions: {
        A: { 0: 'confirmed', 1: 'eliminated' },
        B: { 0: 'confirmed', 1: 'eliminated', 2: 'eliminated' },
        C: { 0: 'confirmed', 1: 'eliminated' },
        D: { 0: 'eliminated', 1: 'confirmed', 2: 'eliminated' },
      },
      customNotes: '',
    },
    targetHighlight: 'verD',
  },
  {
    stepNumber: 6,
    title: 'Pas 6 de 6 • Codi Descobert (1 - 2 - 3)!',
    action:
      'Mira el Quadern de l’esquerra: ja tenim les 3 xifres confirmades: ▲ = 1, ■ = 2 i ● = 3. Premem «Resoldre!» per guanyar!',
    deduction:
      'Ja saps com es juga! Ara prem el botó verd de dalt a la dreta («Anar a Jugar!») per resoldre el teu primer enigma tu mateix.',
    proposal: { blue: 1, yellow: 2, purple: 3 },
    roundPhase: 'verify',
    currentRound: 2,
    roundTests: [{ letter: 'D', passed: true }],
    history: [
      {
        roundNumber: 1,
        proposal: { blue: 3, yellow: 2, purple: 5 },
        tests: [
          { letter: 'A', passed: false },
          { letter: 'B', passed: true },
          { letter: 'C', passed: true },
        ],
      },
    ],
    totalQueries: 4,
    deductionSheet: {
      digits: {
        blue: { 1: 'confirmed', 2: 'eliminated', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        yellow: { 1: 'eliminated', 2: 'confirmed', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        purple: { 1: 'eliminated', 2: 'eliminated', 3: 'confirmed', 4: 'eliminated', 5: 'eliminated' },
      },
      verifierOptions: {
        A: { 0: 'confirmed', 1: 'eliminated' },
        B: { 0: 'confirmed', 1: 'eliminated', 2: 'eliminated' },
        C: { 0: 'confirmed', 1: 'eliminated' },
        D: { 0: 'eliminated', 1: 'confirmed', 2: 'eliminated' },
      },
      customNotes: '',
    },
    targetHighlight: 'solve',
  },
];

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({
  onFinishAndPlay,
  onBackToTheory,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const step = DEMO_STEPS[currentStepIndex];

  useEffect(() => {
    if (step.stepNumber === 2) {
      sound.playCardInsert();
      setTimeout(() => sound.playResult(false), 250);
    } else if (step.stepNumber === 3 || step.stepNumber === 4 || step.stepNumber === 5) {
      sound.playCardInsert();
      setTimeout(() => sound.playResult(true), 250);
    } else if (step.stepNumber === 6) {
      sound.playWin();
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#234b7a', '#b87314', '#6d325b', '#2f5941'],
      });
    }
  }, [currentStepIndex, step.stepNumber]);

  useEffect(() => {
    if (isPlayingAuto) {
      autoPlayTimerRef.current = setTimeout(() => {
        if (currentStepIndex < DEMO_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlayingAuto(false);
        }
      }, 6500);
    } else if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isPlayingAuto, currentStepIndex]);

  const handleNext = () => {
    sound.playPunch();
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    sound.playPunch();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    sound.playPunch();
    setIsPlayingAuto(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {/* Compact Top Control & Explanation Banner (Fits on Chromebook together with the board below) */}
      <div className="wc-paper-aged rounded-xl border-2 border-[#8c765c] p-3.5 sm:p-4 space-y-3 shadow-xs">
        {/* Top Row: Stepper Numbers + Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d5c7b2] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="ww2-stamp text-[10px] font-bold text-[#2f5941]">
              FASE 2 &bull; EXEMPLE GUIAT PAS A PAS
            </span>

            {/* 6 Step Pills */}
            <div className="flex items-center gap-1">
              {DEMO_STEPS.map((s, idx) => {
                const isActive = idx === currentStepIndex;
                const isDone = idx < currentStepIndex;
                return (
                  <button
                    key={s.stepNumber}
                    type="button"
                    onClick={() => {
                      sound.playPunch();
                      setCurrentStepIndex(idx);
                    }}
                    className={`h-7 w-7 rounded-md font-typewriter text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'bg-[#234b7a] text-[#faf6ee] border-[#153152] scale-105 shadow-2xs'
                        : isDone
                        ? 'wc-wash-olive text-[#1e402f] border-[#2f5941]'
                        : 'bg-[#faf6ee] text-[#8c765c] border-[#d5c7b2]'
                    }`}
                  >
                    {isDone ? '✓' : s.stepNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onBackToTheory}
              className="flex items-center gap-1 rounded-lg border border-[#8c765c] bg-[#efe5d2] hover:bg-[#e4d7be] px-2.5 py-1 font-typewriter text-xs font-bold text-[#261f19] cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#234b7a]" />
              <span className="hidden md:inline">Història</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#a89276] bg-[#faf6ee] text-[#332920] cursor-pointer"
              title="Reiniciar exemple"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlayingAuto((prev) => !prev)}
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 font-typewriter text-xs font-bold cursor-pointer ${
                isPlayingAuto
                  ? 'bg-[#b87314] text-[#faf6ee] border-[#784908]'
                  : 'bg-[#faf6ee] text-[#261f19] border-[#a89276]'
              }`}
            >
              {isPlayingAuto ? (
                <>
                  <Pause className="h-3 w-3" />
                  <span>Pausa</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-[#2f5941]" />
                  <span>Auto</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={currentStepIndex <= 0}
              onClick={handlePrev}
              className="flex items-center gap-1 rounded-lg border border-[#a89276] bg-[#faf6ee] px-2.5 py-1 font-typewriter text-xs font-bold text-[#332920] disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {currentStepIndex < DEMO_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-3 py-1 font-typewriter text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs"
              >
                <span>Següent Pas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinishAndPlay}
                className="flex items-center gap-1.5 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-4 py-1.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer animate-bounce"
              >
                <Award className="h-4 w-4" />
                <span>Anar a Jugar!</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Step Explanation Box: 2 Clear Columns (Què fem + Què descobrim) */}
        <div className="bg-[#faf5e8] rounded-lg border border-[#a89276] p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#234b7a] shrink-0" />
              <h3 className="font-display text-base sm:text-lg font-bold text-[#261f19]">
                {step.title}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="rounded-lg wc-wash-blue border border-[#234b7a]/40 p-2.5 flex items-start gap-2">
              <Crosshair className="h-4 w-4 text-[#234b7a] shrink-0 mt-0.5" />
              <div className="text-xs text-[#261f19] leading-relaxed">
                <strong className="uppercase font-typewriter text-[#1b3b61] block text-[10px]">
                  1. Què fem al tauler:
                </strong>
                {step.action}
              </div>
            </div>

            <div className="rounded-lg wc-wash-olive border border-[#2f5941]/40 p-2.5 flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-[#2f5941] shrink-0 mt-0.5" />
              <div className="text-xs text-[#261f19] leading-relaxed font-medium">
                <strong className="uppercase font-typewriter text-[#1e402f] block text-[10px]">
                  2. Què descobrim (La Pista):
                </strong>
                {step.deduction}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE 2-COLUMN BOARD BELOW (Fits on Chromebook screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN (4 cols): Selector + Notepad */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative rounded-xl">
            <ProposalBuilder
              proposal={step.proposal}
              onChange={() => {}}
              roundPhase={step.roundPhase}
              onChangeRoundPhase={() => {}}
              currentRound={step.currentRound}
              testsLeftInRound={3 - step.roundTests.length}
              totalRoundTests={step.roundTests.length}
              onNextRound={() => {}}
            />
            <div className="absolute inset-0 bg-transparent cursor-default" />
          </div>

          <div
            className={`relative rounded-xl transition-all ${
              step.targetHighlight === 'solve' ? 'ring-4 ring-[#2f5941] shadow-lg' : ''
            }`}
          >
            <DeductionNotepad
              puzzle={TUTORIAL_PUZZLE}
              state={step.deductionSheet}
              onChange={() => {}}
              onReset={() => {}}
              showAutoHelper={true}
              onToggleAutoHelper={() => {}}
              history={step.history}
              currentRound={step.currentRound}
              currentProposal={step.proposal}
              currentRoundTests={step.roundTests}
              onOpenGuessModal={() => {}}
            />
            <div className="absolute inset-0 bg-transparent cursor-default" />
          </div>
        </div>

        {/* RIGHT COLUMN (8 cols): 4 Verifier Cards in a 2x2 Grid */}
        <div
          className={`lg:col-span-8 space-y-3 rounded-xl transition-all ${
            step.targetHighlight === 'verifiers' ? 'ring-4 ring-[#234b7a] p-1' : ''
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TUTORIAL_PUZZLE.verifiers.map((v) => {
              const testInRound = step.roundTests.find((t) => t.letter === v.letter);
              const isTargetVerifier =
                (v.letter === 'A' && step.targetHighlight === 'verA') ||
                (v.letter === 'B' && step.targetHighlight === 'verB') ||
                (v.letter === 'C' && step.targetHighlight === 'verC') ||
                (v.letter === 'D' && step.targetHighlight === 'verD');

              return (
                <div
                  key={v.letter}
                  className={`relative rounded-xl transition-all ${
                    isTargetVerifier ? 'ring-4 ring-[#2f5941] shadow-xl scale-[1.01]' : ''
                  }`}
                >
                  <VerifierCard
                    verifier={v}
                    proposal={step.proposal}
                    isTestedThisRound={Boolean(testInRound)}
                    roundTestResult={testInRound ? testInRound.passed : null}
                    testsRemaining={3 - step.roundTests.length}
                    isRoundReadyForVerify={true}
                    onRunTest={() => {}}
                    optionMarks={step.deductionSheet.verifierOptions[v.letter] || {}}
                    onToggleOptionMark={() => {}}
                    showAutoHelper={true}
                    pastHistory={step.history}
                  />
                  <div className="absolute inset-0 bg-transparent cursor-default" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
