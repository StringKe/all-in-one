'use client';

import { ActionIcon, Button, Popover, Stack } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useTolgee } from '@tolgee/react';
import { useTransition } from 'react';

import languages from '@/i18n/languages.json';
import { usePathname, useRouter } from '@/navigation';

export function LanguageToggle() {
    const tolgee = useTolgee(['language']);
    const locale = tolgee.getLanguage();

    const router = useRouter();
    const pathname = usePathname();

    const [, startTransition] = useTransition();

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
                <Stack gap={'xs'} w={'240px'}>
                    {languages.map((value) => (
                        <Button
                            key={value.tag}
                            variant={'light'}
                            color={locale === value.tag ? 'blue' : 'gray'}
                            leftSection={value.flag}
                            justify='space-between'
                            onClick={() => onSelectChange(value.tag)}
                            fullWidth
                        >
                            {value.originalName}
                        </Button>
                    ))}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
