// next.config.js
const withCSS = require('@zeit/next-css')
const webpack = require('webpack');

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(['API_URL']));

    return config;
  },
})
