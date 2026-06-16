'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/app/components/ui/BrandLogo';
import PhoneInput from '@/app/components/ui/PhoneInput';
import { getCountryByCode, normalizePhoneNumber } from '@/app/lib/phone';
import { useLocale } from '@/app/components/i18n/LocaleProvider';
import LanguageToggle from '@/app/components/i18n/LanguageToggle';

export default function ForgotPasswordPage() {
  const { t: dict } = useLocale();
  const t = dict.auth.forgot;

  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('SA');
  const [localPhone, setLocalPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError(t.errors.emailRequired);
      return;
    }

    const dialCode = getCountryByCode(countryCode).dialCode;
    const normalizedPhone = normalizePhoneNumber(dialCode, localPhone);
    if (!normalizedPhone) {
      setError(t.errors.phoneInvalid);
      return;
    }

    if (!newPassword) {
      setError(t.errors.newPasswordRequired);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.errors.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: normalizedPhone,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.errors.generic);
      }

      setSuccess(data.message || t.success);
      setEmail('');
      setLocalPhone('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || t.errors.generic);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="absolute top-4 inset-inline-end-4 z-10">
        <LanguageToggle variant="compact" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo width={100} height={40} className="h-10 w-auto object-contain" />
          </div>
          <p className="text-slate-500 text-sm">{t.tagline}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2 text-start">{t.title}</h1>
              <p className="text-slate-500 text-start text-sm">{t.subtitle}</p>
            </div>
            <Link href="/login" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600">
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-start">{t.emailLabel}</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-start text-slate-900 placeholder-slate-400"
                  required
                />
                <Mail size={18} className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-start">{t.phoneLabel}</label>
              <PhoneInput
                countryCode={countryCode}
                onCountryChange={setCountryCode}
                value={localPhone}
                onChange={setLocalPhone}
                placeholder="5xxxxxxxx"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-start">{t.newPasswordLabel}</label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-start text-slate-900 placeholder-slate-400"
                  required
                />
                <Lock size={18} className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-start">{t.confirmPasswordLabel}</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-start text-slate-900 placeholder-slate-400"
                  required
                />
                <Lock size={18} className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6D5DFB] hover:bg-[#4F46E5] disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-2xl transition-colors"
            >
              {isLoading ? t.submitting : t.submit}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            {t.rememberPassword}{' '}
            <Link href="/login" className="text-[#6D5DFB] font-semibold hover:underline">
              {t.backToLogin}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
