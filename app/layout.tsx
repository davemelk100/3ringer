import type { Metadata } from 'next';
import { roboto, openSansCondensed } from '@/lib/config/fonts';
import { RootProvider } from '@/components/providers/root-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Weekly schedule management application',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#0D324D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${openSansCondensed.variable} font-sans antialiased`}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}