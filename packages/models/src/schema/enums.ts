import { pgEnum } from "drizzle-orm/pg-core";

export const songSource = pgEnum("song_source", ["SPOTIFY"]);
