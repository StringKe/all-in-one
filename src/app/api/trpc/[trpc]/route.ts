import 'server-only';

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { getIronSession } from 'iron-session';
import { cookies, headers } from 'next/headers';
import { type NextRequest } from 'next/server';

import { env } from '@/env';
import { appRouter } from '@/server/api/root';
import { createTRPCContext, type SessionObject } from '@/server/api/trpc';

const handler = async (req: NextRequest) => {
    const _cookies = cookies();
    const _headers = new Headers(headers());
    const _session = await getIronSession<SessionObject>(_cookies, {
        password: env.IRON_SESSION_PASSWORD,
        cookieName: 'session',
    });

    const response = await fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () =>
            createTRPCContext({
                isRSC: false,
                headers: _headers,
                cookies: _cookies,
                session: _session,
            }),
        onError:
            env.NODE_ENV === 'development'
                ? ({ path, error }) => {
                      console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
                  }
                : undefined,
    });

    await _session.save();

    return response;
};

export { handler as GET, handler as POST };
