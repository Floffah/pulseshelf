import * as Popover from "@radix-ui/react-popover";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import BinIcon from "~icons/mdi/bin";
import PlusIcon from "~icons/mdi/plus";

import { Form } from "@/components/Form";
import { Icon } from "@/components/Icon";
import { api } from "@/lib/api";

const formSchema = z.object({
    query: z.string().min(1),
});
type FormValues = z.infer<typeof formSchema>;

interface SongPickerButtonProps {
    onPick: (songId: string) => void;
}

export function SongPickerButton({ onPick }: SongPickerButtonProps) {
    const trpcUtils = api.useUtils();

    const [open, setOpen] = useState(false);

    const searchSongMutation = api.music.searchTrack.useMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        await searchSongMutation.mutateAsync(data);
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger className="flex items-center rounded-lg border border-gray-400 px-4 py-2 text-gray-400 transition-colors duration-150 hover:bg-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
                <Icon icon={PlusIcon} className="h-6 w-6" />
                Add Song
            </Popover.Trigger>
            <Popover.Content className="w-full max-w-md rounded-lg border border-gray-200 bg-gray-100 p-2 shadow-xl dark:border-white/10 dark:bg-gray-800">
                <Popover.Arrow className="fill-gray-100 dark:fill-gray-700" />

                <Form
                    form={form}
                    submitHandler={onSubmit}
                    className="flex w-full items-center gap-2"
                >
                    <Form.Input
                        name="query"
                        placeholder="Search a song"
                        fieldClassName="flex-grow"
                    />
                    <Form.Button
                        size="md"
                        color="primary"
                        className="flex-shrink-0"
                    >
                        Search
                    </Form.Button>
                </Form>

                <div
                    className={clsx(
                        "mt-4 flex max-h-60 flex-col gap-2 overflow-x-hidden overflow-y-scroll",
                        {
                            "h-32 items-center justify-center":
                                !form.formState.isSubmitted,
                        },
                    )}
                >
                    {!form.formState.isSubmitted && (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            Hit submit to search for songs
                        </p>
                    )}

                    {searchSongMutation.data?.map((song) => (
                        <button
                            key={song.id}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 p-2 text-left hover:bg-gray-200 dark:border-white/10 dark:hover:bg-gray-800"
                            onClick={() => {
                                onPick(song.id);
                                trpcUtils.music.getTrack.setData(
                                    { id: song.id },
                                    song,
                                );
                                setOpen(false);
                            }}
                        >
                            <Image
                                src={song.album.images[0].url}
                                alt="Album cover"
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-lg"
                            />
                            <div>
                                <p className="font-semibold">
                                    {song.name}{" "}
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        • {song.album.name}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    {song.artists.join(", ")}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </Popover.Content>
        </Popover.Root>
    );
}
