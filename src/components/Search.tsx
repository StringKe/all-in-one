'use client';

import { rem } from '@mantine/core';
import { createSpotlight, Spotlight, type SpotlightActionData } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useTranslate } from '@tolgee/react';
import { useMemo } from 'react';

import { getFlatRouter, getRouterKeywords } from '@/tools';

export const [searchStore, searchHandlers] = createSpotlight();

export function Search() {
    const { t } = useTranslate();
    const flatRouters = useMemo(() => getFlatRouter(), []);

    const actions: SpotlightActionData[] = useMemo(() => {
        return flatRouters.map((router) => ({
            id: router.url,
            label: t(router.title),
            description: t(router.description),
            keywords: getRouterKeywords(router.url),
        }));
    }, [flatRouters, t]);

    return (
        <Spotlight
            store={searchStore}
            shortcut={['mod + K', 'mod + P', '/']}
            actions={actions}
            tagsToIgnore={[]}
            highlightQuery
            clearQueryOnClose
            radius='md'
            limit={7}
            nothingFound='Nothing found...'
            triggerOnContentEditable={false}
            searchProps={{
                leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} />,
                placeholder: 'Search documentation...',
            }}
        />
    );
}
