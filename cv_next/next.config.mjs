/** @type {import('next').NextConfig} */
import withPlaiceholder from "@plaiceholder/next";

const nextConfig = {
  images: {
    domains: ["lh5.googleusercontent.com", "weepggwhsrfmizptbnua.supabase.co"],
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      "bufferutil": "commonjs bufferutil",
      "thread-stream": "commonjs thread-stream",
    });
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
};

export default withPlaiceholder(nextConfig);
