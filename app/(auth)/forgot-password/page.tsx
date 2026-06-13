'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import PhoneInput from '@/app/components/ui/PhoneInput';
import { getCountryByCode, normalizePhoneNumber } from '@/app/lib/phone';

export default function ForgotPasswordPage() {
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
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    const dialCode = getCountryByCode(countryCode).dialCode;
    const normalizedPhone = normalizePhoneNumber(dialCode, localPhone);
    if (!normalizedPhone) {
      setError('رقم الجوال غير صحيح');
      return;
    }

    if (!newPassword) {
      setError('يرجى إدخال كلمة المرور الجديدة');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
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
        throw new Error(data.error || 'حدث خطأ أثناء استعادة كلمة المرور');
      }

      setSuccess(data.message || 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.');
      setEmail('');
      setLocalPhone('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء استعادة كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/شعار%20بروز.svg" alt="بروز" width={100} height={40} className="h-10 w-auto object-contain" />
          </div>
          <p className="text-slate-500 text-sm">استعادة كلمة المرور عبر البريد والجوال المسجلين</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2 text-right">استعادة كلمة المرور</h1>
              <p className="text-slate-500 text-right text-sm">
                أدخل البريد الإلكتروني ورقم الجوال المسجلين ثم عيّن كلمة مرور جديدة.
              </p>
            </div>
            <Link href="/login" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600">
              <ArrowRight size={20} />
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
              <label className="block text-sm font-medium text-slate-900 mb-2 text-right">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-right text-slate-900 placeholder-slate-400"
                  required
                />
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-right">رقم الجوال المسجل</label>
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
              <label className="block text-sm font-medium text-slate-900 mb-2 text-right">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-right text-slate-900 placeholder-slate-400"
                  required
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-right">تأكيد كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D5DFB] focus:border-[#6D5DFB] text-right text-slate-900 placeholder-slate-400"
                  required
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6D5DFB] hover:bg-[#4F46E5] disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-2xl transition-colors"
            >
              {isLoading ? 'جاري التحقق...' : 'تحديث كلمة المرور'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            تذكرت كلمة المرور؟{' '}
            <Link href="/login" className="text-[#6D5DFB] font-semibold hover:underline">
              العودة لتسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
