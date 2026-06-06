'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react';

export default function NewOrderPage() {
  // Form state
  const [storeName, setStoreName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Reset form
      setStoreName('');
      setManagerName('');
      setPhone('');
      setServiceType('');
      setDescription('');
      setBudget('');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
            title="العودة للوحة التحكم"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">طلب جديد</h2>
            <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
              أنشئ طلب خدمة جديد للبدء بالعمل مع وكالة بروز
            </p>
          </div>
        </div>
      </div>

      {success ? (
        <Card className="border-emerald-200 bg-emerald-50/30 overflow-hidden">
          <CardBody className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-emerald-900 font-sans">تم إرسال الطلب بنجاح!</h3>
              <p className="text-sm text-emerald-700 font-sans max-w-md mx-auto">
                شكراً لثقتك بنا. تم تسجيل طلبك المبدئي بنجاح، وسيقوم مدير الحسابات بالتواصل معك عبر الجوال خلال ساعات العمل لمناقشة التفاصيل.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="primary" 
                onClick={() => setSuccess(false)}
                className="bg-[#5B4DFF] hover:bg-[#4b3dff] text-white"
              >
                تقديم طلب آخر
              </Button>
              <Link href="/dashboard">
                <Button variant="secondary">
                  العودة للوحة التحكم
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 px-6 py-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#5B4DFF]" />
            <h3 className="font-bold text-sm text-[#111827] font-sans">تفاصيل الطلب الجديد</h3>
          </CardHeader>
          <CardBody className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Manager Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="اسم المتجر"
                  placeholder="مثال: متجر العطور الفاخرة"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
                <Input
                  label="اسم المسؤول"
                  placeholder="مثال: محمد أحمد"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  required
                />
              </div>

              {/* Phone & Service Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="رقم الجوال"
                  type="tel"
                  placeholder="مثال: 0501234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                
                <div className="w-full">
                  <label className="label-base">
                    نوع الخدمة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="input-base bg-white"
                    required
                  >
                    <option value="" disabled hidden>اختر نوع الخدمة المطلوب...</option>
                    <option value="branding">تصميم هوية بصرية كاملة</option>
                    <option value="marketing">إدارة وتدشين حملات إعلانية</option>
                    <option value="seo">تحسين محركات البحث SEO متاجر سلة</option>
                    <option value="social">كتابة وإدارة محتوى حسابات التواصل</option>
                    <option value="coding">تطوير وتعديل خيارات المتجر</option>
                    <option value="other">أخرى / خدمة مخصصة</option>
                  </select>
                </div>
              </div>

              {/* Budget Option */}
              <Input
                label="الميزانية التقريبية للطلب (ر.س)"
                type="number"
                placeholder="مثال: 5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />

              {/* Description textarea */}
              <div className="w-full">
                <label className="label-base">
                  وصف الطلب <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="يرجى كتابة تفاصيل الخدمة المطلوبة، الأهداف، وأي ملاحظات تهمنا للبدء..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="input-base min-h-[100px] resize-y"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg font-sans">
                  إلغاء
                </Link>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="bg-[#5B4DFF] hover:bg-[#4b3dff] text-white px-6 shadow-sm shadow-[#5B4DFF]/10"
                >
                  إرسال الطلب
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
