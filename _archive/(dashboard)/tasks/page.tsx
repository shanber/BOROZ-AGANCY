'use client';

import { Topbar } from '@/components/ui/Topbar';
import { Card, CardBody } from '@/components/ui/Card';

export default function TasksPage() {
  return (
    <>
      <Topbar title="المهام" />
      <div className="mt-6">
        <Card>
          <CardBody>
            <p className="text-center text-slate-600 py-8">
              ✅ سيتم تنفيذ هذه الصفحة في Phase 7 (Tasks)
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
