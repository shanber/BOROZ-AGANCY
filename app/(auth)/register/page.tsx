import Link from 'next/link';
import { Store, UserCircle2, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '@/app/components/ui/BrandLogo';
import { getLocaleFromCookie } from '@/app/lib/locale-server';
import { t as dict } from '@/app/lib/i18n';
import LanguageToggle from '@/app/components/i18n/LanguageToggle';

export const metadata = {
  title: 'BOROZ | بروز',
  description: 'Choose your account type and start your journey on BOROZ.',
};

export default function RegisterHubPage() {
  const locale = getLocaleFromCookie();
  const t = dict[locale].auth.hub;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      {/* Language toggle (top corner — flips with dir) */}
      <div className="absolute top-4 inset-inline-end-4">
        <LanguageToggle variant="compact" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8">
            <BrandLogo width={100} height={40} className="h-10 w-auto object-contain mx-auto" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.title}</h1>
          <p className="text-slate-600 text-lg">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Merchant */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex flex-col h-full hover:border-[#06B6D4] hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4] opacity-[0.05] rounded-bl-full group-hover:opacity-[0.1] transition-opacity" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)', color: '#06B6D4' }}>
                <Store className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t.merchantTitle}</h2>
            </div>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{t.merchantDesc}</p>
            <Link
              href="/register/merchant"
              className="w-full py-4 px-6 bg-[#06B6D4] hover:bg-[#0891B2] text-white rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-2"
            >
              {t.merchantCta}
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
          </div>

          {/* Provider */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex flex-col h-full hover:border-[#22C55E] hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E] opacity-[0.05] rounded-bl-full group-hover:opacity-[0.1] transition-opacity" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>
                <UserCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t.providerTitle}</h2>
            </div>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{t.providerDesc}</p>
            <Link
              href="/register/provider"
              className="w-full py-4 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-2"
            >
              {t.providerCta}
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">{t.hasAccount}</p>
          <Link
            href="/login"
            className="inline-flex py-3 px-8 border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-medium transition-colors"
          >
            {t.loginLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
