import { useEffect, useState } from 'react';
import type { Deliverable } from '../../data/deliverable/types';
import type { LearnCourse } from '../../data/learn';
import { subscribeStudentDeliverables } from '../deliverable/deliverables';
import { useNowMs } from '../deliverable/useNowMs';
import ExamsCard from './ExamsCard';
import HomeworksCard from './HomeworksCard';

const STATE_TICK_MS: number = 1000;

/** The Homeworks and Exams cards of an enrolled student: what is open right now, and the way to
    everything. The deliverables are read once here, since each card lists those of its role. */
export default function EnrolledCards({ course, uid }: { course: LearnCourse; uid: string }) {
  const nowMs = useNowMs(STATE_TICK_MS);
  const [deliverables, setDeliverables] = useState<Deliverable[] | null>(null);

  useEffect(
    () =>
      subscribeStudentDeliverables(course.slug, uid, setDeliverables, (error) => {
        // Refused until firebase/firestore.rules names the collection: then there is simply nothing to list.
        console.warn('Could not load the deliverables', error);
        setDeliverables([]);
      }),
    [course.slug, uid]
  );

  return (
    <>
      <HomeworksCard course={course} uid={uid} deliverables={deliverables} nowMs={nowMs} />
      <ExamsCard course={course} uid={uid} deliverables={deliverables} nowMs={nowMs} />
    </>
  );
}
