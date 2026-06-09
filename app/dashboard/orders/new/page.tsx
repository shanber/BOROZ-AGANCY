import { ServiceBriefForm } from '@/components/orders/ServiceBriefForm';

export default function NewOrderPage() {
  return (
    <ServiceBriefForm
      backHref="/dashboard/orders"
      backLabel="العودة للطلبات"
      redirectAfterSubmit="/dashboard/orders"
    />
  );
}
