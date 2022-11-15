import webpackMerge from 'webpack-merge';

import baseConfig from './webpack.config.base';

const env: string = process.env.NODE_ENV || "development";

const envConfig = require(`./webpack.config.${env}.ts`);

export default webpackMerge(baseConfig, envConfig.default)
