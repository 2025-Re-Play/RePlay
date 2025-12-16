import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://replay-production-69e1.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
