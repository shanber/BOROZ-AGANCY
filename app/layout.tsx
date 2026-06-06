import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BOROZ | منصة التسويق والنمو لتجار سلة',
  description: 'اطلب خدمات التسويق والتصميم والتطوير لمتجرك على سلة، وتابع التنفيذ والمشاريع من لوحة تحكم موحدة',
  keywords: ['سلة', 'بروز', 'BOROZ', 'خدمات تسويق', 'متاجر إلكترونية', 'نمو متجر'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0F172A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {/* NextAuth Session Provider will be added in (auth) layout */}
        {children}
      </body>
    </html>
  );
}
