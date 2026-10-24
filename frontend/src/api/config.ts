import { ApiConfig, EndpointDefinition } from './types';

// Конфигурация по умолчанию: задается переменной окружения или изменяется в интерфейсе
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'https://api.chuika-sport.ru/v1',
  isMockMode: true, // Заглушка, пока не готов OpenAPI
  timeoutMs: 8000,
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) || '',
};

// Шаблоны путей параметризованных конечных точек
export const API_ENDPOINTS = {
  // Метаданные выпуска и газеты
  getIssueInfo: () => `/issue/current`,
  
  // Список матчей с параметрами запроса
  getMatches: (params?: { sport?: string; period?: string; date?: string; search?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.sport && params.sport !== 'all') query.set('sport', params.sport);
    if (params?.period) query.set('period', params.period);
    if (params?.date) query.set('date', params.date);
    if (params?.search) query.set('q', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return `/matches${qs ? `?${qs}` : ''}`;
  },

  // Матч дня
  getFeaturedMatch: () => `/matches/featured`,

  // Подробности анализа отдельного матча
  getMatchById: (matchId: string) => `/matches/${encodeURIComponent(matchId)}`,

  // Список видов спорта и метаданные
  getSports: () => `/sports`,

  // Метрики аналитической модели
  getModelMetrics: () => `/model/metrics`,
} as const;

// Полная документация всех параметризованных конечных точек с метаданными OpenAPI
export const ENDPOINT_DEFINITIONS: EndpointDefinition[] = [
  {
    id: 'getIssueInfo',
    name: 'Текущий выпуск газеты',
    method: 'GET',
    pathTemplate: '/issue/current',
    description: 'Возвращает метаданные текущего газетного выпуска, дату, девиз, версию аналитической модели и редакционные сведения.',
    parameters: [],
    sampleResponse: {
      issueNumber: '№ 142 (9 481)',
      dateFormatted: '24 ОКТЯБРЯ 2026',
      timezone: 'МСК (UTC+3)',
      modeLabel: 'ДЕМОНСТРАЦИОННЫЙ РЕЖИМ',
      brandTitle: 'ЧУЙКА',
      gazetteName: 'Спортивный вестник',
      modelVersion: 'v2.4',
      modelAccuracy: '98.4%',
    },
  },
  {
    id: 'getFeaturedMatch',
    name: 'Матч дня (Главный материал)',
    method: 'GET',
    pathTemplate: '/matches/featured',
    description: 'Возвращает главное событие дня с максимальным аналитическим приоритетом, архивным фотоматериалом и байесовским расчетом исходов.',
    parameters: [],
    sampleResponse: {
      id: 'arsenal-liverpool-2026',
      sport: 'football',
      league: 'Премьер-лига (Англия)',
      startTime: '21:45',
      homeTeam: { name: 'Арсенал', city: 'Лондон', monogram: 'A' },
      awayTeam: { name: 'Ливерпуль', city: 'Ливерпуль', monogram: 'L' },
      probabilities: { p1: 46, draw: 28, p2: 26 },
      predictedOutcome: 'P1',
      confidence: 'high',
    },
  },
  {
    id: 'getMatches',
    name: 'Список матчей с фильтрацией',
    method: 'GET',
    pathTemplate: '/matches?sport={sport}&period={period}&date={date}&q={q}',
    description: 'Возвращает фильтрованную ленту матчей для газетных колонок с расчетом вероятностей (П1, X, П2) и аналитическим резюме.',
    parameters: [
      { name: 'sport', in: 'query', required: false, description: 'Категория спорта: football, hockey', example: 'football' },
      { name: 'period', in: 'query', required: false, description: 'Временной период: today, tomorrow, weekend', example: 'today' },
      { name: 'date', in: 'query', required: false, description: 'Дата в формате YYYY-MM-DD', example: '2026-10-24' },
      { name: 'q', in: 'query', required: false, description: 'Поисковый запрос по названию команды или лиги', example: 'Барселона' },
      { name: 'limit', in: 'query', required: false, description: 'Количество матчей в выборке', example: '12' },
    ],
    sampleResponse: {
      total: 6,
      matches: [],
    },
  },
  {
    id: 'getMatchById',
    name: 'Подробное досье и разбор матча',
    method: 'GET',
    pathTemplate: '/matches/{id}',
    description: 'Возвращает полную математическую модель матча: Монте-Карло симуляции, распределение Пуассона, xG прогноз, составы и историю очных встреч.',
    parameters: [
      { name: 'id', in: 'path', required: true, description: 'Уникальный идентификатор матча', example: 'real-barca-2026' },
    ],
    sampleResponse: {
      id: 'real-barca-2026',
      monteCarloSimulations: 10000,
      xgForecast: { home: 1.84, away: 1.52 },
      keyFactors: ['Доминирование на стандартах', 'Усталость после еврокубков'],
    },
  },
];
