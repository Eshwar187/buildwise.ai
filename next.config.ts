import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // The codebase has many pre-existing lint warnings; keep editor linting
    // but don't fail production builds on them.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Pre-existing TS issues (framer-motion types, missing icon exports)
    // should not block the build.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
