import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import Icons from "unplugin-icons/webpack";

const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkGfm],
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        esmExternals: "loose",
        serverComponentsExternalPackages: ["@node-rs/bcrypt"],
    },
    typescript: {
        // part of lint step, next ignores tsconfig references and breaks trpc
        ignoreBuildErrors: true,
    },
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    webpack: (config) => {
        config.plugins.push(
            Icons({
                compiler: "jsx",
                jsx: "react",
            }),
        );

        return config;
    },
};

export default withMDX(nextConfig);
