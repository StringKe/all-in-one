import 'server-only';

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const configRouter = createTRPCRouter({
    isContainer: publicProcedure.query(({ ctx: { session } }) => {
        return session.isContainer;
    }),
    setIsContainer: publicProcedure
        .input(
            z.object({
                isContainer: z.boolean(),
            }),
        )
        .mutation(async ({ input: { isContainer }, ctx: { session } }) => {
            return (session.isContainer = isContainer);
        }),
});
