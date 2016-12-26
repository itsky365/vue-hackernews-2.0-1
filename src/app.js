import Vue from 'vue'
// 页面结构 .vue 文件
import App from './App.vue'
// 状态管理，会自动加载 store 目录下的index.js
import store from './store'
import router from './router'
// 主要是把 vue-router 的状态放进 vuex 的 state 中，这样就可以通过改变 state 來进行路由的一些操作，
//当然直接使用像是 $route.go 之类的路由操作也会影响到 state ，这样就可以实现 state的动态改变了。
// 推荐阅读：https://github.com/vuejs/vuex-router-sync#how-does-it-work
import { sync } from 'vuex-router-sync'
import * as filters from './filters'

// sync the router with the vuex store.
// this registers `store.state.route`
// 同步路由到 vuex 的 store 中。
// 路由信息寄存在 store.state.route 中
sync(store, router)

// register global utility filters.
// 注册全局实用的过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
// 创建app实例
// 这里我们映射路由信息和状态信息到所有的子组件中
// 使它们可以在项目的任何地方通过 this.$router 和 this.$store 来访问 router 和 store 信息。
const app = new Vue({
  router,
  store,
  ...App
})

// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
// 利用 ES6 的模块机制抛出 app 实例、router 实例、store 实例
// 注意我们并没有在这里进行 app 实例的装载，因为引导方式是不同的
// 这取决于我们在浏览器还是在服务端渲染页面

export { app, router, store }
