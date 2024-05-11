import { Anchor, Breadcrumbs } from '@mantine/core';
import { useTranslate } from '@tolgee/react';
import { useMemo } from 'react';

import { usePathname } from '@/navigation';
import { findRouter } from '@/tools';

export function ToolHeaderBreadcrumbs() {
    const pathname = usePathname();
    const { t } = useTranslate();

    const paths = useMemo(() => {
        const chunks = pathname.split('/').filter(Boolean);
        return chunks.map((_, index) => `/${chunks.slice(0, index + 1).join('/')}`);
    }, [pathname]);

    const routers = useMemo(() => paths.map(findRouter).filter(Boolean), [paths]);

    return (
        <Breadcrumbs visibleFrom={'md'}>
            {routers.map((router) => (
                <Anchor key={router.url} href={router.url}>
                    {t(router.title)}
                </Anchor>
            ))}
        </Breadcrumbs>
    );
}
