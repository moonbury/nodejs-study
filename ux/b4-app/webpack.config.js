'use strict';
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  //entry: './entry.js',
  entry: './app/index.ts',
  output: {
    filename: 'bundle.js',
    path: distDir,
  },
  devServer: {
    host: '0.0.0.0',   //use 0.0.0.0 for pixel book development.
    port: 60800,
    contentBase: distDir,
    disableHostCheck: true,
    proxy: {
      '/api': 'http://localhost:60702',
      '/es': {
        target: 'http://localhost:9200',
        pathRewrite: {'^/es': ''},
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Better Book Bundle Builder',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ],
  module: {
    rules: [{
      test: /\ts$/,
      loader: 'ts-loader',
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit:10000',
    }]
  }
};
