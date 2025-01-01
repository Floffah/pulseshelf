import { PropsWithChildren } from "react";
import { css, html } from "react-strict-dom";

import { fontSizes, lineHeights } from "../../styles/tokens.stylex";

export function Heading({
    level,
    children,
}: PropsWithChildren<{ level: 1 | 2 | 3 | 4 | 5 | 6 }>) {
    const elementName = `h${level}` as const;
    const Component = html[elementName];

    return (
        <Component style={[styles.base, styles[elementName]]}>
            {children}
        </Component>
    );
}

const styles = css.create({
    base: {
        color: {
            default: "black",
            "@media (prefers-color-scheme: dark)": "white",
        },
    },
    h1: {
        fontSize: fontSizes["4xl"],
        lineHeight: lineHeights["4xl"],
    },
    h2: {
        fontSize: fontSizes["3xl"],
        lineHeight: lineHeights["3xl"],
    },
    h3: {
        fontSize: fontSizes["2xl"],
        lineHeight: lineHeights["2xl"],
    },
    h4: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.xl,
    },
    h5: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
    },
    h6: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
    },
});
