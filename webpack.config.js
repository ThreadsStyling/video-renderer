const createFileRule = require('@moped/rule-file');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: __dirname + '/src/browser/demo.image.ts',
  target: 'node',
  output: {
    path: __dirname + '/lib',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.tsx?$/,
            exclude: [/node_modules/],
            use: [{loader: 'ts-loader'}],
          },
          createFileRule(),
        ],
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [new HtmlWebpackPlugin()],
};
