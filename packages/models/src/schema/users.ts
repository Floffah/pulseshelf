import { sql } from "drizzle-orm";
import { datetime, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

import { createdAt, publicId } from "@/schema/fields";

export const users = mysqlTable(
    "users",
    {
        id: serial("id").primaryKey(),
        publicId: publicId(),
        name: varchar("name", { length: 256 }).notNull().unique(),
        email: varchar("email", { length: 320 }).unique(),
        passwordHash: varchar("password_hash", { length: 72 }),
        createdAt: createdAt(),
        lastActiveAt: datetime("last_active_at").default(sql`now()`),
    },
    (users) => {
        return {};
    },
);

export type User = typeof users.$inferSelect;
