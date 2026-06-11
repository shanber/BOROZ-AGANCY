import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/lib/prisma';
import { authOptions } from '@/app/lib/auth';
import { getProjectParticipantWhere, getRoleLabel, getMessagingBlockedReason } from '@/app/lib/project-utils';
import { createNotificationsForUsers } from '@/app/lib/notifications';

export const dynamic = 'force-dynamic';

const MAX_MESSAGE_LENGTH = 2000;

function containsDirectContact(text: string) {
  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phonePattern = /\+?\d(?:[\s-]?\d){7,}/;
  const whatsappPattern = /(whatsapp|واتساب)/i;

  return emailPattern.test(text) || phonePattern.test(text) || whatsappPattern.test(text);
}

export async function GET(_request: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: getProjectParticipantWhere(session, params.projectId),
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول إلى رسائل هذا المشروع' }, { status: 403 });
    }

    const messages = await prisma.projectMessage.findMany({
      where: {
        projectId: project.id,
        isInternal: false,
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        body: true,
        createdAt: true,
        projectId: true,
        senderUserId: true,
        senderUser: {
          select: {
            id: true,
            name: true,
            globalRole: true,
          },
        },
      },
    });

    return NextResponse.json(
      messages.map((message) => ({
        id: message.id,
        body: message.body,
        createdAt: message.createdAt,
        projectId: message.projectId,
        sender: {
          id: message.senderUser.id,
          name: message.senderUser.name || getRoleLabel(message.senderUser.globalRole),
          role: message.senderUser.globalRole,
          roleLabel: getRoleLabel(message.senderUser.globalRole),
        },
        isMine: message.senderUserId === session.user.id,
      }))
    );
  } catch (error) {
    console.error('Project messages GET error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل رسائل المشروع' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح لك بإرسال رسالة' }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: getProjectParticipantWhere(session, params.projectId),
      select: {
        id: true,
        orgId: true,
        status: true,
        order: {
          select: {
            userId: true,
          },
        },
        acceptedOffer: {
          select: {
            expertProfile: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'غير مصرح لك بإرسال رسالة في هذا المشروع' }, { status: 403 });
    }

    const messagingBlockedReason = getMessagingBlockedReason(project.status);
    if (messagingBlockedReason) {
      return NextResponse.json({ error: messagingBlockedReason }, { status: 409 });
    }

    const body = await request.json();
    const messageBody = String(body.body || '').trim();

    if (!messageBody) {
      return NextResponse.json({ error: 'نص الرسالة مطلوب' }, { status: 400 });
    }

    if (messageBody.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `الحد الأقصى لنص الرسالة هو ${MAX_MESSAGE_LENGTH} حرف` }, { status: 400 });
    }

    if (containsDirectContact(messageBody)) {
      return NextResponse.json(
        { error: 'يرجى إبقاء التواصل داخل بروز دون مشاركة وسائل تواصل مباشرة' },
        { status: 400 }
      );
    }

    const message = await prisma.$transaction(async (tx) => {
      const createdMessage = await tx.projectMessage.create({
        data: {
          projectId: project.id,
          senderUserId: session.user.id,
          body: messageBody,
          isInternal: false,
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          projectId: true,
          senderUserId: true,
          senderUser: {
            select: {
              id: true,
              name: true,
              globalRole: true,
            },
          },
        },
      });

      const recipientUsers = new Map<string, { userId: string; orgId: string }>();

      if (project.order.userId && project.order.userId !== session.user.id) {
        recipientUsers.set(project.order.userId, { userId: project.order.userId, orgId: project.orgId });
      }

      const providerUserId = project.acceptedOffer?.expertProfile?.userId;
      if (providerUserId && providerUserId !== session.user.id) {
        recipientUsers.set(providerUserId, { userId: providerUserId, orgId: project.orgId });
      }

      if (session.user.globalRole !== 'ADMIN') {
        const adminUsers = await tx.user.findMany({
          where: {
            globalRole: 'ADMIN',
            isActive: true,
            id: { not: session.user.id },
          },
          select: { id: true },
        });

        adminUsers.forEach((user) => {
          recipientUsers.set(user.id, { userId: user.id, orgId: project.orgId });
        });
      }

      await createNotificationsForUsers(
        tx,
        Array.from(recipientUsers.values()),
        {
          type: 'PROJECT_MESSAGE_RECEIVED',
          title: 'رسالة جديدة في المشروع',
          message: 'وصلتك رسالة جديدة داخل مساحة المشروع.',
          entityType: 'PROJECT_MESSAGE',
          entityId: createdMessage.id,
          url: `/dashboard/projects/${project.id}`,
          dedupeWindowMinutes: 1,
        }
      );

      return createdMessage;
    });

    return NextResponse.json({
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      projectId: message.projectId,
      sender: {
        id: message.senderUser.id,
        name: message.senderUser.name || getRoleLabel(message.senderUser.globalRole),
        role: message.senderUser.globalRole,
        roleLabel: getRoleLabel(message.senderUser.globalRole),
      },
      isMine: message.senderUserId === session.user.id,
    });
  } catch (error) {
    console.error('Project messages POST error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال الرسالة' }, { status: 500 });
  }
}
