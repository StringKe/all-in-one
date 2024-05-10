'use client';

import { rem } from '@mantine/core';
import { createSpotlight, Spotlight, type SpotlightActionData } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useMemo } from 'react';

import { getFlatRouter } from '@/tools';

export const [searchStore, searchHandlers] = createSpotlight();

export function Search() {
    const flatRouters = useMemo(() => getFlatRouter(), []);

    const actions: SpotlightActionData[] = useMemo(() => {
        return flatRouters.map((router) => ({
            id: router.id,
            label: router.name,
            description: router.url,
            keywords: router.url.split(' '),
        }));
    }, [flatRouters]);

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
            searchProps={{
                leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} />,
                placeholder: 'Search documentation...',
            }}
        />
    );
}
