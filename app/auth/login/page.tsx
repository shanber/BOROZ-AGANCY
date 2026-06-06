'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

    // Demo credentials
    const DEMO_EMAIL = 'admin@example.com';
    const DEMO_PASSWORD = 'ChangeMe123!';

    // Simulate API call
    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        // Success - save to localStorage and redirect
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        setSuccess('✅ تم تسجيل الدخول بنجاح!');
        setIsLoading(false);
        
        // Redirect after short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        // Failed
        setIsLoading(false);
        setError('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-navy via-primary-purple to-primary-navy flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-purple opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-navy opacity-10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/boroz-logo.png"
            alt="BOROZ"
            width={160}
            height={80}
            priority
            className="mx-auto mb-4"
          />
          <p className="text-primary-light text-sm">منصة النمو المتخصصة لتجار سلة</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <h1 className="text-2xl font-bold text-primary-navy mb-2 text-right">
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
              <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-right"
                  required
                />
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-right"
                  required
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-purple hover:underline"
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
              className="w-full bg-primary-purple hover:bg-primary-purple/90 disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-right">
            <p className="text-sm text-blue-800 font-medium mb-2">📌 بيانات تجريبية (Demo):</p>
            <p className="text-sm text-blue-700">
              البريد: <code className="bg-white px-2 py-1 rounded font-mono">admin@example.com</code>
            </p>
            <p className="text-sm text-blue-700">
              كلمة المرور: <code className="bg-white px-2 py-1 rounded font-mono">ChangeMe123!</code>
            </p>
            <p className="text-xs text-blue-600 mt-2">💡 سيتم تفعيل المصادقة الحقيقية في Phase 2</p>
          </div>

          {/* Footer Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" className="text-primary-purple font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-primary-light text-xs mt-6">
          © 2024 BOROZ | بروز. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
