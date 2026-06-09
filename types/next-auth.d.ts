import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole, ProviderApprovalStatus } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      globalRole: UserRole;
      approvalStatus?: ProviderApprovalStatus;
      orgId?: string;
      merchantId?: string;
      storeName?: string;
      storeUrl?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    globalRole: UserRole;
    approvalStatus?: ProviderApprovalStatus;
    orgId?: string;
    merchantId?: string;
    storeName?: string;
    storeUrl?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    globalRole: UserRole;
    approvalStatus?: ProviderApprovalStatus;
    orgId?: string;
    merchantId?: string;
    storeName?: string;
    storeUrl?: string;
  }
}
