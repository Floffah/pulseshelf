import { authenticationRouter } from "@/trpc/router/authentication";
import { musicRouter } from "@/trpc/router/music";
import { userRouter } from "@/trpc/router/user";
import { router } from "@/trpc/trpc";

export const appRouter = router({
    authentication: authenticationRouter,
    music: musicRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
