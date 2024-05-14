import { Badge, Button, Card, SimpleGrid, Text } from '@mantine/core';

import { Link } from '@/navigation';
import { getTranslate } from '@/tolgee/server';
import { getAllSubTools } from '@/tools';

export default async function Home() {
    const tools = getAllSubTools('/');
    const t = await getTranslate();

    return (
        <div>
            <SimpleGrid cols={2} spacing={'lg'}>
                {tools.map((tool) => (
                    <Card key={tool.url}>
                        <Text size={'lg'}>
                            {tool.parent ? t(tool.parent.title) + ' ' : ''}
                            {t(tool.title)}
                        </Text>
                        <Text size={'md'} c={'gray'} mih={'3em'}>
                            {t(tool.description)}
                        </Text>
                        <Link href={tool.url} style={{ textDecoration: 'none' }}>
                            <Button color={'blue'} fullWidth>
                                {t('try-it')}
                            </Button>
                        </Link>
                        {tool.parents && (
                            <SimpleGrid cols={4} mt={'lg'}>
                                {tool.parents.map((parent) => (
                                    <Link href={parent.url} key={parent.url} style={{ textDecoration: 'none' }}>
                                        <Badge color={'gray'}>{t(parent.title)}</Badge>
                                    </Link>
                                ))}
                            </SimpleGrid>
                        )}
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
}
