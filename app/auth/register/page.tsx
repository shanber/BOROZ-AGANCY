'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Lock, Store, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('❌ كلمات المرور غير متطابقة');
      return;
    }

    if (formData.email.length < 5) {
      setError('❌ البريد الإلكتروني غير صحيح');
      return;
    }

    if (formData.phone.length < 10) {
      setError('❌ رقم الجوال غير صحيح');
      return;
    }

    if (formData.password.length < 8) {
      setError('❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Success
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('storeName', formData.storeName);
      
      setSuccess('✅ تم إنشاء الحساب بنجاح!');
      setIsLoading(false);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
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
            إنشاء حساب جديد
          </h1>
          <p className="text-slate-600 mb-6 text-right text-sm">
            ابدأ رحلتك مع منصة BOROZ اليوم
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
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                اسم المتجر
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="storeName"
                  placeholder="اسم متجرك على سلة"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-right"
                  required
                />
                <Store size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-right"
                  required
                />
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                رقم الجوال
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="+966501234567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-right"
                  required
                />
                <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-right"
                  required
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-right"
                  required
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 mt-1" required />
              <span className="text-sm text-slate-600 text-right flex-1">
                أوافق على{' '}
                <Link href="/terms" className="text-primary-purple hover:underline">
                  شروط الخدمة
                </Link>{' '}
                و
                <Link href="/privacy" className="text-primary-purple hover:underline">
                  سياسة الخصوصية
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-purple hover:bg-primary-purple/90 disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-slate-600 text-sm mt-6">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-primary-purple font-semibold hover:underline">
              تسجيل الدخول
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
