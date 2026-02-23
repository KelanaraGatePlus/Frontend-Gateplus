import process from "node:process";
import { withNextVideo } from "next-video/process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    unoptimized: false,
    minimumCacheTTL: 31536000,
    formats: ["image/avif", "image/webp"],
    domains: [
      "backend-gateplus-api.my.id",
      "gateplussistem.online",
      "minio.gateplus.id",
      "103.38.108.117",
      "d2lioolgjpe1s1.cloudfront.net",
      "d3670a894gi0az.cloudfront.net",
      "d2gm7jt7rzy1kk.cloudfront.net",
      "picsum.photos",
      "images.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "103.38.108.117",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "minio.gateplus.id",
        port: "9000",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    legacyBrowsers: false,
    optimizePackageImports: ["lodash", "date-fns", "lucide-react"],
  },

  webpack: (config) => {
    config.resolve.alias.moment = false;

    config.optimization.splitChunks = {
      chunks: "all",
      maxSize: 200000,
    };

    return config;
  },
};

export default withNextVideo(nextConfig, {
  folder: "public/videos",
  optimize: true,
  inline: false,
  loader: "external",
});
