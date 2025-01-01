import { sql } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { createdAt, publicId } from "@/schema/fields";

export const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        publicId: publicId(),
        name: varchar("name", { length: 256 }).notNull().unique(),
        email: varchar("email", { length: 320 }).unique(),
        passwordHash: varchar("password_hash", { length: 72 }),
        createdAt: createdAt(),
        lastActiveAt: timestamp("last_active_at").default(sql`now()`),
    },
    (_users) => {
        return {};
    },
);

export type User = typeof users.$inferSelect;
