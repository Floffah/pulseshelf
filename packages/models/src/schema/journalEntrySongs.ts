import {
    index,
    int,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";

import { songSource } from "@/schema/enums";

export const journalEntrySongs = mysqlTable(
    "journal_entry_songs",
    {
        id: serial("id").primaryKey(),
        journalId: int("journal_id").notNull(),
        source: songSource.notNull(),
        songId: varchar("song_id", { length: 64 }).notNull(),
    },
    (journalEntrySongs) => {
        return {
            journalIdIndex: index("journal_id_idx").on(
                journalEntrySongs.journalId,
            ),
        };
    },
);
