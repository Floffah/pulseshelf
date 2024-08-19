"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/Form";
import { SongListInput } from "@/components/SongListInput";

const formSchema = z.object({
    rating: z.number().int().min(1).max(5),
    content: z.string().min(1),
    songIds: z.array(z.string()),
});
type FormValues = z.infer<typeof formSchema>;

export function NewEntryForm() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "Today I felt...",
            songIds: [],
        },
    });

    const currentRating = form.watch("rating");
    const ratingSet = typeof currentRating === "number";

    const onSubmit = (data: FormValues) => {};

    return (
        <Form
            form={form}
            submitHandler={onSubmit}
            className="flex flex-col gap-2 rounded-lg bg-gray-200 p-4 dark:bg-gray-800"
        >
            <h1 className="text-xl font-semibold">
                How are you feeling today?
            </h1>

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
                        onClick={() => {
                            form.setValue("rating", index + 1);
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {ratingSet && (
                <>
                    <Form.TextArea
                        label="Entry"
                        description="Write as much as you want!"
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
                </>
            )}
        </Form>
    );
}
