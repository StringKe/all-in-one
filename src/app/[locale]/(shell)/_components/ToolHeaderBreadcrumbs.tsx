import { Anchor, Breadcrumbs } from '@mantine/core';
import { useMemo } from 'react';

import { usePathname } from '@/i18n';
import { findRouter } from '@/tools';

export function ToolHeaderBreadcrumbs() {
    const pathname = usePathname();
    const paths = useMemo(() => {
        const chunks = pathname.split('/').filter(Boolean);
        return chunks.map((_, index) => `/${chunks.slice(0, index + 1).join('/')}`);
    }, [pathname]);

    const routers = useMemo(() => paths.map(findRouter).filter(Boolean), [paths]);

    return (
        <Breadcrumbs visibleFrom={'md'}>
            {routers.map((router) => (
                <Anchor key={router.url} href={router.url}>
                    {router.title}
                </Anchor>
            ))}
        </Breadcrumbs>
    );
}
