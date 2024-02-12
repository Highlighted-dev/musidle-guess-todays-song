//@ts-check
const dotenv = require('dotenv');
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  transpilePackages: ['ui'],
  async rewrites() {
    return [
      {
        source: '/externalApi/:path*',
        destination: `${
          process.env.NODE_ENV == 'production'
            ? process.env.NEXT_PUBLIC_API_HOST ?? 'http://localhost:5000'
            : 'http://localhost:5000'
        }/externalApi/:path*`, // Proxy to Backend
      },
    ];
  }, //https://musidle.live/externalApi/images/concert.jpg
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'musidle.live',
        port: '',
        pathname: '/externalApi/images/**',
      },
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
        port: '',
        pathname: '/i/u/**',
      },
    ],
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
