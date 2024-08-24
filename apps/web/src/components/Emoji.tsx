import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import {forwardRef, memo} from "react";

import { toCodePoints } from "@/lib/toCodePoint";

export const Emoji = memo(forwardRef<
    HTMLImageElement,
    { emoji: string } & Omit<ImageProps, "ref" | "children" | "src">
>(({ emoji, alt, height, width, ...props }, ref) => {
    const codePoints = toCodePoints(emoji);

    return (
        <Image
            ref={ref}
            src={`https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/${codePoints}.svg`}
            alt={alt ?? emoji}
            width={width || 200}
            height={height || 200}
            {...props}
        />
    );
}));
