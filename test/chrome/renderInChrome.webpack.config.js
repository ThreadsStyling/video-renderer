const {join} = require('path');

module.exports = {
  entry: join(__dirname, 'renderInChrome.function.js'),
  target: 'web',
  output: {
    path: __dirname,
    filename: 'renderInChrome.bundle.js',
  },
  resolve: {
    extensions: ['.js', '.json'],
  }
};
