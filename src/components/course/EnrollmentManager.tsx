import Link from 'next/link';
import { useEffect, useState } from 'react';
import { memberName } from '../../data/course/types';
import type { AccessRequest, CourseMember } from '../../data/course/types';
import { LEARN_COURSES, TEACHER_PATH } from '../../data/learn';
import { courseDict } from '../../i18n/pages/course';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import ConfirmPanel from '../exam/ConfirmPanel';
import { dateTimeYearText } from '../exam/format';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { useAuthUser } from '../learn/useAuthUser';
import { useTeacherStatus } from '../learn/useTeacherStatus';
import { CourseSelect } from '../practice/PeriodControls';
import { byDisplayName, fetchAllStudents } from '../practice/progress';
import type { StudentStats } from '../practice/progress';
import s from './EnrollmentManager.module.css';
import {
  addMember,
  deleteRequest,
  enrollAll,
  removeMember,
  setCanProposeQuestions,
  subscribeRequests,
} from './members';
import type { AccountIdentity } from './members';
import { memberUids, useCourseMembers } from './useCourseMembers';

type Confirming = { kind: 'remove'; member: CourseMember } | { kind: 'enrollAll' } | null;

function identityOfStudent(student: StudentStats): AccountIdentity {
  return { uid: student.uid, displayName: student.displayName, email: student.email };
}

function Enrollment() {
  const t = useT(courseDict);
  const locale = useLocale();
  const auth = useAuthUser();
  const [courseSlug, setCourseSlug] = useState(LEARN_COURSES[0].slug);
  const members = useCourseMembers(courseSlug);
  const [requests, setRequests] = useState<AccessRequest[] | null>(null);
  const [students, setStudents] = useState<StudentStats[] | null>(null);
  const [pickedUid, setPickedUid] = useState('');
  const [confirming, setConfirming] = useState<Confirming>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const enrolled = memberUids(members);
  const notEnrolled = (students ?? []).filter((student) => !enrolled.has(student.uid));
  const teacherUid = auth.status === 'signedIn' ? auth.user.uid : '';

  useEffect(() => {
    setRequests(null);
    return subscribeRequests(courseSlug, setRequests, (error) => {
      console.warn('Could not load the requests', error);
      setRequests([]);
    });
  }, [courseSlug]);

  useEffect(() => {
    fetchAllStudents()
      .then((loaded) => setStudents([...loaded].sort(byDisplayName)))
      .catch((error) => console.error('Could not load the students', error));
  }, []);

  async function run(action: () => Promise<void>, doneNotice: string | null = null): Promise<void> {
    setBusy(true);
    setMessage(null);
    setNotice(null);
    try {
      await action();
      if (doneNotice) setNotice(doneNotice);
    } catch (error) {
      console.error('Enrollment action failed', error);
      setMessage(t.errorGeneric);
    } finally {
      setBusy(false);
      setConfirming(null);
    }
  }

  function addPicked(): void {
    const student = (students ?? []).find((candidate) => candidate.uid === pickedUid);
    if (!student) return;
    void run(async () => {
      await addMember(courseSlug, identityOfStudent(student), teacherUid);
      setPickedUid('');
    });
  }

  function enrollEverybody(): void {
    const accounts = (students ?? []).map(identityOfStudent);
    void run(async () => {
      const count = await enrollAll(courseSlug, accounts, enrolled);
      setNotice(t.enrolledNotice.replace('{count}', String(count)));
    });
  }

  return (
    <div className={s.wrap}>
      <Link href={TEACHER_PATH} className={ui.backLink}>
        ← {t.backToTeacher}
      </Link>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{t.courseLabel}</span>
        <h1 className={ui.title}>{t.enrollmentTitle}</h1>
      </div>
      <CourseSelect courseSlug={courseSlug} onChange={setCourseSlug} />

      {message && <p className={ui.error}>{message}</p>}
      {notice && <p className={ui.notice}>{notice}</p>}

      <section className={s.section}>
        <h2 className={s.sectionTitle}>{t.pendingRequests}</h2>
        <div className={s.card}>
          {requests === null ? (
            <p className={s.empty}>{t.loading}</p>
          ) : requests.length === 0 ? (
            <p className={s.empty}>{t.noRequests}</p>
          ) : (
            <div className={ui.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>{t.colStudent}</th>
                    <th>{t.colRequestedAt}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.uid}>
                      <td>
                        <span className={s.name}>{memberName(request)}</span>
                        <span className={s.email}>{request.email}</span>
                      </td>
                      <td>{dateTimeYearText(request.requestedAtMs, locale)}</td>
                      <td>
                        <div className={s.rowActions}>
                          <button
                            type="button"
                            className={s.smallPrimary}
                            disabled={busy}
                            onClick={() => void run(() => addMember(courseSlug, request, teacherUid))}
                          >
                            {t.accept}
                          </button>
                          <button
                            type="button"
                            className={s.danger}
                            disabled={busy}
                            onClick={() => void run(() => deleteRequest(courseSlug, request.uid))}
                          >
                            {t.reject}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>{t.members}</h2>
          {members !== null && <span className={ui.mono}>{t.membersCount.replace('{count}', String(members.length))}</span>}
        </div>
        {confirming?.kind === 'remove' && (
          <ConfirmPanel
            message={t.confirmRemove.replace('{name}', memberName(confirming.member))}
            confirmLabel={t.confirmRemoveButton}
            busy={busy}
            onConfirm={() => void run(() => removeMember(courseSlug, confirming.member.uid))}
            onCancel={() => setConfirming(null)}
          />
        )}
        <div className={s.card}>
          {members === null ? (
            <p className={s.empty}>{t.loading}</p>
          ) : members.length === 0 ? (
            <p className={s.empty}>{t.noMembers}</p>
          ) : (
            <div className={ui.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>{t.colStudent}</th>
                    <th>{t.colSince}</th>
                    <th>{t.colGrantedBy}</th>
                    <th>{t.colCanPropose}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.uid}>
                      <td>
                        <span className={s.name}>{memberName(member)}</span>
                        <span className={s.email}>{member.email}</span>
                      </td>
                      <td>{dateTimeYearText(member.joinedAtMs, locale)}</td>
                      <td className={ui.mono}>
                        {member.grantedBy === 'enroll-all' ? t.grantedByEnrollAll : member.grantedBy === teacherUid ? '✓' : member.grantedBy}
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          className={s.checkbox}
                          checked={member.canProposeQuestions}
                          disabled={busy}
                          aria-label={`${t.colCanPropose}: ${memberName(member)}`}
                          onChange={(event) =>
                            void run(() => setCanProposeQuestions(courseSlug, member.uid, event.target.checked))
                          }
                        />
                      </td>
                      <td>
                        <div className={s.rowActions}>
                          <button
                            type="button"
                            className={s.danger}
                            disabled={busy}
                            onClick={() => setConfirming({ kind: 'remove', member })}
                          >
                            {t.remove}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>{t.addRegistered}</h2>
        <p className={ui.mono}>{t.addRegisteredHint}</p>
        <div className={s.addRow}>
          <label className={s.pickerField}>
            <span className={ui.label}>{t.colStudent}</span>
            <select className={s.select} value={pickedUid} onChange={(event) => setPickedUid(event.target.value)}>
              <option value="">{t.pickAccount}</option>
              {notEnrolled.map((student) => (
                <option key={student.uid} value={student.uid}>
                  {student.displayName || student.email} · {student.email}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className={s.primary} onClick={addPicked} disabled={busy || pickedUid === ''}>
            {t.add}
          </button>
        </div>
        {confirming?.kind === 'enrollAll' ? (
          <ConfirmPanel
            message={t.confirmEnrollAll}
            confirmLabel={t.confirmEnrollAllButton}
            busy={busy}
            onConfirm={enrollEverybody}
            onCancel={() => setConfirming(null)}
          />
        ) : (
          <button
            type="button"
            className={s.small}
            onClick={() => setConfirming({ kind: 'enrollAll' })}
            disabled={busy || students === null || notEnrolled.length === 0}
          >
            {t.enrollAll.replace('{count}', String(notEnrolled.length))}
          </button>
        )}
      </section>
    </div>
  );
}

/** Teacher only: who is enrolled in each course, who is asking, and the way to enroll accounts. */
export default function EnrollmentManager() {
  const t = useT(courseDict);
  const teacherStatus = useTeacherStatus();

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  if (teacherStatus === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (teacherStatus === 'signedOut') return <SignInRedirect />;
  if (teacherStatus === 'notTeacher') {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notAuthorized}</p>
      </div>
    );
  }
  return <Enrollment />;
}
