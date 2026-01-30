import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Required for proper Vercel deployment
  output: "standalone",

  // ✅ Disable TypeScript build errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Turbopack configuration
  turbopack: {},
};

export default nextConfig;

