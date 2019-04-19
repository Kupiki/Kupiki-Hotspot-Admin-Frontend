const dotenv = require('dotenv').config();
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: '[name].fonts.css',
  allChunks: true
});
const extractSCSS = new ExtractTextPlugin({
  filename: '[name].styles.css',
  allChunks: true
});

const BUILD_DIR = path.resolve(__dirname, 'build');
const SRC_DIR = path.resolve(__dirname, 'src');
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const CLIENT_PROTOCOL = process.env.CLIENT_PROTOCOL || 'http';
const CLIENT_HOST = process.env.CLIENT_HOST || '127.0.0.1';
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

const METADATA = Object.assign({}, {
  host: CLIENT_HOST,
  port: CLIENT_PORT,
  ENV: ENV,
  PUBLIC: process.env.PUBLIC_DEV || CLIENT_HOST + ':' + CLIENT_PORT
});

// let ConfigModule = JSON.stringify(ENV === 'production' ? require('./config/config.prod.json') : require('./config/config.dev.json'));
// let ConfigModule = (ENV === 'production') ? require('./config/config.prod.json') : require('./config/config.dev.json');
let ConfigModule = require('./config/config.json');
const SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'http';
const SERVER_HOST = process.env.SERVER_HOST || '127.0.0.1';
const SERVER_PORT = process.env.SERVER_PORT || 4000;
ConfigModule = Object.assign(ConfigModule, {
  server_url: SERVER_PROTOCOL + '://' + SERVER_HOST,
  server_port: SERVER_PORT
});

module.exports = (env = {}) => {
  return {
    entry: {
      index: [SRC_DIR + '/index.js']
    },
    output: {
      path: BUILD_DIR,
      filename: '[name].bundle.js'
    },
    externals: {
      // 'Config': JSON.stringify(ENV === 'production' ? require('./config/config.prod.json') : require('./config/config.dev.json'))
      'Config': JSON.stringify(ConfigModule)
    },
    // watch: true,
    devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
    devServer: {
      contentBase: BUILD_DIR,
      port: METADATA.port,
      host: METADATA.host,
      public: METADATA.PUBLIC,
      compress: true,
      hot: true,
      open: true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['react', 'env']
            }
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.(scss)$/,
          use: ['css-hot-loader'].concat(extractSCSS.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {alias: {'../img': '../public/img'}}
              },
              {
                loader: 'sass-loader'
              }
            ]
          }))
        },
        {
          test: /\.css$/,
          use: extractCSS.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          use: [
            {
              // loader: 'url-loader'
              loader: 'file-loader',
              options: {
                name: './img/[name].[hash].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: './fonts/[name].[hash].[ext]'
          }
        }]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      // new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
      new webpack.NamedModulesPlugin(),
      extractCSS,
      extractSCSS,
      new HtmlWebpackPlugin(
        {
          inject: true,
          template: './public/index.html'
        }
      ),
      new CopyWebpackPlugin([
          {from: './public/img', to: 'img'}
        ],
        {copyUnmodified: false}
      ),
      new CopyWebpackPlugin([
          {from: './public/lang', to: 'lang'}
        ],
        {copyUnmodified: false}
      )
    ]
  }
};