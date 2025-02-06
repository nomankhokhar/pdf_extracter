module.exports = {
  target: "serverless",
  future: { webpack5: true },
  webpack: (config: {
    resolve: {
      alias: {
        canvas: boolean;
        encoding: boolean;
      };
    };
  }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};
