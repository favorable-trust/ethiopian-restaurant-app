/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dvfnjfyhqwipmvfzoico.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/menu-images/**',
      },
    ],
  },
}

module.exports = nextConfig