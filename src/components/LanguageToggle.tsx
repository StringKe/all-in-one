'use client';

import { ActionIcon, Button, Group, Popover, Stack, type SelectProps } from '@mantine/core';
import { IconCheck, IconLanguage } from '@tabler/icons-react';
import { get } from 'lodash-es';
import { useLocale } from 'next-intl';
import { type ReactNode } from 'react';

import { locales, localesTranslations, usePathname, useRouter } from '@/i18n';

const icons: Record<string, ReactNode> = {
    en: <span className='fi fi-us' />,
    zh: <span className='fi fi-cn' />,
};

const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex='1' gap='xs'>
        {icons[option.value]}
        {option.label}
        {checked && (
            <IconCheck
                style={{ marginInlineStart: 'auto' }}
                {...{
                    stroke: 1.5,
                    color: 'currentColor',
                    opacity: 0.6,
                    size: 18,
                }}
            />
        )}
    </Group>
);

export function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const onChange = (value: string | null) => {
        router.replace(pathname, { locale: value ?? 'en' });
    };

    return (
        <Popover>
            <Popover.Target>
                <ActionIcon variant={'subtle'}>
                    <IconLanguage />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap={'xs'}>
                    {locales.map((value) => (
                        <Button
                            key={value}
                            variant={'light'}
                            color={locale === value ? 'blue' : 'gray'}
                            sx={() => ({
                                width: '164px',
                            })}
                            leftSection={icons[value]}
                            justify='space-between'
                            onClick={() => onChange(value)}
                        >
                            {get(localesTranslations, value, value.toUpperCase())}
                        </Button>
                    ))}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
