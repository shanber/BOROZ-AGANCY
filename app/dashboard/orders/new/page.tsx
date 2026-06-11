import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/lib/auth';
import { ServiceBriefForm } from '@/components/orders/ServiceBriefForm';

export default async function NewOrderPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');
  if (session.user.globalRole !== 'MERCHANT') redirect('/dashboard');

  return (
    <ServiceBriefForm
      backHref="/dashboard/orders"
      backLabel="العودة للطلبات"
      redirectAfterSubmit="/dashboard/orders"
    />
  );
}
