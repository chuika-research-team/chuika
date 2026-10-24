import React from 'react';
import { SportCategory } from '../api/types';
import { Clock, Code2 } from 'lucide-react';

interface NavigationProps {
  activeSport: SportCategory;
  onSelectSport: (sport: SportCategory) => void;
  timezone: string;
  onOpenApiDrawer: () => void;
}

const RUBRICS: { id: SportCategory; label: string }[] = [
  { id: 'all', label: 'ВСЕ МАТЧИ' },
  { id: 'football', label: 'ФУТБОЛ' },
  { id: 'hockey', label: 'ХОККЕЙ' },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeSport,
  onSelectSport,
  timezone,
  onOpenApiDrawer,
}) => {
  return (
    <nav 
      aria-label="Рубрики вестника" 
      className="w-full border-t-[3px] border-b border-[#111111] bg-[#F4F0E8] sticky top-0 z-30 shadow-xs"
    >
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between overflow-x-auto no-scrollbar">
          
          {/* Ссылки на рубрики */}
          <div className="flex items-center space-x-6 sm:space-x-8 h-full">
            {RUBRICS.map((rubric) => {
              const isActive = activeSport === rubric.id;
              return (
                <button
                  key={rubric.id}
                  onClick={() => onSelectSport(rubric.id)}
                  className={`h-full flex items-center px-1 text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-[3px] ${
                    isActive
                      ? 'border-[#C8372D] text-[#C8372D] font-bold'
                      : 'border-transparent text-[#111111] hover:text-[#C8372D] font-medium'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {rubric.label}
                </button>
              );
            })}
          </div>

          {/* Часовой пояс и ярлык контракта API */}
          <div className="flex items-center gap-4 text-xs font-mono text-[#69645C] pl-4">
            <div className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="h-3.5 w-3.5 text-[#111111]" />
              <span className="text-[#111111]">{timezone}</span>
            </div>

            <button
              onClick={onOpenApiDrawer}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border border-[#D5D0C5] text-[#111111] hover:border-[#111111] hover:bg-[#111111] hover:text-[#F4F0E8] transition-colors cursor-pointer rounded-xs"
              title="Открыть OpenAPI контракт и тестовую консоль"
            >
              <Code2 className="h-3 w-3 text-[#C8372D]" />
              <span className="font-semibold">OpenAPI</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
