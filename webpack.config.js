const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      process: require.resolve("process/browser"),
      buffer: require.resolve("buffer"),
      util: require.resolve("util"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
