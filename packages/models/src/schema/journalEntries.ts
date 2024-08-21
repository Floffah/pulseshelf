import { boolean, int, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

import { createdAt, publicId } from "@/schema/fields";

export const journalEntries = mysqlTable("journal_entries", {
    id: serial("id").primaryKey(),
    publicId: publicId(),
    content: text("content").notNull(),
    rating: int("rating").notNull(),
    favourite: boolean("favourite").notNull().default(false),
    createdBy: int("created_by_user_id").notNull(),
    createdAt: createdAt(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
