import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';

import { ALL_LOCALES, DEFAULT_LOCALE } from '@/tolgee/shared';

const i18nMiddleware = createMiddleware({
    locales: ALL_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
    request.headers.set('pathname', request.nextUrl.pathname);
    return i18nMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|opengraph-image|twitter-image).*)'],
};
