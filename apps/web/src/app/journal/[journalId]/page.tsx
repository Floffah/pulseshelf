"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Entry } from "@/app/journal/Entry";
import { Loader } from "@/components/Loader";
import { api } from "@/lib/api";

export default function JournalEntryPage({ params: { journalId } }) {
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

            {journal.data && !journal.isError && <Entry {...journal.data} />}
        </>
    );
}
