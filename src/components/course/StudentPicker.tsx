import { useState } from 'react';
import { memberName } from '../../data/course/types';
import { courseDict } from '../../i18n/pages/course';
import { useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import s from './StudentPicker.module.css';
import { useCourseMembers } from './useCourseMembers';

type StudentPickerProps = {
  courseSlug: string;
  everyone: boolean;
  assignedUids: string[];
  onChange: (everyone: boolean, assignedUids: string[]) => void;
};

/** Who a homework, an exam or a deliverable is for: everybody enrolled in the course, or a tick
    per enrolled student, found by name or email. Teacher only, since it lists the members. The
    caller keys it by course, so another course starts the list over. */
export default function StudentPicker({ courseSlug, everyone, assignedUids, onChange }: StudentPickerProps) {
  const t = useT(courseDict);
  const members = useCourseMembers(courseSlug);
  const [search, setSearch] = useState('');
  const needle = search.trim().toLowerCase();
  const shown = (members ?? []).filter(
    (member) => needle === '' || memberName(member).toLowerCase().includes(needle) || member.email.toLowerCase().includes(needle)
  );

  function toggle(uid: string): void {
    onChange(false, assignedUids.includes(uid) ? assignedUids.filter((other) => other !== uid) : [...assignedUids, uid]);
  }

  return (
    <div className={ui.field}>
      <span className={ui.label}>{t.studentsLabel}</span>
      <label className={s.check}>
        <input type="checkbox" checked={everyone} onChange={(event) => onChange(event.target.checked, assignedUids)} />
        {t.everyoneLabel}
      </label>
      {!everyone && (
        <>
          <input
            className={ui.input}
            type="search"
            placeholder={t.searchStudents}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {members === null ? (
            <span className={ui.mono}>{t.loading}</span>
          ) : members.length === 0 ? (
            <span className={ui.mono}>{t.pickerNoMembers}</span>
          ) : (
            <ul className={s.studentList}>
              {shown.map((member) => (
                <li key={member.uid}>
                  <label className={s.studentItem}>
                    <input type="checkbox" checked={assignedUids.includes(member.uid)} onChange={() => toggle(member.uid)} />
                    {memberName(member)} <span className={s.studentEmail}>{member.email}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <span className={ui.mono}>{t.assignedCount.replace('{count}', String(assignedUids.length))}</span>
        </>
      )}
    </div>
  );
}
