import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';

import { createCaller } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

const createContext = cache(async () => {
    const _headers = new Headers(headers());

    _headers.set('x-trpc-source', 'rsc');

    return createTRPCContext({
        isRSC: true,
        headers: _headers,
    });
});

export const api = createCaller(createContext);
