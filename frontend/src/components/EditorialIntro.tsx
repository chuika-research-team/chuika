import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EditorialIntroProps {
  headline?: string;
  introText?: string;
}

export const EditorialIntro: React.FC<EditorialIntroProps> = ({
  headline = 'Вечер больших дерби и вероятности исходов от нашей аналитической модели',
  introText = 'Ежедневный свод математических расчетов спортивных матчей. Мы сопоставляем исторические данные, текущую форму команд и xG для независимой вероятностной оценки.',
}) => {
  return (
    <section className="w-full bg-[#F4F0E8] py-7 sm:py-9">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
          
          {/* Главный редакционный заголовок */}
          <div className="lg:col-span-7">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-[38px] leading-[118%] text-[#111111] tracking-tight">
              {headline}
            </h2>
          </div>

          {/* Обещание продукта и отказ от ответственности */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5 border-l-0 lg:border-l lg:border-[#D5D0C5] lg:pl-8">
            <p className="font-sans text-sm leading-[160%] text-[#69645C]">
              {introText}
            </p>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#C8372D] uppercase tracking-wider">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>НЕ ЯВЛЯЕТСЯ ИНДИВИДУАЛЬНОЙ ИНВЕСТИЦИОННОЙ РЕКОМЕНДАЦИЕЙ</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
