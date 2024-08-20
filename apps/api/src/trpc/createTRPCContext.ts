import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { parse } from "cookie";
import { eq } from "drizzle-orm";

import { SESSION_TOKEN } from "@pulseshelf/lib";
import { db, userSessions, users } from "@pulseshelf/models";

import { createTransformer } from "@/lib/transform";

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
    if (
        !opts.req.headers.has("cookie") &&
        !opts.req.headers.has("x-session-token")
    ) {
        return {
            req: opts.req,
            resHeaders: opts.resHeaders,
            transform: await createTransformer(),
        };
    }

    let token = "";

    if (opts.req.headers.has("x-session-token")) {
        token = opts.req.headers.get("x-session-token") as string;
    } else {
        const cookies = parse(opts.req.headers.get("cookie") as string);
        token = cookies[SESSION_TOKEN];
    }

    if (!token || !token.trim() || token.length < 10) {
        return {
            req: opts.req,
            resHeaders: opts.resHeaders,
            transform: await createTransformer(),
        };
    }

    const session = await db.query.userSessions.findFirst({
        where: (userSessions) => eq(userSessions.token, token),
    });

    if (!session) {
        return {
            req: opts.req,
            resHeaders: opts.resHeaders,
            transform: await createTransformer(),
        };
    }

    await db
        .update(users)
        .set({
            lastActiveAt: new Date(),
        })
        .where(eq(users.id, session.userId));

    await db
        .update(userSessions)
        .set({
            lastUsedAt: new Date(),
        })
        .where(eq(userSessions.id, session.id));

    return {
        req: opts.req,
        resHeaders: opts.resHeaders,
        session,
        transform: await createTransformer({
            session,
        }),
    };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
