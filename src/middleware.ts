import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { BASE_APP_PATH, SERVER_URL } from './utils/constants';
import { IUserCourse } from './interfaces/courses/course.interface';
import HTTP_METHODS from './utils/httpsMethods';
import SERVER_API_ENDPOINTS from './utils/serverApiEndpoints';

export default async function middleware(req: NextRequest, event: NextFetchEvent) {

  const { pathname } = req.nextUrl;
  if (
    pathname.match(new RegExp("/((api|_next/static|_next/image|favicon|logo).*)"))
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (pathname.startsWith('/login') && token?.error) {
    return NextResponse.next();
  }

  if (token?.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(new URL(BASE_APP_PATH + 'login', req.url));
  }

  if (pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL(BASE_APP_PATH, req.url));
  }

  if(pathname.match(/^\/courses\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/)) {
    const courseId = pathname.split('/')[2];

    const response = await fetch(`${SERVER_URL}${SERVER_API_ENDPOINTS.GET_USER_COURSES}`, {
      method: HTTP_METHODS.GET,
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
      },
    });
    
    const data = await response.json() as IUserCourse;

    if(!data.enrollments.some(enrollment => enrollment.id === courseId)) {
      return NextResponse.redirect(new URL(BASE_APP_PATH + `courses/${courseId}`, req.url));
    }
  }

  const authMiddleware = withAuth({
    pages: {
      signIn: `/login`,
    },
  });

  // @ts-expect-error
  return authMiddleware(req, event);
}