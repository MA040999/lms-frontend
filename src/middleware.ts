import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { BASE_APP_PATH } from './utils/constants';

export default async function middleware(req: NextRequest, event: NextFetchEvent) {

  const { pathname } = req.nextUrl;
  if (
    pathname.match(new RegExp("/((api|_next/static|_next/image|favicon|logo).*)"))
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL(BASE_APP_PATH, req.url));
  }

  const authMiddleware = withAuth({
    pages: {
      signIn: `/login`,
    },
  });

  // @ts-expect-error
  return authMiddleware(req, event);
}