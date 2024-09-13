import { JournalFilter } from "@pulseshelf/lib";

import { TRPCOutputTypes, api } from "@/lib/api";

export function useJournals() {
    const trpcUtils = api.useUtils();

    const createEntry = (entry: TRPCOutputTypes["journal"]["get"]) => {
        const existingList = trpcUtils.journal.list.getInfiniteData({
            filter: JournalFilter.ALL,
        });

        if (existingList) {
            trpcUtils.journal.list.setInfiniteData(
                {
                    filter: JournalFilter.ALL,
                },
                {
                    ...existingList,
                    pages: [
                        {
                            ...existingList.pages[0],
                            items: [entry, ...existingList.pages[0].items],
                        },
                        ...existingList.pages.slice(1),
                    ],
                } as typeof existingList,
            );
        }

        trpcUtils.journal.get.setData({ journalId: entry.entry.id }, entry);
    };

    const updateEntry = (
        entryId: string,
        newData: Partial<
            Omit<TRPCOutputTypes["journal"]["get"], "entry"> & {
                entry: Partial<TRPCOutputTypes["journal"]["get"]["entry"]>;
            }
        >,
    ) => {
        const existingList = trpcUtils.journal.list.getInfiniteData({
            filter: JournalFilter.ALL,
        });

        let newList =
            existingList?.pages.map((page) => ({
                ...page,
                items: page.items.map((item) =>
                    item.entry.id === entryId
                        ? {
                              ...item,
                              ...newData,
                              entry: {
                                  ...item.entry,
                                  ...newData.entry,
                              },
                              songs: newData.songs ?? item.songs,
                              tags: newData.tags ?? item.tags,
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

        const existingEntry = trpcUtils.journal.get.getData({
            journalId: entryId,
        });

        if (existingEntry) {
            trpcUtils.journal.get.setData(
                { journalId: entryId },
                {
                    ...existingEntry,
                    ...newData,
                    entry: {
                        ...existingEntry.entry,
                        ...newData.entry,
                    },
                    songs: newData.songs ?? existingEntry.songs,
                    tags: newData.tags ?? existingEntry.tags,
                },
            );
        }
    };

    const deleteEntry = (entryId: string) => {
        const existingList = trpcUtils.journal.list.getInfiniteData({
            filter: JournalFilter.ALL,
        });

        let newList =
            existingList?.pages.map((page) => ({
                ...page,
                items: page.items.filter((item) => item.entry.id !== entryId),
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

        trpcUtils.journal.get.reset({ journalId: entryId });
    };

    return {
        createEntry,
        updateEntry,
        deleteEntry,
    };
}
