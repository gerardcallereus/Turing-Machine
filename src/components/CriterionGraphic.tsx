import React from 'react';
import { CriterionCard } from '../types/game';

interface CriterionGraphicProps {
  card: CriterionCard;
}

export const ShapeBadge: React.FC<{
  shape: 'blue' | 'yellow' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  label?: string | number;
}> = ({ shape, size = 'md', label }) => {
  const styles = {
    blue: 'bg-[#234b7a] text-[#faf6ee] border-[#153152]',
    yellow: 'bg-[#c8831b] text-[#faf6ee] border-[#805008]',
    purple: 'bg-[#6d325b] text-[#faf6ee] border-[#451c38]',
  }[shape];

  const symbol = {
    blue: '▲',
    yellow: '■',
    purple: '●',
  }[shape];

  const dims = {
    sm: 'h-5 px-1.5 text-[10px] gap-0.5 rounded border',
    md: 'h-7 px-2 text-xs gap-1 rounded-md border',
    lg: 'h-9 px-2.5 text-sm gap-1.5 rounded-lg border-2',
  }[size];

  return (
    <span className={`inline-flex items-center justify-center font-typewriter font-bold shadow-xs ${styles} ${dims}`}>
      <span>{symbol}</span>
      {label !== undefined && <span>{label}</span>}
    </span>
  );
};

export const CriterionGraphic: React.FC<CriterionGraphicProps> = ({ card }) => {
  const renderDiagram = () => {
    switch (card.id) {
      case 1:
        return (
          <div className="flex items-center justify-center gap-3">
            <ShapeBadge shape="blue" size="md" />
            <div className="flex items-center gap-1 rounded bg-[#faf6ee] px-2.5 py-0.5 border border-[#8c765c] font-typewriter text-xs font-bold text-[#261f19]">
              <span>=</span>
              <span className="text-[#a89276]">|</span>
              <span>&gt;</span>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-[#261f19] text-[#faf6ee] font-typewriter text-sm font-bold">
              1
            </span>
          </div>
        );
      case 2:
      case 3:
      case 4: {
        const shape = card.id === 2 ? 'blue' : card.id === 3 ? 'yellow' : 'purple';
        return (
          <div className="flex items-center justify-center gap-3">
            <ShapeBadge shape={shape} size="md" />
            <div className="flex items-center gap-1 rounded bg-[#faf6ee] px-2.5 py-0.5 border border-[#8c765c] font-typewriter text-xs font-bold text-[#261f19]">
              <span>&lt;</span>
              <span className="text-[#a89276]">|</span>
              <span>=</span>
              <span className="text-[#a89276]">|</span>
              <span>&gt;</span>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-[#261f19] text-[#faf6ee] font-typewriter text-sm font-bold">
              3
            </span>
          </div>
        );
      }
      case 5:
      case 6:
      case 7: {
        const shape = card.id === 5 ? 'blue' : card.id === 6 ? 'yellow' : 'purple';
        return (
          <div className="flex items-center justify-center gap-2.5">
            <ShapeBadge shape={shape} size="md" />
            <span className="text-[#5c4f42] font-typewriter text-xs font-bold">?</span>
            <div className="flex items-center gap-1.5">
              <span className="rounded wc-wash-blue border border-[#234b7a] px-2 py-0.5 font-typewriter text-[10px] font-bold text-[#1b3b61]">
                2·4 PAR
              </span>
              <span className="rounded wc-wash-ochre border border-[#b87314] px-2 py-0.5 font-typewriter text-[10px] font-bold text-[#784908]">
                1·3·5 SEN
              </span>
            </div>
          </div>
        );
      }
      case 8:
      case 9:
      case 10: {
        const targetDigit = card.id === 8 ? 1 : card.id === 9 ? 3 : 4;
        return (
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5">
              <ShapeBadge shape="blue" size="sm" />
              <ShapeBadge shape="yellow" size="sm" />
              <ShapeBadge shape="purple" size="sm" />
            </div>
            <span className="font-typewriter text-xs font-bold text-[#5c4f42]">×</span>
            <span className="flex h-7 px-2.5 items-center justify-center rounded bg-[#261f19] text-[#faf6ee] font-typewriter text-sm font-bold">
              #{targetDigit}
            </span>
          </div>
        );
      }
      case 11:
      case 12:
      case 13: {
        const leftShape = card.id === 13 ? 'yellow' : 'blue';
        const rightShape = card.id === 11 ? 'yellow' : 'purple';
        return (
          <div className="flex items-center justify-center gap-2.5">
            <ShapeBadge shape={leftShape} size="md" />
            <div className="flex items-center gap-1 rounded bg-[#faf6ee] px-2 py-0.5 border border-[#8c765c] font-typewriter text-xs font-bold text-[#261f19]">
              <span>&lt;</span>
              <span className="text-[#a89276]">|</span>
              <span>=</span>
              <span className="text-[#a89276]">|</span>
              <span>&gt;</span>
            </div>
            <ShapeBadge shape={rightShape} size="md" />
          </div>
        );
      }
      case 14:
      case 15: {
        const isMin = card.id === 14;
        return (
          <div className="flex items-center justify-center gap-2">
            <span className="rounded bg-[#261f19] text-[#faf6ee] px-2 py-0.5 font-typewriter text-[10px] font-bold uppercase">
              {isMin ? '▼ MÍNIM' : '▲ MÀXIM'}
            </span>
            <div className="flex items-center gap-1">
              <ShapeBadge shape="blue" size="sm" />
              <ShapeBadge shape="yellow" size="sm" />
              <ShapeBadge shape="purple" size="sm" />
            </div>
          </div>
        );
      }
      case 16:
        return (
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <ShapeBadge shape="blue" size="sm" />
              <ShapeBadge shape="yellow" size="sm" />
              <ShapeBadge shape="purple" size="sm" />
            </div>
            <span className="font-typewriter text-[10px] font-bold text-[#1b3b61] wc-wash-blue border border-[#234b7a] px-2 py-0.5 rounded">
              QUANTITAT PARELLS (2,4)
            </span>
          </div>
        );
      case 17:
        return (
          <div className="flex items-center justify-center gap-1.5">
            <ShapeBadge shape="blue" size="sm" />
            <span className="text-[#5c4f42] font-bold text-xs">+</span>
            <ShapeBadge shape="yellow" size="sm" />
            <span className="text-[#5c4f42] font-bold text-xs">+</span>
            <ShapeBadge shape="purple" size="sm" />
            <span className="text-[#261f19] font-typewriter text-[10px] font-bold ml-1 bg-[#faf6ee] px-2 py-0.5 rounded border border-[#8c765c]">
              PAR / SEN
            </span>
          </div>
        );
      case 18:
        return (
          <div className="flex items-center justify-center gap-1.5">
            <ShapeBadge shape="blue" size="sm" />
            <span className="text-[#5c4f42] font-bold text-xs">+</span>
            <ShapeBadge shape="yellow" size="sm" />
            <span className="text-[#5c4f42] font-bold text-xs">+</span>
            <ShapeBadge shape="purple" size="sm" />
            <span className="font-typewriter text-xs font-bold text-[#261f19] mx-0.5">⋚</span>
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#261f19] text-[#faf6ee] font-typewriter text-xs font-bold">
              6
            </span>
          </div>
        );
      case 19:
        return (
          <div className="flex items-center justify-center gap-1.5">
            <ShapeBadge shape="blue" size="sm" />
            <span className="text-[#5c4f42] font-bold text-xs">+</span>
            <ShapeBadge shape="yellow" size="sm" />
            <span className="font-typewriter text-xs font-bold text-[#261f19] mx-1">
              &lt; | = | &gt;
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#261f19] text-[#faf6ee] font-typewriter text-xs font-bold">
              6
            </span>
          </div>
        );
      case 20:
      case 21:
        return (
          <div className="flex items-center justify-center gap-2 font-typewriter text-[11px] font-bold">
            <span className="rounded bg-[#faf6ee] border border-[#8c765c] px-2 py-0.5 text-[#261f19]">
              A≠B≠C
            </span>
            <span className="rounded wc-wash-ochre border border-[#b87314] px-2 py-0.5 text-[#784908]">
              A=B
            </span>
            {card.id === 20 && (
              <span className="rounded wc-wash-plum border border-[#6d325b] px-2 py-0.5 text-[#4f2140]">
                A=B=C
              </span>
            )}
          </div>
        );
      case 22:
        return (
          <div className="flex items-center justify-center gap-2">
            <ShapeBadge shape="blue" size="sm" />
            <ShapeBadge shape="yellow" size="sm" />
            <ShapeBadge shape="purple" size="sm" />
            <span className="font-typewriter text-[10px] font-bold text-[#261f19] bg-[#faf6ee] px-2 py-0.5 rounded border border-[#8c765c]">
              ↗ CREIX | ↘ DECR
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg bg-[#efe5d2] border border-[#bda98e] px-3 py-2 shadow-inner">
      {renderDiagram()}
    </div>
  );
};
