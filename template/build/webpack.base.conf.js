'use strict'

const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const config = require('../config')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HappyPack = require('happypack')
const os = require('os')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/main.js') // 入口文件
  },
  output: {
    path: config.build.assetsRoot, // 输出目录
    filename: '[name].[hash:7].js', // 产生的文件名,
    publicPath: process.env.NODE === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'], // 可忽略的文件类型的后缀
    alias: {
      vue$: 'vue/dist/vue.esm.js', // 路径重定向
      '@': resolve('src'),
      static: path.resolve(__dirname, '../static')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',

      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happyBabel',
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jep?g|gif|svg|svga)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css'
    }),
    new HappyPack({
      id: 'happyBabel',
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory=true']
    }),
    new webpack.ProgressPlugin(),
  ]
}
