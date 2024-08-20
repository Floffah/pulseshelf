import { mysqlEnum } from "drizzle-orm/mysql-core";

export const oAuthProviderEnum = mysqlEnum("oauth_provider", ["DISCORD"]);

export const songSource = mysqlEnum("song_source", ["SPOTIFY"]);
