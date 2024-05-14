import * as process from 'node:process';

export const getPathnameFromMetadataState = (state: any): string | undefined => {
    const res = Object.getOwnPropertySymbols(state || {})
        .map((p) => state[p])
        .find((state) => state?.hasOwnProperty?.('urlPathname'));

    const urlPathname = res?.urlPathname;
    if (!urlPathname) {
        return undefined;
    }

    return urlPathname.replace(/\?.+/, '');
};

export function getUrl(path: string, locale?: string) {
    const host = process.env.NEXT_PUBLIC_HOST || 'https://yzos.com';
    let fullPath = `/${locale ? locale : ''}${path === '/' ? '' : `/${path}`}`.replaceAll('//', '/');
    if (fullPath.startsWith('/')) {
        fullPath = fullPath.substring(1);
    }
    return `${host}/${fullPath}`;
}
