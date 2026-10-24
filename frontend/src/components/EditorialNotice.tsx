import React from 'react';
import { Cpu, ShieldCheck, Database } from 'lucide-react';

export const EditorialNotice: React.FC = () => {
  return (
    <section className="w-full bg-[#F4F0E8] py-8 sm:py-10">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">
        <div className="border-y border-[#111111] py-7 sm:py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Колонка 1: принцип */}
          <div className="flex flex-col space-y-2">
            <span className="font-mono text-[10px] text-[#C8372D] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
              <Cpu className="h-3 w-3" />
              МАТЕМАТИЧЕСКАЯ ОСНОВА
            </span>
            <h4 className="font-serif font-bold text-2xl sm:text-[27px] leading-[115%] text-[#111111] tracking-tight">
              Как устроен прогноз
            </h4>
            <p className="font-mono text-[11px] text-[#69645C] pt-1">
              Аналитическая модель v2.4 обучена на массиве из 450 000+ спортивных событий с 2012 года.
            </p>
          </div>

          {/* Колонка 2: основы данных */}
          <div className="flex flex-col space-y-2 border-t md:border-t-0 md:border-l border-[#D5D0C5] pt-4 md:pt-0 md:pl-8">
            <span className="font-mono text-[11px] font-semibold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-3 w-3 text-[#C8372D]" />
              Байесовский анализ и xG
            </span>
            <p className="font-sans text-xs leading-[160%] text-[#69645C]">
              Каждый матч обсчитывается по 140+ параметрам: от продвинутой метрики ожидаемых голов (xG) и темпа атак до глубины скамейки, усталости после перелетов и кадровых потерь.
            </p>
          </div>

          {/* Колонка 3: проверка и прозрачность */}
          <div className="flex flex-col space-y-2 border-t md:border-t-0 md:border-l border-[#D5D0C5] pt-4 md:pt-0 md:pl-8">
            <span className="font-mono text-[11px] font-semibold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-[#C8372D]" />
              Открытая верификация
            </span>
            <p className="font-sans text-xs leading-[160%] text-[#69645C]">
              Мы не даем пустых обещаний 100% исходов. «Чуйка» публикует объективные математические ожидания для того, чтобы болельщик видел картину без иллюзий и ажиотажа.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
