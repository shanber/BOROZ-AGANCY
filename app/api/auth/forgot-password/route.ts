import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma';
import { normalizeToE164, phoneSearchVariants } from '@/app/lib/phone';

export const dynamic = 'force-dynamic';

function validatePassword(password: string) {
  if (!password) return 'يرجى إدخال كلمة المرور الجديدة';
  if (password.length < 8) return 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل';
  if (password.length > 100) return 'كلمة المرور الجديدة طويلة جدًا';
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return 'كلمة المرور الجديدة يجب أن تحتوي على أحرف وأرقام';
  }
  return '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const newPassword = String(body.newPassword || '').trim();

    if (!email) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني' }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: 'يرجى إدخال رقم الجوال المسجل' }, { status: 400 });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const normalizedPhone = normalizeToE164(phone);
    if (!normalizedPhone) {
      return NextResponse.json({ error: 'رقم الجوال غير صحيح' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        phone: { in: phoneSearchVariants(normalizedPhone) },
      },
      select: {
        id: true,
        password: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'تعذر التحقق من بيانات الحساب' }, { status: 400 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'لا يمكن استعادة كلمة المرور لهذا الحساب حاليًا' }, { status: 400 });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تختلف عن الحالية' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء استعادة كلمة المرور' }, { status: 500 });
  }
}
