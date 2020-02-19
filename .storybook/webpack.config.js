const webpack = require("webpack");
const path = require("path");

module.exports = {
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "../src/"),
			"@components": path.resolve(__dirname, "../src/components/")
		}
	},
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.ProvidePlugin({
			_: "lodash/lodash.min.js",
			moment: "moment"
		})
	]
};
