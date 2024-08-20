import { hash, verify } from "@node-rs/bcrypt";
import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";
import cryptoRandomString from "crypto-random-string";
import { addMonths } from "date-fns/addMonths";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { AuthError, SESSION_TOKEN } from "@pulseshelf/lib";
import {
    db,
    registrationInvites,
    userSessions,
    users,
} from "@pulseshelf/models";

import { procedure, router } from "@/trpc/trpc";

export const authenticationRouter = router({
    loginWithPassword: procedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(8),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const user = await db.query.users.findFirst({
                where: (users) => eq(users.email, input.email),
            });

            if (!user || !user.passwordHash) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.INVALID_CREDENTIALS,
                });
            }

            const passwordMatches = await verify(
                input.password,
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

            await db.insert(userSessions).values({
                userId: user.id,
                token,
                expiresAt,
            });

            const reqURL = new URL(ctx.req.url);

            if (
                reqURL.hostname === "localhost" ||
                reqURL.hostname.endsWith("pulseshelf.com")
            ) {
                ctx.resHeaders.set(
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
                user: ctx.transform.user(user!),
                sessionToken: token,
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
        .mutation(async ({ ctx, input }) => {
            const invite = await db.query.registrationInvites.findFirst({
                where: (invite) => eq(invite.email, input.email),
            });

            if (!invite) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.NOT_INVITED,
                });
            }

            const existingWithEmail = await db.query.users.findFirst({
                where: (user) => eq(user.email, input.email),
            });

            if (existingWithEmail) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.EMAIL_TAKEN,
                });
            }

            const nameExists = await db.query.users.findFirst({
                where: (user) => eq(user.name, input.name),
            });

            if (nameExists) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.NAME_TAKEN,
                });
            }

            const passwordHash = await hash(input.password, 10);

            const insertedUser = await db.insert(users).values({
                name: input.name,
                email: input.email,
                passwordHash,
            });
            const user = await db.query.users.findFirst({
                where: (users) => eq(users.id, parseInt(insertedUser.insertId)),
            });

            await db
                .delete(registrationInvites)
                .where(eq(registrationInvites.id, invite.id));

            return ctx.transform.user(user!);
        }),
});
