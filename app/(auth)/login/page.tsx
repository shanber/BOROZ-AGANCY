'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Mail, Lock, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setIsLoading(false);
        if (res.error === 'Configuration' || res.error === 'AccessDenied') {
          setError('❌ حدث خطأ في تسجيل الدخول، تحقق من إعدادات الخادم');
        } else if (res.error.includes('كلمة المرور') || res.error.includes('البريد')) {
          setError(`❌ البريد الإلكتروني أو كلمة المرور غير صحيحة`);
        } else {
          setError(`❌ ${res.error}`);
        }
        return;
      }

      // Success
      setSuccess('✅ تم تسجيل الدخول بنجاح!');
      setIsLoading(false);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);

    } catch (err: any) {
      setIsLoading(false);
      setError('❌ حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-navy via-[#06B6D4]/30 to-primary-navy flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#06B6D4] opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-navy opacity-10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/شعار%20بروز.svg" alt="بروز" width={100} height={40} className="h-10 w-auto object-contain brightness-0 invert" />
          </div>
          <p className="text-slate-300 text-sm">منصة خدمات وخبراء متاجر سلة</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-right">
            تسجيل الدخول
          </h1>
          <p className="text-slate-600 mb-6 text-right text-sm">
            أدخل بيانات الدخول الخاصة بك
          </p>

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
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-[#06B6D4] text-right text-slate-900 placeholder-slate-500"
                  required
                />
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-[#06B6D4] text-right text-slate-900 placeholder-slate-500"
                  required
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-[#06B6D4] hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span className="text-sm text-slate-600">تذكرني</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>



          {/* Footer Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-[#06B6D4] font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-slate-400 text-xs mt-6">
          © 2024 BOROZ | بروز. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
