import 'server-only';

import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { configRouter } from './routers/config';

export const appRouter = createTRPCRouter({
    config: configRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
