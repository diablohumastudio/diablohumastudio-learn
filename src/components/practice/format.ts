import type { Timestamp } from 'firebase/firestore';
import type { Locale } from '../../i18n/locales';

export function percentText(correct: number, answered: number): string {
  if (answered === 0) return '–';
  return `${Math.round((correct / answered) * 100)}%`;
}

export function dateText(timestamp: Timestamp | null, locale: Locale, fallback: string): string {
  if (!timestamp) return fallback;
  return timestamp.toDate().toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
