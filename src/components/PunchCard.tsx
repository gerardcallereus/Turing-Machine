import React from 'react';
import { DigitValue, Shape } from '../types/game';
import { PUNCH_MATRIX, MATRIX_COLS, hasHoleInSingleCard } from '../lib/punchMatrix';
import { sound } from '../lib/sound';

interface PunchCardProps {
  shape: Shape;
  value: DigitValue;
  onChange: (value: DigitValue) => void;
  disabled?: boolean;
  activeHoleIndex?: number;
}

export const PunchCard: React.FC<PunchCardProps> = ({
  shape,
  value,
  onChange,
  disabled = false,
  activeHoleIndex,
}) => {
  const config = {
    blue: {
      name: 'Triangle Blau',
      symbol: '▲',
      tabPosition: 'justify-start pl-3',
      tabBg: 'bg-[#234b7a] border-[#153152] text-[#faf6ee]',
      rackCls: 'wc-wash-blue border-[#234b7a]/70',
      badgeBg: 'bg-[#234b7a] text-[#faf6ee]',
      buttonActive: 'bg-[#234b7a] text-[#faf6ee] border-[#153152] -translate-y-1 shadow-md',
      buttonIdle: 'bg-[#faf6ee] text-[#332920] border-[#a89276] hover:border-[#234b7a]',
      serialPrefix: 'BP-B',
    },
    yellow: {
      name: 'Quadrat Ocre',
      symbol: '■',
      tabPosition: 'justify-center',
      tabBg: 'bg-[#c8831b] border-[#805008] text-[#faf6ee]',
      rackCls: 'wc-wash-ochre border-[#b87314]/70',
      badgeBg: 'bg-[#c8831b] text-[#faf6ee]',
      buttonActive: 'bg-[#c8831b] text-[#faf6ee] border-[#805008] -translate-y-1 shadow-md',
      buttonIdle: 'bg-[#faf6ee] text-[#332920] border-[#a89276] hover:border-[#b87314]',
      serialPrefix: 'BP-Y',
    },
    purple: {
      name: 'Cercle Pruna',
      symbol: '●',
      tabPosition: 'justify-end pr-3',
      tabBg: 'bg-[#6d325b] border-[#451c38] text-[#faf6ee]',
      rackCls: 'wc-wash-plum border-[#6d325b]/70',
      badgeBg: 'bg-[#6d325b] text-[#faf6ee]',
      buttonActive: 'bg-[#6d325b] text-[#faf6ee] border-[#451c38] -translate-y-1 shadow-md',
      buttonIdle: 'bg-[#faf6ee] text-[#332920] border-[#a89276] hover:border-[#6d325b]',
      serialPrefix: 'BP-P',
    },
  }[shape];

  const handleSelect = (v: DigitValue) => {
    if (disabled || v === value) return;
    sound.playPunch();
    onChange(v);
  };

  return (
    <div className={`relative flex flex-col rounded-xl border-2 ${config.rackCls} p-3.5 shadow-sm transition-all`}>
      {/* Rack Compartment Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#bfa98c]">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-md font-typewriter text-base font-bold shadow-xs ${config.badgeBg}`}
          >
            {config.symbol}
          </span>
          <div className="font-display text-sm sm:text-base font-bold text-[#261f19] leading-tight">
            {config.name}
          </div>
        </div>

        <span className="font-typewriter text-[10px] uppercase tracking-wider text-[#5c4f42] font-bold">
          Casiller 1–5
        </span>
      </div>

      {/* Physical Slot Selector Tabs (1..5) in a responsive 5-column grid */}
      <div className="grid grid-cols-5 gap-1.5 my-2.5">
        {([1, 2, 3, 4, 5] as DigitValue[]).map((num) => {
          const isSelected = num === value;
          return (
            <button
              key={num}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(num)}
              className={`h-10 w-full flex flex-col items-center justify-center rounded-md border font-typewriter text-xs font-bold transition-all duration-150 ${
                isSelected ? config.buttonActive : config.buttonIdle
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-95'}`}
              title={`Seleccionar targeta perforada ${config.symbol} ${num}`}
            >
              <span className="text-[9px] leading-none opacity-80">{config.symbol}</span>
              <span className="text-sm font-bold leading-tight">{num}</span>
            </button>
          );
        })}
      </div>

      {/* Physical Cream/Ivory Perforated Card Visual */}
      <div className="relative pt-1">
        {/* Staggered Colored Top Tab */}
        <div className={`flex ${config.tabPosition}`}>
          <div
            className={`inline-flex items-center gap-1.5 rounded-t-lg border-t-2 border-x-2 px-3.5 py-0.5 font-typewriter text-xs font-bold shadow-xs ${config.tabBg}`}
          >
            <span>{config.symbol}</span>
            <span className="text-sm">{value}</span>
          </div>
        </div>

        {/* Cream Punch Card Body with Chamfered Top-Right Corner */}
        <div
          className="relative rounded-b-lg rounded-tl-lg rounded-tr-xs border-2 border-[#a89276] bg-[#faf5e8] p-2.5 text-[#261f19] shadow-md"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
          }}
        >
          {/* Card Top Metadata Strip */}
          <div className="flex items-center justify-between border-b border-[#dfd3be] pb-1 mb-1.5 text-[9px] font-typewriter font-bold text-[#5c4f42]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-[#332920]" />
              <span>
                {config.serialPrefix}0{value} &bull; 25 FORATS
              </span>
            </span>
            <span className="uppercase tracking-wider text-[#7b6855]">HOLLERITH 1941</span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#332920]" />
          </div>

          {/* 10x13 Physical Perforation Grid */}
          <div
            className="grid gap-[3px] bg-[#e9dfcc] p-1.5 rounded border border-[#cbbba2] shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${MATRIX_COLS}, minmax(0, 1fr))`,
            }}
          >
            {PUNCH_MATRIX.map((cell) => {
              const isOpen = hasHoleInSingleCard(cell, shape, value);
              const isAlignedHole = activeHoleIndex === cell.index;

              if (!cell.code) {
                return (
                  <div
                    key={cell.index}
                    className="aspect-square rounded-full bg-[#332920] scale-75"
                    title="Forat guia d'alineació mecànica"
                  />
                );
              }

              return (
                <div
                  key={cell.index}
                  className={`aspect-square transition-all duration-200 ${
                    cell.holeShape === 'circle'
                      ? 'rounded-full'
                      : cell.holeShape === 'triangle'
                      ? 'rounded-[2px]'
                      : 'rounded-[1px]'
                  } ${
                    isAlignedHole
                      ? 'bg-[#2f5941] ring-2 ring-[#261f19] scale-125 z-10'
                      : isOpen
                      ? 'bg-[#332920] shadow-inner'
                      : 'bg-[#fbf8f1] border border-[#dfd5c2]'
                  }`}
                />
              );
            })}
          </div>

          {/* Bottom Card Footer */}
          <div className="mt-1.5 flex items-center justify-between text-[9px] font-typewriter text-[#5c4f42]">
            <span>STATION X &bull; PUNCH CARD</span>
            <span className="font-bold text-[#261f19]">
              {config.symbol} = {value}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
