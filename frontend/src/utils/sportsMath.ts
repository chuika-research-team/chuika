import { OutcomeType, Probabilities } from '../api/types';

/**
 * Нормализует вероятности так, чтобы их сумма была ровно 100%.
 */
export function normalizeProbabilities(prob: Probabilities): { p1: number; draw: number; p2: number } {
  const p1 = Math.max(0, prob.p1 || 0);
  const draw = Math.max(0, prob.draw || 0);
  const p2 = Math.max(0, prob.p2 || 0);
  const sum = p1 + draw + p2;

  if (sum === 0) {
    return { p1: 33, draw: 34, p2: 33 };
  }

  const factor = 100 / sum;
  const normP1 = Math.round(p1 * factor);
  const normP2 = Math.round(p2 * factor);
  const normDraw = Math.max(0, 100 - normP1 - normP2);

  return {
    p1: normP1,
    draw: normDraw,
    p2: normP2,
  };
}

/**
 * Рассчитывает справедливый десятичный коэффициент из процента вероятности (0–100).
 */
export function calculateImpliedOdds(probabilityPercentage: number, marginPercent: number = 0): number {
  if (probabilityPercentage <= 0) return 99.0;
  const p = probabilityPercentage / 100;
  const fairOdds = 1 / p;
  const adjustedOdds = fairOdds * (1 - marginPercent / 100);
  return Number(Math.max(1.01, adjustedOdds).toFixed(2));
}

/**
 * Возвращает понятную русскую подпись исхода.
 */
export function getOutcomeLabel(outcome: OutcomeType, sport?: string): string {
  switch (outcome) {
    case 'P1':
      return 'ПОБЕДА 1';
    case 'X':
      return sport === 'hockey' ? 'НИЧЬЯ В ОСН. ВРЕМЯ' : 'НИЧЬЯ';
    case 'P2':
      return 'ПОБЕДА 2';
    default:
      return outcome;
  }
}

/**
 * Возвращает запасной монограмный вариант из названия команды.
 */
export function getTeamMonogram(teamName: string): string {
  if (!teamName) return '?';
  const clean = teamName.trim();
  const words = clean.split(/\s+/);
  if (words.length > 1 && words[0].length > 0 && words[1].length > 0) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return clean[0].toUpperCase();
}
