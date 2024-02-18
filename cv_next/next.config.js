/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["lh5.googleusercontent.com"],
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      "bufferutil": "commonjs bufferutil",
    })
    return config
  },
}

module.exports = nextConfig
