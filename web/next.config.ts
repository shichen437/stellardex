import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  swcMinify: true,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
      // 支持 localhost
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // 支持 127.0.0.1
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      // 支持 192.168.x.x
      {
        protocol: 'http',
        hostname: '192.168.**',
      },
      // 支持 10.x.x.x
      {
        protocol: 'http',
        hostname: '10.**',
      },
      // 支持 .local 域名
      {
        protocol: 'http',
        hostname: '*.local',
      }
    ]
  },
  async rewrites() {
    const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX;
      
    return [
      {
        source: `${apiPrefix}/:path*`,
        destination: 'http://localhost:12138/:path*'
      }
    ]
  }
};

export default nextConfig;
