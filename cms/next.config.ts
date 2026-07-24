import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  redirects: async () => [
    {
      source: '/',
      destination: '/admin',
      permanent: true,
    },
  ],
}

const config = withPayload(nextConfig, {
  devBundleServerPackages: false,
})

if (process.env.TURBOPACK || process.argv.includes('--turbopack')) {
  delete config.webpack
}

export default config