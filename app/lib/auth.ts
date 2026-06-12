import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { isLikelyEmail, isLikelyPhone, normalizeToE164, phoneSearchVariants } from './phone';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'البريد الإلكتروني أو رقم الجوال', type: 'text' },
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize(credentials) {
        const identifier = (credentials?.identifier || credentials?.email || '').trim();

        if (!credentials?.password) {
          throw new Error('كلمة المرور مطلوبة');
        }
        if (!identifier) {
          throw new Error('الرجاء إدخال البريد الإلكتروني أو رقم الجوال');
        }

        const userInclude = {
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
        } as const;

        let user = null;

        if (isLikelyEmail(identifier)) {
          user = await prisma.user.findUnique({
            where: { email: identifier },
            include: userInclude,
          });
        } else if (isLikelyPhone(identifier)) {
          const e164 = normalizeToE164(identifier);
          if (!e164) {
            // Generic message: never reveal whether a number exists
            throw new Error('بيانات الدخول غير صحيحة');
          }
          user = await prisma.user.findFirst({
            where: { phone: { in: phoneSearchVariants(e164) } },
            orderBy: { createdAt: 'asc' },
            include: userInclude,
          });
        }

        if (!user) {
          // Same message for unknown email/phone and wrong password
          throw new Error('بيانات الدخول غير صحيحة');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('بيانات الدخول غير صحيحة');
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
