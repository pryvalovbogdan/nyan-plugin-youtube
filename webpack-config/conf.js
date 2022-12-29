const { resolve } = require('path');;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
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
					target: 'es2015',
					loader: 'tsx'
				},
				exclude: /node_modules/
			},
			{
				test: /\.(sass|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				],
			},
		],
	},
	resolve: {
		extensions: ['.json', '.ts', '.js', '.scss', '.scss'],
	},
	output: {
		filename: '[name].js',
		path: resolve(__dirname, '../dist'),
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'manifest.json',
				},
				{
					from: 'public',
				},
			]
		})
	]
};

module.exports = config;
