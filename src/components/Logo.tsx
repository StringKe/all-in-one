'use client';

import { Box, rem, type BoxProps } from '@mantine/core';
import clsx from 'clsx';
import { Honk } from 'next/font/google';

const honk = Honk({
    subsets: ['latin'],
});

export function Logo({
    size,
    style,
    className,
    ...others
}: BoxProps & {
    size?: number | string;
}) {
    return (
        <Box
            className={clsx(className, honk.className)}
            style={{
                ...style,
                userSelect: 'none',
                fontSize: `calc( ${rem(size ?? '24px')} * 1.15 )`,
                lineHeight: `calc( ${rem(size ?? '24px')} * 1.15 )`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `8px`,
            }}
            {...others}
        >
            Yzos Tools
        </Box>
    );
}
