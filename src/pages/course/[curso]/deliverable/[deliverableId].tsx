import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ReactElement } from 'react';
import LearnPageLayout from '../../../../components/learn/LearnPageLayout';
import ui from '../../../../components/learn/ui.module.css';
import { deliverableDict } from '../../../../i18n/pages/deliverable';
import { useT } from '../../../../i18n/useT';
import type { NextPageWithLayout } from '../../../_app';

/* Where a student hands a deliverable in: /course/<course>/deliverable/<id>. The form only exists
   with JavaScript (the app is loaded in the browser and writes through the Firebase SDK), so without
   it the page shows the typing notice and nothing can be sent. */
const DeliverableApp = dynamic(() => import('../../../../components/deliverable/DeliverableApp'), { ssr: false });

const DeliverablePage: NextPageWithLayout = () => {
  const t = useT(deliverableDict);
  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
      </Head>
      <noscript>
        <p className={ui.error}>{t.telemetryWarning}</p>
      </noscript>
      <DeliverableApp />
    </>
  );
};

DeliverablePage.getLayout = (page: ReactElement) => <LearnPageLayout>{page}</LearnPageLayout>;

export default DeliverablePage;
