import { Anchor, AppShell, Breadcrumbs, Burger, Group } from '@mantine/core';
import { useMemo } from 'react';

import { ColorSchemaToggle } from '@/components/ColorSchemaToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { usePathname } from '@/i18n';
import { findRouter } from '@/tools';

function HeaderBreadcrumbs() {
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
                    {router.name}
                </Anchor>
            ))}
        </Breadcrumbs>
    );
}

export function ToolHeader({ opened, toggle }: { opened: boolean; toggle: () => void }) {
    return (
        <AppShell.Header>
            <Group h={'100%'} px={'md'} gap={'md'}>
                <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
                <Logo size={'100%'} hiddenFrom='sm' />
                <HeaderBreadcrumbs />

                <Group ml={'auto'} h={'100%'} gap={'md'}>
                    <LanguageToggle />
                    <ColorSchemaToggle />
                </Group>
            </Group>
        </AppShell.Header>
    );
}
