/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@auth0/auth0-react"],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
