export default {
  images: {
    // Add smaller breakpoints so Next can serve tighter image sizes for member cards.
    deviceSizes: [180, 256, 384, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 180, 232, 256, 384, 512],
    qualities: [65, 68, 75],
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
    const baseHeaders = [
      {
        source: '/',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];

    const imageCacheHeader = {
      // Set cache headers for optimized image responses in production only.
      source: '/_next/image(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    };

    const staticCacheHeader = {
      // Set cache headers for other static files (e.g., JavaScript, CSS) in production only.
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, must-revalidate',
        },
      ],
    };

    if (process.env.NODE_ENV === 'production') {
      return [...baseHeaders, imageCacheHeader, staticCacheHeader];
    }

    return baseHeaders;
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
};
