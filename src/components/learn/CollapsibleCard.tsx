import { useState } from 'react';
import type { ReactNode } from 'react';
import s from './CollapsibleCard.module.css';

type CollapsibleCardProps = {
  title: string;
  /** Beside the title, visible while the card is closed: what is inside in a few words. */
  summary?: string;
  /** The course page shows every section closed, as its title row, until the student opens it. */
  defaultOpen?: boolean;
  children: ReactNode;
};

/** A card whose title row opens and closes its body. */
export default function CollapsibleCard({ title, summary, defaultOpen = false, children }: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={s.card}>
      <button type="button" className={s.header} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span className={s.title}>{title}</span>
        {summary && <span className={s.summary}>{summary}</span>}
        <span className={s.chevron} aria-hidden="true">
          {isOpen ? '▴' : '▾'}
        </span>
      </button>
      {isOpen && <div className={s.body}>{children}</div>}
    </section>
  );
}
