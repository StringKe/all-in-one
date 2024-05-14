'use client';

import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useTranslate } from '@tolgee/react';
import { useState, type ChangeEvent } from 'react';

export default function EncodeDecodeUrlTool() {
    const { t } = useTranslate();
    const [input, setInput] = useState('');
    const { copy } = useClipboard();

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.currentTarget.value);
    };

    const onEncode = () => {
        setInput(encodeURIComponent(input));
    };

    const onDecode = () => {
        setInput(decodeURIComponent(input));
    };

    const onCopy = () => {
        copy(input);
    };

    const onClean = () => {
        setInput('');
    };

    return (
        <Stack className={'full-height'}>
            <Group>
                <Button onClick={onEncode}>{t('encode')}</Button>
                <Button onClick={onDecode}>{t('decode')}</Button>
                <Button variant={'light'} onClick={onCopy}>
                    {t('copy')}
                </Button>
                <Button variant={'light'} onClick={onClean}>
                    {t('clean')}
                </Button>
            </Group>
            <Textarea
                flex={1}
                value={input}
                onChange={onChange}
                placeholder={t('Paste data here')}
                styles={{
                    wrapper: { height: '100%' },
                    input: { height: '100%' },
                }}
            />
        </Stack>
    );
}
