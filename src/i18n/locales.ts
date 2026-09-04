// Keep in sync with the `i18n` block of next.config.js (it cannot import this file).
export const LOCALES = ['en', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const SITE_URL: string = 'https://diablohumastudio.com';

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

/** Prefixes a site path with the locale segment; the default locale has no prefix. */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}
