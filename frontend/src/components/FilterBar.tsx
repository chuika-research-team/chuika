import React, { useState } from 'react';
import { SportCategory, PeriodFilter } from '../api/types';
import { CalendarDays, ChevronDown, Search, X } from 'lucide-react';

interface FilterBarProps {
  activeSport: SportCategory;
  onSelectSport: (sport: SportCategory) => void;
  activePeriod: PeriodFilter;
  onSelectPeriod: (period: PeriodFilter) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SPORTS: { id: SportCategory; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'football', label: 'Футбол' },
  { id: 'hockey', label: 'Хоккей' },
];

const PERIODS: { id: PeriodFilter; label: string }[] = [
  { id: 'today', label: 'Сегодня' },
  { id: 'tomorrow', label: 'Завтра' },
  { id: 'weekend', label: 'Выходные' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeSport,
  onSelectSport,
  activePeriod,
  onSelectPeriod,
  selectedDate,
  onSelectDate,
  searchQuery,
  onSearchChange,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="w-full border-y border-[#D5D0C5] bg-[#F4F0E8] py-4.5">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Фильтры видов спорта */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="font-mono text-[10px] uppercase text-[#69645C] tracking-wider pr-1">
              ВИД:
            </span>
            {SPORTS.map((s) => {
              const isSelected = activeSport === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSport(s.id)}
                  className={`h-9 px-4.5 rounded-full font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-[#F4F0E8] border border-[#111111] shadow-xs font-semibold'
                      : 'bg-[#F4F0E8] text-[#111111] border border-[#D5D0C5] hover:border-[#111111]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Периоды, календарь и поиск */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Поле поиска */}
            <div className="relative flex items-center w-full sm:w-auto">
              <Search className="absolute left-3 h-3.5 w-3.5 text-[#69645C]" />
              <input
                type="text"
                placeholder="Поиск по клубу или лиге..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 w-full sm:w-56 pl-8 pr-7 border border-[#D5D0C5] bg-[#F4F0E8] text-xs font-mono text-[#111111] placeholder:text-[#9C978E] focus:outline-hidden focus:border-[#111111]"
                aria-label="Поиск по клубу или лиге"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-[#69645C] hover:text-[#111111]"
                  aria-label="Очистить поиск"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Сегментированные кнопки периода */}
            <div className="flex items-center gap-1.5">
              {PERIODS.map((p) => {
                const isSelected = activePeriod === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPeriod(p.id)}
                    className={`h-9 px-4 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#111111] text-[#F4F0E8] border border-[#111111] font-semibold'
                        : 'bg-[#F4F0E8] text-[#111111] border border-[#D5D0C5] hover:border-[#111111]'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Выбор даты */}
            <div className="relative">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="h-9 px-3 border border-[#D5D0C5] bg-[#F4F0E8] hover:border-[#111111] flex items-center gap-2.5 font-mono text-xs text-[#111111] transition-colors cursor-pointer"
                aria-label="Выбрать дату матча"
              >
                <CalendarDays className="h-4 w-4 text-[#111111]" />
                <span className="font-medium">{selectedDate}</span>
                <ChevronDown className="h-3 w-3 text-[#111111]" />
              </button>

              {/* Выпадающий список дат */}
              {isCalendarOpen && (
                <div className="absolute right-0 mt-1 w-48 border border-[#111111] bg-[#F4F0E8] shadow-lg p-2 z-40">
                  <div className="text-[10px] font-mono uppercase text-[#69645C] mb-1.5 px-1 font-semibold">
                    Выберите выпуск
                  </div>
                  {['24 ОКТЯБРЯ', '25 ОКТЯБРЯ', '26 ОКТЯБРЯ', '27 ОКТЯБРЯ'].map((dateOption) => (
                    <button
                      key={dateOption}
                      onClick={() => {
                        onSelectDate(dateOption);
                        setIsCalendarOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-xs font-mono transition-colors ${
                        selectedDate === dateOption
                          ? 'bg-[#111111] text-[#F4F0E8]'
                          : 'hover:bg-[#D5D0C5]/40 text-[#111111]'
                      }`}
                    >
                      {dateOption}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
