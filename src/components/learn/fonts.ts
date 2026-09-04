import { Archivo, Big_Shoulders_Display, IBM_Plex_Mono } from 'next/font/google';

const displayFont = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-disp',
});

const bodyFont = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const LEARN_FONT_VARS = `${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`;
