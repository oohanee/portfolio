import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-image-url.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;