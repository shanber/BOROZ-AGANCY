'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react';
import { services } from '@/app/lib/demo-data';

export default function NewOrderPage() {
  const router = useRouter();
  
  // Form values state
  const [storeName, setStoreName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sallaUrl, setSallaUrl] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [budget, setBudget] = useState('');
  const [priority, setPriority] = useState<'عادي' | 'مهم' | 'عاجل'>('عادي');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  
  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('تم إنشاء الطلب بنجاح، وسيتم مراجعته من فريق بروز.');
      setSuccess(true);
      
      // Redirect to /dashboard/orders after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/orders');
      }, 2000);
    }, 1500);
  };

  const handleSaveDraft = () => {
    if (!storeName.trim()) {
      setErrors({ storeName: 'اسم المتجر مطلوب لحفظ المسودة' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('تم حفظ الطلب كمسودة بنجاح.');
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard/orders');
      }, 2000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
            title="العودة للطلبات"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">طلب جديد</h2>
            <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
              أنشئ طلب خدمة جديد لفريق بروز لمراجعته والبدء في التنفيذ.
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
              <h3 className="text-lg font-bold text-emerald-900 font-sans">عملية ناجحة</h3>
              <p className="text-sm text-emerald-700 font-sans max-w-md mx-auto">
                {successMessage}
              </p>
              <p className="text-xs text-slate-500 font-sans pt-2">
                جاري توجيهك إلى قائمة الطلبات...
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 px-6 py-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#5B4DFF]" />
            <h3 className="font-bold text-sm text-[#111827] font-sans">تفاصيل طلب الخدمة</h3>
          </CardHeader>
          <CardBody className="p-6 md:p-8">
            <form onSubmit={handleSendOrder} className="space-y-6">
              
              {/* Section 1: Customer Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 border-r-2 border-[#5B4DFF] pr-2 font-sans">بيانات العميل والمتجر</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="اسم المتجر"
                    placeholder="مثال: متجر العطور الفاخرة"
                    value={storeName}
                    onChange={(e) => {
                      setStoreName(e.target.value);
                      if (errors.storeName) setErrors({ ...errors, storeName: '' });
                    }}
                    error={errors.storeName}
                    required
                  />
                  <Input
                    label="اسم المسؤول"
                    placeholder="مثال: محمد أحمد"
                    value={managerName}
                    onChange={(e) => {
                      setManagerName(e.target.value);
                      if (errors.managerName) setErrors({ ...errors, managerName: '' });
                    }}
                    error={errors.managerName}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                    required
                  />
                  <Input
                    label="البريد الإلكتروني"
                    type="email"
                    placeholder="example@store.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    label="رابط متجر سلة"
                    type="url"
                    placeholder="https://salla.sa/mystore"
                    value={sallaUrl}
                    onChange={(e) => setSallaUrl(e.target.value)}
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Section 2: Service Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 border-r-2 border-[#5B4DFF] pr-2 font-sans">تفاصيل الخدمة المطلوبة</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="w-full">
                    <label className="label-base">
                      نوع الخدمة <span className="text-red-500">*</span>
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

                  <Input
                    label="الميزانية التقريبية (ر.س)"
                    type="number"
                    placeholder="مثال: 5000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="label-base">مستوى الأولوية</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['عادي', 'مهم', 'عاجل'] as const).map((p) => {
                      const isActive = priority === p;
                      const activeColors = {
                        'عادي': 'bg-slate-100 border-slate-300 text-slate-800 ring-2 ring-slate-400/20',
                        'مهم': 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-400/20',
                        'عاجل': 'bg-red-50 border-red-300 text-red-800 ring-2 ring-red-400/20'
                      };
                      const defaultColors = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700';

                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all text-center ${isActive ? activeColors[p] : defaultColors}`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description textarea */}
                <div className="w-full">
                  <label className="label-base">
                    وصف الطلب <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="يرجى كتابة تفاصيل الخدمة المطلوبة، الأهداف، وأي ملاحظات تهمنا للبدء..."
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

                {/* Additional notes */}
                <div className="w-full">
                  <label className="label-base">ملاحظات إضافية</label>
                  <textarea
                    placeholder="أي روابط إضافية، ملفات، أو شروط خاصة تود إضافتها..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="input-base min-h-[60px] resize-y"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100">
                <Link 
                  href="/dashboard/orders" 
                  className="text-slate-500 hover:text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors font-sans"
                >
                  إلغاء والعودة للطلبات
                </Link>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  isLoading={loading}
                  className="px-4 py-2 text-xs font-bold border border-slate-200"
                >
                  حفظ كمسودة
                </Button>

                <Button
                  type="submit"
                  isLoading={loading}
                  className="bg-[#5B4DFF] hover:bg-[#4b3dff] text-white px-6 text-xs font-bold shadow-sm shadow-[#5B4DFF]/10"
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
