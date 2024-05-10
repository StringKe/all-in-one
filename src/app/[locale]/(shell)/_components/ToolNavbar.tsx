import { AppShell, Burger, Input, NavLink, ScrollArea, Stack } from '@mantine/core';
import { get } from 'lodash-es';
import { useMemo } from 'react';

import { Logo } from '@/components/Logo';
import { usePathname } from '@/i18n';
import { toolRouter } from '@/tools';
import { type IToolRouter } from '@/tools/types';

function RenderRouter({ router, level }: { router: IToolRouter; level: number }) {
    const pathname = usePathname();

    // 确保所有父和子都是打开的
    const defaultOpened = useMemo(() => {
        if (router.children.length === 0) {
            return false;
        }
        if (router.url === pathname) {
            return true;
        }
        return router.children.some((child) => {
            if (child.url === pathname) {
                return true;
            }
            return child.children.some((child) => {
                return child.url === pathname;
            });
        });
    }, [pathname, router.children, router.url]);

    // 对 children 进行排序，将拥有子路由的放在前面
    const renderChildren = useMemo(() => {
        return router.children.sort((a, b) => {
            if (a.children.length === 0 && b.children.length > 0) {
                return 1;
            }
            if (a.children.length > 0 && b.children.length === 0) {
                return -1;
            }
            return 0;
        });
    }, [router.children]);

    const metadata = useMemo(() => get(router, 'metadata', {}) as Record<string, never>, [router]);

    if (renderChildren.length === 0) {
        return (
            <NavLink active={pathname === router.url} key={router.id} href={router.url} label={router.name} leftSection={metadata?.icon} />
        );
    }

    return (
        <NavLink
            key={router.id}
            href={router.url}
            label={router.name}
            leftSection={metadata?.icon}
            childrenOffset={16}
            defaultOpened={defaultOpened}
        >
            {renderChildren.map((child) => (
                <RenderRouter key={child.id} router={child} level={level + 1} />
            ))}
        </NavLink>
    );
}

export function ToolNavbar({ opened, toggle }: { opened: boolean; toggle: () => void }) {
    return (
        <AppShell.Navbar p='md'>
            <AppShell.Section component={Stack}>
                <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
                <Logo />
                <Input placeholder={'Search is simple...'} />
            </AppShell.Section>
            <AppShell.Section grow my='md' component={ScrollArea}>
                {toolRouter.map((router) => (
                    <RenderRouter key={router.id} router={router} level={0} />
                ))}
            </AppShell.Section>
        </AppShell.Navbar>
    );
}
