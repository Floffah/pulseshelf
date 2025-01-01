import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import SuperJSON from "superjson";

import { api } from "@/lib/api";
import { getAuthToken } from "@/lib/auth/auth";
import { getBaseURL } from "@/lib/getBaseURL";

export function TRPCProvider(props: PropsWithChildren) {
    const [queryClient] = useState(() => new QueryClient({}));
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" &&
                            opts.result instanceof Error),
                    colorMode: "ansi",
                }),
                httpBatchLink({
                    transformer: SuperJSON,
                    url: `${getBaseURL()}/api`,
                    async headers() {
                        const headers = new Map<string, string>();
                        headers.set("x-trpc-source", "expo-react");

                        const token = await getAuthToken();
                        if (token)
                            headers.set("Authorization", `Bearer ${token}`);

                        return Object.fromEntries(headers);
                    },
                }),
            ],
        }),
    );

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </api.Provider>
    );
}
