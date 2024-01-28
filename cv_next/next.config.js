/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["lh5.googleusercontent.com"],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
