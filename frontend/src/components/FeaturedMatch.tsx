import React from 'react';
import { Match } from '../api/types';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedMatchProps {
  match: Match;
  onOpenAnalysis: (match: Match) => void;
}

export const FeaturedMatch: React.FC<FeaturedMatchProps> = ({
  match,
  onOpenAnalysis,
}) => {
  const { homeTeam, awayTeam, probabilities } = match;

  // Доли вероятностей
  const p1Width = `${probabilities.p1}%`;
  const drawWidth = probabilities.draw !== undefined ? `${probabilities.draw}%` : '0%';
  const p2Width = `${probabilities.p2}%`;

  return (
    <section className="w-full bg-[#F4F0E8] py-8 sm:py-10 border-b border-[#D5D0C5]">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок рубрики */}
        <div className="flex flex-wrap items-center justify-between pb-5 border-b border-transparent text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 bg-[#C8372D] inline-block" />
            <span className="font-semibold text-[#C8372D] uppercase tracking-wider">
              МАТЧ ДНЯ
            </span>
          </div>
          <span className="text-[#69645C] uppercase tracking-wider text-[11px]">
            {match.league} • НАЧАЛО В {match.startTime} МСК
          </span>
        </div>

        {/* Содержимое в двух колонках */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Левая колонка: афиша матча и фото */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            
            {/* Заголовок */}
            <h3 className="font-serif font-bold text-4xl sm:text-5xl lg:text-[62px] leading-[110%] text-[#111111] tracking-tight">
              {homeTeam.name} — {awayTeam.name}
            </h3>

            {/* Строка участников */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 my-4">
              
              {/* Домашняя команда */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-9 h-[42px] border-[1.3px] border-[#111111] bg-[#F4F0E8]">
                  <span className="font-serif font-bold text-sm text-[#111111]">
                    {homeTeam.monogram}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#69645C] uppercase tracking-wider">
                  {homeTeam.city}
                </span>
              </div>

              <span className="font-serif italic text-lg sm:text-xl text-[#69645C]">
                против
              </span>

              {/* Эмблема гостевой команды */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-9 h-[42px] border-[1.3px] border-[#111111] bg-[#F4F0E8]">
                  <span className="font-serif font-bold text-sm text-[#111111]">
                    {awayTeam.monogram}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#69645C] uppercase tracking-wider">
                  {awayTeam.city}
                </span>
              </div>

            </div>

            {/* Иллюстрация архивной футбольной фотографии */}
            <div className="relative w-full h-[240px] sm:h-[260px] bg-[#1a1918] border border-[#111111] overflow-hidden group select-none">
              
              {/* Винтажная монохромная графическая сцена */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-zinc-800 opacity-90" />
              
              {/* Зернистая газетная текстура */}
              <div className="absolute inset-0 newsprint-halftone opacity-35" />

              {/* Силуэт действия и атмосфера стадиона */}
              <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#D5D0C5]/80 bg-black/50 px-2 py-0.5 border border-[#69645C]/40">
                    АРХИВ ПРЕССЫ 1974–2026
                  </span>
                  <span className="font-mono text-[9px] text-[#C8372D] font-bold bg-white/90 px-1.5 py-0.5">
                    HD CHUIKA ARCHIVE
                  </span>
                </div>

                {/* Графика атмосферного спортивного силуэта */}
                <div className="my-auto flex items-center justify-center gap-12 opacity-85">
                  <div className="text-center">
                    <div className="font-serif font-bold text-3xl sm:text-4xl text-[#F4F0E8] tracking-widest">
                      {homeTeam.shortName}
                    </div>
                    <div className="font-mono text-[10px] text-[#9C978E]">ХОЗЯЕВА ПОЛЯ</div>
                  </div>
                  
                  <div className="font-serif italic text-2xl text-[#C8372D]">VS</div>

                  <div className="text-center">
                    <div className="font-serif font-bold text-3xl sm:text-4xl text-[#F4F0E8] tracking-widest">
                      {awayTeam.shortName}
                    </div>
                    <div className="font-mono text-[10px] text-[#9C978E]">ГОСТИ</div>
                  </div>
                </div>

                <div className="flex justify-between items-end text-[10px] font-mono text-[#D5D0C5]/90 border-t border-[#69645C]/30 pt-2">
                  <span>АРЕНА «ЭМИРЕЙТС» • 60 704 ЗРИТЕЛЯ</span>
                  <span>ТАКТИЧЕСКИЙ СРЕЗ № 8</span>
                </div>
              </div>

            </div>

            {/* Подпись к фото */}
            <div className="flex flex-wrap items-center justify-between pt-2.5 text-[11px] font-mono text-[#69645C] gap-2">
              <span className="truncate max-w-[420px]">
                {match.archivalCaption || 'Лондон, стадион «Эмирейтс». Битва за единоличное лидерство'}
              </span>
              <span className="text-[10px] uppercase text-[#69645C]/80">
                АРХИВ ЧУЙКИ • РАСЧЕТ МОДЕЛИ
              </span>
            </div>

          </div>

          {/* Правая колонка: карточка досье прогноза */}
          <div className="lg:col-span-6 border border-[#111111] bg-[#F4F0E8] p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            
            {/* Строка статуса карточки */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D5D0C5] text-[11px] font-mono text-[#69645C]">
              <span className="uppercase tracking-wider font-medium">АНАЛИТИЧЕСКИЙ РАСЧЕТ</span>
              <span className="text-[10px] tracking-wide text-[#111111] font-semibold">МОДЕЛЬ v2.4 • 98.4% СХОДИМОСТЬ</span>
            </div>

            {/* Основной исход и штамп */}
            <div className="flex items-center justify-between py-5">
              <div className="flex flex-col">
                <span className="font-serif font-bold text-6xl sm:text-[76px] leading-none text-[#111111]">
                  {match.probabilities.p1}%
                </span>
                <span className="mt-1 font-sans text-xs text-[#69645C]">
                  Вероятность победы хозяев (П1)
                </span>
              </div>

              {/* Повернутый штамп фаворита */}
              <div 
                className="border-2 border-[#C8372D] px-3.5 py-2 flex flex-col items-center justify-center -rotate-5 bg-[#F4F0E8] select-none shadow-xs"
                title="Оценка вероятности исхода"
              >
                <span className="font-serif font-bold text-xl sm:text-[22px] leading-tight text-[#C8372D] tracking-wider uppercase">
                  {match.predictedOutcomeLabel}
                </span>
                <span className="font-mono text-[10px] text-[#C8372D] font-medium tracking-wide uppercase">
                  {match.confidenceLabel}
                </span>
              </div>
            </div>

            {/* Горизонтальная шкала распределения вероятностей */}
            <div className="space-y-2.5 my-2">
              <div 
                className="flex h-[22px] w-full overflow-hidden border border-[#111111]"
                role="progressbar" 
                aria-label="Распределение вероятностей исходов матча"
              >
                {/* Сегмент победы хозяев (П1) */}
                <div 
                  style={{ width: p1Width }} 
                  className="bg-[#C8372D] h-full transition-all"
                  title={`Победа 1: ${probabilities.p1}%`}
                />
                {/* Сегмент ничьей (X) */}
                {probabilities.draw !== undefined && (
                  <div 
                    style={{ width: drawWidth }} 
                    className="bg-[#9C978E] border-l-2 border-[#F4F0E8] h-full transition-all"
                    title={`Ничья: ${probabilities.draw}%`}
                  />
                )}
                {/* Сегмент победы гостей (П2) */}
                <div 
                  style={{ width: p2Width }} 
                  className="bg-[#111111] border-l-2 border-[#F4F0E8] h-full transition-all"
                  title={`Победа 2: ${probabilities.p2}%`}
                />
              </div>

              {/* Подписи под шкалой */}
              <div className="flex items-center justify-between text-sm font-mono">
                <span className="font-semibold text-[#C8372D]">
                  П1: {probabilities.p1}%
                </span>
                {probabilities.draw !== undefined && (
                  <span className="text-[#111111]">
                    Ничья: {probabilities.draw}%
                  </span>
                )}
                <span className="text-[#111111]">
                  П2: {probabilities.p2}%
                </span>
              </div>
            </div>

            {/* Аналитический вывод */}
            <p className="font-sans text-sm leading-[155%] text-[#111111] my-4 border-t border-[#D5D0C5] pt-4">
              {match.verdictSummary}
            </p>

            {/* Действие CTA и отказ от ответственности */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onOpenAnalysis(match)}
                className="w-full h-[52px] px-4 bg-[#C8372D] hover:bg-[#a62b22] text-[#FFFCF6] flex items-center justify-between font-sans font-semibold text-sm transition-colors cursor-pointer shadow-xs active:translate-y-px"
                aria-label={`Открыть полный разбор матча ${homeTeam.name} против ${awayTeam.name}`}
              >
                <span>ПОЛНЫЙ РАЗБОР И СТАТИСТИКА</span>
                <ArrowUpRight className="h-4.5 w-4.5 text-[#FFFCF6]" />
              </button>

              <p className="font-serif italic text-xs leading-[145%] text-[#69645C]">
                {match.disclaimerNote}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
