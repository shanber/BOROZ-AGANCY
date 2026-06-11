import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect from root /dashboard
    if (path === '/dashboard') {
      if (token.globalRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/admin', req.url));
      } else if (token.globalRole === 'PROVIDER') {
        if (token.approvalStatus === 'APPROVED') {
          return NextResponse.redirect(new URL('/dashboard/provider', req.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard/provider/pending', req.url));
        }
      }
      // Merchant stays at /dashboard
    }

    // 1. Admin Protection
    if (path.startsWith('/dashboard/admin')) {
      if (token.globalRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // 2. Provider Access Control
    if (token.globalRole === 'PROVIDER') {
      const blockedStatuses = ['PENDING', 'REJECTED', 'SUSPENDED'];
      const isBlocked = blockedStatuses.includes(token.approvalStatus as string);

      // If the provider is blocked (not approved), prevent access to all dashboard routes EXCEPT /pending
      if (
        isBlocked &&
        path.startsWith('/dashboard') &&
        !path.startsWith('/dashboard/provider/pending')
      ) {
        return NextResponse.redirect(new URL('/dashboard/provider/pending', req.url));
      }

      // If the provider IS approved, prevent them from accessing /pending
      if (
        token.approvalStatus === 'APPROVED' &&
        path.startsWith('/dashboard/provider/pending')
      ) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Protect all dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
