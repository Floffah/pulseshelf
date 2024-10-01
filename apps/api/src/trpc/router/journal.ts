import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { MySqlUpdateSetSource } from "drizzle-orm/mysql-core";
import { z } from "zod";

import { JournalFilter } from "@pulseshelf/lib";
import {
    db,
    journalEntries,
    journalEntrySongs,
    journalTags,
} from "@pulseshelf/models";

import { JournalEntryAPIModel } from "@/lib";
import { authedProcedure, router } from "@/trpc/trpc";

export const journalRouter = router({
    get: authedProcedure
        .input(z.object({ journalId: z.string() }))
        .query(async ({ ctx, input }) => {
            const journalEntry = await db.query.journalEntries.findFirst({
                where: (journalEntries) =>
                    eq(journalEntries.publicId, input.journalId),
            });

            if (!journalEntry) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                });
            }

            if (journalEntry.createdBy !== ctx.session.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                });
            }

            const songs = await db.query.journalEntrySongs.findMany({
                where: (journalEntrySongs) =>
                    eq(journalEntrySongs.journalId, journalEntry.id),
            });

            const tags = await db.query.journalTags.findMany({
                where: (journalTags) =>
                    eq(journalTags.journalId, journalEntry.id),
            });

            return {
                entry: ctx.transform.journalEntry(journalEntry),
                songs: songs.map((song) => song.songId),
                tags: tags.map((tag) => tag.tag),
            };
        }),

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
                tags: z.array(z.string().max(65536)).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const insertedIds = await db
                .insert(journalEntries)
                .values({
                    content: input.content,
                    rating: input.rating,
                    createdBy: ctx.session.userId,
                })
                .$returningId();
            const journalEntryID = insertedIds[0].id;

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

            if (input.tags && Array.isArray(input.tags)) {
                for (const tag of input.tags) {
                    await db.insert(journalTags).values({
                        journalId: journalEntryID,
                        tag,
                    });
                }
            }

            return ctx.transform.journalEntry(journalEntry);
        }),

    editEntry: authedProcedure
        .input(
            z.object({
                journalId: z.string(),
                content: z.string().max(65536).optional(),
                rating: z.number().min(1).max(5).optional(),
                songIds: z.array(z.string().max(64)).optional(),
                tags: z.array(z.string().max(65536)).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const journalEntry = await db.query.journalEntries.findFirst({
                where: (journalEntries) =>
                    eq(journalEntries.publicId, input.journalId),
            });

            if (!journalEntry) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                });
            }

            if (journalEntry.createdBy !== ctx.session.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                });
            }

            const setValues: MySqlUpdateSetSource<typeof journalEntries> = {};

            if (typeof input.content === "string") {
                setValues.content = input.content;
            }

            if (typeof input.rating === "number") {
                setValues.rating = input.rating;
            }

            if (Object.keys(setValues).length > 0) {
                await db
                    .update(journalEntries)
                    .set(setValues)
                    .where(eq(journalEntries.id, journalEntry.id));
            }

            if (input.songIds && Array.isArray(input.songIds)) {
                const existingSongs = await db.query.journalEntrySongs.findMany(
                    {
                        where: (journalEntrySongs) =>
                            eq(journalEntrySongs.journalId, journalEntry.id),
                    },
                );
                const existingSongIds = existingSongs.map(
                    (song) => song.songId,
                );

                const toRemove = existingSongIds.filter(
                    (songId) => !input.songIds!.includes(songId),
                );
                const toAdd = input.songIds.filter(
                    (songId) => !existingSongIds.includes(songId),
                );

                for (const songId of toRemove) {
                    await db
                        .delete(journalEntrySongs)
                        .where(
                            and(
                                eq(
                                    journalEntrySongs.journalId,
                                    journalEntry.id,
                                ),
                                eq(journalEntrySongs.songId, songId),
                            ),
                        );
                }

                for (const songId of toAdd) {
                    await db.insert(journalEntrySongs).values({
                        journalId: journalEntry.id,
                        source: "SPOTIFY",
                        songId,
                    });
                }
            }

            if (input.tags && Array.isArray(input.tags)) {
                const existingTags = await db.query.journalTags.findMany({
                    where: (journalTags) =>
                        eq(journalTags.journalId, journalEntry.id),
                });
                const existingTagNames = existingTags.map((tag) => tag.tag);

                const toRemove = existingTagNames.filter(
                    (tag) => !input.tags!.includes(tag),
                );
                const toAdd = input.tags.filter(
                    (tag) => !existingTagNames.includes(tag),
                );

                for (const tag of toRemove) {
                    await db
                        .delete(journalTags)
                        .where(
                            and(
                                eq(journalTags.journalId, journalEntry.id),
                                eq(journalTags.tag, tag),
                            ),
                        );
                }

                for (const tag of toAdd) {
                    await db.insert(journalTags).values({
                        journalId: journalEntry.id,
                        tag,
                    });
                }
            }

            return ctx.transform.journalEntry(journalEntry);
        }),

    setFavourite: authedProcedure
        .input(
            z.object({
                journalId: z.string(),
                favourite: z.boolean().default(true),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const journalEntry = await db.query.journalEntries.findFirst({
                where: (journalEntries) =>
                    eq(journalEntries.publicId, input.journalId),
            });

            if (!journalEntry) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                });
            }

            if (journalEntry.createdBy !== ctx.session.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                });
            }

            await db
                .update(journalEntries)
                .set({
                    favourite: input.favourite,
                })
                .where(eq(journalEntries.id, journalEntry.id));

            return ctx.transform.journalEntry(journalEntry);
        }),

    deleteEntry: authedProcedure
        .input(z.object({ journalId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const journalEntry = await db.query.journalEntries.findFirst({
                where: (journalEntries) =>
                    eq(journalEntries.publicId, input.journalId),
            });

            if (!journalEntry) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                });
            }

            if (journalEntry.createdBy !== ctx.session.userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                });
            }

            await db
                .delete(journalEntries)
                .where(eq(journalEntries.id, journalEntry.id));

            return true;
        }),
});
