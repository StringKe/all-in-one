import { initTRPC } from '@trpc/server';
import { type IronSession } from 'iron-session';
import { type cookies } from 'next/headers';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { db } from '@/server/db';

export declare type SessionObject = Partial<{
    isContainer: boolean;
}>;

export declare type ServerContext = {
    isRSC: boolean;
    headers: Headers;
    cookies: ReturnType<typeof cookies>;
    session: IronSession<SessionObject>;
};

export const createTRPCContext = async (opts: ServerContext) => {
    return {
        db,
        ...opts,
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
