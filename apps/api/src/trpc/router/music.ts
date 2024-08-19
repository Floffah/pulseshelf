import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { spotifyClient } from "@/lib/spotify";
import { authedProcedure, router } from "@/trpc/trpc";

export const musicRouter = router({
    searchTrack: authedProcedure
        .input(
            z.object({
                query: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const result = await spotifyClient.search(
                input.query,
                ["track"],
                undefined,
                10,
            );

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
            const track = await spotifyClient.tracks.get(input.id);

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
