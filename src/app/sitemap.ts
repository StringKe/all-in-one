import type { MetadataRoute } from 'next';

import { getUrl } from '@/lib/helper';
import { ALL_LOCALES, DEFAULT_LOCALE } from '@/tolgee/shared';
import { getFlatRouter } from '@/tools';

export default function sitemap(): MetadataRoute.Sitemap {
    return getFlatRouter(false).map((item) => {
        return {
            url: getUrl(item.url, DEFAULT_LOCALE),
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: item.children ? 0.8 : 0.5,
            alternates: {
                languages: Object.fromEntries(ALL_LOCALES.map((locale) => [locale, getUrl(item.url, locale)])),
            },
        };
    });
}
