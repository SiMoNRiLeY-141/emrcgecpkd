module.exports = {
    siteUrl: 'https://emrcgecpkd.vercel.app',
    generateRobotsTxt: true,
    exclude: ['/api/*', '/_next/*'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/_next/'],
        },
      ],
    },
  };
  