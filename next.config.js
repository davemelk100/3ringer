/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@auth0/auth0-react"],
  webpack: (config, { isServer }) => {
    // Suppress warnings
    config.ignoreWarnings = [
      { module: /node_modules\/node-fetch\/lib\/index\.js/ },
      { module: /node_modules\/punycode\/punycode\.js/ },
    ];

    // Add fallbacks for node modules
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      punycode: false,
    };

    return config;
  },
  // Suppress specific build warnings
  onDemandEntries: {
    // Reduce log noise
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
