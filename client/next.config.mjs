/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['recharts'],
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
      {
        protocol: 'https',
        hostname: 'yourdomain.com',
        pathname: '/static/**',
      },
      {
        protocol: "https",
        hostname: "s3-inventorymanager.s3.amazonaws.com",
        pathname: "/**",
      }
    ],
    unoptimized: true
  }
};

export default nextConfig;