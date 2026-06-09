import { ServiceBriefForm } from '@/components/orders/ServiceBriefForm';

export default function RequestPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <ServiceBriefForm
        backHref="/dashboard"
        backLabel="العودة للوحة التحكم"
        redirectAfterSubmit="/dashboard/orders"
      />
    </main>
  );
}
