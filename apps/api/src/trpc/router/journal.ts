import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, journalEntries, journalEntrySongs } from "@pulseshelf/models";

import { authedProcedure, router } from "@/trpc/trpc";

export const journalRouter = router({
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
