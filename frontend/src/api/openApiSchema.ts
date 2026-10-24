/**
 * Контракт OpenAPI 3.0.3
 */
export const OPENAPI_SPEC = {
  openapi: '3.0.3',
  info: {
    title: 'Чуйка — Спортивный вестник API',
    version: '1.0.0',
    description: 'Официальный программный интерфейс спортивного вестника «Чуйка». Предоставляет математические расчеты вероятностей исходов матчей, аналитические выкладки модели и архивные данные.',
    contact: {
      name: 'Редакция вестника «Чуйка»',
      email: 'editorial@chuika-sport.ru',
    },
  },
  servers: [
    {
      url: 'https://api.chuika-sport.ru/v1',
      description: 'Основной рабочий сервер (Production)',
    },
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Локальная разработка (Development)',
    },
  ],
  tags: [
    { name: 'Issue', description: 'Сведения о газетном номере и выпуске' },
    { name: 'Matches', description: 'Спортивные события, вероятности и прогнозы' },
  ],
  paths: {
    '/issue/current': {
      get: {
        tags: ['Issue'],
        summary: 'Получить данные текущего выпуска',
        description: 'Возвращает номер выпуска, дату тиража, девиз и версию аналитической модели.',
        operationId: 'getCurrentIssue',
        responses: {
          '200': {
            description: 'Успешный ответ с метаданными выпуска',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/IssueInfo' },
              },
            },
          },
        },
      },
    },
    '/matches/featured': {
      get: {
        tags: ['Matches'],
        summary: 'Получить матч дня (первая полоса)',
        description: 'Возвращает центральный матч с подробным аналитическим расчетом и архивной фотографией.',
        operationId: 'getFeaturedMatch',
        responses: {
          '200': {
            description: 'Матч дня успешно получен',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Match' },
              },
            },
          },
        },
      },
    },
    '/matches': {
      get: {
        tags: ['Matches'],
        summary: 'Список матчей с фильтрацией',
        description: 'Позволяет отфильтровать матчи по виду спорта, периоду (сегодня/завтра/выходные), дате и поисковому запросу.',
        operationId: 'getMatches',
        parameters: [
          {
            name: 'sport',
            in: 'query',
            required: false,
            description: 'Вид спорта',
            schema: { type: 'string', enum: ['all', 'football', 'hockey'], default: 'all' },
          },
          {
            name: 'period',
            in: 'query',
            required: false,
            description: 'Временной период',
            schema: { type: 'string', enum: ['today', 'tomorrow', 'weekend'], default: 'today' },
          },
          {
            name: 'date',
            in: 'query',
            required: false,
            description: 'Точная дата матча (YYYY-MM-DD)',
            schema: { type: 'string', format: 'date' },
          },
          {
            name: 'q',
            in: 'query',
            required: false,
            description: 'Поиск по названию клуба, городу или лиге',
            schema: { type: 'string' },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Лимит элементов',
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          '200': {
            description: 'Список матчей',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    matches: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Match' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/matches/{id}': {
      get: {
        tags: ['Matches'],
        summary: 'Детальный разбор матча',
        description: 'Возвращает полную математическую модель, Монте-Карло симуляции и xG прогноз для указанного матча.',
        operationId: 'getMatchById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Уникальный ID матча',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Детальный разбор найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Match' },
              },
            },
          },
          '404': {
            description: 'Матч не найден',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Team: {
        type: 'object',
        required: ['id', 'name', 'city', 'monogram'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Арсенал' },
          shortName: { type: 'string', example: 'АРС' },
          city: { type: 'string', example: 'Лондон' },
          monogram: { type: 'string', example: 'A' },
          rank: { type: 'integer', example: 1 },
          form: {
            type: 'array',
            items: { type: 'string', enum: ['W', 'D', 'L'] },
          },
        },
      },
      Probabilities: {
        type: 'object',
        required: ['p1', 'p2'],
        properties: {
          p1: { type: 'number', description: 'Вероятность победы первой команды (%)', example: 46 },
          draw: { type: 'number', description: 'Вероятность ничьей (%)', example: 28 },
          p2: { type: 'number', description: 'Вероятность победы второй команды (%)', example: 26 },
        },
      },
      MatchAnalysis: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          verdict: { type: 'string' },
          keyFactors: { type: 'array', items: { type: 'string' } },
          xgForecast: {
            type: 'object',
            properties: {
              home: { type: 'number' },
              away: { type: 'number' },
            },
          },
          monteCarloSimulations: { type: 'integer', example: 10000 },
          historicalH2H: {
            type: 'object',
            properties: {
              homeWins: { type: 'integer' },
              draws: { type: 'integer' },
              awayWins: { type: 'integer' },
            },
          },
        },
      },
      Match: {
        type: 'object',
        required: ['id', 'sport', 'league', 'startTime', 'homeTeam', 'awayTeam', 'probabilities', 'predictedOutcome'],
        properties: {
          id: { type: 'string' },
          sport: { type: 'string', enum: ['football', 'hockey'] },
          league: { type: 'string' },
          startTime: { type: 'string', example: '21:45' },
          date: { type: 'string', format: 'date' },
          homeTeam: { $ref: '#/components/schemas/Team' },
          awayTeam: { $ref: '#/components/schemas/Team' },
          probabilities: { $ref: '#/components/schemas/Probabilities' },
          predictedOutcome: { type: 'string', enum: ['P1', 'X', 'P2'] },
          confidence: { type: 'string', enum: ['high', 'medium', 'moderate'] },
          verdictSummary: { type: 'string' },
          detailedAnalysis: { $ref: '#/components/schemas/MatchAnalysis' },
          disclaimerNote: { type: 'string' },
          isFeatured: { type: 'boolean' },
        },
      },
      IssueInfo: {
        type: 'object',
        properties: {
          issueNumber: { type: 'string' },
          dateFormatted: { type: 'string' },
          timezone: { type: 'string' },
          modeLabel: { type: 'string' },
          brandTitle: { type: 'string' },
          gazetteName: { type: 'string' },
          motto: { type: 'string' },
          modelVersion: { type: 'string' },
          modelAccuracy: { type: 'string' },
        },
      },
    },
  },
};
