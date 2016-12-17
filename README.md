# vue-hackernews-2.0

HackerNews 使用了 Vue 2.0 + vue-router + vuex 来构建服务端渲染。

<p align="center">
  <a href="https://vue-hn.now.sh" target="_blank">
    <img src="https://cloud.githubusercontent.com/assets/499550/17546273/5aabc5fc-5eaf-11e6-8d6a-ad00937e8bd6.png" width="700px">
    <br>
    Demo 演示
  </a>
</p>

> 注意：如果一段时间内没有人访问，这个demo可能会更新比较慢。
## 特色

- 服务端渲染
  - Vue + vue-router + vuex 一起工作
  - 服务端数据预存取
  - 客户端状态 & DOM 合成
- Vue单文件组件
  - 开发环境中热更新
  - 生产环境中 CSS 抽离
- 实时列表更新和翻转动画

## 结构描述

<img width="973" alt="screen shot 2016-08-11 at 6 06 57 pm" src="https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png">

## 开始构建

** Node.js 版本必须是 6+**

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
