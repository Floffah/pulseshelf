"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

import { JournalEntry } from "@/components/JournalEntry";
import { Loader } from "@/components/Loader";
import { api } from "@/lib/api";

export default function JournalEntryPage(props) {
    const params = use<any>(props.params);

    const { journalId } = params;

    const router = useRouter();

    const journal = api.journal.get.useQuery({
        journalId,
    });

    useEffect(() => {
        if (journal.isError) {
            router.push("/journal");
        }
    }, [journal.isError, router]);

    return (
        <>
            {journal.isLoading && (
                <div className="flex items-center justify-center py-10">
                    <Loader />
                </div>
            )}

            {journal.data && !journal.isError && (
                <JournalEntry {...journal.data} />
            )}
        </>
    );
}
