const webpack = require("webpack");
const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
        "@components": path.resolve(__dirname, "src/components/"),
        "@store": path.resolve(__dirname, "src/store/"),
        "@assets": path.resolve(__dirname, "src/assets/"),
        "@sass": path.resolve(__dirname, "src/sass/"),
        "@helpers": path.resolve(__dirname, "src/helpers/"),
        "@mixins": path.resolve(__dirname, "src/mixins/"),
        "@directives": path.resolve(__dirname, "src/directives/")
      }
    },
    devServer: {
      disableHostCheck: true
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.ProvidePlugin({
        _: "lodash/lodash.min.js",
        moment: "moment"
      })
    ],
    optimization: {
      splitChunks: {
        chunks: "async",
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: "~",
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
  }
};
