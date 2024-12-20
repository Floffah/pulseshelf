import { createServerSideHelpers } from "@trpc/react-query/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

import { appRouter, createTRPCContext } from "@pulseshelf/api";

import { queryClientConfig } from "@/lib/api/reactQuery";

export const getTRPCServerHelpers = cache(async () => {
    const ctx = await createTRPCContext({
        req: {
            headers: await headers(),
        } as Request,
        resHeaders: new Headers(),
        info: null!,
    });

    return createServerSideHelpers({
        ctx,
        router: appRouter,
        transformer: superjson,
        queryClientConfig: queryClientConfig,
    });
});
