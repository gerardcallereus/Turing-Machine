import React from 'react';
import { X, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261f19]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="wc-paper relative w-full max-w-2xl rounded-xl border-2 border-[#7b6855] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b-2 border-[#cbbba2] bg-[#efe5d2] px-6 py-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-[#234b7a]" />
            <div>
              <h2 className="text-xl font-bold text-[#261f19]">
                Manual de Camp: Turing Machine (1941)
              </h2>
              <p className="text-xs font-typewriter text-[#5c4f42]">
                Resum ràpid de regles per a l'operador de la Caseta 8
              </p>
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-[#332920] leading-relaxed">
          <div className="wc-wash-blue rounded-lg border border-[#234b7a] p-4">
            <h3 className="font-display text-lg font-bold text-[#1b3b61]">1. El Codi Secret</h3>
            <p className="text-xs mt-1">
              El teu objectiu és trobar l'únic codi de 3 xifres (<strong>▲ Blau 1–5</strong>, <strong>■ Ocre 1–5</strong>, <strong>● Pruna 1–5</strong>) que compleix totes les regles secretes dels verificadors (A–F).
            </p>
          </div>

          <div className="wc-wash-ochre rounded-lg border border-[#b87314] p-4">
            <h3 className="font-display text-lg font-bold text-[#784908]">
              2. Superposició de Targetes Perforades (Fins a 3 proves per ronda)
            </h3>
            <p className="text-xs mt-1">
              A cada ronda tries una combinació de 3 targetes perforades. En apilar-les, queda <strong>1 sol forat obert dels 125</strong>. Pots inserir aquest mateix sandvitx en <strong>fins a 3 verificadors</strong> abans de passar a la ronda següent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="wc-wash-olive rounded-lg border border-[#2f5941] p-3">
              <div className="flex items-center gap-1.5 font-typewriter font-bold text-[#1e402f] mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>✔ APROVAT (VERD)</span>
              </div>
              <p>
                La teva proposta <strong>compleix</strong> la regla secreta d'aquell verificador. Pots descartar qualsevol opció d'aquella carta que la teva proposta NO compleixi!
              </p>
            </div>

            <div className="wc-wash-crimson rounded-lg border border-[#992d25] p-3">
              <div className="flex items-center gap-1.5 font-typewriter font-bold text-[#781f19] mb-1">
                <XCircle className="h-4 w-4" />
                <span>✖ REBUTJAT (VERMELL)</span>
              </div>
              <p>
                La teva proposta <strong>NO compleix</strong> la regla secreta d'aquell verificador. Pots descartar immediatament l'opció que la teva proposta sí que complia!
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#cbbba2] bg-[#efe5d2] px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#234b7a] px-5 py-2 font-typewriter text-xs font-bold uppercase text-[#faf6ee] cursor-pointer"
          >
            Entès
          </button>
        </div>
      </div>
    </div>
  );
};
