import type { Timestamp } from 'firebase/firestore';
import type { Locale } from '../../i18n/locales';

export function percentText(correct: number, answered: number): string {
  if (answered === 0) return '–';
  return `${Math.round((correct / answered) * 100)}%`;
}

/** '24,5' in Spanish, '24.5' in English: a sum of whole and half days. */
export function scoreText(score: number, locale: Locale): string {
  return score.toLocaleString(locale, { maximumFractionDigits: 2 });
}

export function dateText(timestamp: Timestamp | null, locale: Locale, fallback: string): string {
  if (!timestamp) return fallback;
  return timestamp.toDate().toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
