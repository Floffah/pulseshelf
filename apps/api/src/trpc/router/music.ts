import { TRPCError } from "@trpc/server";
import { unstable_cache } from "next/cache";
import { z } from "zod";

import { spotifyClient } from "@/lib/spotify";
import { authedProcedure, router } from "@/trpc/trpc";

const searchTrack = unstable_cache(
    (query: string) => spotifyClient.search(query, ["track"], undefined, 10),
    ["spotify-search-track"],
    {
        revalidate: 60 * 60 * 24 * 7,
    },
);

const getTrack = unstable_cache(
    (id: string) => spotifyClient.tracks.get(id),
    ["spotify-get-track"],
    {
        revalidate: 60 * 60 * 24 * 7,
    },
);

export const musicRouter = router({
    searchTrack: authedProcedure
        .input(
            z.object({
                query: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const result = await searchTrack(input.query);

            return result.tracks.items.map((track) => ({
                id: track.id,
                name: track.name,
                artists: track.artists.map((artist) => artist.name),
                album: {
                    id: track.album.id,
                    name: track.album.name,
                    images: track.album.images,
                },
            }));
        }),

    getTrack: authedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const track = await getTrack(input.id);

            if (!track) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Track not found",
                });
            }

            return {
                id: track.id,
                name: track.name,
                artists: track.artists.map((artist) => artist.name),
                album: {
                    id: track.album.id,
                    name: track.album.name,
                    images: track.album.images,
                },
            };
        }),
});
