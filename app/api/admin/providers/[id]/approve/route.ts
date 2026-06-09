import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.globalRole !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const expertId = params.id;

    const expertProfile = await prisma.expertProfile.findUnique({
      where: { id: expertId },
    });

    if (!expertProfile) {
      return NextResponse.json({ error: 'لم يتم العثور على الحساب' }, { status: 404 });
    }

    const updatedProfile = await prisma.expertProfile.update({
      where: { id: expertId },
      data: {
        approvalStatus: 'APPROVED',
        reviewedAt: new Date(),
        reviewedById: session.user.id,
      },
    });

    return NextResponse.json({ message: 'تم الموافقة على الحساب بنجاح', profile: updatedProfile });
  } catch (error) {
    console.error('Approve Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء الموافقة على الحساب' }, { status: 500 });
  }
}
