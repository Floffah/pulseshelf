import clsx from "clsx";
import { ComponentProps, ComponentPropsWithoutRef } from "react";

import EmoticonDeadEmoji from "~icons/mdi/emoticon-dead";
import EmoticonExcitedEmoji from "~icons/mdi/emoticon-excited";
import EmoticonHappyEmoji from "~icons/mdi/emoticon-happy";
import EmoticonNeutralEmoji from "~icons/mdi/emoticon-neutral";
import EmoticonSadEmoji from "~icons/mdi/emoticon-sad";

import { Icon } from "@/components/Icon";

const ratingLabels = [
    "Severely dissatisfied",
    "Dissatisfied",
    "Neutral",
    "Satisfied",
    "Extremely satisfied",
];

const ratingEmojis = [
    EmoticonDeadEmoji,
    EmoticonSadEmoji,
    EmoticonNeutralEmoji,
    EmoticonHappyEmoji,
    EmoticonExcitedEmoji,
];

const ratingColors = [
    "text-red-500 dark:text-red-400",
    "text-orange-500 dark:text-orange-400",
    "text-yellow-500 dark:text-yellow-400",
    "text-lime-500 dark:text-lime-400",
    "text-green-500 dark:text-green-400",
];

interface RatingEmojiProps
    extends Omit<ComponentPropsWithoutRef<"svg">, "children"> {
    rating: number;
}

export function RatingEmoji({ className, rating, ...props }: RatingEmojiProps) {
    return (
        <Icon
            icon={ratingEmojis[rating - 1]}
            className={clsx(className, ratingColors[rating - 1])}
            label={ratingLabels[rating - 1]}
            {...props}
        />
    );
}
