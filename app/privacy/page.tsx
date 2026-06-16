import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocaleFromCookie } from '@/app/lib/locale-server';
import { t as dict } from '@/app/lib/i18n';
import LanguageToggle from '@/app/components/i18n/LanguageToggle';

export const metadata: Metadata = {
  title: 'BOROZ — Privacy Policy | سياسة الخصوصية',
  description: 'BOROZ platform privacy policy.',
};

export default function PrivacyPage() {
  const locale = getLocaleFromCookie();
  const t = dict[locale].legal.privacy;
  const tc = dict[locale].common;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="absolute top-4 inset-inline-end-4 z-10">
        <LanguageToggle variant="compact" />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[#06B6D4] hover:text-[#0891B2] transition-colors">
          {tc.backHome}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">{t.title}</h1>
        <div className="space-y-6 text-sm leading-8 text-slate-600">
          <p>{t.lastUpdated}</p>

          {t.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-slate-900 mb-3">{section.h}</h2>

              {'body' in section && section.body && <p>{section.body}</p>}

              {'items' in section && section.items && (
                <ul className="list-disc pr-5 ltr:pl-5 ltr:pr-0 space-y-2 mt-2">
                  {section.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}

              {'isContact' in section && section.isContact && (
                <p>
                  {t.contactLabel}{' '}
                  <a
                    href={`mailto:${tc.contactEmail}`}
                    className="text-[#06B6D4] hover:underline"
                  >
                    {tc.contactEmail}
                  </a>
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
