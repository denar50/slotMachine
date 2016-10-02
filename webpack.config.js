var path = require('path')

module.exports = {
	entry: ['./app/app.js'],
	output: {
		filename: './dist/bundle.js'
	},
	module: {
		loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
    ]
  },
	jshint: {
		esversion: 6,
		asi: true
	},
  resolve: {
    extensions: ['.js', ''],
		alias: {
			services: path.resolve('./app/services'),
			classes: path.resolve('./app/classes'),
		}
  },
	postLoaders: [
		{
				test: /\.js$/, // include .js files
				exclude: /node_modules/, // exclude any and all files in the node_modules folder
				loader: "jshint-loader",
		}
	]
};
