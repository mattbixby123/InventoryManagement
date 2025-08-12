/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
              protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/images/**',
      },
      {
        protocol: "https",
        hostname: "s3-inventorymanager.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ]
  }

};

export default nextConfig;
