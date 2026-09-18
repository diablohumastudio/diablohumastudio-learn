import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../components/learn/LearnPageLayout';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import type { NextPageWithLayout } from '../_app';

const SignInGate = dynamic(() => import('../../components/learn/SignInGate'), { ssr: false });

const SignInPage: NextPageWithLayout = () => {
  const t = useT(learnDict);
  return (
    <>
      <Head>
        <title>{t.signInPageTitle}</title>
      </Head>
      <SignInGate />
    </>
  );
};

SignInPage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default SignInPage;
