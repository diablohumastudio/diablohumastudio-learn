import Link from 'next/link';
import type { Locale } from '../../i18n/locales';
import { dateTimeText } from '../exam/format';
import s from './ItemList.module.css';

/** One row of a course's exams or homeworks list: its title, where it opens, and its state. */
export type ListItem = {
  key: string;
  href: string;
  title: string;
  /** "Running · ends at 9:30", "Finished · 5 Oct"… */
  state: string;
  isRunning: boolean;
};

/** The words of a state text, from the dictionary of the item's kind. */
export type StateTexts = { running: string; finished: string; endsAt: string };

/** "Running · ends at 5 Oct, 09:30" while it runs, "Finished · 5 Oct, 09:30" afterwards: the
    state of an exam or a deliverable, which close at a moment. */
export function closeStateText(running: boolean, closesAtMs: number | null, texts: StateTexts, locale: Locale): string {
  const when = dateTimeText(closesAtMs, locale);
  return running ? `${texts.running} · ${texts.endsAt} ${when}` : `${texts.finished} · ${when}`;
}

/** The rows of the exams page and the homeworks page: a row per item, like a menu, with the
    state at the right; a row opens the item's own page. */
export default function ItemList({ items }: { items: readonly ListItem[] }) {
  return (
    <nav className={s.list}>
      {items.map((item) => (
        <Link key={item.key} href={item.href} className={s.item}>
          {item.title}
          <span className={item.isRunning ? s.running : s.finished}>{item.state}</span>
        </Link>
      ))}
    </nav>
  );
}
