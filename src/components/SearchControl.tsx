'use client';

import { Group, rem, Text, UnstyledButton, type BoxProps, type ElementProps } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchControlProps extends BoxProps, ElementProps<'button'> {}

export function SearchControl({ ...others }: SearchControlProps) {
    return (
        <UnstyledButton
            {...others}
            sx={(theme, helper) => ({
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                border: '1px solid',
                borderRadius: theme.radius.md,
                color: 'var(--mantine-color-placeholder)',
                transition: 'all 230ms ease-in-out',
                willChange: 'border-color, background-color, color, box-shadow',

                '&:hover': {
                    [helper.light]: {
                        boxShadow: theme.shadows.xs,
                        borderColor: theme.colors.gray[4],
                        backgroundColor: theme.white,
                    },
                    [helper.dark]: {
                        boxShadow: theme.shadows.xs,
                        borderColor: theme.colors.dark[5],
                        backgroundColor: theme.colors.dark[7],
                    },
                },

                [helper.light]: {
                    borderColor: theme.colors.gray[3],
                    backgroundColor: theme.white,
                },
                [helper.dark]: {
                    borderColor: theme.colors.dark[4],
                    backgroundColor: theme.colors.dark[6],
                },
            })}
        >
            <Group gap='xs' w={'100%'} justify='space-between'>
                <IconSearch style={{ width: rem(15), height: rem(15) }} stroke={1.5} />
                <Text fz='sm' c='dimmed' pr={80}>
                    Search
                </Text>
                <Text
                    fw={700}
                    sx={(theme, helper) => ({
                        fontSize: '11px',
                        lineHeight: 1,
                        padding: '4px 7px',
                        borderRadius: theme.radius.sm,
                        border: '1px solid',
                        fontWeight: 'bold',

                        [helper.light]: {
                            color: theme.colors.gray[7],
                            borderColor: theme.colors.gray[2],
                            backgroundColor: theme.colors.gray[0],
                        },
                        [helper.dark]: {
                            color: theme.colors.dark[0],
                            borderColor: theme.colors.dark[7],
                            backgroundColor: theme.colors.dark[7],
                        },
                    })}
                >
                    Ctrl + K
                </Text>
            </Group>
        </UnstyledButton>
    );
}
