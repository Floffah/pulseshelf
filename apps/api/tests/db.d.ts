import { Client } from "@planetscale/database";
import { schema } from "@pulseshelf/models";
export declare const client: Client;
export declare const db: import("drizzle-orm/planetscale-serverless").PlanetScaleDatabase<typeof schema>;
