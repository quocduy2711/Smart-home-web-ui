import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.ELECTRON === 'true' ? 'export' : 'standalone',
  distDir: process.env.ELECTRON === 'true' ? 'out' : '.next',
};

export default nextConfig;
