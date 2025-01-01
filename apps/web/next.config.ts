import stylexPlugin from "@stylexswc/nextjs-plugin";
import autoprefixer from "autoprefixer";
import type { NextConfig } from "next";
import path from "node:path";
import { resolve } from "path";
import postcss from "postcss";
import Icons from "unplugin-icons/webpack";

const projectRoot = __dirname;
const rootDir = resolve(projectRoot, "../../");

const withStylex = stylexPlugin({
    rsOptions: {
        dev: process.env.NODE_ENV === "development",
        genConditionalClasses: true,
        treeshakeCompensation: true,
        useRemForFontSize: true,
        aliases: {
            "@/*": [path.join(projectRoot, "src/*")],
        },
        unstable_moduleResolution: {
            type: "commonJS",
            rootDir,
        },
    },
    useCSSLayers: true,
    transformCss: async (css: any) => {
        const result = await postcss([autoprefixer]).process(css);
        return result.css;
    },
});

const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ["@node-rs/bcrypt"],
    transpilePackages: ["@stylexjs/open-props"],
    typescript: {
        // part of lint step
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config) => {
        config.plugins ??= [];

        config.plugins.push(
            Icons({
                compiler: "jsx",
                jsx: "react",
            }),
        );

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.scdn.co",
                port: "",
                pathname: "/image/**",
            },
        ],
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-TRPC-Source, Authorization",
                    },
                ],
            },
        ];
    },
} satisfies NextConfig;

export default withStylex(nextConfig);
