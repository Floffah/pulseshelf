"use client";

import { useRef } from "react";

import { EntryList, EntryListRef } from "@/app/journal/EntryList";
import { NewEntryForm } from "@/app/journal/NewEntryForm";

export default function HomePage() {
    const entryListRef = useRef<EntryListRef>(null);

    return (
        <main className="flex flex-col gap-10">
            <NewEntryForm
                onEntryCreated={() => entryListRef.current?.refresh()}
            />

            <EntryList ref={entryListRef} />
        </main>
    );
}
