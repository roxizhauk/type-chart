/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS && "/type-chart",
  trailingSlash: true,
};

module.exports = nextConfig;
