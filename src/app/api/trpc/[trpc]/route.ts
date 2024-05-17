import 'server-only';

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';

import { env } from '@/env';
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

const handler = async (req: NextRequest) => {
    const _headers = new Headers(headers());

    return await fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () =>
            createTRPCContext({
                isRSC: false,
                headers: _headers,
            }),
        onError:
            env.NODE_ENV === 'development'
                ? ({ path, error }) => {
                      console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
                  }
                : undefined,
    });
};

export { handler as GET, handler as POST };
