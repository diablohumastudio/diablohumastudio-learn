import { Fragment } from 'react';
import type { LearnCourse, LearnTopic } from '../../data/learn';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';

type TopicGroupProps = {
  label: string;
  topics: readonly LearnTopic[];
};

function TopicGroup({ label, topics }: TopicGroupProps) {
  const locale = useLocale();
  if (topics.length === 0) return null;
  return (
    <optgroup label={label}>
      {topics.map((topic) => (
        <option key={topic.slug} value={topic.slug}>
          {topic.title[locale]}
        </option>
      ))}
    </optgroup>
  );
}

/** The options of a topic dropdown: per course, a group with its classes and a group with its
    readings, each option valued with the topic's slug. The select that holds them adds its own
    first options ("no topic", "all"…). */
export default function TopicOptions({ courses }: { courses: readonly LearnCourse[] }) {
  const t = useT(practiceDict);
  return (
    <>
      {courses.map((course) => (
        <Fragment key={course.slug}>
          <TopicGroup label={`${course.title} · ${t.topicGroupClasses}`} topics={course.classes} />
          <TopicGroup label={`${course.title} · ${t.topicGroupReadings}`} topics={course.readings} />
        </Fragment>
      ))}
    </>
  );
}
