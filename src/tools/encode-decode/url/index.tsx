'use client';

import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useTranslate } from '@tolgee/react';
import { useState } from 'react';

export default function EncodeDecodeUrlTool() {
    const { t } = useTranslate();
    const [input, setInput] = useState('');
    const { copy } = useClipboard();

    return (
        <Stack className={'full-height'}>
            <Group>
                <Button onClick={() => setInput(encodeURIComponent(input))}>{t('encode')}</Button>
                <Button onClick={() => setInput(decodeURIComponent(input))}>{t('decode')}</Button>
                <Button
                    variant={'light'}
                    onClick={() => {
                        copy(input);
                    }}
                >
                    {t('copy')}
                </Button>
                <Button variant={'light'} onClick={() => setInput('')}>
                    {t('clean')}
                </Button>
            </Group>
            <Textarea
                flex={1}
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                placeholder={t('Paste data here')}
                styles={{
                    wrapper: { height: '100%' },
                    input: { height: '100%' },
                }}
            />
        </Stack>
    );
}
