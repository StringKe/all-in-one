// noinspection HtmlRequiredTitleElement

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/nprogress/styles.css';
import 'flag-icons/css/flag-icons.min.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type PropsWithChildren } from 'react';

import { RootStyleRegistry } from '@/components/EmotionRootStyleRegistry';
import theme from '@/lib/theme';
import { TolgeeNextProvider } from '@/tolgee/client';
import { ALL_LOCALES, DEFAULT_LOCALE, getStaticData } from '@/tolgee/shared';

export const metadata: Metadata = {
    title: {
        default: 'Yzos Tools',
        template: '%s | Yzos Tools',
    },
    description: 'All in one tools for encode, decode, transform, image convert and more.',
    icons: [
        { rel: 'icon', url: '/favicon.icon', type: 'image/x-icon' },
        {
            rel: 'icon',
            url: '/favicon.png',
            type: 'image/png',
        },
        { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    authors: {
        name: 'StringKe',
        url: 'https://github.com/stringke',
    },
    keywords: ['all in one', 'tools', 'encode', 'decode', 'transform', 'image convert'],
};

export default async function LocaleLayout({
    children,
    params: { locale },
}: PropsWithChildren<{
    params: { locale: string };
}>) {
    if (!ALL_LOCALES.includes(locale)) {
        notFound();
    }

    const locales = await getStaticData([DEFAULT_LOCALE, locale]);

    return (
        <html lang={locale}>
            <head>
                <ColorSchemeScript />
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no' />
            </head>
            <body>
                <TolgeeNextProvider locale={locale} locales={locales}>
                    <RootStyleRegistry>
                        <MantineEmotionProvider>
                            <MantineProvider
                                defaultColorScheme={'auto'}
                                theme={theme}
                                stylesTransform={emotionTransform}
                                classNamesPrefix={'app'}
                                withCssVariables={true}
                                withGlobalClasses={true}
                                withStaticClasses={false}
                                deduplicateCssVariables={true}
                            >
                                {children}
                            </MantineProvider>
                        </MantineEmotionProvider>
                    </RootStyleRegistry>
                </TolgeeNextProvider>
                <GoogleAnalytics gaId='G-79DHRNM73Y' />
            </body>
        </html>
    );
}
