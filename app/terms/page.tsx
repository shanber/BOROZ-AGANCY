import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocaleFromCookie } from '@/app/lib/locale-server';
import { t as dict } from '@/app/lib/i18n';
import LanguageToggle from '@/app/components/i18n/LanguageToggle';

export const metadata: Metadata = {
  title: 'BOROZ — Terms of Service | شروط الاستخدام',
  description: 'BOROZ platform terms of service.',
};

export default function TermsPage() {
  const locale = getLocaleFromCookie();
  const t = dict[locale].legal.terms;
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

              {/* Plain paragraph */}
              {'body' in section && section.body && <p>{section.body}</p>}

              {/* Definitions list (ul with strong:value pairs) */}
              {'list' in section && section.list && (
                <ul className="list-disc pr-5 ltr:pl-5 ltr:pr-0 space-y-2">
                  {section.list.map((row, j) => (
                    <li key={j}>
                      <strong>{row.strong}</strong> {row.text}
                    </li>
                  ))}
                </ul>
              )}

              {/* Contact section */}
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
