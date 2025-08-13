/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // For local Docker development
      {
        protocol: 'http',
        hostname: 'backend', // Docker service name (not 'localhost')
        port: '8000',
        pathname: '/api/images/**',
      },
      // For production (S3)
      {
        protocol: "https",
        hostname: "s3-inventorymanager.s3.amazonaws.com",
        pathname: "/**",
      }
    ],
    // This is needed for the iamges to work in development right now
    unoptimized: process.env.NODE_ENV === 'development'
  }
};

export default nextConfig;