import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
    db,
    journalEntries,
    periodEntries,
    periodEntrySongs,
} from "@pulseshelf/models";

import { PeriodEntryAPIModel } from "@/lib";
import { authedProcedure, router } from "@/trpc/trpc";

export const periodEntriesRouter = router({
    get: authedProcedure
        .input(
            z.object({
                entryId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const periodEntry = await db.query.periodEntries.findFirst({
                where: (periodEntries, { eq }) =>
                    eq(periodEntries.publicId, input.entryId),
            });

            if (!periodEntry) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                });
            }

            if (periodEntry.createdBy !== ctx.session.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                });
            }

            const songs = await db.query.periodEntrySongs.findMany({
                where: (periodEntrySongs, { eq }) =>
                    eq(periodEntrySongs.periodId, periodEntry.id),
            });

            return {
                entry: ctx.transform.periodEntry(periodEntry),
                songs: songs.map((song) => song.songId),
            };
        }),

    list: authedProcedure
        .input(
            z.object({
                limit: z.number().int().max(50).min(5).default(10),
                cursor: z.number().int().min(0).default(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const periodEntries = await db.query.periodEntries.findMany({
                where: (periodEntries, { eq }) =>
                    eq(periodEntries.createdBy, ctx.session.userId),
                limit: input.limit,
                offset: input.cursor,
                orderBy: (periodEntries, { desc }) => [
                    desc(periodEntries.createdAt),
                ],
            });

            let items: {
                entry: PeriodEntryAPIModel;
                songs: string[];
            }[] = [];

            for (const periodEntry of periodEntries) {
                const songs = await db.query.periodEntrySongs.findMany({
                    where: (periodEntrySongs, { eq }) =>
                        eq(periodEntrySongs.periodId, periodEntry.id),
                });

                items.push({
                    entry: ctx.transform.periodEntry(periodEntry),
                    songs: songs.map((song) => song.songId),
                });
            }

            return {
                items,
                nextCursor: input.cursor + periodEntries.length,
            };
        }),

    create: authedProcedure
        .input(
            z.object({
                summary: z.string().max(65536),
                startsAt: z.date(),
                endsAt: z.date(),
                songIds: z.array(z.string().max(64)).max(10),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const insertedPeriodEntryIds = await db
                .insert(periodEntries)
                .values({
                    summary: input.summary,
                    startsAt: input.startsAt,
                    endsAt: input.endsAt,
                    createdBy: ctx.session.userId,
                })
                .$returningId();
            const periodEntry = insertedPeriodEntryIds[0];

            for (const songId of input.songIds) {
                await db.insert(periodEntrySongs).values({
                    periodId: periodEntry.id,
                    source: "SPOTIFY",
                    songId,
                });
            }

            return periodEntry;
        }),

    update: authedProcedure
        .input(
            z.object({
                entryId: z.string(),
                summary: z.string().max(65536).optional(),
                startsAt: z.date().optional(),
                endsAt: z.date().optional(),
                songIds: z.array(z.string().max(64)).max(10).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const periodEntry = await db.query.periodEntries.findFirst({
                where: (periodEntries, { eq }) =>
                    eq(periodEntries.publicId, input.entryId),
            });

            if (!periodEntry) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                });
            }

            if (periodEntry.createdBy !== ctx.session.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                });
            }

            await db
                .update(periodEntries)
                .set({
                    summary: input.summary,
                    startsAt: input.startsAt,
                    endsAt: input.endsAt,
                })
                .where(eq(periodEntries.publicId, input.entryId));

            if (input.songIds) {
                await db
                    .delete(periodEntrySongs)
                    .where(eq(periodEntrySongs.periodId, periodEntry.id));

                for (const songId of input.songIds) {
                    await db.insert(periodEntrySongs).values({
                        periodId: periodEntry.id,
                        source: "SPOTIFY",
                        songId,
                    });
                }
            }

            return ctx.transform.periodEntry(periodEntry);
        }),

    delete: authedProcedure
        .input(
            z.object({
                entryId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const periodEntry = await db.query.periodEntries.findFirst({
                where: (periodEntries, { eq }) =>
                    eq(periodEntries.publicId, input.entryId),
            });

            if (!periodEntry) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                });
            }

            if (periodEntry.createdBy !== ctx.session.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                });
            }

            await db
                .delete(periodEntries)
                .where(eq(periodEntries.publicId, input.entryId));

            return true;
        }),
});
