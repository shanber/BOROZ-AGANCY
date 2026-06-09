import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        services: {
          where: {
            isActive: true,
            status: 'AVAILABLE',
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الخدمات' }, { status: 500 });
  }
}
