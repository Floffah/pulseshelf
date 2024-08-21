import clsx from "clsx";
import { ComponentProps, ReactNode, forwardRef, memo } from "react";

export interface ContentRendererProps
    extends Omit<ComponentProps<"div">, "children" | "ref"> {
    content: string;
}

const ContentRendererCore = forwardRef<HTMLDivElement, ContentRendererProps>(
    ({ content, className, ...props }, ref) => {
        let unprocessedContent = content;
        const contentParts: ReactNode[] = [];

        let accumulator = "";
        while (unprocessedContent.length > 0) {
            if (unprocessedContent.startsWith("\n")) {
                if (accumulator.length > 0) {
                    contentParts.push(<p>{accumulator}</p>);
                    accumulator = "";
                    unprocessedContent = unprocessedContent.slice(1);
                } else {
                    unprocessedContent = unprocessedContent.slice(1);
                }
            } else {
                accumulator += unprocessedContent[0];
                unprocessedContent = unprocessedContent.slice(1);
            }
        }

        if (accumulator.length > 0) {
            contentParts.push(<p>{accumulator}</p>);
        }

        return (
            <div
                {...props}
                ref={ref}
                className={clsx(className, "prose dark:prose-invert")}
            >
                {contentParts}
            </div>
        );
    },
);

export const ContentRenderer = memo(ContentRendererCore);
