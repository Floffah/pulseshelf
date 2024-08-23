"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/Form";
import { Loader } from "@/components/Loader";
import { SongListInput } from "@/components/SongListInput";
import { api } from "@/lib/api";
import { useUser } from "@/state/user";

const formSchema = z.object({
    rating: z.number().int().min(1).max(5),
    content: z.string().min(1),
    songIds: z.array(z.string()),
});
type FormValues = z.infer<typeof formSchema>;

export function NewEntryForm({
    onEntryCreated,
}: {
    onEntryCreated: () => void;
}) {
    const user = useUser();

    const createEntryMutation = api.journal.createEntry.useMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "Today I felt...",
            songIds: [],
        },
    });

    const currentRating = form.watch("rating");
    const ratingSet = typeof currentRating === "number";

    const onSubmit = async (data: FormValues) => {
        await createEntryMutation.mutateAsync(data);

        await onEntryCreated();

        form.reset();
    };

    return (
        <Form
            form={form}
            submitHandler={onSubmit}
            className="flex flex-col gap-2 rounded-lg bg-gray-200 p-4 dark:bg-gray-800"
        >
            <h1 className="text-xl font-semibold">
                How are you feeling today?
            </h1>

            {user.isLoading && (
                <p className="flex w-full items-center justify-center py-10 text-center text-gray-400 dark:text-gray-400">
                    <Loader />
                </p>
            )}

            {!user.isAuthenticated && !user.isLoading && (
                <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-400">
                    Sign in to start creating entries.
                </p>
            )}

            {user.isAuthenticated && (
                <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <button
                            key={index}
                            className={clsx(
                                "flex-shrink-0 flex-grow border-b border-t p-4 text-lg font-semibold transition-colors duration-150 hover:bg-gray-300 dark:hover:bg-gray-700",
                                {
                                    "border-gray-400 dark:border-gray-700":
                                        ratingSet,
                                    "border-blue-400 dark:border-blue-600":
                                        !ratingSet,
                                    "rounded-l-lg border-l": index === 0,
                                    "rounded-r-lg border-r": index === 4,
                                    "bg-gray-300 dark:bg-gray-700":
                                        currentRating === index + 1,
                                },
                            )}
                            type="button"
                            onClick={() => {
                                form.setValue("rating", index + 1);
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}

            {!ratingSet && createEntryMutation.isSuccess && (
                <p className="w-full py-12 text-center text-green-400 dark:text-green-500">
                    Rating saved! Create another?
                </p>
            )}

            {ratingSet && (
                <>
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
                        onChange={(songIds) =>
                            form.setValue("songIds", songIds)
                        }
                        maxSongs={3}
                    />

                    <Form.Button color="primary" size="md">
                        Save
                    </Form.Button>
                </>
            )}
        </Form>
    );
}
