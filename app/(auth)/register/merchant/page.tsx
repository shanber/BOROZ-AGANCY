'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Store, CheckCircle, ArrowRight } from 'lucide-react';
import PhoneInput from '@/app/components/ui/PhoneInput';
import { getCountryByCode, normalizePhoneNumber } from '@/app/lib/phone';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    storeUrl: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [countryCode, setCountryCode] = useState('SA');
  const [localPhone, setLocalPhone] = useState('');
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
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.email.length < 5) {
      setError('البريد الإلكتروني غير صحيح');
      return;
    }

    const dialCode = getCountryByCode(countryCode).dialCode;
    const normalizedPhone = normalizePhoneNumber(dialCode, localPhone);
    if (!normalizedPhone) {
      setError('رقم الجوال غير صحيح');
      return;
    }

    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register/merchant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: normalizedPhone,
          storeName: formData.storeName,
          storeUrl: formData.storeUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }

      setSuccess('تم إنشاء الحساب بنجاح! جاري التوجيه...');
      
      // Redirect after short delay to login
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
        <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 text-right">
                تسجيل متجر سلة
              </h1>
              <p className="text-slate-400 text-right text-sm">
                ابدأ رحلتك مع منصة BOROZ اليوم
              </p>
            </div>
            <Link href="/register" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-slate-300">
              <ArrowRight size={20} />
            </Link>
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
                الاسم الكامل
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="اسمك الكامل"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-[#06B6D4] text-right text-slate-900 placeholder-slate-500"
                  required
                />
                <Store size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
                اسم المتجر
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="storeName"
                  placeholder="اسم متجرك على سلة"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-[#06B6D4] text-right text-slate-900 placeholder-slate-500"
                  required
                />
                <Store size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Store URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
                رابط المتجر
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="storeUrl"
                  placeholder="https://salla.sa/yourstore"
                  value={formData.storeUrl}
                  onChange={handleChange}
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-[#06B6D4] text-right text-slate-900 placeholder-slate-500"
                  required
                />
                <Store size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-[#06B6D4] text-right text-slate-900 placeholder-slate-500"
                  required
                />
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
                رقم الجوال
              </label>
              <PhoneInput
                countryCode={countryCode}
                onCountryChange={setCountryCode}
                value={localPhone}
                onChange={setLocalPhone}
                placeholder="5xxxxxxxx"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-[#06B6D4] text-right text-slate-900 placeholder-slate-500"
                  required
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full has-icon bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-[#06B6D4] text-right text-slate-900 placeholder-slate-500"
                  required
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 mt-1" required />
              <span className="text-sm text-slate-400 text-right flex-1">
                أوافق على{' '}
                <Link href="/terms" className="text-[#06B6D4] hover:underline">
                  شروط الخدمة
                </Link>{' '}
                و
                <Link href="/privacy" className="text-[#06B6D4] hover:underline">
                  سياسة الخصوصية
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#06B6D4] hover:bg-[#0891B2] disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-slate-400 text-sm mt-6">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-[#06B6D4] font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © 2024 BOROZ | بروز. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
