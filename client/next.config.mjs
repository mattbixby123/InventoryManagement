/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '80',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: 'nginx',
        port: '80',
        pathname: '/static/**',
      },
      // For production (example)
      {
        protocol: 'https',
        hostname: 'yourdomain.com',
        pathname: '/static/**',
      },
      // For production (S3)
      {
        protocol: "https",
        hostname: "s3-inventorymanager.s3.amazonaws.com",
        pathname: "/**",
      }
    ],
    // Disable optimization for static images in development
    unoptimized: true
  }
};

export default nextConfig;