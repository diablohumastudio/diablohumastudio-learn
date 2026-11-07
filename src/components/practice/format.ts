import type { Timestamp } from 'firebase/firestore';
import type { Locale } from '../../i18n/locales';

export function percentText(correct: number, answered: number): string {
  if (answered === 0) return '–';
  return `${Math.round((correct / answered) * 100)}%`;
}

const FIRST_SURNAME_INDEX: number = 2;

/** 'Brenda Celeste Salazar Daza' → 'Brenda Salazar': the first word and the third, where the
    first surname sits after two given names; with three words the third is a surname either
    way; with two, both; with one, that one. */
export function shortName(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 2) return words.join(' ');
  return `${words[0]} ${words[FIRST_SURNAME_INDEX]}`;
}

/** '24,5' in Spanish, '24.5' in English: a sum of whole and half days. */
export function scoreText(score: number, locale: Locale): string {
  return score.toLocaleString(locale, { maximumFractionDigits: 2 });
}

export function dateText(timestamp: Timestamp | null, locale: Locale, fallback: string): string {
  if (!timestamp) return fallback;
  return timestamp.toDate().toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
