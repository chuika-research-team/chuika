import React from 'react';
import { IssueInfo } from '../api/types';
import { Terminal, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  issueInfo: IssueInfo;
  onOpenApiDrawer: () => void;
  isMockMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  issueInfo,
  onOpenApiDrawer,
  isMockMode,
}) => {
  return (
    <header className="w-full border-b border-[#111111] bg-[#F4F0E8] pt-5 pb-0">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">
        
        {/* Верхняя панель: метаданные выпуска */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#111111] pb-3 text-[10px] sm:text-[11px] font-mono tracking-wider text-[#69645C] gap-2">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <span className="font-semibold text-[#111111]">{issueInfo.issueNumber}</span>
            <span className="hidden sm:inline text-[#D5D0C5]">|</span>
            <span className="text-[#111111] font-semibold sm:hidden">{issueInfo.dateFormatted}</span>
            <span className="hidden sm:inline">ОСНОВАН В 2024 ГОДУ</span>
          </div>

          <div className="hidden sm:block font-semibold tracking-widest text-[#111111] uppercase">
            {issueInfo.dateFormatted}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-[#D5D0C5]/40 pt-1.5 sm:pt-0">
            <span className="font-medium text-[#C8372D] flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C8372D] animate-pulse"></span>
              {issueInfo.modeLabel}
            </span>
            <button
              onClick={onOpenApiDrawer}
              className="flex items-center gap-1.5 px-2 py-0.5 border border-[#111111] text-[10px] text-[#111111] hover:bg-[#111111] hover:text-[#F4F0E8] transition-colors cursor-pointer"
              title="Открыть параметры API и OpenAPI спецификацию"
              aria-label="Открыть спецификацию API"
            >
              <Terminal className="h-3 w-3" />
              <span>{isMockMode ? 'MOCK API' : 'LIVE API'}</span>
            </button>
          </div>
        </div>

        {/* Шапка / раздел бренда */}
        <div className="flex flex-col lg:flex-row items-center justify-between py-6 sm:py-8 gap-6 border-b-2 border-transparent">
          
          {/* Основной логотип и заголовок */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-center lg:text-left">
            <h1 className="font-serif font-bold text-6xl sm:text-8xl lg:text-[100px] leading-none tracking-tight text-[#111111] select-none">
              {issueInfo.brandTitle}
            </h1>

            <div className="hidden sm:block font-serif text-5xl lg:text-[72px] text-[#C8372D] select-none leading-none">
              /
            </div>

            <div className="flex flex-col items-center lg:items-flex-start justify-center">
              <span className="font-serif font-bold text-2xl sm:text-3xl lg:text-[36px] leading-tight text-[#111111] tracking-tight">
                {issueInfo.gazetteName}
              </span>
              <p className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#69645C] max-w-[420px]">
                {issueInfo.motto}
              </p>
            </div>
          </div>

          {/* Редакционный штамп */}
          <div className="flex items-center gap-4">
            <div 
              className="border-2 border-[#C8372D] px-4 py-2 flex flex-col items-center justify-center -rotate-6 shadow-xs select-none bg-[#F4F0E8] transition-transform hover:rotate-0"
              title="Штамп аналитической верификации модели"
            >
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#C8372D] leading-tight tracking-widest">
                ML
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#C8372D] font-medium">
                МОДЕЛЬ {issueInfo.modelVersion}
              </span>
              <span className="font-mono text-[8px] tracking-tight text-[#C8372D]/80">
                ТОЧНОСТЬ {issueInfo.modelAccuracy}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
