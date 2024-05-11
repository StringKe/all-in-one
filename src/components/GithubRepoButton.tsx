import { ActionIcon } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';

export function GithubRepoButton() {
    return (
        <ActionIcon variant={'subtle'} component={'a'} href={'https://github.com/StringKe/all-in-one'} target={'_blank'}>
            <IconBrandGithub />
        </ActionIcon>
    );
}
