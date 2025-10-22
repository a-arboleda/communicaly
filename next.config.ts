import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable type-safe route helpers without experimental flag
  typedRoutes: true,
  // Pin Turbopack root to this project to avoid parent lockfile inference
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
