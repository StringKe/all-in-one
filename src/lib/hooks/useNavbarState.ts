import { useEffect, useState } from 'react';

export function saveStateToLocalStorage(key: string, state: any) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(state));
    }
}

export function getStateFromLocalStorage(key: string, defaultValue: any): any {
    if (typeof window !== 'undefined') {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    }
    return defaultValue;
}

export function useNavbarState(routerUrl: string, defaultOpened: boolean) {
    const [isOpened, setIsOpened] = useState(defaultOpened);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const storedState = getStateFromLocalStorage(routerUrl, null);
        if (storedState !== null) {
            setIsOpened(storedState);
        } else {
            setIsOpened(defaultOpened);
        }
    }, [routerUrl, defaultOpened]);

    useEffect(() => {
        if (isClient) {
            saveStateToLocalStorage(routerUrl, isOpened);
        }
    }, [isOpened, routerUrl, isClient]);

    return [isOpened, setIsOpened] as const;
}
