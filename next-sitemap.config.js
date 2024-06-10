module.exports = {
    siteUrl: 'https://emrcgecpkd.vercel.app',
    generateRobotsTxt: true,
    exclude: ['/api/*'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/'],
        },
      ],
    },
  };
  