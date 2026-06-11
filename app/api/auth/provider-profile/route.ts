import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

const allowedFields = [
  'specialtyTitle', 'bio', 'yearsOfExperience', 'portfolioUrl', 'linkedinUrl',
  'availability', 'priceRangeMin', 'priceRangeMax', 'preferredProjectTypes', 'sallaExperience',
] as const;

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }
    if (session.user.globalRole !== 'PROVIDER') {
      return NextResponse.json({ error: 'فقط مقدمي الخدمات يمكنهم تحديث الملف المهني' }, { status: 403 });
    }

    const body = await request.json();
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] === 'string' && body[field].trim().length > 500) {
          return NextResponse.json({ error: `الحقل ${field} طويل جدًا` }, { status: 400 });
        }
        if (field === 'yearsOfExperience') {
          const v = Number(body[field]);
          updateData[field] = isNaN(v) ? null : Math.floor(v);
        } else if (field === 'priceRangeMin' || field === 'priceRangeMax') {
          const v = Number(body[field]);
          updateData[field] = isNaN(v) ? null : v;
        } else {
          updateData[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        expertProfile: {
          upsert: {
            create: updateData,
            update: updateData,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Provider profile update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الملف المهني' }, { status: 500 });
  }
}
