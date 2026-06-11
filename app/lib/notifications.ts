import type { Prisma, NotificationType } from '@prisma/client';

type NotificationInput = {
  orgId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string | null;
  entityId?: string | null;
  url?: string | null;
  dedupeWindowMinutes?: number;
};

export async function createNotification(
  tx: Prisma.TransactionClient,
  input: NotificationInput
) {
  const dedupeSince = new Date(Date.now() - (input.dedupeWindowMinutes ?? 5) * 60 * 1000);

  const existing = await tx.notification.findFirst({
    where: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      url: input.url ?? null,
      createdAt: { gte: dedupeSince },
    },
    select: { id: true },
  });

  if (existing) {
    return existing;
  }

  return tx.notification.create({
    data: {
      orgId: input.orgId,
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      url: input.url ?? null,
      isRead: false,
    },
    select: { id: true },
  });
}

export async function createNotificationsForUsers(
  tx: Prisma.TransactionClient,
  users: Array<{ userId: string; orgId: string }>,
  input: Omit<NotificationInput, 'userId' | 'orgId'>
) {
  const uniqueUsers = Array.from(new Map(users.map((user) => [user.userId, user])).values());

  for (const user of uniqueUsers) {
    await createNotification(tx, {
      ...input,
      userId: user.userId,
      orgId: user.orgId,
    });
  }
}
