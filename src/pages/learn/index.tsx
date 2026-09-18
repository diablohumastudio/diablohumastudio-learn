import type { ReactElement } from 'react';
import CourseList from '../../components/learn/CourseList';
import LearnPageLayout from '../../components/learn/LearnPageLayout';
import type { NextPageWithLayout } from '../_app';

const LearnIndexPage: NextPageWithLayout = () => <CourseList />;

LearnIndexPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default LearnIndexPage;
