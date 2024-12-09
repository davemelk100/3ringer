/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false,
  // Disable SWC compilation
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  }
};

module.exports = nextConfig;