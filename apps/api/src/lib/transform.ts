import type { User, UserSession } from "@pulseshelf/models";
import { JournalEntry, PeriodEntry } from "@pulseshelf/models";

export async function createTransformer(
    ctx: {
        session?: UserSession;
    } = {},
) {
    return {
        user: ({ publicId, ...user }: User) => ({
            ...user,
            id: publicId,
            email: ctx.session?.userId === user.id ? user.email : null,
        }),
        journalEntry: ({ publicId, ...journalEntry }: JournalEntry) => ({
            ...journalEntry,
            id: publicId,
        }),
        periodEntry: ({ publicId, ...periodEntry }: PeriodEntry) => ({
            ...periodEntry,
            id: publicId,
        }),
    };
}

export type Transformer = Awaited<ReturnType<typeof createTransformer>>;

export type UserAPIModel = ReturnType<Transformer["user"]>;
export type JournalEntryAPIModel = ReturnType<Transformer["journalEntry"]>;
export type PeriodEntryAPIModel = ReturnType<Transformer["periodEntry"]>;
