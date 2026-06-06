'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, FolderOpen } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  
  // Form state
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [manager, setManager] = useState('');
  const [description, setDescription] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!projectName.trim()) newErrors.projectName = 'اسم المشروع مطلوب';
    if (!clientName.trim()) newErrors.clientName = 'اسم العميل / المتجر مطلوب';
    if (!description.trim()) newErrors.description = 'وصف المشروع مطلوب';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Redirect to /dashboard/projects after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/projects');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
            title="العودة للمشاريع"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">مشروع جديد</h2>
            <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
              تهيئة وإطلاق مشروع عمل جاري جديد داخل بروز.
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
              <h3 className="text-lg font-bold text-emerald-900 font-sans">تم إنشاء المشروع بنجاح!</h3>
              <p className="text-sm text-emerald-700 font-sans max-w-md mx-auto">
                تم تسجيل المشروع الجديد بنجاح في النظام وجاري نقله للائحة المشاريع الجارية للبدء في المهام.
              </p>
              <p className="text-xs text-slate-500 font-sans pt-2">
                جاري توجيهك إلى قائمة المشاريع...
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 px-6 py-4 flex items-center gap-2">
            <FolderOpen size={18} className="text-[#5B4DFF]" />
            <h3 className="font-bold text-sm text-[#111827] font-sans">تفاصيل المشروع الجديد</h3>
          </CardHeader>
          <CardBody className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="اسم المشروع"
                  placeholder="مثال: تحسين SEO المتجر"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (errors.projectName) setErrors({ ...errors, projectName: '' });
                  }}
                  error={errors.projectName}
                  required
                />
                <Input
                  label="اسم العميل / المتجر"
                  placeholder="مثال: متجر العطور الفاخرة"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (errors.clientName) setErrors({ ...errors, clientName: '' });
                  }}
                  error={errors.clientName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  label="ميزانية المشروع (ر.س)"
                  type="number"
                  placeholder="مثال: 5500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <Input
                  label="تاريخ البدء المتوقع"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="مدير المشروع"
                  placeholder="مثال: م. أحمد صالح"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="label-base">
                  وصف المشروع وأهدافه <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="يرجى كتابة تفاصيل العمل المطلوب، الأهداف المرجوة من المشروع..."
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

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl font-sans">
                  إلغاء
                </Link>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="bg-[#5B4DFF] hover:bg-[#4b3dff] text-white px-6 text-xs font-bold shadow-sm shadow-[#5B4DFF]/10"
                >
                  إرسال المشروع
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
