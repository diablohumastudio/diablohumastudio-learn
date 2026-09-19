import { useEffect, useRef, useState } from 'react';
import { learnDict } from '../../i18n/learn';
import { useT } from '../../i18n/useT';
import LanguageSwitch from '../LanguageSwitch';
import {
  MAX_QUESTION_SECONDS,
  MIN_QUESTION_SECONDS,
  clampQuestionSeconds,
  saveQuestionSeconds,
  useQuestionSeconds,
} from '../practice/practiceSettings';
import s from './ConfigDialog.module.css';
import ui from './ui.module.css';

export default function ConfigDialog({ onClose }: { onClose: () => void }) {
  const t = useT(learnDict);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const questionSeconds = useQuestionSeconds();
  // Text while typing: clamping each keystroke would turn the "1" of "15" into the minimum.
  const [secondsText, setSecondsText] = useState(String(questionSeconds));

  // A native modal dialog brings Esc, focus trapping and the backdrop by itself.
  useEffect(() => {
    const configDialog = dialogRef.current;
    if (configDialog && !configDialog.open) configDialog.showModal();
  }, []);

  function commitQuestionSeconds() {
    const seconds = clampQuestionSeconds(Number(secondsText));
    saveQuestionSeconds(seconds);
    setSecondsText(String(seconds));
  }

  function commitAndClose() {
    commitQuestionSeconds();
    onClose();
  }

  return (
    <dialog ref={dialogRef} className={s.dialog} onClose={commitAndClose}>
      <h2 className={s.title}>{t.config}</h2>

      <div className={s.setting}>
        <span className={ui.label}>{t.languageLabel}</span>
        <LanguageSwitch className={s.languageSwitch} />
      </div>

      <label className={s.setting}>
        <span className={ui.label}>{t.questionTimeLabel}</span>
        <span className={s.secondsField}>
          <input
            className={s.secondsInput}
            type="number"
            inputMode="numeric"
            min={MIN_QUESTION_SECONDS}
            max={MAX_QUESTION_SECONDS}
            step={1}
            value={secondsText}
            onChange={(event) => setSecondsText(event.target.value)}
            onBlur={commitQuestionSeconds}
          />
          <span className={ui.mono}>
            {t.secondsUnit} · {MIN_QUESTION_SECONDS}–{MAX_QUESTION_SECONDS}
          </span>
        </span>
      </label>

      <form method="dialog" className={s.actions}>
        <button type="submit" className={ui.btnPrimary}>
          {t.closeConfig}
        </button>
      </form>
    </dialog>
  );
}
