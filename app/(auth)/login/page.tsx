'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import PhoneInput from '@/app/components/ui/PhoneInput';
import { getCountryByCode, normalizePhoneNumber } from '@/app/lib/phone';

type LoginMethod = 'email' | 'phone';

export default function LoginPage() {
  const router = useRouter();
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
      setError('كلمة المرور مطلوبة');
      return;
    }

    let identifier = '';
    if (method === 'email') {
      if (!email.trim()) {
        setError('البريد الإلكتروني مطلوب');
        return;
      }
      identifier = email.trim();
    } else {
      const dialCode = getCountryByCode(countryCode).dialCode;
      const e164 = normalizePhoneNumber(dialCode, localPhone);
      if (!e164) {
        setError('رقم الجوال غير صحيح');
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
          setError('حدث خطأ في تسجيل الدخول، تحقق من إعدادات الخادم');
        } else if (res.error === 'تم تعطيل حسابك') {
          setError(res.error);
        } else {
          // Unified message for bad credentials / unknown identifier
          setError('بيانات الدخول غير صحيحة');
        }
        return;
      }

      setSuccess('تم تسجيل الدخول بنجاح!');
      setIsLoading(false);

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const tabBase =
    'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors';
  const tabActive = 'bg-[#6D5DFB] text-white shadow-sm';
  const tabInactive = 'text-slate-600 hover:bg-slate-100';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/شعار%20بروز.svg" alt="بروز" width={100} height={40} className="h-10 w-auto object-contain" />
          </div>
          <p className="text-slate-500 text-sm">منصة خدمات وخبراء متاجر سلة</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-right">تسجيل الدخول</h1>
          <p className="text-slate-500 mb-6 text-right text-sm">أدخل بيانات الدخول الخاصة بك</p>

          {/* Method Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMethod('email'); setError(''); }}
              className={`${tabBase} ${method === 'email' ? tabActive : tabInactive}`}
            >
              البريد الإلكتروني
            </button>
            <button
              type="button"
              onClick={() => { setMethod('phone'); setError(''); }}
              className={`${tabBase} ${method === 'phone' ? tabActive : tabInactive}`}
            >
              رقم الجوال
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
                <label className="block text-sm font-medium text-slate-900 mb-2 text-right">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-right text-slate-900 placeholder-slate-400"
                  />
                  <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2 text-right">رقم الجوال</label>
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
              <label className="block text-sm font-medium text-slate-900 mb-2 text-right">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-right text-slate-900 placeholder-slate-400"
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">نسيت كلمة المرور؟ تواصل مع الدعم</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span className="text-sm text-slate-600">تذكرني</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6D5DFB] hover:bg-[#4F46E5] disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-[#6D5DFB] font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-slate-400 text-xs mt-6">© 2024 BOROZ | بروز. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  );
}
