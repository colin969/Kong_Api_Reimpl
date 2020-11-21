const path = require('path');

module.exports = {
  entry: './src/kongregate_api.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'kongregate_api.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'kongregateAPI',
    libraryTarget: 'var'
  },
};