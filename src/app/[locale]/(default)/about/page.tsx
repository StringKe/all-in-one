import { Container } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

import { api } from '@/trpc/server';

export default async function Home() {
    const hello = await api.post.hello({ text: 'from tRPC' });

    const t = await getTranslations();

    return <Container>about page</Container>;
}
