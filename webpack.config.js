const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReloadPlugin = require('reload-html-webpack-plugin'); // To watch for HTML changes 
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin'); // Increase speed

module.exports = {
  entry: './app/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    // watchContentBase: true,
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
        test: /\.scss$/,
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
      template: './app/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('styles.css'),
    new CopyWebpackPlugin([
      {from:'app/images',to:'images'} 
  ]), 
  // new ReloadPlugin(),
  new HardSourceWebpackPlugin(),
  ]
};