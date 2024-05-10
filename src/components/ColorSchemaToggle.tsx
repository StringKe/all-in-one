'use client';

import { ActionIcon, Button, Popover, Stack, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';

export function ColorSchemaToggle() {
    const { setColorScheme, colorScheme } = useMantineColorScheme();

    return (
        <Popover>
            <Popover.Target>
                <ActionIcon variant={'subtle'} component={'div'}>
                    <div>
                        {colorScheme === 'light' && <IconSun />}
                        {colorScheme === 'dark' && <IconMoon />}
                        {colorScheme === 'auto' && <IconSunMoon />}
                    </div>
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap={'xs'}>
                    <Button
                        variant={'light'}
                        color={colorScheme === 'light' ? 'blue' : 'gray'}
                        sx={() => ({
                            width: '164px',
                        })}
                        leftSection={<IconSun />}
                        justify='space-between'
                        onClick={() => setColorScheme('light')}
                    >
                        Light
                    </Button>
                    <Button
                        variant={'light'}
                        color={colorScheme === 'dark' ? 'blue' : 'gray'}
                        sx={() => ({
                            width: '164px',
                        })}
                        leftSection={<IconMoon />}
                        justify='space-between'
                        onClick={() => setColorScheme('dark')}
                    >
                        Dark
                    </Button>
                    <Button
                        variant={'light'}
                        color={colorScheme === 'auto' ? 'blue' : 'gray'}
                        sx={() => ({
                            width: '164px',
                        })}
                        leftSection={<IconSunMoon />}
                        justify='space-between'
                        onClick={() => setColorScheme('auto')}
                    >
                        Auto
                    </Button>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
