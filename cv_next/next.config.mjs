/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh5.googleusercontent.com", "weepggwhsrfmizptbnua.supabase.co"],
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["pino", "pino-pretty"],
};

export default nextConfig;
