import { getPageOgImage } from '@/lib/image/og-image';

export const contentType = 'image/png';

export default async function Image({
    params: { locale },
}: {
    params: {
        locale: string;
    };
}) {
    return await getPageOgImage(locale);
}
