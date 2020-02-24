const webpack = require("webpack");
const path = require("path");

module.exports = {
	resolve: {
		alias: {
			"~story": path.resolve(__dirname, "../story/"),
			"@": path.resolve(__dirname, "../src/"),
			"@components": path.resolve(__dirname, "../src/components/"),
			"@sass": path.resolve(__dirname, "../src/sass/"),
			"@mixins": path.resolve(__dirname, "../src/mixins/"),
			"@directives": path.resolve(__dirname, "../src/directives/"),
			"@helpers": path.resolve(__dirname, "../src/helpers/")
		}
	},
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},

			{
				test: /\.(eot|ttf|woff|woff2|svg)$/,
				use: ["file-loader"]
			},
			{
				test: /\.vue$/,
				loader: "storybook-addon-vue-info/loader",
				enforce: "post"
			}
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.ProvidePlugin({
			_: "lodash/lodash.min.js",
			moment: "moment"
		})
	]
};
