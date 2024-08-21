"use client";

import Link from "next/link";

import { useUser } from "@/state/user";

export default function NavBar() {
    const user = useUser();

    return (
        <div className="flex items-center border-b border-blue-600 px-6 py-2 dark:border-blue-400">
            <Link
                href="/journal"
                className="flex-shrink-0 text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
                PulseShelf
            </Link>

            <div className="flex-grow"></div>

            {!user.isAuthenticated && (
                <Link href="/" className="text-blue-600">
                    Login
                </Link>
            )}
        </div>
    );
}
