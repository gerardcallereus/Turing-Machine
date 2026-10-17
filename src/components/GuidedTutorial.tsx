import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lock,
  Check,
  X,
  Trophy,
  Layers,
} from 'lucide-react';
import { sound } from '../lib/sound';
import confetti from 'canvas-confetti';

interface GuidedTutorialProps {
  onFinishAndPlay: () => void;
  onBackToTheory: () => void;
}

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({
  onFinishAndPlay,
  onBackToTheory,
}) => {
  const [step, setStep] = useState<number>(1);

  // Interactive completion states for each sequential step
  const [inspectedShapes, setInspectedShapes] = useState<string[]>([]);
  const [inspectedRules, setInspectedRules] = useState<number[]>([]);
  const [pickedBlue, setPickedBlue] = useState<number>(1);
  const [pickedYellow, setPickedYellow] = useState<number>(1);
  const [pickedPurple, setPickedPurple] = useState<number>(1);
  const [interactiveTestDone, setInteractiveTestDone] = useState<boolean>(false);
  const [sheetRuleMarks, setSheetRuleMarks] = useState<Record<number, 'none' | 'eliminated' | 'confirmed'>>({
    0: 'none',
    1: 'none',
    2: 'none',
  });

  const totalSteps = 6;

  // Check whether current step's mandatory interactive exercise is complete
  const isCurrentStepCompleted = (): boolean => {
    switch (step) {
      case 1:
        return inspectedShapes.length === 3;
      case 2:
        return inspectedRules.length === 3;
      case 3:
        return pickedBlue === 4 && pickedYellow === 2 && pickedPurple === 1;
      case 4:
        return interactiveTestDone;
      case 5:
        return (
          sheetRuleMarks[0] === 'eliminated' &&
          sheetRuleMarks[1] === 'eliminated' &&
          sheetRuleMarks[2] === 'confirmed'
        );
      case 6:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!isCurrentStepCompleted()) return;
    sound.playPunch();
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    sound.playPunch();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleTestVerA = () => {
    sound.playCardInsert();
    setTimeout(() => {
      sound.playResult(true);
      setInteractiveTestDone(true);
    }, 420);
  };

  const toggleRuleMark = (idx: number) => {
    sound.playPencilMark();
    setSheetRuleMarks((prev) => {
      const cur = prev[idx];
      const next = cur === 'none' ? 'eliminated' : cur === 'eliminated' ? 'confirmed' : 'none';
      return { ...prev, [idx]: next };
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Archival Training Header */}
      <div className="wc-paper-aged rounded-xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="ww2-stamp text-[11px] font-bold text-[#2f5941]">
              FASE 2 DE 3 &bull; ENTRENAMENT GUIAT
            </span>
            <span className="font-typewriter text-xs text-[#5c4f42] font-bold">
              Pas {step} de {totalSteps}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#261f19]">
            Tutorial Pràctic Pas a Pas: Com es Juga?
          </h1>
          <p className="text-sm text-[#463a2e] italic">
            Completa el petit repte pràctic de cada pas per desbloquejar el següent i passar a jugar una partida real.
          </p>
        </div>

        {/* Stepper Progress Pills */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const sNum = i + 1;
            const active = sNum === step;
            const done = sNum < step;
            return (
              <div
                key={sNum}
                className={`flex h-9 w-9 items-center justify-center rounded-lg font-typewriter text-xs font-bold border transition-all ${
                  active
                    ? 'bg-[#234b7a] text-[#faf6ee] border-[#1b3b61] scale-110 shadow'
                    : done
                    ? 'wc-wash-olive text-[#1e402f] border-[#2f5941]'
                    : 'bg-[#e6decb] text-[#8c7b68] border-[#c4b49b]'
                }`}
              >
                {done ? '✓' : sNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Card */}
      <div className="wc-paper rounded-xl p-6 sm:p-8 space-y-6">
        {/* STEP 1: Inspect the 3 Geometric Shapes */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b-2 border-[#d5c7b2] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-typewriter text-xs uppercase tracking-widest text-[#234b7a] font-bold">
                  Pas 1 de 6 &bull; El Codi Secret
                </span>
                <h2 className="text-2xl font-bold text-[#261f19] mt-0.5">
                  Les 3 Figures i els 125 Codis Possibles
                </h2>
              </div>
              <span className="font-typewriter text-xs px-3 py-1 rounded bg-[#efe5d2] border border-[#bda98e] text-[#463a2e]">
                Exercici: Fes clic sobre les 3 figures ({inspectedShapes.length}/3)
              </span>
            </div>

            <p className="text-base text-[#332920] leading-relaxed">
              En cada partida, el teu objectiu és endevinar un <strong>únic codi secret de 3 números</strong>. Cada posició té una forma i un color propis, i només pot ser un número de l'<strong>1 al 5</strong>. Fes clic sobre cadascuna de les tres figures per veure com són:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'blue',
                  symbol: '▲',
                  title: 'Triangle Blau',
                  cls: 'wc-wash-blue border-[#234b7a]',
                  badge: 'bg-[#234b7a] text-[#faf6ee]',
                  desc: '1r número del codi. Pot valer 1, 2, 3, 4 o 5.',
                },
                {
                  id: 'yellow',
                  symbol: '■',
                  title: 'Quadrat Groc',
                  cls: 'wc-wash-ochre border-[#b87314]',
                  badge: 'bg-[#b87314] text-[#faf6ee]',
                  desc: '2n número del codi. Pot valer 1, 2, 3, 4 o 5.',
                },
                {
                  id: 'purple',
                  symbol: '●',
                  title: 'Cercle Morat',
                  cls: 'wc-wash-plum border-[#6d325b]',
                  badge: 'bg-[#6d325b] text-[#faf6ee]',
                  desc: '3r número del codi. Pot valer 1, 2, 3, 4 o 5.',
                },
              ].map((item) => {
                const isInspected = inspectedShapes.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sound.playPunch();
                      if (!isInspected) {
                        setInspectedShapes((prev) => [...prev, item.id]);
                      }
                    }}
                    className={`rounded-xl border-2 p-5 text-left transition-all cursor-pointer ${item.cls} ${
                      isInspected ? 'ring-2 ring-[#2f5941] shadow-md' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-lg font-typewriter text-xl font-bold ${item.badge}`}
                      >
                        {item.symbol}
                      </span>
                      {isInspected ? (
                        <span className="font-typewriter text-[11px] font-bold text-[#2f5941] flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Examinada
                        </span>
                      ) : (
                        <span className="font-typewriter text-[11px] text-[#7b6855] underline">
                          Clic per veure
                        </span>
                      )}
                    </div>
                    <div className="font-display text-lg font-bold text-[#261f19]">{item.title}</div>
                    <p className="text-xs text-[#463a2e] mt-1 leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Inspect Verifier A's 3 Options */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b-2 border-[#d5c7b2] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-typewriter text-xs uppercase tracking-widest text-[#234b7a] font-bold">
                  Pas 2 de 6 &bull; Les Pistes dels Verificadors
                </span>
                <h2 className="text-2xl font-bold text-[#261f19] mt-0.5">
                  Com funcionen els Verificadors (A, B, C, D)?
                </h2>
              </div>
              <span className="font-typewriter text-xs px-3 py-1 rounded bg-[#efe5d2] border border-[#bda98e] text-[#463a2e]">
                Exercici: Examina les 3 opcions del Verificador A ({inspectedRules.length}/3)
              </span>
            </div>

            <p className="text-base text-[#332920] leading-relaxed">
              A la taula hi ha de 4 a 6 <strong>Verificadors (A, B, C, D...)</strong>. Cada verificador té una <strong>Carta de Pistes</strong> amb diverses opcions possibles, però <strong>només UNA d'elles és la pista secreta de veritat</strong>. Fes clic sobre les 3 opcions de la Carta #02 per entendre què diu cadascuna:
            </p>

            <div className="wc-paper-aged rounded-xl p-5 border border-[#a89276] space-y-3">
              <div className="flex items-center justify-between border-b border-[#c9bca6] pb-2">
                <span className="font-typewriter text-xs font-bold text-[#234b7a]">
                  RANURA A &bull; CARTA DE CRITERI #02: COMPARAR ▲ AMB 3
                </span>
                <span className="font-typewriter text-xs text-[#5c4f42]">Verificador #493</span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    idx: 0,
                    label: 'Opció 1: ▲ és menor que 3 (▲ < 3)',
                    detail: 'Si aquesta fos la regla secreta, ▲ només podria ser 1 o 2.',
                  },
                  {
                    idx: 1,
                    label: 'Opció 2: ▲ és igual a 3 (▲ = 3)',
                    detail: 'Si aquesta fos la regla secreta, ▲ hauria de ser obligatòriament 3.',
                  },
                  {
                    idx: 2,
                    label: 'Opció 3: ▲ és més gran que 3 (▲ > 3)',
                    detail: 'Si aquesta fos la regla secreta, ▲ només podria ser 4 o 5.',
                  },
                ].map((opt) => {
                  const seen = inspectedRules.includes(opt.idx);
                  return (
                    <button
                      key={opt.idx}
                      type="button"
                      onClick={() => {
                        sound.playPencilMark();
                        if (!seen) setInspectedRules((prev) => [...prev, opt.idx]);
                      }}
                      className={`w-full rounded-lg p-3.5 border text-left transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        seen
                          ? 'wc-wash-olive border-[#2f5941] text-[#1e402f]'
                          : 'bg-[#faf6ee] border-[#c4b49b] hover:border-[#234b7a]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-[#261f19]">{opt.label}</div>
                        <div className="text-xs text-[#5c4f42] mt-0.5">{opt.detail}</div>
                      </div>
                      <span className="font-typewriter text-xs font-bold shrink-0">
                        {seen ? '✓ Analitzada' : 'Clic per analitzar →'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Assemble the 3 Perforated Cards [4 - 2 - 1] */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b-2 border-[#d5c7b2] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-typewriter text-xs uppercase tracking-widest text-[#b87314] font-bold">
                  Pas 3 de 6 &bull; Muntatge de les Targetes Perforades
                </span>
                <h2 className="text-2xl font-bold text-[#261f19] mt-0.5">
                  Compondre la Proposta de Prova: ▲4 - ■2 - ●1
                </h2>
              </div>
              <span className="font-typewriter text-xs px-3 py-1 rounded bg-[#efe5d2] border border-[#bda98e] text-[#463a2e]">
                Exercici: Selecciona ▲=4, ■=2 i ●=1
              </span>
            </div>

            <p className="text-base text-[#332920] leading-relaxed">
              Volem interrogar el Verificador A («Comparar ▲ amb 3»). Per sortir de dubtes, muntarem la proposta <strong>▲ = 4, ■ = 2, ● = 1</strong> seleccionant aquestes tres targetes perforades al suport:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Blue picker */}
              <div className="wc-wash-blue rounded-xl border-2 border-[#234b7a] p-4 text-center space-y-3">
                <div className="font-display text-lg font-bold text-[#1b3b61]">
                  ▲ Triangle Blau (Tria el 4)
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        sound.playPunch();
                        setPickedBlue(n);
                      }}
                      className={`h-10 rounded font-typewriter text-sm font-bold border transition-all cursor-pointer ${
                        pickedBlue === n
                          ? 'bg-[#234b7a] text-[#faf6ee] border-[#1b3b61] scale-105 shadow'
                          : 'bg-[#faf6ee] text-[#261f19] border-[#a89276]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Yellow picker */}
              <div className="wc-wash-ochre rounded-xl border-2 border-[#b87314] p-4 text-center space-y-3">
                <div className="font-display text-lg font-bold text-[#784908]">
                  ■ Quadrat Groc (Tria el 2)
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        sound.playPunch();
                        setPickedYellow(n);
                      }}
                      className={`h-10 rounded font-typewriter text-sm font-bold border transition-all cursor-pointer ${
                        pickedYellow === n
                          ? 'bg-[#b87314] text-[#faf6ee] border-[#784908] scale-105 shadow'
                          : 'bg-[#faf6ee] text-[#261f19] border-[#a89276]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purple picker */}
              <div className="wc-wash-plum rounded-xl border-2 border-[#6d325b] p-4 text-center space-y-3">
                <div className="font-display text-lg font-bold text-[#4f2140]">
                  ● Cercle Morat (Tria l'1)
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        sound.playPunch();
                        setPickedPurple(n);
                      }}
                      className={`h-10 rounded font-typewriter text-sm font-bold border transition-all cursor-pointer ${
                        pickedPurple === n
                          ? 'bg-[#6d325b] text-[#faf6ee] border-[#4f2140] scale-105 shadow'
                          : 'bg-[#faf6ee] text-[#261f19] border-[#a89276]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`rounded-lg p-4 border font-typewriter text-xs flex items-center justify-between ${
                isCurrentStepCompleted()
                  ? 'wc-wash-olive border-[#2f5941] text-[#1e402f] font-bold'
                  : 'bg-[#efe5d2] border-[#bda98e] text-[#5c4f42]'
              }`}
            >
              <span>
                Sandvitx actual: ▲{pickedBlue} - ■{pickedYellow} - ●{pickedPurple}
              </span>
              <span>
                {isCurrentStepCompleted()
                  ? '✓ Perfecte! Les 3 targetes deixen un únic forat obert!'
                  : 'Selecciona 4 - 2 - 1 per continuar'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Insert the Stacked Cards into Verifier A */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b-2 border-[#d5c7b2] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-typewriter text-xs uppercase tracking-widest text-[#2f5941] font-bold">
                  Pas 4 de 6 &bull; Lectura Mecànica pels Forats
                </span>
                <h2 className="text-2xl font-bold text-[#261f19] mt-0.5">
                  Interrogar el Verificador A amb el Sandvitx [4 - 2 - 1]
                </h2>
              </div>
              <span className="font-typewriter text-xs px-3 py-1 rounded bg-[#efe5d2] border border-[#bda98e] text-[#463a2e]">
                Exercici: Prem el botó per alinear les targetes
              </span>
            </div>

            <p className="text-base text-[#332920] leading-relaxed">
              Col·loquem les tres targetes apilades <strong>[▲4 - ■2 - ●1]</strong> damunt de la targeta de verificació del <strong>Verificador A</strong>. Vegem quin símbol apareix a través de l'únic forat obert:
            </p>

            <div className="wc-paper-aged rounded-xl p-6 border-2 border-[#a89276] flex flex-col items-center justify-center gap-4">
              {!interactiveTestDone ? (
                <button
                  type="button"
                  onClick={handleTestVerA}
                  className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-7 py-3.5 font-typewriter text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer transition-all"
                >
                  <Layers className="h-4 w-4" />
                  <span>Inserir Targetes [4 - 2 - 1] al Verificador A</span>
                </button>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="inline-flex items-center gap-2 rounded-lg wc-wash-olive border-2 border-[#2f5941] px-5 py-2 font-typewriter text-sm font-bold text-[#1e402f]">
                    <CheckCircle2 className="h-5 w-5 text-[#2f5941]" />
                    <span>RESULTAT PEL FORAT OBERT: ✔ VERD (VÀLID)</span>
                  </div>
                  <p className="text-sm text-[#332920] max-w-xl">
                    Físicament hem posat les tres targetes <strong>[▲4 - ■2 - ●1]</strong> juntes (perquè calen les 3 per deixar un sol forat), però fixat que la carta del <strong>Verificador A només mira el Triangle ▲</strong> (les seves opcions eren comparar ▲ amb 3). Com que el nostre triangle era <strong>▲ = 4</strong> i la màquina ha donat <strong>✔ VERD</strong>, sabem amb certesa que la seva regla és <strong>«▲ &gt; 3»</strong> (perquè 4 no és menor ni igual que 3, només és més gran!).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Cross Out Eliminated Rules on the Deduction Sheet */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="border-b-2 border-[#d5c7b2] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-typewriter text-xs uppercase tracking-widest text-[#6d325b] font-bold">
                  Pas 5 de 6 &bull; Anotació al Quadern de Deducció
                </span>
                <h2 className="text-2xl font-bold text-[#261f19] mt-0.5">
                  Descartar les Regles Impossibles a Llapis
                </h2>
              </div>
              <span className="font-typewriter text-xs px-3 py-1 rounded bg-[#efe5d2] border border-[#bda98e] text-[#463a2e]">
                Exercici: Descarta (✖) les 2 primeres i confirma (✔) «▲ &gt; 3»
              </span>
            </div>

            <p className="text-base text-[#332920] leading-relaxed">
              Com feia Alan Turing a la Caseta 8, ara anotem la deducció al nostre quadern: fes clic sobre <strong>«▲ &lt; 3»</strong> i <strong>«▲ = 3»</strong> per <strong>descartar-les (✖)</strong>, i fes doble clic sobre <strong>«▲ &gt; 3»</strong> per deixar-la <strong>confirmada (✔)</strong>:
            </p>

            <div className="wc-paper-aged rounded-xl p-5 border border-[#a89276] space-y-2.5">
              {[
                { idx: 0, label: 'Opció 1: ▲ és menor que 3 (▲ < 3)', target: 'Descarta amb ✖ (1 clic)' },
                { idx: 1, label: 'Opció 2: ▲ és igual a 3 (▲ = 3)', target: 'Descarta amb ✖ (1 clic)' },
                { idx: 2, label: 'Opció 3: ▲ és més gran que 3 (▲ > 3)', target: 'Confirma amb ✔ (2 clics)' },
              ].map((item) => {
                const st = sheetRuleMarks[item.idx];
                return (
                  <button
                    key={item.idx}
                    type="button"
                    onClick={() => toggleRuleMark(item.idx)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      st === 'eliminated'
                        ? 'wc-wash-crimson border-[#992d25] text-[#781f19] line-through'
                        : st === 'confirmed'
                        ? 'wc-wash-olive border-2 border-[#2f5941] text-[#1e402f] font-bold'
                        : 'bg-[#faf6ee] border-[#bda98e] text-[#261f19]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded border border-[#8c765c] bg-[#efe5d2]">
                        {st === 'eliminated' ? (
                          <X className="h-4 w-4 text-[#992d25]" />
                        ) : st === 'confirmed' ? (
                          <Check className="h-4 w-4 text-[#2f5941]" />
                        ) : (
                          '·'
                        )}
                      </span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="font-typewriter text-[11px] text-[#5c4f42]">{item.target}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Graduation & Unlock Phase 3 */}
        {step === 6 && (
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full wc-wash-ochre border-2 border-[#b87314] text-[#784908]">
              <Trophy className="h-8 w-8" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <span className="ww2-stamp text-xs font-bold text-[#2f5941]">
                ACREDITACIÓ D'OPERADOR CONCEDIDA
              </span>
              <h2 className="text-3xl font-bold text-[#261f19] mt-2">
                Entrenament Completat amb Èxit!
              </h2>
              <p className="text-base text-[#463a2e] leading-relaxed">
                Ja coneixes la història d'Alan Turing i Bletchley Park, i domines el funcionament físic de les targetes perforades i la fulla de deducció. Recorda que a cada ronda pots interrogar fins a <strong>3 verificadors</strong> abans de canviar de combinació.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  sound.playWin();
                  confetti({
                    particleCount: 100,
                    spread: 75,
                    origin: { y: 0.6 },
                    colors: ['#234b7a', '#b87314', '#6d325b', '#2f5941'],
                  });
                  onFinishAndPlay();
                }}
                className="flex items-center gap-2 rounded-lg bg-[#2f5941] hover:bg-[#234532] text-[#faf6ee] px-8 py-4 font-typewriter text-sm font-bold uppercase tracking-wider shadow-xl transition-all cursor-pointer"
              >
                <span>Desbloquejar Fase 3 &bull; Entrar al Tauler de Joc</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Step Controls */}
        <div className="flex items-center justify-between border-t-2 border-[#d5c7b2] pt-5">
          {step === 1 ? (
            <button
              type="button"
              onClick={onBackToTheory}
              className="flex items-center gap-1.5 rounded-lg border border-[#8c765c] bg-[#efe5d2] px-4 py-2 font-typewriter text-xs font-bold text-[#261f19] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Tornar al Dossier Històric</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-1.5 rounded-lg border border-[#8c765c] bg-[#efe5d2] px-4 py-2 font-typewriter text-xs font-bold text-[#261f19] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Pas Anterior</span>
            </button>
          )}

          {step < totalSteps && (
            <button
              type="button"
              disabled={!isCurrentStepCompleted()}
              onClick={nextStep}
              className={`flex items-center gap-1.5 rounded-lg px-6 py-2.5 font-typewriter text-xs font-bold uppercase tracking-wider transition-all ${
                isCurrentStepCompleted()
                  ? 'bg-[#234b7a] hover:bg-[#1b3b61] text-[#faf6ee] shadow-md cursor-pointer'
                  : 'bg-[#d8cbb8] text-[#8c7b68] border border-[#c4b49b] cursor-not-allowed'
              }`}
            >
              {!isCurrentStepCompleted() && <Lock className="h-3.5 w-3.5" />}
              <span>
                {isCurrentStepCompleted()
                  ? 'Següent Pas del Tutorial'
                  : 'Completa l\'exercici per avançar'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
