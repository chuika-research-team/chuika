import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProbabilities, calculateImpliedOdds, getTeamMonogram, getOutcomeLabel } from './sportsMath';
import { API_ENDPOINTS } from '../api/config';

test('normalizeProbabilities sums to 100%', () => {
  const result = normalizeProbabilities({ p1: 46, draw: 28, p2: 26 });
  assert.equal(result.p1 + result.draw + result.p2, 100);
  assert.equal(result.p1, 46);
  assert.equal(result.draw, 28);
  assert.equal(result.p2, 26);
});

test('normalizeProbabilities handles 2-way sports with no draw', () => {
  const result = normalizeProbabilities({ p1: 58, p2: 42 });
  assert.equal(result.p1 + result.draw + result.p2, 100);
  assert.equal(result.p1, 58);
  assert.equal(result.p2, 42);
  assert.equal(result.draw, 0);
});

test('calculateImpliedOdds computes decimal odds correctly', () => {
  // Справедливая вероятность 50% = 2.00
  assert.equal(calculateImpliedOdds(50), 2.0);
  // Справедливая вероятность 25% = 4.00
  assert.equal(calculateImpliedOdds(25), 4.0);
});

test('getTeamMonogram extracts clean letters', () => {
  assert.equal(getTeamMonogram('Арсенал'), 'А');
  assert.equal(getTeamMonogram('Реал Мадрид'), 'РМ');
  assert.equal(getTeamMonogram('Манчестер Сити'), 'МС');
});

test('getOutcomeLabel returns standard Russian editorial terms', () => {
  assert.equal(getOutcomeLabel('P1'), 'ПОБЕДА 1');
  assert.equal(getOutcomeLabel('X'), 'НИЧЬЯ');
  assert.equal(getOutcomeLabel('P2'), 'ПОБЕДА 2');
});

test('API_ENDPOINTS parameterizes query string and paths correctly', () => {
  assert.equal(API_ENDPOINTS.getIssueInfo(), '/issue/current');
  assert.equal(API_ENDPOINTS.getFeaturedMatch(), '/matches/featured');
  assert.equal(API_ENDPOINTS.getMatchById('match-123'), '/matches/match-123');
  
  // Тест параметров запроса
  const urlWithParams = API_ENDPOINTS.getMatches({
    sport: 'football',
    period: 'today',
    search: 'Реал',
    limit: 10,
  });
  assert.ok(urlWithParams.includes('/matches?'));
  assert.ok(urlWithParams.includes('sport=football'));
  assert.ok(urlWithParams.includes('period=today'));
  assert.ok(urlWithParams.includes('q=%D0%A0%D0%B5%D0%B0%D0%BB'));
  assert.ok(urlWithParams.includes('limit=10'));
});
