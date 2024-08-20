import { authenticationRouter } from "@/trpc/router/authentication";
import { journalRouter } from "@/trpc/router/journal";
import { musicRouter } from "@/trpc/router/music";
import { userRouter } from "@/trpc/router/user";
import { router } from "@/trpc/trpc";

export const appRouter = router({
    authentication: authenticationRouter,
    journal: journalRouter,
    music: musicRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
