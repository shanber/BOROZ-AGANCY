import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

function getModel() {
  return (prisma as any).platformSetting as { findMany: Function; findUnique: Function; upsert: Function } | undefined;
}

function isModelMissing(): boolean {
  const model = getModel();
  return !model || typeof model.findMany !== 'function';
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    if (isModelMissing()) {
      return NextResponse.json({ settings: [] });
    }

    const settings = await getModel()!.findMany({
      select: { key: true, value: true, description: true, updatedAt: true },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    if (isModelMissing()) {
      return NextResponse.json({ error: 'لم يتم تهيئة إعدادات المنصة بعد. الرجاء تشغيل الأمر أولاً: npm run prisma:push' }, { status: 400 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (key !== 'platform_commission_rate') {
      return NextResponse.json({ error: 'لا يمكن تعديل هذا الإعداد' }, { status: 400 });
    }

    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) {
      return NextResponse.json({ error: 'يجب إدخال نسبة صحيحة' }, { status: 400 });
    }
    if (num < 0 || num > 80) {
      return NextResponse.json({ error: 'النسبة يجب أن تكون بين 0 و 80' }, { status: 400 });
    }
    const rounded = Math.round(num * 100) / 100;

    const setting = await getModel()!.upsert({
      where: { key },
      create: {
        key,
        value: String(rounded),
        description: 'نسبة عمولة بروز الافتراضية (%)',
      },
      update: { value: String(rounded) },
      select: { key: true, value: true },
    });

    return NextResponse.json({ setting });
  } catch (error: any) {
    console.error('Platform settings PATCH error:', error?.message || error);
    if (error?.code === 'P2021' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
      return NextResponse.json({ error: 'لم يتم إنشاء جدول الإعدادات في قاعدة البيانات. الرجاء تشغيل: npm run prisma:push' }, { status: 400 });
    }
    return NextResponse.json({ error: 'حدث خطأ أثناء الحفظ' }, { status: 500 });
  }
}
