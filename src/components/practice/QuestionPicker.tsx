import { useEffect, useRef, useState } from 'react';
import { LEARN_COURSES, findCourse } from '../../data/learn';
import { questionTopicTitle, questionsWithIds } from '../../data/practice';
import type { PracticeQuestion } from '../../data/practice';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import ui from '../learn/ui.module.css';
import { useClassSlides } from '../learn/useClassSlides';
import s from './QuestionPicker.module.css';

type QuestionPickerProps = {
  courseSlug: string;
  /** The ticked questions: the only thing the picker edits besides the course. */
  questionIds: readonly string[];
  onChange: (courseSlug: string, questionIds: string[]) => void;
  /** Active questions to choose from; exam-only ones are offered only when they are here. */
  questions: readonly PracticeQuestion[];
};

/** What the dropdown narrows the list to; the text search narrows it further. */
type GroupFilter =
  | { kind: 'course' }
  | { kind: 'courseNoSlide' }
  | { kind: 'class'; classSlug: string }
  | { kind: 'classNoSlide'; classSlug: string }
  | { kind: 'slide'; classSlug: string; slideId: string }
  | { kind: 'examOnly' };

/** Narrows the list by whether a question is ticked: the way to review what an exam holds. */
type TickFilter = 'all' | 'selected' | 'notSelected';

const TICK_FILTERS: TickFilter[] = ['all', 'selected', 'notSelected'];
const COURSE_FILTER_VALUE: string = 'course';
const COURSE_NO_SLIDE_FILTER_VALUE: string = 'courseNoSlide';
const EXAM_ONLY_FILTER_VALUE: string = 'examOnly';
const CLASS_FILTER_PREFIX: string = 'class:';
const CLASS_NO_SLIDE_FILTER_PREFIX: string = 'classNoSlide:';
const SLIDE_FILTER_PREFIX: string = 'slide:';
/** Slugs and slide ids never hold a slash. */
const SLIDE_FILTER_SEPARATOR: string = '/';
/* Native options ignore CSS padding and collapse plain spaces, so the slides are
   indented with non-breaking spaces to set them apart from their class. */
const SLIDE_OPTION_INDENT: string = '    ';

function filterOfValue(value: string): GroupFilter {
  if (value === COURSE_NO_SLIDE_FILTER_VALUE) return { kind: 'courseNoSlide' };
  if (value.startsWith(CLASS_NO_SLIDE_FILTER_PREFIX)) {
    return { kind: 'classNoSlide', classSlug: value.slice(CLASS_NO_SLIDE_FILTER_PREFIX.length) };
  }
  if (value.startsWith(CLASS_FILTER_PREFIX)) return { kind: 'class', classSlug: value.slice(CLASS_FILTER_PREFIX.length) };
  if (value.startsWith(SLIDE_FILTER_PREFIX)) {
    const [classSlug, slideId] = value.slice(SLIDE_FILTER_PREFIX.length).split(SLIDE_FILTER_SEPARATOR);
    return { kind: 'slide', classSlug, slideId };
  }
  return value === EXAM_ONLY_FILTER_VALUE ? { kind: 'examOnly' } : { kind: 'course' };
}

function matchesTickFilter(isTicked: boolean, tickFilter: TickFilter): boolean {
  if (tickFilter === 'all') return true;
  return tickFilter === 'selected' ? isTicked : !isTicked;
}

function hasNoSlide(question: PracticeQuestion): boolean {
  return (question.slides ?? []).length === 0;
}

function isInGroup(question: PracticeQuestion, filter: GroupFilter): boolean {
  if (filter.kind === 'course') return true;
  if (filter.kind === 'courseNoSlide') return hasNoSlide(question);
  if (filter.kind === 'examOnly') return Boolean(question.examOnly);
  if (question.topic !== filter.classSlug) return false;
  if (filter.kind === 'class') return true;
  return filter.kind === 'classNoSlide' ? hasNoSlide(question) : Boolean(question.slides?.includes(filter.slideId));
}

/** The question list is what gets saved; the filter decides which questions "Select all" ticks. */
export default function QuestionPicker({ courseSlug, questionIds, onChange, questions }: QuestionPickerProps) {
  const t = useT(practiceDict);
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState(COURSE_FILTER_VALUE);
  const [tickFilter, setTickFilter] = useState<TickFilter>('all');
  const selectAllRef = useRef<HTMLInputElement>(null);
  const course = findCourse(courseSlug);
  const classSlugs = course?.classes.map((learnClass) => learnClass.slug) ?? [];
  const slidesByClass = useClassSlides(classSlugs);

  // Exam-only questions may have no class, so they are offered in every course.
  const courseQuestions = questions.filter(
    (question) => question.examOnly || (question.topic !== undefined && classSlugs.includes(question.topic))
  );
  const hasExamOnly = courseQuestions.some((question) => question.examOnly);
  const tickFilterTexts: Record<TickFilter, string> = {
    all: t.pickerTickAll,
    selected: t.pickerTickSelected,
    notSelected: t.pickerTickNotSelected,
  };
  const needle = search.trim().toLowerCase();
  const shownQuestions = courseQuestions.filter(
    (question) =>
      isInGroup(question, filterOfValue(filterValue)) &&
      matchesTickFilter(questionIds.includes(question.id), tickFilter) &&
      (needle === '' ||
        question.id.toLowerCase().includes(needle) ||
        question.prompt[locale].toLowerCase().includes(needle))
  );
  const shownIds = shownQuestions.map((question) => question.id);
  const shownTickedCount = shownIds.filter((id) => questionIds.includes(id)).length;
  const areAllShownTicked = shownIds.length > 0 && shownTickedCount === shownIds.length;
  const areSomeShownTicked = shownTickedCount > 0 && !areAllShownTicked;

  // `indeterminate` exists only as a DOM property, not as an attribute React can set.
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = areSomeShownTicked;
  }, [areSomeShownTicked]);

  function setTicked(ids: readonly string[], isTicking: boolean) {
    const others = questionIds.filter((id) => !ids.includes(id));
    onChange(courseSlug, isTicking ? [...others, ...ids] : others);
  }

  return (
    <div className={s.picker}>
      <label className={ui.field}>
        <span className={ui.label}>{t.colCourse}</span>
        <select
          className={s.select}
          value={courseSlug}
          // The questions belong to a course: another course starts with none ticked.
          onChange={(event) => {
            setFilterValue(COURSE_FILTER_VALUE);
            onChange(event.target.value, []);
          }}
        >
          {LEARN_COURSES.map((candidate) => (
            <option key={candidate.slug} value={candidate.slug}>
              {candidate.title}
            </option>
          ))}
        </select>
      </label>

      <fieldset className={s.group}>
        <legend className={ui.label}>{t.pickerQuestions}</legend>

        <div className={s.filter}>
          <span className={ui.label}>{t.pickerFilter}</span>
          <select
            className={s.select}
            aria-label={t.pickerFilterByGroup}
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
          >
            <option value={COURSE_FILTER_VALUE}>{t.pickerWholeCourse}</option>
            <option value={COURSE_NO_SLIDE_FILTER_VALUE}>{t.pickerCourseNoSlide}</option>
            {course?.classes.map((learnClass) => (
              <optgroup key={learnClass.slug} label={learnClass.title[locale]}>
                <option value={`${CLASS_FILTER_PREFIX}${learnClass.slug}`}>
                  {learnClass.title[locale]} · {t.pickerWholeClass}
                </option>
                <option value={`${CLASS_NO_SLIDE_FILTER_PREFIX}${learnClass.slug}`}>
                  {learnClass.title[locale]} · {t.pickerClassNoSlide}
                </option>
                {(slidesByClass[learnClass.slug] ?? []).map((slide) => (
                  <option
                    key={slide.id}
                    value={`${SLIDE_FILTER_PREFIX}${learnClass.slug}${SLIDE_FILTER_SEPARATOR}${slide.id}`}
                  >
                    {SLIDE_OPTION_INDENT}
                    {slide.title[locale]}
                  </option>
                ))}
              </optgroup>
            ))}
            {hasExamOnly && <option value={EXAM_ONLY_FILTER_VALUE}>{t.examOnlyTag}</option>}
          </select>
          <select
            className={s.select}
            aria-label={t.pickerFilterBySelected}
            value={tickFilter}
            onChange={(event) => setTickFilter(event.target.value as TickFilter)}
          >
            {TICK_FILTERS.map((candidate) => (
              <option key={candidate} value={candidate}>
                {tickFilterTexts[candidate]}
              </option>
            ))}
          </select>
          <input
            className={s.search}
            type="search"
            placeholder={t.pickerSearch}
            aria-label={t.pickerSearch}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            // The picker sits inside a form: Enter here must not save the exam.
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.preventDefault();
            }}
          />
        </div>

        <label className={shownIds.length === 0 ? s.selectAllEmpty : s.selectAll}>
          <input
            ref={selectAllRef}
            type="checkbox"
            checked={areAllShownTicked}
            disabled={shownIds.length === 0}
            onChange={() => setTicked(shownIds, !areAllShownTicked)}
          />
          <span>
            {t.pickerSelectAll}{' '}
            <span className={ui.mono}>
              ({shownTickedCount}/{shownIds.length})
            </span>
          </span>
        </label>

        <div className={s.questionList}>
          {shownQuestions.length === 0 ? (
            <span className={ui.mono}>{t.pickerNoMatches}</span>
          ) : (
            shownQuestions.map((question) => (
              <label key={question.id} className={s.question}>
                <input
                  type="checkbox"
                  checked={questionIds.includes(question.id)}
                  onChange={(event) => setTicked([question.id], event.target.checked)}
                />
                <span className={s.questionId}>{question.id}</span>
                <span className={s.questionText}>
                  {question.prompt[locale]}
                  <span className={ui.mono}>
                    {' '}
                    · {question.examOnly ? t.examOnlyTag : questionTopicTitle(question, locale) ?? t.noClass}
                  </span>
                </span>
              </label>
            ))
          )}
        </div>
      </fieldset>

      <span className={s.total}>
        {questionsWithIds(courseQuestions, questionIds).length} {t.pickerSelected}
      </span>
    </div>
  );
}
