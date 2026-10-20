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

  // Interactive visual layer demo state for Chapter IV (1 = 1 card, 2 = 2 cards, 3 = 3 cards, 4 = on Verificador)
  const [demoLayerStep, setDemoLayerStep] = useState<1 | 2 | 3 | 4>(3);

  // Quiz interactive state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const chapters = [
    { id: 1, roman: 'I', title: '1939: La Guerra i Enigma' },
    { id: 2, roman: 'II', title: 'Alan Turing i Bletchley Park' },
    { id: 3, roman: 'III', title: 'La Bombe i el Primer Ordinador' },
    { id: 4, roman: 'IV', title: 'Targetes amb Forats i el Joc' },
    { id: 5, roman: 'V', title: 'Test de Lectura Obligatori' },
  ];

  const quizQuestions = [
    {
      id: 1,
      chapterRef: 'Capítol I',
      question:
        "Per què l'exèrcit alemany creia que era impossible descobrir els missatges secrets de la màquina Enigma?",
      options: [
        "Perquè s'escrivien amb tinta invisible.",
        "Perquè tenia més de 158 trilions de combinacions possibles i canviaven la clau secreta cada nit a les 00:00 h.",
        "Perquè només enviaven missatges un cop l'any.",
        "Perquè els missatges viatjaven dins d'ampolles al mar.",
      ],
      correct: 1,
      explanation:
        "Les rodes internes d'Enigma i els seus cables generaven més de 158 trilions de combinacions. A més, cada nit a mitjanit (00:00 h) canviaven la clau del dia, de manera que només hi havia 24 hores per descobrir-la.",
    },
    {
      id: 2,
      chapterRef: 'Capítol II',
      question:
        "Quina era la missió d'Alan Turing i el seu equip a la «Caseta 8» (Hut 8) de Bletchley Park?",
      options: [
        "Construir avions i vaixells de guerra.",
        "Desxifrar els missatges secrets dels submarins alemanys per evitar que enfonsessin els vaixells que portaven menjar i ajuda.",
        "Dibuixar mapes de les carreteres d'Anglaterra.",
        "Ensenyar matemàtiques a les escoles de Londres.",
      ],
      correct: 1,
      explanation:
        "A la Caseta 8 (Hut 8), l'equip d'Alan Turing s'encarregava de desxifrar els missatges dels submarins alemanys a l'oceà Atlàntic per protegir els vaixells aliats.",
    },
    {
      id: 3,
      chapterRef: 'Capítol II',
      question:
        "Quines dues pistes clau va utilitzar Alan Turing per descobrir el codi d'Enigma cada matí?",
      options: [
        "Que cap lletra es podia transformar en ella mateixa i que els alemanys repetien paraules cada matí (com «informe del temps»).",
        "Que un soldat alemany els enviava la contrasenya per correu.",
        "Que la màquina Enigma només funcionava quan plovia.",
        "Que totes les paraules alemanyes començaven per la lletra Z.",
      ],
      correct: 0,
      explanation:
        "Turing va aprofitar una errada d'Enigma (una lletra mai es convertia en ella mateixa, és a dir, una 'A' mai sortia com a 'A') i buscava paraules que els alemanys repetien cada dia a les 6 del matí, com l'informe del temps.",
    },
    {
      id: 4,
      chapterRef: 'Capítol III',
      question:
        "Com funcionava la màquina «Bombe» que va construir Alan Turing?",
      options: [
        "Provava milers de combinacions per segon i descartava totes les que eren impossibles fins que només quedava la correcta.",
        "Era una ràdio gegant per posar música als soldats.",
        "Era una impremta per fer diaris.",
        "Funcionava amb vapor com una locomotora de tren.",
      ],
      correct: 0,
      explanation:
        "La Bombe no endevinava per sort: utilitzava la lògica per descartar a gran velocitat totes les combinacions que donaven error fins a deixar només l'única combinació bona.",
    },
    {
      id: 5,
      chapterRef: 'Capítol IV',
      question:
        "En el nostre joc amb targetes perforades, què passa quan apiles les 3 targetes de la teva proposta (▲ Blau + ■ Groc + ● Morat)?",
      options: [
        "De les 125 posicions, se'n tapen 124 i queda obert exactament 1 únic forat que deixa veure si la regla es compleix (✔ Verd) o no (✖ Vermell).",
        "S'encén una pantalla digital amb el resultat.",
        "Queden tots els 125 forats oberts alhora.",
        "Les targetes es queden enganxades amb un imant.",
      ],
      correct: 0,
      explanation:
        "Cada targeta individual té 25 forats oberts. Quan superposes les 3 targetes (una de cada color), el cartró tapa 124 posicions i només deixa 1 sol forat obert dels 125 possibles.",
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
    <div className="space-y-8">
      {/* Archival WWII Watercolor Dossier Header */}
      <div className="wc-paper-aged relative overflow-hidden rounded-xl p-6 sm:p-10">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, #234b7a 0%, transparent 70%)',
            filter: 'url(#watercolor-bleed)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-72 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #b87314 0%, transparent 70%)',
            filter: 'url(#watercolor-bleed)',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="ww2-stamp text-xs font-bold text-[#992d25] bg-[#f2d8d5]/60">
                EXPEDIENT CONFIDENCIAL &bull; BLETCHLEY PARK 1941
              </span>
              <span className="font-typewriter text-xs text-[#5c4f42] uppercase tracking-widest">
                Fase 1 de 3 &bull; Història i Lectura
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#261f19] leading-tight">
              Alan Turing i els Missatges Secrets de la Segona Guerra Mundial
            </h1>

            <p className="text-base sm:text-lg text-[#463a2e] leading-relaxed italic">
              «Abans que existissin els mòbils i els ordinadors, un grup de joves matemàtics va construir una màquina capaç de desxifrar el codi més secret del món i aturar una guerra.»
            </p>
          </div>

          {/* Reading Progress Stamp Card */}
          <div className="wc-paper shrink-0 rounded-lg p-4 border border-[#a89276] lg:w-64 space-y-2">
            <div className="flex items-center justify-between font-typewriter text-xs text-[#5c4f42] border-b border-[#d8cbb8] pb-1.5">
              <span>PROGRÉS DE LECTURA</span>
              <span className="font-bold text-[#261f19]">
                {Math.min(unlockedChapters.length, 4)}/4 Capítols
              </span>
            </div>
            <div className="text-xs text-[#463a2e] leading-snug">
              Llegeix els <strong>4 capítols curts</strong> en ordre i respon les <strong>5 preguntes finals</strong> per desbloquejar el Tutorial del Joc.
            </div>
            {isTeacherMode && (
              <div className="flex items-center gap-1.5 text-xs font-typewriter font-bold text-[#7a4805] bg-[#fbf5e6] px-2.5 py-1 rounded border border-[#b87314]">
                <span>★ MODE PROFESSOR ACTIVAT</span>
              </div>
            )}
            {isPhase1Completed && !isTeacherMode && (
              <div className="flex items-center gap-1.5 text-xs font-typewriter font-bold text-[#2f5941] bg-[#d8e8de] px-2.5 py-1 rounded border border-[#6e9980]">
                <CheckCircle2 className="h-4 w-4" />
                <span>FASE 1 COMPLETADA</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fitxa d'Identificació de l'Agent a l'inici del joc */}
      <div className="wc-paper rounded-xl p-4 sm:p-5 border border-[#a89276] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-[#8c765c] bg-[#e8dcce] flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-[#234b7a]" />
          </div>
          <div>
            <div className="font-typewriter text-xs font-bold text-[#261f19] tracking-wider uppercase flex items-center gap-2">
              <span>Fitxa de l'Operador</span>
              <span className="text-[10px] text-[#7a6b5c] font-normal">&bull; Bletchley Park 1941</span>
            </div>
            <p className="text-xs text-[#5c4f42]">
              Escriu el teu nom per signar els informes de desxiframent i iniciar la missió.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              placeholder="Escriu el teu nom..."
              className="w-full rounded-md border border-[#8c765c] bg-[#faf6ee] px-3 py-1.5 font-typewriter text-sm font-semibold text-[#261f19] placeholder:text-[#a89276] focus:border-[#234b7a] focus:ring-1 focus:ring-[#234b7a] focus:outline-none transition-all"
            />
          </div>
          {isTeacherMode && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#fbf5e6] border border-[#b87314] text-[#7a4805] font-typewriter text-xs font-bold shadow-2xs">
              <span className="text-[#b87314]">★</span>
              <span>MODE PROFESSOR (TOTS ELS ACCESOS OBERTS)</span>
            </div>
          )}
        </div>
      </div>

      {/* Sequential Chapter Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
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
              className={`flex flex-col justify-between rounded-lg p-3 text-left transition-all border ${
                isActive
                  ? 'wc-paper border-2 border-[#234b7a] shadow-md -translate-y-0.5'
                  : isUnlocked
                  ? 'wc-paper hover:border-[#7b6855] cursor-pointer opacity-90'
                  : 'bg-[#e6decb]/60 border-[#c9bca6] text-[#8c7b68] cursor-not-allowed opacity-65'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-typewriter text-[11px] font-bold uppercase tracking-wider text-[#7b6855]">
                  Capítol {chap.roman}
                </span>
                {!isUnlocked ? (
                  <Lock className="h-3.5 w-3.5 text-[#8c7b68]" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-[#2f5941]" />
                ) : (
                  <Unlock className="h-3.5 w-3.5 text-[#b87314]" />
                )}
              </div>
              <div className="font-display text-sm sm:text-base font-bold text-[#261f19] leading-snug">
                {chap.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* CHAPTER 1: WWII & The Enigma Machine */}
      {currentChapter === 1 && (
        <article className="wc-paper rounded-xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#d5c7b2] pb-4">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#992d25] font-bold">
                Capítol I &bull; El Context Històric (1939–1945)
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#261f19] mt-1">
                Què passava el 1939 i què era la màquina «Enigma»?
              </h2>
            </div>
            <span className="font-hand text-2xl text-[#5c4f42]">
              Oceà Atlàntic, tardor de 1939
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4 text-base text-[#332920] leading-relaxed">
              <p>
                Entre els anys <strong>1939 i 1945</strong> va tenir lloc la <strong>Segona Guerra Mundial</strong>, un gran conflicte on es van enfrontar dos bàndols: d'una banda, l'<strong>Alemanya nazi</strong> (una dictadura dirigida per Adolf Hitler que estava envaint gran part d'Europa) i, de l'altra, els <strong>Aliats</strong> (països com el Regne Unit, França i, més endavant, els Estats Units).
              </p>

              <p>
                Com que el <strong>Regne Unit és una illa</strong>, necessitava que centenars de vaixells travessessin l'oceà Atlàntic cada setmana per portar menjar, medicines i combustible a la població. Però l'exèrcit alemany tenia <strong>submarins ocults sota l'aigua</strong> que s'avisaven per ràdio per atacar aquests vaixells.
              </p>

              <p>
                Com que qualsevol persona amb una antena de ràdio podia escoltar aquells missatges, els alemanys els enviaven <strong>xifrats (en clau secreta)</strong>. Què vol dir xifrar? Imagina que vols passar una nota secreta a classe: si escrius <code>«HOLA»</code>, tothom la pot llegir; però si canvies cada lletra per una altra i escrius <code>«X K M Q»</code>, ningú entendrà res si no té la clau per traduir-ho!
              </p>

              <p>
                Per fer això automàticament, els alemanys utilitzaven una màquina anomenada <strong>Enigma</strong>. Semblava una màquina d'escriure, però per dins tenia unes rodes dentades (anomenades <em>rotors</em>) i uns cables al davant. Cada vegada que premies una tecla, les rodes giraven i canviaven l'abecedari secret: si premies la lletra «A» tres vegades seguides, s'encenien tres lletres diferents!
              </p>

              <div className="wc-wash-ochre rounded-lg p-5 border-l-4 border-[#b87314] space-y-2">
                <h3 className="font-display text-xl font-bold text-[#261f19]">
                  Recorda això per al test final: Per què semblava impossible d'endevinar?
                </h3>
                <p className="text-sm text-[#3d3024]">
                  La màquina Enigma tenia més de <strong>158 trilions de combinacions possibles</strong>. A més, els soldats alemanys tenien un llibret amb contrasenyes i <strong>canviaven la clau secreta cada nit a les dotze en punt (00:00 h de la mitjanit)</strong>. Això volia dir que els britànics tenien menys de 24 hores per descobrir la clau abans que tornés a canviar!
                </p>
              </div>
            </div>

            {/* Watercolor Illustration of the Enigma Machine */}
            <div className="lg:col-span-5 space-y-3">
              <div className="wc-illustration-frame rounded-lg overflow-hidden">
                <img
                  src="/images/enigma-machine.png"
                  alt="Il·lustració en aquarel·la de la màquina Enigma"
                  className="w-full h-64 sm:h-72 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="p-3 bg-[#efe5d2] border-t border-[#c9bca6]">
                  <div className="font-typewriter text-[11px] font-bold uppercase text-[#5c4f42]">
                    Fig. 1 — La Màquina Enigma per dins
                  </div>
                  <p className="font-hand text-lg text-[#463a2e] mt-0.5">
                    Les rodes de metall giraven amb cada lletra per barrejar el missatge de milions de maneres.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => handleAdvanceChapter(2)}
              className="flex items-center gap-2 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-6 py-3 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span>He llegit el Capítol I &bull; Passar al Capítol II</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}

      {/* CHAPTER 2: Alan Turing, Bletchley Park & Hut 8 */}
      {currentChapter === 2 && (
        <article className="wc-paper rounded-xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#d5c7b2] pb-4">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#234b7a] font-bold">
                Capítol II &bull; L'Equip Secret de Bletchley Park
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#261f19] mt-1">
                Qui era Alan Turing i què feien a la «Caseta 8»?
              </h2>
            </div>
            <span className="font-hand text-2xl text-[#5c4f42]">
              Bletchley Park, Anglaterra, 1940
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Watercolor Illustration of Bletchley Park */}
            <div className="lg:col-span-5 space-y-3">
              <div className="wc-illustration-frame rounded-lg overflow-hidden">
                <img
                  src="/images/ww2-bletchley.png"
                  alt="Il·lustració en aquarel·la de Bletchley Park i la Caseta 8"
                  className="w-full h-64 sm:h-72 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="p-3 bg-[#efe5d2] border-t border-[#c9bca6]">
                  <div className="font-typewriter text-[11px] font-bold uppercase text-[#5c4f42]">
                    Fig. 2 — Bletchley Park i les Casetes de Fusta
                  </div>
                  <p className="font-hand text-lg text-[#463a2e] mt-0.5">
                    En lloc de soldats amb armes, aquí hi treballaven matemàtics, lingüistes i campions d'escacs.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-base text-[#332920] leading-relaxed">
              <p>
                Per intentar desxifrar Enigma, el govern britànic va muntar una base secreta al camp anomenada <strong>Bletchley Park</strong>. Però en comptes de portar-hi militars, van buscar persones amb una gran capacitat per resoldre enigmes: <strong>matemàtics, campions d'escacs i fins i tot campions de mots encreuats!</strong>
              </p>

              <p>
                El líder més brillant d'aquell grup era <strong>Alan Turing (1912–1954)</strong>, un jove matemàtic de només 27 anys a qui li encantaven els trencaclosques lògics. A Turing li van encarregar dirigir la <strong>Caseta 8 (anomenada <em>Hut 8</em> en anglès)</strong>, una barraca de fusta on ell i la matemàtica <strong>Joan Clarke</strong> tenien una missió vital: <strong>desxifrar els missatges dels submarins alemanys per salvar els vaixells que portaven menjar i ajuda</strong>.
              </p>

              <div className="wc-wash-blue rounded-lg p-5 border-l-4 border-[#234b7a] space-y-2">
                <h3 className="font-display text-xl font-bold text-[#261f19]">
                  Recorda això per al test final: Les 2 pistes d'Alan Turing
                </h3>
                <p className="text-sm text-[#2c3540]">
                  Com s'ho va fer Turing per vèncer Enigma? Va combinar dues pistes genials:
                </p>
                <ol className="list-decimal list-inside text-sm text-[#2c3540] space-y-1.5 font-medium">
                  <li>
                    <strong>L'errada d'Enigma:</strong> La màquina tenia un defecte: <strong>cap lletra es podia transformar mai en ella mateixa</strong> (una <code>A</code> podia convertir-se en qualsevol lletra menys en una <code>A</code>).
                  </li>
                  <li>
                    <strong>Les paraules repetides:</strong> Els soldats alemanys eren tan metòdics que cada matí a les 6:00 h començaven el seu missatge amb les mateixes paraules: l'<strong>informe del temps</strong>. Com que Turing ja sabia quina paraula s'amagava al principi del missatge, podia deduir quines combinacions eren falses!
                  </li>
                </ol>
              </div>

              <p className="text-sm text-[#5c4f42]">
                Gràcies a la feina d'Alan Turing i l'equip de Bletchley Park, els historiadors calculen que la guerra va acabar entre <strong>2 i 4 anys abans</strong> i es van salvar més de <strong>14 milions de vides</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => setCurrentChapter(1)}
              className="flex items-center gap-2 rounded-lg border border-[#8c765c] bg-[#efe5d2] hover:bg-[#e5d8c0] text-[#261f19] px-4 py-2.5 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Capítol I</span>
            </button>

            <button
              type="button"
              onClick={() => handleAdvanceChapter(3)}
              className="flex items-center gap-2 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-6 py-3 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span>He llegit el Capítol II &bull; Passar al Capítol III</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}

      {/* CHAPTER 3: The Bombe & The Birth of the Computer */}
      {currentChapter === 3 && (
        <article className="wc-paper rounded-xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#d5c7b2] pb-4">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#2f5941] font-bold">
                Capítol III &bull; La Màquina que Descarta l'Impossible
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#261f19] mt-1">
                La Màquina «Bombe» i per què Turing és el Pare dels Ordinadors
              </h2>
            </div>
            <span className="font-hand text-2xl text-[#5c4f42]">
              «Només una màquina pot guanyar una altra màquina»
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4 text-base text-[#332920] leading-relaxed">
              <p>
                Tot i tenir bones pistes, fer els càlculs a mà amb paper i llapis era massa lent: quan volien acabar, ja era mitjanit i els alemanys tornaven a canviar el codi. Llavors Alan Turing va tenir una idea revolucionària: <strong>si els alemanys fan servir una màquina per xifrar, nosaltres construirem una màquina encara més ràpida per desxifrar!</strong>
              </p>

              <p>
                Així va néixer la <strong>Bombe</strong>, un armari gegant ple de rodes giratòries connectades amb cables elèctrics. Com funcionava? <strong>La Bombe no endevinava el codi per sort: provava milers de combinacions per segon i anava descartant totes les que eren impossibles</strong> (les que donaven error). Quan havia eliminat totes les combinacions falses, les rodes s'aturaven de cop i mostraven l'única combinació correcta!
              </p>

              <div className="wc-wash-olive rounded-lg p-5 border-l-4 border-[#2f5941] space-y-3">
                <h3 className="font-display text-xl font-bold text-[#261f19]">
                  Recorda això per al test final: Com va inventar el concepte d'ordinador?
                </h3>
                <p className="text-sm text-[#24382c]">
                  Fins a l'època de Turing, cada màquina només servia per a una sola cosa (una calculadora només sumava, una ràdio només sonava). L'any <strong>1936</strong>, Turing va dissenyar sobre el paper la <strong>Màquina de Turing</strong>: va demostrar que <strong>una sola màquina pot fer qualsevol tasca</strong> si li dones una llista d'instruccions pas a pas (el que avui anomenem un <strong>programa o aplicació</strong>!).
                </p>
                <p className="text-xs text-[#24382c]">
                  Aquest és exactament el principi amb què funcionen avui el teu ordinador, la teva consola i el teu telèfon mòbil.
                </p>
              </div>
            </div>

            {/* Watercolor Illustration of Turing's Bombe */}
            <div className="lg:col-span-5 space-y-3">
              <div className="wc-illustration-frame rounded-lg overflow-hidden">
                <img
                  src="/images/turing-bombe.png"
                  alt="Il·lustració en aquarel·la de la màquina Bombe d'Alan Turing"
                  className="w-full h-64 sm:h-72 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="p-3 bg-[#efe5d2] border-t border-[#c9bca6]">
                  <div className="font-typewriter text-[11px] font-bold uppercase text-[#5c4f42]">
                    Fig. 3 — La Màquina «Bombe» d'Alan Turing
                  </div>
                  <p className="font-hand text-lg text-[#463a2e] mt-0.5">
                    Les seves rodes giraven a tota velocitat eliminant les combinacions impossibles fins a trobar el codi secret.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => setCurrentChapter(2)}
              className="flex items-center gap-2 rounded-lg border border-[#8c765c] bg-[#efe5d2] hover:bg-[#e5d8c0] text-[#261f19] px-4 py-2.5 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Capítol II</span>
            </button>

            <button
              type="button"
              onClick={() => handleAdvanceChapter(4)}
              className="flex items-center gap-2 rounded-lg bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] px-6 py-3 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span>He llegit el Capítol III &bull; Passar al Capítol IV</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}

      {/* CHAPTER 4: Perforated Punch Cards & Visual Interactive Breakdown */}
      {currentChapter === 4 && (
        <article className="wc-paper rounded-xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#d5c7b2] pb-4">
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#6d325b] font-bold">
                Capítol IV &bull; Les Targetes amb Forats
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#261f19] mt-1">
                Com es feia anar un ordinador abans que existissin les pantalles?
              </h2>
            </div>
            <span className="font-hand text-2xl text-[#5c4f42]">
              Llum a través del cartró
            </span>
          </div>

          {/* Top Narrative + Watercolor Illustration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="wc-illustration-frame rounded-lg overflow-hidden">
                <img
                  src="/images/punch-cards-1940.png"
                  alt="Il·lustració en aquarel·la de targetes perforades dels anys 1940"
                  className="w-full h-60 sm:h-64 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="p-3 bg-[#efe5d2] border-t border-[#c9bca6]">
                  <div className="font-typewriter text-[11px] font-bold uppercase text-[#5c4f42]">
                    Fig. 4 — Targetes Perforades de Cartolina
                  </div>
                  <p className="font-hand text-lg text-[#463a2e] mt-0.5">
                    A Bletchley Park utilitzaven milions d'aquestes cartolines amb forats per buscar pistes molt ràpid.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-base text-[#332920] leading-relaxed">
              <p>
                Als anys 1940 no hi havia pantalles ni teclats moderns. Per guardar informació i fer càlculs ràpids es feien servir <strong>targetes perforades</strong>: unes cartolines plenes de petits forats.
              </p>
              <p>
                El truc és molt senzill: <strong>allà on hi ha un forat, la llum pot passar; allà on hi ha cartró, queda tapat</strong>. El joc de taula al qual jugaràs tot seguit funciona exactament així, fent servir el mateix enginy que a Bletchley Park per descartar pistes impossibles!
              </p>
            </div>
          </div>

          {/* VISUAL BREAKDOWN */}
          <div className="wc-paper-aged rounded-xl border-2 border-[#6d325b] p-5 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bfa98c] pb-3">
              <div>
                <span className="ww2-stamp text-[10px] font-bold text-[#6d325b] bg-[#ead6e3] mb-1">
                  RECORDA AIXÒ PER AL TEST &bull; ESQUEMA VISUAL
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#261f19]">
                  Com funciona el nostre joc físic «Turing Machine»?
                </h3>
              </div>
              <span className="font-hand text-xl text-[#4f2140]">
                4 passos molt fàcils d'entendre
              </span>
            </div>

            {/* 4 Visual Infographic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Point 1: 5 x 5 x 5 = 125 codes */}
              <div className="wc-paper rounded-xl p-4 border border-[#bda98e] flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6d325b] text-[#faf6ee] font-typewriter text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#261f19]">
                      Un Codi de 3 Figures (125 combinacions)
                    </h4>
                    <p className="text-xs text-[#463a2e] mt-0.5 leading-relaxed">
                      El codi secret que has d'endevinar té <strong>3 números</strong> (un per a cada figura), i cadascun només pot ser <strong>1, 2, 3, 4 o 5</strong>:
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-[#efe5d2] border border-[#cbbba2] p-3 flex flex-wrap items-center justify-center gap-2 font-typewriter text-xs">
                  <div className="flex flex-col items-center bg-[#234b7a] text-[#faf6ee] px-2.5 py-1.5 rounded border border-[#153152]">
                    <span className="text-sm font-bold">▲ Blau</span>
                    <span className="text-[10px] opacity-90">5 opcions (1–5)</span>
                  </div>
                  <span className="font-bold text-base text-[#5c4f42]">×</span>
                  <div className="flex flex-col items-center bg-[#c8831b] text-[#faf6ee] px-2.5 py-1.5 rounded border border-[#805008]">
                    <span className="text-sm font-bold">■ Groc</span>
                    <span className="text-[10px] opacity-90">5 opcions (1–5)</span>
                  </div>
                  <span className="font-bold text-base text-[#5c4f42]">×</span>
                  <div className="flex flex-col items-center bg-[#6d325b] text-[#faf6ee] px-2.5 py-1.5 rounded border border-[#451c38]">
                    <span className="text-sm font-bold">● Morat</span>
                    <span className="text-[10px] opacity-90">5 opcions (1–5)</span>
                  </div>
                  <span className="font-bold text-base text-[#261f19]">=</span>
                  <div className="flex flex-col items-center bg-[#261f19] text-[#faf6ee] px-3 py-1.5 rounded border border-[#7b6855]">
                    <span className="text-base font-bold text-[#f5e4be]">125</span>
                    <span className="text-[9px] uppercase">Codis</span>
                  </div>
                </div>
              </div>

              {/* Point 2: 25 open holes per individual card */}
              <div className="wc-paper rounded-xl p-4 border border-[#bda98e] flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6d325b] text-[#faf6ee] font-typewriter text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#261f19]">
                      Cada Targeta té 25 Forats Oberts
                    </h4>
                    <p className="text-xs text-[#463a2e] mt-0.5 leading-relaxed">
                      Cada cartolina té espai per a les <strong>125 posicions</strong>, però només té <strong>25 forats retallats</strong>. Les altres 100 posicions són cartró tapat.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-[#efe5d2] border border-[#cbbba2] p-3 space-y-2">
                  <div className="flex items-center justify-between font-typewriter text-[11px] font-bold">
                    <span className="text-[#234b7a]">● 25 Forats Oberts</span>
                    <span className="text-[#7b6855]">□ 100 Tapats amb cartró</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 h-4">
                    <div className="rounded-xs bg-[#234b7a] border border-[#153152]" />
                    <div className="rounded-xs bg-[#faf5e8] border border-[#bda98e]" />
                    <div className="rounded-xs bg-[#faf5e8] border border-[#bda98e]" />
                    <div className="rounded-xs bg-[#faf5e8] border border-[#bda98e]" />
                    <div className="rounded-xs bg-[#faf5e8] border border-[#bda98e]" />
                  </div>
                  <div className="text-center font-typewriter text-[10px] text-[#5c4f42]">
                    Una sola targeta deixa passar la llum per <strong>25 forats</strong>
                  </div>
                </div>
              </div>

              {/* Point 3: Stacking 3 cards leaves 1 hole */}
              <div className="wc-paper rounded-xl p-4 border border-[#bda98e] flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6d325b] text-[#faf6ee] font-typewriter text-xs font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#261f19]">
                      En Apilar les 3 Targetes queda 1 Sol Forat!
                    </h4>
                    <p className="text-xs text-[#463a2e] mt-0.5 leading-relaxed">
                      Quan poses les <strong>3 targetes una a sobre de l'altra</strong> (una blava, una groga i una morada), es tapen gairebé tots els forats entre si i <strong>només en queda 1 d'obert</strong>:
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-[#efe5d2] border border-[#cbbba2] p-3 flex items-center justify-between gap-1 font-typewriter text-xs">
                  <div className="text-center px-2 py-1 rounded bg-[#d5e2ef] border border-[#234b7a] text-[#1b3b61]">
                    <div className="font-bold text-sm">25 forats</div>
                    <div className="text-[9px]">1 targeta</div>
                  </div>
                  <span className="font-bold text-[#5c4f42]">&rarr;</span>
                  <div className="text-center px-2 py-1 rounded bg-[#f5e4be] border border-[#b87314] text-[#784908]">
                    <div className="font-bold text-sm">5 forats</div>
                    <div className="text-[9px]">2 targetes</div>
                  </div>
                  <span className="font-bold text-[#5c4f42]">&rarr;</span>
                  <div className="text-center px-2.5 py-1 rounded bg-[#d8e8de] border-2 border-[#2f5941] text-[#1e402f] shadow-xs">
                    <div className="font-bold text-sm">1 SOL FORAT</div>
                    <div className="text-[9px] font-bold">3 targetes juntes!</div>
                  </div>
                </div>
              </div>

              {/* Point 4: Reading Verd / Vermell on the Verifier */}
              <div className="wc-paper rounded-xl p-4 border border-[#bda98e] flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6d325b] text-[#faf6ee] font-typewriter text-xs font-bold shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#261f19]">
                      Mirar pel Forat: Verd (✔) o Vermell (✖)
                    </h4>
                    <p className="text-xs text-[#463a2e] mt-0.5 leading-relaxed">
                      Quan poses les 3 targetes apilades a sobre d'un <strong>Verificador (A–F)</strong>, mires per l'únic forat que ha quedat obert i veus la resposta:
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-[#efe5d2] border border-[#cbbba2] p-3 grid grid-cols-2 gap-2.5 font-typewriter text-xs">
                  <div className="flex items-center gap-2 rounded bg-[#d8e8de] border border-[#2f5941] px-2.5 py-1.5 text-[#1e402f] font-bold">
                    <CheckCircle2 className="h-4 w-4 text-[#2f5941] shrink-0" />
                    <div>
                      <div>✔ VERD</div>
                      <div className="text-[9px] font-normal">Compleix la pista</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-[#f2d8d5] border border-[#992d25] px-2.5 py-1.5 text-[#781f19] font-bold">
                    <XCircle className="h-4 w-4 text-[#992d25] shrink-0" />
                    <div>
                      <div>✖ VERMELL</div>
                      <div className="text-[9px] font-normal">No la compleix</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE VISUAL SIMULATOR OF CARD SUPERPOSITION */}
            <div className="wc-paper rounded-xl border-2 border-[#8c765c] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d5c7b2] pb-3">
                <div>
                  <span className="font-typewriter text-[10px] uppercase tracking-widest text-[#234b7a] font-bold flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" /> PROVA-HO TU MATEIX EN VIU
                  </span>
                  <h4 className="font-display text-xl font-bold text-[#261f19]">
                    Fes clic als 4 passos per veure com es tapen els forats en apilar les targetes
                  </h4>
                </div>
                <span className="font-typewriter text-xs px-2.5 py-1 rounded bg-[#efe5d2] border border-[#a89276] text-[#261f19] font-bold">
                  {demoLayerStep === 1 && '25 forats oberts'}
                  {demoLayerStep === 2 && 'Queden 5 forats oberts'}
                  {demoLayerStep === 3 && 'Queda 1 ÚNIC forat obert!'}
                  {demoLayerStep === 4 && 'Es veu ✔ VERD pel forat!'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {[
                  {
                    s: 1 as const,
                    title: 'Pas 1: Targeta ▲2',
                    sub: '25 forats oberts',
                    cls: 'wc-wash-blue border-[#234b7a] text-[#1b3b61]',
                  },
                  {
                    s: 2 as const,
                    title: 'Pas 2: + Targeta ■4',
                    sub: 'Queden 5 forats',
                    cls: 'wc-wash-ochre border-[#b87314] text-[#784908]',
                  },
                  {
                    s: 3 as const,
                    title: 'Pas 3: + Targeta ●1',
                    sub: 'Queda 1 SOL forat!',
                    cls: 'wc-wash-plum border-[#6d325b] text-[#4f2140]',
                  },
                  {
                    s: 4 as const,
                    title: 'Pas 4: Mirar el forat',
                    sub: 'Surt ✔ VERD!',
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
                    className={`p-2.5 rounded-lg border-2 text-left transition-all cursor-pointer ${
                      demoLayerStep === btn.s
                        ? `${btn.cls} shadow-md -translate-y-0.5 ring-2 ring-[#261f19]/30`
                        : 'bg-[#efe5d2]/70 border-[#c9bca6] text-[#5c4f42] hover:bg-[#efe5d2]'
                    }`}
                  >
                    <div className="font-typewriter text-xs font-bold">{btn.title}</div>
                    <div className="text-[11px] opacity-85 mt-0.5">{btn.sub}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-1">
                <div className="md:col-span-7">
                  <div className="rounded-lg border-2 border-[#8c765c] bg-[#faf5e8] p-3 shadow-md">
                    <div className="grid grid-cols-3 gap-2 mb-2 px-2">
                      <div className="flex justify-start">
                        <span className="rounded-t px-2.5 py-0.5 font-typewriter text-[11px] font-bold bg-[#234b7a] text-[#faf6ee]">
                          ▲ 2
                        </span>
                      </div>
                      <div className="flex justify-center">
                        {demoLayerStep >= 2 && (
                          <span className="rounded-t px-2.5 py-0.5 font-typewriter text-[11px] font-bold bg-[#c8831b] text-[#faf6ee] animate-in fade-in">
                            ■ 4
                          </span>
                        )}
                      </div>
                      <div className="flex justify-end">
                        {demoLayerStep >= 3 && (
                          <span className="rounded-t px-2.5 py-0.5 font-typewriter text-[11px] font-bold bg-[#6d325b] text-[#faf6ee] animate-in fade-in">
                            ● 1
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className="grid gap-[3px] bg-[#e6decb] p-2 rounded border border-[#cbbba2] shadow-inner"
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
                              className={`aspect-square rounded-full transition-all duration-300 ${
                                demoLayerStep === 3
                                  ? 'bg-[#234b7a] ring-2 ring-[#261f19] scale-150 z-20'
                                  : 'bg-[#261f19] scale-105'
                              }`}
                            />
                          );
                        }

                        if (demoLayerStep >= 2 && bOpen && !yOpen) {
                          return (
                            <div
                              key={cell.index}
                              className="aspect-square rounded-[2px] bg-[#c8831b]/55"
                            />
                          );
                        }
                        if (demoLayerStep >= 3 && bOpen && yOpen && !pOpen) {
                          return (
                            <div
                              key={cell.index}
                              className="aspect-square rounded-[2px] bg-[#6d325b]/65"
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

                <div className="md:col-span-5 space-y-3 text-sm text-[#332920]">
                  {demoLayerStep === 1 && (
                    <div className="wc-wash-blue rounded-lg p-4 border border-[#234b7a] space-y-2">
                      <div className="font-typewriter text-xs font-bold uppercase text-[#1b3b61]">
                        1 sola targeta (▲ Blau = 2)
                      </div>
                      <p className="text-xs leading-relaxed">
                        Els punts foscos són els <strong>25 forats oberts</strong> d'aquesta targeta. Encara hi ha massa forats oberts per saber res!
                      </p>
                    </div>
                  )}
                  {demoLayerStep === 2 && (
                    <div className="wc-wash-ochre rounded-lg p-4 border border-[#b87314] space-y-2">
                      <div className="font-typewriter text-xs font-bold uppercase text-[#784908]">
                        2 targetes juntes (▲2 + ■4)
                      </div>
                      <p className="text-xs leading-relaxed">
                        La cartolina groga ha tapat 20 forats (ara es veuen de color ocre). Ja només queden <strong>5 forats oberts</strong>!
                      </p>
                    </div>
                  )}
                  {demoLayerStep === 3 && (
                    <div className="wc-wash-plum rounded-lg p-4 border border-[#6d325b] space-y-2">
                      <div className="font-typewriter text-xs font-bold uppercase text-[#4f2140]">
                        Les 3 targetes juntes (▲2 + ■4 + ●1)
                      </div>
                      <p className="text-xs leading-relaxed">
                        La cartolina morada ha tapat 4 dels 5 forats que quedaven. Ara <strong>només hi ha 1 ÚNIC FORAT OBERT</strong> de totes les 125 caselles!
                      </p>
                    </div>
                  )}
                  {demoLayerStep === 4 && (
                    <div className="wc-wash-olive rounded-lg p-4 border border-[#2f5941] space-y-2">
                      <div className="font-typewriter text-xs font-bold uppercase text-[#1e402f]">
                        Mirem pel forat sobre el Verificador
                      </div>
                      <p className="text-xs leading-relaxed">
                        En posar les 3 targetes a sobre de la carta del Verificador, per aquell únic forat obert apareix un <strong>✔ Verd</strong> (la pista es compleix) o una <strong>✖ Vermella</strong> (no es compleix).
                      </p>
                    </div>
                  )}

                  <p className="font-hand text-lg text-[#5c4f42]">
                    Prem els botons Pas 1, Pas 2, Pas 3 i Pas 4 per comprovar-ho!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => setCurrentChapter(3)}
              className="flex items-center gap-2 rounded-lg border border-[#8c765c] bg-[#efe5d2] hover:bg-[#e5d8c0] text-[#261f19] px-4 py-2.5 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Capítol III</span>
            </button>

            <button
              type="button"
              onClick={() => handleAdvanceChapter(5)}
              className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-6 py-3 font-typewriter text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span>He llegit tots els capítols &bull; Anar al Test Final</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}

      {/* CHAPTER 5: Mandatory Reading Comprehension Quiz to Unlock Phase 2 */}
      {currentChapter === 5 && (
        <section className="wc-paper rounded-xl p-6 sm:p-10 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#d5c7b2] pb-4">
            <div>
              <span className="ww2-stamp text-[11px] font-bold text-[#234b7a] mb-2">
                PROVA D'ACCÉS A LA CASETA 8
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#261f19]">
                Qüestionari sobre la Història i les Targetes
              </h2>
              <p className="text-sm text-[#5c4f42]">
                Respon correctament les <strong>5 preguntes</strong> sobre el que acabes de llegir per obrir la <strong>Fase 2: El Tutorial Guiat Pas a Pas</strong>.
              </p>
            </div>

            {quizSubmitted && (
              <div
                className={`rounded-lg px-4 py-2.5 border-2 font-typewriter text-xs font-bold ${
                  passedQuiz
                    ? 'wc-wash-olive text-[#1e402f] border-[#2f5941]'
                    : 'wc-wash-crimson text-[#781f19] border-[#992d25]'
                }`}
              >
                Resultat: {score} / {quizQuestions.length} encerts
              </div>
            )}
          </div>

          <div className="space-y-5">
            {quizQuestions.map((q, idx) => {
              const selected = quizAnswers[q.id];
              const isCorrect = selected === q.correct;
              return (
                <div
                  key={q.id}
                  className="wc-paper-aged rounded-lg p-5 space-y-3 border border-[#bda98e]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded bg-[#261f19] text-[#faf6ee] font-typewriter text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <h3 className="font-display text-lg font-bold text-[#261f19] leading-snug">
                        {q.question}
                      </h3>
                    </div>
                    <span className="shrink-0 font-typewriter text-[10px] uppercase px-2 py-0.5 rounded bg-[#e2d6c1] text-[#5c4f42] border border-[#c4b49b]">
                      {q.chapterRef}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuiz(q.id, optIdx)}
                          className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs sm:text-sm text-left transition-all ${
                            quizSubmitted
                              ? optIdx === q.correct
                                ? 'wc-wash-olive border-2 border-[#2f5941] text-[#1e402f] font-bold'
                                : isOptionSelected
                                ? 'wc-wash-crimson border-2 border-[#992d25] text-[#781f19] line-through'
                                : 'bg-[#f5efe4]/60 border-[#d5c7b2] opacity-55 text-[#5c4f42]'
                              : isOptionSelected
                              ? 'wc-wash-blue border-2 border-[#234b7a] text-[#1b3b61] font-bold shadow-sm'
                              : 'bg-[#faf6ee] border-[#c9bca6] hover:border-[#7b6855] text-[#332920] cursor-pointer'
                          }`}
                        >
                          <span className="font-typewriter text-xs font-bold text-[#7b6855] shrink-0 mt-0.5">
                            {['A', 'B', 'C', 'D'][optIdx]}.
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`flex items-start gap-2 rounded-lg p-3 text-xs sm:text-sm border ${
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

          {/* Quiz Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t-2 border-[#d5c7b2]">
            <button
              type="button"
              onClick={() => setCurrentChapter(4)}
              className="flex items-center gap-2 rounded-lg border border-[#8c765c] bg-[#efe5d2] hover:bg-[#e5d8c0] text-[#261f19] px-4 py-2.5 font-typewriter text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Tornar a llegir els Capítols</span>
            </button>

            {!quizSubmitted ? (
              <button
                type="button"
                disabled={!allQuestionsAnswered}
                onClick={handleGradeQuiz}
                className={`rounded-lg px-6 py-3 font-typewriter text-xs font-bold uppercase tracking-wider transition-all ${
                  allQuestionsAnswered
                    ? 'bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] shadow-md cursor-pointer'
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
                className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-7 py-3.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer animate-bounce"
              >
                <Compass className="h-4 w-4" />
                <span>Molt bé (5/5)! Obrir Fase 2: Tutorial Pas a Pas</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-typewriter font-bold text-[#992d25]">
                  Cal encertar les 5 preguntes per passar al Tutorial.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQuizSubmitted(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-[#992d25] hover:bg-[#781f19] text-[#faf6ee] px-5 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
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
