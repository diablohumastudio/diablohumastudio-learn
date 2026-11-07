import { isDeliverableRunning } from '../../data/deliverable/types';
import type { Deliverable, DeliverableKind, DeliverableRole } from '../../data/deliverable/types';
import type { Locale } from '../../i18n/locales';
import type { deliverableDict } from '../../i18n/pages/deliverable';

export type DeliverableTexts = Record<keyof typeof deliverableDict.en, string>;

const PAD_WIDTH: number = 2;
const SECONDS_PER_MINUTE: number = 60;
const SECONDS_PER_HOUR: number = 3600;

function pad(value: number): string {
  return String(value).padStart(PAD_WIDTH, '0');
}

export function roleText(role: DeliverableRole, t: DeliverableTexts): string {
  return role === 'exam' ? t.roleExam : t.roleHomework;
}

export function roleSectionText(role: DeliverableRole, t: DeliverableTexts): string {
  return role === 'exam' ? t.examsSection : t.homeworksSection;
}

export function kindText(kind: DeliverableKind, t: DeliverableTexts): string {
  if (kind === 'repo') return t.kindRepo;
  return kind === 'docLink' ? t.kindDocLink : t.kindText;
}

export function statusText(deliverable: Deliverable, nowMs: number, t: DeliverableTexts): string {
  if (deliverable.status === 'draft') return t.statusDraft;
  return isDeliverableRunning(deliverable, nowMs) ? t.stateRunning : t.stateFinished;
}

/** 'YYYY-MM-DDTHH:mm' in the device's own time zone: what `<input type="datetime-local">` holds. */
export function toDateTimeLocal(ms: number): string {
  const date = new Date(ms);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeLocal(value: string): number | null {
  if (value === '') return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

/** '07:05 p. m.' or '19:05', by locale. */
export function timeText(ms: number, locale: Locale): string {
  return new Date(ms).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

/** '04:10', or '1:04:10' from an hour on. */
export function elapsedText(totalSeconds: number): string {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(rounded / SECONDS_PER_HOUR);
  const minutes = Math.floor((rounded % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = rounded % SECONDS_PER_MINUTE;
  const minutesAndSeconds = `${pad(minutes)}:${pad(seconds)}`;
  return hours > 0 ? `${hours}:${minutesAndSeconds}` : minutesAndSeconds;
}
