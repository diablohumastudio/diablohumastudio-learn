import type { GetServerSideProps } from 'next';
import { INCINE_COURSES, latestClass } from '../../data/incine';

export const getServerSideProps: GetServerSideProps = async () => {
  const course = INCINE_COURSES[0];
  return {
    redirect: {
      destination: `/incine/${course.slug}/${latestClass(course).slug}`,
      permanent: false,
    },
  };
};

export default function IncineIndex() {
  return null;
}
