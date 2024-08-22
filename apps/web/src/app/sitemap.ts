import { MetadataRoute } from "next";

function formatUrl(path = ""): string {
    return process.env.NEXT_PUBLIC_BASE_URL + path;
}

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: formatUrl(),
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: formatUrl("/register"),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];
}
