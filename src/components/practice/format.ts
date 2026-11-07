import type { Timestamp } from 'firebase/firestore';
import { dayText, homeworkState } from '../../data/practice';
import type { Homework } from '../../data/practice';
import type { Locale } from '../../i18n/locales';
import type { practiceDict } from '../../i18n/pages/practice';

export type PracticeTexts = Record<keyof typeof practiceDict.en, string>;

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

/** 'Thu, Oct 1 – Mon, Oct 5': the days of a specific homework. */
export function homeworkDaysText(homework: Homework, locale: Locale): string {
  return `${dayText(homework.firstDay, locale)} – ${dayText(homework.lastDay, locale)}`;
}

export function homeworkStatusText(homework: Homework, today: string, t: PracticeTexts): string {
  const state = homeworkState(homework, today);
  if (state === 'open') return t.homeworkOpen;
  return state === 'upcoming' ? t.homeworkUpcoming : t.homeworkFinished;
}

export function dateText(timestamp: Timestamp | null, locale: Locale, fallback: string): string {
  if (!timestamp) return fallback;
  return timestamp.toDate().toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
