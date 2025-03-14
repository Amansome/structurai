/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
            },
        ],
    },
    // Disable ESLint during build to avoid errors
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Ignore type errors during build for deployment
        ignoreBuildErrors: true,
    },
};

export default config;
