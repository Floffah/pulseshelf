import { sql } from "drizzle-orm";
import { datetime, varchar } from "drizzle-orm/mysql-core";

import { generatePublicId } from "@/lib";

export const publicId = () =>
    varchar("public_id", { length: 36 })
        .notNull()
        .unique()
        .$defaultFn(() => generatePublicId());

export const createdAt = () =>
    datetime("created_at")
        .notNull()
        .default(sql`now()`);
