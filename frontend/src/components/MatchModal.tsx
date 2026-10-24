import React, { useState } from 'react';
import { Match } from '../api/types';
import { API_ENDPOINTS } from '../api/config';
import { X, Activity, BarChart3, Code2, AlertTriangle, CheckCircle2, Copy, Check } from 'lucide-react';

interface MatchModalProps {
  match: Match | null;
  onClose: () => void;
  baseUrl: string;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  match,
  onClose,
  baseUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'model' | 'api'>('analysis');
  const [copied, setCopied] = useState(false);

  if (!match) return null;

  const { homeTeam, awayTeam, probabilities, detailedAnalysis } = match;
  const endpointPath = API_ENDPOINTS.getMatchById(match.id);
  const fullEndpointUrl = `${baseUrl.replace(/\/$/, '')}${endpointPath}`;

  const copyEndpoint = () => {
    navigator.clipboard.writeText(fullEndpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#F4F0E8] border-2 border-[#111111] shadow-2xl flex flex-col text-[#111111] overflow-hidden"
      >
        
        {/* Заголовок газетного досье */}
        <div className="border-b-2 border-[#111111] p-5 sm:p-6 bg-[#eae5dc] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase text-[#C8372D] font-bold">
              <span className="h-2 w-2 bg-[#C8372D]" />
              <span>АНАЛИТИЧЕСКОЕ ДОСЬЕ № {match.id.toUpperCase()}</span>
              <span className="text-[#69645C]">•</span>
              <span className="text-[#69645C] font-normal">{match.league}</span>
            </div>
            
            <h3 id="modal-headline" className="font-serif font-bold text-2xl sm:text-4xl text-[#111111] tracking-tight">
              {homeTeam.name} — {awayTeam.name}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#69645C] pt-1">
              <span>{match.dateFormatted} • {match.startTime} МСК</span>
              <span>•</span>
              <span className="text-[#111111] font-semibold">
                ПРОГНОЗ МОДЕЛИ: {match.predictedOutcomeLabel} ({match.confidenceLabel})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#111111] bg-[#F4F0E8] hover:bg-[#111111] hover:text-[#F4F0E8] transition-colors cursor-pointer shrink-0"
            aria-label="Закрыть аналитическое досье"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Навигация по вкладкам */}
        <div className="flex border-b border-[#111111] bg-[#F4F0E8] px-5 sm:px-6 overflow-x-auto text-xs font-mono shrink-0">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3 px-3 border-b-2 font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'border-[#C8372D] text-[#C8372D]'
                : 'border-transparent text-[#69645C] hover:text-[#111111]'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>АНАЛИТИЧЕСКИЙ ОТЧЕТ</span>
          </button>

          <button
            onClick={() => setActiveTab('model')}
            className={`py-3 px-3 border-b-2 font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'model'
                ? 'border-[#C8372D] text-[#C8372D]'
                : 'border-transparent text-[#69645C] hover:text-[#111111]'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>МАТЕМАТИЧЕСКАЯ МОДЕЛЬ (xG & Монте-Карло)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3 border-b-2 font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'border-[#C8372D] text-[#C8372D]'
                : 'border-transparent text-[#69645C] hover:text-[#111111]'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-[#C8372D]" />
            <span>ПАРАМЕТРЫ ЭНДПОИНТА</span>
          </button>
        </div>

        {/* Прокручиваемый контейнер содержимого вкладки */}
        <div className="flex-1 overflow-y-auto">
          {/* Вкладка 1: содержание анализа */}
          {activeTab === 'analysis' && (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Блок вердикта */}
              <div className="border border-[#111111] p-5 bg-[#eae5dc]/60 space-y-2">
                <span className="font-mono text-[10px] text-[#C8372D] font-bold uppercase tracking-wider">
                  ВЫВОД АНАЛИТИЧЕСКОЙ СЛУЖБЫ
                </span>
                <h4 className="font-serif font-bold text-lg sm:text-xl text-[#111111]">
                  {detailedAnalysis.headline}
                </h4>
                <p className="font-sans text-sm leading-relaxed text-[#111111]">
                  {detailedAnalysis.verdict}
                </p>
              </div>

              {/* Ключевые факторы */}
              <div className="space-y-3">
                <h5 className="font-mono text-xs uppercase tracking-wider text-[#111111] font-bold border-b border-[#D5D0C5] pb-1.5">
                  КЛЮЧЕВЫЕ ФАКТОРЫ РАСЧЕТА
                </h5>
                <ul className="space-y-2 font-sans text-xs sm:text-sm text-[#111111]">
                  {detailedAnalysis.keyFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#C8372D] shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Отсутствующие игроки / отчет о травмах */}
              {detailedAnalysis.missingPlayers.length > 0 && (
                <div className="border border-[#D5D0C5] p-4 bg-[#F4F0E8] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[#111111] flex items-center gap-1.5 uppercase">
                    <AlertTriangle className="h-3.5 w-3.5 text-[#C8372D]" />
                    КАДРОВЫЕ ПОТЕРИ И ТРАВМЫ
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    {detailedAnalysis.missingPlayers.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="font-semibold text-[#111111]">{item.team}:</span>
                        <ul className="list-disc list-inside text-[#69645C]">
                          {item.players.map((p, pIdx) => (
                            <li key={pIdx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Погода и судья */}
              {(detailedAnalysis.weatherCondition || detailedAnalysis.referee) && (
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#D5D0C5] text-xs font-mono text-[#69645C]">
                  {detailedAnalysis.weatherCondition && (
                    <div>ПОГОДНЫЕ УСЛОВИЯ: <span className="text-[#111111]">{detailedAnalysis.weatherCondition}</span></div>
                  )}
                  {detailedAnalysis.referee && (
                    <div>АРБИТР: <span className="text-[#111111]">{detailedAnalysis.referee}</span></div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Вкладка 2: разбор модели и симуляции */}
          {activeTab === 'model' && (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Матрица распределения вероятностей */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-[#111111] p-4 text-center bg-[#F4F0E8]">
                  <div className="font-mono text-xs text-[#69645C] uppercase">ПОБЕДА {homeTeam.name} (П1)</div>
                  <div className="font-serif font-bold text-4xl text-[#C8372D] my-1">{probabilities.p1}%</div>
                  <div className="font-mono text-[10px] text-[#69645C]">Коэф. ~{(100 / probabilities.p1).toFixed(2)}</div>
                </div>

                {probabilities.draw !== undefined ? (
                  <div className="border border-[#111111] p-4 text-center bg-[#F4F0E8]">
                    <div className="font-mono text-xs text-[#69645C] uppercase">НИЧЬЯ (X)</div>
                    <div className="font-serif font-bold text-4xl text-[#111111] my-1">{probabilities.draw}%</div>
                    <div className="font-mono text-[10px] text-[#69645C]">Коэф. ~{(100 / probabilities.draw).toFixed(2)}</div>
                  </div>
                ) : (
                  <div className="border border-[#111111] p-4 text-center bg-[#eae5dc]">
                    <div className="font-mono text-xs text-[#69645C] uppercase">НИЧЬЯ</div>
                    <div className="font-mono text-xs text-[#69645C] my-4">Не предусмотрена правилами</div>
                  </div>
                )}

                <div className="border border-[#111111] p-4 text-center bg-[#F4F0E8]">
                  <div className="font-mono text-xs text-[#69645C] uppercase">ПОБЕДА {awayTeam.name} (П2)</div>
                  <div className="font-serif font-bold text-4xl text-[#111111] my-1">{probabilities.p2}%</div>
                  <div className="font-mono text-[10px] text-[#69645C]">Коэф. ~{(100 / probabilities.p2).toFixed(2)}</div>
                </div>
              </div>

              {/* Сравнение симуляций xG */}
              <div className="border border-[#111111] p-5 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs font-semibold">
                  <span>МОДЕЛЬ ОЖИДАЕМЫХ ГОЛОВ (xG FORECAST)</span>
                  <span className="text-[#C8372D]">10 000 СИМУЛЯЦИЙ</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold">{homeTeam.name}</span>
                      <span className="font-bold text-[#C8372D]">{detailedAnalysis.xgForecast.home} xG</span>
                    </div>
                    <div className="h-3 w-full bg-[#D5D0C5] overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, detailedAnalysis.xgForecast.home * 25)}%` }} 
                        className="h-full bg-[#C8372D]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold">{awayTeam.name}</span>
                      <span className="font-bold text-[#111111]">{detailedAnalysis.xgForecast.away} xG</span>
                    </div>
                    <div className="h-3 w-full bg-[#D5D0C5] overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, detailedAnalysis.xgForecast.away * 25)}%` }} 
                        className="h-full bg-[#111111]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs font-mono text-[#69645C]">
                  {detailedAnalysis.poissonExpectedGoals}
                </div>
              </div>

              {/* История личных встреч */}
              <div className="border-t border-[#D5D0C5] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#69645C]">
                <span className="font-semibold text-[#111111]">ИСТОРИЯ ОЧНЫХ ВСТРЕЧ (H2H):</span>
                <div className="flex items-center gap-6 text-[#111111]">
                  <span>Побед {homeTeam.shortName}: <strong className="text-[#C8372D]">{detailedAnalysis.historicalH2H.homeWins}</strong></span>
                  <span>Ничьих: <strong>{detailedAnalysis.historicalH2H.draws}</strong></span>
                  <span>Побед {awayTeam.shortName}: <strong>{detailedAnalysis.historicalH2H.awayWins}</strong></span>
                </div>
              </div>

            </div>
          )}

          {/* Вкладка 3: спецификация конечной точки API (для Егора) */}
          {activeTab === 'api' && (
            <div className="p-6 sm:p-8 space-y-5">
              
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-bold text-[#C8372D] uppercase tracking-wider">
                  ПАРАМЕТРИЗИРОВАННЫЙ ЭНДПОИНТ ДЛЯ БЭКЭНДА
                </span>
                <p className="font-sans text-xs text-[#69645C]">
                  Фронтэнд обращается к данному эндпоинту для получения детального досье. Замените базовый URL в настройках для подключения реального сервера.
                </p>
              </div>

              {/* Блок URL конечной точки */}
              <div className="border border-[#111111] p-3.5 bg-black text-[#F4F0E8] font-mono text-xs flex items-center justify-between gap-3 overflow-x-auto">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-[#C8372D] text-white font-bold text-[10px]">GET</span>
                  <span className="text-[#F4F0E8] font-mono select-all">{fullEndpointUrl}</span>
                </div>
                <button
                  onClick={copyEndpoint}
                  className="p-1 text-[#D5D0C5] hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Скопировать URL эндпоинта"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* Таблица параметров пути */}
              <div className="space-y-2">
                <span className="font-mono text-xs font-semibold uppercase text-[#111111]">Параметры пути:</span>
                <div className="border border-[#D5D0C5] text-xs font-mono">
                  <div className="grid grid-cols-3 bg-[#eae5dc] p-2 font-bold border-b border-[#D5D0C5]">
                    <span>Имя</span>
                    <span>Тип</span>
                    <span>Значение</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 bg-[#F4F0E8]">
                    <span className="text-[#C8372D] font-bold">id</span>
                    <span>string (slug)</span>
                    <span className="font-mono text-[#111111]">{match.id}</span>
                  </div>
                </div>
              </div>

              {/* Пример JSON-полезной нагрузки */}
              <div className="space-y-2">
                <span className="font-mono text-xs font-semibold uppercase text-[#111111]">Ожидаемый ответ контракта (JSON):</span>
                <pre className="p-4 bg-zinc-900 text-zinc-200 border border-[#111111] text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
{JSON.stringify(match, null, 2)}
                </pre>
              </div>

            </div>
          )}
        </div>

        {/* Нижняя часть модального окна */}
        <div className="border-t border-[#111111] p-4 bg-[#eae5dc] flex items-center justify-between shrink-0">
          <span className="font-serif italic text-xs text-[#69645C]">
            * Выпуск вестника «Чуйка» от 24 октября 2026 года
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 border border-[#111111] bg-[#111111] text-[#F4F0E8] hover:bg-[#C8372D] hover:border-[#C8372D] text-xs font-mono font-semibold uppercase transition-colors cursor-pointer"
          >
            ЗАКРЫТЬ ДОСЬЕ
          </button>
        </div>

      </div>
    </div>
  );
};
