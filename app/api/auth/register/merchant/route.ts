import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma';
import { normalizeToE164 } from '@/app/lib/phone';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, storeName, storeUrl } = body;

    if (!name || !email || !password || !storeName) {
      return NextResponse.json({ error: 'الرجاء تعبئة جميع الحقول المطلوبة' }, { status: 400 });
    }

    // Normalize phone to E.164 for consistent login-by-phone lookups
    let normalizedPhone = '';
    if (phone && String(phone).trim()) {
      const e164 = normalizeToE164(String(phone));
      if (!e164) {
        return NextResponse.json({ error: 'رقم الجوال غير صحيح' }, { status: 400 });
      }
      normalizedPhone = e164;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create Merchant User + Organization transaction
    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone: normalizedPhone,
          globalRole: 'MERCHANT',
        },
      });

      // 2. Create Organization for their store
      const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
      const organization = await tx.organization.create({
        data: {
          name: storeName,
          slug,
          website: storeUrl,
        },
      });

      // 3. Link User to Organization as ADMIN
      await tx.organizationMember.create({
        data: {
          userId: user.id,
          orgId: organization.id,
          role: 'ADMIN',
        },
      });

      // 4. Optionally create a Merchant record (CRM profile for the org)
      await tx.merchant.create({
        data: {
          orgId: organization.id,
          storeName,
          storeUrl: storeUrl || '',
          email,
          phone: normalizedPhone,
          contactName: name,
        },
      });

      return user;
    });

    return NextResponse.json(
      { message: 'تم إنشاء الحساب بنجاح', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Merchant Registration Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء التسجيل' }, { status: 500 });
  }
}
