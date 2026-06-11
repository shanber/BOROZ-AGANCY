import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        bio: true,
        city: true,
        country: true,
        globalRole: true,
        storeName: true,
        storeUrl: true,
        businessType: true,
        companyName: true,
        storeNotes: true,
        preferredContact: true,
        expertProfile: {
          select: {
            id: true,
            specialtyTitle: true,
            bio: true,
            yearsOfExperience: true,
            portfolioUrl: true,
            linkedinUrl: true,
            availability: true,
            priceRangeMin: true,
            priceRangeMax: true,
            preferredProjectTypes: true,
            sallaExperience: true,
            approvalStatus: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'لم يتم العثور على المستخدم' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل الملف الشخصي' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = ['name', 'phone', 'avatar', 'bio', 'city', 'country'] as const;
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
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الملف الشخصي' }, { status: 500 });
  }
}
