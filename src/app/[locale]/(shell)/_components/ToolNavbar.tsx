'use client';

import { AppShell, Burger, ScrollArea, Stack } from '@mantine/core';

import { Logo } from '@/components/Logo';
import { searchHandlers } from '@/components/Search';
import { SearchControl } from '@/components/SearchControl';
import { toolRouters } from '@/tool';

import { ToolNavbarItem } from './ToolNavbarItem';

export function ToolNavbar({ opened, toggle }: { opened: boolean; toggle: () => void }) {
    return (
        <AppShell.Navbar p='md'>
            <AppShell.Section component={Stack}>
                <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
                <Logo />
                <SearchControl onClick={searchHandlers.open} />
            </AppShell.Section>
            <AppShell.Section grow my='md' component={ScrollArea}>
                {toolRouters.map((router) => (
                    <ToolNavbarItem key={router.url} router={router} level={0} />
                ))}
            </AppShell.Section>
        </AppShell.Navbar>
    );
}
