import { int, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

// TODO: rename to journal_entry_tags
export const journalTags = mysqlTable("journal_tags", {
    id: serial("id").primaryKey(),
    journalId: int("journal_id").notNull(),
    tag: text("tag").notNull(),
});

export type JournalTag = typeof journalTags.$inferSelect;
