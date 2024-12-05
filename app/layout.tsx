import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
  adjustFontFallback: false, // Disable automatic font fallback adjustment
  preload: true,
});

export const metadata: Metadata = {
  title: 'Next.js Application',
  description: 'Modern Next.js application with best practices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}