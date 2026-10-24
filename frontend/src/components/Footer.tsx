import React from 'react';
import { Terminal } from 'lucide-react';

interface FooterProps {
  onOpenApiDrawer: () => void;
  isMockMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApiDrawer, isMockMode }) => {
  return (
    <footer className="w-full bg-[#F4F0E8] border-t border-[#111111] pt-8 pb-12">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Выходные данные и юридическая информация */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#D5D0C5] gap-4 text-center sm:text-left">
          
          <div className="space-y-0.5">
            <div className="font-serif font-bold text-base sm:text-[17px] text-[#111111] tracking-tight">
              ЧУЙКА. ОРГАН СПОРТИВНОЙ МЫСЛИ
            </div>
            <div className="font-mono text-[10px] text-[#69645C] uppercase tracking-wider">
              Основан в 2024 году • Выходит ежедневно без выходных
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-[#69645C]">
            <button 
              onClick={onOpenApiDrawer}
              className="text-[#111111] font-semibold hover:text-[#C8372D] underline decoration-[#111111]/30 cursor-pointer flex items-center gap-1"
            >
              <Terminal className="h-3 w-3" />
              <span>Параметры API ({isMockMode ? 'Mock' : 'Live'})</span>
            </button>
            <span>•</span>
            <span className="hover:text-[#111111] cursor-pointer">Правила редакции</span>
            <span>•</span>
            <span className="hover:text-[#111111] cursor-pointer">Политика конфиденциальности</span>
            <span>•</span>
            <span className="border border-[#111111] px-1 py-0.2 text-[9px] font-bold text-[#111111]">
              18+
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
};
