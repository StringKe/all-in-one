import { Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
    const t = await getTranslations();

    return (
        <div>
            <Button>
                {t('hello')}
                <IconHome />
            </Button>
        </div>
    );
}
