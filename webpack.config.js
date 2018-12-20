const createFileRule = require('@moped/rule-file');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {join} = require('path');

// serve some assets up separately to create cross domain
// issue
const {createServer} = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

const serve = serveStatic(__dirname + '/assets');
const server = createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    // 'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (['GET'].indexOf(req.method) !== -1) {
    Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key]);
    });
    serve(req, res, finalhandler(req, res));
    return;
  }
  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
});

server.listen(3001);

module.exports = {
  entry: join(__dirname, 'src', 'demo', 'alpha.ts'),
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
