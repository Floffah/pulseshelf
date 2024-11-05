import { date, mysqlTable } from "drizzle-orm/mysql-core";
import { int, serial, text } from "drizzle-orm/mysql-core";

import { createdAt, publicId } from "@/schema/fields";

export const periodEntries = mysqlTable("period_entries", {
    id: serial("id").primaryKey(),
    publicId: publicId(),
    summary: text("summary").notNull(),
    startsAt: date("starts_at").notNull(),
    endsAt: date("ends_at").notNull(),
    createdBy: int("created_by_user_id").notNull(),
    createdAt: createdAt(),
});

export type PeriodEntry = typeof periodEntries.$inferSelect;
