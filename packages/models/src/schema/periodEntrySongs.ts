import {
    index,
    int,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";

import { songSource } from "@/schema/enums";

export const periodEntrySongs = mysqlTable(
    "period_entry_songs",
    {
        id: serial("id").primaryKey(),
        periodId: int("journal_id").notNull(),
        source: songSource.notNull(),
        songId: varchar("song_id", { length: 64 }).notNull(),
    },
    (periodEntrySongs) => {
        return {
            periodIdIndex: index("journal_id_idx").on(
                periodEntrySongs.periodId,
            ),
        };
    },
);
