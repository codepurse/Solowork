/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // Add canvas to externals
    return config;
  },
};

module.exports = nextConfig;
