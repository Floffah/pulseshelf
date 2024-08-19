import { db } from "@pulseshelf/models";
import { eq } from "drizzle-orm";

import { procedure, router } from "@/trpc/trpc";

export const userRouter = router({
    me: procedure.query(async ({ ctx }) => {
        if (!ctx.session) {
            return null;
        }

        const user = await db.query.users.findFirst({
            where: (users) => eq(users.id, ctx.session!.userId),
        });

        return !!user ? ctx.transform.user(user) : null;
    }),
});
