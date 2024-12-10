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
  webpack: (config) => {
    // Disable punycode usage
    config.resolve.alias = {
      ...config.resolve.alias,
      punycode: false,
    };
    
    // Ensure fallbacks are properly handled
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;