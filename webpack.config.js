/* eslint-disable no-var */
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/index.js'
  ],
  externals: [nodeExternals({
    modulesFromFile: true
  })],
  mode: 'production',
  optimization: {
    minimize: true
  },
  performance: {
    hints: false
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'lib'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { 
          loader: 'babel-loader', 
          options: { 
            plugins: ['transform-runtime'],
            presets: [
              'es2015',
              'react',
              'stage-0'
            ]
          } 
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?modules&importLoaders=1&localIdentName=draftJsIframelyPlugin__[local]__[hash:base64:5]!postcss-loader'
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('plugin.css')
  ]
};
