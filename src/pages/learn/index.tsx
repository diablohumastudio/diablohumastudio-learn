import type { GetServerSideProps } from 'next';
import { LEARN_COURSES, classPath, latestClass } from '../../data/learn';

export const getServerSideProps: GetServerSideProps = async () => {
  const course = LEARN_COURSES[0];
  return {
    redirect: {
      destination: classPath(course, latestClass(course)),
      permanent: false,
    },
  };
};

export default function LearnIndex() {
  return null;
}
