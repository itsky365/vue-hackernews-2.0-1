const webpack = require('webpack')
const base = require('./webpack.base.config')

module.exports = Object.assign({}, base, {
  target: 'node',
  devtool: false,
  entry: './src/server-entry.js',
  output: Object.assign({}, base.output, {
    filename: 'server-bundle.js',
    //推荐阅读： https://github.com/zhengweikeng/blog/issues/10
    // 打包的方式
    libraryTarget: 'commonjs2'
  }),
  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      'create-api': './create-api-server.js'
    })
  },
  //外部依赖，不需要打包进 server-bundle.js
  //推荐阅读： https://github.com/zhengweikeng/blog/issues/10
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    })
  ]
})
