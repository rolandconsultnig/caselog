import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/select-state',
    },
  }
);

// Protect all routes under /dashboard; allow auth and api routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
