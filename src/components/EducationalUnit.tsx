import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  Compass,
  RotateCcw,
  Layers,
  User,
} from 'lucide-react';
import { sound } from '../lib/sound';
import { PUNCH_MATRIX, MATRIX_COLS } from '../lib/punchMatrix';
import confetti from 'canvas-confetti';

interface EducationalUnitProps {
  isPhase1Completed: boolean;
  onCompletePhase1: () => void;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  isTeacherMode: boolean;
}

export const EducationalUnit: React.FC<EducationalUnitProps> = ({
  isPhase1Completed,
  onCompletePhase1,
  playerName,
  onPlayerNameChange,
  isTeacherMode,
}) => {
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>(
    isPhase1Completed || isTeacherMode ? [1, 2, 3, 4, 5] : [1]
  );

  useEffect(() => {
    if (isTeacherMode) {
      setUnlockedChapters([1, 2, 3, 4, 5]);
    }
  }, [isTeacherMode]);

  const [demoLayerStep, setDemoLayerStep] = useState<1 | 2 | 3 | 4>(3);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const chapters = [
    { id: 1, roman: 'I', title: '1939: La Guerra i Enigma' },
    { id: 2, roman: 'II', title: 'Alan Turing i Bletchley Park' },
    { id: 3, roman: 'III', title: 'La Bombe i el Primer Ordinador' },
    { id: 4, roman: 'IV', title: 'Com es Juga i les Targetes' },
    { id: 5, roman: 'V', title: 'Test de Lectura (5 Preguntes)' },
  ];

  const quizQuestions = [
    {
      id: 1,
      chapterRef: 'Capítol I',
      question:
        "Per què l'exèrcit alemany creia que era impossible descobrir els missatges secrets de la màquina Enigma?",
      options: [
        "Perquè s'escrivien amb tinta invisible.",
        'Perquè tenia més de 158 trilions de combinacions possibles i canviaven la clau secreta cada nit a les 00:00 h.',
        "Perquè només enviaven missatges un cop l'any.",
        "Perquè els missatges viatjaven dins d'ampolles al mar.",
      ],
      correct: 1,
      explanation:
        "Les rodes internes d'Enigma i els seus cables generaven més de 158 trilions de combinacions. A més, cada nit a mitjanit (00:00 h) canviaven la clau del dia.",
    },
    {
      id: 2,
      chapterRef: 'Capítol II',
      question:
        "Quina era la missió d'Alan Turing i el seu equip a la «Caseta 8» (Hut 8) de Bletchley Park?",
      options: [
        'Construir avions i vaixells de guerra.',
        'Desxifrar els missatges secrets dels submarins alemanys per evitar que enfonsessin els vaixells que portaven menjar i ajuda.',
        "Dibuixar mapes de les carreteres d'Anglaterra.",
        'Ensenyar matemàtiques a les escoles de Londres.',
      ],
      correct: 1,
      explanation:
        "A la Caseta 8 (Hut 8), l'equip d'Alan Turing desxifrava els missatges dels submarins alemanys a l'oceà Atlàntic per protegir els vaixells aliats.",
    },
    {
      id: 3,
      chapterRef: 'Capítol II',
      question:
        "Quines dues pistes clau va utilitzar Alan Turing per descobrir el codi d'Enigma cada matí?",
      options: [
        'Que cap lletra es podia transformar en ella mateixa i que els alemanys repetien paraules cada matí (com «informe del temps»).',
        'Que un soldat alemany els enviava la contrasenya per correu.',
        'Que la màquina Enigma només funcionava quan plovia.',
        'Que totes les paraules alemanyes començaven per la lletra Z.',
      ],
      correct: 0,
      explanation:
        "Turing va aprofitar una errada d'Enigma (una lletra mai es convertia en ella mateixa) i buscava paraules que els alemanys repetien cada dia a les 6 del matí, com l'informe del temps.",
    },
    {
      id: 4,
      chapterRef: 'Capítol III',
      question:
        'Com funcionava la màquina «Bombe» que va construir Alan Turing?',
      options: [
        'Provava milers de combinacions per segon i descartava totes les que eren impossibles fins que només quedava la correcta.',
        'Era una ràdio gegant per posar música als soldats.',
        'Era una impremta per fer diaris.',
        'Funcionava amb vapor com una locomotora de tren.',
      ],
      correct: 0,
      explanation:
        "La Bombe no endevinava per sort: utilitzava la lògica per descartar a gran velocitat totes les combinacions que donaven error fins a deixar només l'única combinació bona.",
    },
    {
      id: 5,
      chapterRef: 'Capítol IV',
      question:
        'En el nostre joc amb targetes perforades, què passa quan apiles les 3 targetes de la teva proposta (▲ Blau + ■ Groc + ● Morat)?',
      options: [
        "De les 125 posicions, se'n tapen 124 i queda obert exactament 1 únic forat que deixa veure si la pista es compleix (✔ Verd) o no (✖ Vermell).",
        "S'encén una pantalla digital amb el resultat.",
        'Queden tots els 125 forats oberts alhora.',
        'Les targetes es queden enganxades amb un imant.',
      ],
      correct: 0,
      explanation:
        'Cada targeta individual té 25 forats oberts. Quan superposes les 3 targetes (una de cada color), el cartró tapa 124 posicions i només deixa 1 sol forat obert dels 125 possibles.',
    },
  ];

  const handleAdvanceChapter = (nextChap: number) => {
    sound.playPunch();
    if (!unlockedChapters.includes(nextChap)) {
      setUnlockedChapters((prev) => [...prev, nextChap]);
    }
    setCurrentChapter(nextChap);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQuiz = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    sound.playPencilMark();
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const score = Object.entries(quizAnswers).filter(
    ([qId, ans]) => quizQuestions.find((q) => q.id === Number(qId))?.correct === ans
  ).length;

  const allQuestionsAnswered = Object.keys(quizAnswers).length === quizQuestions.length;
  const passedQuiz = score === quizQuestions.length;

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
    if (score === quizQuestions.length) {
      sound.playWin();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#234b7a', '#b87314', '#6d325b', '#2f5941'],
      });
    } else {
      sound.playResult(false);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Compact Integrated Dossier Header + Operator ID Card (Chromebook friendly) */}
      <div className="wc-paper-aged rounded-xl p-4 sm:p-5 border border-[#a89276] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="ww2-stamp text-[10px] font-bold text-[#992d25] bg-[#f2d8d5]/60">
              EXPEDIENT BLETCHLEY PARK 1941
            </span>
            <span className="font-typewriter text-xs text-[#5c4f42]">
              Fase 1 de 3 &bull; Llegeix els 4 capítols i respon el test
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#261f19]">
            Alan Turing i els Missatges Secrets de la Segona Guerra Mundial
          </h1>
        </div>

        {/* Integrated Operator Identification Field */}
        <div className="flex flex-wrap items-center gap-2.5 bg-[#faf6ee] p-2.5 rounded-lg border border-[#8c765c] shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-typewriter font-bold text-[#261f19]">
            <User className="h-4 w-4 text-[#234b7a]" />
            <span>Nom de l&apos;Operador:</span>
          </div>
          <input
            type="text"
            value={playerName}
            onChange={(e) => onPlayerNameChange(e.target.value)}
            placeholder="Escriu el teu nom..."
            className="w-40 sm:w-48 rounded border border-[#a89276] bg-[#efe5d2]/50 px-2.5 py-1 font-typewriter text-xs font-bold text-[#261f19] placeholder:text-[#8c765c] focus:border-[#234b7a] focus:outline-none"
          />
          {isTeacherMode && (
            <span className="px-2 py-0.5 rounded bg-[#fbf5e6] border border-[#b87314] text-[#7a4805] font-typewriter text-[10px] font-bold">
              ★ MODE PROFESSOR
            </span>
          )}
        </div>
      </div>

      {/* Sequential Chapter Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {chapters.map((chap) => {
          const isUnlocked = unlockedChapters.includes(chap.id) || isPhase1Completed;
          const isActive = currentChapter === chap.id;
          const isCompleted =
            chap.id < 5
              ? unlockedChapters.includes(chap.id + 1) || isPhase1Completed
              : isPhase1Completed;

          return (
            <button
              key={chap.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                if (!isUnlocked) return;
                sound.playPencilMark();
                setCurrentChapter(chap.id);
              }}
              className={`flex flex-col justify-between rounded-lg p-2.5 text-left transition-all border ${
                isActive
                  ? 'wc-paper border-2 border-[#234b7a] shadow-sm'
                  : isUnlocked
                  ? 'wc-paper hover:border-[#7b6855] cursor-pointer opacity-90'
                  : 'bg-[#e6decb]/60 border-[#c9bca6] text-[#8c7b68] cursor-not-allowed opacity-65'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-0.5">
                <span className="font-typewriter text-[10px] font-bold uppercase tracking-wider text-[#7b6855]">
                  Capítol {chap.roman}
                </span>
                {!isUnlocked ? (
                  <Lock className="h-3 w-3 text-[#8c7b68]" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2f5941]" />
                ) : (
                  <Unlock className="h-3 w-3 text-[#b87314]" />
                )}
              </div>
              <div className="font-display text-xs sm:text-sm font-bold text-[#261f19] leading-snug">
                {chap.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* CHAPTER 1: WWII & The Enigma Machine */}
      {currentChapter === 1 && (
        <article className="wc-paper rounded-xl p-5 sm:p-7 space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#d5c7b2] pb-3">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#992d25] font-bold">
                Capítol I &bull; El Context Històric (1939–1945)
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-[#261f19] mt-0.5">
                Què passava el 1939 i què era la màquina «Enigma»?
              </h2>
            </div>
            <span className="font-hand text-xl text-[#5c4f42]">
              Oceà Atlàntic, tardor de 1939
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3 text-sm sm:text-base text-[#332920] leading-relaxed">
              <p>
                Entre els anys <strong>1939 i 1945</strong> va tenir lloc la <strong>Segona Guerra Mundial</strong>, on es van enfrontar l&apos;<strong>Alemanya nazi</strong> i els <strong>Aliats</strong> (com el Regne Unit, França i els Estats Units).
              </p>

              <p>
                Com que el <strong>Regne Unit és una illa</strong>, necessitava que centenars de vaixells travessessin l&apos;oceà Atlàntic cada setmana per portar menjar, medicines i combustible. Però l&apos;exèrcit alemany tenia <strong>submarins ocults sota l&apos;aigua</strong> que s&apos;avisaven per ràdio per atacar aquests vaixells.
              </p>

              <p>
                Perquè ningú els entengués per ràdio, els alemanys enviaven els missatges <strong>xifrats (en clau secreta)</strong> amb una màquina anomenada <strong>Enigma</strong>. Semblava una màquina d&apos;escriure, però per dins tenia unes rodes dentades (<em>rotors</em>) i cables que canviaven cada lletra per una altra de manera diferent a cada pulsació!
              </p>

              <div className="wc-wash-ochre rounded-lg p-4 border-l-4 border-[#b87314] space-y-1.5">
                <h3 className="font-display text-lg font-bold text-[#261f19]">
                  Recorda això per al test final: Per què semblava impossible d&apos;endevinar?
                </h3>
                <p className="text-xs sm:text-sm text-[#3d3024]">
                  La màquina Enigma tenia més de <strong>158 trilions de combinacions possibles</strong>. A més, els soldats alemanys <strong>canviaven la clau secreta cada nit a les dotze en punt (00:00 h)</strong>. Els britànics tenien menys de 24 hores per descobrir la clau abans que tornés a canviar!
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="wc-illustration-frame rounded-lg overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/enigma-machine.png`}
                  alt="Il·lustració en aquarel·la de la màquina Enigma"
                  className="w-full h-56 sm:h-64 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="p-2.5 bg-[#efe5d2] border-t border-[#c9bca6]">
                  <div className="font-typewriter text-[11px] font-bold uppercase text-[#5c4f42]">
                    Fig. 1 — La Màquina Enigma per dins
                  </div>
                  <p className="font-hand text-base text-[#463a2e]">
                    Les rodes de metall giraven amb cada lletra per barrejar el missatge.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => handleAdvanceChapter(2)}
              className="flex items-center gap-2 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-5 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <span>Passar al Capítol II</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}

      {/* CHAPTER 2: Alan Turing, Bletchley Park & Hut 8 */}
      {currentChapter === 2 && (
        <article className="wc-paper rounded-xl p-5 sm:p-7 space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#d5c7b2] pb-3">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#234b7a] font-bold">
                Capítol II &bull; L&apos;Equip Secret de Bletchley Park
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-[#261f19] mt-0.5">
                Qui era Alan Turing i què feien a la «Caseta 8»?
              </h2>
            </div>
            <span className="font-hand text-xl text-[#5c4f42]">
              Bletchley Park, Anglaterra, 1940
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <div className="wc-illustration-frame rounded-lg overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/ww2-bletchley.png`}
                  alt="Il·lustració en aquarel·la de Bletchley Park i la Caseta 8"
                  className="w-full h-56 sm:h-64 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="p-2.5 bg-[#efe5d2] border-t border-[#c9bca6]">
                  <div className="font-typewriter text-[11px] font-bold uppercase text-[#5c4f42]">
                    Fig. 2 — Bletchley Park i les Casetes de Fusta
                  </div>
                  <p className="font-hand text-base text-[#463a2e]">
                    Aquí hi treballaven matemàtics, lingüistes i campions d&apos;escacs.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3 text-sm sm:text-base text-[#332920] leading-relaxed">
              <p>
                Per intentar desxifrar Enigma, el Regne Unit va muntar una base secreta al camp anomenada <strong>Bletchley Park</strong>, on van reunir <strong>matemàtics, campions d&apos;escacs i experts en mots encreuats</strong>.
              </p>

              <p>
                El líder més brillant era <strong>Alan Turing (1912–1954)</strong>, un jove matemàtic de 27 anys. Turing dirigia la <strong>Caseta 8 (<em>Hut 8</em>)</strong>, on ell i la matemàtica <strong>Joan Clarke</strong> tenien una missió vital: <strong>desxifrar els missatges dels submarins alemanys per salvar els vaixells que portaven menjar i ajuda</strong>.
              </p>

              <div className="wc-wash-blue rounded-lg p-4 border-l-4 border-[#234b7a] space-y-1.5">
                <h3 className="font-display text-lg font-bold text-[#261f19]">
                  Recorda això per al test final: Les 2 pistes d&apos;Alan Turing
                </h3>
                <ol className="list-decimal list-inside text-xs sm:text-sm text-[#2c3540] space-y-1 font-medium">
                  <li>
                    <strong>L&apos;errada d&apos;Enigma:</strong> <strong>Cap lletra es podia transformar mai en ella mateixa</strong> (una <code>A</code> mai sortia com a <code>A</code>).
                  </li>
                  <li>
                    <strong>Les paraules repetides:</strong> Cada matí a les 6:00 h els alemanys començaven el seu missatge amb les mateixes paraules: l&apos;<strong>informe del temps</strong>.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => setCurrentChapter(1)}
              className="flex items-center gap-2 rounded-lg border border-[#8c765c] bg-[#efe5d2] text-[#261f19] px-4 py-2 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Capítol I</span>
            </button>

            <button
              type="button"
              onClick={() => handleAdvanceChapter(3)}
              className="flex items-center gap-2 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-5 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <span>Passar al Capítol III</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}

      {/* CHAPTER 3: The Bombe & The Birth of the Computer */}
      {currentChapter === 3 && (
        <article className="wc-paper rounded-xl p-5 sm:p-7 space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#d5c7b2] pb-3">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#2f5941] font-bold">
                Capítol III &bull; La Màquina que Descarta l&apos;Impossible
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-[#261f19] mt-0.5">
                La Màquina «Bombe» i el Primer Ordinador
              </h2>
            </div>
            <span className="font-hand text-xl text-[#5c4f42]">
              «Només una màquina pot guanyar una altra màquina»
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3 text-sm sm:text-base text-[#332920] leading-relaxed">
              <p>
                Fer els càlculs a mà era massa lent. Llavors Alan Turing va construir la <strong>Bombe</strong>, una màquina gegant plena de rodes giratòries connectades amb cables elèctrics.
              </p>

              <p>
                Com funcionava? <strong>La Bombe no endevinava el codi per sort: provava milers de combinacions per segon i anava descartant totes les que eren impossibles</strong> (les que donaven error). Quan havia eliminat totes les falses, s&apos;aturava i mostrava l&apos;única combinació correcta!
              </p>

              <div className="wc-wash-olive rounded-lg p-4 border-l-4 border-[#2f5941] space-y-1.5">
                <h3 className="font-display text-lg font-bold text-[#261f19]">
                  Recorda això per al test final: Per què és el pare dels ordinadors?
                </h3>
                <p className="text-xs sm:text-sm text-[#24382c]">
                  Turing va demostrar que <strong>una sola màquina pot resoldre qualsevol problema lògic</strong> si segueix instruccions pas a pas i va descartant les opcions impossibles. Aquest és exactament el principi amb què jugaràs ara!
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="wc-illustration-frame rounded-lg overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/turing-bombe.png`}
                  alt="Il·lustració en aquarel·la de la màquina Bombe d'Alan Turing"
                  className="w-full h-56 sm:h-64 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="p-2.5 bg-[#efe5d2] border-t border-[#c9bca6]">
                  <div className="font-typewriter text-[11px] font-bold uppercase text-[#5c4f42]">
                    Fig. 3 — La Màquina «Bombe» d&apos;Alan Turing
                  </div>
                  <p className="font-hand text-base text-[#463a2e]">
                    Eliminava les combinacions impossibles fins a deixar només la correcta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => setCurrentChapter(2)}
              className="flex items-center gap-2 rounded-lg border border-[#8c765c] bg-[#efe5d2] text-[#261f19] px-4 py-2 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Capítol II</span>
            </button>

            <button
              type="button"
              onClick={() => handleAdvanceChapter(4)}
              className="flex items-center gap-2 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-5 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <span>Passar al Capítol IV (Com es Juga)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}

      {/* CHAPTER 4: Clear Explanation of the Game & Perforated Cards */}
      {currentChapter === 4 && (
        <article className="wc-paper rounded-xl p-5 sm:p-7 space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#d5c7b2] pb-3">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#6d325b] font-bold">
                Capítol IV &bull; Com es Juga i les Targetes amb Forats
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-[#261f19] mt-0.5">
                Com funciona el joc «Turing Machine» en 3 passos?
              </h2>
            </div>
            <span className="font-hand text-xl text-[#5c4f42]">
              Deducció lògica com a Bletchley Park
            </span>
          </div>

          {/* 3 Simple Steps to Play */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="wc-wash-blue rounded-xl p-4 border border-[#234b7a] space-y-2">
              <div className="font-typewriter text-xs font-bold uppercase text-[#1b3b61]">
                PAS 1 &bull; EL CODI SECRET
              </div>
              <h3 className="font-display text-lg font-bold text-[#261f19]">
                3 Figures (de l&apos;1 al 5)
              </h3>
              <p className="text-xs text-[#261f19] leading-relaxed">
                Has d&apos;endevinar un codi secret format per <strong>3 números de l&apos;1 al 5</strong>: un per al <strong>▲ Blau</strong>, un per al <strong>■ Groc</strong> i un per al <strong>● Morat</strong> (en total hi ha 5 × 5 × 5 = <strong>125 combinacions</strong>).
              </p>
            </div>

            <div className="wc-wash-ochre rounded-xl p-4 border border-[#b87314] space-y-2">
              <div className="font-typewriter text-xs font-bold uppercase text-[#784908]">
                PAS 2 &bull; ELS VERIFICADORS
              </div>
              <h3 className="font-display text-lg font-bold text-[#261f19]">
                Prova fins a 3 pistes per ronda
              </h3>
              <p className="text-xs text-[#261f19] leading-relaxed">
                Cada Verificador (A, B, C, D) té diverses regles escrites, però <strong>només UNA és la regla secreta</strong>. Quan hi proves el teu codi:
                <br />
                &bull; <strong>✔ SÍ (Verd):</strong> El teu codi compleix la regla secreta!
                <br />
                &bull; <strong>✖ NO (Vermell):</strong> El teu codi NO la compleix!
              </p>
            </div>

            <div className="wc-wash-olive rounded-xl p-4 border border-[#2f5941] space-y-2">
              <div className="font-typewriter text-xs font-bold uppercase text-[#1e402f]">
                PAS 3 &bull; EL TEU QUADERN
              </div>
              <h3 className="font-display text-lg font-bold text-[#261f19]">
                Ratlla els números impossibles
              </h3>
              <p className="text-xs text-[#261f19] leading-relaxed">
                Com feia la màquina <em>Bombe</em> d&apos;Alan Turing, ves ratllant al teu quadern els números que siguin impossibles fins que només quedi l&apos;únic codi correcte!
              </p>
            </div>
          </div>

          {/* Interactive 3-Card Superposition Demo (For Quiz Question 5) */}
          <div className="wc-paper-aged rounded-xl border-2 border-[#6d325b] p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bfa98c] pb-2.5">
              <div>
                <span className="ww2-stamp text-[10px] font-bold text-[#6d325b] bg-[#ead6e3]">
                  RECORDA AIXÒ PER AL TEST FINAL &bull; LES TARGETES AMB FORATS
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#261f19] mt-1">
                  Per què en apilar les 3 targetes només queda 1 sol forat obert?
                </h3>
                <p className="text-xs text-[#463a2e]">
                  Cada targeta sola té <strong>25 forats oberts</strong>. Però quan poses les <strong>3 targetes l&apos;una sobre l&apos;altra (▲ + ■ + ●)</strong>, el cartró tapa 124 posicions i <strong>només deixa 1 ÚNIC FORAT OBERT</strong> per on es veu ✔ Verd o ✖ Vermell!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  s: 1 as const,
                  title: '1. Targeta ▲2',
                  sub: '25 forats oberts',
                  cls: 'wc-wash-blue border-[#234b7a] text-[#1b3b61]',
                },
                {
                  s: 2 as const,
                  title: '2. + Targeta ■4',
                  sub: 'Queden 5 forats',
                  cls: 'wc-wash-ochre border-[#b87314] text-[#784908]',
                },
                {
                  s: 3 as const,
                  title: '3. + Targeta ●1',
                  sub: 'Queda 1 SOL forat!',
                  cls: 'wc-wash-plum border-[#6d325b] text-[#4f2140]',
                },
                {
                  s: 4 as const,
                  title: '4. Mirar pel forat',
                  sub: 'Es veu ✔ VERD!',
                  cls: 'wc-wash-olive border-[#2f5941] text-[#1e402f]',
                },
              ].map((btn) => (
                <button
                  key={btn.s}
                  type="button"
                  onClick={() => {
                    sound.playPunch();
                    setDemoLayerStep(btn.s);
                  }}
                  className={`p-2 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    demoLayerStep === btn.s
                      ? `${btn.cls} shadow-xs ring-2 ring-[#261f19]/20`
                      : 'bg-[#efe5d2]/70 border-[#c9bca6] text-[#5c4f42] hover:bg-[#efe5d2]'
                  }`}
                >
                  <div className="font-typewriter text-xs font-bold">{btn.title}</div>
                  <div className="text-[11px] opacity-85">{btn.sub}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-6">
                <div className="rounded-lg border border-[#8c765c] bg-[#faf5e8] p-2.5 shadow-xs">
                  <div
                    className="grid gap-[2px] bg-[#e6decb] p-1.5 rounded border border-[#cbbba2]"
                    style={{
                      gridTemplateColumns: `repeat(${MATRIX_COLS}, minmax(0, 1fr))`,
                    }}
                  >
                    {PUNCH_MATRIX.map((cell) => {
                      if (!cell.code) {
                        return (
                          <div
                            key={cell.index}
                            className="aspect-square rounded-full bg-[#332920] scale-75"
                          />
                        );
                      }

                      const bOpen = cell.code.blue === 2;
                      const yOpen = cell.code.yellow === 4;
                      const pOpen = cell.code.purple === 1;

                      const isOpenAtCurrentStep =
                        demoLayerStep === 1
                          ? bOpen
                          : demoLayerStep === 2
                          ? bOpen && yOpen
                          : bOpen && yOpen && pOpen;

                      if (isOpenAtCurrentStep) {
                        if (demoLayerStep === 4) {
                          return (
                            <div
                              key={cell.index}
                              className="aspect-square rounded-full bg-[#2f5941] ring-2 ring-[#261f19] scale-150 z-20 flex items-center justify-center text-[8px] font-bold text-[#faf6ee]"
                            >
                              ✔
                            </div>
                          );
                        }
                        return (
                          <div
                            key={cell.index}
                            className={`aspect-square rounded-full ${
                              demoLayerStep === 3
                                ? 'bg-[#234b7a] ring-2 ring-[#261f19] scale-150 z-20'
                                : 'bg-[#261f19]'
                            }`}
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
              </div>

              <div className="md:col-span-6 space-y-2 text-xs sm:text-sm text-[#332920]">
                <div className="wc-paper rounded-lg p-3.5 border border-[#a89276] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-typewriter text-xs font-bold text-[#6d325b]">
                    <Layers className="h-4 w-4" />
                    <span>Resum clau per a la pregunta 5 del Test:</span>
                  </div>
                  <p className="leading-relaxed">
                    Quan superposes les <strong>3 targetes (▲ Blau + ■ Groc + ● Morat)</strong>, de les 125 posicions se&apos;n tapen 124 i <strong>queda obert exactament 1 únic forat</strong> per on veus si la regla es compleix (<strong>✔ Verd</strong>) o no (<strong>✖ Vermell</strong>).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => setCurrentChapter(3)}
              className="flex items-center gap-2 rounded-lg border border-[#8c765c] bg-[#efe5d2] text-[#261f19] px-4 py-2 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Capítol III</span>
            </button>

            <button
              type="button"
              onClick={() => handleAdvanceChapter(5)}
              className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-5 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <span>Anar al Test Final (5 preguntes)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}

      {/* CHAPTER 5: Mandatory Reading Comprehension Quiz to Unlock Phase 2 */}
      {currentChapter === 5 && (
        <section className="wc-paper rounded-xl p-5 sm:p-7 space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#d5c7b2] pb-3">
            <div>
              <span className="ww2-stamp text-[10px] font-bold text-[#234b7a]">
                PROVA D&apos;ACCÉS A LA CASETA 8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#261f19] mt-1">
                Qüestionari sobre la Història i el Joc
              </h2>
              <p className="text-xs sm:text-sm text-[#5c4f42]">
                Respon les <strong>5 preguntes</strong> per obrir la <strong>Fase 2: Com Jugar (Exemple Guiat)</strong>.
              </p>
            </div>

            {quizSubmitted && (
              <div
                className={`rounded-lg px-3.5 py-2 border-2 font-typewriter text-xs font-bold ${
                  passedQuiz
                    ? 'wc-wash-olive text-[#1e402f] border-[#2f5941]'
                    : 'wc-wash-crimson text-[#781f19] border-[#992d25]'
                }`}
              >
                Resultat: {score} / {quizQuestions.length} encerts
              </div>
            )}
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, idx) => {
              const selected = quizAnswers[q.id];
              const isCorrect = selected === q.correct;
              return (
                <div
                  key={q.id}
                  className="wc-paper-aged rounded-lg p-4 space-y-2.5 border border-[#bda98e]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-[#261f19] text-[#faf6ee] font-typewriter text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-bold text-[#261f19] leading-snug">
                        {q.question}
                      </h3>
                    </div>
                    <span className="shrink-0 font-typewriter text-[10px] uppercase px-2 py-0.5 rounded bg-[#e2d6c1] text-[#5c4f42] border border-[#c4b49b]">
                      {q.chapterRef}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuiz(q.id, optIdx)}
                          className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs text-left transition-all ${
                            quizSubmitted
                              ? optIdx === q.correct
                                ? 'wc-wash-olive border-2 border-[#2f5941] text-[#1e402f] font-bold'
                                : isOptionSelected
                                ? 'wc-wash-crimson border-2 border-[#992d25] text-[#781f19] line-through'
                                : 'bg-[#f5efe4]/60 border-[#d5c7b2] opacity-55 text-[#5c4f42]'
                              : isOptionSelected
                              ? 'wc-wash-blue border-2 border-[#234b7a] text-[#1b3b61] font-bold shadow-2xs'
                              : 'bg-[#faf6ee] border-[#c9bca6] hover:border-[#7b6855] text-[#332920] cursor-pointer'
                          }`}
                        >
                          <span className="font-typewriter text-xs font-bold text-[#7b6855] shrink-0">
                            {['A', 'B', 'C', 'D'][optIdx]}.
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`flex items-start gap-2 rounded-lg p-2.5 text-xs border ${
                        isCorrect
                          ? 'wc-wash-olive text-[#1e402f] border-[#6e9980]'
                          : 'wc-wash-crimson text-[#781f19] border-[#bd6e68]'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-[#2f5941] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#992d25] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong>{isCorrect ? 'Correcte!' : 'Resposta incorrecta.'}</strong>{' '}
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => setCurrentChapter(4)}
              className="flex items-center gap-2 rounded-lg border border-[#8c765c] bg-[#efe5d2] text-[#261f19] px-4 py-2 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Repassar Capítols</span>
            </button>

            {!quizSubmitted ? (
              <button
                type="button"
                disabled={!allQuestionsAnswered}
                onClick={handleGradeQuiz}
                className={`rounded-lg px-5 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider transition-all ${
                  allQuestionsAnswered
                    ? 'bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] shadow-sm cursor-pointer'
                    : 'bg-[#d8cbb8] text-[#8c7b68] cursor-not-allowed border border-[#c4b49b]'
                }`}
              >
                Comprovar Respostes ({Object.keys(quizAnswers).length}/{quizQuestions.length})
              </button>
            ) : passedQuiz ? (
              <button
                type="button"
                onClick={() => {
                  sound.playPunch();
                  onCompletePhase1();
                }}
                className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-6 py-3 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer animate-bounce"
              >
                <Compass className="h-4 w-4" />
                <span>Molt bé (5/5)! Obrir Fase 2: Exemple de Joc</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-typewriter font-bold text-[#992d25]">
                  Cal encertar les 5 preguntes per avançar.
                </span>
                <button
                  type="button"
                  onClick={() => setQuizSubmitted(false)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#992d25] hover:bg-[#781f19] text-[#faf6ee] px-4 py-2 font-typewriter text-xs font-bold uppercase cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Tornar a intentar</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
