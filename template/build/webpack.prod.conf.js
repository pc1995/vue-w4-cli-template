'use strict'
const path = require('path')
const utils = require('./utils')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const config = require('../config')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: config.build.devtool,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  optimization: { // 代替了webpack3的 webpack.optimize.CommonsChunkPlugin
    minimizer: [
      new UglifyjsWebpackPlugin({ // 生产环境压缩JS
        cache: true, // 是否启用缓存
        parallel: true, // 多通道进程并发处理
        sourceMap: config.build.productionSourceMap, // 是否生成map文件用来调试 生产环境一般不需要
        uglifyOptions: {
          warnings: false,    //清除警告
          compress:{
            drop_debugger: true,	// 清除degugger
            drop_console: true   //清除所有的console信息
          }
        }
      }),
      new OptimizeCssAssetsPlugin() // 生产环境压缩css
    ],
    splitChunks: { // 用于拆分代码，找到chunk中共同依赖的模块进行提取和分支到单独的文件中，减少打包后的体积，可以避免内存溢出的问题
      chunks: 'all'
    }
  },
  performance: {
    hints: 'warning', // webpack的性能提示
    maxEntrypointSize: 5 * 1027 * 1024, // 设置入口文件的最大体积为5M （以字节为单位）
    maxAssetSize: 20 * 1024 * 1024, // 设置输出文件的最大体积为20M
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new CleanWebpackPlugin()
  ]
})
