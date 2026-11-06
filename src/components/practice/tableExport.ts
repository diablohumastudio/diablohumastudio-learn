import type { Locale } from '../../i18n/locales';

/* Tables the teacher takes to a spreadsheet: tab-separated for the clipboard, which a paste
   splits into cells, and files in CSV or TSV. A Spanish spreadsheet reads the decimal comma,
   so the Spanish CSV separates with semicolons, the way Excel does in that region. */

export type ExportFormat = 'csv' | 'tsv';

const TAB: string = '\t';
const COMMA: string = ',';
const SEMICOLON: string = ';';
const LINE_BREAK: string = '\r\n';
const DOUBLE_QUOTE: string = '"';
/** Tells Excel the file is UTF-8; without it the accents of the names come out garbled. */
const UTF8_BOM: string = '﻿';
const MIME_TYPES: Record<ExportFormat, string> = { csv: 'text/csv', tsv: 'text/tab-separated-values' };
/** Locales whose decimal mark is the comma: their CSV separates with semicolons. */
const DECIMAL_COMMA_LOCALES: readonly Locale[] = ['es'];
/** Safari may still be reading the blob when the click returns. */
const REVOKE_DELAY_MS: number = 1000;

function csvSeparator(locale: Locale): string {
  return DECIMAL_COMMA_LOCALES.includes(locale) ? SEMICOLON : COMMA;
}

function separatorOf(format: ExportFormat, locale: Locale): string {
  return format === 'tsv' ? TAB : csvSeparator(locale);
}

function quoted(field: string, separator: string): string {
  const needsQuotes = field.includes(separator) || field.includes(DOUBLE_QUOTE) || /[\r\n]/.test(field);
  if (!needsQuotes) return field;
  return `${DOUBLE_QUOTE}${field.split(DOUBLE_QUOTE).join(DOUBLE_QUOTE + DOUBLE_QUOTE)}${DOUBLE_QUOTE}`;
}

export function delimitedText(rows: readonly string[][], format: ExportFormat, locale: Locale): string {
  const separator = separatorOf(format, locale);
  return rows.map((row) => row.map((field) => quoted(field, separator)).join(separator)).join(LINE_BREAK) + LINE_BREAK;
}

export function downloadTable(fileName: string, rows: readonly string[][], format: ExportFormat, locale: Locale): void {
  const blob = new Blob([UTF8_BOM + delimitedText(rows, format, locale)], { type: `${MIME_TYPES[format]};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${fileName}.${format}`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}

export function copyTable(rows: readonly string[][], locale: Locale): Promise<void> {
  return navigator.clipboard.writeText(delimitedText(rows, 'tsv', locale));
}

/** 'Práctica de Octubre' → 'practica-de-octubre': a title as part of a file name. */
export function fileSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
