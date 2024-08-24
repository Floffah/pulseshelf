"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

import { JournalFilter } from "@pulseshelf/lib";

import { JournalEntry } from "@/components/JournalEntry";
import { Loader } from "@/components/Loader";
import { api } from "@/lib/api";
import { useUser } from "@/state/user";

export interface EntryListRef {
    refresh: () => Promise<void>;
}

export const EntryList = forwardRef<EntryListRef>((_props, ref) => {
    const user = useUser();

    const [filter, setFilter] = useState(JournalFilter.ALL);

    const journalEntries = api.journal.list.useInfiniteQuery(
        {
            filter,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            enabled: user.isAuthenticated,
            refetchOnMount: true,
        },
    );

    useImperativeHandle(ref, () => ({
        refresh: async () => {
            await journalEntries.refetch();
        },
    }));

    return (
        <div className="flex flex-col gap-2">
            <h2 className="flex-shrink-0 flex-grow text-xl font-semibold">
                My Entries
            </h2>

            <div className="flex flex-col gap-2">
                {journalEntries.isLoading && (
                    <p className="flex w-full items-center justify-center py-10 text-center text-gray-400 dark:text-gray-400">
                        <Loader />
                    </p>
                )}

                {!journalEntries.isLoading && !journalEntries.data && (
                    <p className="w-full py-16 text-center text-sm text-gray-400 dark:text-gray-500">
                        Add your first entry to start tracking.
                    </p>
                )}

                {journalEntries.data?.pages.map((page, i) =>
                    page.items.map(({ entry, songs, tags }, j) => (
                        <JournalEntry
                            key={`${i}-${j}`}
                            entry={entry}
                            songs={songs}
                            tags={tags}
                        />
                    )),
                )}
            </div>
        </div>
    );
});
