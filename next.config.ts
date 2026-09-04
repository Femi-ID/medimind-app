import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // We call the backend directly (CORS is configured backend-side), so no rewrites needed.
};

export default nextConfig;
