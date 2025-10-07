import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "backend-gateplus-api.my.id",
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
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minio.gateplus.id",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
};

export default withNextVideo(nextConfig, { folder: 'public/videos' });