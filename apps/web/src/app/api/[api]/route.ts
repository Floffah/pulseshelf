import { appRouter, createTRPCContext } from "@pulseshelf/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api",
        req,
        router: appRouter,
        createContext: createTRPCContext,
    });

export { handler as GET, handler as POST };
