import React, { useState, useEffect } from 'react';
import {
  Code,
  DeductionSheetState,
  Puzzle,
  RoundRecord,
} from '../types/game';
import { evaluateVerifier } from '../lib/solver';
import { sound } from '../lib/sound';
import { ProposalBuilder, RoundPhase } from './ProposalBuilder';
import { VerifierCard } from './VerifierCard';
import { DeductionNotepad } from './DeductionNotepad';
import { RoundControl } from './RoundControl';
import { GuessModal } from './GuessModal';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedTutorialProps {
  onFinishAndPlay: () => void;
  onBackToTheory: () => void;
}

// Introductory tutorial mission with code 1 - 2 - 3 and 4 crystal-clear verifiers
const TUTORIAL_PUZZLE: Puzzle = {
  id: 'tutorial-mission',
  title: "Missió d'Entrenament • Codi 1-2-3",
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
  description: "Partida d'entrenament guiada pas a pas seguint la mateixa mecànica del tauler real.",
};

const createInitialDeductionState = (): DeductionSheetState => ({
  digits: {
    blue: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
    yellow: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
    purple: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
  },
  verifierOptions: {},
  customNotes: '',
});

interface TutorialStepInfo {
  stepNumber: number;
  title: string;
  badge: string;
  dialogue: string;
  hint: string;
  targetHighlight?: 'rack' | 'verA' | 'verB' | 'verC' | 'verD' | 'nextRound' | 'guess';
}

const TUTORIAL_STEPS: TutorialStepInfo[] = [
  {
    stepNumber: 1,
    title: "1. Benvingut a la teva primera partida d'entrenament!",
    badge: 'Fase de Planificació',
    dialogue:
      "Aquest és el tauler oficial de la Màquina de Turing! El nostre objectiu és descobrir un codi secret de 3 figures (▲ Triangle, ■ Quadrat i ● Cercle). Fixa't a sota: tenim 4 Verificadors mecànics (A, B, C i D). Cadascun custodia una regla secreta que ens ajudarà a resoldre el misteri.",
    hint: "Observa les cartes dels verificadors per entendre quines preguntes podem fer a la màquina. Quan estiguis llest, prem 'Següent Pas' per preparar la primera targeta!",
  },
  {
    stepNumber: 2,
    title: '2. Ronda 1 • Triar la primera proposta [▲3 - ■2 - ●5]',
    badge: 'Muntar Targetes',
    dialogue:
      "Per començar la Ronda 1, farem una prova estratègica. Triarem ▲ = 3, ■ = 2 i ● = 5. Per què? Perquè ▲=3 ens permetrà interrogar el Verificador A (que compara amb 1) i el B (que compara ■ amb 3).",
    hint: "Tria el 3 al Triangle, el 2 al Quadrat i el 5 al Cercle al suport de targetes. Mira a la dreta com les 3 targetes apilades deixen un únic forat obert, i prem 'Fixar Targeta i Provar'!",
    targetHighlight: 'rack',
  },
  {
    stepNumber: 3,
    title: '3. Ronda 1 • Prova 1: Interrogar el Verificador A',
    badge: 'Primera Prova',
    dialogue:
      "Molt bé! Ara les targetes estan bloquejades a la teva mà per a tota la ronda. Baixem a la consola de verificadors. Fes clic a 'Inserir targeta' al Verificador A per comprovar la regla del Triangle!",
    hint: "Prem el botó del Verificador A per veure el resultat mecànic a través del forat.",
    targetHighlight: 'verA',
  },
  {
    stepNumber: 4,
    title: '4. Ronda 1 • Prova 2: Interrogar el Verificador B',
    badge: 'Segona Prova',
    dialogue:
      "Al Verificador A ha sortit VERMELL (✖)! Per què? Perquè hem provat ▲=3. Si la regla fos '▲ > 1', 3 hauria donat verd! Com que ha fallat, sabem amb certesa que la regla secreta és '▲ = 1' i que el Triangle secret val exactament 1! Ara provem el Verificador B amb el nostre Quadrat (■=2).",
    hint: "Prem 'Inserir targeta' al Verificador B!",
    targetHighlight: 'verB',
  },
  {
    stepNumber: 5,
    title: '5. Ronda 1 • Prova 3: Interrogar el Verificador C',
    badge: 'Tercera Prova',
    dialogue:
      "Al Verificador B ha sortit VERD (✔)! Com que el 2 ha donat vàlid, la seva regla és '■ < 3'. Això vol dir que el Quadrat només pot ser 1 o 2. Ara farem la 3a prova de la ronda al Verificador C (Paritat del Quadrat) per sortir de dubtes!",
    hint: "Prem 'Inserir targeta' al Verificador C per esgotar les 3 proves de la Ronda 1.",
    targetHighlight: 'verC',
  },
  {
    stepNumber: 6,
    title: '6. Finalitzar la Ronda 1 i Iniciar la Ronda 2',
    badge: 'Canvi de Ronda',
    dialogue:
      "Verd de nou (✔)! El Verificador C confirma que '■ és parell'. Com que del Verificador B sabíem que era 1 o 2, l'únic parell possible és el 2! Ja tenim el Triangle (1) i el Quadrat (2). Hem fet 3 proves (3/3), així que toca canviar de ronda!",
    hint: "Prem el botó 'Següent Ronda' a la barra superior per canviar les targetes i començar la Ronda 2.",
    targetHighlight: 'nextRound',
  },
  {
    stepNumber: 7,
    title: '7. Ronda 2 • Muntar la targeta final [▲1 - ■2 - ●3]',
    badge: 'Nova Combinació',
    dialogue:
      "Comença la Ronda 2! Ja sabem del cert que ▲ = 1 i ■ = 2. Només ens falta descobrir el Cercle (●). El Verificador D compara ● amb 3. Provem amb ● = 3!",
    hint: "Al suport de targetes, selecciona ▲ = 1, ■ = 2 i ● = 3, i prem 'Fixar Targeta i Provar'.",
    targetHighlight: 'rack',
  },
  {
    stepNumber: 8,
    title: '8. Ronda 2 • Prova 4: Interrogar el Verificador D',
    badge: 'Verificació Final',
    dialogue:
      "Ja tenim la targeta [1 - 2 - 3] a la mà. Només ens queda interrogar el Verificador D per confirmar el valor del Cercle!",
    hint: "Prem 'Inserir targeta' al Verificador D.",
    targetHighlight: 'verD',
  },
  {
    stepNumber: 9,
    title: '9. Missió Complerta! Desxifrar el Codi Secret',
    badge: 'Resolució',
    dialogue:
      "Verd (✔)! El Verificador D ha confirmat que la seva regla és '● = 3'. Ja ho tenim tot: Triangle = 1, Quadrat = 2, Cercle = 3! És hora de guanyar la partida!",
    hint: "Prem el botó 'Desxifrar Codi Secret' a la barra superior, confirma 1 - 2 - 3 i transmet la solució!",
    targetHighlight: 'guess',
  },
];

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({
  onFinishAndPlay,
  onBackToTheory,
}) => {
  // Tutorial specific guided step (1..9)
  const [currentTutorialStep, setCurrentTutorialStep] = useState<number>(1);

  // Exact real game state for the simulated puzzle
  const [puzzle] = useState<Puzzle>(TUTORIAL_PUZZLE);
  const [proposal, setProposal] = useState<Code>({ blue: 1, yellow: 2, purple: 3 });
  const [roundPhase, setRoundPhase] = useState<RoundPhase>('select');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [roundTests, setRoundTests] = useState<{ letter: string; passed: boolean }[]>([]);
  const [history, setHistory] = useState<RoundRecord[]>([]);
  const [totalQueries, setTotalQueries] = useState<number>(0);
  const [deductionSheet, setDeductionSheet] = useState<DeductionSheetState>(
    createInitialDeductionState()
  );
  const [showAutoHelper, setShowAutoHelper] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isGuessModalOpen, setIsGuessModalOpen] = useState<boolean>(false);
  const [isMissionComplete, setIsMissionComplete] = useState<boolean>(false);

  // Auto-advance tutorial steps when specific simulated game events happen
  useEffect(() => {
    // When proposal 3-2-5 is locked in round 1
    if (
      currentTutorialStep === 2 &&
      roundPhase === 'verify' &&
      proposal.blue === 3 &&
      proposal.yellow === 2 &&
      proposal.purple === 5
    ) {
      setCurrentTutorialStep(3);
    }
  }, [currentTutorialStep, roundPhase, proposal]);

  const handleRunTest = (letter: string) => {
    if (roundPhase !== 'verify') return;
    if (roundTests.length >= 3) return;
    if (roundTests.some((t) => t.letter === letter)) return;

    const verifier = puzzle.verifiers.find((v) => v.letter === letter);
    if (!verifier) return;

    const passed = evaluateVerifier(verifier, proposal);
    sound.playResult(passed);

    setRoundTests((prev) => [...prev, { letter, passed }]);
    setTotalQueries((prev) => prev + 1);

    // Auto-advance tutorial narrative based on tests done
    if (letter === 'A' && currentTutorialStep <= 3) {
      setCurrentTutorialStep(4);
      // Auto annotate deduction sheet to show realistic play
      setDeductionSheet((prev) => ({
        ...prev,
        digits: {
          ...prev.digits,
          blue: { 1: 'confirmed', 2: 'eliminated', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        },
        verifierOptions: {
          ...prev.verifierOptions,
          A: { 0: 'confirmed', 1: 'eliminated' },
        },
      }));
    } else if (letter === 'B' && currentTutorialStep <= 4) {
      setCurrentTutorialStep(5);
      setDeductionSheet((prev) => ({
        ...prev,
        digits: {
          ...prev.digits,
          yellow: { ...prev.digits.yellow, 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        },
        verifierOptions: {
          ...prev.verifierOptions,
          B: { 0: 'confirmed', 1: 'eliminated', 2: 'eliminated' },
        },
      }));
    } else if (letter === 'C' && currentTutorialStep <= 5) {
      setCurrentTutorialStep(6);
      setDeductionSheet((prev) => ({
        ...prev,
        digits: {
          ...prev.digits,
          yellow: { 1: 'eliminated', 2: 'confirmed', 3: 'eliminated', 4: 'eliminated', 5: 'eliminated' },
        },
        verifierOptions: {
          ...prev.verifierOptions,
          C: { 0: 'confirmed', 1: 'eliminated' },
        },
      }));
    } else if (letter === 'D' && currentTutorialStep <= 8) {
      setCurrentTutorialStep(9);
      setDeductionSheet((prev) => ({
        ...prev,
        digits: {
          ...prev.digits,
          purple: { 1: 'eliminated', 2: 'eliminated', 3: 'confirmed', 4: 'eliminated', 5: 'eliminated' },
        },
        verifierOptions: {
          ...prev.verifierOptions,
          D: { 0: 'eliminated', 1: 'confirmed', 2: 'eliminated' },
        },
      }));
    }
  };

  const handleNextRound = () => {
    sound.playPunch();
    setHistory((prev) => [
      ...prev,
      {
        roundNumber: currentRound,
        proposal: { ...proposal },
        tests: [...roundTests],
      },
    ]);

    setCurrentRound((prev) => prev + 1);
    setRoundTests([]);
    setRoundPhase('select');

    if (currentTutorialStep <= 6) {
      setCurrentTutorialStep(7);
      // Suggest the 1-2-3 proposal for round 2
      setProposal({ blue: 1, yellow: 2, purple: 3 });
    }
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleProposalPhaseChange = (phase: RoundPhase) => {
    setRoundPhase(phase);
    if (phase === 'verify') {
      if (currentTutorialStep === 2) {
        setCurrentTutorialStep(3);
      } else if (currentTutorialStep === 7) {
        setCurrentTutorialStep(8);
      }
    }
  };

  const testsRemaining = 3 - roundTests.length;
  const lastTestedVerifier =
    roundTests.length > 0 ? roundTests[roundTests.length - 1] : null;

  const currentStepData = TUTORIAL_STEPS[currentTutorialStep - 1] || TUTORIAL_STEPS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Vintage Archival Coach & Mission Stepper Header */}
      <div className="wc-paper-aged rounded-xl border-2 border-[#8c765c] p-5 sm:p-7 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#d5c7b2] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="ww2-stamp text-[11px] font-bold text-[#2f5941]">
              FASE 2 DE 3 &bull; PARTIDA SIMULADA D'ENTRENAMENT
            </span>
            <span className="font-typewriter text-xs text-[#5c4f42] font-bold">
              Pas {currentTutorialStep} de {TUTORIAL_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToTheory}
              className="flex items-center gap-1.5 rounded-lg border border-[#8c765c] bg-[#efe5d2] hover:bg-[#e4d7be] px-3 py-1.5 font-typewriter text-xs font-bold text-[#261f19] transition-all cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#234b7a]" />
              <span>Dossier Històric</span>
            </button>

            {/* Step navigation */}
            <button
              type="button"
              disabled={currentTutorialStep <= 1}
              onClick={() => {
                sound.playPunch();
                setCurrentTutorialStep((prev) => Math.max(1, prev - 1));
              }}
              className="flex items-center gap-1 rounded-lg border border-[#a89276] bg-[#faf6ee] px-2.5 py-1.5 font-typewriter text-xs font-bold text-[#332920] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <button
              type="button"
              disabled={currentTutorialStep >= TUTORIAL_STEPS.length}
              onClick={() => {
                sound.playPunch();
                setCurrentTutorialStep((prev) => Math.min(TUTORIAL_STEPS.length, prev + 1));
              }}
              className="flex items-center gap-1 rounded-lg bg-[#234b7a] text-[#faf6ee] px-3 py-1.5 font-typewriter text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <span>Següent</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Coach Speech Bubble with Alan Turing / Bletchley Instructor */}
        <div className="flex flex-col md:flex-row items-start gap-4 bg-[#faf5e8] rounded-xl border-2 border-[#a89276] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3 md:flex-col md:items-center md:text-center shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#234b7a] text-[#faf6ee] border-2 border-[#153152] shadow-sm">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-[#261f19]">
                Instructor de Bletchley
              </div>
              <span className="font-typewriter text-[10px] text-[#2f5941] font-bold">
                {currentStepData.badge}
              </span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#261f19]">
              {currentStepData.title}
            </h3>
            <p className="text-sm sm:text-base text-[#332920] leading-relaxed">
              {currentStepData.dialogue}
            </p>
            <div className="rounded-lg wc-wash-ochre border border-[#b87314] px-3.5 py-2 flex items-start gap-2.5 text-xs font-typewriter text-[#784908]">
              <Lightbulb className="h-4 w-4 shrink-0 text-[#b87314] mt-0.5" />
              <span>
                <strong>Què has de fer ara:</strong> {currentStepData.hint}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* THE ACTUAL REAL BOARD GAME TABLE OF THE SIMULATED MATCH */}
      <div className="space-y-6">
        {/* Real Round Control Bar */}
        <div
          className={`transition-all rounded-xl ${
            currentStepData.targetHighlight === 'nextRound' || currentStepData.targetHighlight === 'guess'
              ? 'ring-4 ring-[#2f5941] shadow-lg animate-pulse'
              : ''
          }`}
        >
          <RoundControl
            currentRound={currentRound}
            testsThisRound={roundTests.length}
            totalQueries={totalQueries}
            parQueries={puzzle.parQueries}
            parRounds={puzzle.parRounds}
            onNextRound={handleNextRound}
            onOpenGuessModal={() => setIsGuessModalOpen(true)}
            onOpenTutorial={() => {}}
            onOpenHistory={() => {}}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
          />
        </div>

        {/* Step 1 & 2: Proposal Builder (Punch card racks + Live superposition) */}
        <section
          className={`transition-all rounded-xl ${
            currentStepData.targetHighlight === 'rack'
              ? 'ring-4 ring-[#234b7a] shadow-lg'
              : ''
          }`}
        >
          <ProposalBuilder
            proposal={proposal}
            onChange={(newCode) => {
              if (roundPhase !== 'select' || roundTests.length > 0) return;
              setProposal(newCode);
            }}
            roundPhase={roundPhase}
            onChangeRoundPhase={handleProposalPhaseChange}
            currentRound={currentRound}
            testsLeftInRound={testsRemaining}
            totalRoundTests={roundTests.length}
            lastTestedVerifier={lastTestedVerifier}
            onNextRound={handleNextRound}
          />
        </section>

        {/* Central Machine Console & Verifier Cards */}
        <section
          id="verifiers-station"
          className={`space-y-4 transition-all scroll-mt-20 ${
            roundPhase === 'verify' ? 'opacity-100' : 'opacity-85'
          }`}
        >
          <div className="wc-paper-aged rounded-xl border-2 border-[#8c765c] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-typewriter text-[10px] uppercase tracking-widest text-[#2f5941] font-bold">
                CONSOLA MECÀNICA &bull; 4 RANURES DE VERIFICACIÓ
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#261f19]">
                Verificadors d'Entrenament (A, B, C, D)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {puzzle.verifiers.map((v) => {
                const tested = roundTests.find((t) => t.letter === v.letter);
                return (
                  <div
                    key={v.letter}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-typewriter text-xs font-bold border ${
                      tested
                        ? tested.passed
                          ? 'wc-wash-olive border-[#2f5941] text-[#1e402f]'
                          : 'wc-wash-crimson border-[#992d25] text-[#781f19]'
                        : 'bg-[#faf6ee] border-[#a89276] text-[#5c4f42]'
                    }`}
                  >
                    <span>{v.letter}</span>
                    <span>{tested ? (tested.passed ? '✔' : '✖') : '·'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {puzzle.verifiers.map((v) => {
              const testInRound = roundTests.find((t) => t.letter === v.letter);
              const isTargetVerifier =
                (v.letter === 'A' && currentStepData.targetHighlight === 'verA') ||
                (v.letter === 'B' && currentStepData.targetHighlight === 'verB') ||
                (v.letter === 'C' && currentStepData.targetHighlight === 'verC') ||
                (v.letter === 'D' && currentStepData.targetHighlight === 'verD');

              return (
                <div
                  key={v.letter}
                  className={`rounded-xl transition-all ${
                    isTargetVerifier ? 'ring-4 ring-[#2f5941] shadow-xl scale-[1.02]' : ''
                  }`}
                >
                  <VerifierCard
                    verifier={v}
                    proposal={proposal}
                    isTestedThisRound={Boolean(testInRound)}
                    roundTestResult={testInRound ? testInRound.passed : null}
                    testsRemaining={testsRemaining}
                    isRoundReadyForVerify={roundPhase === 'verify'}
                    onRunTest={handleRunTest}
                    optionMarks={deductionSheet.verifierOptions[v.letter] || {}}
                    onToggleOptionMark={(optIdx) => {
                      const currentMarks = deductionSheet.verifierOptions[v.letter] || {};
                      const curStatus = currentMarks[optIdx] || 'none';
                      const nextStatus =
                        curStatus === 'none'
                          ? 'eliminated'
                          : curStatus === 'eliminated'
                          ? 'confirmed'
                          : curStatus === 'confirmed'
                          ? 'unsure'
                          : 'none';
                      setDeductionSheet((prev) => ({
                        ...prev,
                        verifierOptions: {
                          ...prev.verifierOptions,
                          [v.letter]: {
                            ...currentMarks,
                            [optIdx]: nextStatus,
                          },
                        },
                      }));
                    }}
                    showAutoHelper={showAutoHelper}
                    pastHistory={history}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Real Official Deduction Sheet */}
        <section>
          <DeductionNotepad
            puzzle={puzzle}
            state={deductionSheet}
            onChange={setDeductionSheet}
            onReset={() => setDeductionSheet(createInitialDeductionState())}
            showAutoHelper={showAutoHelper}
            onToggleAutoHelper={() => setShowAutoHelper((prev) => !prev)}
            history={history}
            currentRound={currentRound}
            currentProposal={proposal}
            currentRoundTests={roundTests}
            onSelectProposal={(code) => {
              if (roundPhase === 'select' && roundTests.length === 0) {
                setProposal(code);
              }
            }}
            onOpenGuessModal={() => setIsGuessModalOpen(true)}
          />
        </section>
      </div>

      {/* Graduation Card when mission is solved */}
      {isMissionComplete && (
        <div className="wc-paper-aged rounded-2xl border-4 border-[#2f5941] p-8 text-center space-y-5 animate-in zoom-in-95 shadow-2xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full wc-wash-olive border-2 border-[#2f5941] text-[#2f5941]">
            <Trophy className="h-10 w-10" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="ww2-stamp text-xs font-bold text-[#2f5941]">
              OFICIAL DE CRIPTOANÀLISI D'ALAN TURING
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#261f19]">
              Enhorabona! Has completat la partida d'entrenament!
            </h2>
            <p className="text-base text-[#463a2e] leading-relaxed">
              Has seguit exactament la mecànica del joc físic real: formular hipòtesis amb les targetes perforades, consultar els verificadors i utilitzar la lògica deductiva al quadern. Ara ja estàs a punt per afrontar qualsevol enigma!
            </p>
          </div>

          <div className="pt-3 flex justify-center">
            <button
              type="button"
              onClick={onFinishAndPlay}
              className="flex items-center gap-2 rounded-xl bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-8 py-4 font-typewriter text-sm font-bold uppercase tracking-wider shadow-xl cursor-pointer transition-all hover:scale-105"
            >
              <Award className="h-5 w-5" />
              <span>Desbloquejar Fase 3 &bull; Entrar a la Sala de Joc Real</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Simulated Guess Modal */}
      <GuessModal
        puzzle={puzzle}
        currentProposal={proposal}
        totalQueries={totalQueries}
        currentRound={currentRound}
        isOpen={isGuessModalOpen}
        onClose={() => setIsGuessModalOpen(false)}
        onSuccess={() => {
          setIsMissionComplete(true);
          sound.playWin();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#234b7a', '#b87314', '#6d325b', '#2f5941'],
          });
        }}
        onFailPenalty={() => {}}
        onNextPuzzle={onFinishAndPlay}
      />
    </div>
  );
};
