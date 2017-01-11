const path = require('path')
//将 vue 的 webpack 配置单独抽离，配置起来更清晰。当然你也可以不抽离，随你的项目大小而定。
const vueConfig = require('./vue-loader.config')

module.exports = {
  devtool: '#source-map',
  entry: {
    app: './src/client-entry.js',
    // 抽离打包依赖
    vendor: [
      'es6-promise',
      'firebase/app',
      'firebase/database',
      'vue',
      'vue-router',
      'vuex',
      'vuex-router-sync'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  //resolve 用来配置文件路径的指向。
  //可以定义文件跟模块的默认路径及后缀等，节省 webpack 搜索文件的时间、优化引用模块时的体验。
  //常用的包括alias、extensions、root、modulesDirectories属性
  //可以参考 http://www.ferecord.com/webpack-summary.html#resolve
  resolve: {
    //alias：是个对象，把资源路径重定向到另一个路径
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  module: {
    // avoid webpack shimming process
    // 避免 webpack 解析
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules/,
        options: {
          objectAssign: 'Object.assign'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
}
