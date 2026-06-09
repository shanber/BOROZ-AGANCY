'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Eye, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function InvoicesPage() {
  const invoices = [
    { id: 'INV-2026-001', service: 'تخصيص متجر سلة (م. خالد عبد الرحمن)', amount: '1,200 ر.س', date: '5 يونيو 2026', status: 'مدفوعة' },
    { id: 'INV-2026-002', service: 'تهيئة SEO الشاملة (سارة العتيبي)', amount: '3,500 ر.س', date: '1 يونيو 2026', status: 'مدفوعة' },
    { id: 'INV-2026-003', service: 'تصميم واجهة مخصصة (عمر اليافعي)', amount: '2,200 ر.س', date: '24 مايو 2026', status: 'مدفوعة' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in font-sans">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 rtl:mr-3 rtl:ml-0">
            <p className="text-sm text-yellow-700 font-bold">
              ملاحظة: البيانات المعروضة في هذه الصفحة هي بيانات تجريبية (Placeholder) وليست حقيقية. سيتم ربطها بقاعدة البيانات في المرحلة القادمة.
            </p>
          </div>
        </div>
      </div>
      <div className="border-b border-slate-200/60 pb-5">
        <h2 className="text-xl md:text-2xl font-bold text-[#111827]">الفواتير والمعاملات المالية</h2>
        <p className="text-xs md:text-sm text-[#64748B] mt-1">
          إدارة وتتبع فواتير الخدمات وسجل المدفوعات لمقدمي الخدمات.
        </p>
      </div>

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden bg-white rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right border-collapse text-xs whitespace-nowrap min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80">
                <th className="px-6 py-4 font-bold">رقم الفاتورة</th>
                <th className="px-6 py-4 font-bold">الخدمة / مقدم الخدمة</th>
                <th className="px-6 py-4 font-bold">تاريخ المعاملة</th>
                <th className="px-6 py-4 font-bold text-left">المبلغ</th>
                <th className="px-6 py-4 font-bold text-center">حالة الدفع</th>
                <th className="px-6 py-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#111827]">{inv.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{inv.service}</td>
                  <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                  <td className="px-6 py-4 text-left font-bold text-[#111827]">{inv.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex gap-2 justify-center">
                      <Button variant="ghost" className="p-1 text-slate-500 hover:text-[#06B6D4] hover:bg-slate-50 rounded-lg">
                        <Eye size={14} />
                      </Button>
                      <Button variant="ghost" className="p-1 text-slate-500 hover:text-[#06B6D4] hover:bg-slate-50 rounded-lg">
                        <ArrowDownToLine size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
