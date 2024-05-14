import { Badge, Button, Group, SimpleGrid, Stack, Text } from '@mantine/core';

import { getTranslate } from '@/tolgee/server';
import { findRouter, getAllSubTools } from '@/tools/index';

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

                        <Text size='sm' c='dimmed'>
                            {t(tool.description)}
                        </Text>

                        <Button color='blue' fullWidth mt='md' radius='md'>
                            {t('try-it')}
                        </Button>
                    </Stack>
                ))}
            </SimpleGrid>
        </Stack>
    );
}
