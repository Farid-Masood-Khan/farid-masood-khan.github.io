/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    // Keep images local/static in export
    unoptimized: true
  },
  // Avoid server-only features to keep static export friendly
  experimental: {
    optimizeCss: true
  }
};

module.exports = nextConfig;