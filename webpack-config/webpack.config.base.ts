import { resolve } from 'path';
import webpack from 'webpack';

import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

const config: webpack.Configuration = {
	entry: {
		content: './src/content/index.ts',
		background: './src/background',
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.(js|ts)?$/,
				loader: 'esbuild-loader',
				options: {
					target: 'es2015'
				},
				exclude: /node_modules/
			},
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			}
		],
	},
	resolve: {
		extensions: ['.json', '.ts', '.js', '.css'],
	},
	output: {
		filename: '[name].js',
		path: resolve(__dirname, '../dist'),
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'manifest.json',
				},
				{
					from: 'public',
				},
				{
					from: 'src/styles/content.css',
				},
			]
		})
	]
};

export default config;
