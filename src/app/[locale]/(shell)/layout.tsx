import { type Metadata, type ResolvingMetadata } from 'next';
import { type PropsWithChildren } from 'react';

import { Search } from '@/components/Search';
import { getPathnameFromMetadataState } from '@/lib/helper';
import { getTranslate } from '@/tolgee/server';
import { ALL_LOCALES } from '@/tolgee/shared';
import { findRouter, getRouterKeywords } from '@/tools';

import { ToolShell } from './_components/ToolShell';

declare type Props = {
    params: {
        locale: string;
    };
};

export async function generateMetadata(_: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const t = await getTranslate();
    const pathname = getPathnameFromMetadataState(parent);

    if (!pathname) {
        return {};
    }

    // remove localPrefix if exists
    const basePath = ALL_LOCALES.includes(pathname.split('/')[1]!) ? pathname.replace(/^\/[^/]+/, '') : pathname;
    const router = findRouter(basePath);
    if (!router) {
        return {};
    }

    return {
        title: t(router.title),
        description: t(router.description),
        keywords: getRouterKeywords(basePath),
    };
}

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <>
            <ToolShell />
            <Search />
        </>
    );
}
