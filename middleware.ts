import {NextRequest, NextResponse} from 'next/server';
import {routing} from './lib/routing';

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${routing.defaultLocale}${pathname === '/' ? '' : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};
