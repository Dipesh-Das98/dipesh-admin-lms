import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "01vu1om9by.ufs.sh",
        port: "",
        pathname: "/**",
      },
      {
        // NOTE:remove when moving to production
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081", // ✅ Must be exact
        pathname: "/**",
      },
        {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // ✅ Must be exact
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
