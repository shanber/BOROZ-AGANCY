import { Order } from './demo-data';

export interface OrderInput {
  serviceType: string;
  budget?: string;
  priority?: string;
  description: string;
  notes?: string;
  referenceLinks?: string;
}

export interface MerchantOrderContext {
  merchantName: string;
  storeName: string;
  email: string;
  storeUrl: string;
  phone?: string;
}

export interface DashboardOrdersSummary {
  counts: Record<string, number>;
  recentOrders: Order[];
}

export async function createOrder(input: OrderInput): Promise<Order> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'فشلت عملية إنشاء الطلب عبر الخادم');
  }

  return response.json();
}

export async function getOrders(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<Order[]> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.page) searchParams.set('page', String(params.page));
  searchParams.set('limit', String(params?.limit || 20));

  const response = await fetch(`/api/orders?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('فشل جلب قائمة الطلبات من الخادم');
  }
  return response.json();
}

export async function getDashboardOrdersSummary(): Promise<DashboardOrdersSummary> {
  const response = await fetch('/api/orders?summary=dashboard');
  if (!response.ok) {
    throw new Error('فشل جلب ملخص الطلبات من الخادم');
  }
  return response.json();
}

export async function getMerchantOrderContext(): Promise<MerchantOrderContext> {
  const response = await fetch('/api/orders?context=merchant');
  if (!response.ok) {
    throw new Error('فشل جلب بيانات التاجر من الخادم');
  }
  return response.json();
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`/api/orders/${encodeURIComponent(id)}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}
