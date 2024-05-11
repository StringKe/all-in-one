import { createServerInstance } from '@tolgee/react/server';
import { useLocale } from 'next-intl';

import { ALL_LOCALES, getStaticData, TolgeeBase } from './shared';

export const { getTolgee, getTranslate, T } = createServerInstance({
    getLocale: useLocale,
    createTolgee: async (locale) =>
        TolgeeBase().init({
            staticData: await getStaticData(ALL_LOCALES),
            observerOptions: {
                fullKeyEncode: true,
            },
            language: locale,
            fetch: async (input, init) => {
                return await fetch(input, { ...init, next: { revalidate: 0 } });
            },
        }),
});
