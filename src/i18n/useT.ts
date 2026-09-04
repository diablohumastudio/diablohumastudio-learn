import { useRouter } from 'next/router';
import { DEFAULT_LOCALE, isLocale } from './locales';
import type { Locale } from './locales';

/** One value per locale; type the `en` object first and derive the others from its keys. */
export type Dictionary<T> = Record<Locale, T>;

export function useT<T>(dictionary: Dictionary<T>): T {
  const { locale } = useRouter();
  return dictionary[isLocale(locale) ? locale : DEFAULT_LOCALE];
}
