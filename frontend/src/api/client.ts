import { DEFAULT_API_CONFIG, API_ENDPOINTS } from './config';
import { MOCK_ISSUE_INFO, MOCK_FEATURED_MATCH, MOCK_MATCHES } from './mockData';
import { ApiConfig, IssueInfo, Match, MatchesFilterParams } from './types';

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number | 'MOCK' | 'ERROR';
  durationMs: number;
  requestParams?: Record<string, unknown>;
  responseSnippet?: string;
  isMock: boolean;
}

class ChuikaApiClient {
  private config: ApiConfig = { ...DEFAULT_API_CONFIG };
  private listeners: Set<() => void> = new Set();
  private logs: ApiLogEntry[] = [];
  private logListeners: Set<(logs: ApiLogEntry[]) => void> = new Set();

  constructor() {
    // Попытка загрузить пользовательское переопределение из localStorage в браузере
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chuika_api_config');
        if (saved) {
          this.config = { ...this.config, ...JSON.parse(saved) };
        }
      } catch {
        // Игнорировать ошибку localStorage
      }
    }
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('chuika_api_config', JSON.stringify(this.config));
      } catch {
        // Игнорировать
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribeLogs(listener: (logs: ApiLogEntry[]) => void): () => void {
    this.logListeners.add(listener);
    listener([...this.logs]);
    return () => this.logListeners.delete(listener);
  }

  public getLogs(): ApiLogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.notifyLogs();
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  private notifyLogs(): void {
    this.logListeners.forEach((l) => l([...this.logs]));
  }

  private addLog(entry: Omit<ApiLogEntry, 'id' | 'timestamp'>): void {
    const fullEntry: ApiLogEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour12: false }),
    };
    this.logs.unshift(fullEntry);
    if (this.logs.length > 50) this.logs.pop();
    this.notifyLogs();
  }

  /**
   * Универсальный загрузчик с запасным вариантом mock
   */
  private async request<T>(
    endpointPath: string,
    options?: RequestInit,
    mockFallback?: T
  ): Promise<T> {
    const startTime = performance.now();
    const url = `${this.config.baseUrl.replace(/\/$/, '')}${endpointPath}`;
    const method = options?.method || 'GET';

    // Если принудительно включен режим mock
    if (this.config.isMockMode || !this.config.baseUrl) {
      await new Promise((r) => setTimeout(r, 120)); // Небольшая реалистичная задержка
      const durationMs = Math.round(performance.now() - startTime);
      this.addLog({
        method,
        url,
        status: 'MOCK',
        durationMs,
        responseSnippet: JSON.stringify(mockFallback).slice(0, 80) + '...',
        isMock: true,
      });
      return mockFallback as T;
    }

    // Попытка выполнить реальный HTTP-запрос
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);
      const durationMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      this.addLog({
        method,
        url,
        status: res.status,
        durationMs,
        responseSnippet: JSON.stringify(data).slice(0, 80) + '...',
        isMock: false,
      });
      return data as T;
    } catch (err: unknown) {
      const durationMs = Math.round(performance.now() - startTime);
      const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
      this.addLog({
        method,
        url,
        status: 'ERROR',
        durationMs,
        responseSnippet: `Fallback to mock due to error: ${errorMsg}`,
        isMock: true,
      });

      // Корректный переход к детерминированным тестовым данным, если они доступны
      if (mockFallback !== undefined) {
        return mockFallback;
      }
      throw err;
    }
  }

  // Параметризованные методы

  public async getIssueInfo(): Promise<IssueInfo> {
    const path = API_ENDPOINTS.getIssueInfo();
    return this.request<IssueInfo>(path, { method: 'GET' }, MOCK_ISSUE_INFO);
  }

  public async getFeaturedMatch(): Promise<Match> {
    const path = API_ENDPOINTS.getFeaturedMatch();
    return this.request<Match>(path, { method: 'GET' }, MOCK_FEATURED_MATCH);
  }

  public async getMatches(params?: MatchesFilterParams): Promise<{ total: number; matches: Match[] }> {
    const path = API_ENDPOINTS.getMatches(params);

    // Применение фильтрации к тестовым данным в режиме mock
    let filtered = [...MOCK_MATCHES];

    if (params?.sport && params.sport !== 'all') {
      filtered = filtered.filter((m) => m.sport === params.sport);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(q) ||
          m.awayTeam.name.toLowerCase().includes(q) ||
          m.league.toLowerCase().includes(q) ||
          m.homeTeam.city.toLowerCase().includes(q)
      );
    }

    // Ответ mock по умолчанию
    const mockResponse = {
      total: filtered.length,
      matches: filtered,
    };

    return this.request<{ total: number; matches: Match[] }>(path, { method: 'GET' }, mockResponse);
  }

  public async getMatchById(id: string): Promise<Match | null> {
    const path = API_ENDPOINTS.getMatchById(id);
    const found =
      id === MOCK_FEATURED_MATCH.id
        ? MOCK_FEATURED_MATCH
        : MOCK_MATCHES.find((m) => m.id === id) || null;

    return this.request<Match | null>(path, { method: 'GET' }, found);
  }
}
export const chuikaApi = new ChuikaApiClient();
