"use client";

import clsx from "clsx";
import { useMemo } from "react";

import BinOutlineIcon from "~icons/mdi/bin-outline";
import HeartIcon from "~icons/mdi/heart";
import HeartOutlineIcon from "~icons/mdi/heart-outline";
import StarIcon from "~icons/mdi/star";

import type { JournalEntryAPIModel } from "@pulseshelf/api";
import { JournalFilter } from "@pulseshelf/lib";

import { Icon } from "@/components/Icon";
import { SongCard } from "@/components/SongCard";
import { api } from "@/lib/api";
import { useDialogs } from "@/providers/DialogProvider";

export interface EntryProps {
    entry: JournalEntryAPIModel;
    songs: string[];
}

export function Entry({ entry, songs }: EntryProps) {
    const trpcUtils = api.useUtils();
    const dialogs = useDialogs();

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

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-gray-200 p-4 dark:bg-gray-800">
            <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 overflow-hidden">
                    <p className="flex-grow text-xl font-semibold">
                        {dateFormatter.format(entry.createdAt)}
                    </p>

                    <button
                        onClick={() => {
                            setFavouriteMutation.mutate({
                                journalId: entry.id,
                                favourite: !entry.favourite,
                            });

                            const existingList =
                                trpcUtils.journal.list.getInfiniteData({
                                    filter: JournalFilter.ALL,
                                });

                            let newList =
                                existingList?.pages.map((page) => ({
                                    ...page,
                                    items: page.items.map((item) =>
                                        item.entry.id === entry.id
                                            ? {
                                                  ...item,
                                                  entry: {
                                                      ...item.entry,
                                                      favourite:
                                                          !entry.favourite,
                                                  },
                                              }
                                            : item,
                                    ),
                                })) ?? [];

                            trpcUtils.journal.list.setInfiniteData(
                                {
                                    filter: JournalFilter.ALL,
                                },
                                {
                                    ...existingList,
                                    pages: newList,
                                } as typeof existingList,
                            );
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

                                const existingList =
                                    trpcUtils.journal.list.getInfiniteData({
                                        filter: JournalFilter.ALL,
                                    });

                                let newList =
                                    existingList?.pages.map((page) => ({
                                        ...page,
                                        items: page.items.filter(
                                            (item) =>
                                                item.entry.id !== entry.id,
                                        ),
                                    })) ?? [];

                                trpcUtils.journal.list.setInfiniteData(
                                    {
                                        filter: JournalFilter.ALL,
                                    },
                                    {
                                        ...existingList,
                                        pages: newList,
                                    } as typeof existingList,
                                );
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
                <p className="flex items-center gap-0.5 text-yellow-500 dark:text-yellow-500">
                    <Icon icon={StarIcon} label="rating" />
                    {entry.rating}
                </p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
                <p>{entry.content}</p>

                {songs.map((songId) => (
                    <SongCard key={songId} songId={songId} />
                ))}
            </div>
        </div>
    );
}
