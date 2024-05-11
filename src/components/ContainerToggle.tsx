'use client';

import { ActionIcon } from '@mantine/core';
import { IconViewportNarrow, IconViewportWide } from '@tabler/icons-react';

import { api } from '@/trpc/react';

export function ContainerToggle() {
    const { data: isFull, refetch } = api.config.isContainer.useQuery();
    const { mutateAsync } = api.config.setIsContainer.useMutation();

    const onToggle = () => {
        mutateAsync({ isContainer: !isFull }).then(() => refetch());
    };

    return (
        <ActionIcon variant={isFull ? 'light' : 'subtle'} onClick={onToggle}>
            {isFull ? <IconViewportWide /> : <IconViewportNarrow />}
        </ActionIcon>
    );
}
