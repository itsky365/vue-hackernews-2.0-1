# vue-hackernews-2.0

HackerNews 克隆是基于 HN 的官方 firebase API 、Vue 2.0 、vue-router 和 vuex 来构建的，使用服务器端渲染。

<p align="center">
  <a href="https://vue-hn.now.sh" target="_blank">
    <img src="https://cloud.githubusercontent.com/assets/499550/17546273/5aabc5fc-5eaf-11e6-8d6a-ad00937e8bd6.png" width="700px">
    <br>
    Demo 演示
  </a>
</p>

> 注：如果在一段时间内没有人访问过该网站，则需要一些加载时间。
## 特色

- 服务端渲染
  - Vue + vue-router + vuex
  - 服务端数据预获取
  - 客户端状态 & DOM 合成
- Vue单文件组件
  - 开发环境中热更新
  - 生产环境中 CSS 抽离
- 使用 FLIP 动画进行实时列表更新

## 结构概述

<img width="973" alt="screen shot 2016-08-11 at 6 06 57 pm" src="https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png">

## 开始构建

** Node.js 版本必须是 6+ **

``` bash
# 安装依赖
npm install # 或者用 yarn

# 开发环境中启动服务，包含了热更新。服务启动在 localhost: 8080
npm run dev

# 为生产环境构建
npm run build

# 在生产环境中启动服务
npm start
```

## 说明
为了更好地学习 Vue 的服务端渲染，看完该官方实例后，对该实例做了部分注释，为了使自己更好地理解 Vue 的服务端渲染。

另外，如果你对 Vue 的服务端渲染感兴趣，并且对官方实例中的某些地方感到疑惑，希望你可以在该 fork 项目中找到一些启发。

想更好的学习 vue-server-renderer 的服务端渲染依赖包，可以看这里 http://chping.website/2017/01/01/vue-server-renderer/
