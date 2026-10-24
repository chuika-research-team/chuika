import React from 'react';
import { Info } from 'lucide-react';

export const OutcomesLegend: React.FC = () => {
  return (
    <div className="w-full bg-[#F4F0E8] py-4 border-b border-[#D5D0C5]">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono text-[#69645C]">
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-[#111111] shrink-0" />
            <span>
              <strong className="text-[#111111] font-semibold">ЛЕГЕНДА ИСХОДОВ:</strong> П1 — победа хозяев, X — ничья, П2 — победа гостей.
            </span>
          </div>

          <div className="text-[#69645C]">
            * В хоккее исходы рассчитываются на основное время (3 периода по 20 минут). В баскетболе — с учетом ОТ.
          </div>
        </div>
      </div>
    </div>
  );
};
