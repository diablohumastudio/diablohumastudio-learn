import { useRouter } from 'next/router';
import { LEARN_COURSES, practiceScope, querySlug } from '../../data/learn';
import type { PracticeScope } from '../../data/learn';
import { questionsInScope } from '../../data/practice';
import type { PracticeQuestion } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';

const SCOPE_VALUE_SEPARATOR: string = '/';
const OPTION_BULLET: string = '•\u00A0';
/* Native options ignore CSS padding and collapse plain spaces, so the classes are
   indented with non-breaking spaces to set them apart from the whole-course option. */
const CLASS_OPTION_INDENT: string = '\u00A0\u00A0\u00A0\u00A0';

type PracticeScopeSelectProps = {
  className?: string;
  /** When given, every option shows how many of these questions it holds. */
  questions?: readonly PracticeQuestion[];
  /** Builds the URL of the chosen scope, so the same select serves the home and the play screen. */
  pathOf: (scope: PracticeScope) => string;
};

function scopeValue(scope: PracticeScope): string {
  return [scope.courseSlug, scope.classSlug].filter(Boolean).join(SCOPE_VALUE_SEPARATOR);
}

function scopeFromValue(value: string): PracticeScope {
  const [courseSlug, classSlug] = value.split(SCOPE_VALUE_SEPARATOR);
  return practiceScope(courseSlug, classSlug);
}

export default function PracticeScopeSelect({ className, questions, pathOf }: PracticeScopeSelectProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const router = useRouter();
  const activeScope = practiceScope(querySlug(router.query.course), querySlug(router.query.class));

  function countText(scope: PracticeScope): string {
    return questions ? ` (${questionsInScope(questions, scope).length})` : '';
  }

  return (
    <select
      className={className}
      aria-label={t.scopeLabel}
      value={scopeValue(activeScope)}
      onChange={(event) => {
        router.push(pathOf(scopeFromValue(event.target.value)));
        event.target.blur();
      }}
    >
      <option value="">
        {OPTION_BULLET}
        {t.allCourses}
        {countText({})}
      </option>
      {LEARN_COURSES.map((course) => (
        <optgroup key={course.slug} label={course.title}>
          <option value={scopeValue({ courseSlug: course.slug })}>
            {OPTION_BULLET}
            {course.title} · {t.wholeCourse}
            {countText({ courseSlug: course.slug })}
          </option>
          {course.classes.map((learnClass) => {
            const classScope: PracticeScope = { courseSlug: course.slug, classSlug: learnClass.slug };
            return (
              <option key={learnClass.slug} value={scopeValue(classScope)}>
                {CLASS_OPTION_INDENT}
                {OPTION_BULLET}
                {learnClass.title[locale]}
                {countText(classScope)}
              </option>
            );
          })}
        </optgroup>
      ))}
    </select>
  );
}
