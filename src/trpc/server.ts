import 'server-only';

import { getIronSession } from 'iron-session';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';

import { env } from '@/env';
import { createCaller } from '@/server/api/root';
import { createTRPCContext, type SessionObject } from '@/server/api/trpc';

const createContext = cache(async () => {
    const _headers = new Headers(headers());
    const _cookies = cookies();
    const _session = await getIronSession<SessionObject>(_cookies, {
        password: env.IRON_SESSION_PASSWORD,
        cookieName: 'session',
    });

    _headers.set('x-trpc-source', 'rsc');

    return createTRPCContext({
        isRSC: true,
        headers: _headers,
        cookies: _cookies,
        session: _session,
    });
});

export const api = createCaller(createContext);
