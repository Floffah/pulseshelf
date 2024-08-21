import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { JournalFilter } from "@pulseshelf/lib";
import { db, journalEntries, journalEntrySongs } from "@pulseshelf/models";

import { JournalEntryAPIModel } from "@/lib";
import { authedProcedure, router } from "@/trpc/trpc";

export const journalRouter = router({
    list: authedProcedure
        .input(
            z.object({
                filter: z.nativeEnum(JournalFilter),
                limit: z.number().int().max(50).min(5).default(10),
                cursor: z.number().int().min(0).default(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const results = await db.query.journalEntries.findMany({
                where: (journalEntries) => {
                    const equalsMe = eq(
                        journalEntries.createdBy,
                        ctx.session.userId,
                    );

                    if (input.filter === JournalFilter.FAVOURITES) {
                        return and(
                            equalsMe,
                            eq(journalEntries.favourite, true),
                        );
                    }

                    return equalsMe;
                },
                limit: input.limit,
                offset: input.cursor,
                orderBy: [desc(journalEntries.createdAt)],
            });

            let items: {
                entry: JournalEntryAPIModel;
                songs: string[];
                tags: string[];
            }[] = [];

            for (const entry of results) {
                const songs = await db.query.journalEntrySongs.findMany({
                    where: (journalEntrySongs) =>
                        eq(journalEntrySongs.journalId, entry.id),
                });

                const tags = await db.query.journalTags.findMany({
                    where: (journalTags) => eq(journalTags.journalId, entry.id),
                });

                items.push({
                    entry: ctx.transform.journalEntry(entry),
                    songs: songs.map((song) => song.songId),
                    tags: tags.map((tag) => tag.tag),
                });
            }

            return {
                items,
                nextCursor: input.cursor + results.length,
            };
        }),

    createEntry: authedProcedure
        .input(
            z.object({
                content: z.string().max(65536),
                rating: z.number().min(1).max(5),
                songIds: z.array(z.string().max(64)),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const insertResult = await db.insert(journalEntries).values({
                content: input.content,
                rating: input.rating,
                createdBy: ctx.session.userId,
            });
            const journalEntryID = parseInt(insertResult.insertId);

            const journalEntry = await db.query.journalEntries.findFirst({
                where: (journalEntries) =>
                    eq(journalEntries.id, journalEntryID),
            });

            if (!journalEntry) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }

            for (const songId of input.songIds) {
                await db.insert(journalEntrySongs).values({
                    journalId: journalEntryID,
                    source: "SPOTIFY",
                    songId: songId,
                });
            }

            return ctx.transform.journalEntry(journalEntry);
        }),
});
