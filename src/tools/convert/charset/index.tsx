'use client';

import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useTranslate } from '@tolgee/react';
import { useState } from 'react';

export default function ConvertCharsetTool() {
    const { t } = useTranslate();
    const [input, setInput] = useState('');
    const { copy } = useClipboard();

    const toUnicode = () => {
        setInput(
            input
                .split('')
                .map((char) => {
                    return char.charCodeAt(0).toString(16);
                })
                .join(' '),
        );
    };

    const toAscii = () => {
        setInput(
            input
                .split(' ')
                .map((char) => {
                    return String.fromCharCode(parseInt(char, 16));
                })
                .join(''),
        );
    };

    const unicodeToAscii = () => {
        setInput(
            input
                .split(' ')
                .map((char) => {
                    return String.fromCharCode(parseInt(char, 16));
                })
                .join(''),
        );
    };

    const asciiToUnicode = () => {
        setInput(
            input
                .split('')
                .map((char) => {
                    return char.charCodeAt(0).toString(16);
                })
                .join(' '),
        );
    };

    return (
        <Stack className={'full-height'}>
            <Group>
                <Button onClick={() => toUnicode()}>{t('to-unicode')}</Button>
                <Button onClick={() => toAscii()}>{t('to-ascii')}</Button>
                <Button onClick={() => unicodeToAscii()}>{t('unicode-to-ascii')}</Button>
                <Button onClick={() => asciiToUnicode()}>{t('ascii-to-unicode')}</Button>
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
