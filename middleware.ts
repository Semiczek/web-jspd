import {NextRequest, NextResponse} from 'next/server';

const locales = ['cs', 'sk', 'en', 'de', 'es', 'fr'] as const;

function hasLocalePrefix(pathname: string) {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/cs' : `/cs${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!trpc).*)']
};
