import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/'];
const AUTH_ROUTES = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle session clearing
  if (request.nextUrl.searchParams.get('clearSession') === 'true') {
    const url = request.nextUrl.clone();
    url.searchParams.delete('clearSession');
    const response = NextResponse.redirect(url);
    const allCookies = request.cookies.getAll();
    const sessionCookies = allCookies.filter(c => c.name.endsWith('_session') || c.name.endsWith('-session'));
    sessionCookies.forEach(c => {
      response.cookies.delete(c.name);
    });
    return response;
  }

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for Laravel Sanctum session cookie (name is derived from APP_NAME, e.g. "docubrain-session")
  const hasSession = request.cookies.getAll().some(
    (c) => c.name.endsWith('_session') || c.name.endsWith('-session')
  );

  // If protected route without session → redirect to login with return path
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated user tries to access auth pages → redirect to dashboard
  if (hasSession && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (internal Next.js APIs)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*|landing).*)',
  ],
};

export default proxy;
