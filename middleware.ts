import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Allow API, Next internals, static files and favicon to pass through
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.') // likely a file (e.g. .png, .css)
  ) {
    return NextResponse.next();
  }

  // If logged in and visiting any non-dashboard page, redirect to /dashboard
  if (token && !pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If not logged in (unsigned user), redirect to the home page '/'
  // This enforces: unsigned users visiting any non-exempt route will be sent to '/'
  if (!token && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run the middleware for most application routes, but internal/static/API
  // paths are excluded in the function above as a safeguard.
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
};
