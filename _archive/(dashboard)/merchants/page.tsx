'use client';

import { Topbar } from '@/components/ui/Topbar';
import { Card, CardBody } from '@/components/ui/Card';

export default function MerchantsPage() {
  return (
    <>
      <Topbar title="التجار" />
      <div className="mt-6">
        <Card>
          <CardBody>
            <p className="text-center text-slate-600">
              📋 صفحة التجار - سيتم تنفيذها في Phase 5 (CRM Core)
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
