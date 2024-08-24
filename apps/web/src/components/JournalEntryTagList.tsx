import type { JournalEntryAPIModel } from "@pulseshelf/api";

import { TagList } from "@/components/TagList";
import { api } from "@/lib/api";
import { useJournals } from "@/providers/journals";

export interface JournalEntryTagListProps {
    mutable?: boolean;
    entry: JournalEntryAPIModel;
    songs: string[];
    tags: string[];
}

export function JournalEntryTagList({
    mutable,
    entry,
    tags,
}: JournalEntryTagListProps) {
    const editJournal = api.journal.editEntry.useMutation();
    const journals = useJournals();

    const onChange = async (tags: string[]) => {
        editJournal.mutate({
            journalId: entry.id,
            tags,
        });

        journals.updateEntry(entry.id, {
            tags,
        });
    };

    return <TagList mutable={mutable} onChange={onChange} tags={tags} />;
}
