import { Badge, Button, Group, SimpleGrid, Stack, Text } from '@mantine/core';

import { Link } from '@/navigation';
import { getTranslate } from '@/tolgee/server';
import { findRouter, getAllSubTools } from '@/tools';

export async function ToolWelcomePage({ url }: { url: string }) {
    const t = await getTranslate();

    const tools = getAllSubTools(url);

    const currentRouter = findRouter(url)!;

    return (
        <Stack>
            <Stack align={'center'} py={'24px'}>
                <Text size={'48px'}>{t(currentRouter.title)}</Text>
                <Text size={'24px'}>{t(currentRouter.description)}</Text>
            </Stack>
            <SimpleGrid cols={3}>
                {tools.map((tool) => (
                    <Stack gap={0} key={tool.url}>
                        <Group justify='space-between' mt='md' mb='xs'>
                            <Text fw={500}>{t(tool.title)}</Text>
                            {tool.parent && <Badge>{t(tool.parent.title)}</Badge>}
                        </Group>

                        <Text size='sm' c='dimmed' h={'64px'}>
                            {t(tool.description)}
                        </Text>

                        <Link
                            href={tool.url}
                            style={{
                                textDecoration: 'none',
                            }}
                        >
                            <Button color='blue' fullWidth mt='md' radius='md'>
                                {t('try-it')}
                            </Button>
                        </Link>
                    </Stack>
                ))}
            </SimpleGrid>
        </Stack>
    );
}
