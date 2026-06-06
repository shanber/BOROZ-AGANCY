'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, ShoppingBag, Globe, Phone, Mail, User, Store } from 'lucide-react';
import { services } from '@/app/lib/demo-data';

export default function PublicRequestPage() {
  // Form values state
  const [storeName, setStoreName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sallaUrl, setSallaUrl] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  
  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!storeName.trim()) {
      newErrors.storeName = 'اسم المتجر مطلوب';
    }
    if (!managerName.trim()) {
      newErrors.managerName = 'اسم المسؤول مطلوب';
    }
    if (!phone.trim()) {
      newErrors.phone = 'رقم الجوال مطلوب';
    } else if (!/^[0-9+]{9,15}$/.test(phone.trim())) {
      newErrors.phone = 'يرجى إدخال رقم جوال صحيح (9 أرقام على الأقل)';
    }
    if (!serviceType) {
      newErrors.serviceType = 'يرجى اختيار نوع الخدمة';
    }
    if (!description.trim()) {
      newErrors.description = 'وصف الطلب مطلوب';
    } else if (description.trim().length < 10) {
      newErrors.description = 'يرجى كتابة وصف أكثر تفصيلاً (10 أحرف على الأقل)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Save order to localStorage so the agency sees it in /dashboard/orders
      const localOrdersJson = typeof window !== 'undefined' ? localStorage.getItem('boroz_custom_orders') : null;
      const localOrders = localOrdersJson ? JSON.parse(localOrdersJson) : [];
      const nextIdNum = 110 + localOrders.length;
      const newId = `ORD-${nextIdNum}`;
      
      const newOrder = {
        id: newId,
        storeName: storeName.trim(),
        managerName: managerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        sallaUrl: sallaUrl.trim() || `https://salla.sa/${storeName.trim()}`,
        serviceKey: serviceType,
        serviceLabel: services.find((s) => s.key === serviceType)?.label || 'خدمة أخرى',
        status: 'جديد' as const,
        priority: 'عادي' as const, // default priority for public requests
        date: 'اليوم',
        price: 'قيد التقدير', // public request starts as under estimation
        description: description.trim(),
        notes: 'طلب وارد من الصفحة الخارجية للعملاء.',
      };
      
      localStorage.setItem('boroz_custom_orders', JSON.stringify([newOrder, ...localOrders]));

      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Public Header */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-sans">
            <span className="text-primary-navy">بروز</span>{' '}
            <span className="text-primary-purple">BOROZ</span>
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-600 hover:text-[#5B4DFF] flex items-center gap-1 font-sans transition-colors">
            العودة للرئيسية
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Main Form Content */}
      <main className="flex-1 py-12 px-4 max-w-2xl w-full mx-auto animate-fade-in">
        {success ? (
          <Card className="border-emerald-250 bg-white shadow-xl overflow-hidden mt-6">
            <CardBody className="p-10 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800 font-sans">تم استلام طلبك بنجاح!</h2>
                <p className="text-sm text-slate-650 font-sans max-w-md mx-auto leading-relaxed">
                  شكراً لطلب الخدمة من بروز. لقد سجلنا متطلباتك، وسيقوم فريق العمل لدينا بمراجعتها والتواصل معك عبر الجوال أو البريد الإلكتروني خلال 24 ساعة للبدء بالتنفيذ.
                </p>
              </div>
              <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="primary" 
                  onClick={() => setSuccess(false)}
                  className="bg-[#5B4DFF] hover:bg-[#4b3dff] text-white text-xs font-bold font-sans px-6"
                >
                  طلب خدمة أخرى
                </Button>
                <Link href="/">
                  <Button variant="secondary" className="text-xs font-bold font-sans px-6 border border-slate-200">
                    العودة للصفحة الرئيسية
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-[#111827] font-sans">اطلب خدمة من بروز</h1>
              <p className="text-xs md:text-sm text-[#64748B] font-sans">
                املأ بيانات متجرك وسيقوم فريق بروز بمراجعة الطلب والتواصل معك للبدء.
              </p>
            </div>

            <Card className="border border-slate-200/80 shadow-md overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 px-6 py-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#5B4DFF]" />
                <h3 className="font-bold text-xs text-[#111827] font-sans">تفاصيل متجرك والخدمة</h3>
              </CardHeader>
              <CardBody className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Name & Manager */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="اسم المتجر"
                      placeholder="اسم متجرك الإلكتروني"
                      value={storeName}
                      onChange={(e) => {
                        setStoreName(e.target.value);
                        if (errors.storeName) setErrors({ ...errors, storeName: '' });
                      }}
                      error={errors.storeName}
                      icon={<Store size={16} className="text-slate-400" />}
                      required
                    />
                    <Input
                      label="اسم المسؤول"
                      placeholder="الاسم الثلاثي للمسؤول"
                      value={managerName}
                      onChange={(e) => {
                        setManagerName(e.target.value);
                        if (errors.managerName) setErrors({ ...errors, managerName: '' });
                      }}
                      error={errors.managerName}
                      icon={<User size={16} className="text-slate-400" />}
                      required
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="رقم الجوال"
                      type="tel"
                      placeholder="مثال: 0501234567"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      error={errors.phone}
                      icon={<Phone size={16} className="text-slate-400" />}
                      required
                    />
                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      placeholder="name@store.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail size={16} className="text-slate-400" />}
                    />
                  </div>

                  {/* Salla Store URL */}
                  <Input
                    label="رابط متجر سلة"
                    type="url"
                    placeholder="https://salla.sa/mystore"
                    value={sallaUrl}
                    onChange={(e) => setSallaUrl(e.target.value)}
                    icon={<Globe size={16} className="text-slate-400" />}
                  />

                  {/* Service Type select */}
                  <div className="w-full">
                    <label className="label-base">
                      نوع الخدمة المطلوبة <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => {
                        setServiceType(e.target.value);
                        if (errors.serviceType) setErrors({ ...errors, serviceType: '' });
                      }}
                      className={`input-base bg-white ${errors.serviceType ? 'border-red-500 focus:ring-red-500' : ''}`}
                      required
                    >
                      <option value="" disabled hidden>اختر نوع الخدمة المطلوب...</option>
                      {services.map((serv) => (
                        <option key={serv.key} value={serv.key}>{serv.label}</option>
                      ))}
                    </select>
                    {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
                  </div>

                  {/* Description text area */}
                  <div className="w-full">
                    <label className="label-base">
                      وصف متطلبات الطلب <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="يرجى كتابة تفاصيل العمل المطلوب، الأهداف المرجوة من المشروع ليتسنى لنا تقييمها بدقة..."
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) setErrors({ ...errors, description: '' });
                      }}
                      rows={4}
                      className={`input-base min-h-[100px] resize-y ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                      required
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  {/* Submit button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      isLoading={loading}
                      className="w-full bg-[#5B4DFF] hover:bg-[#4b3dff] text-white py-3 shadow-md shadow-[#5B4DFF]/15 text-sm font-bold font-sans rounded-xl"
                    >
                      إرسال طلب الخدمة
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="bg-primary-navy text-slate-400 py-8 text-center border-t border-slate-200 mt-12 shrink-0">
        <div className="max-w-4xl mx-auto px-6 space-y-2">
          <p className="text-white font-bold font-sans">بروز | BOROZ</p>
          <p className="text-xs font-sans">منصة التسويق والنمو المتخصصة لتجار سلة</p>
          <p className="text-[10px] text-slate-500">© 2026 BOROZ. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
