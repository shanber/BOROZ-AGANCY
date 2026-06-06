'use client';

import { Topbar } from '@/components/ui/Topbar';
import { Card, CardBody } from '@/components/ui/Card';

export default function LeadsPage() {
  return (
    <>
      <Topbar title="العملاء المحتملين" />
      <div className="mt-6">
        <Card>
          <CardBody>
            <p className="text-center text-slate-600 py-8">
              👥 سيتم تنفيذ هذه الصفحة في Phase 5 (CRM Core)
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
