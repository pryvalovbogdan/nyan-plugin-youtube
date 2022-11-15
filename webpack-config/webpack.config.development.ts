import path from 'path';
import * as webpack from 'webpack';

const ZipPlugin = require('zip-webpack-plugin');

import { source } from '../package.json';
import baseConfig from './webpack.config.base';

function getEntry(baseConfig: any) {
  return Object.fromEntries(Object.entries(baseConfig)
    .map(([key, value]: [key: string , value: string]) =>
      [key, [path.join(__dirname, '../', value), `mv3-hot-reload/${value}`]])
  );
}

const config  = {
  ...baseConfig,
  mode: 'development',
};

config.plugins = (baseConfig.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"',
    },
  }),
]);

if (process.env.HMR === 'true') {
  config.entry = {
    ...getEntry(baseConfig.entry),
  };
}

if (process.env.ZIP === 'true') {
  config.plugins = (baseConfig.plugins || []).concat([
    new ZipPlugin({
      path: '../',
      filename: source.js + '.zip',
    }),
  ]);
}

export default config;
