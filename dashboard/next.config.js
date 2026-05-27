/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // Allow ESM imports from the parent src/ directory for API routes
  transpilePackages: ["recharts"],
};

module.exports = nextConfig;
