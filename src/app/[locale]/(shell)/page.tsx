import { Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';

import { T } from '@/tolgee/server';

export default async function Home() {
    return (
        <div>
            <Button>
                <T keyName={'111'}></T>
                <IconHome />
            </Button>
        </div>
    );
}
