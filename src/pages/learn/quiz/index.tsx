import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';
import QuizLayout from '../../../components/quiz/QuizLayout';
import type { NextPageWithLayout } from '../../_app';

// Firebase is browser-only: the app is skipped on the server and its bundle
// is downloaded only by this route.
const QuizApp = dynamic(() => import('../../../components/quiz/QuizApp'), { ssr: false });

const QuizPage: NextPageWithLayout = () => <QuizApp />;

QuizPage.getLayout = (page: ReactElement) => <QuizLayout>{page}</QuizLayout>;

export default QuizPage;
