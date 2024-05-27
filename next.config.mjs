// next.config.mjs

export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tptqglihfsppnrrtukvw.supabase.co',
        pathname: '/storage/v1/object/sign/images/**',
      },
      {
        protocol: 'https',
        hostname: 'tptqglihfsppnrrtukvw.supabase.co',
        pathname: '/storage/v1/object/sign/assets/logos/**',
      }
    ],
  },
};
