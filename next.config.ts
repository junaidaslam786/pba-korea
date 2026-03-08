import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbakorea.org" },
      { protocol: "https", hostname: "**.pbakorea.org" },
    ],
  },
};

export default nextConfig;
