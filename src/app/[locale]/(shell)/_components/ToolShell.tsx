'use client';

import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { type PropsWithChildren } from 'react';

import { useUiContainer } from '@/components/ContainerToggle';

import { ToolHeader } from './ToolHeader';
import { ToolNavbar } from './ToolNavbar';

export function ToolShell({ children }: PropsWithChildren) {
    const { isFull } = useUiContainer();
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            layout='alt'
            header={{ height: 48 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding='md'
        >
            <ToolHeader opened={opened} toggle={toggle} />
            <ToolNavbar opened={opened} toggle={toggle} />
            <AppShell.Main>
                {isFull && children}
                {!isFull && <Container>{children}</Container>}
            </AppShell.Main>
        </AppShell>
    );
}
