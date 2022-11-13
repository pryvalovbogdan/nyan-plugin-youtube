const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		content: './content/contentScript.js',
		background: './background/background.ts'
	},
	mode: 'development',
	devtool: false,
	module: {
		rules: [
			{
				test: /\.(js|ts)?$/,
				loader: 'esbuild-loader',
				options: {
					loader: 'tsx',
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
		extensions: ['.json', '.ts', '.js'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../dist'),
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'manifest.json',
					to: 'manifest.json',
				},
				{
					from: 'assets',
					to: 'assets',
				},
			]
		})
	],
	optimization: {
		minimizer: [
			new ESBuildMinifyPlugin({
				target: 'es2015',
				css: true  // Apply minification to CSS assets
			})
		]
	},
};
