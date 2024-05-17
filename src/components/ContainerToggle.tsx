'use client';

import { ActionIcon } from '@mantine/core';
import { useCookie } from '@reactuses/core';
import { IconViewportNarrow, IconViewportWide } from '@tabler/icons-react';
import { atom, useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

const uiContainerAtom = atom('narrow');

export function useUiContainer() {
    const [cookieValue, updateCookie, refreshCookie] = useCookie('ui.is-container', {}, 'narrow');
    const [uiContainer, setUiContainer] = useAtom(uiContainerAtom);

    const onToggle = () => {
        updateCookie(cookieValue === 'full' ? 'narrow' : 'full');
        setUiContainer((prev) => (prev === 'full' ? 'narrow' : 'full'));
        refreshCookie();
    };

    useEffect(() => {
        setUiContainer(cookieValue || 'narrow');
    }, [cookieValue, setUiContainer]);

    const isFull = useMemo(() => uiContainer === 'full', [uiContainer]);

    return {
        isFull,
        onToggle,
    };
}

export function ContainerToggle() {
    const { isFull, onToggle } = useUiContainer();

    return (
        <ActionIcon variant={isFull ? 'light' : 'subtle'} onClick={onToggle}>
            {isFull ? <IconViewportWide /> : <IconViewportNarrow />}
        </ActionIcon>
    );
}
