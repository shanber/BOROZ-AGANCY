import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = String(body.currentPassword || '').trim();
    const newPassword = String(body.newPassword || '').trim();

    if (!currentPassword) {
      return NextResponse.json({ error: 'يرجى إدخال كلمة المرور الحالية' }, { status: 400 });
    }
    if (!newPassword) {
      return NextResponse.json({ error: 'يرجى إدخال كلمة المرور الجديدة' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
    }
    if (newPassword.length > 100) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة طويلة جدًا' }, { status: 400 });
    }
    if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تحتوي على أحرف وأرقام' }, { status: 400 });
    }
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تختلف عن الحالية' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'لم يتم العثور على المستخدم' }, { status: 404 });
    }
    if (!user.password) {
      return NextResponse.json({ error: 'لا يمكن تغيير كلمة المرور لهذا الحساب' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تغيير كلمة المرور' }, { status: 500 });
  }
}
