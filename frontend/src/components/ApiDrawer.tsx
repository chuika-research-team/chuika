import React, { useState, useEffect } from 'react';
import { ApiConfig, EndpointDefinition } from '../api/types';
import { ENDPOINT_DEFINITIONS } from '../api/config';
import { OPENAPI_SPEC } from '../api/openApiSchema';
import { chuikaApi, ApiLogEntry } from '../api/client';
import { 
  X, 
  Terminal, 
  Check, 
  Copy, 
  Play, 
  RefreshCw, 
  Server, 
  Code2, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface ApiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onUpdateConfig: (newConfig: Partial<ApiConfig>) => void;
  onRefreshData: () => void;
}

export const ApiDrawer: React.FC<ApiDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'openapi' | 'logs'>('endpoints');
  const [baseUrlInput, setBaseUrlInput] = useState(config.baseUrl);
  const [apiKeyInput, setApiKeyInput] = useState(config.apiKey || '');
  const [isCopiedOpenApi, setIsCopiedOpenApi] = useState(false);
  const [testResult, setTestResult] = useState<{ id: string; status: string; data: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);

  useEffect(() => {
    setBaseUrlInput(config.baseUrl);
    setApiKeyInput(config.apiKey || '');
  }, [config]);

  useEffect(() => {
    const unsub = chuikaApi.subscribeLogs((newLogs) => {
      setLogs(newLogs);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      baseUrl: baseUrlInput.trim(),
      apiKey: apiKeyInput.trim(),
    });
    onRefreshData();
  };

  const handleToggleMock = (enableMock: boolean) => {
    onUpdateConfig({ isMockMode: enableMock });
    onRefreshData();
  };

  const handleCopyOpenApi = () => {
    navigator.clipboard.writeText(JSON.stringify(OPENAPI_SPEC, null, 2));
    setIsCopiedOpenApi(true);
    setTimeout(() => setIsCopiedOpenApi(false), 2500);
  };

  const handleTestEndpoint = async (endpoint: EndpointDefinition) => {
    setIsTesting(true);
    setTestResult(null);
    try {
      let res: unknown;
      if (endpoint.id === 'getIssueInfo') {
        res = await chuikaApi.getIssueInfo();
      } else if (endpoint.id === 'getFeaturedMatch') {
        res = await chuikaApi.getFeaturedMatch();
      } else if (endpoint.id === 'getMatches') {
        res = await chuikaApi.getMatches({ sport: 'all' });
      } else if (endpoint.id === 'getMatchById') {
        res = await chuikaApi.getMatchById('arsenal-liverpool-2026');
      }
      setTestResult({
        id: endpoint.id,
        status: '200 OK (Успех)',
        data: JSON.stringify(res, null, 2),
      });
    } catch (err: unknown) {
      setTestResult({
        id: endpoint.id,
        status: 'Ошибка выполнения',
        data: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-drawer-title"
    >
      <div 
        className="w-full max-w-2xl h-full bg-[#F4F0E8] border-l-2 border-[#111111] shadow-2xl flex flex-col text-[#111111]"
      >
        
        {/* Заголовок боковой панели */}
        <div className="border-b-2 border-[#111111] p-5 bg-[#eae5dc] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#C8372D] text-white">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 id="api-drawer-title" className="font-mono font-bold text-sm tracking-wider uppercase text-[#111111]">
                КОНФИГУРАЦИЯ API & OPENAPI КОНТРАКТ
              </h3>
              <p className="font-mono text-[10px] text-[#69645C]">
                Параметризация эндпоинтов для интеграции готового бэкэнда
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 border border-[#111111] bg-[#F4F0E8] hover:bg-[#111111] hover:text-[#F4F0E8] transition-colors cursor-pointer"
            aria-label="Закрыть панель API"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Глобальные настройки подключения (базовый URL и переключатель mock) */}
        <div className="p-5 border-b border-[#111111] bg-[#F4F0E8] space-y-4">
          
          {/* Переключатель режима */}
          <div className="flex items-center justify-between border border-[#D5D0C5] p-3 bg-[#eae5dc]/50">
            <div>
              <div className="font-mono text-xs font-bold text-[#111111] uppercase">
                РЕЖИМ ИСТОЧНИКА ДАННЫХ
              </div>
              <div className="font-mono text-[11px] text-[#69645C]">
                {config.isMockMode 
                  ? 'Автономный мок-режим (бэкэнд не требуется)' 
                  : 'Прямые HTTP-запросы к указанному бэкэнду'}
              </div>
            </div>

            <div className="flex border border-[#111111]">
              <button
                type="button"
                onClick={() => handleToggleMock(true)}
                className={`px-3 py-1 font-mono text-xs font-semibold cursor-pointer transition-colors ${
                  config.isMockMode
                    ? 'bg-[#111111] text-[#F4F0E8]'
                    : 'bg-[#F4F0E8] text-[#111111] hover:bg-[#D5D0C5]'
                }`}
              >
                MOCK
              </button>
              <button
                type="button"
                onClick={() => handleToggleMock(false)}
                className={`px-3 py-1 font-mono text-xs font-semibold cursor-pointer transition-colors ${
                  !config.isMockMode
                    ? 'bg-[#C8372D] text-[#F4F0E8]'
                    : 'bg-[#F4F0E8] text-[#111111] hover:bg-[#D5D0C5]'
                }`}
              >
                LIVE
              </button>
            </div>
          </div>

          {/* Форма базового URL */}
          <form onSubmit={handleSaveConfig} className="space-y-2">
            <label className="block font-mono text-xs font-semibold uppercase text-[#111111]">
              Базовый URL бэкэнда (VITE_API_BASE_URL):
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                placeholder="https://your-backend.com/api/v1"
                className="flex-1 h-9 px-3 border border-[#111111] bg-[#F4F0E8] font-mono text-xs text-[#111111] focus:outline-hidden"
              />
              <button
                type="submit"
                className="h-9 px-4 bg-[#111111] text-[#F4F0E8] hover:bg-[#C8372D] font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                СОХРАНИТЬ
              </button>
            </div>
          </form>

        </div>

        {/* Кнопки вкладок */}
        <div className="flex border-b border-[#111111] bg-[#eae5dc] px-5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-2.5 px-3 border-b-2 font-semibold cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'endpoints'
                ? 'border-[#C8372D] text-[#C8372D]'
                : 'border-transparent text-[#69645C] hover:text-[#111111]'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>ЭНДПОИНТЫ ({ENDPOINT_DEFINITIONS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('openapi')}
            className={`py-2.5 px-3 border-b-2 font-semibold cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'openapi'
                ? 'border-[#C8372D] text-[#C8372D]'
                : 'border-transparent text-[#69645C] hover:text-[#111111]'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>OPENAPI 3.0 СПЕЦИФИКАЦИЯ</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2.5 px-3 border-b-2 font-semibold cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-[#C8372D] text-[#C8372D]'
                : 'border-transparent text-[#69645C] hover:text-[#111111]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>ЛОГ СЕТИ ({logs.length})</span>
          </button>
        </div>

        {/* Содержимое вкладки: список конечных точек */}
        {activeTab === 'endpoints' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="font-mono text-xs text-[#69645C]">
              Все эндпоинты полностью параметризированы и готовы к замене на живой бэкэнд:
            </div>

            <div className="space-y-3">
              {ENDPOINT_DEFINITIONS.map((def) => {
                const fullUrl = `${config.baseUrl.replace(/\/$/, '')}${def.pathTemplate}`;
                const isSelected = testResult?.id === def.id;

                return (
                  <div key={def.id} className="border border-[#111111] p-3.5 bg-[#F4F0E8] space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 text-white font-mono font-bold text-[10px] ${
                            def.method === 'GET' ? 'bg-[#111111]' : 'bg-[#C8372D]'
                          }`}>
                            {def.method}
                          </span>
                          <span className="font-mono font-bold text-xs text-[#111111]">
                            {def.name}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-[#69645C]">
                          {def.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleTestEndpoint(def)}
                        disabled={isTesting}
                        className="px-2.5 py-1 border border-[#111111] bg-[#eae5dc] hover:bg-[#111111] hover:text-[#F4F0E8] font-mono text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <Play className="h-3 w-3" />
                        <span>ТЕСТ</span>
                      </button>
                    </div>

                    {/* Шаблон пути */}
                    <div className="p-2 bg-black text-[#F4F0E8] font-mono text-[11px] overflow-x-auto select-all">
                      {fullUrl}
                    </div>

                    {/* Параметры, если есть */}
                    {def.parameters.length > 0 && (
                      <div className="text-[11px] font-mono border-t border-[#D5D0C5] pt-2 space-y-1">
                        <span className="font-semibold text-[#111111]">Параметры:</span>
                        <div className="space-y-0.5 text-[#69645C]">
                          {def.parameters.map((param, pIdx) => (
                            <div key={pIdx} className="flex gap-2">
                              <span className="text-[#C8372D] font-bold">{param.name}</span>
                              <span className="text-[10px]">({param.in}):</span>
                              <span>{param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Результат теста, если есть */}
                    {isSelected && testResult && (
                      <div className="mt-2 p-3 bg-zinc-900 text-zinc-100 font-mono text-xs border border-[#C8372D]">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-700 text-[10px] text-[#C8372D]">
                          <span>СТАТУС: {testResult.status}</span>
                        </div>
                        <pre className="text-[10px] overflow-x-auto max-h-36">
                          {testResult.data}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Содержимое вкладки: спецификация OpenAPI */}
        {activeTab === 'openapi' && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#69645C]">
                Формальный контракт OpenAPI 3.0.3 (JSON) для Swagger / Postman:
              </span>
              <button
                onClick={handleCopyOpenApi}
                className="px-3 py-1.5 bg-[#111111] text-[#F4F0E8] hover:bg-[#C8372D] font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopiedOpenApi ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>СКОПИРОВАНО!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>СКОПИРОВАТЬ JSON</span>
                  </>
                )}
              </button>
            </div>

            <pre className="flex-1 p-4 bg-zinc-900 text-emerald-300 font-mono text-xs border border-[#111111] overflow-x-auto leading-relaxed select-all">
{JSON.stringify(OPENAPI_SPEC, null, 2)}
            </pre>
          </div>
        )}

        {/* Содержимое вкладки: сетевой журнал */}
        {activeTab === 'logs' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#69645C]">
                Журнал последних сетевых вызовов фронтэнда:
              </span>
              <button
                onClick={() => chuikaApi.clearLogs()}
                className="font-mono text-[11px] text-[#C8372D] hover:underline cursor-pointer"
              >
                Очистить историю
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-[#69645C]">
                Журнал пуст. Выполните действие или смените фильтр.
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {logs.map((log) => (
                  <div key={log.id} className="border border-[#D5D0C5] p-2.5 bg-[#F4F0E8] space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{log.method}</span>
                        <span className={`px-1 text-[10px] font-bold ${
                          log.status === 200 
                            ? 'bg-emerald-600 text-white' 
                            : log.status === 'MOCK' 
                            ? 'bg-zinc-800 text-zinc-100' 
                            : 'bg-[#C8372D] text-white'
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-[#69645C] text-[10px]">{log.durationMs}ms</span>
                      </div>
                      <span className="text-[10px] text-[#69645C]">{log.timestamp}</span>
                    </div>

                    <div className="text-[11px] text-[#111111] truncate font-mono">
                      {log.url}
                    </div>

                    {log.responseSnippet && (
                      <div className="text-[10px] text-[#69645C] truncate">
                        {log.responseSnippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Нижняя часть боковой панели */}
        <div className="border-t border-[#111111] p-4 bg-[#eae5dc] flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#69645C]">
            <span className={`h-2 w-2 rounded-full ${config.isMockMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span>Текущий статус: {config.isMockMode ? 'Мок-генератор v2.4' : 'Внешний бэкэнд'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-[#111111] bg-[#111111] text-[#F4F0E8] font-mono text-xs font-semibold uppercase hover:bg-[#C8372D] hover:border-[#C8372D] transition-colors cursor-pointer"
          >
            ГОТОВО
          </button>
        </div>

      </div>
    </div>
  );
};
