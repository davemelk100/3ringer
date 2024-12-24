import { Roboto } from 'next/font/google';

export const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export const openSansCondensed = Roboto({ 
  subsets: ['latin'],
  weight: ['900'],
  display: 'swap',
  variable: '--font-open-sans-condensed',
});