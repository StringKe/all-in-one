'use client';

import { ActionIcon, Button, Popover, Stack } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useTolgee } from '@tolgee/react';
import { get } from 'lodash-es';
import { useTransition, type ReactNode } from 'react';

import { usePathname, useRouter } from '@/navigation';
import { ALL_LOCALES, localesTranslations } from '@/tolgee/shared';

const icons: Record<string, ReactNode> = {
    en: <span className='fi fi-us' />,
    zh: <span className='fi fi-cn' />,
};

export function LanguageToggle() {
    const tolgee = useTolgee(['language']);
    const locale = tolgee.getLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function onSelectChange(newLocale: string) {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    }

    return (
        <Popover>
            <Popover.Target>
                <ActionIcon variant={'subtle'}>
                    <IconLanguage />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap={'xs'}>
                    {ALL_LOCALES.map((value) => (
                        <Button
                            key={value}
                            variant={'light'}
                            color={locale === value ? 'blue' : 'gray'}
                            sx={() => ({
                                width: '164px',
                            })}
                            leftSection={icons[value]}
                            justify='space-between'
                            onClick={() => onSelectChange(value)}
                        >
                            {get(localesTranslations, value, value.toUpperCase())}
                        </Button>
                    ))}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
