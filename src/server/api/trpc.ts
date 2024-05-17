import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export declare type ServerContext = {
    isRSC: boolean;
    headers: Headers;
};

export const createTRPCContext = async (opts: ServerContext) => {
    return {
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
