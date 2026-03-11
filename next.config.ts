import type { NextConfig } from "next";
import path from "path";

const useTurbopack = process.env.NEXT_DISABLE_TURBOPACK !== "1";

const nextConfig: NextConfig = {
  // Enable type-safe route helpers without experimental flag
  typedRoutes: true,
  ...(useTurbopack
    ? {
        // Pin Turbopack root to this project to avoid parent lockfile inference
        turbopack: {
          root: path.resolve(__dirname),
        },
      }
    : {}),
};

export default nextConfig;
