'use client';

import { TolgeeProvider, useTolgeeSSR } from '@tolgee/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { TolgeeBase } from './shared';

type Props = {
    locales: any;
    locale: string;
    children: ReactNode;
};

const tolgee = TolgeeBase().init();

export const TolgeeNextProvider = ({ locale, locales, children }: Props) => {
    const tolgeeSSR = useTolgeeSSR(tolgee, locale, locales);
    const router = useRouter();

    useEffect(() => {
        const { unsubscribe } = tolgeeSSR.on('permanentChange', () => {
            router.refresh();
        });

        return () => unsubscribe();
    }, [tolgeeSSR, router]);

    return (
        <TolgeeProvider tolgee={tolgeeSSR} options={{ useSuspense: false }} fallback='Loading'>
            {children}
        </TolgeeProvider>
    );
};
