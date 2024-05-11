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
