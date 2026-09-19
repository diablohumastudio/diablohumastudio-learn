import { examDict } from '../../i18n/pages/exam';
import { useT } from '../../i18n/useT';
import s from './ConfirmPanel.module.css';

type ConfirmPanelProps = {
  message: string;
  detail?: string;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmPanel({ message, detail, confirmLabel, busy = false, onConfirm, onCancel }: ConfirmPanelProps) {
  const t = useT(examDict);
  return (
    <div className={s.panel} role="alertdialog" aria-label={message}>
      <p className={s.message}>{message}</p>
      {detail && <p className={s.detail}>{detail}</p>}
      <div className={s.actions}>
        <button type="button" className={s.confirm} onClick={onConfirm} disabled={busy}>
          {confirmLabel}
        </button>
        <button type="button" className={s.cancel} onClick={onCancel} disabled={busy}>
          {t.cancel}
        </button>
      </div>
    </div>
  );
}
