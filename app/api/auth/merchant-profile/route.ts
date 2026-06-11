import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

const allowedFields = ['storeName', 'storeUrl', 'businessType', 'companyName', 'storeNotes', 'preferredContact'] as const;

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }
    if (session.user.globalRole !== 'MERCHANT') {
      return NextResponse.json({ error: 'فقط التجار يمكنهم تحديث بيانات المتجر' }, { status: 403 });
    }

    const body = await request.json();
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] === 'string' && body[field].trim().length > 500) {
          return NextResponse.json({ error: `الحقل ${field} طويل جدًا` }, { status: 400 });
        }
        updateData[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Merchant profile update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث بيانات المتجر' }, { status: 500 });
  }
}
