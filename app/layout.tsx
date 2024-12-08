import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
  adjustFontFallback: false,
  preload: true,
});

export const metadata: Metadata = {
  title: 'Binder',
  description: 'tbd',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="light"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}