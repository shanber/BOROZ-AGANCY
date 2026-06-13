import type { Metadata, Viewport } from 'next';
import './globals.css';
import AuthProvider from '@/app/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'BOROZ | بروز — منصة خبراء متاجر سلة',
  description: 'بروز منصة متخصصة تجمع تجار سلة بالخبراء ومقدمي الخدمات لتطوير المتاجر وتحسين النمو من مكان واحد',
  keywords: ['سلة', 'بروز', 'BOROZ', 'خدمات سلة', 'خبراء سلة', 'تطوير متاجر سلة'],
  icons: {
    icon: '/favicon.svg'
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
  return (
    // Apply the CSS variable to html so every child can use it
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Tajawal + Inter — operational UI stack for BOROZ execution workspace. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
