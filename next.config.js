/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // basePath: process.env.GITHUB_ACTIONS && "/type-chart",
  experimental: {
    appDir: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
