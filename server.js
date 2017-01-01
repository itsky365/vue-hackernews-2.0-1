// 设置 VUE 的使用环境，通过 node 中的 process 模块来设置，类似于设置了一个全局变量
// 通过此设置可以针对 Vue 的不同使用场景做不同的操作，后面的代码中会涉及到。
process.env.VUE_ENV = 'server'

//判断当前 node 的开发环境（一般有develop，test，production，分别对应开发环境、测试环境、生产环境），
//可以通过 package.json 文件中 scripts 属性中的命令可以看出在运行 node 服务的时候
//通过 cross-env 插件来跨平台设置 NODE_ENV ，这样做的目的同样是为了根据不同的开发环境做出不同的操作。
const isProd = process.env.NODE_ENV === 'production'

// nodeJS 中基本的内置模块
const fs = require('fs')
const path = require('path')
// 基于 nodeJS 的框架
const express = require('express')

//用于请求根目录下的favicon.ico网站图标
//推荐阅读：http://blog.csdn.net/syyling/article/details/45740337
const favicon = require('serve-favicon')
//compression   为Gzip压缩功能模块
const compression = require('compression')
//序列化模块
const serialize = require('serialize-javascript')

//resolve方法： 将参数 file 字符利用 path 模块解析到一个绝对路径里。
const resolve = file => path.resolve(__dirname, file)

// 生成 express 实例
const app = express()

// 通过 webpack 的 html-webpack-plugin 插件根据已有模板（/src/index.template.html）
// 来生成 index.html 文件，该变量用来承载经过 parseIndex() 函数处理后的返回对象。
let indexHTML
// 通过 webpack 生成的服务器端的包（server-bundle.js）
// 该变量用来承载经过 createRenderer() 函数处理后的返回结果。
let renderer

if (isProd) {
  //在生产环境： 创建服务端渲染并且直接加载 webpack 打包出来的真实文件(相对应的 else 里面加载的是内存中的文件)
  renderer = createRenderer(fs.readFileSync(resolve('./dist/server-bundle.js'), 'utf-8'))
  indexHTML = parseIndex(fs.readFileSync(resolve('./dist/index.html'), 'utf-8'))
} else {
  // 在开发环境：开启开发环境下带有监听和热启动设置的服务，在文件的改变的时候更新渲染 index HTML文件。
  // 启动一个开发服务器
  require('./build/setup-dev-server')(app, {
    bundleUpdated: bundle => {
      renderer = createRenderer(bundle)
    },
    indexUpdated: index => {
      indexHTML = parseIndex(index)
    }
  })
}

// 服务端渲染函数
function createRenderer (bundle) {
  //服务端渲染vue，创建一个渲染容器
  //推荐阅读： https://vuefe.cn/v2/guide/ssr.html
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    //利用node 的 lru-cache 来缓存组件
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

// 将模板拆分成两部分，目的是服务端渲染时，使用bundleRenderer.rendererToStream 流式输出
function parseIndex (template) {
  const contentMarker = '<!-- APP -->'
  const i = template.indexOf(contentMarker)
  return {
    head: template.slice(0, i),
    tail: template.slice(i + contentMarker.length)
  }
}

// express 处理静态文件
const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

// express 中间件
app.use(compression({ threshold: 0 }))
app.use(favicon('./public/logo-48.png'))
app.use('/service-worker.js', serve('./dist/service-worker.js'))
app.use('/manifest.json', serve('./manifest.json'))
app.use('/dist', serve('./dist'))
app.use('/public', serve('./public'))

// 处理所有 get 请求，其实这里的目的是为了 Vue 服务端渲染用的，再具体说就是为了服务端渲染的
// 流式输出。推荐阅读：https://www.npmjs.com/package/vue-server-renderer#rendererrendertostreamvm
app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  // 设置相应头
  res.setHeader("Content-Type", "text/html");
  var s = Date.now()
  const context = { url: req.url }
  // 渲染我们的Vue实例作为流
  const renderStream = renderer.renderToStream(context)

  // 将预先的HTML写入响应（或者说第一部分）
  renderStream.once('data', () => {
    res.write(indexHTML.head)
  })

  // 每当新的块被渲染
  renderStream.on('data', chunk => {
    // 将块写入响应
    res.write(chunk)
  })

  // 当所有的块被渲染完成
  renderStream.on('end', () => {
    // embed initial store state
    // 嵌入初始 store 的状态
    if (context.initialState) {
      res.write(
        `<script>window.__INITIAL_STATE__=${
          serialize(context.initialState, { isJSON: true })
        }</script>`
      )
    }
    // 将第二部分 HTML写入响应
    res.end(indexHTML.tail)
    console.log(`whole request: ${Date.now() - s}ms`)
  })

  // 当渲染时发生错误的错误处理
  renderStream.on('error', err => {
    if (err && err.code === '404') {
      res.status(404).end('404 | Page Not Found')
      return
    }
    // Render Error Page or Redirect
    // 渲染错误页面或者重定向
    // 告诉客服端发生了错误
    res.status(500).end('Internal Error 500')
    // 打印错误到控制台
    console.error(`error during render : ${req.url}`)
    console.error(err)
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
