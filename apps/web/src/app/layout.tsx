import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import "@/app/globals.css";
import { populateMetadata } from "@/lib/populateMetadata";
import { APIProvider } from "@/providers/APIProvider";
import { colours, fonts } from "@/styles/tokens.stylex";

export const metadata = populateMetadata({
    title: "Pulseshelf",
    description: "Document your life through music",
});

const geistSans = Geist({
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            {...stylex.props(styles.html, {
                "--font-sans": geistSans.style.fontFamily,
                "--font-mono": geistMono.style.fontFamily,
            } as StyleXStyles)}
        >
            <body {...stylex.props(styles.body)}>
                <APIProvider>{children}</APIProvider>

                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}

const styles = stylex.create({
    html: {
        colorScheme: "dark light",
    },
    body: {
        fontFamily: fonts.fontSans,
        color: colours.foreground,
        backgroundColor: colours.background,
    },
});
