import Link from 'next/link';
import type { ReactNode } from 'react';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import s from './EntriesCard.module.css';

export type CardEntry = {
  key: string;
  content: ReactNode;
};

type EntriesCardProps = {
  title: string;
  /** Over the entries, when the card lists one state of several ("Open homeworks"). */
  sectionLabel?: string;
  emptyText: string;
  /** Null while they load. */
  entries: CardEntry[] | null;
  /** The button under the entries, to the page with everything; both or neither. */
  allHref?: string;
  allText?: string;
};

/** A card of the course page or the homeworks page: its entries one under the other, split by
    lines, and the way to everything when the card shows only what is open. */
export default function EntriesCard({ title, sectionLabel, emptyText, entries, allHref, allText }: EntriesCardProps) {
  const t = useT(learnDict);

  return (
    <section className={s.card}>
      <span className={s.title}>{title}</span>
      <div className={s.section}>
        {sectionLabel && <span className={s.sectionLabel}>{sectionLabel}</span>}
        {entries === null ? (
          <span className={s.empty}>{t.loading}</span>
        ) : entries.length === 0 ? (
          <span className={s.empty}>{emptyText}</span>
        ) : (
          <ul className={s.entries}>
            {entries.map((entry) => (
              <li key={entry.key} className={s.entry}>
                {entry.content}
              </li>
            ))}
          </ul>
        )}
      </div>
      {allHref && allText && (
        <div className={s.actions}>
          <Link href={allHref} className={s.all}>
            {allText}
          </Link>
        </div>
      )}
    </section>
  );
}
