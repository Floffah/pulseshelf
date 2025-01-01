// Variables names in this file should as much as possible prevent using square brace indexing
import { css } from "react-strict-dom";

export const DARK_VARIANT = "@media (prefers-color-scheme: dark)";

// Colours MUST be tailwind colours = https://tailwindcss.com/docs/customizing-colors
// We cannot import them as stylex requires literal values
export const colours = css.defineVars({
    foreground: {
        default: "black",
        [DARK_VARIANT]: "white",
    },
    background: {
        default: "white",
        [DARK_VARIANT]: "#030712", // gray-950
    },

    primaryForeground: "white",
    primaryBackground: {
        default: "#3b82f6", // blue-500
        [DARK_VARIANT]: "#1d4ed8", // blue-700
    },
    secondaryForeground: {
        default: "black",
        [DARK_VARIANT]: "white",
    },
    secondaryBackground: {
        default: "rgba(black / 10%)",
        [DARK_VARIANT]: "rgba(white / 10%)",
    },
    successForeground: "white",
    successBackground: {
        default: "#22c55e", // green-500
        [DARK_VARIANT]: "#15803d", // green-700
    },
    dangerForeground: "white",
    dangerBackground: {
        default: "#ef4444", // red-500
        [DARK_VARIANT]: "#991b1b", // red-800
    },
});

export const fonts = css.defineVars({
    fontSans: "var(--font-sans)",
});

// General sizes
// Sizes are in rem, if it begins with 't' it is a tailwind size (1rem = 4 tailwind units)
// In a perfect world, this var group has very little in it to keep the UI consistent
export const sizes = css.defineVars({
    t1: "0.25rem",
    t1_5: "0.375rem",
    t2: "0.5rem",
    t3: "0.75rem",
    t4: "1rem",
});

// https://tailwindcss.com/docs/font-size
export const fontSizes = css.defineVars({
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
});

// pair with the above
export const lineHeights = css.defineVars({
    xs: "1rem",
    sm: "1.25rem",
    base: "1.5rem",
    lg: "1.75rem",
    xl: "1.75rem",
    "2xl": "2rem",
    "3xl": "2.25rem",
    "4xl": "2.5rem",
    "5xl": "1",
    "6xl": "1",
    "7xl": "1",
    "8xl": "1",
    "9xl": "1",
});

export const radii = css.defineVars({
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
});
