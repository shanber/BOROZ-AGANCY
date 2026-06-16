import type { Metadata, Viewport } from 'next';
import { Alexandria, Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/app/components/providers/AuthProvider';
import { LocaleProvider } from '@/app/components/i18n/LocaleProvider';
import { getLocaleFromCookie } from '@/app/lib/locale-server';
import { getDir } from '@/app/lib/i18n';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-latin-face',
  display: 'swap',
});

const alexandria = Alexandria({
  subsets: ['arabic'],
  variable: '--font-arabic-face',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BOROZ | بروز — منصة خبراء متاجر سلة',
  description: 'بروز منصة متخصصة تجمع تجار سلة بالخبراء ومقدمي الخدمات لتطوير المتاجر وتحسين النمو من مكان واحد',
  keywords: ['سلة', 'بروز', 'BOROZ', 'خدمات سلة', 'خبراء سلة', 'تطوير متاجر سلة'],
  icons: {
    icon: '/brand/favicon.svg'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocaleFromCookie();
  const dir = getDir(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={`${inter.variable} ${alexandria.variable}`}>
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
