const webpack = require('webpack')
const base = require('./webpack.base.config')
const vueConfig = require('./vue-loader.config')
const HTMLPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')//?????????

const config = Object.assign({}, base, {
  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      'create-api': './create-api-client.js'
    })
  },
  plugins: (base.plugins || []).concat([
    // strip comments in Vue code
    // 通过配置DefinePlugin，那么这里面的标识就相当于全局变量，你的业务代码可以直接使用配置的标识。
    // 其实这里通过 DefinePlugin 来指定生产环境后，以便在压缩时可以让 UglifyJS 自动删除代码块内的警告语句。
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    // 额外的 vendor 打包输入 配置，与base.config中 entry 的vendor是相对应的。
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // generate output HTML
    // 生成初始化一个 HTML
    new HTMLPlugin({
      template: 'src/index.template.html'
    })
  ])
})

if (process.env.NODE_ENV === 'production') {
  // Use ExtractTextPlugin to extract CSS into a single file
  // so it's applied on initial render.
  // vueConfig is already included in the config via LoaderOptionsPlugin
  // here we overwrite the loader config for <style lang="stylus">
  // so they are extracted.
  // 使用 ExtractTextPlugin 插件来实现抽离 CSS 为单独的文件
  // 这在初始化渲染的时候被使用。
  // vueConfig 中已经包含了一些配置，我们我现在在添加一些loaders的配置
  vueConfig.loaders = {
    stylus: ExtractTextPlugin.extract({
      loader: 'css-loader!stylus-loader',
      fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader 这是 vue-loader 深度定制版
    })
  }

  config.plugins.push(
    new ExtractTextPlugin('styles.[hash].css'),
    // this is needed in webpack 2 for minifying CSS
    // 在webapck2 中需要这样压缩css文件配置
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // minify JS
    // 压缩JS配置
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // 缓存生产环境下额外的项目依赖
    // 推荐阅读：https://www.npmjs.com/package/sw-precache-webpack-plugin
    // 还有 service Worker : https://www.w3ctech.com/topic/866
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  )
}

module.exports = config
