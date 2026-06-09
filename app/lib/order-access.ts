import type { Session } from 'next-auth';

export function merchantOrderOwnershipFilter(session: Session) {
  return { userId: session.user.id };
}
