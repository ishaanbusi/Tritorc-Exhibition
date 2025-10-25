import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'modelviewer.dev',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
