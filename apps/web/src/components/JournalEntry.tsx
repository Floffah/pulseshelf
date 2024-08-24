"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Remark } from "react-remark";

import BinOutlineIcon from "~icons/mdi/bin-outline";
import HeartIcon from "~icons/mdi/heart";
import HeartOutlineIcon from "~icons/mdi/heart-outline";
import PencilOutlineIcon from "~icons/mdi/pencil-outline";
import StarIcon from "~icons/mdi/star";

import type { JournalEntryAPIModel } from "@pulseshelf/api";
import { JournalFilter } from "@pulseshelf/lib";

import { Icon } from "@/components/Icon";
import { JournalEntryTagList } from "@/components/JournalEntryTagList";
import { RatingEmoji } from "@/components/RatingEmoji";
import { SongCard } from "@/components/SongCard";
import { TagList } from "@/components/TagList";
import { api } from "@/lib/api";
import { useDialogs } from "@/providers/DialogProvider";
import { useJournals } from "@/providers/journals";

export interface EntryProps {
    entry: JournalEntryAPIModel;
    songs: string[];
    tags: string[];
}

export function JournalEntry({ entry, songs, tags }: EntryProps) {
    const trpcUtils = api.useUtils();
    const dialogs = useDialogs();
    const journals = useJournals();

    const setFavouriteMutation = api.journal.setFavourite.useMutation();
    const deleteEntryMutation = api.journal.deleteEntry.useMutation();

    const dateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(navigator.language, {
                dateStyle: "full",
                timeStyle: "short",
            }),
        [],
    );

    useEffect(() => {
        trpcUtils.journal.get.setData(
            {
                journalId: entry.id,
            },
            {
                entry,
                songs,
                tags,
            },
        );
    }, [entry, songs, tags]);

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-gray-200 p-4 dark:bg-gray-800">
            <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 overflow-hidden">
                    <RatingEmoji rating={entry.rating} />
                    <p className="flex-grow text-xl font-semibold">
                        {dateFormatter.format(entry.createdAt)}
                    </p>

                    <Link href={`/journal/${entry.id}/edit`}>
                        <Icon
                            icon={PencilOutlineIcon}
                            label="edit"
                            className="h-5 w-5 flex-shrink-0 text-gray-600 dark:text-gray-400"
                        />
                    </Link>
                    <button
                        onClick={() => {
                            setFavouriteMutation.mutate({
                                journalId: entry.id,
                                favourite: !entry.favourite,
                            });

                            journals.updateEntry(entry.id, {
                                entry: {
                                    favourite: !entry.favourite,
                                },
                            });
                        }}
                    >
                        <Icon
                            icon={
                                entry.favourite ? HeartIcon : HeartOutlineIcon
                            }
                            label="favourite"
                            className={clsx("h-5 w-5 flex-shrink-0", {
                                "text-gray-600 dark:text-gray-400":
                                    !entry.favourite,
                                "text-pink-500 dark:text-pink-400":
                                    entry.favourite,
                            })}
                        />
                    </button>
                    <button
                        onClick={async () => {
                            const confirmed = await dialogs.showConfirmation({
                                title: "Delete Entry?",
                                description:
                                    "Are you sure you want to delete this entry? This action is irreversible.",
                            });

                            if (confirmed) {
                                deleteEntryMutation.mutate({
                                    journalId: entry.id,
                                });

                                journals.deleteEntry(entry.id);
                            }
                        }}
                    >
                        <Icon
                            icon={BinOutlineIcon}
                            label="delete"
                            className="h-5 w-5 flex-shrink-0 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
                        />
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
                <div className="prose dark:prose-invert">
                    <Remark>{entry.content}</Remark>
                </div>

                <JournalEntryTagList entry={entry} songs={songs} tags={tags} />

                {songs.map((songId) => (
                    <SongCard key={songId} songId={songId} />
                ))}
            </div>
        </div>
    );
}
