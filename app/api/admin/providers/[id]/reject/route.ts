import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const expertId = params.id;
    const body = await req.json();
    const { rejectionReason } = body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return NextResponse.json({ error: 'الرجاء إدخال سبب الرفض' }, { status: 400 });
    }

    const expertProfile = await prisma.expertProfile.findUnique({
      where: { id: expertId },
    });

    if (!expertProfile) {
      return NextResponse.json({ error: 'لم يتم العثور على الحساب' }, { status: 404 });
    }

    const updatedProfile = await prisma.expertProfile.update({
      where: { id: expertId },
      data: {
        approvalStatus: 'REJECTED',
        rejectionReason: rejectionReason,
        reviewedAt: new Date(),
        reviewedById: session.user.id,
      },
    });

    return NextResponse.json({ message: 'تم رفض الحساب', profile: updatedProfile });
  } catch (error) {
    console.error('Reject Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء رفض الحساب' }, { status: 500 });
  }
}
