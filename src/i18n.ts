import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'zh'];
export const localePrefix = 'as-needed';

export const localesTranslations = {
    en: 'English',
    zh: '中文',
};

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
    locales,
    localePrefix,
});

export default getRequestConfig(async ({ locale }) => {
    if (!locales.includes(locale)) notFound();

    const messages = (await import(`../locales/${locale}.json`)) as { default: Record<string, string> };

    return {
        messages: messages.default,
    };
});
