'use client';

import { Card, CardBody } from '@/components/ui/Card';

export default function OrdersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section inside page content */}
      <div className="flex flex-col border-b border-slate-200/60 pb-5">
        <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">الطلبات</h2>
        <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
          متابعة وإدارة الطلبات الواردة وتفاصيلها المالية والزمنية
        </p>
      </div>

      <Card>
        <CardBody>
          <p className="text-center text-slate-600 py-8 font-sans">
            📦 صفحة الطلبات - سيتم تنفيذها في Phase 6 (Orders)
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
