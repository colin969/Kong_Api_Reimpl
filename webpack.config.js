const path = require('path');

const clientConfig = {
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
  optimization: {
    minimize: false
  }
};

const viewerConfig = {
  target: 'electron-renderer',
  entry: './src/server/viewer/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'viewer.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false
  }
};

module.exports = [clientConfig, viewerConfig];
