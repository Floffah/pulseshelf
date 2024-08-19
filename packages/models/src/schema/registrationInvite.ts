import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const registrationInvite = mysqlTable("registration_invite", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 320 }).unique().notNull(),
});
