'use client';

import { Card, CardBody } from '@/components/ui/Card';

export default function MerchantsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section inside page content */}
      <div className="flex flex-col border-b border-slate-200/60 pb-5">
        <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">التجار</h2>
        <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
          إدارة بيانات التجار المشتركين ومتابعة متطلباتهم
        </p>
      </div>

      <Card>
        <CardBody>
          <p className="text-center text-slate-600 py-8 font-sans">
            📋 صفحة التجار - سيتم تنفيذها في Phase 5 (CRM Core)
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
