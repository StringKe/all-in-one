'use client';

import { AppShell, Burger, Group } from '@mantine/core';

import { ColorSchemaToggle } from '@/components/ColorSchemaToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';

import { ToolHeaderBreadcrumbs } from './ToolHeaderBreadcrumbs';

export function ToolHeader({ opened, toggle }: { opened: boolean; toggle: () => void }) {
    return (
        <AppShell.Header>
            <Group h={'100%'} px={'md'} gap={'md'}>
                <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
                <Logo size={'100%'} hiddenFrom='sm' />
                <ToolHeaderBreadcrumbs />

                <Group ml={'auto'} h={'100%'} gap={'md'}>
                    <LanguageToggle />
                    <ColorSchemaToggle />
                </Group>
            </Group>
        </AppShell.Header>
    );
}
