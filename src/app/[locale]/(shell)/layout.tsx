// noinspection HtmlRequiredTitleElement
'use client';

import { AppShell, Burger, Group, Input, NavLink, ScrollArea, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconGauge } from '@tabler/icons-react';
import { type PropsWithChildren } from 'react';

import { ColorSchemaToggle } from '@/components/ColorSchemaToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { toolRouter } from '@/tools';

export default function RootLayout({ children }: PropsWithChildren) {
    const [opened, { toggle }] = useDisclosure();
    console.log(toolRouter);
    return (
        <AppShell
            layout='alt'
            header={{ height: 48 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding='md'
        >
            <AppShell.Header>
                <Group h={'100%'} px={'md'} gap={'md'}>
                    <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
                    <Logo size={'100%'} hiddenFrom='sm' />

                    <Group ml={'auto'} h={'100%'} gap={'md'}>
                        <LanguageToggle />
                        <ColorSchemaToggle />
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p='md'>
                <AppShell.Section component={Stack}>
                    <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
                    <Logo />
                    <Input placeholder={'Search is simple...'} />
                </AppShell.Section>
                <AppShell.Section grow my='md' component={ScrollArea}>
                    {Array(60)
                        .fill(0)
                        .map((_, index) => (
                            <NavLink
                                key={index}
                                href='#required-for-focus'
                                label='First parent link'
                                leftSection={<IconGauge size={'1em'} />}
                                childrenOffset={28}
                                defaultOpened
                            >
                                <NavLink href='#required-for-focus' label='First child link' />
                                <NavLink label='Second child link' href='#required-for-focus' />
                                <NavLink label='Nested parent link' childrenOffset={28} href='#required-for-focus'>
                                    <NavLink label='First child link' href='#required-for-focus' />
                                    <NavLink label='Second child link' href='#required-for-focus' />
                                    <NavLink label='Third child link' href='#required-for-focus' />
                                </NavLink>
                            </NavLink>
                        ))}
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
