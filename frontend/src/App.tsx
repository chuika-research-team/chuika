import React, { useState, useEffect, useCallback } from 'react';
import { 
  SportCategory, 
  PeriodFilter, 
  Match, 
  IssueInfo, 
  ApiConfig 
} from './api/types';
import { chuikaApi } from './api/client';
import { MOCK_ISSUE_INFO, MOCK_FEATURED_MATCH } from './api/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { EditorialIntro } from './components/EditorialIntro';
import { FilterBar } from './components/FilterBar';
import { FeaturedMatch } from './components/FeaturedMatch';
import { MatchFeed } from './components/MatchFeed';
import { OutcomesLegend } from './components/OutcomesLegend';
import { EditorialNotice } from './components/EditorialNotice';
import { Footer } from './components/Footer';
import { MatchModal } from './components/MatchModal';
import { ApiDrawer } from './components/ApiDrawer';

export default function App() {
  const [issueInfo, setIssueInfo] = useState<IssueInfo>(MOCK_ISSUE_INFO);
  const [featuredMatch, setFeaturedMatch] = useState<Match>(MOCK_FEATURED_MATCH);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeSport, setActiveSport] = useState<SportCategory>('all');
  const [activePeriod, setActivePeriod] = useState<PeriodFilter>('today');
  const [selectedDate, setSelectedDate] = useState<string>('24 ОКТЯБРЯ');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<Match | null>(null);
  const [isApiDrawerOpen, setIsApiDrawerOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(chuikaApi.getConfig());
  const [isLoading, setIsLoading] = useState(false);

  // Подписка на изменения конфигурации API-клиента
  useEffect(() => {
    const unsub = chuikaApi.subscribe(() => {
      setApiConfig(chuikaApi.getConfig());
    });
    return unsub;
  }, []);

  // Загрузка сведений о выпуске и главном матче
  const loadInitialData = useCallback(async () => {
    try {
      const [issue, featured] = await Promise.all([
        chuikaApi.getIssueInfo(),
        chuikaApi.getFeaturedMatch(),
      ]);
      setIssueInfo(issue);
      setFeaturedMatch(featured);
    } catch {
      // Запасные варианты обрабатываются внутри клиента
    }
  }, []);

  // Загрузка матчей с учетом параметризованных фильтров
  const loadMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await chuikaApi.getMatches({
        sport: activeSport,
        period: activePeriod,
        search: searchQuery,
      });
      setMatches(response.matches);
    } catch {
      // Обрабатывается внутри клиента
    } finally {
      setIsLoading(false);
    }
  }, [activeSport, activePeriod, searchQuery]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleUpdateConfig = (newConfig: Partial<ApiConfig>) => {
    chuikaApi.updateConfig(newConfig);
  };

  const handleRefreshAll = () => {
    loadInitialData();
    loadMatches();
  };

  // Определение необходимости показа главного матча на основе фильтра видов спорта
  const isFeaturedMatchVisible = 
    activeSport === 'all' || activeSport === featuredMatch.sport;

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-[#111111] flex flex-col font-sans selection:bg-[#C8372D] selection:text-white">
      
      {/* Первая полоса, сведения о выпуске, логотип, печать */}
      <Header
        issueInfo={issueInfo}
        onOpenApiDrawer={() => setIsApiDrawerOpen(true)}
        isMockMode={apiConfig.isMockMode}
      />

      {/* Рубрики, часовой пояс, кнопка OpenAPI */}
      <Navigation
        activeSport={activeSport}
        onSelectSport={(sport) => setActiveSport(sport)}
        timezone={issueInfo.timezone}
        onOpenApiDrawer={() => setIsApiDrawerOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        
        {/* Редакционный заголовок и обещание продукта */}
        <EditorialIntro
          headline="Вечер больших дерби и вероятности исходов от нашей аналитической модели"
          introText={issueInfo.subMotto}
        />

        {/* Виды спорта, период, календарь, поиск */}
        <FilterBar
          activeSport={activeSport}
          onSelectSport={(sport) => setActiveSport(sport)}
          activePeriod={activePeriod}
          onSelectPeriod={(period) => setActivePeriod(period)}
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        {/* Матч дня */}
        {isFeaturedMatchVisible && (
          <FeaturedMatch
            match={featuredMatch}
            onOpenAnalysis={(m) => setSelectedMatchForModal(m)}
          />
        )}

        {/* Лента матчей в газетных колонках */}
        <MatchFeed
          matches={matches}
          onOpenAnalysis={(m) => setSelectedMatchForModal(m)}
          isLoading={isLoading}
        />

        {/* Пояснение исходов П1, X, П2 */}
        <OutcomesLegend />

        {/* Как устроен прогноз */}
        <EditorialNotice />

      </main>

      {/* Выходные данные, подписка, ссылки */}
      <Footer
        onOpenApiDrawer={() => setIsApiDrawerOpen(true)}
        isMockMode={apiConfig.isMockMode}
      />

      {/* Досье матча */}
      <MatchModal
        match={selectedMatchForModal}
        onClose={() => setSelectedMatchForModal(null)}
        baseUrl={apiConfig.baseUrl}
      />

      {/* API параметры & OpenAPI контракт */}
      <ApiDrawer
        isOpen={isApiDrawerOpen}
        onClose={() => setIsApiDrawerOpen(false)}
        config={apiConfig}
        onUpdateConfig={handleUpdateConfig}
        onRefreshData={handleRefreshAll}
      />

    </div>
  );
}
