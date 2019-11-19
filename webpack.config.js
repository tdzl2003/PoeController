const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => ({
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  entry: {
    index: './src',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  resolveLoader: {
    extensions: ['.js'],
  },
  externals: function(context, request, callback) {
    // node target shouldn't try to resolve built-in packages,
    // and doesn't needs to pack with any dependencies
    if (!/^[.\/]/.test(request) && !path.isAbsolute(request)) {
      callback(null, 'commonjs ' + request);
      return;
    }
    callback();
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            target: 'esnext',
            module: 'esnext',
            esModuleInterop: true,
          },
          onlyCompileBundledFiles: true,
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          toplevel: true,
          compress: {
            unsafe: true,
            passes: 3,
          },
        },
      }),
    ],
  },
});
