'use client';

import { Card, CardBody } from '@/components/ui/Card';

export default function TasksPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section inside page content */}
      <div className="flex flex-col border-b border-slate-200/60 pb-5">
        <h2 className="text-xl md:text-2xl font-bold text-[#111827] font-sans">المهام</h2>
        <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans">
          تنظيم المهام اليومية لفريق العمل ومتابعة المواعيد النهائية
        </p>
      </div>

      <Card>
        <CardBody>
          <p className="text-center text-slate-600 py-8 font-sans">
            📋 صفحة المهام - سيتم تنفيذها في Phase 8 (Tasks)
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
