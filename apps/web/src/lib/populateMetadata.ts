import { Metadata } from "next";
import type { Icon } from "next/dist/lib/metadata/types/metadata-types";

interface PopulateMetadataOptions {
    title?: string;
    description?: string;
}

export function populateMetadata(
    { title, description }: PopulateMetadataOptions,
    override: Metadata = {},
): Metadata {
    return {
        metadataBase: new URL("https://pulseshelf.com"),
        title,
        description,
        openGraph: {
            title,
            description,
            ...override.openGraph,
        },
        twitter: {
            title,
            description,
            ...override.twitter,
        },
        ...override,
    };
}
