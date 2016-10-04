var path = require('path')
/*eslint-disable */
'use strict';

module.exports = {
	entry: ['mocha!./tests/index.js'],
	output: {
		path: path.resolve(__dirname, 'tests'),
		filename: 'testBundle.js',
		publicPath: '/tests/'
	},

	module: {
		loaders: [
			{
        test: /\.js$/,
				exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
		],
		noParse: [
			/node_modules\/sinon\//
		]
	},

	resolve: {
		extensions: ['.js', ''],
		alias: {
			'sinon': 'sinon/pkg/sinon',
			services: path.resolve('./app/services'),
			classes: path.resolve('./app/classes'),
		}
	},

	devServer: {
	  host: 'localhost',
	  port: '8081'
	}
};
/*eslint-enable */
