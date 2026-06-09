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
  themeColor: '#0B132B',
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
        <meta name="theme-color" content="#0B132B" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
