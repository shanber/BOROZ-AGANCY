import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            expertProfile: true,
            orgMembers: {
              where: { isActive: true },
              take: 1,
              include: {
                organization: {
                  include: {
                    merchants: {
                      where: { deletedAt: null },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        });

        if (!user) {
          throw new Error('لم يتم العثور على حساب بهذا البريد الإلكتروني');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('كلمة المرور غير صحيحة');
        }

        if (!user.isActive) {
          throw new Error('تم تعطيل حسابك');
        }

        const organization = user.orgMembers[0]?.organization;
        const merchant = organization?.merchants.find((item) => item.email === user.email) || organization?.merchants[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          globalRole: user.globalRole,
          approvalStatus: user.expertProfile?.approvalStatus, // Only relevant for providers
          orgId: organization?.id || undefined,
          merchantId: merchant?.id || undefined,
          storeName: merchant?.storeName || organization?.name || undefined,
          storeUrl: merchant?.storeUrl || organization?.website || undefined,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.globalRole = user.globalRole;
        token.approvalStatus = user.approvalStatus;
        token.orgId = user.orgId;
        token.merchantId = user.merchantId;
        token.storeName = user.storeName;
        token.storeUrl = user.storeUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.globalRole = token.globalRole;
        session.user.approvalStatus = token.approvalStatus;
        session.user.orgId = token.orgId;
        session.user.merchantId = token.merchantId;
        session.user.storeName = token.storeName;
        session.user.storeUrl = token.storeUrl;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
