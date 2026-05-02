/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai'],
  },
  // Disable static generation for all pages - force dynamic rendering
  trailingSlash: false,
  // Ensure all pages are dynamic
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly set output to handle dynamic routes
  output: 'standalone',
};

module.exports = nextConfig;
