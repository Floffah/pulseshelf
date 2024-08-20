import Image from "next/image";
import poweredByVercelImage from "~/assets/brands/poweredByVercel.svg";
import spotifyImage from "~/assets/brands/spotify.png";

export default function AuthRoutesLayout({ children }) {
    return (
        <div className="flex h-screen">
            <div className="flex max-w-full flex-shrink-0 flex-grow flex-col gap-4 p-4 py-10 sm:max-w-[80%]">
                <h1 className="w-fit text-2xl font-bold">PulseShelf</h1>

                {children}

                <p className="text-center text-sm dark:text-gray-400">
                    PulseShelf is currently invite-only. Request access on{" "}
                    <a
                        href="https://discord.gg/DsSeGSc5na"
                        className="underline dark:text-blue-400"
                    >
                        the Discord
                    </a>
                    .
                </p>

                <div className="mt-6 flex items-center justify-center gap-2">
                    <a
                        href="https://vercel.com/?utm_source=pulseshelf"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <Image
                            src={poweredByVercelImage}
                            alt="Powered by Vercel"
                            width={200}
                        />
                    </a>

                    <a
                        href="https://spotify.com/?utm_source=pulseshelf"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <Image
                            src={spotifyImage}
                            alt="Spotify"
                            width={150}
                            placeholder="blur"
                        />
                    </a>
                </div>
            </div>
            <div className="hidden flex-grow bg-blue-500 sm:block dark:bg-blue-900"></div>
        </div>
    );
}
