import { NextResponse } from 'next/server';
import { getRequestableServices } from '@/app/lib/services';

export async function GET() {
  try {
    // DB-driven taxonomy grouped by category, each service flagged with
    // provider-driven availability (no fake availability).
    const categories = await getRequestableServices();
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الخدمات' }, { status: 500 });
  }
}
