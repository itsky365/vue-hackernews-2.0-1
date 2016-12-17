module.exports = {
  // 是否保留文档中的空格
  preserveWhitespace: false,
  //通过 postcss 插件进行css文件的处理
  //推荐阅读：http://www.ibm.com/developerworks/cn/web/1604-postcss-css/
  postcss: [
    require('autoprefixer')({
      browsers: ['last 3 versions']
    })
  ]
}
