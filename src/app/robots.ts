import type { MetadataRoute } from 'next';

import { getUrl } from '@/lib/helper';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: getUrl('sitemap.xml'),
    };
}
