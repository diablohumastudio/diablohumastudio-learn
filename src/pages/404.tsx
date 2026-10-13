import type { ReactElement } from 'react';
import LearnPageLayout from '../components/learn/LearnPageLayout';
import NotFound from '../components/learn/NotFound';
import type { NextPageWithLayout } from './_app';

const NotFoundPage: NextPageWithLayout = () => <NotFound />;

NotFoundPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default NotFoundPage;
