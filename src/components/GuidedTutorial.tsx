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
  Play,
  Pause,
  RotateCcw,
  Eye,
  Brain,
  Crosshair,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedTutorialProps {
  onFinishAndPlay: () => void;
  onBackToTheory: () => void;
}

// Introductory tutorial mission with code 1 - 2 - 3 and 4 crystal-clear verifiers
const TUTORIAL_PUZZLE: Puzzle = {
  id: 'tutorial-mission',
  title: "Missió Model • Demostració Codi 1-2-3",
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
  description: "Partida demostrativa comentada pas a pas per un criptògraf de Bletchley Park.",
};

interface DemoStep {
  stepNumber: number;
  title: string;
  badge: string;
  thought: string;
  action: string;
  deduction: string;
  proposal: Code;
  roundPhase: RoundPhase;
  currentRound: number;
  roundTests: { letter: string; passed: boolean }[];
  history: RoundRecord[];
  totalQueries: number;
  deductionSheet: DeductionSheetState;
  targetHighlight: 'verifiers' | 'rack' | 'verA' | 'verB' | 'verC' | 'nextRound' | 'rack2' | 'verD' | 'solve';
  isSolved?: boolean;
}

const DEMO_STEPS: DemoStep[] = [
  // PAS 1
  {
    stepNumber: 1,
    title: "Pas 1 de 9 • L'anàlisi prèvia: Què tenim a la taula?",
    badge: 'Fase de Pensament Inicial',
    thought:
      "Abans de tocar cap targeta, m'aturo a llegir amb calma els 4 Verificadors mecànics del tauler: el Verificador A compara el Triangle amb 1, el B compara el Quadrat amb 3, el C mira si el Quadrat és parell o senar, i el D compara el Cercle amb 3.",
    action:
      "No gasto cap prova a cegues. Planifico la meva primera jugada per obtenir la màxima informació possible de les dues primeres figures (▲ i ■).",
    deduction:
      "Tots 125 codis són possibles ara mateix. Una bona combinació inicial em permetrà descartar desenes de possibilitats en una sola ronda.",
    proposal: { blue: 1, yellow: 1, purple: 1 },
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

  // PAS 2
  {
    stepNumber: 2,
    title: 'Pas 2 de 9 • Ronda 1: Trio la combinació [▲3 - ■2 - ●5]',
    badge: 'Muntatge del Sandvitx',
    thought:
      "Trio els números estratègicament: ▲=3 (per provar el Verificador A), ■=2 (per provar el Verificador B i C amb la mateixa targeta) i ●=5.",
    action:
      "Col·loco les 3 targetes perforades al lector. Fixa't a la dreta: el cartró tapa 124 posicions i només deixa OBERT 1 sol forat a la Fila 7, Columna 3! Premo 'Fixar Targeta'.",
    deduction:
      "Amb aquesta sola targeta podré fer 3 preguntes intel·ligents als verificadors A, B i C abans de canviar de ronda.",
    proposal: { blue: 3, yellow: 2, purple: 5 },
    roundPhase: 'verify',
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
    targetHighlight: 'rack',
  },

  // PAS 3
  {
    stepNumber: 3,
    title: 'Pas 3 de 9 • Ronda 1 • Prova 1: Interrogo el Verificador A',
    badge: 'Primera Deducció Lògica',
    thought:
      "Començo pel Verificador A. Li presento la meva targeta amb ▲=3 per comprovar si la seva regla és '▲ = 1' o '▲ > 1'.",
    action:
      "Insereixo la targeta a la ranura A. Miro a través de l'únic forat obert: apareix un ✖ VERMELL (FALLA)!",
    deduction:
      "Raonament: Hem provat el 3. Si la regla fos '▲ > 1', 3 és més gran que 1 i hauria donat verd! Com que ha fallat, la regla secreta és obligatòriament «▲ = 1»! I per tant, el Triangle secret és l'1! Anoto al quadern: confirmo l'1 i ratllo 2, 3, 4, 5.",
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

  // PAS 4
  {
    stepNumber: 4,
    title: 'Pas 4 de 9 • Ronda 1 • Prova 2: Interrogo el Verificador B',
    badge: 'Segona Deducció Lògica',
    thought:
      "Continuo amb el mateix sandvitx a la mà (porta ■ = 2). Ara vull esbrinar la regla del Verificador B (que compara ■ amb 3).",
    action:
      "Insereixo la targeta a la ranura B. Miro pel forat: apareix un ✔ VERD (VÀLID)!",
    deduction:
      "Raonament: Com que el 2 ha donat verd, la regla secreta és «■ < 3» (perquè 2 és menor que 3). Això descarta que el Quadrat pugui ser 3, 4 o 5! Ara sé que el Quadrat només pot ser l'1 o el 2.",
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

  // PAS 5
  {
    stepNumber: 5,
    title: 'Pas 5 de 9 • Ronda 1 • Prova 3: Interrogo el Verificador C',
    badge: 'Tercera Deducció Lògica',
    thought:
      "Em queda 1 última prova per gastar en aquesta ronda (porto 2/3). Miro el Verificador C (Paritat del Quadrat). Com que la meva targeta porta ■ = 2, és ideal per saber si és parell o senar!",
    action:
      "Insereixo la targeta a la ranura C. Resultat pel forat: ✔ VERD (VÀLID)!",
    deduction:
      "Raonament: El Verificador C confirma que «■ és parell». Recorda que del Verificador B sabíem que ■ només podia ser 1 o 2. Com que ha de ser parell, és obligatòriament el 2! Ja tenim dues xifres descobertes: ▲ = 1 i ■ = 2!",
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

  // PAS 6
  {
    stepNumber: 6,
    title: 'Pas 6 de 9 • Canvi de Ronda: Passem a la Ronda 2',
    badge: 'Reglament del Joc',
    thought:
      "He esgotat les 3 proves de la Ronda 1 (3 de 3 fetes). La màquina no em permet fer cap més prova amb aquesta targeta.",
    action:
      "Premo el botó 'Següent Ronda' a la barra de control superior. La màquina arxiva la Ronda 1 a la taula d'historial i em torna a obrir el suport de targetes.",
    deduction:
      "Ara puc canviar lliurement els 3 números per muntar una nova targeta que em permeti descobrir l'última incògnita: el Cercle (●).",
    proposal: { blue: 1, yellow: 2, purple: 1 },
    roundPhase: 'select',
    currentRound: 2,
    roundTests: [],
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
    targetHighlight: 'nextRound',
  },

  // PAS 7
  {
    stepNumber: 7,
    title: 'Pas 7 de 9 • Ronda 2: Munto la targeta [▲1 - ■2 - ●3]',
    badge: 'Targeta Decisiva',
    thought:
      "Com que ja sé segur que ▲=1 i ■=2, poso aquests dos números directament. Per al Cercle (●), el Verificador D el compara amb 3. Provem amb ●=3!",
    action:
      "Munto la targeta ▲ = 1, ■ = 2 i ● = 3 al suport. Veig com el nou forat queda obert a la fila 3, columna 8, i premo 'Fixar Targeta'.",
    deduction:
      "Si el Verificador D dóna verd amb ●=3, hauré resolt tot el codi d'un sol cop!",
    proposal: { blue: 1, yellow: 2, purple: 3 },
    roundPhase: 'verify',
    currentRound: 2,
    roundTests: [],
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
    targetHighlight: 'rack2',
  },

  // PAS 8
  {
    stepNumber: 8,
    title: 'Pas 8 de 9 • Ronda 2 • Prova 4: Interrogo el Verificador D',
    badge: 'Últim Enigma Desxifrat',
    thought:
      "Insereixo la meva targeta [1 - 2 - 3] a l'últim verificador que em quedava: el Verificador D.",
    action:
      "Miro pel forat del Verificador D... I apareix un brillant ✔ VERD (VÀLID)!",
    deduction:
      "Raonament: Com que el 3 ha donat verd, la regla secreta és «● = 3»! Per tant, el Cercle val exactament 3! Ja ho tenim tot confirmat: Triangle = 1, Quadrat = 2, Cercle = 3. Només queda 1 únic candidat possible de tots 125!",
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

  // PAS 9
  {
    stepNumber: 9,
    title: 'Pas 9 de 9 • Resolució Final: Transmetre el Codi Secret!',
    badge: 'Victòria & Desxifrat',
    thought:
      "Tenim la certesa absoluta matemàtica: el codi secret és 1 - 2 - 3. Ho hem aconseguit en només 2 rondes i 4 proves!",
    action:
      "Premo el botó 'Desxifrar Codi Secret', marco 1 - 2 - 3 i transmeto la solució a Bletchley Park per guanyar la partida!",
    deduction:
      "Partida resolta amb èxit! Has après exactament com es juga: triar bones preguntes, llegir les respostes dels verificadors i descartar opcions al quadern.",
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
    isSolved: true,
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

  // Sound effects & confetti on step changes
  useEffect(() => {
    if (step.stepNumber === 2 || step.stepNumber === 6 || step.stepNumber === 7) {
      sound.playPunch();
    } else if (step.stepNumber === 3) {
      sound.playCardInsert();
      setTimeout(() => sound.playResult(false), 300);
    } else if (step.stepNumber === 4 || step.stepNumber === 5 || step.stepNumber === 8) {
      sound.playCardInsert();
      setTimeout(() => sound.playResult(true), 300);
    } else if (step.stepNumber === 9) {
      sound.playWin();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#234b7a', '#b87314', '#6d325b', '#2f5941'],
      });
    }
  }, [currentStepIndex]);

  // Autoplay handler
  useEffect(() => {
    if (isPlayingAuto) {
      autoPlayTimerRef.current = setTimeout(() => {
        if (currentStepIndex < DEMO_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlayingAuto(false);
        }
      }, 7500);
    } else {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Masterclass Cryptanalyst Playthrough Header */}
      <div className="wc-paper-aged rounded-xl border-2 border-[#8c765c] p-5 sm:p-7 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#d5c7b2] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="ww2-stamp text-[11px] font-bold text-[#2f5941]">
              FASE 2 DE 3 &bull; PARTIDA COMENTADA PER UN CRIPTÒGRAF
            </span>
            <span className="font-typewriter text-xs text-[#5c4f42] font-bold">
              Pas {step.stepNumber} de {DEMO_STEPS.length}
            </span>
          </div>

          {/* Observer Mode Notice & Controls */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 rounded bg-[#efe5d2] border border-[#a89276] px-2.5 py-1 text-[11px] font-typewriter text-[#5c4f42] font-bold">
              <Eye className="h-3.5 w-3.5 text-[#234b7a]" /> Mode Demostració
            </span>

            <button
              type="button"
              onClick={onBackToTheory}
              className="flex items-center gap-1.5 rounded-lg border border-[#8c765c] bg-[#efe5d2] hover:bg-[#e4d7be] px-3 py-1.5 font-typewriter text-xs font-bold text-[#261f19] transition-all cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#234b7a]" />
              <span className="hidden md:inline">Dossier Històric</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-1 rounded-lg border border-[#a89276] bg-[#faf6ee] px-2.5 py-1.5 font-typewriter text-xs font-bold text-[#332920] hover:text-[#261f19] cursor-pointer"
              title="Reiniciar tutorial des del principi"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlayingAuto((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-typewriter text-xs font-bold transition-all cursor-pointer ${
                isPlayingAuto
                  ? 'bg-[#b87314] text-[#faf6ee] border-[#784908] shadow-xs'
                  : 'bg-[#faf6ee] text-[#261f19] border-[#a89276] hover:border-[#234b7a]'
              }`}
            >
              {isPlayingAuto ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pausa</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-[#2f5941]" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

            {/* Stepper Buttons */}
            <button
              type="button"
              disabled={currentStepIndex <= 0}
              onClick={handlePrev}
              className="flex items-center gap-1 rounded-lg border border-[#a89276] bg-[#faf6ee] px-2.5 py-1.5 font-typewriter text-xs font-bold text-[#332920] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <button
              type="button"
              disabled={currentStepIndex >= DEMO_STEPS.length - 1}
              onClick={handleNext}
              className="flex items-center gap-1 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-3.5 py-1.5 font-typewriter text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <span>Següent</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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
                className={`flex-1 min-w-[34px] h-8 rounded-lg font-typewriter text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#234b7a] text-[#faf6ee] border-[#153152] scale-105 shadow-sm'
                    : isDone
                    ? 'wc-wash-olive text-[#1e402f] border-[#2f5941]'
                    : 'bg-[#faf6ee] text-[#8c765c] border-[#d5c7b2]'
                }`}
                title={s.title}
              >
                {isDone ? '✓' : s.stepNumber}
              </button>
            );
          })}
        </div>

        {/* The Masterclass Speech & Thought Box */}
        <div className="bg-[#faf5e8] rounded-xl border-2 border-[#a89276] p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dfd3be] pb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#261f19] text-[#faf6ee] border border-[#7b6855]">
                <Compass className="h-5 w-5 text-[#ffd27d]" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#261f19] leading-tight">
                  {step.title}
                </h3>
                <span className="font-typewriter text-[11px] text-[#2f5941] font-bold">
                  {step.badge}
                </span>
              </div>
            </div>

            {currentStepIndex === DEMO_STEPS.length - 1 && (
              <button
                type="button"
                onClick={onFinishAndPlay}
                className="flex items-center gap-1.5 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-4 py-2 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all animate-bounce"
              >
                <Award className="h-4 w-4" />
                <span>Anar a la Fase 3 &bull; Jugar jo mateix</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 3 Clear Dimensions: Thought -> Action -> Logical Deduction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. Thought */}
            <div className="rounded-lg wc-wash-blue border border-[#234b7a]/40 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-typewriter text-xs uppercase font-bold text-[#1b3b61]">
                <Brain className="h-4 w-4 text-[#234b7a]" />
                <span>1. Com pensa el Criptògraf:</span>
              </div>
              <p className="text-xs sm:text-sm text-[#261f19] leading-relaxed">
                "{step.thought}"
              </p>
            </div>

            {/* 2. Action on board */}
            <div className="rounded-lg wc-wash-ochre border border-[#b87314]/40 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-typewriter text-xs uppercase font-bold text-[#784908]">
                <Crosshair className="h-4 w-4 text-[#b87314]" />
                <span>2. Quina acció fa al tauler:</span>
              </div>
              <p className="text-xs sm:text-sm text-[#261f19] leading-relaxed">
                {step.action}
              </p>
            </div>

            {/* 3. Logical Deduction */}
            <div className="rounded-lg wc-wash-olive border border-[#2f5941]/40 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-typewriter text-xs uppercase font-bold text-[#1e402f]">
                <ShieldCheck className="h-4 w-4 text-[#2f5941]" />
                <span>3. Deducció lògica obtinguda:</span>
              </div>
              <p className="text-xs sm:text-sm text-[#261f19] leading-relaxed font-semibold">
                {step.deduction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* THE ACTUAL BOARD GAME TABLE (Rendered in Read-Only Demonstration Mode) */}
      <div className="relative space-y-6">
        {/* Subtle Watermark Tag indicating Observer Mode */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2f5941] animate-ping" />
            <span className="font-typewriter text-xs uppercase tracking-wider text-[#5c4f42] font-bold">
              Tauler de demostració en directe &bull; Observa com interactuen els components
            </span>
          </div>
          <span className="font-typewriter text-xs text-[#7b6855] italic hidden sm:inline">
            El tauler s'actualitza automàticament a cada pas
          </span>
        </div>

        {/* Real Round Control Bar (Non-editable overlay) */}
        <div
          className={`relative rounded-xl transition-all ${
            step.targetHighlight === 'nextRound' || step.targetHighlight === 'solve'
              ? 'ring-4 ring-[#2f5941] shadow-xl'
              : ''
          }`}
        >
          <RoundControl
            currentRound={step.currentRound}
            testsThisRound={step.roundTests.length}
            totalQueries={step.totalQueries}
            parQueries={TUTORIAL_PUZZLE.parQueries}
            parRounds={TUTORIAL_PUZZLE.parRounds}
            onNextRound={() => {}}
            onOpenGuessModal={() => {}}
            onOpenTutorial={() => {}}
            onOpenHistory={() => {}}
            isMuted={false}
            onToggleSound={() => {}}
          />
          {/* Transparent blocking overlay */}
          <div className="absolute inset-0 bg-transparent cursor-default" />
        </div>

        {/* Step 1 & 2: Proposal Builder (Punch card racks + Live superposition) */}
        <div
          className={`relative rounded-xl transition-all ${
            step.targetHighlight === 'rack' || step.targetHighlight === 'rack2'
              ? 'ring-4 ring-[#234b7a] shadow-xl'
              : ''
          }`}
        >
          <ProposalBuilder
            proposal={step.proposal}
            onChange={() => {}}
            roundPhase={step.roundPhase}
            onChangeRoundPhase={() => {}}
            currentRound={step.currentRound}
            testsLeftInRound={3 - step.roundTests.length}
            totalRoundTests={step.roundTests.length}
            lastTestedVerifier={
              step.roundTests.length > 0 ? step.roundTests[step.roundTests.length - 1] : null
            }
            onNextRound={() => {}}
          />
          {/* Transparent blocking overlay */}
          <div className="absolute inset-0 bg-transparent cursor-default" />
        </div>

        {/* Central Machine Console & Verifier Cards */}
        <section
          id="verifiers-station"
          className="space-y-4 transition-all scroll-mt-20"
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
              {TUTORIAL_PUZZLE.verifiers.map((v) => {
                const tested = step.roundTests.find((t) => t.letter === v.letter);
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
                    isTargetVerifier ? 'ring-4 ring-[#2f5941] shadow-xl scale-[1.02]' : ''
                  }`}
                >
                  <VerifierCard
                    verifier={v}
                    proposal={step.proposal}
                    isTestedThisRound={Boolean(testInRound)}
                    roundTestResult={testInRound ? testInRound.passed : null}
                    testsRemaining={3 - step.roundTests.length}
                    isRoundReadyForVerify={step.roundPhase === 'verify'}
                    onRunTest={() => {}}
                    optionMarks={step.deductionSheet.verifierOptions[v.letter] || {}}
                    onToggleOptionMark={() => {}}
                    showAutoHelper={true}
                    pastHistory={step.history}
                  />
                  {/* Transparent blocking overlay */}
                  <div className="absolute inset-0 bg-transparent cursor-default" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Real Official Deduction Sheet */}
        <div className="relative">
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
            onSelectProposal={() => {}}
            onOpenGuessModal={() => {}}
          />
          {/* Transparent blocking overlay */}
          <div className="absolute inset-0 bg-transparent cursor-default" />
        </div>
      </div>

      {/* Graduation Banner when Step 9 is reached */}
      {step.isSolved && (
        <div className="wc-paper-aged rounded-2xl border-4 border-[#2f5941] p-8 text-center space-y-5 animate-in zoom-in-95 shadow-2xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full wc-wash-olive border-2 border-[#2f5941] text-[#2f5941]">
            <Trophy className="h-10 w-10" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="ww2-stamp text-xs font-bold text-[#2f5941]">
              DEMOSTRACIÓ COMPLETADA &bull; ENTRENAMENT SUPERAT
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#261f19]">
              Ara ja saps exactament com guanyar a la Màquina de Turing!
            </h2>
            <p className="text-base text-[#463a2e] leading-relaxed">
              Has vist com pensa un criptògraf: triar preguntes intel·ligents, apilar les targetes, llegir les respostes dels verificadors i descartar opcions al quadern de deducció. Ara et toca a tu resoldre els teus propis enigmes!
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

      {/* Bottom Floating Navigation Bar */}
      <div className="sticky bottom-4 z-30 wc-paper-aged rounded-xl border-2 border-[#8c765c] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="font-typewriter text-xs font-bold text-[#261f19]">
            Pas {step.stepNumber} de {DEMO_STEPS.length}:
          </span>
          <span className="text-xs text-[#5c4f42] font-semibold truncate max-w-[200px] sm:max-w-md">
            {step.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentStepIndex <= 0}
            onClick={handlePrev}
            className="flex items-center gap-1.5 rounded-lg border border-[#a89276] bg-[#faf6ee] px-3.5 py-2 font-typewriter text-xs font-bold text-[#332920] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Pas Anterior</span>
          </button>

          {currentStepIndex < DEMO_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-5 py-2 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all"
            >
              <span>Següent Pas ({step.stepNumber + 1})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinishAndPlay}
              className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-6 py-2 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all"
            >
              <Award className="h-4 w-4" />
              <span>Jugar al Tauler Real</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
