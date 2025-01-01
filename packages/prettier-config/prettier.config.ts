import { Config } from "prettier";

export const withBase = (config: Config) => ({
    ...config,
    trailingComma: "all",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    jsxSingleQuote: false,
    jsxBracketSameLine: false,
    arrowParens: "always",
    endOfLine: "lf",
    embeddedLanguageFormatting: "auto",

    importOrder: ["<THIRD_PARTY_MODULES>", "^@pulseshelf/(.*)$", "^@/(.*)$"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true,

    plugins: [
        "prettier-plugin-organize-imports",
        "@trivago/prettier-plugin-sort-imports",
        ...(config.plugins ?? []),
    ],
});
