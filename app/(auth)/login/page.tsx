'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { BrandLogo } from '@/app/components/ui/BrandLogo';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import PhoneInput from '@/app/components/ui/PhoneInput';
import { getCountryByCode, normalizePhoneNumber } from '@/app/lib/phone';
import { useLocale } from '@/app/components/i18n/LocaleProvider';
import LanguageToggle from '@/app/components/i18n/LanguageToggle';

type LoginMethod = 'email' | 'phone';

export default function LoginPage() {
  const router = useRouter();
  const { t: dict } = useLocale();
  const t = dict.auth.login;
  const tAuth = dict.auth;

  const [method, setMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('SA');
  const [localPhone, setLocalPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password) {
      setError(t.errors.passwordRequired);
      return;
    }

    let identifier = '';
    if (method === 'email') {
      if (!email.trim()) {
        setError(t.errors.emailRequired);
        return;
      }
      identifier = email.trim();
    } else {
      const dialCode = getCountryByCode(countryCode).dialCode;
      const e164 = normalizePhoneNumber(dialCode, localPhone);
      if (!e164) {
        setError(t.errors.phoneInvalid);
        return;
      }
      identifier = e164;
    }

    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier,
        password,
      });

      if (res?.error) {
        setIsLoading(false);
        if (res.error === 'Configuration' || res.error === 'AccessDenied') {
          setError(t.errors.config);
        } else if (res.error === 'تم تعطيل حسابك') {
          setError(t.errors.accountDisabled);
        } else {
          // Unified message for bad credentials / unknown identifier
          setError(t.errors.invalidCredentials);
        }
        return;
      }

      setSuccess(t.success);
      setIsLoading(false);

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);
    } catch (err) {
      setIsLoading(false);
      setError(t.errors.generic);
    }
  };

  const tabBase =
    'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors';
  const tabActive = 'bg-[#6D5DFB] text-white shadow-sm';
  const tabInactive = 'text-slate-600 hover:bg-slate-100';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="absolute top-4 inset-inline-end-4 z-10">
        <LanguageToggle variant="compact" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo width={100} height={40} className="h-10 w-auto object-contain" />
          </div>
          <p className="text-slate-500 text-sm">{tAuth.tagline}</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-start">{t.title}</h1>
          <p className="text-slate-500 mb-6 text-start text-sm">{t.subtitle}</p>

          {/* Method Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMethod('email'); setError(''); }}
              className={`${tabBase} ${method === 'email' ? tabActive : tabInactive}`}
            >
              {t.emailTab}
            </button>
            <button
              type="button"
              onClick={() => { setMethod('phone'); setError(''); }}
              className={`${tabBase} ${method === 'phone' ? tabActive : tabInactive}`}
            >
              {t.phoneTab}
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {method === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2 text-start">{t.emailLabel}</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-start text-slate-900 placeholder-slate-400"
                  />
                  <Mail size={18} className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2 text-start">{t.phoneLabel}</label>
                <PhoneInput
                  countryCode={countryCode}
                  onCountryChange={setCountryCode}
                  value={localPhone}
                  onChange={setLocalPhone}
                  placeholder="5xxxxxxxx"
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-start">{t.passwordLabel}</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-start text-slate-900 placeholder-slate-400"
                />
                <Lock size={18} className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-[#6D5DFB] hover:underline">
                {t.forgotPassword}
              </Link>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span className="text-sm text-slate-600">{t.rememberMe}</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6D5DFB] hover:bg-[#4F46E5] disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {isLoading ? t.submitting : t.submit}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            {t.noAccount}{' '}
            <Link href="/register" className="text-[#6D5DFB] font-semibold hover:underline">
              {t.createAccount}
            </Link>
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-slate-400 text-xs mt-6">{tAuth.copyright}</p>
      </div>
    </div>
  );
}
