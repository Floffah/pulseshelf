import { Loader } from "@/components/Loader";
import { api } from "@/lib/api";

interface SongCardProps {
    songId: string;
    onRemove: () => void;
}

export function SongCard({ songId, onRemove }: SongCardProps) {
    const song = api.music.getTrack.useQuery({ id: songId });

    return (
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-2 text-left hover:bg-gray-200 dark:border-white/10 dark:hover:bg-gray-800">
            {song.isLoading && <Loader />}

            {song.error && (
                <p className="text-red-400 dark:text-red-500">
                    Could not load song data: {song.error.message}
                </p>
            )}

            {song.data && (
                <>
                    <img
                        src={song.data.album.images[0].url}
                        alt="Album cover"
                        className="h-12 w-12 rounded-lg"
                    />
                    <div>
                        <p className="font-semibold">{song.data.name}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            {song.data.artists.join(", ")}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
