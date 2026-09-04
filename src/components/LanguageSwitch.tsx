import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { DEFAULT_LOCALE, LOCALES, isLocale } from '../i18n/locales';
import type { Locale } from '../i18n/locales';
import { useT } from '../i18n/useT';
import s from './LanguageSwitch.module.css';

const COOKIE_MAX_AGE_SECONDS: number = 60 * 60 * 24 * 365;

const en = {
  label: 'Language',
} as const;

const es: Record<keyof typeof en, string> = {
  label: 'Idioma',
};

const dict = { en, es };

// Next.js reads NEXT_LOCALE when someone lands on `/`, so the explicit choice
// survives across visits; inside a visit the locale already travels in the URL.
function rememberLocale(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export default function LanguageSwitch({ className }: { className?: string }) {
  const router = useRouter();
  const t = useT(dict);
  const activeLocale = isLocale(router.locale) ? router.locale : DEFAULT_LOCALE;

  return (
    <nav className={className ? `${s.switch} ${className}` : s.switch} aria-label={t.label}>
      {LOCALES.map((locale, index) => (
        <Fragment key={locale}>
          {index > 0 && (
            <span className={s.separator} aria-hidden="true">
              /
            </span>
          )}
          <Link
            href={router.asPath}
            locale={locale}
            lang={locale}
            className={locale === activeLocale ? s.active : s.option}
            aria-current={locale === activeLocale ? 'true' : undefined}
            onClick={() => rememberLocale(locale)}
          >
            {locale}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
