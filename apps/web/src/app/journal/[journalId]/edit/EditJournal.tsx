import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/Form";
import { JournalEntryTagList } from "@/components/JournalEntryTagList";
import { SongListInput } from "@/components/SongListInput";
import { api } from "@/lib/api";
import { useJournals } from "@/providers/journals";

const formSchema = z.object({
    content: z.string().min(1),
    songIds: z.array(z.string()),
});
type FormValues = z.infer<typeof formSchema>;

/**
 * Only mount ONCE journal.get has been fetched and cache
 */
export function EditJournal({ journalId }: { journalId: string }) {
    const trpcUtils = api.useUtils();
    const router = useRouter();
    const journals = useJournals();

    const journal = api.journal.get.useQuery({
        journalId,
    });

    const editJournal = api.journal.editEntry.useMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: journal.data?.entry.content ?? "",
            songIds: journal.data?.songs ?? [],
        },
    });

    const onSubmit = async (data: FormValues) => {
        await editJournal.mutateAsync({
            journalId,
            ...data,
        });

        journals.updateEntry(journalId, {
            entry: data,
        });

        router.push(`/journal/${journalId}`);
    };

    useEffect(() => {
        router.prefetch(`/journal/${journalId}`);
    }, [router, journalId]);

    return (
        <Form
            form={form}
            submitHandler={onSubmit}
            className="flex flex-col gap-2 rounded-lg bg-gray-200 p-4 dark:bg-gray-800"
        >
            <Form.TextArea
                label="Entry"
                description={
                    <>
                        Write as much as you want! Uses{" "}
                        <a
                            href="https://www.markdownguide.org/cheat-sheet/"
                            className="text-blue-600/60 underline dark:text-blue-400"
                        >
                            Markdown
                        </a>
                        .
                    </>
                }
                name="content"
                placeholder="How are you feeling?"
                minRows={3}
                maxRows={10}
            />

            <SongListInput
                songIds={form.watch("songIds")}
                onChange={(songIds) => form.setValue("songIds", songIds)}
                maxSongs={3}
            />

            {journal.data && (
                <JournalEntryTagList
                    mutable
                    entry={journal.data.entry}
                    songs={journal.data.songs}
                    tags={journal.data.tags}
                />
            )}

            <Form.Button color="primary" size="md">
                Save
            </Form.Button>
        </Form>
    );
}
