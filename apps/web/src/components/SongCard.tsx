"use client";

import Image from "next/image";

import BinIcon from "~icons/mdi/bin";

import { Icon } from "@/components/Icon";
import { Loader } from "@/components/Loader";
import { api } from "@/lib/api";

interface SongCardProps {
    songId: string;
    onRemove?: () => void;
}

export function SongCard({ songId, onRemove }: SongCardProps) {
    const song = api.music.getTrack.useQuery({ id: songId });

    return (
        <a
            href={
                song.data
                    ? `https://open.spotify.com/track/${song.data.id}`
                    : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-gray-300 p-2 text-left hover:bg-gray-200 dark:border-white/10 dark:hover:bg-gray-800"
        >
            {song.isLoading && <Loader />}

            {song.error && (
                <p className="text-red-400 dark:text-red-500">
                    Could not load song data: {song.error.message}
                </p>
            )}

            {song.data && (
                <>
                    <Image
                        src={song.data.album.images[0].url}
                        alt="Album cover"
                        width={48}
                        height={48}
                        className="h-12 w-12 flex-shrink-0 rounded-lg"
                    />
                    <div className="flex-grow">
                        <p className="font-semibold">
                            {song.data.name}{" "}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                • {song.data.album.name}
                            </span>
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            {song.data.artists.join(", ")}
                        </p>
                    </div>
                    {onRemove && (
                        <button
                            className="flex-shrink-0"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove();
                            }}
                        >
                            <Icon
                                icon={BinIcon}
                                className="h-6 w-6 text-gray-400 dark:text-gray-500"
                            />
                        </button>
                    )}
                </>
            )}
        </a>
    );
}
