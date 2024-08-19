import {mysqlEnum} from "drizzle-orm/mysql-core";

export const oAuthProviderEnum = mysqlEnum("oauth_provider", ["DISCORD"]);
