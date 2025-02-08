/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (
    config: {
      resolve: {
        alias: {
          canvas: boolean;
        };
      };
    },
    { isServer }: { isServer: boolean }
  ) => {
    if (!isServer) {
      config.resolve.alias.canvas = false;
    }
    return config;
  },
};

module.exports = nextConfig;
