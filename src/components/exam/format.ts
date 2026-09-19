import type { examDict } from '../../i18n/pages/exam';
import type { Locale } from '../../i18n/locales';
import { ExamRequestError } from './exams';

const MS_PER_SECOND: number = 1000;
const SECONDS_PER_MINUTE: number = 60;

export type ExamTexts = Record<keyof typeof examDict.en, string>;

/** '07:05'; never negative. */
export function countdownText(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / MS_PER_SECOND));
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function durationText(totalSeconds: number): string {
  return countdownText(totalSeconds * MS_PER_SECOND);
}

export function dateTimeText(ms: number | null, locale: Locale): string {
  if (ms === null) return '–';
  return new Date(ms).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function examErrorText(error: unknown, t: ExamTexts): string {
  if (!(error instanceof ExamRequestError)) return t.errorGeneric;
  if (error.code === 'network') return t.errorNetwork;
  if (error.code === 'anotherExamRunning') return t.errorAnotherExamRunning;
  if (error.code === 'noQuestions') return t.errorNoQuestions;
  if (error.code === 'notRunning') return t.errorNotRunning;
  if (error.code === 'notTeacher') return t.notAuthorized;
  if (error.code === 'serverNotConfigured') return t.errorServerNotConfigured;
  return t.errorGeneric;
}
