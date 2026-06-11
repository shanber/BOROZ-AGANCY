import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, storeName, storeUrl } = body;

    if (!name || !email || !password || !storeName) {
      return NextResponse.json({ error: 'الرجاء تعبئة جميع الحقول المطلوبة' }, { status: 400 });
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
          phone: phone || '',
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
          phone: '',
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
