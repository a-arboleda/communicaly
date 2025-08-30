import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    // Keep any useful experimental flags here
    typedRoutes: true,
  },
  // Pin Turbopack root to this project to avoid parent lockfile inference
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
