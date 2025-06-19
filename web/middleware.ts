import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isExtPage = request.nextUrl.pathname.startsWith('/ext');

  if (!isLoggedIn && !isLoginPage && !isExtPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|dev-api|prod-api|_next/static|_next/image|favicon.ico|logo/logo.png).*)',
  ],
};