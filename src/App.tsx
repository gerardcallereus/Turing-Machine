import React, { useState, useEffect } from 'react';
import {
  Code,
  DeductionSheetState,
  Puzzle,
  RoundRecord,
} from './types/game';
import { PRESET_PUZZLES, evaluateVerifier } from './lib/solver';
import { CRITERIA_CARDS } from './lib/criteriaCards';
import { sound } from './lib/sound';
import { ProposalBuilder, RoundPhase } from './components/ProposalBuilder';
import { VerifierCard } from './components/VerifierCard';
import { DeductionNotepad } from './components/DeductionNotepad';
import { RoundControl } from './components/RoundControl';
import { GuessModal } from './components/GuessModal';
import { TutorialModal } from './components/TutorialModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PuzzleSelectorModal } from './components/PuzzleSelectorModal';
import { EducationalUnit } from './components/EducationalUnit';
import { GuidedTutorial } from './components/GuidedTutorial';
import {
  BookOpen,
  Compass,
  FolderOpen,
  Volume2,
  VolumeX,
  HelpCircle,
  Gamepad2,
  Lock,
  CheckCircle2,
  Feather,
  User,
} from 'lucide-react';

const INITIAL_PROPOSAL: Code = {
  blue: 1,
  yellow: 2,
  purple: 3,
};

const createEmptyDeductionState = (): DeductionSheetState => ({
  digits: {
    blue: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
    yellow: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
    purple: { 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
  },
  verifierOptions: {},
  customNotes: '',
});

export default function App() {
  // Strictly sequential progression:
  // Phase 1 ('education') -> unlocks Phase 2 ('guided') -> unlocks Phase 3 ('game')
  const [currentView, setCurrentView] = useState<'education' | 'guided' | 'game'>('education');
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('turing_player_name') || '';
  });

  const isTeacherMode = playerName.trim().toLowerCase() === 'teacher';

  const [phase1Completed, setPhase1Completed] = useState<boolean>(() => {
    const saved = localStorage.getItem('turing_player_name') || '';
    return saved.trim().toLowerCase() === 'teacher';
  });
  const [phase2Completed, setPhase2Completed] = useState<boolean>(() => {
    const saved = localStorage.getItem('turing_player_name') || '';
    return saved.trim().toLowerCase() === 'teacher';
  });

  const handlePlayerNameChange = (newName: string) => {
    setPlayerName(newName);
    localStorage.setItem('turing_player_name', newName);
    if (newName.trim().toLowerCase() === 'teacher') {
      sound.playPunch();
      setPhase1Completed(true);
      setPhase2Completed(true);
    }
  };

  useEffect(() => {
    if (playerName.trim().toLowerCase() === 'teacher') {
      setPhase1Completed(true);
      setPhase2Completed(true);
    }
  }, [playerName]);

  const [puzzle, setPuzzle] = useState<Puzzle>(PRESET_PUZZLES[0]);
  const [proposal, setProposal] = useState<Code>(INITIAL_PROPOSAL);
  const [roundPhase, setRoundPhase] = useState<RoundPhase>('select');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [roundTests, setRoundTests] = useState<{ letter: string; passed: boolean }[]>([]);
  const [history, setHistory] = useState<RoundRecord[]>([]);
  const [totalQueries, setTotalQueries] = useState<number>(0);
  const [deductionSheet, setDeductionSheet] = useState<DeductionSheetState>(
    createEmptyDeductionState()
  );
  const [showAutoHelper, setShowAutoHelper] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Modals state
  const [isGuessModalOpen, setIsGuessModalOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isPuzzleSelectorOpen, setIsPuzzleSelectorOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleSelectPuzzle = (newPuzzle: Puzzle) => {
    setPuzzle(newPuzzle);
    setProposal(INITIAL_PROPOSAL);
    setRoundPhase('select');
    setCurrentRound(1);
    setRoundTests([]);
    setHistory([]);
    setTotalQueries(0);
    setDeductionSheet(createEmptyDeductionState());
  };

  const handleNextPuzzle = () => {
    const currentIndex = PRESET_PUZZLES.findIndex((p) => p.id === puzzle.id);
    if (currentIndex !== -1 && currentIndex < PRESET_PUZZLES.length - 1) {
      handleSelectPuzzle(PRESET_PUZZLES[currentIndex + 1]);
    } else {
      setIsPuzzleSelectorOpen(true);
    }
  };

  const handleRunTest = (letter: string) => {
    if (roundTests.length >= 3) return;
    if (roundTests.some((t) => t.letter === letter)) return;

    const verifier = puzzle.verifiers.find((v) => v.letter === letter);
    if (!verifier) return;

    const passed = evaluateVerifier(verifier, proposal);
    sound.playResult(passed);

    setRoundPhase('verify');
    setRoundTests((prev) => [...prev, { letter, passed }]);
    setTotalQueries((prev) => prev + 1);

    // Automatically eliminate contradicted options on this Verifier card when helper is enabled
    const card = CRITERIA_CARDS[verifier.cardId];
    if (card && showAutoHelper) {
      setDeductionSheet((prev) => {
        const currentMarks = { ...(prev.verifierOptions[letter] || {}) };
        card.options.forEach((opt, idx) => {
          const optPassed = opt.evaluate(proposal);
          if ((passed && !optPassed) || (!passed && optPassed)) {
            currentMarks[idx] = 'eliminated';
          }
        });
        const remainingIdx = card.options
          .map((_, idx) => idx)
          .filter((idx) => currentMarks[idx] !== 'eliminated');
        if (remainingIdx.length === 1) {
          currentMarks[remainingIdx[0]] = 'confirmed';
        }
        return {
          ...prev,
          verifierOptions: {
            ...prev.verifierOptions,
            [letter]: currentMarks,
          },
        };
      });
    }
  };

  const handleNextRound = () => {
    if (roundTests.length > 0) {
      setHistory((prev) => [
        ...prev,
        {
          roundNumber: currentRound,
          proposal: { ...proposal },
          tests: [...roundTests],
        },
      ]);
    }

    setCurrentRound((prev) => prev + 1);
    setRoundTests([]);
    setRoundPhase('select');
  };

  const handleFailPenalty = () => {
    setCurrentRound((prev) => prev + 1);
    setRoundTests([]);
    setRoundPhase('select');
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const testsRemaining = 3 - roundTests.length;
  const lastTestedVerifier =
    roundTests.length > 0 ? roundTests[roundTests.length - 1] : null;

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#234b7a] selection:text-[#faf6ee]">
      {/* Compact Archival Top Header (Chromebook-friendly height) */}
      <header className="border-b-2 border-[#a89276] bg-[#efe5d2]/95 sticky top-0 z-40 backdrop-blur-xs shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2">
          {/* Logo & Historical Identity */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#261f19] text-[#faf6ee] border border-[#7b6855] shadow-2xs">
              <Feather className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-wide text-[#261f19] leading-tight">
                Bletchley Park 1941 &bull; Màquina de Turing
              </h1>
            </div>
          </div>

          {/* Strictly Sequential 3-Phase Navigation Bar */}
          <nav className="flex items-center gap-1 bg-[#e4d7c0] p-1 rounded-xl border border-[#a89276]">
            {/* Phase 1: History + Quiz */}
            <button
              type="button"
              onClick={() => {
                sound.playPencilMark();
                setCurrentView('education');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-typewriter text-xs font-bold transition-all cursor-pointer ${
                currentView === 'education'
                  ? 'bg-[#234b7a] text-[#faf6ee] shadow-2xs'
                  : 'text-[#332920] hover:bg-[#efe5d2]'
              }`}
            >
              {phase1Completed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7de0a6]" />
              ) : (
                <BookOpen className="h-3.5 w-3.5" />
              )}
              <span>1. Història i Test</span>
            </button>

            {/* Phase 2: Step-by-Step Guided Tutorial */}
            <button
              type="button"
              disabled={!phase1Completed}
              onClick={() => {
                if (!phase1Completed) return;
                sound.playPencilMark();
                setCurrentView('guided');
              }}
              title={
                phase1Completed
                  ? 'Accedir al Tutorial Guiat Pas a Pas'
                  : 'Bloquejat: Supera primer el Test de Lectura (Fase 1)'
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-typewriter text-xs font-bold transition-all ${
                currentView === 'guided'
                  ? 'bg-[#234b7a] text-[#faf6ee] shadow-2xs cursor-pointer'
                  : phase1Completed
                  ? 'text-[#332920] hover:bg-[#efe5d2] cursor-pointer'
                  : 'text-[#8c7b68] opacity-60 cursor-not-allowed'
              }`}
            >
              {!phase1Completed ? (
                <Lock className="h-3.5 w-3.5" />
              ) : phase2Completed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2f5941]" />
              ) : (
                <Compass className="h-3.5 w-3.5" />
              )}
              <span>2. Com Jugar (Exemple)</span>
            </button>

            {/* Phase 3: Full Board Game */}
            <button
              type="button"
              disabled={!phase2Completed}
              onClick={() => {
                if (!phase2Completed) return;
                sound.playPencilMark();
                setCurrentView('game');
              }}
              title={
                phase2Completed
                  ? 'Accedir al Tauler de Joc'
                  : 'Bloquejat: Completa primer el Tutorial (Fase 2)'
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-typewriter text-xs font-bold transition-all ${
                currentView === 'game'
                  ? 'bg-[#2f5941] text-[#faf6ee] shadow-2xs cursor-pointer'
                  : phase2Completed
                  ? 'text-[#332920] hover:bg-[#efe5d2] cursor-pointer'
                  : 'text-[#8c7b68] opacity-60 cursor-not-allowed'
              }`}
            >
              {!phase2Completed ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                <Gamepad2 className="h-3.5 w-3.5" />
              )}
              <span>3. Jugar</span>
            </button>
          </nav>

          {/* Right Quick Tools */}
          <div className="flex items-center gap-1.5">
            {currentView === 'game' && (
              <button
                type="button"
                onClick={() => setIsPuzzleSelectorOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[#8c765c] bg-[#faf6ee] px-2.5 py-1 font-typewriter text-xs font-bold text-[#261f19] hover:border-[#234b7a] transition-all cursor-pointer shadow-2xs"
              >
                <FolderOpen className="h-3.5 w-3.5 text-[#234b7a]" />
                <span className="max-w-[130px] sm:max-w-[170px] truncate">{puzzle.title}</span>
              </button>
            )}

            {/* Agent / Player Badge in Header */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#a89276] bg-[#faf6ee] px-2 py-1 font-typewriter text-xs text-[#5c4f42]">
              <User className="h-3.5 w-3.5 text-[#234b7a]" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => handlePlayerNameChange(e.target.value)}
                placeholder="Agent..."
                title="Nom de l'agent (escriu 'teacher' per activar el mode professor)"
                aria-label="Nom de l'agent"
                className="bg-transparent border-none outline-none text-xs font-typewriter font-semibold text-[#261f19] w-16 sm:w-20 placeholder:text-[#a89276]"
              />
              {isTeacherMode && (
                <span className="rounded bg-[#b87314] px-1.5 py-0.5 font-typewriter text-[10px] font-bold text-[#faf6ee] uppercase tracking-wider">
                  DOCENT
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#a89276] bg-[#faf6ee] text-[#5c4f42] hover:text-[#261f19] transition-all cursor-pointer"
              title={isMuted ? 'Activar so' : 'Silenciar so'}
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#234b7a]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsTutorialOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#a89276] bg-[#faf6ee] text-[#5c4f42] hover:text-[#261f19] transition-all cursor-pointer"
              title="Com es juga"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#234b7a]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 py-3 sm:py-4">
        {/* PHASE 1: Historical WWII & Alan Turing Dossier + Mandatory Reading Test */}
        {currentView === 'education' && (
          <EducationalUnit
            isPhase1Completed={phase1Completed}
            onCompletePhase1={() => {
              setPhase1Completed(true);
              setCurrentView('guided');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            playerName={playerName}
            onPlayerNameChange={handlePlayerNameChange}
            isTeacherMode={isTeacherMode}
          />
        )}

        {/* PHASE 2: Sequential Guided Operator Tutorial */}
        {currentView === 'guided' && (
          <GuidedTutorial
            onFinishAndPlay={() => {
              setPhase2Completed(true);
              handleSelectPuzzle(PRESET_PUZZLES[0]);
              setCurrentView('game');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToTheory={() => setCurrentView('education')}
          />
        )}

        {/* PHASE 3: Chromebook-Optimized 2-Column Game Dashboard */}
        {currentView === 'game' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <RoundControl
              currentRound={currentRound}
              testsThisRound={roundTests.length}
              totalQueries={totalQueries}
              parQueries={puzzle.parQueries}
              parRounds={puzzle.parRounds}
              onNextRound={handleNextRound}
              onOpenGuessModal={() => setIsGuessModalOpen(true)}
              onOpenTutorial={() => setIsTutorialOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
              isMuted={isMuted}
              onToggleSound={handleToggleSound}
            />

            {/* Side-by-Side Dashboard: Left = Selector + Notepad | Right = Verifiers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* LEFT COLUMN (4 cols): Pas 1 (Tria el Codi) + Pas 3 (Quadern de Pistes) */}
              <div className="lg:col-span-4 space-y-3">
                <ProposalBuilder
                  proposal={proposal}
                  onChange={(newCode) => {
                    if (roundTests.length > 0) return;
                    setProposal(newCode);
                  }}
                  roundPhase={roundPhase}
                  onChangeRoundPhase={setRoundPhase}
                  currentRound={currentRound}
                  testsLeftInRound={testsRemaining}
                  totalRoundTests={roundTests.length}
                  lastTestedVerifier={lastTestedVerifier}
                  onNextRound={handleNextRound}
                />

                <DeductionNotepad
                  puzzle={puzzle}
                  state={deductionSheet}
                  onChange={setDeductionSheet}
                  onReset={() => setDeductionSheet(createEmptyDeductionState())}
                  showAutoHelper={showAutoHelper}
                  onToggleAutoHelper={() => setShowAutoHelper((prev) => !prev)}
                  history={history}
                  currentRound={currentRound}
                  currentProposal={proposal}
                  currentRoundTests={roundTests}
                  onSelectProposal={(code) => {
                    if (roundTests.length === 0) {
                      setProposal(code);
                    } else {
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
                      setProposal(code);
                      setRoundPhase('select');
                    }
                  }}
                  onOpenGuessModal={() => setIsGuessModalOpen(true)}
                />
              </div>

              {/* RIGHT COLUMN (8 cols): Pas 2 (Verificadors de Pistes A..D/F) */}
              <div className="lg:col-span-8 space-y-3" id="verifiers-station">
                <div className="wc-paper-aged rounded-xl border-2 border-[#8c765c] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-typewriter text-[10px] uppercase tracking-wider text-[#2f5941] font-bold block">
                      PAS 2 DE LA RONDA {currentRound} &bull; MÀXIM 3 PROVES PER RONDA
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#261f19]">
                      Verificadors de Pistes ({testsRemaining} proves disponibles en aquesta ronda)
                    </h2>
                  </div>

                  {/* Slot Status Stamps (A..D/F) */}
                  <div className="flex items-center gap-1.5">
                    {puzzle.verifiers.map((v) => {
                      const tested = roundTests.find((t) => t.letter === v.letter);
                      return (
                        <div
                          key={v.letter}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-typewriter text-xs font-bold border ${
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {puzzle.verifiers.map((v) => {
                    const testInRound = roundTests.find((t) => t.letter === v.letter);
                    return (
                      <VerifierCard
                        key={v.letter}
                        verifier={v}
                        proposal={proposal}
                        isTestedThisRound={Boolean(testInRound)}
                        roundTestResult={testInRound ? testInRound.passed : null}
                        testsRemaining={testsRemaining}
                        isRoundReadyForVerify={true}
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Compact Vintage Archival Footer */}
      <footer className="border-t border-[#bda98e] bg-[#e6decb] py-3 text-center text-xs text-[#463a2e]">
        <p className="font-display text-xs sm:text-sm">
          Quadern Històric: <strong>Alan Turing, Bletchley Park (1939–1945)</strong> i el joc de deducció <strong>Turing Machine</strong>.
        </p>
      </footer>

      {/* Modals */}
      <GuessModal
        puzzle={puzzle}
        currentProposal={proposal}
        totalQueries={totalQueries}
        currentRound={currentRound}
        isOpen={isGuessModalOpen}
        onClose={() => setIsGuessModalOpen(false)}
        onSuccess={() => {}}
        onFailPenalty={handleFailPenalty}
        onNextPuzzle={handleNextPuzzle}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <HistoryDrawer
        history={history}
        currentRound={currentRound}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <PuzzleSelectorModal
        currentPuzzleId={puzzle.id}
        isOpen={isPuzzleSelectorOpen}
        onClose={() => setIsPuzzleSelectorOpen(false)}
        onSelectPuzzle={handleSelectPuzzle}
      />
    </div>
  );
}
