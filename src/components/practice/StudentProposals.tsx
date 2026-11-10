import type { User } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { coursePath } from '../../data/learn';
import type { LearnCourse } from '../../data/learn';
import { questionTopicTitle } from '../../data/practice';
import { proposalText } from '../../data/practice/proposal';
import type { ProposalContent, ProposalStatus, QuestionProposal } from '../../data/practice/proposal';
import { practiceDict } from '../../i18n/pages/practice';
import { useLocale, useT } from '../../i18n/useT';
import { isFirebaseConfigured } from '../../lib/firebase';
import NotEnrolledNotice from '../course/NotEnrolledNotice';
import { useMembership } from '../course/useMembership';
import { dateTimeYearText } from '../exam/format';
import SignInRedirect from '../learn/SignInRedirect';
import ui from '../learn/ui.module.css';
import { createProposal, subscribeOwnProposals } from './proposals';
import { QuestionForm } from './QuestionEditor';
import s from './StudentProposals.module.css';

type Texts = Record<keyof typeof practiceDict.en, string>;

const STATUS_CLASS_NAMES: Record<ProposalStatus, string> = {
  pending: s.statusPending,
  accepted: s.statusAccepted,
  rejected: s.statusRejected,
};

function statusText(status: ProposalStatus, t: Texts): string {
  if (status === 'pending') return t.proposalStatusPending;
  return status === 'accepted' ? t.proposalStatusAccepted : t.proposalStatusRejected;
}

/** What the decision left for the student to read: the id in the bank, or why it was rejected. */
function decisionText(proposal: QuestionProposal, t: Texts): string | null {
  if (proposal.status === 'accepted' && proposal.questionId) {
    return t.proposalAcceptedAs.replace('{id}', proposal.questionId);
  }
  if (proposal.status === 'rejected' && proposal.reason) {
    return t.proposalRejectedReason.replace('{reason}', proposal.reason);
  }
  return null;
}

function ProposalsTable({ proposals }: { proposals: readonly QuestionProposal[] }) {
  const t = useT(practiceDict);
  const locale = useLocale();

  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>{t.colQuestion}</th>
            <th>{t.colTopic}</th>
            <th>{t.colSent}</th>
            <th>{t.colStatus}</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => {
            const decision = decisionText(proposal, t);
            return (
              <tr key={proposal.id}>
                <td>{proposalText(proposal.prompt, locale)}</td>
                <td>{questionTopicTitle(proposal, locale) ?? ''}</td>
                <td className={s.sent}>{dateTimeYearText(proposal.createdAtMs, locale)}</td>
                <td>
                  <span className={STATUS_CLASS_NAMES[proposal.status]}>{statusText(proposal.status, t)}</span>
                  {decision && <span className={s.decision}>{decision}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type ProposalsPageProps = {
  course: LearnCourse;
  user: User;
  /** The teacher ticked "Proposes questions" on this student's membership. */
  canPropose: boolean;
};

function ProposalsPage({ course, user, canPropose }: ProposalsPageProps) {
  const t = useT(practiceDict);
  const [proposals, setProposals] = useState<QuestionProposal[] | null>(null);
  const [hasLoadFailed, setHasLoadFailed] = useState(false);
  const [isProposing, setIsProposing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setProposals(null);
    setHasLoadFailed(false);
    return subscribeOwnProposals(course.slug, user.uid, setProposals, (error) => {
      console.error('Could not load the proposals', error);
      setHasLoadFailed(true);
    });
  }, [course.slug, user.uid]);

  async function sendProposal(content: ProposalContent): Promise<void> {
    await createProposal(course.slug, user, content);
    setNotice(t.proposalSentNotice);
    setIsProposing(false);
  }

  function openForm(): void {
    setNotice(null);
    setIsProposing(true);
  }

  // The form stays open if the permission is withdrawn meanwhile: sending is then refused by the
  // rules and the form says so, instead of throwing away what the student wrote.
  if (isProposing) {
    return (
      <QuestionForm
        mode={{ kind: 'proposal', course, onPropose: sendProposal }}
        editing={null}
        onBack={() => setIsProposing(false)}
      />
    );
  }

  return (
    <div className={s.wrap}>
      <Link href={coursePath(course)} className={ui.backLink}>
        ← {t.backToCourse}
      </Link>
      <div className={s.heading}>
        <span className={ui.eyebrow}>{course.title}</span>
        <h1 className={ui.title}>{t.proposalsTitle}</h1>
        <p className={ui.lede}>{t.proposalsLede}</p>
      </div>
      <div className={s.toolbar}>
        {canPropose ? (
          <button type="button" className={s.primary} onClick={openForm}>
            + {t.newProposal}
          </button>
        ) : (
          <p className={ui.error}>{t.proposalNotAllowed}</p>
        )}
        {notice && <span className={ui.notice}>{notice}</span>}
      </div>
      <div className={s.card}>
        {hasLoadFailed ? (
          <p className={s.loadError}>{t.proposalsLoadError}</p>
        ) : proposals === null ? (
          <p className={s.empty}>{t.loading}</p>
        ) : proposals.length === 0 ? (
          <p className={s.empty}>{t.noProposals}</p>
        ) : (
          <ProposalsTable proposals={proposals} />
        )}
      </div>
    </div>
  );
}

/** The signed-in student's own question proposals for a course's bank, with what the teacher
    decided on each, and the form to send a new one when the teacher allows it (docs/practice.md). */
export default function StudentProposals({ course }: { course: LearnCourse }) {
  const t = useT(practiceDict);
  const membership = useMembership(course.slug);

  if (!isFirebaseConfigured()) {
    return (
      <div className={ui.centered}>
        <p className={ui.error}>{t.notConfigured}</p>
      </div>
    );
  }
  if (membership.status === 'loading') {
    return (
      <div className={ui.centered}>
        <span className={ui.mono}>{t.loading}</span>
      </div>
    );
  }
  if (membership.status === 'signedOut' || !membership.user) return <SignInRedirect />;
  if (membership.status !== 'member') return <NotEnrolledNotice course={course} />;
  return <ProposalsPage course={course} user={membership.user} canPropose={membership.canProposeQuestions} />;
}
