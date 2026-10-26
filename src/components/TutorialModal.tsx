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
        <div className="flex items-center justify-between border-b-2 border-[#cbbba2] bg-[#efe5d2] px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="h-5 w-5 text-[#234b7a]" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#261f19]">
                Com es juga? &bull; Guia Ràpida en 3 Passos
              </h2>
              <p className="text-xs font-typewriter text-[#5c4f42]">
                El teu objectiu és descobrir el Codi Secret de 3 números (de l&apos;1 al 5)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5c4f42] hover:bg-[#e2d5be] hover:text-[#261f19] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-sm text-[#332920] leading-relaxed">
          <div className="wc-wash-blue rounded-lg border border-[#234b7a] p-3.5">
            <h3 className="font-display text-base font-bold text-[#1b3b61]">
              Pas 1: Tria 3 números per provar (a l&apos;esquerra)
            </h3>
            <p className="text-xs mt-1">
              Tria un número de l&apos;1 al 5 per al <strong>▲ Blau</strong>, un per al <strong>■ Groc</strong> i un per al <strong>● Morat</strong>.
            </p>
          </div>

          <div className="wc-wash-ochre rounded-lg border border-[#b87314] p-3.5">
            <h3 className="font-display text-base font-bold text-[#784908]">
              Pas 2: Prova el teu codi als Verificadors (a la dreta)
            </h3>
            <p className="text-xs mt-1">
              Cada verificador (A, B, C, D) té diverses regles escrites, però <strong>només UNA és la regla secreta de veritat</strong>. En cada ronda pots provar el teu codi en <strong>fins a 3 verificadors</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5 text-xs">
              <div className="wc-wash-olive rounded-lg border border-[#2f5941] p-2.5">
                <div className="flex items-center gap-1.5 font-typewriter font-bold text-[#1e402f] mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>✔ SÍ (VERD)</span>
                </div>
                <p>
                  El teu codi <strong>compleix</strong> la regla secreta! Es ratllen les regles on el teu codi deia «No».
                </p>
              </div>

              <div className="wc-wash-crimson rounded-lg border border-[#992d25] p-2.5">
                <div className="flex items-center gap-1.5 font-typewriter font-bold text-[#781f19] mb-1">
                  <XCircle className="h-4 w-4" />
                  <span>✖ NO (VERMELL)</span>
                </div>
                <p>
                  El teu codi <strong>falla</strong>! Es ratlla la regla on el teu codi deia «Sí».
                </p>
              </div>
            </div>
          </div>

          <div className="wc-wash-olive rounded-lg border border-[#2f5941] p-3.5">
            <h3 className="font-display text-base font-bold text-[#1e402f]">
              Pas 3: Ratlla números al teu Quadern i Resol!
            </h3>
            <p className="text-xs mt-1">
              Quan descobreixis la regla d&apos;un verificador (per exemple, que <strong>▲ és més petit que 3</strong>), ves al teu <strong>Quadern</strong> (a sota a l&apos;esquerra) i fes clic als números impossibles (3, 4 i 5) per ratllar-los. Quan sàpigues els 3 números, prem <strong>«Resoldre Codi Secret»</strong>!
            </p>
          </div>
        </div>

        <div className="border-t border-[#cbbba2] bg-[#efe5d2] px-5 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#234b7a] px-5 py-2 font-typewriter text-xs font-bold uppercase text-[#faf6ee] cursor-pointer"
          >
            Entès!
          </button>
        </div>
      </div>
    </div>
  );
};
