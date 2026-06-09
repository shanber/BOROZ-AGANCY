import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, portfolioUrl, bio, specialtyTitle, yearsOfExperience, linkedinUrl, services, portfolioItems } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'الرجاء تعبئة جميع الحقول المطلوبة' }, { status: 400 });
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ error: 'يرجى اختيار خدمة واحدة على الأقل يمكنك تقديمها.' }, { status: 400 });
    }

    const hasPortfolioLink = (portfolioUrl && portfolioUrl.trim() !== '') || (linkedinUrl && linkedinUrl.trim() !== '');
    const hasPortfolioItem = portfolioItems && Array.isArray(portfolioItems) && portfolioItems.length > 0;
    
    if (!hasPortfolioLink && !hasPortfolioItem) {
      return NextResponse.json({ error: 'يرجى إضافة عمل سابق واحد على الأقل أو رابط يوضح خبرتك قبل إرسال طلب التسجيل.' }, { status: 400 });
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

    // Create Provider User + ExpertProfile transaction
    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          globalRole: 'PROVIDER',
        },
      });

      // 2. Create ExpertProfile with approvalStatus = PENDING
      const expertProfile = await tx.expertProfile.create({
        data: {
          userId: user.id,
          specialtyTitle: specialtyTitle || '',
          bio: bio || '',
          yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
          portfolioUrl: portfolioUrl || '',
          linkedinUrl: linkedinUrl || '',
          approvalStatus: 'PENDING',
        },
      });

      // 3. Create ExpertService records if services array is provided
      if (services && Array.isArray(services) && services.length > 0) {
        for (const srv of services) {
          if (srv.serviceId) {
            await tx.expertService.create({
              data: {
                expertId: expertProfile.id,
                serviceId: srv.serviceId,
                startingPrice: srv.startingPrice ? parseFloat(srv.startingPrice) : null,
                typicalDeliveryDays: srv.typicalDeliveryDays ? parseInt(srv.typicalDeliveryDays) : null,
              }
            });
          }
        }
      }

      // 4. Create PortfolioItems if provided
      if (portfolioItems && Array.isArray(portfolioItems) && portfolioItems.length > 0) {
        for (const item of portfolioItems) {
          if (item.title) {
            await tx.portfolioItem.create({
              data: {
                expertId: expertProfile.id,
                title: item.title,
                description: item.description || '',
                projectUrl: item.projectUrl || '',
                serviceId: item.serviceId || null,
              }
            });
          }
        }
      }

      return user;
    });

    return NextResponse.json(
      { message: 'تم إنشاء الحساب بنجاح، يرجى انتظار الموافقة', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Provider Registration Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء التسجيل' }, { status: 500 });
  }
}
