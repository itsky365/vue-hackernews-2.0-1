const path = require('path')
const webpack = require('webpack')
// 内存文件系统，它是用来操作内存中的文件的。此处是为了配合 webpack-dev-middleware 来时用的。
const MFS = require('memory-fs')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

module.exports = function setupDevServer (app, opts) {
  // modify client config to work with hot middleware
  // 热加载配置
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )

  // webpack编译器
  const clientCompiler = webpack(clientConfig);

  // dev middleware   开发服务中间件
  // express + webpack-dev-middleware 自定义实现 webpack-dev-server 服务功能
  //一个轻量的node.js express服务器
  // 一个运行于内存中的文件系统。
  // 推荐阅读：http://www.tuicool.com/articles/MruEni 的关于webpack-dev-middleware部分来了解它
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
  app.use(devMiddleware)
  clientCompiler.plugin('done', () => {
    // 读取 index.html 文件并进行解析，具体解析函数在 server.js 中的 parseIndex()
    const fs = devMiddleware.fileSystem
    const filePath = path.join(clientConfig.output.path, 'index.html')
    if (fs.existsSync(filePath)) {
      const index = fs.readFileSync(filePath, 'utf-8')
      opts.indexUpdated(index)
    }
  })

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler))

  // watch and update server renderer
  // 监听和更新服务端渲染
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename)
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    //服务端渲染 具体实现函数在 server.js 中的createRenderer
    //从内存中获取出 server-bundle.js 文件
    opts.bundleUpdated(mfs.readFileSync(outputPath, 'utf-8'))
  })
}
