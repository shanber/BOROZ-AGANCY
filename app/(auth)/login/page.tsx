'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setError('⚠️ تم تقديم بيانات اعتماد افتراضية. سيتم تنفيذ المصادقة الفعلية في Phase 2');
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">تسجيل الدخول</h1>
      <p className="text-slate-600 mb-6">أدخل بيانات الدخول الخاصة بك</p>

      {error && (
        <div className="alert alert-warning mb-6">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="البريد الإلكتروني"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} className="text-slate-400" />}
          required
        />

        <Input
          label="كلمة المرور"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} className="text-slate-400" />}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm text-slate-600">تذكرني</span>
          </label>
          <Link href="/auth/forgot-password" className="text-sm text-primary-purple hover:underline">
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          تسجيل الدخول
        </Button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-2">📌 بيانات تجريبية:</p>
        <p className="text-sm text-blue-700">البريد: <code>admin@example.com</code></p>
        <p className="text-sm text-blue-700">كلمة المرور: <code>ChangeMe123!</code></p>
      </div>

      <p className="text-center text-slate-600 text-sm mt-6">
        ليس لديك حساب؟{' '}
        <Link href="/auth/register" className="text-primary-purple font-medium hover:underline">
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}
