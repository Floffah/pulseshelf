import { hash, verify } from "@node-rs/bcrypt";
import { SESSION_TOKEN } from "@pulseshelf/lib";
import { AuthError } from "@pulseshelf/lib";
import {
    db,
    registrationInvite,
    userOAuthProviders,
    userSessions,
    users,
} from "@pulseshelf/models";
import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";
import cryptoRandomString from "crypto-random-string";
import { addDays } from "date-fns";
import { addMonths } from "date-fns/addMonths";
import { and, eq, inArray, like } from "drizzle-orm";
import { z } from "zod";

import { procedure, router } from "@/trpc/trpc";

export const authenticationRouter = router({
    loginWithPassword: procedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(8),
            }),
        )
        .mutation(async (opts) => {
            const user = await db.query.users.findFirst({
                where: (users) => eq(users.email, opts.input.email),
            });

            if (!user || !user.passwordHash) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.INVALID_CREDENTIALS,
                });
            }

            const passwordMatches = await verify(
                opts.input.password,
                user.passwordHash,
            );
            if (!passwordMatches) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.INVALID_CREDENTIALS,
                });
            }

            const token = cryptoRandomString({ length: 64 });
            const expiresAt = addMonths(new Date(), 6);

            const insertedSession = await db.insert(userSessions).values({
                userId: user.id,
                token,
                expiresAt,
            });
            const session = await db.query.userSessions.findFirst({
                where: (sessions) =>
                    eq(sessions.id, parseInt(insertedSession.insertId)),
            });

            const reqURL = new URL(opts.ctx.req.url);

            if (
                reqURL.hostname === "localhost" ||
                reqURL.hostname.endsWith("dndnotes.app")
            ) {
                opts.ctx.resHeaders.append(
                    "Set-Cookie",
                    serialize(SESSION_TOKEN, token, {
                        path: "/",
                        secure: process.env.NODE_ENV === "production",
                        domain:
                            process.env.NODE_ENV === "production"
                                ? ".pulseshelf.com"
                                : "localhost",
                        sameSite: "strict",
                        expires: expiresAt,
                    }),
                );
            }

            return {
                user: user!,
                session: session!,
            };
        }),

    register: procedure
        .input(
            z.object({
                name: z.string().min(5).max(100),
                email: z.string().email(),
                password: z.string().min(8),
            }),
        )
        .mutation(async (opts) => {
            const invite = await db.query.registrationInvite.findFirst({
                where: (invite) => eq(invite.email, opts.input.email),
            });

            if (!invite) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.NOT_INVITED,
                });
            }

            const existingWithEmail = await db.query.users.findFirst({
                where: (user) => eq(user.email, opts.input.email),
            });

            if (existingWithEmail) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.EMAIL_TAKEN,
                });
            }

            const nameExists = await db.query.users.findFirst({
                where: (user) => eq(user.name, opts.input.name),
            });

            if (nameExists) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.NAME_TAKEN,
                });
            }

            const passwordHash = await hash(opts.input.password, 10);

            const insertedUser = await db.insert(users).values({
                name: opts.input.name,
                email: opts.input.email,
                passwordHash,
            });
            const user = await db.query.users.findFirst({
                where: (users) => eq(users.id, parseInt(insertedUser.insertId)),
            });

            await db
                .delete(registrationInvite)
                .where(eq(registrationInvite.id, invite.id));

            return user!;
        }),
});
