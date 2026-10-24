export type OutcomeType = 'P1' | 'X' | 'P2';

export type ConfidenceLevel = 'high' | 'medium' | 'moderate';

export type SportCategory = 'all' | 'football' | 'hockey';

export type PeriodFilter = 'today' | 'tomorrow' | 'weekend';

export interface Probabilities {
  p1: number;
  draw?: number;
  p2: number;
}

export interface Odds {
  p1: number;
  draw?: number;
  p2: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  monogram: string;
  form?: ('W' | 'D' | 'L')[];
  rank?: number;
}

export interface MatchAnalysis {
  headline: string;
  verdict: string;
  keyFactors: string[];
  xgForecast: {
    home: number;
    away: number;
  };
  monteCarloSimulations: number;
  historicalH2H: {
    homeWins: number;
    draws: number;
    awayWins: number;
  };
  missingPlayers: {
    team: string;
    players: string[];
  }[];
  poissonExpectedGoals: string;
  weatherCondition?: string;
  referee?: string;
}

export interface Match {
  id: string;
  sport: SportCategory;
  sportLabel: string;
  league: string;
  leagueShort: string;
  startTime: string; // например, "18:00", "21:45"
  date: string; // "2026-10-24"
  dateFormatted: string; // "24 ОКТЯБРЯ"
  homeTeam: Team;
  awayTeam: Team;
  probabilities: Probabilities;
  predictedOutcome: OutcomeType;
  predictedOutcomeLabel: string; // "ПОБЕДА 1", "НИЧЬЯ", "ПОБЕДА 2"
  confidence: ConfidenceLevel;
  confidenceLabel: string; // "ВЫСОКАЯ УВЕРЕННОСТЬ", "УМЕРЕННАЯ ОЦЕНКА"
  verdictSummary: string;
  detailedAnalysis: MatchAnalysis;
  disclaimerNote: string;
  isFeatured?: boolean;
  archivalImage?: string;
  archivalCaption?: string;
}

export interface IssueInfo {
  issueNumber: string; // "№ 142 (9 481)"
  dateFormatted: string; // "24 ОКТЯБРЯ 2026"
  timezone: string; // "МСК (UTC+3)"
  modeLabel: string; // "ДЕМОНСТРАЦИОННЫЙ РЕЖИМ"
  brandTitle: string; // "ЧУЙКА"
  gazetteName: string; // "Спортивный вестник"
  motto: string; // "ТОЧНЫЕ МАТЕМАТИЧЕСКИЕ РАСЧЕТЫ И СПОРТИВНАЯ ИНТУИЦИЯ"
  subMotto: string; // "Ежедневный свод математических расчетов спортивных матчей"
  modelVersion: string; // "v2.4"
  modelAccuracy: string; // "98.4%"
  editorialRole: string; // "РЕДАКЦИЯ"
  publishedAt: string;
  nextUpdateAt: string;
}

export interface MatchesFilterParams {
  sport?: SportCategory;
  period?: PeriodFilter;
  date?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface EndpointParameter {
  name: string;
  in: 'query' | 'path' | 'body';
  required: boolean;
  description: string;
  example: string;
}

export interface EndpointDefinition {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pathTemplate: string;
  description: string;
  parameters: EndpointParameter[];
  sampleResponse: Record<string, unknown> | Array<unknown>;
}

export interface ApiConfig {
  baseUrl: string;
  isMockMode: boolean;
  timeoutMs: number;
  apiKey?: string;
}
