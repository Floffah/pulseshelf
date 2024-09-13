import BinOutlineIcon from "~icons/mdi/bin-outline";

import { Icon } from "@/components/Icon";
import { AddTagButton } from "@/components/TagList/AddTagButton";

export interface TagListProps {
    mutable?: boolean;
    tags: string[];
    onChange?: (tags: string[]) => void;
}

export function TagList({ mutable, tags = [], onChange }: TagListProps) {
    return (
        <div className="flex items-center gap-1">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-gray-300 px-2 py-0.5 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                    {tag}
                    {mutable && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange?.(tags.filter((t) => t !== tag));
                            }}
                        >
                            <Icon
                                icon={BinOutlineIcon}
                                label="remove tag"
                                className="h-4 w-4"
                            />
                        </button>
                    )}
                </span>
            ))}

            {mutable && (
                <AddTagButton
                    tags={tags}
                    onSubmit={(tag) => onChange?.([...tags, tag])}
                />
            )}
        </div>
    );
}
