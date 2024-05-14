import { NavLink } from '@mantine/core';
import { useTranslate } from '@tolgee/react';
import { get } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { usePathname } from '@/navigation';
import type { IToolRouter } from '@/tool';

function isPathActive(router: IToolRouter, pathname: string): boolean {
    if (router.url === pathname) {
        return true;
    }
    if (router.children) {
        return router.children.some((child) => isPathActive(child, pathname));
    }
    return false;
}

function saveStateToLocalStorage(key: string, state: boolean) {
    localStorage.setItem(key, JSON.stringify(state));
}

function getStateFromLocalStorage(key: string, defaultValue: boolean): boolean {
    const state = localStorage.getItem(key);
    return state ? JSON.parse(state) : defaultValue;
}

export function ToolNavbarItem({ router, level }: { router: IToolRouter; level: number }) {
    const { t } = useTranslate();
    const pathname = usePathname();

    const children = useMemo(() => router.children ?? [], [router.children]);

    // 确保所有父和子都是打开的
    const defaultOpened = useMemo(() => {
        return children.length > 0 && isPathActive(router, pathname);
    }, [children.length, pathname, router]);

    const [isOpened, setIsOpened] = useState(() => {
        return getStateFromLocalStorage(router.url, defaultOpened);
    });

    const onChange = (value: boolean) => {
        setIsOpened(value);
        // 需要将所有的子级别也关闭
        if (!value) {
            children.forEach((child) => {
                saveStateToLocalStorage(child.url, false);
            });
        }
    };

    useEffect(() => {
        saveStateToLocalStorage(router.url, isOpened);
    }, [isOpened, router.url]);

    // 对 children 进行排序，将拥有子路由的放在前面
    const renderChildren = useMemo(() => {
        return children.sort((a, b) => {
            const aChildren = a.children ?? [];
            const bChildren = b.children ?? [];

            if (aChildren.length === 0 && bChildren.length > 0) {
                return 1;
            }
            if (aChildren.length > 0 && bChildren.length === 0) {
                return -1;
            }
            return 0;
        });
    }, [children]);

    const metadata = useMemo(() => get(router, 'metadata', {}) as Record<string, never>, [router]);

    if (renderChildren.length === 0) {
        return (
            <NavLink
                active={pathname === router.url}
                key={router.url}
                href={router.url}
                label={t(router.title)}
                leftSection={metadata?.icon}
            />
        );
    }

    return (
        <NavLink
            active={pathname === router.url}
            key={router.url}
            href={router.url}
            label={t(router.title)}
            leftSection={metadata?.icon}
            childrenOffset={16}
            opened={isOpened}
            defaultOpened={isOpened}
            onChange={onChange}
        >
            {renderChildren.map((child) => (
                <ToolNavbarItem key={child.url} router={child} level={level + 1} />
            ))}
        </NavLink>
    );
}
