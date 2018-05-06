const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReloadPlugin = require('reload-html-webpack-plugin'); // To watch for HTML changes 
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin'); // Increase speed
const AutoDllPlugin = require('autodll-webpack-plugin'); // Increase speed and bundle js

module.exports = {
  entry: './app/script/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    // watchContentBase: true, // Optional if reload when changing index.html is required, but always reloads the whole page #1/2
    port: 3500,
    hot: true,
  },

  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(scss|sass|css)$/,
        exclude: /node_modules/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        })),
      },
      { // File Loader Data
        test: /\.(csv|json|tsv)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'data/[name].[ext]?[sha512:hash:base64:7]',
            context: ''
          }
        }]
      },
      { // File Loader Images
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'images/[name]-[sha512:hash:base64:7].[ext]',
            context: ''
          }
        }]
      }
    ]
  },

  plugins: [
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: './app/index.html'
    }),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundles to index.html
      filename: '[name]_[hash].js',
      entry: {
        vendor: [
          'jquery',
          'd3',
          'topojson',
        ]
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('styles.css'),
    new CopyWebpackPlugin([
      {from:'app/images',to:'images'} 
  ]), 
  // new ReloadPlugin(),// Optional if reload when changing index.html is required, but always reloads the whole page #2/2
  new HardSourceWebpackPlugin(),
  ]
};