import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isDeliverableRunning } from '../../data/deliverable/types';
import type { Deliverable, DeliverableRole } from '../../data/deliverable/types';
import { findCourse, teacherDeliverableNewPath, teacherDeliverablePath } from '../../data/learn';
import { deliverableDict } from '../../i18n/pages/deliverable';
import { useLocale, useT } from '../../i18n/useT';
import { dateTimeYearText, dayMonthText } from '../exam/format';
import ui from '../learn/ui.module.css';
import s from './DeliverableSection.module.css';
import { subscribeAllDeliverables } from './deliverables';
import { kindText, roleSectionText, statusText } from './format';
import { useNowMs } from './useNowMs';

const STATUS_TICK_MS: number = 1000;

/** Teacher only: the deliverables of one role, listed under the homeworks or the exams, with
    their own New button. A row opens the deliverable's page. */
export default function DeliverableSection({ role }: { role: DeliverableRole }) {
  const t = useT(deliverableDict);
  const locale = useLocale();
  const router = useRouter();
  const nowMs = useNowMs(STATUS_TICK_MS);
  const [deliverables, setDeliverables] = useState<Deliverable[] | null>(null);
  const [failed, setFailed] = useState(false);
  const rows = (deliverables ?? []).filter((deliverable) => deliverable.role === role);

  useEffect(
    () =>
      subscribeAllDeliverables(setDeliverables, (error) => {
        console.error('Could not load the deliverables', error);
        setFailed(true);
      }),
    []
  );

  return (
    <section className={s.section}>
      <div className={s.head}>
        <h2 className={s.title}>{roleSectionText(role, t)}</h2>
        <button type="button" className={s.primary} onClick={() => void router.push(teacherDeliverableNewPath(role))}>
          + {role === 'exam' ? t.newExam : t.newHomework}
        </button>
      </div>
      <div className={s.card}>
        {failed ? (
          <p className={s.error}>{t.loadError}</p>
        ) : deliverables === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : rows.length === 0 ? (
          <p className={s.empty}>{t.noDeliverables}</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={s.list}>
              <thead>
                <tr>
                  <th className={s.titleCell} title={t.colTitle}>
                    {t.colTitle}
                  </th>
                  <th className={s.courseCell} title={t.colCourse}>
                    {t.colCourse}
                  </th>
                  <th className={s.kindCell} title={t.colKind}>
                    {t.colKind}
                  </th>
                  <th className={s.statusCell} title={t.colStatus}>
                    {t.colStatus}
                  </th>
                  <th className={s.dateCell} title={t.colClosesAt}>
                    {t.colClosesAt}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((deliverable) => {
                  const courseTitle = findCourse(deliverable.courseSlug)?.title ?? deliverable.courseSlug;
                  const status = statusText(deliverable, nowMs, t);
                  const running = isDeliverableRunning(deliverable, nowMs);
                  return (
                    <tr
                      key={deliverable.id}
                      className={s.row}
                      onClick={() => void router.push(teacherDeliverablePath(deliverable.id))}
                    >
                      <td className={s.titleCell} title={deliverable.title}>
                        {deliverable.title}
                      </td>
                      <td className={s.courseCell} title={courseTitle}>
                        {courseTitle}
                      </td>
                      <td className={s.kindCell} title={kindText(deliverable.kind, t)}>
                        {kindText(deliverable.kind, t)}
                      </td>
                      <td className={s.statusCell} title={status}>
                        {running ? <span className={s.running}>{status}</span> : status}
                      </td>
                      {/* The planned close while it runs; the real one once it is over, since closing early moves it. */}
                      <td className={s.dateCell} title={dateTimeYearText(deliverable.closesAtMs, locale)}>
                        <span className={s.dateLong}>{dateTimeYearText(deliverable.closesAtMs, locale)}</span>
                        <span className={s.dateShort}>{dayMonthText(deliverable.closesAtMs, locale)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
