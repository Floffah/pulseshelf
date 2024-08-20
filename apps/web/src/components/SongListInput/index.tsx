"use client";

import clsx from "clsx";
import { ComponentProps, useEffect, useState } from "react";

import { SongCard } from "@/components/SongListInput/SongCard";
import { SongPickerButton } from "@/components/SongListInput/SongPickerButton";

export interface SongPickerProps
    extends Omit<ComponentProps<"div">, "children" | "onChange"> {
    songIds?: string[];
    onChange?: (songIds: string[]) => void;
    maxSongs?: number;
}

export function SongListInput({
    maxSongs,
    songIds: propsSongIds,
    onChange,
    className,
    ...props
}: SongPickerProps) {
    const [songIds, setSongIds] = useState(propsSongIds ?? []);

    useEffect(() => {
        if (Array.isArray(propsSongIds)) {
            setSongIds(propsSongIds);
        }
    }, [propsSongIds]);

    return (
        <div {...props} className={clsx(className, "flex flex-col gap-2")}>
            {songIds.map((songId) => (
                <SongCard
                    key={songId}
                    songId={songId}
                    onRemove={() =>
                        setSongIds((prevSongIds) =>
                            prevSongIds.filter((id) => id !== songId),
                        )
                    }
                />
            ))}

            {(!maxSongs || songIds.length < maxSongs) && (
                <SongPickerButton
                    onPick={(songId) => {
                        setSongIds([...songIds, songId]);
                        onChange?.([...songIds, songId]);
                    }}
                />
            )}
        </div>
    );
}
