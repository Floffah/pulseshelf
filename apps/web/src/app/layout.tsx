import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";

import "@/app/globals.css";
import { populateMetadata } from "@/lib/populateMetadata";
import { APIProvider } from "@/providers/APIProvider";
import { DialogProvider } from "@/providers/DialogProvider";

export const metadata = populateMetadata({
    title: "Pulseshelf",
    description: "Document your life through music",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={inter.className}>
                <APIProvider>
                    <DialogProvider>{children}</DialogProvider>
                </APIProvider>

                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
