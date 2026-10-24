import React from 'react';
import { Match } from '../api/types';
import { ArrowUpRight } from 'lucide-react';

interface MatchFeedProps {
  matches: Match[];
  onOpenAnalysis: (match: Match) => void;
  isLoading?: boolean;
}

export const MatchFeed: React.FC<MatchFeedProps> = ({
  matches,
  onOpenAnalysis,
  isLoading = false,
}) => {
  return (
    <section className="w-full bg-[#F4F0E8] py-8 sm:py-10">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок ленты */}
        <div className="border-t-[3px] border-b border-[#111111] py-5 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="font-serif font-bold text-3xl sm:text-4xl text-[#111111] tracking-tight">
              СЕГОДНЯ В НОМЕРЕ
            </h3>
            <span className="font-mono text-xs font-semibold text-[#C8372D] px-2 py-0.5 border border-[#C8372D]/50">
              {matches.length} {matches.length === 1 ? 'МАТЧ' : matches.length < 5 ? 'МАТЧА' : 'МАТЧЕЙ'}
            </span>
          </div>

          <div className="font-mono text-[11px] text-[#69645C] uppercase tracking-wider">
            РУБРИКА: РЕГУЛЯРНЫЙ ЧЕМПИОНАТ
          </div>
        </div>

        {/* Состояние загрузки */}
        {isLoading && (
          <div className="py-20 text-center font-mono text-sm text-[#69645C]">
            <div className="inline-block animate-spin h-6 w-6 border-2 border-[#111111] border-t-[#C8372D] rounded-full mb-3"></div>
            <div>ОБРАБОТКА ДАННЫХ АНАЛИТИЧЕСКОЙ МОДЕЛЬЮ...</div>
          </div>
        )}

        {/* Пустое состояние */}
        {!isLoading && matches.length === 0 && (
          <div className="py-20 text-center border-b border-[#D5D0C5]">
            <div className="font-serif text-2xl text-[#111111] mb-2">Матчей не найдено</div>
            <p className="font-mono text-xs text-[#69645C] max-w-md mx-auto">
              По выбранным фильтрам и критериям поиска матчи отсутствуют в текущем номере. Попробуйте сбросить фильтры.
            </p>
          </div>
        )}

        {/* Газетная сетка в три колонки */}
        {!isLoading && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-[#D5D0C5]">
            {matches.map((match, index) => {
              const { homeTeam, awayTeam, probabilities } = match;
              
              // Расчет сегментов
              const p1Width = `${probabilities.p1}%`;
              const drawWidth = probabilities.draw !== undefined ? `${probabilities.draw}%` : '0%';
              const p2Width = `${probabilities.p2}%`;

              // Определение классов границ для разделителей газетных колонок
              const isLastInRowLg = (index + 1) % 3 === 0;
              const isLastInRowMd = (index + 1) % 2 === 0;

              return (
                <article
                  key={match.id}
                  className={`p-6 sm:p-7 flex flex-col justify-between border-b border-[#D5D0C5] transition-colors hover:bg-[#eae5dc]/40 ${
                    !isLastInRowLg ? 'lg:border-r border-[#D5D0C5]' : ''
                  } ${!isLastInRowMd ? 'md:max-lg:border-r' : ''}`}
                >
                  
                  {/* Заголовок карточки: лига и время начала */}
                  <div className="flex items-center justify-between pb-3.5">
                    <div className="border border-[#D5D0C5] px-2 py-0.5 font-mono text-[10px] uppercase text-[#69645C] tracking-wider bg-[#F4F0E8]">
                      {match.leagueShort || match.league}
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#111111]">
                      {match.startTime} МСК
                    </span>
                  </div>

                  {/* Блок команд */}
                  <div className="space-y-3 my-2">
                    
                    {/* Домашняя команда */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex items-center justify-center w-8 h-[38px] border-[1.3px] border-[#111111] bg-[#F4F0E8] shrink-0">
                          <span className="font-serif font-bold text-xs text-[#111111]">
                            {homeTeam.monogram}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-xl sm:text-[22px] leading-tight text-[#111111] truncate">
                          {homeTeam.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#69645C] shrink-0">
                        (1)
                      </span>
                    </div>

                    {/* Гостевая команда */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex items-center justify-center w-8 h-[38px] border-[1.3px] border-[#111111] bg-[#F4F0E8] shrink-0">
                          <span className="font-serif font-bold text-xs text-[#111111]">
                            {awayTeam.monogram}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-xl sm:text-[22px] leading-tight text-[#111111] truncate">
                          {awayTeam.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#69645C] shrink-0">
                        (2)
                      </span>
                    </div>

                  </div>

                  {/* Оценка модели и шкала вероятностей */}
                  <div className="space-y-2.5 my-4 pt-2 border-t border-[#D5D0C5]/60">
                    
                    {/* Горизонтальная шкала 10 пикселей */}
                    <div 
                      className="flex h-2.5 w-full overflow-hidden border border-[#111111]"
                      role="progressbar" 
                      aria-label={`Вероятности исхода матча ${homeTeam.name} — ${awayTeam.name}`}
                    >
                      <div 
                        style={{ width: p1Width }} 
                        className={`h-full ${probabilities.p1 >= (probabilities.p2 || 0) ? 'bg-[#C8372D]' : 'bg-[#111111]'}`} 
                      />
                      {probabilities.draw !== undefined && (
                        <div 
                          style={{ width: drawWidth }} 
                          className="bg-[#9C978E] border-l-2 border-[#F4F0E8] h-full" 
                        />
                      )}
                      <div 
                        style={{ width: p2Width }} 
                        className={`h-full border-l-2 border-[#F4F0E8] ${probabilities.p2 > probabilities.p1 ? 'bg-[#C8372D]' : 'bg-[#111111]'}`} 
                      />
                    </div>

                    {/* Подписи с выделенным фаворитом */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={probabilities.p1 >= (probabilities.p2 || 0) && (!probabilities.draw || probabilities.p1 >= probabilities.draw) ? 'font-semibold text-[#C8372D]' : 'text-[#111111]'}>
                        П1: {probabilities.p1}%
                      </span>
                      {probabilities.draw !== undefined && (
                        <span className="text-[#111111]">
                          X: {probabilities.draw}%
                        </span>
                      )}
                      <span className={probabilities.p2 > probabilities.p1 && (!probabilities.draw || probabilities.p2 >= probabilities.draw) ? 'font-semibold text-[#C8372D]' : 'text-[#111111]'}>
                        П2: {probabilities.p2}%
                      </span>
                    </div>

                    {/* Краткое резюме */}
                    <p className="font-sans text-xs leading-[150%] text-[#69645C] line-clamp-2 pt-1">
                      {match.verdictSummary}
                    </p>
                  </div>

                  {/* Действие и ограничение */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => onOpenAnalysis(match)}
                      className="w-full h-[42px] px-4 bg-[#F4F0E8] hover:bg-[#111111] text-[#111111] hover:text-[#F4F0E8] border border-[#D5D0C5] hover:border-[#111111] flex items-center justify-between font-sans font-semibold text-xs transition-colors cursor-pointer"
                      aria-label={`Разбор матча ${homeTeam.name} — ${awayTeam.name}`}
                    >
                      <span>РАЗБОР МАТЧА</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>

                    <p className="font-serif italic text-[11px] leading-tight text-[#69645C]">
                      {match.disclaimerNote || '* xG модель: точность прогноза 74%'}
                    </p>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
