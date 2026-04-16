export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jfgkhseftiwquikjuhcv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'jfgkhseftiwquikjuhcv.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      {
        // Set cache headers for image files
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Set cache headers for other static files (e.g., JavaScript, CSS)
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate',
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
};
