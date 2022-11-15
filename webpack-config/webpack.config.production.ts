import * as webpack from 'webpack';

import baseConfig from './webpack.config.base';
import { source } from '../package.json';

import { ESBuildMinifyPlugin } from 'esbuild-loader';
const ZipPlugin = require('zip-webpack-plugin');

const config = {
  ...baseConfig,
  mode: 'production',
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true  // Apply minification to CSS assets
      })
    ]
  },
};

config.plugins = (baseConfig.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }),
]);

if (process.env.ZIP === 'true') {
  config.plugins = (baseConfig.plugins || []).concat([
    new ZipPlugin({
      path: '../',
      filename: source.js + '.zip',
    }),
  ]);
}

export default config;
