import { int, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const journalTags = mysqlTable("journal_tags", {
    id: serial("id").primaryKey(),
    journalId: int("journal_id").notNull(),
    tag: text("tag").notNull(),
});

export type JournalTag = typeof journalTags.$inferSelect;
