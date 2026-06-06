'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Lock, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orgName: '',
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

    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقتين');
      return;
    }

    setIsLoading(true);

    // TODO: Implement registration in Phase 2
    setTimeout(() => {
      setIsLoading(false);
      setSuccess('✅ تم تقديم بيانات التسجيل. سيتم تنفيذ التسجيل الفعلي في Phase 2');
    }, 1000);
  };

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-900 mb-2">إنشاء حساب جديد</h1>
      <p className="text-slate-600 mb-6">ابدأ رحلتك مع منصة Salla</p>

      {/* Messages */}
      {error && (
        <div className="alert alert-error mb-6">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="alert alert-success mb-6">
          <p>{success}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <Input
          label="اسمك الكامل"
          type="text"
          name="name"
          placeholder="أحمد محمد"
          value={formData.name}
          onChange={handleChange}
          icon={<User size={18} className="text-slate-400" />}
          required
        />

        {/* Email */}
        <Input
          label="البريد الإلكتروني"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail size={18} className="text-slate-400" />}
          required
        />

        {/* Organization Name */}
        <Input
          label="اسم المنظمة/الشركة"
          type="text"
          name="orgName"
          placeholder="شركتي للتسويق"
          value={formData.orgName}
          onChange={handleChange}
          icon={<Building2 size={18} className="text-slate-400" />}
          required
        />

        {/* Password */}
        <Input
          label="كلمة المرور"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock size={18} className="text-slate-400" />}
          required
          helperText="يجب أن تكون 8 أحرف على الأقل"
        />

        {/* Confirm Password */}
        <Input
          label="تأكيد كلمة المرور"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock size={18} className="text-slate-400" />}
          required
        />

        {/* Terms */}
        <label className="flex items-start gap-2">
          <input type="checkbox" className="w-4 h-4 rounded mt-1" required />
          <span className="text-sm text-slate-600">
            أوافق على{' '}
            <Link href="#" className="text-primary-purple hover:underline">
              شروط الخدمة
            </Link>
            {' '}و{' '}
            <Link href="#" className="text-primary-purple hover:underline">
              سياسة الخصوصية
            </Link>
          </span>
        </label>

        {/* Submit */}
        <Button type="submit" isLoading={isLoading} className="w-full">
          إنشاء الحساب
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-slate-600 text-sm mt-6">
        هل لديك حساب بالفعل؟{' '}
        <Link href="/auth/login" className="text-primary-purple font-medium hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
