"use client";

import { useMemo, useState } from "react";

import CollapseHorizontalIcon from "~icons/mdi/collapse-horizontal";
import ExpandHorizontalIcon from "~icons/mdi/expand-horizontal";
import StarIcon from "~icons/mdi/star";

import type { JournalEntryAPIModel } from "@pulseshelf/api";
import { JournalFilter } from "@pulseshelf/lib";
import type { JournalEntry } from "@pulseshelf/models";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SongCard } from "@/components/SongCard";
import { api } from "@/lib/api";
import { useUser } from "@/state/user";

export function EntryList() {
    const user = useUser();

    const [filter, setFilter] = useState(JournalFilter.ALL);

    const journalEntries = api.journal.list.useInfiniteQuery(
        {
            filter,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            enabled: user.isAuthenticated,
        },
    );

    return (
        <div className="flex flex-col gap-2">
            <h2 className="flex-shrink-0 flex-grow text-xl font-semibold">
                My Entries
            </h2>

            <div className="flex flex-col gap-2">
                {journalEntries.data?.pages.map((page, i) =>
                    page.items.map(({ entry, songs }, j) => (
                        <Entry key={`${i}-${j}`} entry={entry} songs={songs} />
                    )),
                )}
            </div>
        </div>
    );
}

interface EntryProps {
    entry: JournalEntryAPIModel;
    songs: string[];
}

export function Entry({ entry, songs }: EntryProps) {
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
                <h3 className="text-xl font-semibold">
                    {dateFormatter.format(entry.createdAt)}
                </h3>
                <p className="flex items-center gap-0.5 text-yellow-500 dark:text-yellow-300">
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
