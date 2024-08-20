import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

// TODO: pluralize the table name
export const registrationInvites = mysqlTable("registration_invite", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 320 }).unique().notNull(),
});
