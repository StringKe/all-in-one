import { AppShell, Burger, Group } from '@mantine/core';

import { ColorSchemaToggle } from '@/components/ColorSchemaToggle';
import { ContainerToggle } from '@/components/ContainerToggle';
import { GithubRepoButton } from '@/components/GithubRepoButton';
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
                    <ContainerToggle />
                    <LanguageToggle />
                    <ColorSchemaToggle />
                    <GithubRepoButton />
                </Group>
            </Group>
        </AppShell.Header>
    );
}
