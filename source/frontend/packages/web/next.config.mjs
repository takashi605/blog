/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  // msw が正しく動作しない問題への対応
  // 参考: https://github.com/mswjs/msw/issues/1801
  webpack: (config, { isServer }) => {
    if (isServer) {
      // サーバービルドの時は msw/browser を無視
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({
          name: 'msw/browser',
          alias: false,
        });
      } else {
        config.resolve.alias['msw/browser'] = false;
      }
    } else {
      // クライアントビルドの時は msw/node を無視
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: 'msw/node', alias: false });
      } else {
        config.resolve.alias['msw/node'] = false;
      }
    }
    return config;
  },
};

export default nextConfig;
