import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';
import { serverEnv } from '@/lib/env';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage || pathname === '/api/admin/login') {
    return response;
  }

  if (isAdminRoute) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(serverEnv.jwtSecret), {
        issuer: 'cyber-academy',
        audience: 'cyber-academy-admin',
      });
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
